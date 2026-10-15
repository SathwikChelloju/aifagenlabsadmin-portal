import React from "react";
import { Plus, Download } from "lucide-react";

/**
 * JobsHeader Component
 * Matches the exact page header from the screenshot:
 * - Jobs (bold title)
 * - Manage public job listings and internal job postings from one place.
 * - Actions: Export CSV and + Add Job
 */
export default function JobsHeader({
  onAddJob,
  onExportCsv,
  _totalCount = 0,
  darkMode = false,
}) {
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className={`text-2xl font-extrabold tracking-tight ${headingText}`}>
          Jobs
        </h1>
        <p className={`text-xs mt-1 ${subText}`}>
          Manage public job listings and internal job postings from one place.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {onExportCsv && (
          <button
            type="button"
            onClick={onExportCsv}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all active:scale-95 cursor-pointer ${
              darkMode
                ? "bg-[#161B22] border-[#30363D] hover:bg-[#21262D] text-white"
                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs"
            }`}
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>Export CSV</span>
          </button>
        )}

        {onAddJob && (
          <button
            type="button"
            onClick={onAddJob}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer bg-[#0B192C] hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Job</span>
          </button>
        )}
      </div>
    </div>
  );
}
