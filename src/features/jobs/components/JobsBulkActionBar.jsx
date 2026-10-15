import React, { useState, useRef, useEffect } from "react";
import {
  EyeOff,
  Eye,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";

/**
 * JobsBulkActionBar Component
 * Appears conditionally when at least one job is selected.
 * Positioned between the category tabs and the search/filter toolbar.
 *
 * Provides:
 * - Selected job counter ("3 jobs selected")
 * - Hide Selected action (with confirmation modal trigger)
 * - Unhide Selected action (when hidden jobs are among selection)
 * - Change Status dropdown (Active, Paused, Closed, Draft)
 * - Clear Selection action
 */
export default function JobsBulkActionBar({
  selectedCount = 0,
  selectedJobs = [],
  onHide,
  onUnhide,
  onChangeStatus,
  onClear,
  darkMode = false,
}) {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setIsStatusMenuOpen(false);
      }
    }
    if (isStatusMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStatusMenuOpen]);

  if (selectedCount === 0) return null;

  const hasHiddenJobs = selectedJobs.some((j) => j.isHidden);
  const hasVisibleJobs = selectedJobs.some((j) => !j.isHidden);

  const cardBg = darkMode
    ? "bg-[#161B22] border-amber-800/40 text-white"
    : "bg-white border-amber-200/80 text-slate-900";

  const statusOptions = [
    { label: "Active", value: "Active", dot: "bg-emerald-500" },
    { label: "Paused", value: "Paused", dot: "bg-amber-500" },
    { label: "Closed", value: "Closed", dot: "bg-rose-500" },
    { label: "Draft", value: "Draft", dot: "bg-slate-400" },
  ];

  return (
    <div
      className={`border rounded-2xl px-4 py-2.5 shadow-xs transition-all duration-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 ${cardBg}`}
    >
      {/* 1. Selection Counter */}
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold text-xs">
          {selectedCount}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-bold text-[#0B192C] dark:text-white">
            {selectedCount} {selectedCount === 1 ? "job" : "jobs"} selected
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
        </div>
      </div>

      {/* 2. Bulk Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Hide Selected Button */}
        {hasVisibleJobs && (
          <button
            type="button"
            onClick={onHide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50/70 dark:hover:bg-amber-950/30 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Hide selected jobs from normal listings"
          >
            <EyeOff className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Hide Selected</span>
          </button>
        )}

        {/* Unhide Selected Button (if any hidden jobs are selected) */}
        {hasHiddenJobs && (
          <button
            type="button"
            onClick={onUnhide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100/70 border border-emerald-200/80 dark:border-emerald-800/50 transition-colors cursor-pointer"
            title="Restore visibility for selected jobs"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Unhide Selected</span>
          </button>
        )}

        {/* Change Status Dropdown */}
        <div className="relative" ref={statusMenuRef}>
          <button
            type="button"
            onClick={() => setIsStatusMenuOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#21262D] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Bulk change status"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Change Status</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isStatusMenuOpen && (
            <div
              className={`absolute right-0 sm:left-0 sm:right-auto mt-1 w-36 rounded-xl border shadow-lg py-1 z-30 animate-in fade-in duration-100 ${
                darkMode
                  ? "bg-[#1E2530] border-[#30363D] text-slate-200"
                  : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <div className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Set status to:
              </div>
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setIsStatusMenuOpen(false);
                    if (onChangeStatus) onChangeStatus(opt.value);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left font-medium transition-colors cursor-pointer ${
                    darkMode
                      ? "hover:bg-[#283141] hover:text-white"
                      : "hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

        {/* Clear Selection Button */}
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          title="Clear current selection"
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
