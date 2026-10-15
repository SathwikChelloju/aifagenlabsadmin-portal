import React from "react";
import { useAuditLogs } from "../hooks/useAuditLogs";
import AuditLogsHeader from "../components/AuditLogsHeader";
import AuditLogsStats from "../components/AuditLogsStats";
import AuditLogsCategoryTabs from "../components/AuditLogsCategoryTabs";
import AuditLogsFilters from "../components/AuditLogsFilters";
import AuditLogsTable from "../components/AuditLogsTable";
import AuditLogDetailsDrawer from "../components/AuditLogDetailsDrawer";

/**
 * AuditLogsPage Component
 * Full-featured Audit Logs view matching AIFA GEN LABS Admin Console design:
 * - Header with real Export CSV action
 * - 4 Summary cards (Total Events, Today's Activity, Security Events, Failed Actions)
 * - 8 Category tabs (All Events, Security, Users, Payments, Jobs, Job Sources, Administration, System)
 * - Search and 4-way filter toolbar (Search, Category, Actor Type, Result, Date Range)
 * - 10-column Audit Events table with selection and pagination
 * - Right-hand Event Details Drawer (Overview, Changes, Context, Related Events)
 */
export default function AuditLogsPage({ darkMode = false }) {
  const {
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
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
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
  } = useAuditLogs();

  const handleExportSelected = () => {
    const selectedList = events.filter((e) => selectedIds.has(e.id));
    handleExportCSV(selectedList);
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <AuditLogsHeader
        onExportCsv={() => handleExportCSV(filteredEvents)}
        darkMode={darkMode}
      />

      {/* 2. SUMMARY CARDS */}
      <AuditLogsStats stats={summaryStats} darkMode={darkMode} />

      {/* 3. EVENT CATEGORY TABS */}
      <AuditLogsCategoryTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={categoryCounts}
        darkMode={darkMode}
      />

      {/* 4. SEARCH AND FILTER TOOLBAR */}
      <AuditLogsFilters
        search={searchQuery}
        setSearch={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        actorTypeFilter={actorTypeFilter}
        setActorTypeFilter={setActorTypeFilter}
        resultFilter={resultFilter}
        setResultFilter={setResultFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
        clearFilters={handleClearFilters}
        resultCount={sortedEvents.length}
        totalCount={events.length}
        darkMode={darkMode}
      />

      {/* 5. AUDIT EVENTS TABLE */}
      <AuditLogsTable
        events={paginatedEvents}
        totalCount={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAllCurrentPage}
        onClearSelection={clearSelection}
        isAllSelected={isAllCurrentPageSelected}
        isIndeterminate={isIndeterminate}
        onViewDetails={(e, tab = "overview") => openDrawer(e, tab)}
        onExportSelected={handleExportSelected}
        darkMode={darkMode}
      />

      {/* 6. RIGHT-SIDE EVENT DETAILS DRAWER */}
      <AuditLogDetailsDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        event={selectedEvent}
        activeTab={activeDrawerTab}
        onTabChange={setActiveDrawerTab}
        relatedEvents={relatedEvents}
        onSelectRelatedEvent={handleSelectRelatedEvent}
        darkMode={darkMode}
      />
    </div>
  );
}
