import React from "react";
import { CheckCircle2, Layers } from "lucide-react";

export default function JobAggregationSettingsForm({
  jobAggregation = {},
  onUpdateField,
  onSave,
  onReset,
  _isDirty = false,
  isSaving = false,
  darkMode = false,
}) {
  const allEmploymentTypes = [
    "Full-time",
    "Contract",
    "Part-time",
    "Internship",
    "Remote",
  ];

  const handleToggleEmpType = (type) => {
    const current = jobAggregation.employmentTypes || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onUpdateField("jobAggregation", "employmentTypes", updated);
  };

  const cardSurface = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90 shadow-2xs";

  const subCardSurface = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/70 border-slate-200/80";

  const selectClass = `w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors cursor-pointer ${
    darkMode
      ? "bg-[#0D1117] border border-[#30363D] text-slate-200 focus:border-amber-500"
      : "bg-slate-50/80 border border-slate-200 text-slate-900 focus:border-amber-500"
  }`;

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 transition-colors space-y-7 ${cardSurface}`}>
      <div>
        <h2
          className={`text-lg font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-[#0B192C]"
          }`}
        >
          Job Aggregation & Ingestion Rules
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Control automated crawler intervals, duplicate dedup thresholds, and ingestion policies.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Interval */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Crawler Ingestion Frequency
          </label>
          <select
            value={jobAggregation.crawlerIntervalMinutes || 15}
            onChange={(e) =>
              onUpdateField("jobAggregation", "crawlerIntervalMinutes", Number(e.target.value))
            }
            className={selectClass}
          >
            <option value={15}>Every 15 minutes (Standard Polling)</option>
            <option value={30}>Every 30 minutes</option>
            <option value={60}>Every 1 hour (Low Compute)</option>
            <option value={360}>Every 6 hours (Batch Interval)</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Controls how often background crawlers query LinkedIn, Greenhouse, and Lever feeds.
          </p>
        </div>

        {/* Duplicate Detection */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Duplicate Detection Mode
          </label>
          <select
            value={jobAggregation.duplicateDetection || "Strict (Title + Company)"}
            onChange={(e) =>
              onUpdateField("jobAggregation", "duplicateDetection", e.target.value)
            }
            className={selectClass}
          >
            <option value="Strict (Title + Company)">Strict (Title + Company Match)</option>
            <option value="Fuzzy AI Match (85% similarity)">Fuzzy AI Match (85% similarity)</option>
            <option value="Disabled (Allow Duplicates)">Disabled (Allow All Feeds)</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Incoming postings with identical requisitions will be flagged for review.
          </p>
        </div>

        {/* Default Visibility */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Default Ingestion Visibility
          </label>
          <select
            value={jobAggregation.defaultVisibility || "Visible"}
            onChange={(e) =>
              onUpdateField("jobAggregation", "defaultVisibility", e.target.value)
            }
            className={selectClass}
          >
            <option value="Visible">Visible Immediately to Candidates</option>
            <option value="Pending Review">Pending Admin Approval (Hidden)</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Decides whether fresh crawled jobs appear immediately or require recruiter signoff.
          </p>
        </div>

        {/* Auto Expire */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Auto-Expire Old Listings
          </label>
          <select
            value={jobAggregation.autoExpireDays || 60}
            onChange={(e) =>
              onUpdateField("jobAggregation", "autoExpireDays", Number(e.target.value))
            }
            className={selectClass}
          >
            <option value={30}>After 30 Days</option>
            <option value={60}>After 60 Days (Recommended)</option>
            <option value={90}>After 90 Days</option>
            <option value={0}>Never Auto-Expire</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Automatically archives postings when the partner feed closes or reaches age threshold.
          </p>
        </div>
      </div>

      {/* Supported Employment Types */}
      <div className={`p-4 rounded-xl border space-y-3 ${subCardSurface}`}>
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-500" />
          <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-white" : "text-[#0B192C]"}`}>
            Indexed Employment Types
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Only postings matching selected employment arrangements will be retained into the index.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {allEmploymentTypes.map((type) => {
            const isSelected = (jobAggregation.employmentTypes || []).includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleToggleEmpType(type)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/40 shadow-2xs"
                    : darkMode
                    ? "bg-[#161B22] border-[#30363D] text-slate-400 hover:text-slate-200"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                <span>{type}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${subCardSurface}`}
        >
          <div className="space-y-0.5 min-w-0">
            <span className={`text-xs font-bold block ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
              Auto-Sync on Platform Boot
            </span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Trigger background feed check when console initializes
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={jobAggregation.autoSyncOnStartup}
            onClick={() =>
              onUpdateField(
                "jobAggregation",
                "autoSyncOnStartup",
                !jobAggregation.autoSyncOnStartup
              )
            }
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              jobAggregation.autoSyncOnStartup ? "bg-[#D97706]" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                jobAggregation.autoSyncOnStartup ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div
          className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${subCardSurface}`}
        >
          <div className="space-y-0.5 min-w-0">
            <span className={`text-xs font-bold block ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
              Visa Sponsorship Verification
            </span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Parse immigration clause in job description before indexing
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={jobAggregation.visaVerificationRequired}
            onClick={() =>
              onUpdateField(
                "jobAggregation",
                "visaVerificationRequired",
                !jobAggregation.visaVerificationRequired
              )
            }
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              jobAggregation.visaVerificationRequired ? "bg-[#D97706]" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                jobAggregation.visaVerificationRequired ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-200/70 dark:border-[#30363D] flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onReset}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
            darkMode
              ? "bg-[#21262D] border-[#30363D] text-slate-300 hover:text-white"
              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0B192C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Ingestion Rules"}
        </button>
      </div>
    </div>
  );
}
