import React, { useState, useMemo } from "react";
import JobsHeader from "../components/JobsHeader";
import JobsStats from "../components/JobsStats";
import JobTypeTabs from "../components/JobTypeTabs";
import JobsBulkActionBar from "../components/JobsBulkActionBar";
import JobsFilters from "../components/JobsFilters";
import JobsTable from "../components/JobsTable";
import JobDetailsDrawer from "../components/JobDetailsDrawer";
import JobFormModal from "../components/JobFormModal";
import DeleteJobModal from "../components/DeleteJobModal";
import HideJobsModal from "../components/HideJobsModal";
import { useJobs } from "../hooks/useJobs";
import { generateJobsCsv } from "../utils/jobUtils";
import { useToast } from "../../../hooks/useToast";

/**
 * JobsPage Component
 * Unified Jobs Management page for AIFA GEN LABS Admin Console.
 * Matches the reference screenshot layout, KPI cards, segmented tabs,
 * table design, contextual bulk-action bar, and right-hand details inspection panel.
 */
export default function JobsPage({
  darkMode = false,
  defaultJobType = "All Jobs",
  onNavigate,
}) {
  const {
    jobs,
    filteredJobs,
    paginatedJobs,
    totalCount,
    loading,
    summaryMetrics,
    availableSources,
    search,
    setSearch,
    jobTypeFilter,
    setJobTypeFilter,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    dateFilter,
    setDateFilter,
    visibilityFilter,
    setVisibilityFilter,
    clearFilters,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    createJob,
    updateJob,
    deleteJob,
    updateJobStatus,
    hideJobs,
    unhideJobs,
    toggleJobVisibility,
    bulkUpdateStatus,
  } = useJobs(defaultJobType);

  const { addToast } = useToast();

  // Selected job for right-hand slide-out drawer
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobObject, setSelectedJobObject] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const selectedJob = useMemo(() => {
    if (selectedJobObject && selectedJobObject.id === selectedJobId) {
      const fresh = jobs?.find((j) => j.id === selectedJobId);
      return fresh ? { ...selectedJobObject, ...fresh } : selectedJobObject;
    }
    if (!selectedJobId) return null;
    return jobs?.find((j) => j.id === selectedJobId) || null;
  }, [selectedJobId, selectedJobObject, jobs]);

  const handleViewDetails = (job) => {
    if (!job) return;
    setSelectedJobId(job.id);
    setSelectedJobObject(job);
    setIsDetailsDrawerOpen(true);
  };

  const handleCloseDetailsDrawer = () => {
    setIsDetailsDrawerOpen(false);
  };

  // Bulk Selection State (using stable job IDs)
  const [selectedJobIds, setSelectedJobIds] = useState(new Set());

  // Derive reconciled selectedJobIds against currently filteredJobs so filtered-out records are excluded
  const effectiveSelectedJobIds = useMemo(() => {
    if (selectedJobIds.size === 0) return selectedJobIds;
    const validIds = new Set(filteredJobs.map((j) => j.id));
    const next = new Set([...selectedJobIds].filter((id) => validIds.has(id)));
    return next.size === selectedJobIds.size ? selectedJobIds : next;
  }, [selectedJobIds, filteredJobs]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);
  const [jobToHideSingular, setJobToHideSingular] = useState(null);

  // CSV Export Handler
  const handleExportCsv = () => {
    if (filteredJobs.length === 0) {
      addToast("No jobs match current filters to export.", "info");
      return;
    }

    try {
      const csvString = generateJobsCsv(filteredJobs);
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "jobs-export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast(`Exported ${filteredJobs.length} job records to CSV`, "success");
    } catch (err) {
      console.error("CSV Export Error:", err);
      addToast("Failed to generate CSV export file", "error");
    }
  };

  const handleOpenAddJob = () => {
    setJobToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditJob = (job) => {
    setJobToEdit(job);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (jobData) => {
    if (jobToEdit) {
      await updateJob(jobToEdit.id, jobData);
    } else {
      const created = await createJob(jobData);
      if (created?.id) {
        setSelectedJobId(created.id);
        setSelectedJobObject(created);
        setIsDetailsDrawerOpen(true);
      }
    }
  };

  const handleCategoryTabChange = (newTab) => {
    setJobTypeFilter(newTab);
    setSelectedJobIds(new Set());
  };

  // Checkbox selection calculations for current page
  const visibleIds = useMemo(() => paginatedJobs.map((j) => j.id), [paginatedJobs]);
  const selectedOnCurrentPageCount = useMemo(
    () => visibleIds.filter((id) => effectiveSelectedJobIds.has(id)).length,
    [visibleIds, effectiveSelectedJobIds]
  );
  const isAllCurrentPageSelected =
    visibleIds.length > 0 && selectedOnCurrentPageCount === visibleIds.length;
  const isIndeterminate =
    selectedOnCurrentPageCount > 0 && selectedOnCurrentPageCount < visibleIds.length;

  const handleToggleSelectJob = (id) => {
    setSelectedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAllCurrentPage = () => {
    setSelectedJobIds((prev) => {
      const next = new Set(prev);
      if (isAllCurrentPageSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Bulk actions handlers
  const handleConfirmBulkHide = async () => {
    const ids = Array.from(effectiveSelectedJobIds);
    await hideJobs(ids);
    setSelectedJobIds(new Set());
  };

  const handleBulkUnhide = async () => {
    const ids = Array.from(effectiveSelectedJobIds);
    await unhideJobs(ids);
    setSelectedJobIds(new Set());
  };

  const handleBulkStatusChange = async (newStatus) => {
    const ids = Array.from(effectiveSelectedJobIds);
    await bulkUpdateStatus(ids, newStatus);
    setSelectedJobIds(new Set());
  };

  const handleClearSelection = () => {
    setSelectedJobIds(new Set());
  };

  const handleHideSingleJob = (job) => {
    setJobToHideSingular(job);
  };

  const handleUnhideSingleJob = async (job) => {
    await toggleJobVisibility(job.id, false, job.title);
  };

  const handleConfirmSingleHide = async () => {
    if (jobToHideSingular) {
      await toggleJobVisibility(jobToHideSingular.id, true, jobToHideSingular.title);
      setJobToHideSingular(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Page Header */}
      <JobsHeader
        onAddJob={handleOpenAddJob}
        onExportCsv={handleExportCsv}
        darkMode={darkMode}
      />

      {/* 2. Top Summary KPI Cards */}
      <JobsStats
        stats={summaryMetrics}
        darkMode={darkMode}
      />

      {/* 3. Segmented Tabs for All Jobs / Public Jobs / Internal Jobs and Job Sources navigation */}
      <JobTypeTabs
        activeTab={jobTypeFilter}
        onTabChange={handleCategoryTabChange}
        onNavigateJobSources={() => {
          if (onNavigate) {
            onNavigate("job-sources");
          } else if (typeof window !== "undefined") {
            window.history.pushState(null, "", "/job-sources");
            window.dispatchEvent(new PopStateEvent("popstate"));
          }
        }}
        counts={{
          all: summaryMetrics.totalJobs || 124,
          public: summaryMetrics.publicJobs || 78,
          internal: summaryMetrics.internalJobs || 46,
        }}
        darkMode={darkMode}
      />

      {/* Bulk Action Bar (Contextual: renders only when at least 1 job is selected) */}
      {effectiveSelectedJobIds.size > 0 && (
        <JobsBulkActionBar
          selectedCount={effectiveSelectedJobIds.size}
          selectedJobs={filteredJobs.filter((j) => effectiveSelectedJobIds.has(j.id))}
          onHide={() => setIsHideModalOpen(true)}
          onUnhide={handleBulkUnhide}
          onChangeStatus={handleBulkStatusChange}
          onClear={handleClearSelection}
          darkMode={darkMode}
        />
      )}

      {/* 4. Single-Row Search & Filter Toolbar */}
      <JobsFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        visibilityFilter={visibilityFilter}
        setVisibilityFilter={setVisibilityFilter}
        availableSources={availableSources}
        clearFilters={() => {
          clearFilters();
          setSelectedJobIds(new Set());
        }}
        resultCount={totalCount}
        darkMode={darkMode}
      />

      {/* 5. Main Area: Unified Jobs Table */}
      <div className="w-full min-w-0">
        <JobsTable
          jobs={paginatedJobs}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          selectedJobId={isDetailsDrawerOpen ? selectedJob?.id : null}
          onSelectJob={handleViewDetails}
          onViewDetails={handleViewDetails}
          onEditJob={handleOpenEditJob}
          onDeleteJob={(job) => setJobToDelete(job)}
          onStatusChange={async (id, newStatus, title) => {
            await updateJobStatus(id, newStatus, title);
          }}
          selectedJobIds={effectiveSelectedJobIds}
          onToggleSelectJob={handleToggleSelectJob}
          onToggleSelectAllCurrentPage={handleToggleSelectAllCurrentPage}
          isAllCurrentPageSelected={isAllCurrentPageSelected}
          isIndeterminate={isIndeterminate}
          onHideJob={handleHideSingleJob}
          onUnhideJob={handleUnhideSingleJob}
          onClearFilters={clearFilters}
          isFiltered={
            search.trim() !== "" ||
            statusFilter !== "All" ||
            sourceFilter !== "All Sources" ||
            dateFilter !== "All Time" ||
            visibilityFilter !== "all"
          }
          darkMode={darkMode}
        />
      </div>

      {/* Slide-out Job Details Drawer */}
      <JobDetailsDrawer
        job={selectedJob}
        isOpen={isDetailsDrawerOpen && Boolean(selectedJob)}
        onClose={handleCloseDetailsDrawer}
        onEditJob={handleOpenEditJob}
        onStatusChange={async (id, newStatus, title) => {
          await updateJobStatus(id, newStatus, title);
        }}
        onToggleVisibility={async (id, isHidden, title) => {
          await toggleJobVisibility(id, isHidden, title);
        }}
        darkMode={darkMode}
      />

      {/* 6. Add / Edit Job Form Modal */}
      <JobFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        jobToEdit={jobToEdit}
        availableSources={availableSources}
        darkMode={darkMode}
      />

      {/* 7. Delete Confirmation Dialog Modal */}
      <DeleteJobModal
        job={jobToDelete}
        isOpen={Boolean(jobToDelete)}
        onClose={() => setJobToDelete(null)}
        onConfirm={async (id, title) => {
          await deleteJob(id, title);
          if (selectedJobId === id) {
            setSelectedJobId(null);
            setSelectedJobObject(null);
            setIsDetailsDrawerOpen(false);
          }
        }}
        darkMode={darkMode}
      />

      {/* 8. Bulk Hide Confirmation Modal */}
      <HideJobsModal
        isOpen={isHideModalOpen}
        onClose={() => setIsHideModalOpen(false)}
        onConfirm={handleConfirmBulkHide}
        count={effectiveSelectedJobIds.size}
        darkMode={darkMode}
      />

      {/* 9. Single Job Hide Confirmation Modal */}
      <HideJobsModal
        isOpen={Boolean(jobToHideSingular)}
        onClose={() => setJobToHideSingular(null)}
        onConfirm={handleConfirmSingleHide}
        count={1}
        darkMode={darkMode}
      />
    </div>
  );
}
