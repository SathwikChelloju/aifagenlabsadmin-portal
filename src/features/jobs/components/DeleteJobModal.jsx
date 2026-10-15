import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import { AlertTriangle } from "lucide-react";

/**
 * DeleteJobModal Component
 * Confirmation dialog before removing a job listing from the mock database.
 */
export default function DeleteJobModal({
  job,
  isOpen,
  onClose,
  onConfirm,
  darkMode = false,
}) {
  const [loading, setLoading] = useState(false);

  if (!job) return null;

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (onConfirm) {
        await onConfirm(job.id, job.title);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Job Posting"
      description={`Confirm removal of job listing`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleConfirm} className="space-y-4 text-xs">
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold block">Are you sure you want to delete this job?</span>
            This will permanently remove{" "}
            <span className="font-bold underline">{job.title}</span> at{" "}
            <span className="font-bold">{job.company}</span> ({job.id}) from the active catalog and candidate recommendations.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
              darkMode
                ? "bg-[#21262D] border-[#30363D] hover:bg-[#30363D] text-slate-300"
                : "bg-slate-100 border-slate-200 hover:bg-slate-200/70 text-slate-700"
            }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
