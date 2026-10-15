import React from "react";
import { Download, RefreshCw, Calendar } from "lucide-react";

const PERIOD_OPTIONS = [
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "90d", label: "Last 90 Days" },
  { id: "ytd", label: "Year to Date (2026)" },
];

export default function OverviewHeader({
  period,
  setPeriod,
  isRefreshing,
  onRefresh,
  onExportCsv,
  darkMode = false,
}) {
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const btnBase = darkMode
    ? "bg-[#161B22] border-[#30363D] text-slate-300 hover:bg-[#21262D]"
    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-[#30363D]">
      <div className="min-w-0">
        <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${headingText}`}>
          Platform Overview
        </h1>
        <p className={`text-xs ${subText} mt-0.5 truncate`}>
          Cross-functional operational performance across AI compute, candidate pipeline, and talent operations.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Date Range Selector */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border ${
            darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200 shadow-2xs"
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className={`bg-transparent text-xs font-bold focus:outline-hidden cursor-pointer ${
              darkMode ? "text-slate-200" : "text-slate-800"
            }`}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option
                key={opt.id}
                value={opt.id}
                className={darkMode ? "bg-[#161B22] text-white" : "bg-white text-slate-900"}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh Action */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
            isRefreshing ? "opacity-75 cursor-not-allowed" : "active:scale-95"
          } ${btnBase}`}
          title="Refresh summary data"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              isRefreshing ? "animate-spin text-amber-500" : "text-slate-400"
            }`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Export Report Action */}
        <button
          type="button"
          onClick={onExportCsv}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer active:scale-95 ${btnBase}`}
          title="Export report CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Report</span>
        </button>
      </div>
    </div>
  );
}
