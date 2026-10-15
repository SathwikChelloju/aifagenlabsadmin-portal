import React from "react";
import LoadingSpinner from "../feedback/LoadingSpinner";
import EmptyState from "../feedback/EmptyState";

/**
 * Universal DataTable Primitive
 * Matches table styling in ExpiringPlansTable with uppercase tracking and subtle hover highlights.
 */
export default function DataTable({
  columns = [],
  data = [],
  keyField = "id",
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no matching entries for the selected filters.",
  onRowClick,
  className = "",
}) {
  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-[#0D1117] border-b border-slate-200 dark:border-[#30363D] text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                style={{ width: col.width }}
                className={`py-3.5 px-4 first:pl-6 last:pr-6 ${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left"
                } ${col.headerClassName || ""}`}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-[#30363D]/60 text-sm">
          {data.map((row, rowIdx) => {
            const rowKey = row[keyField] || rowIdx;
            const isClickable = Boolean(onRowClick);

            return (
              <tr
                key={rowKey}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${
                  isClickable ? "cursor-pointer" : ""
                } hover:bg-slate-50/80 dark:hover:bg-[#1F242C]`}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={`py-3.5 px-4 first:pl-6 last:pr-6 text-slate-800 dark:text-slate-200 ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    } ${col.className || ""}`}
                  >
                    {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
