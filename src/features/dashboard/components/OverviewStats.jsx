import React from "react";
import { Users, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";

export default function OverviewStats({ stats, darkMode }) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <div
        className={`border rounded-[28px] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-colors ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Total Candidates
          </span>
          <div
            className={`p-2.5 rounded-2xl ${darkMode ? "bg-[#21262D] text-slate-300" : "bg-slate-100 text-slate-600"}`}
          >
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-[2.6rem] leading-none font-extrabold font-mono tracking-[-0.06em] ${headingText}`}
        >
          {stats.totalUsers.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs font-medium">
          <span className="text-emerald-700 font-bold font-mono bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
            +{stats.newUsers30d}
          </span>
          <span className={subText}>registered past 30 days</span>
        </div>
      </div>

      <div
        className={`border rounded-[28px] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-colors ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Enrolled Subscriptions
          </span>
          <div className="p-2.5 rounded-2xl bg-amber-50 text-[#D97706] border border-amber-200/60">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-[2.6rem] leading-none font-extrabold font-mono tracking-[-0.06em] ${headingText}`}
        >
          {stats.payingUsers.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs font-medium">
          <span className="font-bold text-amber-700 font-mono bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
            {stats.conversionRate}
          </span>
          <span className={subText}>funnel conversion rate</span>
        </div>
      </div>

      <div
        className={`border rounded-[28px] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-colors ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Monthly Revenue
          </span>
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-[2.6rem] leading-none font-extrabold font-mono tracking-[-0.06em] ${headingText}`}
        >
          ${
            stats.revenueThisMonth.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })
          }
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-emerald-700">
          <span className="font-mono bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
            +14.2%
          </span>
          <span className={`font-medium ${subText}`}>vs target intake</span>
        </div>
      </div>

      <div
        className={`border rounded-[28px] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-colors ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Abroad Ingestion Health
          </span>
          <div
            className={`p-2.5 rounded-2xl ${darkMode ? "bg-[#21262D] text-slate-300" : "bg-slate-100 text-slate-600"}`}
          >
            <span className="text-xs font-bold font-mono">⚡</span>
          </div>
        </div>
        <div
          className={`text-[2.6rem] leading-none font-extrabold font-mono tracking-[-0.06em] ${headingText}`}
        >
          {stats.activeJobs.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs font-mono font-medium">
          <span className="text-amber-800 font-bold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> 2 Attention
          </span>
          <span className="text-slate-400">· {stats.sourcesWorking} live</span>
        </div>
      </div>
    </section>
  );
}
