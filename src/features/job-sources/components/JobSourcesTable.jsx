import React from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RefreshCw,
  Eye,
  MoreVertical,
  Play,
  Pause,
  Edit2,
  Trash2,
  Radio,
} from "lucide-react";
import SourceLogo from "./SourceLogo";
import DropdownMenu from "../../../components/ui/DropdownMenu";
import {
  getSourceStatusBadge,
  getSourceTypeMeta,
  calculateSourceSuccessRate,
  formatSourceTimestamp,
} from "../utils/jobSourceUtils";

/**
 * JobSourcesTable Component
 * Displays 8 distinct columns, row-level quick actions, dropdown menu,
 * sorting, pagination, and empty states.
 */
export default function JobSourcesTable({
  sources = [],
  syncHistory = [],
  loading = false,
  sortField = "name",
  sortDirection = "asc",
  onSort,
  currentPage = 1,
  totalCount = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  onSyncSource,
  syncingSourceId = null,
  onClearFilters,
  isFiltered = false,
  darkMode = false,
}) {
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

  const renderSortableHeader = (field, label, align = "left", className = "") => (
    <th
      className={`py-3.5 px-4 select-none cursor-pointer group transition-colors text-[10px] uppercase font-bold tracking-wider ${
        darkMode ? "hover:text-white text-slate-400" : "hover:text-slate-900 text-slate-400"
      } ${
        align === "right"
          ? "text-right"
          : align === "center"
          ? "text-center"
          : "text-left"
      } ${className}`}
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
      className={`rounded-2xl border shadow-xs overflow-hidden transition-colors ${cardBg}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b ${tableHeader}`}>
              {renderSortableHeader("name", "Source", "left", "min-w-[220px]")}
              {renderSortableHeader("type", "Source Type", "left", "min-w-[130px]")}
              {renderSortableHeader("status", "Status", "left", "min-w-[110px]")}
              {renderSortableHeader("lastSync", "Last Sync", "left", "min-w-[130px]")}
              {renderSortableHeader("jobsRetrieved", "Jobs Retrieved", "right", "min-w-[120px]")}
              {renderSortableHeader("jobsRetrievedToday", "Jobs Today", "right", "min-w-[100px]")}
              {renderSortableHeader("successRate", "Success Rate", "center", "min-w-[110px]")}
              <th className="py-3.5 px-4 text-right text-[10px] uppercase font-bold tracking-wider text-slate-400 min-w-[110px]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className={`divide-y ${dividerColor}`}>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 text-[#D97706] animate-spin" />
                    <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Loading job sources...
                    </p>
                  </div>
                </td>
              </tr>
            ) : sources.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto px-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                        darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Radio className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h3
                      className={`text-sm font-bold mb-1 ${
                        darkMode ? "text-white" : "text-[#0B192C]"
                      }`}
                    >
                      No job sources found
                    </h3>
                    <p
                      className={`text-xs mb-4 ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {isFiltered
                        ? "No sources match your active search and filter criteria."
                        : "No ingestion sources configured yet."}
                    </p>
                    {isFiltered && onClearFilters && (
                      <button
                        onClick={onClearFilters}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#D97706] hover:text-[#B45309] dark:hover:text-[#FBBF24] transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Clear all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sources.map((source) => {
                const statusMeta = getSourceStatusBadge(source.status, darkMode);
                const typeMeta = getSourceTypeMeta(source.type, darkMode);
                const successRate = calculateSourceSuccessRate(syncHistory, source.id);
                const isSyncing = syncingSourceId === source.id;
                const isPaused = source.status === "Paused";

                const menuItems = [
                  {
                    label: isSyncing ? "Syncing..." : "Sync Now",
                    icon: RefreshCw,
                    onClick: () => onSyncSource && onSyncSource(source),
                    disabled: isSyncing,
                  },
                  {
                    label: "View Details",
                    icon: Eye,
                    onClick: () => onViewDetails && onViewDetails(source),
                  },
                  {
                    label: "Edit Source",
                    icon: Edit2,
                    onClick: () => onEdit && onEdit(source),
                  },
                  {
                    label: isPaused ? "Resume Source" : "Pause Source",
                    icon: isPaused ? Play : Pause,
                    onClick: () => onToggleStatus && onToggleStatus(source),
                  },
                  { type: "divider" },
                  {
                    label: "Delete Source",
                    icon: Trash2,
                    onClick: () => onDelete && onDelete(source),
                    danger: true,
                  },
                ];

                return (
                  <tr
                    key={source.id}
                    onClick={() => onViewDetails && onViewDetails(source)}
                    className={`transition-colors cursor-pointer group ${tableRowHover}`}
                  >
                    {/* Source Name + Logo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <SourceLogo
                          name={source.name}
                          logoKey={source.logoKey}
                          size="md"
                          className="shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0">
                          <div
                            className={`font-bold truncate text-[13px] ${
                              darkMode
                                ? "text-white group-hover:text-[#FBBF24]"
                                : "text-slate-900 group-hover:text-[#D97706]"
                            } transition-colors`}
                          >
                            {source.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-400">
                              {source.id}
                            </span>
                            {source.latency && (
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                                  darkMode
                                    ? "bg-slate-800 text-slate-400"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {source.latency}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Source Type */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${typeMeta.badgeClass}`}
                      >
                        {typeMeta.label}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusMeta.badgeClass}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass} ${
                            source.status === "Active" ? "animate-pulse" : ""
                          }`}
                        />
                        {statusMeta.label}
                      </span>
                    </td>

                    {/* Last Sync */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span
                          className={`font-semibold text-xs ${
                            darkMode ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          {formatSourceTimestamp(source.lastSync)}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {source.frequency || "Continuous"}
                        </span>
                      </div>
                    </td>

                    {/* Jobs Retrieved */}
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-bold font-mono text-xs ${
                          darkMode ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        {(source.jobsRetrieved ?? source.totalJobsRetrieved ?? 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Jobs Today */}
                    <td className="py-3 px-4 text-right">
                      {(source.jobsRetrievedToday ?? source.jobsToday ?? 0) > 0 ? (
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                            darkMode
                              ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          }`}
                        >
                          +{source.jobsRetrievedToday ?? source.jobsToday ?? 0}
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-slate-400">0</span>
                      )}
                    </td>

                    {/* Success Rate */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1 min-w-[65px]">
                        <span
                          className={`font-mono text-[11px] font-bold ${
                            successRate === "--"
                              ? "text-slate-400"
                              : parseFloat(successRate) >= 95
                              ? "text-emerald-600 dark:text-emerald-400"
                              : parseFloat(successRate) >= 80
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {successRate}
                        </span>
                        {successRate !== "--" && (
                          <div className="w-14 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                parseFloat(successRate) >= 95
                                  ? "bg-emerald-500"
                                  : parseFloat(successRate) >= 80
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                              style={{ width: `${Math.min(parseFloat(successRate), 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {/* Quick Sync Button */}
                        <button
                          type="button"
                          disabled={isSyncing}
                          onClick={() => onSyncSource && onSyncSource(source)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                            darkMode
                              ? "text-slate-400 hover:text-white hover:bg-slate-800"
                              : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          }`}
                          title={isSyncing ? "Syncing..." : "Sync Source Now"}
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${
                              isSyncing ? "text-[#D97706] animate-spin" : ""
                            }`}
                          />
                        </button>

                        {/* Quick View Button */}
                        <button
                          type="button"
                          onClick={() => onViewDetails && onViewDetails(source)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            darkMode
                              ? "text-slate-400 hover:text-white hover:bg-slate-800"
                              : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          }`}
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Actions Menu */}
                        <DropdownMenu
                          trigger={
                            <div
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                darkMode
                              ? "text-slate-400 hover:text-white hover:bg-slate-800"
                              : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                              }`}
                              title="More options"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </div>
                          }
                          items={menuItems}
                          align="right"
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

      {/* Pagination Footer */}
      <div
        className={`px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${footerBg}`}
      >
        <div className="flex items-center gap-2">
          <span>
            Showing <span className="font-bold">{startIndex}</span> to{" "}
            <span className="font-bold">{endIndex}</span> of{" "}
            <span className="font-bold">{totalCount}</span> sources
          </span>

          <span className="text-slate-300 dark:text-slate-700">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px]">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) =>
                onPageSizeChange && onPageSizeChange(Number(e.target.value))
              }
              className={`text-xs py-0.5 px-2 rounded-md border font-medium focus:outline-hidden ${
                darkMode
                  ? "bg-[#161B22] border-[#30363D] text-white"
                  : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              darkMode
                ? "bg-[#161B22] border-[#30363D] text-slate-300 hover:bg-[#21262D]"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 text-xs font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              darkMode
                ? "bg-[#161B22] border-[#30363D] text-slate-300 hover:bg-[#21262D]"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
