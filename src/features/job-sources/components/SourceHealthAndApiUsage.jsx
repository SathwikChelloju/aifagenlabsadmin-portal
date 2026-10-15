import React from "react";
import {
  HeartPulse,
  Gauge,
  Clock,
  AlertTriangle,
  Activity,
  ShieldAlert,
} from "lucide-react";

/**
 * SourceHealthAndApiUsage Component
 * Covers:
 * Section H: Source Health Overview (Success Rate, Avg Duration, Failed Syncs 30d, Rate-limit errors)
 * Section I: API Usage & Rate Limits (Requests today, Requests 30d, Quota limit & progress, Rate-limit errors)
 */
export default function SourceHealthAndApiUsage({
  sources = [],
  syncHistory = [],
  darkMode = false,
}) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const innerCardBg = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/80 border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  // Section H Calculations:
  // 1. Average Sync Success Rate
  const totalSyncAttempts = syncHistory.length;
  const successfulSyncs = syncHistory.filter((h) => h.result === "Success").length;
  const avgSuccessRate =
    totalSyncAttempts > 0
      ? `${((successfulSyncs / totalSyncAttempts) * 100).toFixed(1)}%`
      : "--";

  // 2. Average Sync Duration
  const numericDurations = syncHistory
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
      : "--";

  // 3. Failed Syncs in last 30 days
  const failedSyncsCount = syncHistory.filter((h) => h.result === "Failed").length;

  // 4. Rate-limit errors
  const rateLimitErrorsTotal = sources.reduce(
    (sum, s) => sum + (s.apiUsage?.rateLimitErrors || 0),
    0
  );

  // Section I Calculations:
  const requestsTodayTotal = sources.reduce(
    (sum, s) => sum + (s.apiUsage?.requestsToday || 0),
    0
  );

  const requests30dTotal = sources.reduce(
    (sum, s) => sum + (s.apiUsage?.requests30Days || 0),
    0
  );

  // Sum of configured limits (only where limit is a positive number)
  const configuredSources = sources.filter(
    (s) => typeof s.apiUsage?.requestLimit === "number" && s.apiUsage.requestLimit > 0
  );

  const totalQuotaLimit = configuredSources.reduce(
    (sum, s) => sum + s.apiUsage.requestLimit,
    0
  );

  const totalQuotaUsed = configuredSources.reduce(
    (sum, s) => sum + (s.apiUsage?.requestsToday || 0),
    0
  );

  const quotaPercent =
    totalQuotaLimit > 0
      ? Math.min(Math.round((totalQuotaUsed / totalQuotaLimit) * 100), 100)
      : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* SECTION H: SOURCE HEALTH OVERVIEW */}
      <div
        className={`border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors ${cardBg}`}
      >
        <div className="pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider mb-1 border border-emerald-200/60 dark:border-emerald-800/50">
            <HeartPulse className="w-3 h-3" />
            Telemetry Health
          </div>
          <h3 className={`text-base font-extrabold ${headingText}`}>
            Source Health Overview
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            Real-time pipeline stability, execution latency, and error thresholds.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          {/* 1. Avg Success Rate */}
          <div className={`p-3.5 rounded-2xl border text-center ${innerCardBg}`}>
            <div className="flex items-center justify-center text-emerald-500 mb-1.5">
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Avg Success Rate
            </div>
            <div
              className={`text-lg font-extrabold font-mono mt-1 ${
                avgSuccessRate !== "--" && parseFloat(avgSuccessRate) >= 90
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-500"
              }`}
            >
              {avgSuccessRate}
            </div>
          </div>

          {/* 2. Avg Sync Duration */}
          <div className={`p-3.5 rounded-2xl border text-center ${innerCardBg}`}>
            <div className="flex items-center justify-center text-sky-500 mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Avg Duration
            </div>
            <div
              className={`text-lg font-extrabold font-mono mt-1 ${
                darkMode ? "text-white" : "text-[#0B192C]"
              }`}
            >
              {avgDuration}
            </div>
          </div>

          {/* 3. Failed Syncs 30d */}
          <div className={`p-3.5 rounded-2xl border text-center ${innerCardBg}`}>
            <div className="flex items-center justify-center text-rose-500 mb-1.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Failed (30d)
            </div>
            <div className="text-lg font-extrabold font-mono mt-1 text-rose-600 dark:text-rose-400">
              {failedSyncsCount}
            </div>
          </div>

          {/* 4. Rate-Limit Errors */}
          <div className={`p-3.5 rounded-2xl border text-center ${innerCardBg}`}>
            <div className="flex items-center justify-center text-amber-500 mb-1.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Rate Limit Hits
            </div>
            <div
              className={`text-lg font-extrabold font-mono mt-1 ${
                rateLimitErrorsTotal > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-slate-500"
              }`}
            >
              {rateLimitErrorsTotal}
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
          <span>Active connectors: {sources.filter((s) => s.status === "Active").length} / {sources.length}</span>
          <span className="font-mono">Last full telemetry cycle: 2m ago</span>
        </div>
      </div>

      {/* SECTION I: API USAGE & RATE LIMITS */}
      <div
        className={`border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors ${cardBg}`}
      >
        <div className="pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider mb-1 border border-blue-200/60 dark:border-blue-800/50">
            <Gauge className="w-3 h-3" />
            Ingress Quota & Throttle
          </div>
          <h3 className={`text-base font-extrabold ${headingText}`}>
            API Usage & Rate Limits
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            Requests consumed, remaining provider bandwidth, and throttling warnings.
          </p>
        </div>

        {/* Quota Progress Meter */}
        <div className="my-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={darkMode ? "text-slate-300" : "text-slate-700"}>
              Daily Quota Consumption
            </span>
            <span className="font-mono text-slate-500">
              {totalQuotaLimit > 0 ? (
                <>
                  <strong className="text-slate-900 dark:text-white">
                    {totalQuotaUsed.toLocaleString()}
                  </strong>{" "}
                  / {totalQuotaLimit.toLocaleString()} reqs ({quotaPercent}%)
                </>
              ) : (
                <span className="italic text-slate-400">Not configured</span>
              )}
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                quotaPercent > 85
                  ? "bg-rose-500"
                  : quotaPercent > 60
                  ? "bg-amber-500"
                  : "bg-blue-500"
              }`}
              style={{ width: `${Math.max(quotaPercent, 2)}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 my-2">
          <div className={`p-3 rounded-xl border text-center ${innerCardBg}`}>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Requests Today
            </div>
            <div className="text-base font-extrabold font-mono mt-1 text-slate-900 dark:text-white">
              {requestsTodayTotal.toLocaleString()}
            </div>
          </div>

          <div className={`p-3 rounded-xl border text-center ${innerCardBg}`}>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Requests (30d)
            </div>
            <div className="text-base font-extrabold font-mono mt-1 text-slate-900 dark:text-white">
              {requests30dTotal.toLocaleString()}
            </div>
          </div>

          <div className={`p-3 rounded-xl border text-center ${innerCardBg}`}>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Throttled / 429s
            </div>
            <div className="text-base font-extrabold font-mono mt-1 text-slate-900 dark:text-white">
              {rateLimitErrorsTotal}
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
          <span>{configuredSources.length} sources with strict rate quotas</span>
          <span className="text-[10px] font-mono">Reset at 00:00 UTC</span>
        </div>
      </div>
    </div>
  );
}
