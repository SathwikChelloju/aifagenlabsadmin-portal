import React from "react";
import { Download, ShieldCheck } from "lucide-react";
import { mockStore } from "../../../mocks/mockStore";
import { useToast } from "../../../hooks/useToast";

export default function AuditRetentionSettingsForm({
  auditRetention = {},
  onUpdateField,
  onSave,
  onReset,
  _isDirty = false,
  isSaving = false,
  darkMode = false,
}) {
  const { addToast } = useToast();

  const handleExportAuditTrail = () => {
    try {
      const logs = (mockStore.state && mockStore.state.auditLogs) || [];
      const headers = ["ID", "Timestamp", "Admin", "Action", "Target", "Details", "Reason"];
      const rows = logs.map((l) => [
        `"${l.id || ""}"`,
        `"${l.timestamp || ""}"`,
        `"${l.admin || ""}"`,
        `"${l.action || ""}"`,
        `"${l.target || ""}"`,
        `"${(l.details || "").replace(/"/g, '""')}"`,
        `"${(l.reason || "").replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `aifa-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast(`Exported ${logs.length} audit event records to CSV.`, "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to generate audit export.", "error");
    }
  };

  const cardSurface = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90 shadow-2xs";

  const subCardSurface = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/70 border-slate-200/80";

  const selectClass = `w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors cursor-pointer ${
    darkMode
      ? "bg-[#0D1117] border border-[#30363D] text-slate-200 focus:border-amber-500"
      : "bg-slate-50/80 border border-slate-200 text-slate-900 focus:border-amber-500"
  }`;

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 transition-colors space-y-7 ${cardSurface}`}>
      <div>
        <h2
          className={`text-lg font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-[#0B192C]"
          }`}
        >
          Audit Logging & Data Retention Policies
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure immutable audit storage duration, data lifecycle purges, and regulatory exports.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Retention Duration */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Audit Event Retention Window
          </label>
          <select
            value={auditRetention.retentionDays || "365 Days (1 Year)"}
            onChange={(e) => onUpdateField("auditRetention", "retentionDays", e.target.value)}
            className={selectClass}
          >
            <option value="90 Days">90 Days (Quarterly Flush)</option>
            <option value="180 Days">180 Days (Half-Yearly)</option>
            <option value="365 Days (1 Year)">365 Days (1 Year - Recommended)</option>
            <option value="3 Years">3 Years (Enterprise Compliance)</option>
            <option value="Indefinite">Indefinite (Never Purge Logs)</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Audit events older than this threshold will be archived to cold storage.
          </p>
        </div>

        {/* Verbosity Level */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Logging Verbosity Level
          </label>
          <select
            value={auditRetention.activityLoggingVerbosity || "Standard (Events & Mutations)"}
            onChange={(e) =>
              onUpdateField("auditRetention", "activityLoggingVerbosity", e.target.value)
            }
            className={selectClass}
          >
            <option value="Standard (Events & Mutations)">Standard (Mutations & Sign-ins)</option>
            <option value="Verbose (Includes Read Operations)">Verbose (Includes Candidate Profile Views)</option>
            <option value="Minimal (Critical Errors Only)">Minimal (Security Alerts Only)</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Controls telemetry detail captured in the Audit Logs console module.
          </p>
        </div>
      </div>

      {/* Switches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${subCardSurface}`}
        >
          <div className="space-y-0.5 min-w-0">
            <span className={`text-xs font-bold block ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
              Auto-Purge Soft Deleted Jobs
            </span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Permanently expunge trashed jobs after 30 days
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={auditRetention.autoPurgeSoftDeleted}
            onClick={() =>
              onUpdateField(
                "auditRetention",
                "autoPurgeSoftDeleted",
                !auditRetention.autoPurgeSoftDeleted
              )
            }
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              auditRetention.autoPurgeSoftDeleted ? "bg-[#D97706]" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                auditRetention.autoPurgeSoftDeleted ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div
          className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${subCardSurface}`}
        >
          <div className="space-y-0.5 min-w-0">
            <span className={`text-xs font-bold block ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
              Anonymize Candidate PII
            </span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Mask candidate emails in audit trail after 180 days (GDPR)
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={auditRetention.anonymizeCandidatePii}
            onClick={() =>
              onUpdateField(
                "auditRetention",
                "anonymizeCandidatePii",
                !auditRetention.anonymizeCandidatePii
              )
            }
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              auditRetention.anonymizeCandidatePii ? "bg-[#D97706]" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                auditRetention.anonymizeCandidatePii ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Export System Audit Trail Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${subCardSurface}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Export Official Audit Trail (CSV)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Download all recorded administration events, security mutations, and crawler state history.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAuditTrail}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B192C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors shadow-2xs shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-200/70 dark:border-[#30363D] flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onReset}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
            darkMode
              ? "bg-[#21262D] border-[#30363D] text-slate-300 hover:text-white"
              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0B192C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Retention Policy"}
        </button>
      </div>
    </div>
  );
}
