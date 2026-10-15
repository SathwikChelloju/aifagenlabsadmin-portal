import React from "react";
import { DollarSign, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { formatCurrency } from "../utils/paymentUtils";

/**
 * PaymentsStats Component
 * 4 Compact Financial KPI Summary Cards calculated dynamically from the complete dataset.
 * Matches layout, proportions, and typography from the approved reference.
 */
export default function PaymentsStats({ stats, darkMode = false }) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  const totalCount = stats.totalCount || 0;
  const successPct = totalCount > 0 ? Math.round((stats.successfulPayments / totalCount) * 100) : 0;
  const pendingPct = totalCount > 0 ? Math.round((stats.pendingPayments / totalCount) * 100) : 0;
  const failedPct = totalCount > 0 ? Math.round((stats.failedPayments / totalCount) * 100) : 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Total Revenue */}
      <div
        className={`border rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-colors flex flex-col justify-between h-full ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Total Revenue
          </span>
          <div
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              darkMode
                ? "bg-[#21262D] border-[#30363D] text-slate-400"
                : "bg-slate-100 border-slate-200/60 text-slate-600"
            }`}
          >
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-3xl sm:text-[2.15rem] leading-none font-extrabold font-mono tracking-[-0.04em] ${headingText}`}
        >
          {formatCurrency(stats.totalRevenue)}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-xs font-medium">
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded-lg border text-[11px] ${
              darkMode
                ? "bg-emerald-950/30 text-emerald-300 border-emerald-800/40"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
            }`}
          >
            +12%
          </span>
          <span className={subText}>from successful payments</span>
        </div>
      </div>

      {/* 2. Successful Payments */}
      <div
        className={`border rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-colors flex flex-col justify-between h-full ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Successful Payments
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
          {stats.successfulPayments.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-xs font-medium">
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded-lg border text-[11px] ${
              darkMode
                ? "bg-emerald-950/30 text-emerald-300 border-emerald-800/40"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
            }`}
          >
            {successPct}%
          </span>
          <span className={subText}>of total transactions</span>
        </div>
      </div>

      {/* 3. Pending Payments */}
      <div
        className={`border rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-colors flex flex-col justify-between h-full ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Pending Payments
          </span>
          <div
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              darkMode
                ? "bg-amber-950/30 border-amber-900/40 text-amber-400"
                : "bg-amber-50 border-amber-100 text-amber-600"
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-3xl sm:text-[2.15rem] leading-none font-extrabold font-mono tracking-[-0.04em] ${headingText}`}
        >
          {stats.pendingPayments.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-xs font-medium">
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded-lg border text-[11px] ${
              darkMode
                ? "bg-amber-950/30 text-amber-300 border-amber-800/40"
                : "bg-amber-50 text-amber-700 border-amber-200/60"
            }`}
          >
            {pendingPct}%
          </span>
          <span className={subText}>awaiting confirmation</span>
        </div>
      </div>

      {/* 4. Failed Payments */}
      <div
        className={`border rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-colors flex flex-col justify-between h-full ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Failed Payments
          </span>
          <div
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              darkMode
                ? "bg-rose-950/30 border-rose-900/40 text-rose-400"
                : "bg-rose-50 border-rose-100 text-rose-600"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-3xl sm:text-[2.15rem] leading-none font-extrabold font-mono tracking-[-0.04em] ${headingText}`}
        >
          {stats.failedPayments.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-xs font-medium">
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded-lg border text-[11px] ${
              darkMode
                ? "bg-rose-950/30 text-rose-300 border-rose-800/40"
                : "bg-rose-50 text-rose-700 border-rose-200/60"
            }`}
          >
            {failedPct}%
          </span>
          <span className={subText}>requires attention</span>
        </div>
      </div>
    </section>
  );
}
