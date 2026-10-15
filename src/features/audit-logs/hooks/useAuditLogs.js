import { useState, useEffect, useMemo, useCallback } from "react";
import { auditLogService } from "../services/auditLogService";
import {
  calculateAuditSummaryStats,
  calculateCategoryCounts,
} from "../../../mocks/auditLogsData";
import { exportAuditLogsToCSV } from "../utils/auditLogUtils";
import { useToast } from "../../../hooks/useToast";

export function useAuditLogs() {
  const { addToast } = useToast();
  const [events, setEvents] = useState(() => auditLogService.getEvents());

  // Subscribe to live reactive updates
  useEffect(() => {
    const unsubscribe = auditLogService.subscribe((updated) => {
      setEvents([...updated]);
    });
    return unsubscribe;
  }, []);

  // Filter state
  const [activeTab, setActiveTab] = useState("All Events");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [actorTypeFilter, setActorTypeFilter] = useState("All");
  const [resultFilter, setResultFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Sort state (default newest first)
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection state
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Drawer state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState("overview");

  // Summary Metrics & Category Counts
  const summaryStats = useMemo(() => calculateAuditSummaryStats(events), [events]);
  const categoryCounts = useMemo(() => calculateCategoryCounts(events), [events]);

  // Tab change resets pagination & category filter
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab !== "All Events") {
      setCategoryFilter(tab);
    } else {
      setCategoryFilter("All");
    }
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, []);

  // Filtered dataset
  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return events.filter((e) => {
      // 1. Category Tab & Dropdown
      const effectiveCategory =
        activeTab !== "All Events" ? activeTab : categoryFilter;
      if (effectiveCategory !== "All" && e.category !== effectiveCategory) {
        return false;
      }

      // 2. Actor Type Filter
      if (actorTypeFilter !== "All" && e.actorType !== actorTypeFilter) {
        return false;
      }

      // 3. Result Filter
      if (resultFilter !== "All" && e.result !== resultFilter) {
        return false;
      }

      // 4. Date Filter
      if (dateFilter !== "All Time") {
        const eventTime = new Date(e.timestamp || 0).getTime();
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;

        if (dateFilter === "Today") {
          if (now - eventTime > oneDayMs) return false;
        } else if (dateFilter === "Last 7 Days") {
          if (now - eventTime > 7 * oneDayMs) return false;
        } else if (dateFilter === "Last 30 Days") {
          if (now - eventTime > 30 * oneDayMs) return false;
        } else if (dateFilter === "Custom Range") {
          if (customStartDate) {
            const startMs = new Date(customStartDate).getTime();
            if (eventTime < startMs) return false;
          }
          if (customEndDate) {
            const endMs = new Date(customEndDate).getTime() + oneDayMs;
            if (eventTime > endMs) return false;
          }
        }
      }

      // 5. Search Query
      if (query) {
        const idMatch = (e.id || "").toLowerCase().includes(query);
        const actorNameMatch = (e.actorName || "").toLowerCase().includes(query);
        const actorEmailMatch = (e.actorEmail || "").toLowerCase().includes(query);
        const actorIdMatch = (e.actorId || "").toLowerCase().includes(query);
        const actionMatch = (e.action || "").toLowerCase().includes(query);
        const actionLabelMatch = (e.actionLabel || "").toLowerCase().includes(query);
        const targetNameMatch = (e.targetName || "").toLowerCase().includes(query);
        const targetIdMatch = (e.targetId || "").toLowerCase().includes(query);
        const descMatch = (e.description || "").toLowerCase().includes(query);
        const correlationMatch = (e.correlationId || "").toLowerCase().includes(query);

        if (
          !idMatch &&
          !actorNameMatch &&
          !actorEmailMatch &&
          !actorIdMatch &&
          !actionMatch &&
          !actionLabelMatch &&
          !targetNameMatch &&
          !targetIdMatch &&
          !descMatch &&
          !correlationMatch
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    events,
    activeTab,
    categoryFilter,
    actorTypeFilter,
    resultFilter,
    dateFilter,
    customStartDate,
    customEndDate,
    searchQuery,
  ]);

  // Sorted dataset
  const sortedEvents = useMemo(() => {
    const sorted = [...filteredEvents];
    sorted.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "timestamp") {
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
  }, [filteredEvents, sortField, sortDirection]);

  // Pagination calculation
  const totalItems = sortedEvents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedEvents = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return sortedEvents.slice(startIndex, startIndex + pageSize);
  }, [sortedEvents, safeCurrentPage, pageSize]);

  // Sort handler
  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("desc");
      }
    },
    [sortField]
  );

  // Selection handlers
  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSelectAllCurrentPage = useCallback(() => {
    const currentPageIds = paginatedEvents.map((e) => e.id);
    const allSelected = currentPageIds.every((id) => selectedIds.has(id));

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        currentPageIds.forEach((id) => next.delete(id));
      } else {
        currentPageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [paginatedEvents, selectedIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Selection states for header checkbox
  const isAllCurrentPageSelected =
    paginatedEvents.length > 0 &&
    paginatedEvents.every((e) => selectedIds.has(e.id));

  const isIndeterminate =
    paginatedEvents.some((e) => selectedIds.has(e.id)) &&
    !isAllCurrentPageSelected;

  // Drawer handlers
  const openDrawer = useCallback((event, defaultTab = "overview") => {
    setSelectedEvent(event);
    setActiveDrawerTab(defaultTab);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleSelectRelatedEvent = useCallback((event) => {
    setSelectedEvent(event);
    setActiveDrawerTab("overview");
  }, []);

  // Related events calculation
  const relatedEvents = useMemo(() => {
    if (!selectedEvent) return [];
    return auditLogService.getRelatedEvents(selectedEvent, events);
  }, [selectedEvent, events]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveTab("All Events");
    setCategoryFilter("All");
    setActorTypeFilter("All");
    setResultFilter("All");
    setDateFilter("All Time");
    setCustomStartDate("");
    setCustomEndDate("");
    setCurrentPage(1);
    setSelectedIds(new Set());
    addToast?.("Filters reset to default view.", "info");
  }, [addToast]);

  // CSV Export action
  const handleExportCSV = useCallback(
    (eventsToExport = filteredEvents) => {
      if (!eventsToExport.length) {
        addToast?.("No events matching active criteria to export.", "warning");
        return;
      }
      try {
        exportAuditLogsToCSV(eventsToExport);
        addToast?.(
          `Successfully exported ${eventsToExport.length.toLocaleString()} audit events to CSV.`,
          "success"
        );
      } catch (err) {
        console.error("Export error:", err);
        addToast?.("Failed to generate CSV export file.", "error");
      }
    },
    [filteredEvents, addToast]
  );

  return {
    events,
    filteredEvents,
    sortedEvents,
    paginatedEvents,
    summaryStats,
    categoryCounts,
    // Filters
    activeTab,
    handleTabChange,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    actorTypeFilter,
    setActorTypeFilter,
    resultFilter,
    setResultFilter,
    dateFilter,
    setDateFilter,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    handleClearFilters,
    // Sort
    sortField,
    sortDirection,
    handleSort,
    // Pagination
    currentPage: safeCurrentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    // Selection
    selectedIds,
    toggleSelect,
    toggleSelectAllCurrentPage,
    clearSelection,
    isAllCurrentPageSelected,
    isIndeterminate,
    // Drawer
    selectedEvent,
    drawerOpen,
    activeDrawerTab,
    setActiveDrawerTab,
    openDrawer,
    closeDrawer,
    relatedEvents,
    handleSelectRelatedEvent,
    // Export
    handleExportCSV,
  };
}
