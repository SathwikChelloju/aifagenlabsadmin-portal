import React from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "../../../components/ui/Modal";

/**
 * UnsavedChangesModal Component
 * Prompts administrator when navigating between settings sections with unsaved modifications.
 */
export default function UnsavedChangesModal({
  isOpen = false,
  onClose,
  onDiscardAndSwitch,
  onSaveAndSwitch,
  darkMode = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unsaved Changes Detected"
      description="You have unsaved changes in the current section. What would you like to do before switching?"
      size="sm"
      darkMode={darkMode}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              darkMode
                ? "bg-[#21262D] border-[#30363D] text-slate-300 hover:text-white"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Stay Here
          </button>
          <button
            type="button"
            onClick={onDiscardAndSwitch}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={onSaveAndSwitch}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#D97706] hover:bg-amber-600 text-white transition-colors cursor-pointer shadow-xs"
          >
            Save & Continue
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-3 py-2">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white">
            Switching sections without saving will discard any edits made.
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Choose "Save & Continue" to preserve your new settings, or "Discard Changes" to revert to the previously saved values.
          </p>
        </div>
      </div>
    </Modal>
  );
}
