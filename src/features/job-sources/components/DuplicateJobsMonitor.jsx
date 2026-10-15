import React, { useState } from "react";
import { CopyCheck, Eye, AlertCircle, CheckCircle2 } from "lucide-react";
import DuplicateReviewModal from "./DuplicateReviewModal";

/**
 * DuplicateJobsMonitor Component (Section J)
 * Shows:
 * - Jobs received
 * - Potential duplicates
 * - Unique jobs retained
 * - Small review table for potential duplicates with title, sources, confidence score, and review action.
 */
export default function DuplicateJobsMonitor({
  duplicateJobs = [],
  sources = [],
  onResolveDuplicate,
  darkMode = false,
}) {
  const [selectedDuplicate, setSelectedDuplicate] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const innerCardBg = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/80 border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  // Total jobs received across sources
  const totalJobsReceived = sources.reduce(
    (sum, s) => sum + (Number(s.totalJobsRetrieved) || 0),
    0
  );

  const pendingDuplicates = duplicateJobs.filter(
    (d) => d.status === "Pending Review"
  ).length;

  const uniqueJobsRetained = Math.max(totalJobsReceived - pendingDuplicates, 0);

  const handleOpenReview = (record) => {
    setSelectedDuplicate(record);
    setIsReviewOpen(true);
  };

  return (
    <div
      className={`border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors ${cardBg}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 text-[10px] font-extrabold uppercase tracking-wider mb-1 border border-sky-200/60 dark:border-sky-800/50">
            <CopyCheck className="w-3 h-3" />
            Entity Resolution
          </div>
          <h3 className={`text-base font-extrabold ${headingText}`}>
            Duplicate Jobs Monitor
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            Cross-pipeline canonical deduplication using cosine title similarity and employer hashes.
          </p>
        </div>

        {/* 3 Summary KPIs */}
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl border text-center ${innerCardBg}`}>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Jobs Ingested
            </span>
            <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
              {totalJobsReceived.toLocaleString()}
            </span>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border text-center ${innerCardBg}`}>
            <span className="text-[10px] uppercase font-bold text-amber-500 block">
              Duplicates
            </span>
            <span className="text-sm font-extrabold font-mono text-amber-600 dark:text-amber-400">
              {pendingDuplicates}
            </span>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border text-center ${innerCardBg}`}>
            <span className="text-[10px] uppercase font-bold text-emerald-500 block">
              Unique Retained
            </span>
            <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {uniqueJobsRetained.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Potential Duplicates Small Table */}
      <div className="my-4 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              className={`border-b text-[10px] uppercase font-bold tracking-wider text-slate-400 ${
                darkMode ? "border-[#30363D]" : "border-slate-200"
              }`}
            >
              <th className="py-2.5 px-3">Job Title & Company</th>
              <th className="py-2.5 px-3">Overlapping Sources</th>
              <th className="py-2.5 px-3 text-center">Confidence</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              darkMode ? "divide-[#30363D]/60" : "divide-slate-100"
            }`}
          >
            {duplicateJobs.map((record) => {
              const isPending = record.status === "Pending Review";
              return (
                <tr
                  key={record.id}
                  className={`transition-colors ${
                    darkMode ? "hover:bg-[#1F242C]" : "hover:bg-slate-50"
                  }`}
                >
                  {/* Job Title & Company */}
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900 dark:text-white truncate max-w-[240px]">
                      {record.jobTitle}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {record.company}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[10px]">{record.id}</span>
                    </div>
                  </td>

                  {/* Sources Involved */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {record.sources.map((s, idx) => (
                        <span
                          key={idx}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                            darkMode
                              ? "bg-slate-800 text-slate-300 border-slate-700"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Confidence */}
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                        record.confidenceScore >= 95
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60"
                      }`}
                    >
                      {record.confidenceScore}%
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isPending
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60"
                      }`}
                    >
                      {isPending ? (
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      )}
                      {record.status}
                    </span>
                  </td>

                  {/* Review Action */}
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenReview(record)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                        isPending
                          ? "bg-[#0B192C] text-white hover:bg-slate-800 dark:bg-[#D97706] dark:hover:bg-[#B45309]"
                          : darkMode
                          ? "bg-[#0D1117] border-[#30363D] text-slate-300 hover:bg-[#21262D]"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isPending ? "Review" : "View Details"}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      <DuplicateReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        duplicateRecord={selectedDuplicate}
        onResolve={onResolveDuplicate}
        darkMode={darkMode}
      />
    </div>
  );
}
