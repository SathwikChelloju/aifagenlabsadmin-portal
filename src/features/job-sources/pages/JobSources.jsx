import React from "react";
import JobSourcesHeader from "../components/JobSourcesHeader";
import JobSourcesStats from "../components/JobSourcesStats";
import JobIngestionCharts from "../components/JobIngestionCharts";
import SourceHealthAndApiUsage from "../components/SourceHealthAndApiUsage";
import DuplicateJobsMonitor from "../components/DuplicateJobsMonitor";
import RecentSyncActivityFeed from "../components/RecentSyncActivityFeed";
import JobSourceTypeTabs from "../components/JobSourceTypeTabs";
import JobSourcesFilters from "../components/JobSourcesFilters";
import JobSourcesTable from "../components/JobSourcesTable";
import JobSourceDetailsDrawer from "../components/JobSourceDetailsDrawer";
import JobSourceFormModal from "../components/JobSourceFormModal";
import DeleteSourceModal from "../components/DeleteSourceModal";
import { useJobSources } from "../hooks/useJobSources";

/**
 * JobSourcesPage Component
 * Comprehensive Job Sources management module for AIFA GEN LABS Admin Console.
 * Fulfills all functional modules:
 * - A: Page Header with Sync All, Export CSV, Add Source
 * - B: 4 Summary KPI Cards
 * - C: Performance Analytics (Line Chart & Donut Chart)
 * - D: Category Tabs with counts
 * - E: Search & Multi-criteria Filters (Type, Status, Date)
 * - F: 8-Column Data Table with sorting, pagination, and actions
 * - G: Slide-out Details Drawer (Overview, Sync History, Configuration)
 * - H: Source Health Overview
 * - I: API Usage & Rate Limits
 * - J: Duplicate Jobs Monitor with review interactions
 * - K: Recent Sync Activity simulated feed
 */
export default function JobSourcesPage({ darkMode = false }) {
  const {
    // Data
    sources,
    allSources,
    syncHistory,
    duplicateJobs,
    timeSeriesData,
    totalCount,
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
  } = useJobSources();

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-150">
      {/* SECTION A: Page Header */}
      <JobSourcesHeader
        onAddSource={openAddSource}
        onSyncAll={handleSyncAll}
        onExportCsv={handleExportCSV}
        isSyncingAll={isSyncingAll}
        darkMode={darkMode}
      />

      {/* SECTION B: 4 Data-Driven Summary KPI Cards */}
      <JobSourcesStats stats={stats} darkMode={darkMode} />

      {/* SECTION C: Performance Analytics Charts (Line & Donut) */}
      <JobIngestionCharts
        sources={allSources}
        timeSeriesData={timeSeriesData}
        darkMode={darkMode}
      />

      {/* SECTION H & I: Source Health Overview + API Usage & Rate Limits */}
      <SourceHealthAndApiUsage
        sources={allSources}
        syncHistory={syncHistory}
        darkMode={darkMode}
      />

      {/* SECTION J: Duplicate Jobs Monitor & Review */}
      <DuplicateJobsMonitor
        duplicateJobs={duplicateJobs}
        sources={allSources}
        onResolveDuplicate={handleResolveDuplicate}
        darkMode={darkMode}
      />

      {/* SECTION K: Recent Sync Activity Simulated Feed */}
      <RecentSyncActivityFeed
        syncHistory={syncHistory}
        onViewSource={openViewDetails}
        darkMode={darkMode}
      />

      {/* SECTION D: Category Type Tabs */}
      <JobSourceTypeTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={tabCounts}
        darkMode={darkMode}
      />

      {/* SECTION E: Search & Filter Toolbar */}
      <JobSourcesFilters
        search={searchQuery}
        setSearch={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        clearFilters={handleClearFilters}
        resultCount={totalCount}
        darkMode={darkMode}
      />

      {/* SECTION F: Sources Data Table */}
      <JobSourcesTable
        sources={sources}
        syncHistory={syncHistory}
        loading={loading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onViewDetails={openViewDetails}
        onEdit={openEditSource}
        onDelete={openDeleteSource}
        onToggleStatus={handleToggleStatus}
        onSyncSource={handleSyncSource}
        syncingSourceId={syncingSourceId}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
        darkMode={darkMode}
      />

      {/* SECTION G: Slide-out Details Drawer (Overview, Sync History, Configuration) */}
      <JobSourceDetailsDrawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        source={selectedSource}
        syncHistory={syncHistory}
        onSync={handleSyncSource}
        onToggleStatus={handleToggleStatus}
        onEdit={openEditSource}
        isSyncing={selectedSource ? syncingSourceId === selectedSource.id : false}
        darkMode={darkMode}
      />

      {/* Add / Edit Source Modal */}
      <JobSourceFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveSource}
        initialData={editingSource}
        darkMode={darkMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteSourceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSource}
        source={deletingSource}
        darkMode={darkMode}
      />
    </div>
  );
}
