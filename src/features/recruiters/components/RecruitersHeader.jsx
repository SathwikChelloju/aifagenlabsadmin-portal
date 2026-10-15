import React from "react";
import { UserPlus, Download } from "lucide-react";

export default function RecruitersHeader({ onAddRecruiter, onExportCsv, darkMode = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Recruiters & Talent Partners
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor internal recruiter workload, interview capacity, and candidate placement performance.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onExportCsv}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
            darkMode
              ? "bg-[#161B22] border-[#30363D] text-slate-300 hover:bg-[#21262D]"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
          }`}
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export CSV</span>
        </button>

        <button
          type="button"
          onClick={onAddRecruiter}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Recruiter</span>
        </button>
      </div>
    </div>
  );
}
