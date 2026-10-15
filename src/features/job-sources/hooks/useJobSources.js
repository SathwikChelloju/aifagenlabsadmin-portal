import { useState, useEffect, useMemo, useCallback } from "react";
import { mockStore } from "../../../mocks/mockStore";
import {
  createJobSource,
  updateJobSource,
  deleteJobSource,
  toggleJobSourceStatus,
  syncJobSource,
  syncAllJobSources,
  resolveDuplicateJob,
} from "../services/jobSourcesApi";
import { exportJobSourcesToCSV } from "../utils/jobSourceUtils";
import { useToast } from "../../../context/ToastContext";

/**
 * useJobSources Hook
 * Manages reactive source state, telemetry, duplicate resolution,
 * filtering, sorting, pagination, inspection drawer, and synchronization triggers.
 */
export function useJobSources() {
  const { addToast } = useToast();

  const [sources, setSources] = useState(() => mockStore.getAllJobSources());
  const [syncHistory, setSyncHistory] = useState(() => mockStore.getAllSyncHistory());
  const [duplicateJobs, setDuplicateJobs] = useState(() => mockStore.getAllDuplicateJobs());
  const [timeSeriesData, setTimeSeriesData] = useState(() => mockStore.getIngestionTimeSeries(30, "all"));
  const [loading] = useState(false);

  // Category Tab ("All Sources", "API Integrations", "Public Job Boards", "Internal")
  const [activeTab, setActiveTabState] = useState("All Sources");

  // Filter toolbar state
  const [searchQuery, setSearchQueryState] = useState("");
  const [typeFilter, setTypeFilterState] = useState("All");
  const [statusFilter, setStatusFilterState] = useState("All");
  const [dateFilter, setDateFilterState] = useState("All Time");

  // Sorting state
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Wrapped setters that also reset page
  const setActiveTab = useCallback((tab) => {
    setActiveTabState(tab);
    setCurrentPage(1);
  }, []);

  const setSearchQuery = useCallback((query) => {
    setSearchQueryState(query);
    setCurrentPage(1);
  }, []);

  const setTypeFilter = useCallback((type) => {
    setTypeFilterState(type);
    setCurrentPage(1);
  }, []);

  const setStatusFilter = useCallback((status) => {
    setStatusFilterState(status);
    setCurrentPage(1);
  }, []);

  const setDateFilter = useCallback((dateOption) => {
    setDateFilterState(dateOption);
    setCurrentPage(1);
  }, []);

  // Drawer & Modals state
  const [selectedSource, setSelectedSource] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSource, setDeletingSource] = useState(null);

  // Sync animation states
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncingSourceId, setSyncingSourceId] = useState(null);

  // Subscribe to mockStore changes
  useEffect(() => {
    const unsubscribe = mockStore.subscribe(() => {
      setSources(mockStore.getAllJobSources());
      setSyncHistory(mockStore.getAllSyncHistory());
      setDuplicateJobs(mockStore.getAllDuplicateJobs());
      setTimeSeriesData(mockStore.getIngestionTimeSeries(30, "all"));

      // If drawer is currently inspecting a source, update it with fresh data
      setSelectedSource((prev) => {
        if (!prev) return null;
        return mockStore.getJobSourceById(prev.id) || null;
      });
    });

    return () => unsubscribe();
  }, []);

  // Overall KPI metrics
  const stats = useMemo(() => {
    const total = sources.length;
    const active = sources.filter((s) => s.status === "Active").length;
    const failed = sources.filter((s) => s.status === "Error").length;
    const jobsToday = sources.reduce(
      (sum, s) => sum + (Number(s.jobsRetrievedToday || s.jobsToday) || 0),
      0
    );

    return {
      totalSources: total,
      activeSources: active,
      failedSources: failed,
      jobsRetrievedToday: jobsToday,
      jobsToday,
    };
  }, [sources]);

  // Category counts for Tab Header
  const tabCounts = useMemo(() => {
    return {
      all: sources.length,
      api: sources.filter((s) => s.type === "api").length,
      job_board: sources.filter((s) => s.type === "job_board").length,
      internal: sources.filter((s) => s.type === "internal").length,
    };
  }, [sources]);

  // Filtered dataset
  const filteredSources = useMemo(() => {
    const now = Date.now();

    return sources.filter((source) => {
      // 1. Tab filter
      if (activeTab === "API Integrations" && source.type !== "api") {
        return false;
      }
      if (activeTab === "Public Job Boards" && source.type !== "job_board") {
        return false;
      }
      if (activeTab === "Internal" && source.type !== "internal") {
        return false;
      }

      // 2. Type filter dropdown
      if (typeFilter !== "All" && typeFilter.toLowerCase() !== "all") {
        if (source.type !== typeFilter) return false;
      }

      // 3. Status filter dropdown
      if (statusFilter !== "All" && statusFilter.toLowerCase() !== "all") {
        if (source.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      // 4. Date / Last Sync Filter
      if (dateFilter !== "All Time") {
        const syncTimestamp = new Date(source.lastSync || 0).getTime();
        const diffMs = now - syncTimestamp;

        if (dateFilter === "Today") {
          // within 24 hours
          if (diffMs > 24 * 60 * 60 * 1000) return false;
        } else if (dateFilter === "Last 7 Days") {
          if (diffMs > 7 * 24 * 60 * 60 * 1000) return false;
        } else if (dateFilter === "Last 30 Days") {
          if (diffMs > 30 * 24 * 60 * 60 * 1000) return false;
        }
      }

      // 5. Search query (matches name, ID, type, endpoint)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = source.name?.toLowerCase().includes(query);
        const matchesId = source.id?.toLowerCase().includes(query);
        const matchesType = source.type?.toLowerCase().includes(query);
        const matchesEndpoint = source.endpoint?.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesType && !matchesEndpoint) {
          return false;
        }
      }

      return true;
    });
  }, [sources, activeTab, typeFilter, statusFilter, dateFilter, searchQuery]);

  // Sorted dataset
  const sortedSources = useMemo(() => {
    const sorted = [...filteredSources];
    sorted.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "jobsRetrieved" || sortField === "totalJobsRetrieved") {
        valA = Number(a.jobsRetrieved ?? a.totalJobsRetrieved) || 0;
        valB = Number(b.jobsRetrieved ?? b.totalJobsRetrieved) || 0;
      } else if (sortField === "jobsRetrievedToday" || sortField === "jobsToday") {
        valA = Number(a.jobsRetrievedToday ?? a.jobsToday) || 0;
        valB = Number(b.jobsRetrievedToday ?? b.jobsToday) || 0;
      } else if (sortField === "lastSync") {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = (valA || "").toString().toLowerCase();
        valB = (valB || "").toString().toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredSources, sortField, sortDirection]);

  // Paginated dataset
  const paginatedSources = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedSources.slice(startIndex, startIndex + pageSize);
  }, [sortedSources, currentPage, pageSize]);

  // Handle Sort Toggle
  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setTypeFilter("All");
    setStatusFilter("All");
    setDateFilter("All Time");
    setActiveTab("All Sources");
  }, [setSearchQuery, setTypeFilter, setStatusFilter, setDateFilter, setActiveTab]);

  const isFiltered = Boolean(
    searchQuery ||
      typeFilter !== "All" ||
      statusFilter !== "All" ||
      dateFilter !== "All Time" ||
      activeTab !== "All Sources"
  );

  // Action: Single Source Sync
  const handleSyncSource = useCallback(
    async (source) => {
      if (!source) return;
      setSyncingSourceId(source.id);
      try {
        const result = await syncJobSource(source.id);
        addToast(
          `Simulated sync completed for ${source.name}: ${result.jobsDiscovered} new jobs discovered`,
          "success"
        );
      } catch (err) {
        addToast(`Sync failed for ${source.name}: ${err.message}`, "error");
      } finally {
        setSyncingSourceId(null);
      }
    },
    [addToast]
  );

  // Action: Sync All Sources
  const handleSyncAll = useCallback(async () => {
    setIsSyncingAll(true);
    try {
      const summary = await syncAllJobSources();
      addToast(
        `Sync simulation completed across all active sources (${summary.totalNew} total new jobs ingested)`,
        "success"
      );
    } catch (err) {
      addToast(`Batch sync error: ${err.message}`, "error");
    } finally {
      setIsSyncingAll(false);
    }
  }, [addToast]);

  // Action: Export CSV
  const handleExportCSV = useCallback(() => {
    try {
      exportJobSourcesToCSV(filteredSources, syncHistory);
      addToast(`Exported ${filteredSources.length} job sources to CSV`, "success");
    } catch (err) {
      addToast(`CSV export failed: ${err.message}`, "error");
    }
  }, [filteredSources, syncHistory, addToast]);

  // Action: Toggle Status
  const handleToggleStatus = useCallback(
    async (source) => {
      try {
        const updated = await toggleJobSourceStatus(source.id);
        addToast(
          `${source.name} is now ${updated.status}`,
          updated.status === "Active" ? "success" : "warning"
        );
      } catch (err) {
        addToast(`Failed to update status: ${err.message}`, "error");
      }
    },
    [addToast]
  );

  // Action: Create or Update Source
  const handleSaveSource = useCallback(
    async (data) => {
      try {
        if (editingSource) {
          await updateJobSource(editingSource.id, data);
          addToast(`Updated ${data.name} integration`, "success");
        } else {
          await createJobSource(data);
          addToast(`Added ${data.name} to ingestion sources`, "success");
        }
      } catch (err) {
        addToast(`Error saving source: ${err.message}`, "error");
      }
    },
    [editingSource, addToast]
  );

  // Action: Delete Source
  const handleDeleteSource = useCallback(
    async (id) => {
      try {
        const target = sources.find((s) => s.id === id);
        await deleteJobSource(id);
        addToast(`Removed source ${target?.name || id}`, "info");
        if (selectedSource?.id === id) {
          setIsDetailsDrawerOpen(false);
          setSelectedSource(null);
        }
      } catch (err) {
        addToast(`Delete failed: ${err.message}`, "error");
      }
    },
    [sources, selectedSource, addToast]
  );

  // Action: Resolve Duplicate Job
  const handleResolveDuplicate = useCallback(
    async (duplicateId, action) => {
      try {
        await resolveDuplicateJob(duplicateId, action);
        const actionLabel =
          action === "MERGE"
            ? "Merged duplicate records"
            : action === "KEEP_BOTH"
            ? "Kept both postings as distinct"
            : "Dismissed duplicate alert";
        addToast(actionLabel, "success");
      } catch (err) {
        addToast(`Duplicate resolution error: ${err.message}`, "error");
      }
    },
    [addToast]
  );

  // Modal Openers
  const openAddSource = useCallback(() => {
    setEditingSource(null);
    setIsFormModalOpen(true);
  }, []);

  const openEditSource = useCallback((source) => {
    setEditingSource(source);
    setIsFormModalOpen(true);
  }, []);

  const openDeleteSource = useCallback((source) => {
    setDeletingSource(source);
    setIsDeleteModalOpen(true);
  }, []);

  const openViewDetails = useCallback((source) => {
    setSelectedSource(source);
    setIsDetailsDrawerOpen(true);
  }, []);

  return {
    // Data
    sources: paginatedSources,
    allSources: sources,
    allFilteredSources: filteredSources,
    syncHistory,
    duplicateJobs,
    timeSeriesData,
    totalCount: filteredSources.length,
    loading,
    stats,
    tabCounts,

    // Filter controls
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    isFiltered,
    handleClearFilters,

    // Sorting & Pagination
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,

    // Action handlers
    handleSyncSource,
    handleSyncAll,
    handleExportCSV,
    handleToggleStatus,
    handleSaveSource,
    handleDeleteSource,
    handleResolveDuplicate,
    isSyncingAll,
    syncingSourceId,

    // Drawer & Modals
    selectedSource,
    isDetailsDrawerOpen,
    setIsDetailsDrawerOpen,
    openViewDetails,
    isFormModalOpen,
    setIsFormModalOpen,
    editingSource,
    openAddSource,
    openEditSource,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deletingSource,
    openDeleteSource,
  };
}
