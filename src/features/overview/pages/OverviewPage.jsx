import React from "react";
import { useOverview } from "../hooks/useOverview";
import OverviewHeader from "../components/OverviewHeader";
import OverviewKpiCards from "../components/OverviewKpiCards";
import PlatformPerformanceChart from "../components/PlatformPerformanceChart";
import QuickInsightsCard from "../components/QuickInsightsCard";
import KeyNumbersCard from "../components/KeyNumbersCard";
import TopJobSourcesCard from "../components/TopJobSourcesCard";
import JobsOverviewCard from "../components/JobsOverviewCard";
import UserGrowthCard from "../components/UserGrowthCard";
import AiCostBreakdownCard from "../components/AiCostBreakdownCard";
import DepartmentOverviewCard from "../components/DepartmentOverviewCard";
import RecentActivityFeed from "../components/RecentActivityFeed";

export default function OverviewPage({ darkMode = false, onNavigate }) {
  const {
    period,
    setPeriod,
    overviewData,
    isRefreshing,
    handleRefresh,
    handleExportReport,
  } = useOverview();

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200 pb-8">
      {/* 1. Header with Period Selector, Refresh, and Export Report */}
      <OverviewHeader
        period={period}
        setPeriod={setPeriod}
        onRefresh={handleRefresh}
        onExportCsv={handleExportReport}
        isRefreshing={isRefreshing}
        darkMode={darkMode}
      />

      {/* 2. Six KPI Cards in One Horizontal Row */}
      <OverviewKpiCards
        kpis={overviewData.kpis}
        periodLabel={overviewData.periodLabel}
        onNavigate={onNavigate}
        darkMode={darkMode}
      />

      {/* 3. Primary Section: Platform Performance Chart (Left) + Quick Insights (Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="lg:col-span-8 flex flex-col">
          <PlatformPerformanceChart
            timeSeries={overviewData.timeSeries}
            periodLabel={overviewData.periodLabel}
            darkMode={darkMode}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <QuickInsightsCard onNavigate={onNavigate} darkMode={darkMode} />
        </div>
      </section>

      {/* 4. Second Row: Top Job Sources + Jobs Overview + Key Numbers */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="lg:col-span-4 flex flex-col">
          <TopJobSourcesCard
            jobSources={overviewData.jobSources}
            periodLabel={overviewData.periodLabel}
            onNavigate={onNavigate}
            darkMode={darkMode}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <JobsOverviewCard
            jobsOverview={overviewData.jobsOverview}
            onNavigate={onNavigate}
            darkMode={darkMode}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <KeyNumbersCard
            keyNumbers={overviewData.keyNumbers}
            darkMode={darkMode}
          />
        </div>
      </section>

      {/* 5. Third Row: User Growth + AI Cost Breakdown + Department-wise Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="lg:col-span-4 flex flex-col">
          <UserGrowthCard
            userGrowth={overviewData.userGrowth}
            onNavigate={onNavigate}
            darkMode={darkMode}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <AiCostBreakdownCard
            aiActors={overviewData.aiActors}
            kpiAiCost={overviewData.kpis.aiCost}
            periodLabel={overviewData.periodLabel}
            onNavigate={onNavigate}
            darkMode={darkMode}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <DepartmentOverviewCard
            departments={overviewData.departmentBreakdown}
            onNavigate={onNavigate}
            darkMode={darkMode}
          />
        </div>
      </section>

      {/* 6. Fourth Row: Chronological Recent Activity Feed */}
      <section className="w-full">
        <RecentActivityFeed
          activities={overviewData.recentActivities}
          onNavigate={onNavigate}
          darkMode={darkMode}
        />
      </section>
    </div>
  );
}
