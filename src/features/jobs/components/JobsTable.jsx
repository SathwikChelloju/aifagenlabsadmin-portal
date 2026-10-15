import React, { useRef, useEffect } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Briefcase,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";
import JobActionsMenu from "./JobActionsMenu";
import CompanyLogo from "./CompanyLogo";
import SourceBadge from "./SourceBadge";
import { getJobStatusBadge, getJobTypeBadge } from "../utils/jobUtils";

/**
 * JobsTable Component
 * Matches the exact table columns, company logos, source icons, relative dates,
 * checkboxes, and row selection from the screenshot.
 */
export default function JobsTable({
  jobs = [],
  loading = false,
  sortField = "id",
  sortDirection = "desc",
  onSort,
  currentPage = 1,
  totalCount = 24,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  selectedJobId = null,
  onSelectJob,
  onViewDetails,
  onEditJob,
  onDeleteJob,
  onStatusChange,
  onClearFilters,
  // Controlled selection props
  selectedJobIds = new Set(),
  onToggleSelectJob,
  onToggleSelectAllCurrentPage,
  isAllCurrentPageSelected = false,
  isIndeterminate = false,
  onHideJob,
  onUnhideJob,
  isFiltered = false,
  darkMode = false,
}) {
  const headerCheckboxRef = useRef(null);

  // Sync indeterminate state to header checkbox DOM element
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D] text-white"
    : "bg-white border-slate-200/90 text-slate-900";

  const tableHeader = darkMode
    ? "bg-[#0D1117] text-slate-400 border-[#30363D]"
    : "bg-slate-50/70 text-slate-400 border-slate-200";
  const tableRowHover = darkMode
    ? "hover:bg-[#1F242C] border-[#30363D]/60"
    : "hover:bg-slate-50/80 border-slate-100";
  const dividerColor = darkMode ? "divide-[#30363D]/60" : "divide-slate-100";
  const footerBg = darkMode
    ? "bg-[#0D1117]/60 border-[#30363D]/60 text-slate-400"
    : "bg-slate-50/60 border-slate-100 text-slate-500";

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#D97706]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#D97706]" />
    );
  };

  const renderSortableHeader = (field, label, align = "left") => (
    <th
      className={`py-3 px-3 select-none cursor-pointer group transition-colors text-[10px] uppercase font-bold tracking-wider ${
        darkMode ? "hover:text-white text-slate-400" : "hover:text-slate-900 text-slate-400"
      } ${
        align === "right"
          ? "text-right"
          : align === "center"
          ? "text-center"
          : "text-left"
      }`}
      onClick={() => onSort && onSort(field)}
    >
      <div
        className={`inline-flex items-center gap-1 ${
          align === "right"
            ? "justify-end"
            : align === "center"
            ? "justify-center"
            : "justify-start"
        }`}
      >
        <span>{label}</span>
        {getSortIcon(field)}
      </div>
    </th>
  );

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div
      className={`border rounded-2xl overflow-hidden shadow-xs transition-colors flex flex-col ${cardBg}`}
    >
      {/* Table Container */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse min-w-[900px]">
          <thead className={`border-b ${tableHeader}`}>
            <tr>
              {/* Checkbox Column */}
              <th className="py-3 pl-4 pr-2 w-8">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={isAllCurrentPageSelected}
                  onChange={onToggleSelectAllCurrentPage}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
                  title="Select all visible jobs on current page"
                />
              </th>
              {renderSortableHeader("title", "JOB TITLE")}
              <th className="py-3 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                COMPANY
              </th>
              <th className="py-3 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                JOB TYPE
              </th>
              <th className="py-3 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                LOCATION
              </th>
              <th className="py-3 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                EMPLOYMENT TYPE
              </th>
              <th className="py-3 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                SOURCE
              </th>
              {renderSortableHeader("postedDate", "POSTED DATE")}
              <th className="py-3 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                STATUS
              </th>
              <th className="py-3 px-3 pr-4 text-right text-[10px] uppercase font-bold tracking-wider text-slate-400">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className={`divide-y ${dividerColor}`}>
            {loading ? (
              <tr>
                <td colSpan={10} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading jobs catalog...</span>
                  </div>
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-3">
                    <div
                      className={`p-3.5 rounded-2xl border ${
                        darkMode
                          ? "bg-[#21262D] border-[#30363D] text-slate-400"
                          : "bg-slate-100 border-slate-200 text-slate-500"
                      }`}
                    >
                      <Briefcase className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          darkMode ? "text-white" : "text-[#0B192C]"
                        }`}
                      >
                        No matching jobs found
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isFiltered
                          ? "Try adjusting your search query, job type, or active filters."
                          : "No job postings have been added yet."}
                      </p>
                    </div>
                    {isFiltered && onClearFilters && (
                      <button
                        type="button"
                        onClick={onClearFilters}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset all filters</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              jobs.map((job) => {
                const isSelected = selectedJobId === job.id;
                const isChecked = selectedJobIds.has(job.id);
                const statusMeta = getJobStatusBadge(job.status, darkMode);
                const typeMeta = getJobTypeBadge(job.type, darkMode);

                return (
                  <tr
                    key={job.id}
                    onClick={() => {
                      if (onSelectJob) onSelectJob(job);
                      if (onViewDetails) onViewDetails(job);
                    }}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? darkMode
                          ? "bg-[#1E2530]"
                          : "bg-blue-50/40"
                        : tableRowHover
                    }`}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-3 pl-4 pr-2 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (onToggleSelectJob) onToggleSelectJob(job.id);
                        }}
                        className="rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
                      />
                    </td>

                    {/* 1. Job Title + ID */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col min-w-[160px] max-w-[210px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onViewDetails) onViewDetails(job);
                          }}
                          className={`text-left font-bold truncate text-[13px] hover:text-[#D97706] dark:hover:text-[#FBBF24] transition-colors cursor-pointer ${
                            darkMode ? "text-white" : "text-[#0B192C]"
                          }`}
                          title={job.title}
                        >
                          {job.title}
                        </button>
                        <span className="font-mono text-[10px] text-slate-400 mt-0.5">
                          {job.id}
                        </span>
                      </div>
                    </td>

                    {/* 2. Company */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <CompanyLogo company={job.company} className="w-5 h-5 shrink-0" />
                        <span
                          className={`font-semibold truncate text-xs ${
                            darkMode ? "text-slate-200" : "text-slate-800"
                          }`}
                        >
                          {job.company}
                        </span>
                      </div>
                    </td>

                    {/* 3. Job Type Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold tracking-wide ${typeMeta.badgeClass}`}
                      >
                        {typeMeta.label}
                      </span>
                    </td>

                    {/* 4. Location */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-xs truncate">{job.location || "Remote"}</span>
                      </div>
                    </td>

                    {/* 5. Employment Type */}
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600 dark:text-slate-300 text-xs">
                      {job.employmentType || "Full-time"}
                    </td>

                    {/* 6. Source */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <SourceBadge source={job.source} darkMode={darkMode} />
                    </td>

                    {/* 7. Posted Date + relative subtext */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {job.postedDate || "Oct 10, 2026"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {job.daysAgo || "2 days ago"}
                        </span>
                      </div>
                    </td>

                    {/* 8. Status & Visibility */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${statusMeta.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
                          <span>{statusMeta.label}</span>
                        </span>

                        {job.isHidden && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                            title="Hidden from normal listings"
                          >
                            <EyeOff className="w-2.5 h-2.5 text-slate-400" />
                            <span>Hidden</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 9. Actions */}
                    <td
                      className="py-3 px-3 pr-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onViewDetails && onViewDetails(job)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            darkMode
                              ? "text-slate-400 hover:text-white hover:bg-slate-800"
                              : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          }`}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <JobActionsMenu
                          job={job}
                          onViewDetails={onViewDetails}
                          onEditJob={onEditJob}
                          onDeleteJob={onDeleteJob}
                          onStatusChange={onStatusChange}
                          onHideJob={onHideJob}
                          onUnhideJob={onUnhideJob}
                          darkMode={darkMode}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer matching screenshot */}
      <div
        className={`px-4 sm:px-6 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${footerBg}`}
      >
        <div>
          Showing <span className="font-bold text-slate-800 dark:text-white">{startIndex}</span> to{" "}
          <span className="font-bold text-slate-800 dark:text-white">{endIndex}</span> of{" "}
          <span className="font-bold text-slate-800 dark:text-white">{totalCount}</span> jobs
        </div>

        {/* Center: Numeric Page Buttons with orange active border */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            className="p-1 rounded-lg border border-slate-200 dark:border-[#30363D] disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange && onPageChange(page)}
              className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center cursor-pointer transition-colors ${
                currentPage === page
                  ? "border border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30 font-extrabold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#21262D]"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            className="p-1 rounded-lg border border-slate-200 dark:border-[#30363D] disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Page Size Dropdown */}
        <div className="flex items-center gap-1">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold border cursor-pointer focus:outline-none ${
              darkMode
                ? "bg-[#161B22] border-[#30363D] text-white"
                : "bg-white border-slate-200 text-slate-700 shadow-2xs"
            }`}
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
