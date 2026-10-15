import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";

/**
 * Universal Pagination Primitive
 * Matches table footer controls with range summary and previous/next buttons.
 */
export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  className = "",
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  if (totalItems <= pageSize) {
    return (
      <div className={`p-4 text-xs font-mono text-slate-400 dark:text-slate-500 ${className}`}>
        Showing all {totalItems} records
      </div>
    );
  }

  return (
    <div
      className={`px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-slate-100 dark:border-slate-500/10 bg-slate-50/40 dark:bg-[#0D1117]/40 ${className}`}
    >
      <div className="font-mono text-slate-500 dark:text-slate-400">
        Showing <strong className="text-slate-900 dark:text-white">{startItem}</strong> to{" "}
        <strong className="text-slate-900 dark:text-white">{endItem}</strong> of{" "}
        <strong className="text-slate-900 dark:text-white">{totalItems}</strong> entries
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          icon={ChevronLeft}
        >
          Previous
        </Button>

        <span className="font-mono font-bold px-2 text-slate-700 dark:text-slate-300">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          iconRight={ChevronRight}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
