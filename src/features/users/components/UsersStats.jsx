import React from "react";
import { Users, CheckCircle2, ShieldAlert, CreditCard } from "lucide-react";

/**
 * UsersStats Component
 * 4 Top KPI Cards with compact vertical profile and dynamic 30-day registration telemetry.
 */
export default function UsersStats({ stats, darkMode = false }) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Total Accounts */}
      <div
        className={`border rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-colors flex flex-col justify-between h-full ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Total Accounts
          </span>
          <div
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              darkMode
                ? "bg-[#21262D] border-[#30363D] text-slate-400"
                : "bg-slate-100 border-slate-200/60 text-slate-600"
            }`}
          >
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-3xl sm:text-[2.15rem] leading-none font-extrabold font-mono tracking-[-0.04em] ${headingText}`}
        >
          {stats.totalUsers.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-xs font-medium">
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded-lg border text-[11px] ${
              darkMode
                ? "bg-[#21262D] text-slate-300 border-[#30363D]"
                : "bg-slate-100 text-slate-700 border-slate-200/80"
            }`}
          >
            {stats.recent30dUsers ?? 0}
          </span>
          <span className={subText}>Last 30 days</span>
        </div>
      </div>

      {/* 2. Active Users */}
      <div
        className={`border rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-colors flex flex-col justify-between h-full ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Active Users
          </span>
          <div
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              darkMode
                ? "bg-emerald-950/30 border-emerald-900/40 text-emerald-400"
                : "bg-emerald-50 border-emerald-100 text-emerald-600"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-3xl sm:text-[2.15rem] leading-none font-extrabold font-mono tracking-[-0.04em] ${headingText}`}
        >
          {stats.activeUsers.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-xs font-medium">
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded-lg border text-[11px] ${
              darkMode
                ? "bg-emerald-950/30 text-emerald-300 border-emerald-800/40"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
            }`}
          >
            {stats.totalUsers > 0
              ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}%`
              : "0%"}
          </span>
          <span className={subText}>verified status</span>
        </div>
      </div>

      {/* 3. Suspended Accounts */}
      <div
        className={`border rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-colors flex flex-col justify-between h-full ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Suspended Accounts
          </span>
          <div
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              darkMode
                ? "bg-rose-950/30 border-rose-900/40 text-rose-400"
                : "bg-rose-50 border-rose-100 text-rose-600"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-3xl sm:text-[2.15rem] leading-none font-extrabold font-mono tracking-[-0.04em] ${headingText}`}
        >
          {stats.suspendedUsers.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-xs font-medium">
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded-lg border text-[11px] ${
              darkMode
                ? "bg-rose-950/30 text-rose-300 border-rose-800/40"
                : "bg-rose-50 text-rose-700 border-rose-200/60"
            }`}
          >
            Policy Flag
          </span>
          <span className={subText}>requires admin triage</span>
        </div>
      </div>

      {/* 4. Paid Subscribers */}
      <div
        className={`border rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-colors flex flex-col justify-between h-full ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Paid Subscribers
          </span>
          <div
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              darkMode
                ? "bg-amber-950/30 border-amber-900/40 text-amber-400"
                : "bg-amber-50 border-amber-100 text-amber-600"
            }`}
          >
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-3xl sm:text-[2.15rem] leading-none font-extrabold font-mono tracking-[-0.04em] ${headingText}`}
        >
          {stats.paidSubscribers.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-xs font-medium">
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded-lg border text-[11px] ${
              darkMode
                ? "bg-amber-950/30 text-amber-300 border-amber-800/40"
                : "bg-amber-50 text-amber-700 border-amber-200/60"
            }`}
          >
            Premium & Basic
          </span>
          <span className={subText}>monetized candidates</span>
        </div>
      </div>
    </section>
  );
}
