import React from "react";
import { Search, RotateCcw } from "lucide-react";

/**
 * UsersFilters Component
 * Search input and filter controls (Status, Plan, Joined Date) aligned with portal design.
 */
export default function UsersFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  planFilter,
  setPlanFilter,
  dateFilter,
  setDateFilter,
  clearFilters,
  resultCount,
  darkMode = false,
}) {
  const isFiltered =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    planFilter !== "All" ||
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
      className={`border rounded-2xl p-4 shadow-xs transition-colors flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 ${cardBg}`}
    >
      {/* Search Input */}
      <div className="flex-1 min-w-[240px] relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or target country..."
          className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors focus:outline-none ${inputBg}`}
        />
      </div>

      {/* Filter Selects */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
        {/* Status Filter */}
        <div className="w-full sm:w-36 relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium border transition-colors focus:outline-none appearance-none cursor-pointer pr-8 ${selectBg}`}
          >
            <option value="All" className={optionBg}>Status: All</option>
            <option value="Active" className={optionBg}>Active</option>
            <option value="Past Due" className={optionBg}>Past Due</option>
            <option value="Suspended" className={optionBg}>Suspended</option>
            <option value="Inactive" className={optionBg}>Inactive</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Plan Filter */}
        <div className="w-full sm:w-36 relative">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className={`w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium border transition-colors focus:outline-none appearance-none cursor-pointer pr-8 ${selectBg}`}
          >
            <option value="All" className={optionBg}>Plan: All</option>
            <option value="Premium" className={optionBg}>Premium</option>
            <option value="Basic" className={optionBg}>Basic</option>
            <option value="None" className={optionBg}>None</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Joined Date Filter (Replaces Role filter) */}
        <div className="w-full sm:w-40 relative">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={`w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium border transition-colors focus:outline-none appearance-none cursor-pointer pr-8 ${selectBg}`}
          >
            <option value="All Time" className={optionBg}>Joined: All Time</option>
            <option value="Last 7 Days" className={optionBg}>Last 7 Days</option>
            <option value="Last 30 Days" className={optionBg}>Last 30 Days</option>
            <option value="Last 90 Days" className={optionBg}>Last 90 Days</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Reset Action */}
        {isFiltered && (
          <button
            type="button"
            onClick={clearFilters}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors shrink-0 cursor-pointer ${
              darkMode
                ? "bg-[#21262D] text-slate-300 border-[#30363D] hover:bg-[#30363D]"
                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
            }`}
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Result Count */}
      <div className={`hidden xl:flex items-center text-xs font-mono shrink-0 ${countText}`}>
        Showing {resultCount} matching
      </div>
    </div>
  );
}
