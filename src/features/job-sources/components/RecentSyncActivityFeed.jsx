import React from "react";
import { History, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import SourceLogo from "./SourceLogo";
import { formatSourceTimestamp } from "../utils/jobSourceUtils";

/**
 * RecentSyncActivityFeed Component (Section K)
 * Compact feed of latest synchronization events across all sources.
 * Shows source name, result, timestamp, jobs processed (added/updated/skipped), and error details.
 * Features prominent "Simulated mock activity" indicator per project instructions.
 */
export default function RecentSyncActivityFeed({
  syncHistory = [],
  onViewSource,
  darkMode = false,
}) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const innerCardBg = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/80 border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  const recentEvents = syncHistory.slice(0, 6);

  return (
    <div
      className={`border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors ${cardBg}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
              <History className="w-3 h-3 text-[#D97706]" />
              Audit Stream
            </div>

            {/* Clear simulated activity badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold border border-amber-200/60 dark:border-amber-800/50">
              <Sparkles className="w-2.5 h-2.5" />
              Simulated Mock Activity
            </span>
          </div>

          <h3 className={`text-base font-extrabold mt-1 ${headingText}`}>
            Recent Sync Activity
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            Telemetry events recorded from background ingestion schedulers.
          </p>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          {syncHistory.length} total recorded runs
        </span>
      </div>

      {/* Events Grid */}
      <div className="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {recentEvents.map((evt) => {
          const isSuccess = evt.result === "Success";

          return (
            <div
              key={evt.id}
              onClick={() => onViewSource && onViewSource({ id: evt.sourceId, name: evt.sourceName })}
              className={`p-3.5 rounded-2xl border text-xs flex flex-col justify-between transition-colors cursor-pointer hover:border-amber-400/80 ${innerCardBg}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <SourceLogo
                      name={evt.sourceName}
                      size="sm"
                      className="shrink-0"
                    />
                    <span className="font-bold truncate text-slate-900 dark:text-white text-[12px]">
                      {evt.sourceName}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full font-bold text-[10px] shrink-0 ${
                      isSuccess
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60"
                    }`}
                  >
                    {isSuccess ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                    )}
                    {evt.result}
                  </span>
                </div>

                {/* Duration & timestamp */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                  <span>{formatSourceTimestamp(evt.startTime || evt.timestamp)}</span>
                  <span>Duration: {evt.duration || "1.2s"}</span>
                </div>

                {/* Processing Metrics breakdown */}
                <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800 text-[10px] text-center font-mono">
                  <div className="p-1 rounded bg-slate-200/40 dark:bg-slate-800/60">
                    <div className="text-slate-400 text-[9px]">Added</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">
                      +{evt.jobsAdded ?? evt.newJobs ?? 0}
                    </div>
                  </div>
                  <div className="p-1 rounded bg-slate-200/40 dark:bg-slate-800/60">
                    <div className="text-slate-400 text-[9px]">Updated</div>
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {evt.jobsUpdated ?? evt.updatedJobs ?? 0}
                    </div>
                  </div>
                  <div className="p-1 rounded bg-slate-200/40 dark:bg-slate-800/60">
                    <div className="text-slate-400 text-[9px]">Skipped</div>
                    <div className="font-bold text-slate-500">
                      {evt.jobsSkipped ?? 0}
                    </div>
                  </div>
                </div>

                {/* Error log if present */}
                {evt.errorSummary && (
                  <div className="mt-2.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-[10px] font-mono leading-tight">
                    {evt.errorSummary}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
