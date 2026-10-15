/**
 * Job Source Utilities & Presentation Helpers
 * Formatters, badges, calculations, and CSV generator.
 */

/**
 * Extracts 1-2 letter uppercase initials for source logo fallback
 */
export function getSourceInitials(name = "") {
  if (!name) return "JS";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Returns badge styling for source status
 */
export function getSourceStatusBadge(status, darkMode = false) {
  const norm = (status || "").toLowerCase().trim();

  if (norm === "active" || norm === "working") {
    return {
      label: "Active",
      badgeClass: darkMode
        ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/50"
        : "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      dotClass: "bg-emerald-500",
    };
  }

  if (norm === "paused") {
    return {
      label: "Paused",
      badgeClass: darkMode
        ? "bg-amber-950/40 text-amber-300 border-amber-800/50"
        : "bg-amber-50 text-amber-700 border-amber-200/80",
      dotClass: "bg-amber-500",
    };
  }

  if (norm === "error" || norm === "failed" || norm === "attention") {
    return {
      label: "Error",
      badgeClass: darkMode
        ? "bg-rose-950/40 text-rose-300 border-rose-800/50"
        : "bg-rose-50 text-rose-700 border-rose-200/80",
      dotClass: "bg-rose-500",
    };
  }

  return {
    label: status || "Unknown",
    badgeClass: darkMode
      ? "bg-slate-800 text-slate-300 border-slate-700"
      : "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  };
}

/**
 * Returns label and badge styling for source type
 */
export function getSourceTypeMeta(type, darkMode = false) {
  const norm = (type || "").toLowerCase().trim();

  if (norm === "api") {
    return {
      label: "API Integration",
      shortLabel: "API",
      badgeClass: darkMode
        ? "bg-sky-950/40 text-sky-300 border-sky-800/50"
        : "bg-sky-50 text-sky-700 border-sky-200/80",
    };
  }

  if (norm === "job_board" || norm === "public" || norm === "board") {
    return {
      label: "Public Job Board",
      shortLabel: "Job Board",
      badgeClass: darkMode
        ? "bg-purple-950/40 text-purple-300 border-purple-800/50"
        : "bg-purple-50 text-purple-700 border-purple-200/80",
    };
  }

  if (norm === "internal") {
    return {
      label: "Internal",
      shortLabel: "Internal",
      badgeClass: darkMode
        ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/50"
        : "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    };
  }

  return {
    label: type || "Custom Source",
    shortLabel: type || "Custom",
    badgeClass: darkMode
      ? "bg-slate-800 text-slate-300 border-slate-700"
      : "bg-slate-100 text-slate-700 border-slate-200",
  };
}

/**
 * Calculates success rate percentage from synchronization history
 * Returns formatted string like "98.5%" or "--" if no recorded attempts.
 */
export function calculateSourceSuccessRate(syncHistory = [], sourceId) {
  if (!syncHistory || syncHistory.length === 0) return "--";

  const attempts = sourceId
    ? syncHistory.filter((h) => h.sourceId === sourceId)
    : syncHistory;

  if (attempts.length === 0) return "--";

  const successCount = attempts.filter((h) => h.result === "Success").length;
  const rate = (successCount / attempts.length) * 100;
  return `${rate.toFixed(1)}%`;
}

/**
 * Formats timestamps into relative or readable dates safely
 */
export function formatSourceTimestamp(isoString) {
  if (!isoString) return "--";

  const timestamp = new Date(isoString).getTime();
  if (isNaN(timestamp)) return "--";

  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);

  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 172800) return "1 day ago";
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} days ago`;

  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * RFC 4180 CSV escaping helper
 */
function escapeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates RFC 4180 CSV content for job sources
 */
export function generateJobSourcesCsv(sources = [], syncHistory = []) {
  const headers = [
    "Source ID",
    "Source Name",
    "Source Type",
    "Status",
    "Last Sync",
    "Total Jobs Retrieved",
    "Jobs Today",
    "Success Rate",
    "Endpoint",
    "Protocol",
    "Created Date",
  ];

  const rows = sources.map((src) => {
    const typeMeta = getSourceTypeMeta(src.type);
    const successRate = calculateSourceSuccessRate(syncHistory, src.id);

    return [
      escapeCsvCell(src.id),
      escapeCsvCell(src.name),
      escapeCsvCell(typeMeta.label),
      escapeCsvCell(src.status || "Active"),
      escapeCsvCell(formatSourceTimestamp(src.lastSync)),
      escapeCsvCell(src.totalJobsRetrieved ?? src.jobsRetrieved ?? 0),
      escapeCsvCell(src.jobsToday ?? src.jobsRetrievedToday ?? 0),
      escapeCsvCell(successRate),
      escapeCsvCell(src.endpoint || ""),
      escapeCsvCell(src.protocol || ""),
      escapeCsvCell(src.createdDate || ""),
    ];
  });

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}

/**
 * Generates CSV and triggers file download in browser
 */
export function exportJobSourcesToCSV(sources = [], syncHistory = []) {
  const csvString = generateJobSourcesCsv(sources, syncHistory);
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `job-sources-export-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
