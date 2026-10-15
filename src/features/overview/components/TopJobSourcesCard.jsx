import React from "react";
import { Database, ArrowRight } from "lucide-react";

export default function TopJobSourcesCard({
  jobSources = [],
  periodLabel = "Last 30 Days",
  onNavigate,
  darkMode = false,
}) {
  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const itemBorder = darkMode ? "border-[#30363D]" : "border-slate-100";
  const itemHover = darkMode ? "hover:bg-[#1C2128]" : "hover:bg-slate-50/70";

  const maxJobs = Math.max(...jobSources.map((s) => s.jobsPeriod || 0), 1);
  const totalPeriodJobs = jobSources.reduce((acc, s) => acc + (s.jobsPeriod || 0), 0);

  return (
    <div
      className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </span>
            <div>
              <h3 className={`text-base font-extrabold ${headingText}`}>
                Top Job Sources
              </h3>
              <p className={`text-[11px] ${subText}`}>
                Active ingestors & volume fetched ({periodLabel})
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate("job-sources")}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                darkMode
                  ? "bg-[#0D1117] border-[#30363D] text-slate-300 hover:text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="divide-y divide-inherit">
          {jobSources.map((source, idx) => {
            const pct = Math.round(((source.jobsPeriod || 0) / maxJobs) * 100);
            const sharePct = totalPeriodJobs > 0
              ? (((source.jobsPeriod || 0) / totalPeriodJobs) * 100).toFixed(0)
              : "0";
            const isActive = source.status === "Active";

            return (
              <div
                key={source.id}
                className={`py-2.5 first:pt-1 last:pb-1 transition-colors rounded-xl px-2 -mx-2 ${itemHover} ${itemBorder}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-[#0D1117] text-[10px] font-mono font-bold flex items-center justify-center text-slate-500 shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold truncate ${headingText}`}>
                          {source.name}
                        </span>
                        <span
                          className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded border shrink-0 ${
                            darkMode
                              ? "bg-[#0D1117] text-slate-400 border-[#30363D]"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {source.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {isActive ? "Active" : "Paused"}
                    </span>
                    <div className={`text-xs font-extrabold font-mono ${headingText}`}>
                      {(source.jobsPeriod || 0).toLocaleString()}
                    </div>
                    <span className={`text-[10px] font-mono ${subText}`}>
                      ({sharePct}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-[#0D1117] rounded-full h-1 overflow-hidden ml-7 max-w-[calc(100%-28px)]">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between ${itemBorder} ${subText}`}>
        <span>5 Ingestors Running</span>
        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
          100% Ingestion Uptime
        </span>
      </div>
    </div>
  );
}
