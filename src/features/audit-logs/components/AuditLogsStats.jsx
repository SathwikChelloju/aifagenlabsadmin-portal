import React from "react";
import {
  ShieldAlert,
  Activity,
  Lock,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

/**
 * AuditLogsStats Component
 * Renders exactly 4 summary cards in a desktop row:
 * 1. TOTAL EVENTS (2,584 | ↑ 12% from last 30 days)
 * 2. TODAY'S ACTIVITY (186 | ↑ 24% today vs yesterday)
 * 3. SECURITY EVENTS (42 | ↑ 8% in last 7 days)
 * 4. FAILED ACTIONS (18 | ↓ 34% from last 7 days)
 */
export default function AuditLogsStats({ stats, darkMode = false }) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  const totalEvents = stats?.totalEvents || {
    formatted: "2,584",
    indicator: "↑ 12%",
    subtext: "from last 30 days",
  };

  const todayActivity = stats?.todayActivity || {
    formatted: "186",
    indicator: "↑ 24%",
    subtext: "today vs yesterday",
  };

  const securityEvents = stats?.securityEvents || {
    formatted: "42",
    indicator: "↑ 8%",
    subtext: "in last 7 days",
  };

  const failedActions = stats?.failedActions || {
    formatted: "18",
    indicator: "↓ 34%",
    subtext: "from last 7 days",
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. TOTAL EVENTS */}
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
              <ShieldAlert className="w-3.5 h-3.5 text-[#D97706]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              TOTAL EVENTS
            </span>
          </div>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className={`text-3xl font-extrabold font-mono tracking-tight ${headingText}`}>
            {totalEvents.formatted}
          </div>

          {/* Mini Sparkline SVG */}
          <div className="w-16 h-8 opacity-75">
            <svg viewBox="0 0 64 28" className="w-full h-full overflow-visible">
              <path
                d="M 2 24 Q 16 18, 28 20 T 48 8 T 62 4"
                fill="none"
                stroke="#D97706"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold ${
              darkMode
                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
            }`}
          >
            <ArrowUpRight className="w-3 h-3" />
            12%
          </span>
          <span className={`text-[11px] ${subText}`}>{totalEvents.subtext}</span>
        </div>
      </div>

      {/* 2. TODAY'S ACTIVITY */}
      <div
        className={`border rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] transition-colors flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg border ${
                darkMode
                  ? "bg-blue-950/40 border-blue-800/40 text-blue-400"
                  : "bg-blue-50 border-blue-200/80 text-blue-700"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              TODAY'S ACTIVITY
            </span>
          </div>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              darkMode ? "bg-slate-800 text-blue-300" : "bg-blue-50 text-blue-600"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className={`text-3xl font-extrabold font-mono tracking-tight ${headingText}`}>
            {todayActivity.formatted}
          </div>

          <div className="w-16 h-8 opacity-75">
            <svg viewBox="0 0 64 28" className="w-full h-full overflow-visible">
              <path
                d="M 2 22 Q 14 20, 24 16 T 44 12 T 62 2"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold ${
              darkMode
                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
            }`}
          >
            <ArrowUpRight className="w-3 h-3" />
            24%
          </span>
          <span className={`text-[11px] ${subText}`}>{todayActivity.subtext}</span>
        </div>
      </div>

      {/* 3. SECURITY EVENTS */}
      <div
        className={`border rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] transition-colors flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg border ${
                darkMode
                  ? "bg-purple-950/40 border-purple-800/40 text-purple-400"
                  : "bg-purple-50 border-purple-200/80 text-purple-700"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              SECURITY EVENTS
            </span>
          </div>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              darkMode ? "bg-slate-800 text-purple-300" : "bg-purple-50 text-purple-600"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className={`text-3xl font-extrabold font-mono tracking-tight ${headingText}`}>
            {securityEvents.formatted}
          </div>

          <div className="w-16 h-8 opacity-75">
            <svg viewBox="0 0 64 28" className="w-full h-full overflow-visible">
              <path
                d="M 2 16 Q 16 22, 32 14 T 48 16 T 62 8"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold ${
              darkMode
                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
            }`}
          >
            <ArrowUpRight className="w-3 h-3" />
            8%
          </span>
          <span className={`text-[11px] ${subText}`}>{securityEvents.subtext}</span>
        </div>
      </div>

      {/* 4. FAILED ACTIONS */}
      <div
        className={`border rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] transition-colors flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg border ${
                darkMode
                  ? "bg-rose-950/40 border-rose-800/40 text-rose-400"
                  : "bg-rose-50 border-rose-200/80 text-rose-700"
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              FAILED ACTIONS
            </span>
          </div>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              darkMode ? "bg-slate-800 text-rose-300" : "bg-rose-50 text-rose-600"
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className={`text-3xl font-extrabold font-mono tracking-tight ${headingText}`}>
            {failedActions.formatted}
          </div>

          <div className="w-16 h-8 opacity-75">
            <svg viewBox="0 0 64 28" className="w-full h-full overflow-visible">
              <path
                d="M 2 6 Q 16 8, 30 14 T 48 18 T 62 24"
                fill="none"
                stroke="#E11D48"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold ${
              darkMode
                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
            }`}
          >
            <ArrowDownRight className="w-3 h-3" />
            34%
          </span>
          <span className={`text-[11px] ${subText}`}>{failedActions.subtext}</span>
        </div>
      </div>
    </section>
  );
}
