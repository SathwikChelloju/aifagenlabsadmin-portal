import React, { useState } from "react";
import {
  RefreshCw,
  Play,
  Pause,
  Edit2,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lock,
  Settings,
} from "lucide-react";
import Drawer from "../../../components/ui/Drawer";
import SourceLogo from "./SourceLogo";
import {
  getSourceStatusBadge,
  getSourceTypeMeta,
  formatSourceTimestamp,
  calculateSourceSuccessRate,
} from "../utils/jobSourceUtils";

/**
 * JobSourceDetailsDrawer Component (Section G)
 * Right-hand slide-out drawer featuring 3 tabs:
 * 1. Overview: Name, type, status, endpoint, description, last sync, last successful sync,
 *    total jobs, jobs today, success rate, avg duration, API request usage & rate limits.
 * 2. Sync History: Recent sync events, start/completion times, success/warning/failure,
 *    jobs discovered, added, updated, skipped, error details.
 * 3. Configuration: Ingestion settings, batch size, retry policy, timeout, masked credentials,
 *    and Edit Source action.
 */
export default function JobSourceDetailsDrawer({
  isOpen,
  onClose,
  source,
  syncHistory = [],
  onSync,
  onToggleStatus,
  onEdit,
  isSyncing = false,
  darkMode = false,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedKey, setCopiedKey] = useState(false);

  if (!source) return null;

  const statusMeta = getSourceStatusBadge(source.status, darkMode);
  const typeMeta = getSourceTypeMeta(source.type, darkMode);
  const isPaused = source.status === "Paused";

  // Filter history for this source
  const sourceHistory = syncHistory
    .filter((h) => h.sourceId === source.id)
    .sort((a, b) => new Date(b.startTime || b.timestamp) - new Date(a.startTime || a.timestamp));

  const totalRuns = sourceHistory.length;
  const successRuns = sourceHistory.filter((h) => h.result === "Success").length;
  const failedRuns = sourceHistory.filter((h) => h.result === "Failed").length;
  const successRate = calculateSourceSuccessRate(syncHistory, source.id);

  // Calculate average duration for this source
  const numericDurations = sourceHistory
    .map((h) => {
      if (!h.duration) return null;
      if (h.duration.endsWith("ms")) return parseFloat(h.duration) / 1000;
      if (h.duration.endsWith("s")) return parseFloat(h.duration);
      if (h.duration.includes("m")) {
        const parts = h.duration.split("m");
        return parseFloat(parts[0]) * 60 + (parseFloat(parts[1]) || 0);
      }
      return null;
    })
    .filter((d) => d !== null);

  const avgDuration =
    numericDurations.length > 0
      ? `${(numericDurations.reduce((a, b) => a + b, 0) / numericDurations.length).toFixed(1)}s`
      : source.latency || "--";

  const handleCopyEndpoint = () => {
    if (source.endpoint) {
      navigator.clipboard.writeText(source.endpoint);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "history", label: `Sync History (${sourceHistory.length})` },
    { id: "configuration", label: "Configuration" },
  ];

  const cardInnerBg = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/80 border-slate-200/80";

  const customHeader = (
    <div className="flex items-start gap-3.5 w-full">
      <SourceLogo
        name={source.name}
        logoKey={source.logoKey}
        size="lg"
        className="shrink-0 mt-0.5"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={`text-base font-extrabold truncate ${
              darkMode ? "text-white" : "text-[#0B192C]"
            }`}
          >
            {source.name}
          </h3>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusMeta.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
            {statusMeta.label}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
          <span className="font-mono text-[11px]">{source.id}</span>
          <span>·</span>
          <span
            className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold border ${typeMeta.badgeClass}`}
          >
            {typeMeta.label}
          </span>
        </div>
      </div>
    </div>
  );

  const customFooter = (
    <div
      className={`p-4 sm:p-5 border-t flex flex-wrap items-center justify-between gap-3 ${
        darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onToggleStatus && onToggleStatus(source)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
            darkMode
              ? "bg-[#0D1117] border-[#30363D] text-slate-300 hover:bg-[#21262D]"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-500" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-500" />
              Pause
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            if (onEdit) onEdit(source);
          }}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
            darkMode
              ? "bg-[#0D1117] border-[#30363D] text-slate-300 hover:bg-[#21262D]"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Edit2 className="w-3.5 h-3.5 text-slate-400" />
          Edit
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            darkMode
              ? "text-slate-400 hover:text-white"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Close
        </button>

        <button
          type="button"
          disabled={isSyncing}
          onClick={() => onSync && onSync(source)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B192C] hover:bg-slate-800 dark:bg-[#D97706] dark:hover:bg-[#B45309] shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`}
          />
          {isSyncing ? "Syncing..." : "Sync Now"}
        </button>
      </div>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      customHeader={customHeader}
      footer={customFooter}
      width="max-w-md sm:max-w-xl"
      darkMode={darkMode}
      contentClassName="p-0 flex flex-col h-full overflow-hidden"
    >
      {/* Sub-navigation Tabs */}
      <div
        className={`px-5 pt-2 border-b flex items-center gap-2 overflow-x-auto shrink-0 ${
          darkMode ? "border-[#30363D] bg-[#0D1117]/50" : "border-slate-200 bg-slate-50/50"
        }`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "border-[#D97706] text-[#D97706]"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* 4 Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className={`p-3 rounded-2xl border text-center ${cardInnerBg}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Jobs
                </div>
                <div
                  className={`text-base font-extrabold mt-1 font-mono ${
                    darkMode ? "text-white" : "text-[#0B192C]"
                  }`}
                >
                  {(source.jobsRetrieved || source.totalJobsRetrieved || 0).toLocaleString()}
                </div>
              </div>

              <div className={`p-3 rounded-2xl border text-center ${cardInnerBg}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Jobs Today
                </div>
                <div className="text-base font-extrabold mt-1 font-mono text-emerald-600 dark:text-emerald-400">
                  +{source.jobsRetrievedToday ?? source.jobsToday ?? 0}
                </div>
              </div>

              <div className={`p-3 rounded-2xl border text-center ${cardInnerBg}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Success Rate
                </div>
                <div
                  className={`text-base font-extrabold mt-1 font-mono ${
                    darkMode ? "text-white" : "text-[#0B192C]"
                  }`}
                >
                  {successRate}
                </div>
              </div>

              <div className={`p-3 rounded-2xl border text-center ${cardInnerBg}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Avg Duration
                </div>
                <div
                  className={`text-base font-extrabold mt-1 font-mono ${
                    darkMode ? "text-white" : "text-[#0B192C]"
                  }`}
                >
                  {avgDuration}
                </div>
              </div>
            </div>

            {/* Ingestion & Telemetry Details Grid */}
            <div className="space-y-2.5">
              <h4
                className={`text-xs font-bold uppercase tracking-wider ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Ingestion Endpoint & Health
              </h4>

              <div className={`rounded-2xl border p-4 space-y-3 text-xs ${cardInnerBg}`}>
                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-400">Endpoint / URL</span>
                  <div className="flex items-center gap-1.5 max-w-[280px]">
                    <span className="font-mono truncate text-[11px] font-medium">
                      {source.endpoint || "internal://cdc-stream"}
                    </span>
                    {source.endpoint && (
                      <button
                        type="button"
                        onClick={handleCopyEndpoint}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title="Copy Endpoint"
                      >
                        {copiedKey ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-400">Last Sync</span>
                  <span className="font-medium font-mono text-[11px]">
                    {formatSourceTimestamp(source.lastSync)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-400">Last Successful Sync</span>
                  <span className="font-medium font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    {formatSourceTimestamp(source.lastSuccessSync || source.lastSync)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Poll Frequency</span>
                  <span className="font-semibold">
                    {source.frequency || "Hourly Polling"}
                  </span>
                </div>
              </div>
            </div>

            {/* API Request Usage & Limits (Section G & I) */}
            <div className="space-y-2.5">
              <h4
                className={`text-xs font-bold uppercase tracking-wider ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                API Usage & Quota Limit
              </h4>

              <div className={`rounded-2xl border p-4 space-y-3 text-xs ${cardInnerBg}`}>
                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-400">Requests Today</span>
                  <span className="font-mono font-bold">
                    {(source.apiUsage?.requestsToday || 0).toLocaleString()} reqs
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-400">Requests (Last 30 Days)</span>
                  <span className="font-mono font-bold">
                    {(source.apiUsage?.requests30Days || 0).toLocaleString()} reqs
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Configured Rate Limit</span>
                  <span className="font-mono">
                    {source.apiUsage?.requestLimit ? (
                      <span className="font-bold text-slate-900 dark:text-white">
                        {source.apiUsage.requestLimit.toLocaleString()} reqs / day
                      </span>
                    ) : (
                      <span className="italic text-slate-400">Not configured</span>
                    )}
                  </span>
                </div>

                {source.apiUsage?.requestLimit && (
                  <div className="pt-1">
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#D97706]"
                        style={{
                          width: `${Math.min(
                            Math.round(
                              ((source.apiUsage.requestsToday || 0) /
                                source.apiUsage.requestLimit) *
                                100
                            ),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4
                className={`text-xs font-bold uppercase tracking-wider ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Source Description
              </h4>
              <p
                className={`text-xs leading-relaxed p-4 rounded-2xl border ${cardInnerBg} ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {source.description ||
                  "Ingests automated vacancy records directly into AIFA GEN LABS matching queues."}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: SYNC HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className={`p-2.5 rounded-xl border text-center ${cardInnerBg}`}>
                <div className="text-[10px] text-slate-400 font-semibold">Total Runs</div>
                <div className="text-sm font-bold font-mono mt-0.5">{totalRuns}</div>
              </div>
              <div className={`p-2.5 rounded-xl border text-center ${cardInnerBg}`}>
                <div className="text-[10px] text-slate-400 font-semibold">Successful</div>
                <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {successRuns}
                </div>
              </div>
              <div className={`p-2.5 rounded-xl border text-center ${cardInnerBg}`}>
                <div className="text-[10px] text-slate-400 font-semibold">Failed</div>
                <div className="text-sm font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">
                  {failedRuns}
                </div>
              </div>
            </div>

            {sourceHistory.length === 0 ? (
              <div
                className={`p-8 text-center rounded-2xl border ${cardInnerBg} space-y-2`}
              >
                <Clock className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-400">
                  No recorded sync runs for this source yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sourceHistory.map((item) => {
                  const isSuccess = item.result === "Success";
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border text-xs transition-colors space-y-2.5 ${cardInnerBg}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isSuccess ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                          <span className="font-bold">
                            {isSuccess ? "Sync Succeeded" : "Sync Failed"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatSourceTimestamp(item.startTime || item.timestamp)}
                        </span>
                      </div>

                      {/* Start and completion times */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>
                          Run duration: <strong className="text-slate-700 dark:text-slate-200">{item.duration || "1.2s"}</strong>
                        </span>
                        <span>
                          {item.startTime ? new Date(item.startTime).toLocaleTimeString() : "--"} -{" "}
                          {item.completionTime ? new Date(item.completionTime).toLocaleTimeString() : "--"}
                        </span>
                      </div>

                      {/* Discovered / Added / Updated / Skipped breakdown */}
                      <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-800 text-[10px] text-center font-mono">
                        <div className="p-1 rounded bg-slate-200/40 dark:bg-slate-800/60">
                          <div className="text-slate-400 text-[9px]">Discovered</div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {item.jobsDiscovered ?? 0}
                          </div>
                        </div>
                        <div className="p-1 rounded bg-slate-200/40 dark:bg-slate-800/60">
                          <div className="text-slate-400 text-[9px]">Added</div>
                          <div className="font-bold text-emerald-600 dark:text-emerald-400">
                            +{item.jobsAdded ?? item.newJobs ?? 0}
                          </div>
                        </div>
                        <div className="p-1 rounded bg-slate-200/40 dark:bg-slate-800/60">
                          <div className="text-slate-400 text-[9px]">Updated</div>
                          <div className="font-bold text-blue-600 dark:text-blue-400">
                            {item.jobsUpdated ?? item.updatedJobs ?? 0}
                          </div>
                        </div>
                        <div className="p-1 rounded bg-slate-200/40 dark:bg-slate-800/60">
                          <div className="text-slate-400 text-[9px]">Skipped</div>
                          <div className="font-bold text-slate-500">
                            {item.jobsSkipped ?? 0}
                          </div>
                        </div>
                      </div>

                      {/* Error details if any */}
                      {(item.errorSummary || item.error) && (
                        <div className="mt-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-[11px] font-mono">
                          {item.errorSummary || item.error}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONFIGURATION */}
        {activeTab === "configuration" && (
          <div className="space-y-5">
            <div className={`p-4 rounded-2xl border space-y-3 text-xs ${cardInnerBg}`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-[#D97706]" />
                  Pipeline Ingestion Settings
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onEdit) onEdit(source);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#D97706] hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit Settings
                </button>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-400">Ingestion Protocol</span>
                  <span className="font-mono">{source.protocol || "HTTPS / REST"}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-400">Poll Frequency</span>
                  <span className="font-semibold">{source.frequency || "Hourly"}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-400">Batch Ingest Size</span>
                  <span className="font-mono">{source.config?.batchSize || 50} jobs / batch</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800">
                  <span className="text-slate-400">Retry Policy</span>
                  <span>{source.config?.retryPolicy || "3 retries with exponential backoff"}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">HTTP Timeout</span>
                  <span className="font-mono">{source.config?.timeout || "30s"}</span>
                </div>
              </div>
            </div>

            {/* Masked Credentials & Security (never exposes plaintext secrets) */}
            <div className={`p-4 rounded-2xl border space-y-3 text-xs ${cardInnerBg}`}>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Lock className="w-4 h-4 text-[#D97706]" />
                Security & Credential Placeholders
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Authentication Method</span>
                  <span className="font-semibold">
                    {source.authMethod || "Bearer Token Header"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Masked Credential</span>
                  <span className="font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {source.maskedSecret || source.maskedKey || "••••••••••••3821"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Encryption In-Transit</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> TLS 1.3 Strict
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic pt-1">
                * Plaintext secrets and API tokens are never exposed or returned to the browser client.
              </p>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
