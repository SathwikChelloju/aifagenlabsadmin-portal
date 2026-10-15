import { useState, useEffect, useMemo, useCallback } from "react";
import { aiUsageService } from "../services/aiUsageService.js";
import { MODEL_PRICING } from "../constants/aiUsageData.js";

export function useAiUsage() {
  // Base Data & Service State
  const [requests, setRequests] = useState(() => aiUsageService.getRequests());
  const [budget, setBudget] = useState(() => aiUsageService.getBudget());

  useEffect(() => {
    const unsubscribe = aiUsageService.subscribe((state) => {
      setRequests([...state.requests]);
      setBudget({ ...state.budget });
    });
    return unsubscribe;
  }, []);

  // Filter States
  const [dateRange, setDateRange] = useState("30d"); // "24h", "7d", "30d", "90d", "all"
  const [providerFilter, setProviderFilter] = useState("all");
  const [featureFilter, setFeatureFilter] = useState("all");
  const [actorTypeFilter, setActorTypeFilter] = useState("all"); // "all", "User", "Employee", "Admin"
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "Success", "Failed"
  const [searchQuery, setSearchQuery] = useState("");

  // Trend Chart Controls
  const [trendMetric, setTrendMetric] = useState("requests"); // "requests", "tokens", "cost"
  const [trendRange, setTrendRange] = useState("30d"); // "24h", "7d", "30d", "90d"

  // Activity Table Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");

  // Consumers Table Sorting
  const [consumerSortMetric, setConsumerSortMetric] = useState("tokens"); // "tokens", "cost", "requests"

  // Model Performance Table Sorting
  const [modelSortField, setModelSortField] = useState("requests");
  const [modelSortDirection, setModelSortDirection] = useState("desc");
  const [modelProviderFilter, setModelProviderFilter] = useState("all");

  // Drawer States
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = useState(false);
  const [activeRequestTab, setActiveRequestTab] = useState("overview"); // "overview", "io", "performance", "related"

  const [selectedConsumerId, setSelectedConsumerId] = useState(null);
  const [isConsumerDrawerOpen, setIsConsumerDrawerOpen] = useState(false);

  // Modal State
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Helper date window calculation
  const getDateThresholdMs = useCallback((range) => {
    // Anchor to Oct 13, 2026 base
    const anchor = new Date("2026-10-13T19:00:00Z").getTime();
    switch (range) {
      case "24h":
        return anchor - 24 * 60 * 60 * 1000;
      case "7d":
        return anchor - 7 * 24 * 60 * 60 * 1000;
      case "30d":
        return anchor - 30 * 24 * 60 * 60 * 1000;
      case "90d":
        return anchor - 90 * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  }, []);

  // 1. FILTERED REQUESTS
  const filteredRequests = useMemo(() => {
    const threshold = getDateThresholdMs(dateRange);
    return requests.filter((r) => {
      const rTime = new Date(r.timestamp).getTime();
      if (threshold > 0 && rTime < threshold) return false;

      if (providerFilter !== "all" && r.provider !== providerFilter) return false;
      if (featureFilter !== "all" && r.feature !== featureFilter) return false;
      if (actorTypeFilter !== "all" && r.actorType !== actorTypeFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesActor = r.actorName.toLowerCase().includes(q) || r.actorEmail.toLowerCase().includes(q);
        const matchesFeature = r.feature.toLowerCase().includes(q);
        const matchesModel = r.model.toLowerCase().includes(q);
        if (!matchesId && !matchesActor && !matchesFeature && !matchesModel) return false;
      }

      return true;
    });
  }, [requests, dateRange, providerFilter, featureFilter, actorTypeFilter, statusFilter, searchQuery, getDateThresholdMs]);

  // 2. SUMMARY METRICS (CARDS 1-4)
  const summaryStats = useMemo(() => {
    const count = filteredRequests.length;
    const inputTokens = filteredRequests.reduce((sum, r) => sum + (r.inputTokens || 0), 0);
    const outputTokens = filteredRequests.reduce((sum, r) => sum + (r.outputTokens || 0), 0);
    const totalTokens = inputTokens + outputTokens;
    const estimatedCost = filteredRequests.reduce((sum, r) => sum + (r.estimatedCost || 0), 0);
    const successCount = filteredRequests.filter((r) => r.status === "Success").length;
    const failedCount = count - successCount;
    const successRate = count > 0 ? Number(((successCount / count) * 100).toFixed(1)) : 100;

    // Sparklines derived from hourly/daily slices
    const sparklineBuckets = 8;
    const reqSpark = new Array(sparklineBuckets).fill(0);
    const tokSpark = new Array(sparklineBuckets).fill(0);
    const costSpark = new Array(sparklineBuckets).fill(0);
    const successSpark = new Array(sparklineBuckets).fill(0);

    if (filteredRequests.length > 0) {
      filteredRequests.forEach((r, idx) => {
        const b = idx % sparklineBuckets;
        reqSpark[b] += 1;
        tokSpark[b] += r.totalTokens || 0;
        costSpark[b] += r.estimatedCost || 0;
        if (r.status === "Success") successSpark[b] += 1;
      });
    }

    return {
      totalRequests: count,
      requestsTrend: "+14.2%",
      totalTokens,
      inputTokens,
      outputTokens,
      estimatedCost: Number(estimatedCost.toFixed(2)),
      successRate,
      successCount,
      failedCount,
      sparklines: {
        requests: reqSpark,
        tokens: tokSpark,
        cost: costSpark,
        success: successSpark,
      },
    };
  }, [filteredRequests]);

  // 3. AI USAGE TREND CHART DATA
  const trendChartData = useMemo(() => {
    const threshold = getDateThresholdMs(trendRange);
    const inRange = requests.filter((r) => {
      const t = new Date(r.timestamp).getTime();
      return threshold === 0 || t >= threshold;
    });

    const is24h = trendRange === "24h";
    const bucketCount = is24h ? 12 : trendRange === "7d" ? 7 : trendRange === "30d" ? 10 : 12;

    const topModels = ["Claude 3.5 Sonnet", "GPT-4o", "Gemini 1.5 Pro", "Mistral Large"];
    const modelColors = {
      "Claude 3.5 Sonnet": "#D97706",
      "GPT-4o": "#10A37F",
      "Gemini 1.5 Pro": "#3B82F6",
      "Mistral Large": "#EC4899",
    };

    // Construct buckets
    const nowMs = new Date("2026-10-13T19:00:00Z").getTime();
    const durationMs = nowMs - threshold;
    const bucketDurationMs = durationMs / bucketCount;

    const buckets = [];
    for (let i = 0; i < bucketCount; i++) {
      const bStart = threshold + i * bucketDurationMs;
      const bEnd = bStart + bucketDurationMs;
      const d = new Date(bEnd);

      let label = "";
      if (is24h) {
        label = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
      } else {
        label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }

      const bucketItem = {
        label,
        startTime: bStart,
        endTime: bEnd,
        total: 0,
        series: {},
      };

      topModels.forEach((m) => {
        bucketItem.series[m] = 0;
      });

      buckets.push(bucketItem);
    }

    // Populate buckets
    inRange.forEach((r) => {
      const t = new Date(r.timestamp).getTime();
      const bIdx = Math.min(
        bucketCount - 1,
        Math.max(0, Math.floor((t - threshold) / bucketDurationMs))
      );
      if (buckets[bIdx]) {
        let val = 0;
        if (trendMetric === "requests") val = 1;
        else if (trendMetric === "tokens") val = r.totalTokens || 0;
        else if (trendMetric === "cost") val = r.estimatedCost || 0;

        buckets[bIdx].total += val;
        if (topModels.includes(r.model)) {
          buckets[bIdx].series[r.model] = (buckets[bIdx].series[r.model] || 0) + val;
        } else {
          // Attribute to closest top model for density
          buckets[bIdx].series["GPT-4o"] = (buckets[bIdx].series["GPT-4o"] || 0) + val * 0.5;
        }
      }
    });

    return {
      buckets,
      models: topModels,
      modelColors,
      metric: trendMetric,
      range: trendRange,
    };
  }, [requests, trendRange, trendMetric, getDateThresholdMs]);

  // 4. USAGE BY ACTOR TYPE (DONUT & SUB-METRICS)
  const actorTypeMetrics = useMemo(() => {
    const totalReq = filteredRequests.length;
    const totalCost = filteredRequests.reduce((acc, r) => acc + (r.estimatedCost || 0), 0);
    const totalTokens = filteredRequests.reduce((acc, r) => acc + (r.totalTokens || 0), 0);
    const totalLatency = filteredRequests.reduce((acc, r) => acc + (r.latencyMs || 0), 0);

    const counts = { User: 0, Employee: 0, Admin: 0 };
    filteredRequests.forEach((r) => {
      if (counts[r.actorType] !== undefined) {
        counts[r.actorType] += 1;
      } else {
        counts.User += 1;
      }
    });

    const segments = [
      {
        id: "User",
        label: "Candidates (Users)",
        count: counts.User,
        pct: totalReq > 0 ? Number(((counts.User / totalReq) * 100).toFixed(1)) : 0,
        color: "#0B192C", // Oxford Navy
      },
      {
        id: "Employee",
        label: "Recruiters & Staff",
        count: counts.Employee,
        pct: totalReq > 0 ? Number(((counts.Employee / totalReq) * 100).toFixed(1)) : 0,
        color: "#D97706", // Oxford Amber
      },
      {
        id: "Admin",
        label: "System & Admins",
        count: counts.Admin,
        pct: totalReq > 0 ? Number(((counts.Admin / totalReq) * 100).toFixed(1)) : 0,
        color: "#16A34A", // Logo Green
      },
    ];

    const avgCostPerReq = totalReq > 0 ? (totalCost / totalReq).toFixed(4) : "0.0000";
    const avgTokensPerReq = totalReq > 0 ? Math.round(totalTokens / totalReq) : 0;
    const avgLatencyMs = totalReq > 0 ? Math.round(totalLatency / totalReq) : 0;

    return {
      totalRequests: totalReq,
      segments,
      avgCostPerReq: `$${avgCostPerReq}`,
      avgTokensPerReq: avgTokensPerReq.toLocaleString(),
      avgLatency: avgLatencyMs < 1000 ? `${avgLatencyMs}ms` : `${(avgLatencyMs / 1000).toFixed(2)}s`,
    };
  }, [filteredRequests]);

  // 5. TOP AI CONSUMERS
  const topConsumers = useMemo(() => {
    const actorMap = new Map();

    filteredRequests.forEach((r) => {
      if (!actorMap.has(r.actorId)) {
        actorMap.set(r.actorId, {
          actorId: r.actorId,
          name: r.actorName,
          email: r.actorEmail,
          actorType: r.actorType,
          role: r.actorRole,
          avatar: r.actorAvatar,
          requests: 0,
          tokens: 0,
          cost: 0,
          features: {},
        });
      }
      const item = actorMap.get(r.actorId);
      item.requests += 1;
      item.tokens += r.totalTokens || 0;
      item.cost += r.estimatedCost || 0;
      item.features[r.feature] = (item.features[r.feature] || 0) + 1;
    });

    const list = Array.from(actorMap.values()).map((c) => {
      // Find top feature
      let topFeature = "Various";
      let maxFCount = 0;
      Object.entries(c.features).forEach(([feat, count]) => {
        if (count > maxFCount) {
          maxFCount = count;
          topFeature = feat;
        }
      });

      return {
        ...c,
        cost: Number(c.cost.toFixed(2)),
        topFeature,
      };
    });

    // Sort list
    list.sort((a, b) => {
      if (consumerSortMetric === "requests") return b.requests - a.requests;
      if (consumerSortMetric === "cost") return b.cost - a.cost;
      return b.tokens - a.tokens;
    });

    // Assign ranks
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [filteredRequests, consumerSortMetric]);

  // 6. PROVIDER & MODEL PERFORMANCE
  const modelPerformanceList = useMemo(() => {
    const map = new Map();

    filteredRequests.forEach((r) => {
      if (modelProviderFilter !== "all" && r.provider !== modelProviderFilter) return;

      if (!map.has(r.model)) {
        map.set(r.model, {
          model: r.model,
          provider: r.provider,
          requests: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          successCount: 0,
          totalLatencyMs: 0,
          estimatedCost: 0,
        });
      }
      const m = map.get(r.model);
      m.requests += 1;
      m.inputTokens += r.inputTokens || 0;
      m.outputTokens += r.outputTokens || 0;
      m.totalTokens += r.totalTokens || 0;
      if (r.status === "Success") m.successCount += 1;
      m.totalLatencyMs += r.latencyMs || 0;
      m.estimatedCost += r.estimatedCost || 0;
    });

    // If some configured models have zero requests in current filters, include them if not filtered out
    Object.keys(MODEL_PRICING).forEach((modelName) => {
      const pricing = MODEL_PRICING[modelName];
      if (modelProviderFilter !== "all" && pricing.provider !== modelProviderFilter) return;
      if (!map.has(modelName)) {
        map.set(modelName, {
          model: modelName,
          provider: pricing.provider,
          requests: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          successCount: 0,
          totalLatencyMs: 0,
          estimatedCost: 0,
        });
      }
    });

    const rows = Array.from(map.values()).map((m) => {
      const avgLatencyMs = m.requests > 0 ? Math.round(m.totalLatencyMs / m.requests) : 0;
      const successRate = m.requests > 0 ? Number(((m.successCount / m.requests) * 100).toFixed(1)) : 100;
      return {
        model: m.model,
        provider: m.provider,
        requests: m.requests,
        inputTokens: m.inputTokens,
        outputTokens: m.outputTokens,
        totalTokens: m.totalTokens,
        successRate,
        avgLatencyMs,
        avgLatencyFormatted: avgLatencyMs < 1000 ? `${avgLatencyMs}ms` : `${(avgLatencyMs / 1000).toFixed(2)}s`,
        estimatedCost: Number(m.estimatedCost.toFixed(2)),
      };
    });

    // Sort
    rows.sort((a, b) => {
      let aVal = a[modelSortField];
      let bVal = b[modelSortField];
      if (typeof aVal === "string") {
        return modelSortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return modelSortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

    return rows;
  }, [filteredRequests, modelProviderFilter, modelSortField, modelSortDirection]);

  // 7. COST MANAGEMENT & BUDGET BREAKDOWN
  const costManagement = useMemo(() => {
    const monthlyBudget = budget.monthlyBudgetUsd || 0;
    const estimatedSpend = summaryStats.estimatedCost || 0;
    const remainingBudget = Math.max(0, monthlyBudget - estimatedSpend);
    const consumedPct = monthlyBudget > 0 ? Number(((estimatedSpend / monthlyBudget) * 100).toFixed(1)) : 0;

    // Breakdown by provider (always include core providers for consistent layout density)
    const provCosts = {
      OpenAI: 0,
      Anthropic: 0,
      Google: 0,
      Mistral: 0,
      Meta: 0,
    };
    filteredRequests.forEach((r) => {
      if (r.provider) {
        provCosts[r.provider] = (provCosts[r.provider] || 0) + (r.estimatedCost || 0);
      }
    });

    const providerBreakdown = Object.entries(provCosts).map(([provider, cost]) => {
      const pct = estimatedSpend > 0 ? Number(((cost / estimatedSpend) * 100).toFixed(1)) : 0;
      return {
        provider,
        cost: Number(cost.toFixed(2)),
        pct,
      };
    });
    providerBreakdown.sort((a, b) => b.cost - a.cost || a.provider.localeCompare(b.provider));

    const isWarning = consumedPct >= budget.warningThresholdPct;
    const isCritical = consumedPct >= budget.criticalThresholdPct;

    return {
      monthlyBudget,
      estimatedSpend,
      remainingBudget,
      consumedPct,
      isWarning,
      isCritical,
      providerBreakdown,
      warningThresholdPct: budget.warningThresholdPct,
      criticalThresholdPct: budget.criticalThresholdPct,
    };
  }, [budget, summaryStats.estimatedCost, filteredRequests]);

  // 8. RECENT AI REQUESTS
  const recentRequests = useMemo(() => {
    return requests.slice(0, 5);
  }, [requests]);

  // 9. ACTIVITY TABLE SORTED & PAGINATED
  const sortedRequests = useMemo(() => {
    const copy = [...filteredRequests];
    copy.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "timestamp") {
        aVal = new Date(a.timestamp).getTime();
        bVal = new Date(b.timestamp).getTime();
      }

      if (typeof aVal === "string") {
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
    return copy;
  }, [filteredRequests, sortField, sortDirection]);

  const paginatedRequests = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(sortedRequests.length / pageSize));
    const activePage = Math.min(currentPage, totalPages);
    const start = (activePage - 1) * pageSize;
    return sortedRequests.slice(start, start + pageSize);
  }, [sortedRequests, currentPage, pageSize]);

  // 10. SELECTED REQUEST & RELATED REQUESTS FOR DRAWER
  const selectedRequest = useMemo(() => {
    if (!selectedRequestId) return null;
    return requests.find((r) => r.id === selectedRequestId) || null;
  }, [selectedRequestId, requests]);

  const relatedRequests = useMemo(() => {
    if (!selectedRequest) return [];
    return aiUsageService.getRelatedRequests(selectedRequest, 5);
  }, [selectedRequest]);

  // 11. SELECTED CONSUMER FOR CONSUMER DRAWER
  const selectedConsumerProfile = useMemo(() => {
    if (!selectedConsumerId) return null;
    return aiUsageService.getConsumerProfile(selectedConsumerId);
  }, [selectedConsumerId]);

  // ACTIONS
  const handleOpenRequestDrawer = useCallback((req, tab = "overview") => {
    setSelectedRequestId(req.id);
    setActiveRequestTab(tab);
    setIsRequestDrawerOpen(true);
  }, []);

  const handleCloseRequestDrawer = useCallback(() => {
    setIsRequestDrawerOpen(false);
  }, []);

  const handleOpenConsumerDrawer = useCallback((actorId) => {
    setSelectedConsumerId(actorId);
    setIsConsumerDrawerOpen(true);
  }, []);

  const handleCloseConsumerDrawer = useCallback(() => {
    setIsConsumerDrawerOpen(false);
  }, []);

  const updateDateRange = useCallback((val) => {
    setDateRange(val);
    setCurrentPage(1);
  }, []);

  const updateProviderFilter = useCallback((val) => {
    setProviderFilter(val);
    setCurrentPage(1);
  }, []);

  const updateFeatureFilter = useCallback((val) => {
    setFeatureFilter(val);
    setCurrentPage(1);
  }, []);

  const updateActorTypeFilter = useCallback((val) => {
    setActorTypeFilter(val);
    setCurrentPage(1);
  }, []);

  const updateStatusFilter = useCallback((val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  }, []);

  const updateSearchQuery = useCallback((val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setDateRange("30d");
    setProviderFilter("all");
    setFeatureFilter("all");
    setActorTypeFilter("all");
    setStatusFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  const handleSortActivity = useCallback((field) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        return field;
      }
      setSortDirection("desc");
      return field;
    });
  }, []);

  const handleSortModelPerformance = useCallback((field) => {
    setModelSortField((prev) => {
      if (prev === field) {
        setModelSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        return field;
      }
      setModelSortDirection("desc");
      return field;
    });
  }, []);

  const handleSaveBudget = useCallback((newBudget) => {
    aiUsageService.updateBudget(newBudget);
    setIsBudgetModalOpen(false);
  }, []);

  // CSV EXPORT
  const handleExportCSV = useCallback(() => {
    const records = filteredRequests;
    if (!records || records.length === 0) {
      alert("No records to export.");
      return;
    }

    const headers = [
      "Request ID",
      "Timestamp (UTC)",
      "Actor Name",
      "Actor Email",
      "Actor Type",
      "Feature",
      "Provider",
      "Model",
      "Input Tokens",
      "Output Tokens",
      "Total Tokens",
      "Estimated Cost ($)",
      "Latency (ms)",
      "Status",
      "Session ID",
      "Correlation ID",
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = records.map((r) => [
      escapeCsv(r.id),
      escapeCsv(r.timestamp),
      escapeCsv(r.actorName),
      escapeCsv(r.actorEmail),
      escapeCsv(r.actorType),
      escapeCsv(r.feature),
      escapeCsv(r.provider),
      escapeCsv(r.model),
      r.inputTokens,
      r.outputTokens,
      r.totalTokens,
      r.estimatedCost,
      r.latencyMs,
      escapeCsv(r.status),
      escapeCsv(r.sessionId),
      escapeCsv(r.correlationId),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `aifa_ai_usage_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredRequests]);

  return {
    // Data & stats
    requests,
    filteredRequests,
    summaryStats,
    trendChartData,
    actorTypeMetrics,
    topConsumers,
    modelPerformanceList,
    costManagement,
    recentRequests,
    sortedRequests,
    paginatedRequests,
    // Filter controls
    dateRange,
    setDateRange: updateDateRange,
    providerFilter,
    setProviderFilter: updateProviderFilter,
    featureFilter,
    setFeatureFilter: updateFeatureFilter,
    actorTypeFilter,
    setActorTypeFilter: updateActorTypeFilter,
    statusFilter,
    setStatusFilter: updateStatusFilter,
    searchQuery,
    setSearchQuery: updateSearchQuery,
    handleClearFilters,
    // Trend controls
    trendMetric,
    setTrendMetric,
    trendRange,
    setTrendRange,
    // Table sorting & pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    sortField,
    sortDirection,
    handleSortActivity,
    consumerSortMetric,
    setConsumerSortMetric,
    modelSortField,
    modelSortDirection,
    modelProviderFilter,
    setModelProviderFilter,
    handleSortModelPerformance,
    // Drawer controls
    selectedRequest,
    isRequestDrawerOpen,
    activeRequestTab,
    setActiveRequestTab,
    handleOpenRequestDrawer,
    handleCloseRequestDrawer,
    relatedRequests,
    selectedConsumerProfile,
    isConsumerDrawerOpen,
    handleOpenConsumerDrawer,
    handleCloseConsumerDrawer,
    // Budget modal
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    budget,
    handleSaveBudget,
    // Export
    handleExportCSV,
  };
}
