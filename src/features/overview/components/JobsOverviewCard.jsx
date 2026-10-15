import React from "react";
import { Briefcase, ArrowRight, ShieldCheck } from "lucide-react";

export default function JobsOverviewCard({
  jobsOverview = {},
  onNavigate,
  darkMode = false,
}) {
  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const statBoxBg = darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50/80 border-slate-100";
  const itemBorder = darkMode ? "border-[#30363D]" : "border-slate-100";

  return (
    <div
      className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" />
            </span>
            <div>
              <h3 className={`text-base font-extrabold ${headingText}`}>
                Jobs Pipeline Overview
              </h3>
              <p className={`text-[11px] ${subText}`}>
                Index status & target talent destinations
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate("jobs")}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                darkMode
                  ? "bg-[#0D1117] border-[#30363D] text-slate-300 hover:text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 3 mini stat cards */}
        <div className="grid grid-cols-3 gap-2 mb-3.5">
          <div className={`p-2.5 rounded-xl border ${statBoxBg}`}>
            <span className={`text-[9px] font-bold block uppercase tracking-wider ${subText}`}>
              Public
            </span>
            <div className={`text-base font-black font-mono mt-0.5 ${headingText}`}>
              {(jobsOverview.publicCount || 520).toLocaleString()}
            </div>
            <span className="text-[10px] text-blue-500 font-medium">Aggregated</span>
          </div>

          <div className={`p-2.5 rounded-xl border ${statBoxBg}`}>
            <span className={`text-[9px] font-bold block uppercase tracking-wider ${subText}`}>
              Internal
            </span>
            <div className={`text-base font-black font-mono mt-0.5 ${headingText}`}>
              {(jobsOverview.internalCount || 24).toLocaleString()}
            </div>
            <span className="text-[10px] text-indigo-500 font-medium">Curated</span>
          </div>

          <div className={`p-2.5 rounded-xl border ${statBoxBg}`}>
            <span className={`text-[9px] font-bold block uppercase tracking-wider ${subText}`}>
              Visa Spons.
            </span>
            <div className="text-base font-black font-mono mt-0.5 text-emerald-600 dark:text-emerald-400">
              {jobsOverview.visaVerifiedPct || 88}%
            </div>
            <span className="text-[10px] text-emerald-500 font-medium">Verified</span>
          </div>
        </div>

        {/* Target Destination Markets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Primary Destination Markets</span>
            <span>Share</span>
          </div>

          {(jobsOverview.topCountries || []).map((item) => (
            <div key={item.country}>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className={`font-semibold ${headingText}`}>{item.country}</span>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className={subText}>{item.count}</span>
                  <span className={`font-bold ${headingText}`}>{item.pct}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#0D1117] rounded-full h-1 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between ${itemBorder} ${subText}`}>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          ATS Verified Pipeline
        </span>
        <span className="font-mono font-semibold">
          {(jobsOverview.totalIndexed || 544).toLocaleString()} Total Roles
        </span>
      </div>
    </div>
  );
}
