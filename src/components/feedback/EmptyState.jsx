import React from "react";
import { FolderSearch } from "lucide-react";
import Button from "../ui/Button";

/**
 * Universal EmptyState Primitive
 * Displays friendly placeholder when tables or queries return zero records.
 */
export default function EmptyState({
  title = "No data available",
  description = "No entries matching your query were found.",
  icon: Icon = FolderSearch,
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div
      className={`p-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto ${className}`}
    >
      <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#21262D] text-slate-400 dark:text-slate-500 mb-3.5 border border-slate-200/80 dark:border-[#30363D]">
        <Icon className="w-6 h-6" />
      </div>

      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
        {title}
      </h4>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
