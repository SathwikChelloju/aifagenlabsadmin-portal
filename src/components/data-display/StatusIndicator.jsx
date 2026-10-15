import React from "react";

/**
 * Universal StatusIndicator Primitive
 * Glowing status beacon matching crawler worker status indicators.
 */
export default function StatusIndicator({
  status = "Working",
  label,
  pulse = true,
  className = "",
}) {
  const isProblem = status === "Attention" || status === "Past Due" || status === "Stalled";
  const isFailed = status === "Failed" || status === "Inactive";

  const colorConfig = isFailed
    ? { dot: "bg-rose-500", ping: "bg-rose-400", text: "text-rose-700 dark:text-rose-400" }
    : isProblem
    ? { dot: "bg-amber-500", ping: "bg-amber-400", text: "text-amber-700 dark:text-amber-400" }
    : { dot: "bg-emerald-500", ping: "bg-emerald-400", text: "text-emerald-700 dark:text-emerald-400" };

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorConfig.ping}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${colorConfig.dot}`} />
      </span>

      {(label || status) && (
        <span className={`text-xs font-semibold ${colorConfig.text}`}>
          {label || status}
        </span>
      )}
    </div>
  );
}
