import React from "react";
import { Plus, Download } from "lucide-react";

/**
 * UsersHeader Component
 * Clean portal header with dynamic counter, CSV export, and Add User action.
 */
export default function UsersHeader({
  onAddUser,
  onExportCsv,
  totalCount = 0,
  darkMode = false,
}) {
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const badgeStyle = darkMode
    ? "bg-[#161B22] text-slate-300 border-[#30363D]"
    : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className={`text-xl font-extrabold tracking-tight ${headingText}`}>
            Users
          </h1>
          <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
            {totalCount} Total
          </span>
        </div>
        <p className={`text-xs mt-1 ${subText}`}>
          Overseas career candidates, recruiter accounts, and subscription tiers.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {onExportCsv && (
          <button
            type="button"
            onClick={onExportCsv}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all active:scale-95 cursor-pointer ${
              darkMode
                ? "bg-[#161B22] border-[#30363D] hover:bg-[#21262D] text-white"
                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs"
            }`}
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>Export CSV</span>
          </button>
        )}

        <button
          type="button"
          onClick={onAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B192C] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Add User</span>
        </button>
      </div>
    </div>
  );
}
