import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * SettingsHeader Component
 * Clean top title and subtitle matching the AIFA GEN LABS Admin Console design system.
 */
export default function SettingsHeader({ isDirty = false, diffCount = 0, darkMode = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      <div>
        <h1
          className={`text-2xl font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-[#0B192C]"
          }`}
        >
          Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your platform configuration, integrations, and preferences.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {isDirty ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 shadow-2xs animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>{diffCount} Unsaved Change{diffCount === 1 ? "" : "s"}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#161B22] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#30363D]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>All Changes Saved</span>
          </span>
        )}
      </div>
    </div>
  );
}
