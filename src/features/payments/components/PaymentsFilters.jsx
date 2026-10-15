import React from "react";
import { Search, RotateCcw, Calendar } from "lucide-react";

/**
 * PaymentsFilters Component
 * Search input and multi-faceted filters (Status, Method, Date Range) with clear-filters action.
 */
export default function PaymentsFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  dateFilter,
  setDateFilter,
  availableMethods = ["All"],
  clearFilters,
  resultCount,
  darkMode = false,
}) {
  const isFiltered =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    methodFilter !== "All" ||
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
          placeholder="Search by user name, email, or transaction ID..."
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
            <option value="Successful" className={optionBg}>Successful</option>
            <option value="Pending" className={optionBg}>Pending</option>
            <option value="Failed" className={optionBg}>Failed</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Payment Method Filter */}
        <div className="w-full sm:w-40 relative">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className={`w-full rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium border transition-colors focus:outline-none appearance-none cursor-pointer pr-8 ${selectBg}`}
          >
            <option value="All" className={optionBg}>Method: All</option>
            {availableMethods.filter((m) => m !== "All").map((method) => (
              <option key={method} value={method} className={optionBg}>
                {method}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="w-full sm:w-40 relative">
          <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={`w-full rounded-xl pl-8 pr-8 py-2 text-xs sm:text-sm font-medium border transition-colors focus:outline-none appearance-none cursor-pointer ${selectBg}`}
          >
            <option value="All Time" className={optionBg}>Date: All Time</option>
            <option value="Today" className={optionBg}>Today</option>
            <option value="Last 7 Days" className={optionBg}>Last 7 Days</option>
            <option value="Last 30 Days" className={optionBg}>Last 30 Days</option>
            <option value="Last 90 Days" className={optionBg}>Last 90 Days</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={clearFilters}
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              darkMode
                ? "bg-[#21262D] border-[#30363D] hover:bg-[#30363D] text-slate-300"
                : "bg-slate-100 border-slate-200 hover:bg-slate-200/70 text-slate-700"
            }`}
            title="Reset all filters"
          >
            <RotateCcw className="w-4 h-4 text-amber-500" />
          </button>
        )}
      </div>

      {/* Result Counter */}
      <div className="text-right whitespace-nowrap pl-2">
        <span className={`text-xs font-mono font-medium ${countText}`}>
          Showing <span className="font-bold text-[#0B192C] dark:text-white">{resultCount}</span> matching
        </span>
      </div>
    </div>
  );
}
