import React from "react";
import Modal from "../../../components/ui/Modal";
import { GitMerge, Split, Sparkles, Building2, MapPin, DollarSign, Calendar } from "lucide-react";

/**
 * DuplicateReviewModal Component
 * Interactive review modal allowing human operator to examine potential duplicate job records
 * side-by-side and choose between:
 * - "Merge & Keep Primary"
 * - "Keep Both as Distinct"
 * - "Dismiss"
 */
export default function DuplicateReviewModal({
  isOpen,
  onClose,
  duplicateRecord = null,
  onResolve,
  darkMode = false,
}) {
  if (!duplicateRecord) return null;

  const cardInnerBg = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/80 border-slate-200/80";

  const handleAction = (action) => {
    if (onResolve) {
      onResolve(duplicateRecord.id, action);
    }
    onClose();
  };

  const srcA = duplicateRecord.sources?.[0] || {};
  const srcB = duplicateRecord.sources?.[1] || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Duplicate Job Review"
      description={`Confidence Score: ${duplicateRecord.confidenceScore}% similarity detected across multiple pipelines.`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 pt-2 text-xs">
        {/* Match Reason Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-amber-800 dark:text-amber-300">
            <span className="font-bold">Algorithmic Match Reason:</span>{" "}
            {duplicateRecord.matchReason}
          </div>
        </div>

        {/* Side-by-Side Ingested Records */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Source A */}
          <div className={`p-4 rounded-2xl border space-y-2.5 ${cardInnerBg}`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-[11px] text-[#0A66C2]">Source 1</span>
              <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {srcA.name || "Primary Source"}
              </span>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {duplicateRecord.jobTitle}
              </h5>
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>{duplicateRecord.company}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{srcA.location || "Remote"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>{srcA.salary || "Competitive"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>Posted: {srcA.postedDate || "Recently"}</span>
              </div>
            </div>
          </div>

          {/* Source B */}
          <div className={`p-4 rounded-2xl border space-y-2.5 ${cardInnerBg}`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-[11px] text-[#2164F3]">Source 2</span>
              <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {srcB.name || "Secondary Source"}
              </span>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {duplicateRecord.jobTitle}
              </h5>
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>{duplicateRecord.company}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{srcB.location || "Remote"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>{srcB.salary || "Competitive"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>Posted: {srcB.postedDate || "Recently"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Note */}
        <p className="text-[11px] text-slate-400 leading-relaxed italic">
          * Policy Note: AIFA GEN LABS never automatically purges jobs on algorithmic confidence alone.
          Human operator confirmation is enforced to maintain historical candidate placement integrity.
        </p>

        {/* Resolution Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleAction("DISMISS")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              darkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Dismiss
          </button>

          <button
            type="button"
            onClick={() => handleAction("KEEP_BOTH")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              darkMode
                ? "bg-[#0D1117] border-[#30363D] text-slate-200 hover:bg-[#21262D]"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Split className="w-3.5 h-3.5 text-slate-500" />
            Keep Both as Distinct
          </button>

          <button
            type="button"
            onClick={() => handleAction("MERGE")}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B192C] hover:bg-slate-800 dark:bg-[#D97706] dark:hover:bg-[#B45309] shadow-xs transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
          >
            <GitMerge className="w-3.5 h-3.5" />
            Merge & Keep Primary
          </button>
        </div>
      </div>
    </Modal>
  );
}
