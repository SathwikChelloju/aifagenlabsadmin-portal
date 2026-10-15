import React, { useState } from "react";
import {
  Download,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Check,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { downloadCsvFile } from "../services/reportGenerator";

/**
 * StructuredResults Component
 * Renders rich tables, comparisons, recommendations, and functional report previews
 * inside assistant conversation messages with improved readability and font scales.
 */
export default function StructuredResults({ structured, darkMode = false }) {
  const [hasDownloaded, setHasDownloaded] = useState(false);

  if (!structured) return null;

  // 1. DATA TABLE
  if (structured.type === "table") {
    const { columns = [], rows = [], caption, meta } = structured;

    return (
      <div className="space-y-2 mt-3 w-full">
        {caption && (
          <div className="text-[12px] font-mono text-slate-500 dark:text-slate-400">
            {caption}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#0D1117] shadow-2xs max-h-72 overflow-y-auto">
          <table className="w-full text-left text-[13px] sm:text-[14px]">
            <thead
              className={`sticky top-0 z-10 border-b text-[11px] sm:text-[12px] font-bold uppercase tracking-wider ${
                darkMode
                  ? "bg-[#161B22] border-[#30363D] text-slate-300"
                  : "bg-slate-100/90 border-slate-200 text-slate-700"
              }`}
            >
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="py-2.5 px-3 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? "divide-[#30363D]" : "divide-slate-200/80"
              }`}
            >
              {rows.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={`transition-colors ${
                    darkMode ? "hover:bg-[#161B22]/80" : "hover:bg-slate-50"
                  }`}
                >
                  {columns.map((col) => {
                    const val = row[col.key];
                    const isStatus = col.key === "status";
                    const isScore = col.key === "atsScore" || col.key === "matchScore" || col.key === "successRate";
                    const isUrl = col.key === "applicationUrl" || col.key === "jobUrl" || col.key === "url";

                    return (
                      <td
                        key={col.key}
                        className={`py-2 px-3 whitespace-nowrap ${
                          col.key === "name" || col.key === "title"
                            ? "font-bold text-slate-900 dark:text-white"
                            : "text-slate-700 dark:text-slate-200 font-mono"
                        }`}
                      >
                        {isStatus ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] sm:text-[12px] font-semibold ${
                              val === "Active" || val === "Success"
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                : val === "Error" || val === "Failed"
                                ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                                : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                            }`}
                          >
                            {val}
                          </span>
                        ) : isScore ? (
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            {val}
                          </span>
                        ) : isUrl && val && String(val).startsWith("http") ? (
                          <a
                            href={val}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-600 dark:text-amber-400 underline hover:text-amber-500 font-semibold inline-flex items-center gap-1"
                          >
                            <span>{String(val).includes("portal.aifagen") ? "Internal Posting" : "View Listing"}</span>
                          </a>
                        ) : (
                          val ?? "—"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[12px] font-mono text-slate-500 dark:text-slate-400">
            {Object.entries(meta).map(([k, v]) => (
              <span
                key={k}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#21262D] border border-slate-200 dark:border-[#30363D]"
              >
                {k}: <strong className="text-slate-800 dark:text-slate-100">{v}</strong>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. METRIC COMPARISON & AI COSTS
  if (structured.type === "metric_comparison") {
    const { comparison, modelTable, recommendations } = structured;

    return (
      <div className="space-y-3 mt-3 w-full">
        {/* Comparison Header Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#0D1117] shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 dark:border-[#30363D] pb-2.5">
            <div>
              <div className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {comparison.metricName}
              </div>
              <div className="text-[15px] sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                Month-Over-Month Variance Analysis
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-[13px] font-bold ${
                comparison.isIncrease
                  ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                  : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {comparison.isIncrease ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{comparison.percentageDiff}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D]">
              <span className="text-[12px] text-slate-500 dark:text-slate-400 block font-mono font-medium">
                {comparison.currentPeriod}
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-mono block mt-1">
                {comparison.currentValue}
              </span>
              <span className="text-[12px] text-slate-600 dark:text-slate-300 font-mono block mt-0.5">
                {comparison.currentTokens} · {comparison.currentCalls} calls
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D]">
              <span className="text-[12px] text-slate-500 dark:text-slate-400 block font-mono font-medium">
                {comparison.comparisonPeriod}
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-700 dark:text-slate-300 font-mono block mt-1">
                {comparison.comparisonValue}
              </span>
              <span className="text-[12px] text-slate-600 dark:text-slate-300 font-mono block mt-0.5">
                {comparison.previousTokens} · {comparison.previousCalls} calls
              </span>
            </div>
          </div>

          <div className="text-[13px] font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between pt-1">
            <span>Absolute Difference:</span>
            <strong className="text-slate-900 dark:text-white font-bold text-sm">
              {comparison.absoluteDiff}
            </strong>
          </div>
        </div>

        {/* Model Breakdown Mini Table */}
        {modelTable && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#0D1117] shadow-2xs">
            <table className="w-full text-left text-[12px] sm:text-[13px]">
              <thead
                className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                  darkMode
                    ? "bg-[#161B22] border-[#30363D] text-slate-300"
                    : "bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                <tr>
                  {modelTable.columns.map((c) => (
                    <th key={c.key} className="py-2 px-3">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-[#30363D] font-mono">
                {modelTable.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-[#161B22]/70">
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                      {row.model}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{row.provider}</td>
                    <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{row.requests}</td>
                    <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{row.tokens}</td>
                    <td className="py-2 px-3 font-bold text-amber-600 dark:text-amber-400">
                      ${row.cost}
                    </td>
                    <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{row.pctOfTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Recommendations & Pros/Cons */}
        {recommendations && recommendations.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Architectural Analysis & Optimization
            </span>
            <div className="space-y-2.5">
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-[13px] sm:text-[14px] flex items-start gap-2.5 ${
                    rec.type === "pro"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                      : rec.type === "con"
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {rec.type === "pro" ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                    ) : rec.type === "con" ? (
                      <AlertTriangle className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" />
                    ) : (
                      <Lightbulb className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div>
                    <strong className="block text-[13px] font-bold text-slate-900 dark:text-white">
                      {rec.title}
                    </strong>
                    <p className="text-[13px] leading-relaxed mt-0.5 opacity-95">
                      {rec.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. PAGE EXPLANATION CARD
  if (structured.type === "page_explanation") {
    const { title, module, metrics = [], controls = [], capabilities = [] } = structured;

    return (
      <div className="space-y-3 mt-3 w-full">
        {/* Module Banner */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#0D1117] shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
              {module}
            </span>
            <span className="text-[14px] font-bold text-slate-900 dark:text-white">
              {title}
            </span>
          </div>

          {/* Live Metrics Grid */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-slate-100 dark:border-[#21262D]">
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D]"
                >
                  <span className="text-[12px] text-slate-500 dark:text-slate-400 block font-mono truncate">
                    {m.label}
                  </span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono block mt-0.5">
                    {m.value}
                  </span>
                  {m.trend && (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono block mt-0.5">
                      {m.trend}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Primary Controls */}
        {controls.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Key Actions & Controls on This Page
            </span>
            <ul className="space-y-1.5 text-[13px] sm:text-[14px]">
              {controls.map((ctrl, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#21262D] text-slate-800 dark:text-slate-200"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{ctrl}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What You Can Find */}
        {capabilities.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Available Workflows & Telemetry
            </span>
            <ul className="space-y-1 text-[13px]">
              {capabilities.map((cap, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-slate-700 dark:text-slate-300"
                >
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // 4. REPORT PREVIEW & FUNCTIONAL CSV DOWNLOAD
  if (structured.type === "report_preview") {
    const { report } = structured;
    if (!report) return null;

    return (
      <div className="space-y-3 mt-3 w-full">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#0D1117] shadow-2xs space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-200/80 dark:border-[#30363D] pb-3">
            <div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/25">
                AUDITED REPORT READY
              </span>
              <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-900 dark:text-white mt-1">
                {report.title}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => {
                downloadCsvFile(report.filename, report.csvContent);
                setHasDownloaded(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-bold bg-[#D97706] hover:bg-[#B45309] text-white transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              {hasDownloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download CSV</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#161B22] border border-slate-200/60 dark:border-[#30363D]">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">Sync Runs</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono mt-0.5 block">
                {report.summary.totalSyncRuns}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#161B22] border border-slate-200/60 dark:border-[#30363D]">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">Success Rate</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                {report.summary.successRate}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#161B22] border border-slate-200/60 dark:border-[#30363D]">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">Discovered</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono mt-0.5 block">
                {report.summary.jobsDiscovered}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#161B22] border border-slate-200/60 dark:border-[#30363D]">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">New Added</span>
              <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-0.5 block">
                {report.summary.jobsAdded}
              </span>
            </div>
          </div>
        </div>

        {/* Sample Table Preview */}
        {report.tableData && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#0D1117] shadow-2xs max-h-52 overflow-y-auto">
            <table className="w-full text-left text-[12px] sm:text-[13px] font-mono">
              <thead
                className={`sticky top-0 z-10 border-b text-[11px] font-bold uppercase tracking-wider ${
                  darkMode
                    ? "bg-[#161B22] border-[#30363D] text-slate-300"
                    : "bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                <tr>
                  {report.tableData.columns.map((c) => (
                    <th key={c.key} className="py-2 px-3 whitespace-nowrap">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-[#30363D]">
                {report.tableData.rows.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50/70 dark:hover:bg-[#161B22]/70">
                    {report.tableData.columns.map((col) => {
                      const val = row[col.key];
                      const isStatus = col.key === "status" || col.key === "result";
                      const isUrl = col.key === "applicationUrl" || col.key === "jobUrl" || col.key === "url";

                      return (
                        <td
                          key={col.key}
                          className={`py-2 px-3 whitespace-nowrap ${
                            col.key === "title" || col.key === "sourceName"
                              ? "font-bold text-slate-900 dark:text-white"
                              : "text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {isStatus ? (
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold ${
                                val === "Active" || val === "Success"
                                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                  : val === "Error" || val === "Failed"
                                  ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                                  : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                              }`}
                            >
                              {val}
                            </span>
                          ) : isUrl && val && String(val).startsWith("http") ? (
                            <a
                              href={val}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-600 dark:text-amber-400 underline hover:text-amber-500 font-semibold inline-flex items-center gap-1"
                            >
                              <span>{String(val).includes("portal.aifagen") ? "Internal Posting" : "View Listing"}</span>
                            </a>
                          ) : (
                            val ?? "—"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // 5. STATS GRID (MACRO SNAPSHOT)
  if (structured.type === "stats_grid") {
    const { metrics = [] } = structured;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3 w-full">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#0D1117] shadow-2xs"
          >
            <span className="text-[12px] text-slate-500 dark:text-slate-400 font-mono block truncate">
              {m.label}
            </span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono block mt-0.5">
              {m.value}
            </span>
            {m.detail && (
              <span className="text-[12px] text-amber-600 dark:text-amber-400 font-mono mt-0.5 block">
                {m.detail}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // 6. WELCOME CAPABILITIES CARD
  if (structured.type === "welcome") {
    const { quickCapabilities = [] } = structured;

    return (
      <div className="p-4 rounded-xl border border-slate-200 dark:border-[#30363D] bg-slate-50/90 dark:bg-[#0D1117] space-y-2.5 mt-2.5">
        <span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Core Capabilities Available</span>
        </span>
        <ul className="space-y-2 text-[13px] sm:text-[14px] text-slate-700 dark:text-slate-200">
          {quickCapabilities.map((cap, i) => (
            <li key={i} className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: cap.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>'),
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}
