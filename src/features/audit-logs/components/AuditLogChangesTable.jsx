import React from "react";
import { ArrowRight, Minus } from "lucide-react";

/**
 * AuditLogChangesTable Component
 * Renders structured before-and-after change diffs:
 * - Field
 * - Previous Value (red/strikethrough treatment)
 * - New Value (green/highlight treatment)
 */
export default function AuditLogChangesTable({
  changes = [],
  compact = false,
  darkMode = false,
}) {
  if (!changes || changes.length === 0) {
    return (
      <div
        className={`rounded-xl border p-4 text-center text-xs ${
          darkMode
            ? "border-[#30363D] bg-[#0D1117] text-slate-400"
            : "border-slate-200 bg-slate-50/50 text-slate-500"
        }`}
      >
        <Minus className="w-4 h-4 mx-auto mb-1 text-slate-400 opacity-60" />
        No data modifications recorded for this read-only event.
      </div>
    );
  }

  const tableHeader = darkMode
    ? "bg-[#0D1117] text-slate-400 border-[#30363D]"
    : "bg-slate-50 text-slate-600 border-slate-200";
  const rowBorder = darkMode ? "border-[#30363D]" : "border-slate-100";
  const pyClass = compact ? "py-1.5 px-3" : "py-2.5 px-3";

  return (
    <div
      className={`rounded-xl border overflow-hidden shadow-2xs ${
        darkMode ? "border-[#30363D]" : "border-slate-200"
      }`}
    >
      <table className="w-full text-left text-xs border-collapse">
        <thead className={`border-b ${tableHeader} font-bold uppercase tracking-wider text-[10px]`}>
          <tr>
            <th className="py-2 px-3 w-1/3">Field</th>
            <th className="py-2 px-3 w-1/3">Previous Value</th>
            <th className="py-2 px-3 w-1/3">New Value</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${rowBorder}`}>
          {changes.map((change, idx) => (
            <tr
              key={idx}
              className={`transition-colors ${
                darkMode ? "hover:bg-[#161B22]" : "hover:bg-slate-50/70"
              }`}
            >
              <td className={`${pyClass} font-semibold text-slate-700 dark:text-slate-200 align-top`}>
                <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  {change.field}
                </span>
              </td>
              <td className={`${pyClass} align-top`}>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-200/60 dark:border-rose-800/40 line-through decoration-rose-400">
                  {change.previousValue || "(empty)"}
                </span>
              </td>
              <td className={`${pyClass} align-top`}>
                <div className="flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/40">
                    {change.newValue || "(empty)"}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
