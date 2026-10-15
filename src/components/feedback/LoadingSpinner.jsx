import React from "react";
import { RefreshCw } from "lucide-react";

/**
 * Universal LoadingSpinner Primitive
 * Matches portal's amber RefreshCw loading indicator.
 */
export default function LoadingSpinner({
  size = "md",
  label = "Loading...",
  className = "",
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <RefreshCw
        className={`animate-spin text-[#D97706] ${sizeClasses[size] || sizeClasses.md}`}
      />
      {label && (
        <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}
