import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Modal from "../../../components/ui/Modal";

/**
 * ViewChangesModal Component
 * Compares saved configuration against current unsaved configuration,
 * detailing field name, section, previous value, and current value.
 */
export default function ViewChangesModal({
  isOpen = false,
  onClose,
  diffs = [],
  onSaveNow,
  darkMode = false,
}) {
  const formatVal = (val) => {
    if (val === true) return "Enabled (true)";
    if (val === false) return "Disabled (false)";
    if (val === null || val === undefined || val === "") return "(empty)";
    if (typeof val === "string" && val.startsWith("data:image/")) {
      return "[Custom Image Data]";
    }
    if (typeof val === "string" && (val.includes("aifa-logo") || val.endsWith(".png"))) {
      return "[Default Platform Emblem]";
    }
    if (Array.isArray(val)) return val.join(", ");
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unsaved Configuration Changes"
      description="Review modifications between the saved configuration and current active values."
      size="lg"
      darkMode={darkMode}
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-400 font-mono">
            {diffs.length} modified parameter{diffs.length === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                darkMode
                  ? "bg-[#21262D] border-[#30363D] text-slate-300 hover:text-white"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Close
            </button>
            {diffs.length > 0 && onSaveNow && (
              <button
                type="button"
                onClick={() => {
                  onSaveNow();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#D97706] hover:bg-amber-600 text-white transition-colors cursor-pointer shadow-xs"
              >
                Save & Apply Changes
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {diffs.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4
              className={`text-sm font-bold ${
                darkMode ? "text-white" : "text-[#0B192C]"
              }`}
            >
              No unsaved changes detected
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your platform configuration matches the active saved state.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#30363D]">
            <table className="w-full text-left text-xs">
              <thead
                className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                  darkMode
                    ? "bg-[#0D1117] border-[#30363D] text-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
              >
                <tr>
                  <th className="py-2.5 px-3">Setting Parameter</th>
                  <th className="py-2.5 px-3">Section</th>
                  <th className="py-2.5 px-3">Previous Saved Value</th>
                  <th className="py-2.5 px-3">New Modified Value</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-[#30363D]" : "divide-slate-200/70"
                }`}
              >
                {diffs.map((diff, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      darkMode ? "hover:bg-[#161B22]" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {diff.label}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-[#21262D] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#30363D]">
                        {diff.sectionLabel || diff.section}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded text-[11px] break-all">
                        {formatVal(diff.previous)}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded text-[11px] font-bold break-all">
                          {formatVal(diff.current)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}
