import React from "react";
import { Search } from "lucide-react";

/**
 * JobSourcesFilters Component
 * Single-row filter toolbar for Job Sources:
 * - Search by source name or ID
 * - Source Type dropdown
 * - Status dropdown (All, Active, Paused, Error)
 * - Clear Filters clickable link
 * - Showing X matching counter
 */
export default function JobSourcesFilters({
  search = "",
  setSearch,
  statusFilter = "All",
  setStatusFilter,
  typeFilter = "All",
  setTypeFilter,
  dateFilter = "All Time",
  setDateFilter,
  clearFilters,
  resultCount = 0,
  darkMode = false,
}) {
  const isFiltered =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    typeFilter !== "All" ||
    dateFilter !== "All Time";

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
    <div
      className={`border rounded-2xl px-4 py-3 shadow-xs transition-colors flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 ${cardBg}`}
    >
      {/* Search Input */}
      <div className="flex-1 min-w-[240px] relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch && setSearch(e.target.value)}
          placeholder="Search by source name, ID, or endpoint..."
          className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors focus:outline-none ${inputBg}`}
        />
      </div>

      {/* Filter Dropdowns & Actions */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
        {/* Type Filter */}
        <div className="w-full sm:w-40 relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter && setTypeFilter(e.target.value)}
            className={`w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium border transition-colors focus:outline-none appearance-none cursor-pointer pr-7 ${selectBg}`}
            title="Filter by Source Type"
          >
            <option value="All" className={optionBg}>Type: All</option>
            <option value="api" className={optionBg}>API Integrations</option>
            <option value="job_board" className={optionBg}>Public Job Boards</option>
            <option value="internal" className={optionBg}>Internal</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-36 relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter && setStatusFilter(e.target.value)}
            className={`w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium border transition-colors focus:outline-none appearance-none cursor-pointer pr-7 ${selectBg}`}
            title="Filter by Status"
          >
            <option value="All" className={optionBg}>Status: All</option>
            <option value="Active" className={optionBg}>Active</option>
            <option value="Paused" className={optionBg}>Paused</option>
            <option value="Error" className={optionBg}>Error</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Date / Last Sync Filter */}
        <div className="w-full sm:w-36 relative">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter && setDateFilter(e.target.value)}
            className={`w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium border transition-colors focus:outline-none appearance-none cursor-pointer pr-7 ${selectBg}`}
            title="Filter by Last Sync Date"
          >
            <option value="All Time" className={optionBg}>Date: All Time</option>
            <option value="Today" className={optionBg}>Today</option>
            <option value="Last 7 Days" className={optionBg}>Last 7 Days</option>
            <option value="Last 30 Days" className={optionBg}>Last 30 Days</option>
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
      </div>

      {/* Result Counter */}
      <div className="text-right whitespace-nowrap pl-2 shrink-0">
        <span className={`text-xs font-medium ${countText}`}>
          Showing{" "}
          <span className="font-bold text-[#0B192C] dark:text-white">
            {resultCount}
          </span>{" "}
          matching
        </span>
      </div>
    </div>
  );
}
