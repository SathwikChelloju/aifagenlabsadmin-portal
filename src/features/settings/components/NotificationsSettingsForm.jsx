import React from "react";
import { Bell, Mail, MessageSquare } from "lucide-react";

export default function NotificationsSettingsForm({
  notifications = {},
  onUpdateField,
  onSave,
  onReset,
  _isDirty = false,
  isSaving = false,
  darkMode = false,
}) {
  const emailToggles = [
    {
      key: "emailJobFailures",
      label: "Job Source Ingestion Failures",
      description: "Notify immediately when crawlers return 403 or queue stall challenges",
    },
    {
      key: "emailFailedPayments",
      label: "Failed Student Subscription Invoices",
      description: "Alert billing operations when a card charge is declined or refunded",
    },
    {
      key: "emailNewRegistrations",
      label: "Candidate Account Registrations",
      description: "Receive batch summaries when new applicants register via user portal",
    },
    {
      key: "emailSecurityAlerts",
      label: "Critical Security Events & Logins",
      description: "Alert when staff login occurs from unrecognized geographic regions",
    },
    {
      key: "emailWeeklyDigest",
      label: "Weekly System Performance Digest",
      description: "Comprehensive weekly digest of jobs retrieved, tokens burned, and ARR",
    },
  ];

  const inAppToggles = [
    {
      key: "inAppCrawlerAlerts",
      label: "Live Crawler Telemetry Warnings",
      description: "Show toast alerts in console when an ingestion poller exceeds 5.0s latency",
    },
    {
      key: "inAppRateLimitWarnings",
      label: "API Rate-Limit Warnings",
      description: "Warn admins when API connector approaches 80% of daily quota",
    },
    {
      key: "inAppDailySystemStatus",
      label: "Daily Morning Standup Broadcast",
      description: "Show a banner modal with overnight sync health every 24 hours",
    },
  ];

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
          Notification Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure real-time alerts, email digests, and external webhook dispatches.
        </p>
      </div>

      {/* Email Notifications */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-500" />
          <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-white" : "text-[#0B192C]"}`}>
            Email Notifications
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {emailToggles.map((item) => (
            <div
              key={item.key}
              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${subCardSurface}`}
            >
              <div className="space-y-0.5 min-w-0">
                <label className="text-xs font-bold block cursor-pointer text-slate-800 dark:text-slate-200">
                  {item.label}
                </label>
                <p className="text-[11px] text-slate-400 leading-snug">{item.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifications[item.key]}
                onClick={() => onUpdateField("notifications", item.key, !notifications[item.key])}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  notifications[item.key] ? "bg-[#D97706]" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                    notifications[item.key] ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* In-App Alerts */}
      <div className="space-y-3 pt-3 border-t border-slate-200/70 dark:border-[#30363D]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-white" : "text-[#0B192C]"}`}>
            In-App Telemetry Alerts
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {inAppToggles.map((item) => (
            <div
              key={item.key}
              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${subCardSurface}`}
            >
              <div className="space-y-0.5 min-w-0">
                <label className="text-xs font-bold block cursor-pointer text-slate-800 dark:text-slate-200">
                  {item.label}
                </label>
                <p className="text-[11px] text-slate-400 leading-snug">{item.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifications[item.key]}
                onClick={() => onUpdateField("notifications", item.key, !notifications[item.key])}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  notifications[item.key] ? "bg-[#D97706]" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                    notifications[item.key] ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* External Slack / Webhook Dispatch */}
      <div className={`p-4 rounded-xl border space-y-3 ${subCardSurface}`}>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-white" : "text-[#0B192C]"}`}>
            Slack Webhook Integration
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Post system alerts and crawler health updates to a designated Slack channel.
        </p>
        <div>
          <input
            type="url"
            value={notifications.slackWebhookUrl || ""}
            onChange={(e) => onUpdateField("notifications", "slackWebhookUrl", e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-mono border focus:outline-none ${
              darkMode ? "bg-[#161B22] border-[#30363D] text-white" : "bg-white border-slate-200"
            }`}
          />
        </div>
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
          {isSaving ? "Saving..." : "Save Notifications"}
        </button>
      </div>
    </div>
  );
}
