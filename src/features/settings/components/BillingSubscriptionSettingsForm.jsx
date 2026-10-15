import React from "react";
import { CreditCard, Download, CheckCircle2 } from "lucide-react";
import { useToast } from "../../../hooks/useToast";

export default function BillingSubscriptionSettingsForm({
  billing = {},
  _onSave,
  _onReset,
  _isDirty = false,
  _isSaving = false,
  darkMode = false,
}) {
  const { addToast } = useToast();

  const handleDownloadInvoice = (invoiceId) => {
    addToast(`Downloaded simulated tax invoice ${invoiceId}`, "success");
  };

  const cardSurface = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90 shadow-2xs";

  const subCardSurface = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/70 border-slate-200/80";

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 transition-colors space-y-7 ${cardSurface}`}>
      <div>
        <h2
          className={`text-lg font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-[#0B192C]"
          }`}
        >
          Platform Subscription & Billing
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage the console's cloud infrastructure plan, crawler capacity, and invoices.
        </p>
      </div>

      {/* Plan Card */}
      <div className={`p-5 rounded-2xl border relative overflow-hidden ${subCardSurface}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Active Tier
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Billed Annually
              </span>
            </div>
            <h3
              className={`text-base font-extrabold ${
                darkMode ? "text-white" : "text-[#0B192C]"
              }`}
            >
              {billing.planName || "AIFA Enterprise Cloud - Annual Tier"}
            </h3>
            <p className="text-xs text-slate-400">
              High-throughput crawler clusters with dedicated residential proxy bandwidth.
            </p>
          </div>

          <div className="text-right sm:border-l sm:pl-6 border-slate-200 dark:border-[#30363D]">
            <div className="text-2xl font-extrabold font-mono text-[#D97706]">
              {billing.price || "$1,490.00 / yr"}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Renews {billing.renewalDate || "Nov 01, 2026"}
            </div>
          </div>
        </div>

        {/* Quota Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 mt-4 border-t border-slate-200/60 dark:border-[#30363D]">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Job Ingestion Credits</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {billing.ingestionQuota || "450k / 1.0M jobs"}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${billing.ingestionPercent || 45}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Monthly API Requests</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {billing.apiCallsQuota || "1.2M / 2.5M reqs"}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${billing.apiCallsPercent || 48}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${subCardSurface}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0">
            <CreditCard className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <span
              className={`text-xs font-bold block ${
                darkMode ? "text-white" : "text-[#0B192C]"
              }`}
            >
              {billing.paymentMethod || "Visa ending in 4242"}
            </span>
            <span className="text-[11px] text-slate-400">
              Expires 12/2028 • Billing Email: {billing.billingContact || "accounts@aifagenlabs.com"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => addToast("Card update modal (frontend mock)", "info")}
          className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
        >
          Update Card
        </button>
      </div>

      {/* Invoice History */}
      <div className="space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Platform Invoices
        </span>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#30363D]">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b text-[10px] font-bold uppercase tracking-wider ${
                darkMode
                  ? "bg-[#0D1117] border-[#30363D] text-slate-400"
                  : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
            >
              <tr>
                <th className="py-2.5 px-3">Invoice Number</th>
                <th className="py-2.5 px-3">Issue Date</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">PDF</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? "divide-[#30363D]" : "divide-slate-200/70"
              }`}
            >
              {(billing.invoices || []).map((inv) => (
                <tr
                  key={inv.id}
                  className={`transition-colors ${
                    darkMode ? "hover:bg-[#161B22]" : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {inv.id}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{inv.date}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {inv.amount}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(inv.id)}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-500 p-1 cursor-pointer transition-colors"
                      title="Download Invoice"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold">PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
