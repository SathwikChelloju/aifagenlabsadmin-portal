import React, { useRef, useEffect, useState } from "react";
import {
  Eye,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Bot,
  Download,
  X,
  FileJson,
} from "lucide-react";
import {
  getResultBadgeClasses,
  getCategoryBadgeClasses,
} from "../utils/auditLogUtils";

/**
 * AuditLogsTable Component
 * 10-column immutable audit trail table:
 * 1. Checkbox
 * 2. Time (date line 1, time line 2)
 * 3. Event ID (monospace + copy)
 * 4. Actor (avatar + name + role)
 * 5. Action (action description + action code tag)
 * 6. Target (affected resource + resource type tag)
 * 7. Category (category badge)
 * 8. Result (Success / Failed / Denied / Warning pill)
 * 9. Source (Origin portal / system)
 * 10. Actions (View details eye + copy ID + 3-dot dropdown)
 * Includes functional selection bar, sorting, and pagination controls.
 */
export default function AuditLogsTable({
  events = [],
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  sortField = "timestamp",
  sortDirection = "desc",
  onSort,
  selectedIds = new Set(),
  onToggleSelect,
  onToggleSelectAll,
  onClearSelection,
  isAllSelected = false,
  isIndeterminate = false,
  onViewDetails,
  onExportSelected,
  darkMode = false,
}) {
  const headerCheckboxRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  // Close 3-dot menu on click outside
  useEffect(() => {
    function handleOutsideClick(e) {
      if (!e.target.closest(".row-action-menu")) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const copyToClipboard = (text, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/90";
  const tableHeader = darkMode
    ? "bg-[#0D1117] text-slate-400 border-[#30363D]"
    : "bg-slate-50/70 text-slate-500 border-slate-200";
  const tableRowHover = darkMode
    ? "hover:bg-[#1F242C] border-[#30363D]"
    : "hover:bg-slate-50/80 border-slate-100";
  const dividerColor = darkMode ? "divide-[#30363D]" : "divide-slate-100";

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ChevronDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-[#D97706]" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-[#D97706]" />
    );
  };

  const renderSortableHeader = (field, label, align = "left", className = "") => (
    <th
      onClick={() => onSort && onSort(field)}
      className={`py-3.5 px-3.5 text-${align} text-[10px] uppercase font-bold tracking-wider cursor-pointer group select-none transition-colors hover:text-slate-900 dark:hover:text-white ${className}`}
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
        {renderSortIcon(field)}
      </div>
    </th>
  );

  return (
    <div className="space-y-3">
      {/* CONDITIONAL BULK-ACTION BAR */}
      {selectedIds.size > 0 && (
        <div
          className={`px-4 py-2.5 rounded-2xl border shadow-xs flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
            darkMode
              ? "bg-[#161B22] border-amber-500/40 text-slate-200"
              : "bg-amber-50/70 border-amber-300 text-[#0B192C]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold font-mono">
              {selectedIds.size} {selectedIds.size === 1 ? "event" : "events"} selected
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <button
              type="button"
              onClick={() => onExportSelected && onExportSelected()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:underline cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Selected CSV</span>
            </button>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <button
              type="button"
              onClick={() => {
                const idsText = Array.from(selectedIds).join(", ");
                navigator.clipboard.writeText(idsText);
                alert(`Copied ${selectedIds.size} Event IDs to clipboard.`);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy IDs</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Selection</span>
          </button>
        </div>
      )}

      {/* TABLE CONTAINER */}
      <div className={`rounded-2xl border shadow-xs overflow-hidden transition-colors ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b ${tableHeader}`}>
                {/* 1. Selection Checkbox */}
                <th className="py-3.5 px-3 w-10 text-center">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    title="Select all events on this page"
                  />
                </th>

                {/* 2. Time */}
                {renderSortableHeader("timestamp", "Time", "left", "min-w-[130px]")}

                {/* 3. Event ID */}
                {renderSortableHeader("id", "Event ID", "left", "min-w-[140px]")}

                {/* 4. Actor */}
                {renderSortableHeader("actorName", "Actor", "left", "min-w-[190px]")}

                {/* 5. Action */}
                {renderSortableHeader("action", "Action", "left", "min-w-[210px]")}

                {/* 6. Target */}
                {renderSortableHeader("targetName", "Target", "left", "min-w-[180px]")}

                {/* 7. Category */}
                {renderSortableHeader("category", "Category", "left", "min-w-[110px]")}

                {/* 8. Result */}
                {renderSortableHeader("result", "Result", "center", "min-w-[95px]")}

                {/* 9. Source */}
                {renderSortableHeader("source", "Source", "left", "min-w-[120px]")}

                {/* 10. Actions */}
                <th className="py-3.5 px-4 text-right text-[10px] uppercase font-bold tracking-wider text-slate-400 min-w-[90px]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y ${dividerColor}`}>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto px-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                          darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <ShieldAlert className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <h4
                        className={`text-sm font-bold mb-1 ${
                          darkMode ? "text-white" : "text-[#0B192C]"
                        }`}
                      >
                        No audit events found
                      </h4>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        No activities match your current search and filter settings. Try adjusting or clearing your filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                events.map((e) => {
                  const isSelected = selectedIds.has(e.id);
                  const resultBadge = getResultBadgeClasses(e.result, darkMode);
                  const categoryBadge = getCategoryBadgeClasses(e.category, darkMode);

                  return (
                    <tr
                      key={e.id}
                      onClick={() => onViewDetails && onViewDetails(e)}
                      className={`transition-colors cursor-pointer ${tableRowHover} ${
                        isSelected
                          ? darkMode
                            ? "bg-amber-950/20"
                            : "bg-amber-50/50"
                          : ""
                      }`}
                    >
                      {/* 1. Selection Checkbox */}
                      <td
                        className="py-3.5 px-3 text-center"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelect && onToggleSelect(e.id)}
                          className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </td>

                      {/* 2. Time (date line 1, time line 2) */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {e.formattedDate}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                          {e.formattedTime}
                        </div>
                      </td>

                      {/* 3. Event ID (with copy) */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {e.id}
                          </span>
                          <button
                            type="button"
                            onClick={(ev) => copyToClipboard(e.id, ev)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
                            title="Copy Event ID"
                          >
                            {copiedId === e.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 4. Actor (avatar + name + role) */}
                      <td className="py-3.5 px-3.5">
                        <div className="flex items-center gap-2.5 min-w-[170px]">
                          {e.actorAvatar ? (
                            <img
                              src={e.actorAvatar}
                              alt={e.actorName}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : e.actorType === "System" ? (
                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                              <Bot className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                              {e.actorName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="font-bold truncate text-slate-900 dark:text-white">
                              {e.actorName}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {e.actorRole}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 5. Action (action description + action code tag) */}
                      <td className="py-3.5 px-3.5">
                        <div className="min-w-[190px]">
                          <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                            {e.actionLabel || e.action}
                          </div>
                          <div className="mt-0.5">
                            <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 px-1 py-0.2 rounded">
                              {e.action}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 6. Target */}
                      <td className="py-3.5 px-3.5">
                        <div className="min-w-[160px]">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {e.targetName}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            {e.targetType}
                          </div>
                        </div>
                      </td>

                      {/* 7. Category */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border ${categoryBadge}`}
                        >
                          {e.category}
                        </span>
                      </td>

                      {/* 8. Result */}
                      <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border uppercase tracking-wider ${resultBadge}`}
                        >
                          {e.result}
                        </span>
                      </td>

                      {/* 9. Source */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {e.source}
                        </span>
                      </td>

                      {/* 10. Actions */}
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1.5 relative row-action-menu">
                          <button
                            type="button"
                            onClick={() => onViewDetails && onViewDetails(e)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View Event Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setActiveMenuId(activeMenuId === e.id ? null : e.id);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="More Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Contextual 3-Dot Dropdown */}
                          {activeMenuId === e.id && (
                            <div
                              className={`absolute right-0 top-full mt-1 w-44 rounded-xl border shadow-xl z-30 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ${
                                darkMode
                                  ? "bg-[#161B22] border-[#30363D] text-slate-200"
                                  : "bg-white border-slate-200 text-slate-800"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onViewDetails?.(e);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span>View Details</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  copyToClipboard(e.id);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Copy Event ID</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onViewDetails?.(e, "context");
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                              >
                                <FileJson className="w-3.5 h-3.5 text-slate-400" />
                                <span>View Raw JSON</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div
          className={`py-3 px-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            darkMode ? "border-[#30363D] bg-[#0D1117]" : "border-slate-200 bg-slate-50/50"
          }`}
        >
          {/* Result Summary */}
          <div className="text-slate-500 dark:text-slate-400">
            Showing{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {startIndex}
            </span>{" "}
            to{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {endIndex}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {totalCount}
            </span>{" "}
            events
          </div>

          <div className="flex items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
                className={`rounded-lg px-2 py-1 text-xs font-medium border transition-colors focus:outline-none cursor-pointer ${
                  darkMode
                    ? "bg-[#161B22] border-[#30363D] text-white"
                    : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onPageChange && onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Pills */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Only render pages near current page
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => onPageChange && onPageChange(pageNum)}
                      className={`min-w-7 h-7 px-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        isActive
                          ? "bg-[#D97706] text-white shadow-2xs"
                          : darkMode
                          ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return (
                    <span key={pageNum} className="px-1 text-slate-400">
                      …
                    </span>
                  );
                }
                return null;
              })}

              <button
                type="button"
                onClick={() => onPageChange && onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
