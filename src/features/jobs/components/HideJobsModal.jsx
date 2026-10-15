import React, { useState } from "react";
import { EyeOff, X, AlertTriangle } from "lucide-react";

/**
 * HideJobsModal Component
 * Confirmation dialog before applying Hide action to selected jobs.
 *
 * Confirms:
 * "Hide X selected jobs? These jobs will be hidden from their normal listings
 * but will remain available for administrative management."
 */
export default function HideJobsModal({
  isOpen,
  onClose,
  onConfirm,
  count = 1,
  darkMode = false,
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error("Failed to hide jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200";
  const titleColor = darkMode ? "text-white" : "text-[#0B192C]";
  const descColor = darkMode ? "text-slate-300" : "text-slate-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md border rounded-2xl p-6 shadow-2xl relative transition-all ${cardBg}`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/40 shrink-0">
            <EyeOff className="w-6 h-6" />
          </div>

          <div className="space-y-1 pr-4">
            <h3 className={`text-base font-bold ${titleColor}`}>
              Hide {count} selected {count === 1 ? "job" : "jobs"}?
            </h3>
            <p className={`text-xs leading-relaxed ${descColor}`}>
              These jobs will be hidden from the candidate/user-facing portal, but will
              remain visible right here in the Admin Console with a{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">"Hidden"</span> badge.
            </p>
          </div>
        </div>

        {/* Callout Notice */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200/80 dark:border-[#30363D] text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Their Active, Paused, or Closed status will remain unchanged.</span>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#21262D] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#D97706] hover:bg-[#B45309] shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Hiding...</span>
              </>
            ) : (
              <span>Hide {count === 1 ? "Job" : "Jobs"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
