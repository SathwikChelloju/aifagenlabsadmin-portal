import React from "react";
import { Briefcase, Globe, Calendar, Clock, Users, ArrowUp } from "lucide-react";

/**
 * JobsStats Component
 * 4 Compact KPI Summary Cards matching the screenshot:
 * 1. TOTAL JOBS: 124 (↑ +12% from last 30 days)
 * 2. JOBS ADDED (30 DAYS): 28 (↑ -8% compared to previous 30 days)
 * 3. JOBS ADDED TODAY: 6 (↑ +200% compared to yesterday)
 * 4. ACTIVE JOBS: 92 (↑ +14% currently live)
 */
export default function JobsStats({ stats, darkMode = false }) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  const total = stats.totalJobs || 124;
  const active = stats.activeJobs || 92;
  const added30Days = stats.jobsAdded30d || 28;
  const addedToday = stats.jobsAddedToday || 6;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. TOTAL JOBS */}
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
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              TOTAL JOBS
            </span>
          </div>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          className={`text-3xl font-extrabold font-mono tracking-tight ${headingText}`}
        >
          {total}
        </div>

        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="inline-flex items-center gap-0.5 font-bold font-mono px-2 py-0.5 rounded-md text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            +12%
          </span>
          <span className={`text-[11px] ${subText}`}>from last 30 days</span>
        </div>
      </div>

      {/* 2. JOBS ADDED (30 DAYS) */}
      <div
        className={`border rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] transition-colors flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              JOBS ADDED (30 DAYS)
            </span>
          </div>

          <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          className={`text-3xl font-extrabold font-mono tracking-tight ${headingText}`}
        >
          {added30Days}
        </div>

        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="inline-flex items-center gap-0.5 font-bold font-mono px-2 py-0.5 rounded-md text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            -8%
          </span>
          <span className={`text-[11px] ${subText}`}>compared to previous 30 days</span>
        </div>
      </div>

      {/* 3. JOBS ADDED TODAY */}
      <div
        className={`border rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] transition-colors flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-500 dark:text-rose-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              JOBS ADDED TODAY
            </span>
          </div>

          <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          className={`text-3xl font-extrabold font-mono tracking-tight ${headingText}`}
        >
          {addedToday}
        </div>

        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="inline-flex items-center gap-0.5 font-bold font-mono px-2 py-0.5 rounded-md text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            +200%
          </span>
          <span className={`text-[11px] ${subText}`}>compared to yesterday</span>
        </div>
      </div>

      {/* 4. ACTIVE JOBS */}
      <div
        className={`border rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] transition-colors flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              ACTIVE JOBS
            </span>
          </div>

          <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div
          className={`text-3xl font-extrabold font-mono tracking-tight ${headingText}`}
        >
          {active}
        </div>

        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="inline-flex items-center gap-0.5 font-bold font-mono px-2 py-0.5 rounded-md text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            +14%
          </span>
          <span className={`text-[11px] ${subText}`}>currently live</span>
        </div>
      </div>
    </section>
  );
}
