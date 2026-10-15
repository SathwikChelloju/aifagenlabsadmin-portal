import React from "react";
import { Download } from "lucide-react";

/**
 * AuditLogsHeader Component
 * Page header matching the design system:
 * Title, subtitle, and Export CSV button.
 */
export default function AuditLogsHeader({ onExportCsv, darkMode = false }) {
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const secBtnBg = darkMode
    ? "bg-[#161B22] border-[#30363D] text-slate-200 hover:text-white hover:bg-[#21262D]"
    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${headingText}`}>
          Audit Logs
        </h1>
        <p className={`text-xs sm:text-sm mt-0.5 ${subText}`}>
          Track and review all important activities, changes, and system events across the platform.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onExportCsv}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${secBtnBg}`}
          title="Export matching audit events to CSV"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}
