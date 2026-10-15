import React from "react";
import { Download, Calendar, Cpu } from "lucide-react";
import Button from "../../../components/ui/Button";
import { PROVIDERS, AI_FEATURES } from "../constants/aiUsageData";

export default function AiUsageHeader({
  dateRange,
  setDateRange,
  providerFilter,
  setProviderFilter,
  featureFilter,
  setFeatureFilter,
  onExportCsv,
  darkMode = false,
}) {
  const selectBg = darkMode
    ? "bg-[#161B22] border-[#30363D] text-slate-200"
    : "bg-white border-slate-200 text-slate-800";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Cpu className="w-3 h-3" />
            <span>Operational Telemetry</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Oct 2026 Live Sync</span>
        </div>
        <h1
          className={`text-2xl font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-[#0B192C]"
          }`}
        >
          AI Usage
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Monitor AI consumption, model performance, request activity, and operational costs.
        </p>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Range Selector */}
        <div className="relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`pl-8 pr-7 py-2 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none focus:border-amber-500 transition-colors ${selectBg}`}
            title="Select date range"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Provider Filter */}
        <div className="relative">
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none focus:border-amber-500 transition-colors ${selectBg}`}
            title="Filter by Provider"
          >
            <option value="all">All Providers</option>
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Feature Filter */}
        <div className="relative">
          <select
            value={featureFilter}
            onChange={(e) => setFeatureFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none focus:border-amber-500 transition-colors ${selectBg}`}
            title="Filter by Feature"
          >
            <option value="all">All Features</option>
            {AI_FEATURES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Export CSV Button */}
        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={onExportCsv}
          className="shadow-xs"
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
}
