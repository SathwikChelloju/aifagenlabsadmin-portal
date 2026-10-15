import React from "react";
import { useAiUsage } from "../hooks/useAiUsage";
import AiUsageHeader from "../components/AiUsageHeader";
import AiUsageStats from "../components/AiUsageStats";
import AiUsageTrendChart from "../components/AiUsageTrendChart";
import AiUsageActorDonut from "../components/AiUsageActorDonut";
import TopAiConsumersTable from "../components/TopAiConsumersTable";
import AiCostManagementCard from "../components/AiCostManagementCard";
import RecentAiRequestsCard from "../components/RecentAiRequestsCard";
import ProviderModelPerformanceTable from "../components/ProviderModelPerformanceTable";
import AiCallActivityTable from "../components/AiCallActivityTable";
import AiRequestDetailsDrawer from "../components/AiRequestDetailsDrawer";
import AiConsumerDetailsDrawer from "../components/AiConsumerDetailsDrawer";
import AiBudgetConfigModal from "../components/AiBudgetConfigModal";

export default function AiUsagePage({ darkMode = false }) {
  const {
    // Data & stats
    filteredRequests,
    summaryStats,
    trendChartData,
    actorTypeMetrics,
    topConsumers,
    modelPerformanceList,
    costManagement,
    recentRequests,
    paginatedRequests,
    // Filters
    dateRange,
    setDateRange,
    providerFilter,
    setProviderFilter,
    featureFilter,
    setFeatureFilter,
    actorTypeFilter,
    setActorTypeFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    handleClearFilters,
    // Trend controls
    trendMetric,
    setTrendMetric,
    trendRange,
    setTrendRange,
    // Sorting & Pagination
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
  } = useAiUsage();

  const handleScrollToActivity = () => {
    const el = document.getElementById("ai-call-activity-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleViewModelRequests = (modelName) => {
    setSearchQuery(modelName);
    handleScrollToActivity();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. PAGE HEADER */}
      <AiUsageHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        providerFilter={providerFilter}
        setProviderFilter={setProviderFilter}
        featureFilter={featureFilter}
        setFeatureFilter={setFeatureFilter}
        onExportCsv={handleExportCSV}
        darkMode={darkMode}
      />

      {/* 2. FOUR SUMMARY KPI CARDS */}
      <AiUsageStats stats={summaryStats} darkMode={darkMode} />

      {/* 3. MIDDLE SECTION: TREND CHART (2/3) + ACTOR DONUT (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <AiUsageTrendChart
            trendData={trendChartData}
            metric={trendMetric}
            setMetric={setTrendMetric}
            range={trendRange}
            setRange={setTrendRange}
            darkMode={darkMode}
          />
        </div>
        <div className="lg:col-span-4">
          <AiUsageActorDonut
            actorMetrics={actorTypeMetrics}
            selectedActorFilter={actorTypeFilter}
            onSelectActorFilter={(role) => {
              setActorTypeFilter(role);
              handleScrollToActivity();
            }}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* 4. HIGH VOLUME CONSUMERS (8 cols) + AI COST MANAGEMENT (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <TopAiConsumersTable
            consumers={topConsumers}
            sortMetric={consumerSortMetric}
            setSortMetric={setConsumerSortMetric}
            onViewDetails={handleOpenConsumerDrawer}
            darkMode={darkMode}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <AiCostManagementCard
            costManagement={costManagement}
            onOpenConfigure={() => setIsBudgetModalOpen(true)}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* 5. PROVIDER & MODEL PERFORMANCE (8 cols) + RECENT REQUESTS (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <ProviderModelPerformanceTable
            models={modelPerformanceList}
            providerFilter={modelProviderFilter}
            setProviderFilter={setModelProviderFilter}
            sortField={modelSortField}
            sortDirection={modelSortDirection}
            onSort={handleSortModelPerformance}
            onViewModelRequests={handleViewModelRequests}
            darkMode={darkMode}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <RecentAiRequestsCard
            recentRequests={recentRequests}
            onViewRequest={handleOpenRequestDrawer}
            onViewAll={handleScrollToActivity}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* 6. COMPLETE AI CALL ACTIVITY TABLE */}
      <AiCallActivityTable
        requests={paginatedRequests}
        totalCount={filteredRequests.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSortActivity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        actorTypeFilter={actorTypeFilter}
        setActorTypeFilter={setActorTypeFilter}
        featureFilter={featureFilter}
        setFeatureFilter={setFeatureFilter}
        providerFilter={providerFilter}
        setProviderFilter={setProviderFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onClearFilters={handleClearFilters}
        onViewRequest={handleOpenRequestDrawer}
        onExportCsv={handleExportCSV}
        darkMode={darkMode}
      />

      {/* 7. RIGHT-SIDE AI REQUEST DETAILS DRAWER */}
      <AiRequestDetailsDrawer
        isOpen={isRequestDrawerOpen}
        onClose={handleCloseRequestDrawer}
        request={selectedRequest}
        activeTab={activeRequestTab}
        onTabChange={setActiveRequestTab}
        relatedRequests={relatedRequests}
        onSelectRelatedRequest={(req) => handleOpenRequestDrawer(req, "overview")}
        darkMode={darkMode}
      />

      {/* 8. RIGHT-SIDE CONSUMER DETAILS DRAWER */}
      <AiConsumerDetailsDrawer
        isOpen={isConsumerDrawerOpen}
        onClose={handleCloseConsumerDrawer}
        consumerProfile={selectedConsumerProfile}
        onViewRequest={(req) => {
          handleCloseConsumerDrawer();
          handleOpenRequestDrawer(req, "overview");
        }}
        darkMode={darkMode}
      />

      {/* 9. AI BUDGET GOVERNANCE CONFIG MODAL */}
      <AiBudgetConfigModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        initialBudget={budget}
        onSave={handleSaveBudget}
        darkMode={darkMode}
      />
    </div>
  );
}
