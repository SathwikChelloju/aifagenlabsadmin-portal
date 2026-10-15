import React from "react";
import { Plus, Download, RefreshCw } from "lucide-react";

/**
 * JobSourcesHeader Component
 * Page header matching the design system of Users, Payments, and Jobs:
 * Title, subtitle, Export CSV, Sync All, and Add Source actions.
 */
export default function JobSourcesHeader({
  onAddSource,
  onSyncAll,
  onExportCsv,
  isSyncingAll = false,
  darkMode = false,
}) {
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const secBtnBg = darkMode
    ? "bg-[#161B22] border-[#30363D] text-slate-200 hover:text-white hover:bg-[#21262D]"
    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${headingText}`}>
          Job Sources
        </h1>
        <p className={`text-xs sm:text-sm mt-0.5 ${subText}`}>
          Monitor integrations, source health, and job ingestion activity.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Export CSV Button */}
        <button
          type="button"
          onClick={onExportCsv}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${secBtnBg}`}
          title="Export source catalog to CSV"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export CSV</span>
        </button>

        {/* Sync All Button */}
        <button
          type="button"
          onClick={onSyncAll}
          disabled={isSyncingAll}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer disabled:opacity-50 ${secBtnBg}`}
          title="Trigger simulated synchronization across all active sources"
        >
          <RefreshCw className={`w-4 h-4 text-amber-500 ${isSyncingAll ? "animate-spin" : ""}`} />
          <span>{isSyncingAll ? "Syncing..." : "Sync All"}</span>
        </button>

        {/* Primary Add Source Button */}
        <button
          type="button"
          onClick={onAddSource}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#D97706] hover:bg-[#B45309] shadow-xs hover:shadow transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Source</span>
        </button>
      </div>
    </div>
  );
}
