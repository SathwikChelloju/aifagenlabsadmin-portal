import React from "react";
import { Radio, CheckCircle2, AlertTriangle, DownloadCloud, Activity } from "lucide-react";

/**
 * JobSourcesStats Component
 * 4 Data-Driven Summary Cards for Job Sources:
 * 1. Total Sources
 * 2. Active Sources
 * 3. Failed Sources
 * 4. Jobs Retrieved Today
 */
export default function JobSourcesStats({ stats, darkMode = false }) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  const totalSources = stats?.totalSources ?? 0;
  const activeSources = stats?.activeSources ?? 0;
  const failedSources = stats?.failedSources ?? 0;
  const jobsToday = stats?.jobsRetrievedToday ?? 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. TOTAL SOURCES */}
      <div
        className={`border rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] transition-colors flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg border ${
                darkMode
                  ? "bg-[#21262D] border-[#30363D] text-slate-300"
                  : "bg-slate-100 border-slate-200/80 text-slate-600"
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              TOTAL SOURCES
            </span>
          </div>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          className={`text-3xl font-extrabold font-mono tracking-tight ${headingText}`}
        >
          {totalSources}
        </div>

        <div className={`mt-2.5 flex items-center gap-1.5 text-xs ${subText}`}>
          <span>Configured ingestion feeds</span>
        </div>
      </div>

      {/* 2. ACTIVE SOURCES */}
      <div
        className={`border rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] transition-colors flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg border ${
                darkMode
                  ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
                  : "bg-emerald-50 border-emerald-200/80 text-emerald-700"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              ACTIVE SOURCES
            </span>
          </div>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              darkMode
                ? "bg-emerald-950/50 text-emerald-400"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        <div
          className={`text-3xl font-extrabold font-mono tracking-tight ${headingText}`}
        >
          {activeSources}
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {totalSources > 0 ? `${Math.round((activeSources / totalSources) * 100)}%` : "0%"}
          </span>
          <span className={subText}>healthy & operational</span>
        </div>
      </div>

      {/* 3. FAILED SOURCES */}
      <div
        className={`border rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] transition-colors flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg border ${
                failedSources > 0
                  ? darkMode
                    ? "bg-rose-950/40 border-rose-800/40 text-rose-400"
                    : "bg-rose-50 border-rose-200/80 text-rose-700"
                  : darkMode
                    ? "bg-[#21262D] border-[#30363D] text-slate-300"
                    : "bg-slate-100 border-slate-200 text-slate-600"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              FAILED SOURCES
            </span>
          </div>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              failedSources > 0
                ? darkMode
                  ? "bg-rose-950/50 text-rose-400"
                  : "bg-rose-50 text-rose-600"
                : darkMode
                  ? "bg-slate-800 text-slate-400"
                  : "bg-slate-100 text-slate-400"
            }`}
          >
            {failedSources > 0 ? (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            )}
          </div>
        </div>

        <div
          className={`text-3xl font-extrabold font-mono tracking-tight ${
            failedSources > 0 ? (darkMode ? "text-rose-400" : "text-rose-600") : headingText
          }`}
        >
          {failedSources}
        </div>

        <div className={`mt-2.5 flex items-center gap-1.5 text-xs ${subText}`}>
          <span>
            {failedSources > 0
              ? "Require operator triage"
              : "Zero blocking alerts"}
          </span>
        </div>
      </div>

      {/* 4. JOBS RETRIEVED TODAY */}
      <div
        className={`border rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] transition-colors flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg border ${
                darkMode
                  ? "bg-amber-950/40 border-amber-800/40 text-amber-400"
                  : "bg-amber-50 border-amber-200/80 text-amber-700"
              }`}
            >
              <DownloadCloud className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              JOBS RETRIEVED TODAY
            </span>
          </div>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              darkMode ? "bg-amber-950/50 text-amber-400" : "bg-amber-50 text-amber-600"
            }`}
          >
            <DownloadCloud className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          className={`text-3xl font-extrabold font-mono tracking-tight ${headingText}`}
        >
          {jobsToday}
        </div>

        <div className={`mt-2.5 flex items-center gap-1.5 text-xs ${subText}`}>
          <span>Ingested across active workers today</span>
        </div>
      </div>
    </section>
  );
}
