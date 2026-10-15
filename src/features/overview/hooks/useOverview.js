import { useState, useEffect, useCallback, useMemo } from "react";
import { mockStore } from "../../../mocks/mockStore";
import { recruiterService } from "../../recruiters/services/recruiterService";
import { getPlatformOverviewData } from "../data/overviewData";
import { useToast } from "../../../hooks/useToast";

/**
 * useOverview Hook
 * Reactive state and period calculations for the Platform Overview module.
 */
export function useOverview() {
  const [period, setPeriod] = useState("30d"); // "7d" | "30d" | "90d" | "ytd"
  const [storeRevision, setStoreRevision] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { addToast } = useToast();

  // Re-compute on store or recruiter changes
  useEffect(() => {
    const unsubStore = mockStore.subscribe(() => {
      setStoreRevision((prev) => prev + 1);
    });
    const unsubRecruiters = recruiterService.subscribe(() => {
      setStoreRevision((prev) => prev + 1);
    });
    return () => {
      unsubStore();
      unsubRecruiters();
    };
  }, []);

  const overviewData = useMemo(() => {
    return getPlatformOverviewData(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, storeRevision]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    addToast("Refreshing platform overview metrics...", "info");
    await new Promise((r) => setTimeout(r, 600));
    setStoreRevision((prev) => prev + 1);
    setIsRefreshing(false);
    addToast("Platform overview updated.", "success");
  }, [addToast]);

  const handleExportReport = useCallback(() => {
    try {
      const data = overviewData;
      const headers = [
        "Metric",
        "Value",
        "Context",
        "Period",
      ];
      const rows = [
        ["AI Cost", `$${data.kpis.aiCost.value}`, "Model Token Compute Spend", data.periodLabel],
        ["Total Tokens", `${data.kpis.aiCost.tokens.toLocaleString()}`, "Tokens Processed", data.periodLabel],
        ["Jobs Fetched", `${data.kpis.jobsFetched.value}`, "Aggregated Across 5 Sources", data.periodLabel],
        ["New Candidates", `${data.kpis.newCandidates.value}`, "Registrations in Window", data.periodLabel],
        ["Total Students", `${data.kpis.totalStudents.value}`, "Active Student Cohort (Lifetime)", "All Time"],
        ["Total Recruiters", `${data.kpis.totalRecruiters.value}`, "Internal Headcount", "Current"],
        ["Newly Joined Employees", `${data.kpis.newlyJoinedEmployees.value}`, data.kpis.newlyJoinedEmployees.names.join("; ") || "None", data.periodLabel],
        ["Average Placement Rate", `${data.keyNumbers.avgPlacementRate}%`, "Global Average", "30d"],
        ["Average Time To Hire", `${data.keyNumbers.avgTimeToHireDays} days`, "Platform Velocity", "30d"],
      ];

      const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `aifa-platform-overview-${period}-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast("Platform overview report exported successfully.", "success");
    } catch {
      addToast("Failed to export overview report.", "error");
    }
  }, [overviewData, period, addToast]);

  return {
    period,
    setPeriod,
    overviewData,
    isRefreshing,
    handleRefresh,
    handleExportReport,
  };
}
