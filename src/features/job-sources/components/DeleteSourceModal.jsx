import React from "react";
import Modal from "../../../components/ui/Modal";
import { AlertTriangle, Trash2 } from "lucide-react";

/**
 * DeleteSourceModal Component
 * Confirms deletion of a job source integration.
 */
export default function DeleteSourceModal({
  isOpen,
  onClose,
  onConfirm,
  source = null,
  darkMode = false,
}) {
  if (!source) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Job Source Integration"
      description="Confirm discontinuation of this ingestion source."
      maxWidth="max-w-md"
    >
      <div className="space-y-4 pt-2">
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-800 dark:text-rose-300">
            <span className="font-bold">Warning:</span> You are about to remove{" "}
            <span className="font-bold underline">{source.name}</span>. Automated
            crawling jobs from this endpoint will halt immediately. Previously
            ingested jobs will not be deleted.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              darkMode
                ? "text-slate-400 hover:text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm(source.id);
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Source
          </button>
        </div>
      </div>
    </Modal>
  );
}
