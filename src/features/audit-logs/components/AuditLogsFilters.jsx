import React from "react";
import { Search, X } from "lucide-react";
import {
  AUDIT_CATEGORIES,
  ACTOR_TYPES,
  RESULT_TYPES,
  DATE_RANGE_OPTIONS,
} from "../../../mocks/auditLogsData";

/**
 * AuditLogsFilters Component
 * Search and multi-filter toolbar for Audit Logs:
 * - Search by actor, action, target, or event ID
 * - Category filter dropdown
 * - Actor Type filter dropdown
 * - Result filter dropdown
 * - Date range dropdown (with custom start/end date inputs)
 * - Clear filters action
 * - Dynamic matching records counter
 */
export default function AuditLogsFilters({
  search = "",
  setSearch,
  categoryFilter = "All",
  setCategoryFilter,
  actorTypeFilter = "All",
  setActorTypeFilter,
  resultFilter = "All",
  setResultFilter,
  dateFilter = "All Time",
  setDateFilter,
  customStartDate = "",
  setCustomStartDate,
  customEndDate = "",
  setCustomEndDate,
  clearFilters,
  resultCount = 0,
  totalCount = 0,
  darkMode = false,
}) {
  const isFiltered =
    search.trim() !== "" ||
    categoryFilter !== "All" ||
    actorTypeFilter !== "All" ||
    resultFilter !== "All" ||
    dateFilter !== "All Time" ||
    customStartDate !== "" ||
    customEndDate !== "";

  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const inputBg = darkMode
    ? "bg-[#0D1117] border-[#30363D] text-white placeholder-slate-500 focus:border-amber-500"
    : "bg-slate-50/70 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500";
  const selectBg = darkMode
    ? "bg-[#0D1117] border-[#30363D] text-slate-200 focus:border-amber-500"
    : "bg-white border-slate-200 text-slate-800 focus:border-amber-500";
  const optionBg = darkMode ? "bg-[#161B22] text-white" : "bg-white text-slate-900";
  const countText = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className="space-y-2.5">
      <div
        className={`border rounded-2xl px-4 py-3 shadow-xs transition-colors flex flex-col 2xl:flex-row items-stretch 2xl:items-center justify-between gap-3 ${cardBg}`}
      >
        {/* Search Input */}
        <div className="flex-1 min-w-[280px] relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch && setSearch(e.target.value)}
            placeholder="Search by actor, action, target, or event ID..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors focus:outline-none ${inputBg}`}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch && setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="w-full sm:w-36 relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter && setCategoryFilter(e.target.value)}
              className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm font-medium border transition-colors focus:outline-none appearance-none cursor-pointer pr-7 ${selectBg}`}
              title="Filter by Category"
            >
              <option value="All" className={optionBg}>Category: All</option>
              {AUDIT_CATEGORIES.filter((c) => c !== "All Events").map((cat) => (
                <option key={cat} value={cat} className={optionBg}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Actor Type Filter */}
          <div className="w-full sm:w-36 relative">
            <select
              value={actorTypeFilter}
              onChange={(e) => setActorTypeFilter && setActorTypeFilter(e.target.value)}
              className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm font-medium border transition-colors focus:outline-none appearance-none cursor-pointer pr-7 ${selectBg}`}
              title="Filter by Actor Type"
            >
              <option value="All" className={optionBg}>Actor: All</option>
              {ACTOR_TYPES.filter((t) => t !== "All").map((type) => (
                <option key={type} value={type} className={optionBg}>
                  {type}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Result Filter */}
          <div className="w-full sm:w-32 relative">
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter && setResultFilter(e.target.value)}
              className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm font-medium border transition-colors focus:outline-none appearance-none cursor-pointer pr-7 ${selectBg}`}
              title="Filter by Result"
            >
              <option value="All" className={optionBg}>Result: All</option>
              {RESULT_TYPES.filter((r) => r !== "All").map((res) => (
                <option key={res} value={res} className={optionBg}>
                  {res}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Date Filter */}
          <div className="w-full sm:w-36 relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter && setDateFilter(e.target.value)}
              className={`w-full rounded-xl px-3 py-2 text-xs sm:text-sm font-medium border transition-colors focus:outline-none appearance-none cursor-pointer pr-7 ${selectBg}`}
              title="Filter by Date Range"
            >
              {DATE_RANGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className={optionBg}>
                  {opt === "All Time" ? "Date: All Time" : opt}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Clear Filters (Clickable Link) */}
          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline px-1 cursor-pointer whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}

          {/* Result Counter */}
          <div className="text-right whitespace-nowrap pl-2 shrink-0">
            <span className={`text-xs font-medium ${countText}`}>
              Showing{" "}
              <span className="font-bold text-[#0B192C] dark:text-white">
                {resultCount}
              </span>{" "}
              of {totalCount} events
            </span>
          </div>
        </div>
      </div>

      {/* Custom Date Range Selector (appears when "Custom Range" is active) */}
      {dateFilter === "Custom Range" && (
        <div
          className={`border rounded-xl px-4 py-2.5 text-xs flex items-center gap-3 flex-wrap ${cardBg}`}
        >
          <span className="font-semibold text-slate-500">Custom Date Range:</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">From:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className={`px-2.5 py-1 rounded-lg border text-xs ${inputBg}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">To:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className={`px-2.5 py-1 rounded-lg border text-xs ${inputBg}`}
            />
          </div>
          {(customStartDate || customEndDate) && (
            <button
              type="button"
              onClick={() => {
                setCustomStartDate("");
                setCustomEndDate("");
              }}
              className="text-xs text-rose-600 hover:underline cursor-pointer"
            >
              Reset Range
            </button>
          )}
        </div>
      )}
    </div>
  );
}
