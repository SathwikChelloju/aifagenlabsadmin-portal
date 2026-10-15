/**
 * Utility functions for AIFA GEN LABS Audit Logs
 * Includes CSV generation, badge styling, date formatting, and filter matching.
 */

/**
 * Escapes a single CSV cell value
 */
export function escapeCsvCell(value) {
  if (value === null || value === undefined) return '""';
  const stringVal = String(value);
  if (
    stringVal.includes(",") ||
    stringVal.includes('"') ||
    stringVal.includes("\n") ||
    stringVal.includes("\r")
  ) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return `"${stringVal}"`;
}

/**
 * Generates formatted CSV string for audit log events
 */
export function generateAuditLogsCSV(events = []) {
  const headers = [
    "Event ID",
    "Timestamp (UTC)",
    "Date",
    "Time",
    "Actor Name",
    "Actor Email",
    "Actor Role",
    "Actor Type",
    "Action Code",
    "Action Description",
    "Category",
    "Target Name",
    "Target Type",
    "Result",
    "Source Application",
    "IP Address",
    "Correlation ID",
    "Description",
  ];

  const rows = events.map((e) => [
    escapeCsvCell(e.id),
    escapeCsvCell(e.timestamp),
    escapeCsvCell(e.formattedDate),
    escapeCsvCell(e.formattedTime),
    escapeCsvCell(e.actorName),
    escapeCsvCell(e.actorEmail || ""),
    escapeCsvCell(e.actorRole),
    escapeCsvCell(e.actorType),
    escapeCsvCell(e.action),
    escapeCsvCell(e.actionLabel || e.action),
    escapeCsvCell(e.category),
    escapeCsvCell(e.targetName),
    escapeCsvCell(e.targetType),
    escapeCsvCell(e.result),
    escapeCsvCell(e.source),
    escapeCsvCell(e.ipAddress || ""),
    escapeCsvCell(e.correlationId || ""),
    escapeCsvCell(e.description),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}

/**
 * Triggers browser download of audit events CSV
 */
export function exportAuditLogsToCSV(events = [], filenamePrefix = "audit_logs_export") {
  const csvContent = generateAuditLogsCSV(events);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const todayStr = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `${filenamePrefix}_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Returns color classes for Event Result badge
 */
export function getResultBadgeClasses(result, darkMode = false) {
  switch (result) {
    case "Success":
      return darkMode
        ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/50"
        : "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    case "Failed":
      return darkMode
        ? "bg-rose-950/40 text-rose-300 border-rose-800/50"
        : "bg-rose-50 text-rose-700 border-rose-200/80";
    case "Denied":
      return darkMode
        ? "bg-red-950/50 text-red-400 border-red-800/60"
        : "bg-red-100/70 text-red-800 border-red-300/80";
    case "Warning":
      return darkMode
        ? "bg-amber-950/40 text-amber-300 border-amber-800/50"
        : "bg-amber-50 text-amber-700 border-amber-200/80";
    default:
      return darkMode
        ? "bg-slate-800 text-slate-300 border-slate-700"
        : "bg-slate-100 text-slate-700 border-slate-200";
  }
}

/**
 * Returns color classes for Category badge
 */
export function getCategoryBadgeClasses(category, darkMode = false) {
  switch (category) {
    case "Security":
      return darkMode
        ? "bg-red-950/30 text-red-300 border-red-800/40"
        : "bg-red-50 text-red-700 border-red-200/60";
    case "Users":
      return darkMode
        ? "bg-blue-950/30 text-blue-300 border-blue-800/40"
        : "bg-blue-50 text-blue-700 border-blue-200/60";
    case "Payments":
      return darkMode
        ? "bg-emerald-950/30 text-emerald-300 border-emerald-800/40"
        : "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    case "Jobs":
      return darkMode
        ? "bg-violet-950/30 text-violet-300 border-violet-800/40"
        : "bg-violet-50 text-violet-700 border-violet-200/60";
    case "Job Sources":
      return darkMode
        ? "bg-cyan-950/30 text-cyan-300 border-cyan-800/40"
        : "bg-cyan-50 text-cyan-700 border-cyan-200/60";
    case "Administration":
      return darkMode
        ? "bg-indigo-950/30 text-indigo-300 border-indigo-800/40"
        : "bg-indigo-50 text-indigo-700 border-indigo-200/60";
    case "System":
      return darkMode
        ? "bg-slate-800 text-slate-300 border-slate-700"
        : "bg-slate-100 text-slate-700 border-slate-200/70";
    default:
      return darkMode
        ? "bg-slate-800 text-slate-300 border-slate-700"
        : "bg-slate-100 text-slate-700 border-slate-200";
  }
}

/**
 * Returns actor type badge color
 */
export function getActorTypeBadgeClasses(type, darkMode = false) {
  switch (type) {
    case "Admin":
      return darkMode
        ? "bg-amber-950/40 text-amber-300 border-amber-800/40"
        : "bg-amber-50 text-amber-700 border-amber-200/60";
    case "Employee":
      return darkMode
        ? "bg-blue-950/40 text-blue-300 border-blue-800/40"
        : "bg-blue-50 text-blue-700 border-blue-200/60";
    case "Recruiter":
      return darkMode
        ? "bg-purple-950/40 text-purple-300 border-purple-800/40"
        : "bg-purple-50 text-purple-700 border-purple-200/60";
    case "User":
      return darkMode
        ? "bg-teal-950/40 text-teal-300 border-teal-800/40"
        : "bg-teal-50 text-teal-700 border-teal-200/60";
    case "System":
      return darkMode
        ? "bg-slate-800 text-slate-400 border-slate-700"
        : "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return darkMode
        ? "bg-slate-800 text-slate-400 border-slate-700"
        : "bg-slate-100 text-slate-600 border-slate-200";
  }
}

/**
 * Formats relative time (e.g. "12m ago", "2h ago", "1d ago")
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return "--";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return "just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "--";
  }
}
