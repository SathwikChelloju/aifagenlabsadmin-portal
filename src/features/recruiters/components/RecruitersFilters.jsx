import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";

export default function RecruitersFilters({
  search,
  setSearch,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  onResetFilters,
  darkMode = false,
}) {
  const departments = [
    "All Departments",
    "Engineering & AI",
    "Cloud & Infrastructure",
    "Leadership & Strategy",
    "Product & Design",
    "Global Relocation",
    "Global Campus",
  ];

  const statuses = ["All Statuses", "Active", "On Leave"];

  const dateRanges = ["All Time", "Last 7 Days", "Last 30 Days", "Last 90 Days"];

  const hasActiveFilters =
    Boolean(search) ||
    departmentFilter !== "All Departments" ||
    statusFilter !== "All Statuses" ||
    dateFilter !== "All Time";

  return (
    <div
      className={`p-3 sm:p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors ${
        darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/90 shadow-2xs"
      }`}
    >
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recruiters by name, email, role, or ID..."
          className={`w-full rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-hidden transition-colors ${
            darkMode
              ? "bg-[#0D1117] border border-[#30363D] text-white placeholder:text-slate-500 focus:border-amber-500"
              : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500"
          }`}
        />
      </div>

      {/* Filter Selects */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        {/* Date Joined Filter */}
        <div className="flex items-center gap-1">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={`text-xs font-semibold py-2 px-3 rounded-xl border focus:outline-hidden cursor-pointer transition-colors ${
              dateFilter !== "All Time"
                ? darkMode
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                  : "bg-amber-50 border-amber-300 text-amber-800"
                : darkMode
                ? "bg-[#0D1117] border-[#30363D] text-slate-300 focus:border-amber-500"
                : "bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500"
            }`}
          >
            {dateRanges.map((range) => (
              <option key={range} value={range}>
                {range === "All Time" ? "Joined: All Time" : `Joined: ${range}`}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className={`text-xs font-semibold py-2 px-3 rounded-xl border focus:outline-hidden cursor-pointer transition-colors ${
            departmentFilter !== "All Departments"
              ? darkMode
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                : "bg-amber-50 border-amber-300 text-amber-800"
              : darkMode
              ? "bg-[#0D1117] border-[#30363D] text-slate-300 focus:border-amber-500"
              : "bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500"
          }`}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`text-xs font-semibold py-2 px-3 rounded-xl border focus:outline-hidden cursor-pointer transition-colors ${
            statusFilter !== "All Statuses"
              ? darkMode
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                : "bg-amber-50 border-amber-300 text-amber-800"
              : darkMode
              ? "bg-[#0D1117] border-[#30363D] text-slate-300 focus:border-amber-500"
              : "bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500"
          }`}
        >
          {statuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              darkMode
                ? "text-slate-400 hover:text-white hover:bg-[#21262D]"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Reset All Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
