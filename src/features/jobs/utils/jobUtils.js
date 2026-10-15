/**
 * Job Utilities & Presentation Helpers
 * Formatters, badge styling, CSV generator, and date utilities for unified Jobs.
 */

/**
 * Extracts 1-2 character uppercase initials for company logo fallback
 */
export function getCompanyInitials(name = "") {
  if (!name) return "JB";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Generates badge metadata for Job Status
 * Supports: Active, Draft, Paused, Closed
 */
export function getJobStatusBadge(status, darkMode = false) {
  const norm = (status || "").toLowerCase().trim();

  if (norm === "active" || norm === "open") {
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

  if (norm === "draft") {
    return {
      label: "Draft",
      badgeClass: darkMode
        ? "bg-slate-800/60 text-slate-300 border-slate-700"
        : "bg-slate-100 text-slate-700 border-slate-200",
      dotClass: "bg-slate-400",
    };
  }

  if (norm === "closed" || norm === "filled") {
    return {
      label: "Closed",
      badgeClass: darkMode
        ? "bg-rose-950/30 text-rose-300 border-rose-800/40"
        : "bg-rose-50 text-rose-700 border-rose-200/60",
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
 * Generates badge metadata for Job Type (Public vs Internal)
 */
export function getJobTypeBadge(type, darkMode = false) {
  const isInternal = (type || "").toLowerCase() === "internal";

  if (isInternal) {
    return {
      label: "Internal",
      badgeClass: darkMode
        ? "bg-purple-950/40 text-purple-300 border-purple-800/50"
        : "bg-purple-50 text-purple-700 border-purple-200/80",
    };
  }

  return {
    label: "Public",
    badgeClass: darkMode
      ? "bg-sky-950/40 text-sky-300 border-sky-800/50"
      : "bg-sky-50 text-sky-700 border-sky-200/80",
  };
}

/**
 * Generates badge metadata for Employment Type
 */
export function getEmploymentTypeBadge(type, darkMode = false) {
  const norm = (type || "Full-time").toLowerCase();

  let accentClass = darkMode
    ? "bg-[#21262D] text-slate-300 border-[#30363D]"
    : "bg-slate-100 text-slate-700 border-slate-200";

  if (norm.includes("contract")) {
    accentClass = darkMode
      ? "bg-amber-950/30 text-amber-300 border-amber-800/40"
      : "bg-amber-50/70 text-amber-700 border-amber-200/60";
  } else if (norm.includes("intern")) {
    accentClass = darkMode
      ? "bg-teal-950/30 text-teal-300 border-teal-800/40"
      : "bg-teal-50/70 text-teal-700 border-teal-200/60";
  } else if (norm.includes("part-time")) {
    accentClass = darkMode
      ? "bg-indigo-950/30 text-indigo-300 border-indigo-800/40"
      : "bg-indigo-50/70 text-indigo-700 border-indigo-200/60";
  }

  return {
    label: type || "Full-time",
    badgeClass: accentClass,
  };
}

/**
 * Parses diverse mock date formats into valid timestamps
 */
export function parseDateSafe(dateStr) {
  if (!dateStr) return null;
  const parsed = Date.parse(dateStr);
  if (!Number.isNaN(parsed)) return parsed;

  const currentYear = 2026;
  const withYear = Date.parse(`${dateStr}, ${currentYear}`);
  if (!Number.isNaN(withYear)) return withYear;

  return null;
}

/**
 * Filters jobs by relative date posted range
 */
export function filterJobsByDate(jobs = [], dateFilter = "All Time", referenceTime = Date.now()) {
  if (dateFilter === "All Time") return jobs;

  const ONE_DAY = 24 * 60 * 60 * 1000;
  let maxAge = Infinity;

  if (dateFilter === "Today") {
    maxAge = ONE_DAY;
  } else if (dateFilter === "Last 7 Days") {
    maxAge = 7 * ONE_DAY;
  } else if (dateFilter === "Last 30 Days") {
    maxAge = 30 * ONE_DAY;
  } else if (dateFilter === "Last 90 Days") {
    maxAge = 90 * ONE_DAY;
  }

  return jobs.filter((job) => {
    const timestamp = parseDateSafe(job.postedDate || job.createdDate);
    if (!timestamp) return true;
    return referenceTime - timestamp <= maxAge;
  });
}

/**
 * Escapes values for CSV RFC 4180
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
 * Generates RFC 4180 CSV export content for filtered jobs
 */
export function generateJobsCsv(jobs = []) {
  const headers = [
    "Job ID",
    "Job Title",
    "Company",
    "Job Type",
    "Location",
    "Employment Type",
    "Source",
    "Posted Date",
    "Status",
    "Visibility",
    "Salary Range",
    "Application URL",
  ];

  const rows = jobs.map((job) => [
    escapeCsvCell(job.id),
    escapeCsvCell(job.title),
    escapeCsvCell(job.company),
    escapeCsvCell(job.type === "internal" ? "Internal" : "Public"),
    escapeCsvCell(job.location),
    escapeCsvCell(job.employmentType || "Full-time"),
    escapeCsvCell(job.source || (job.type === "internal" ? "Internal" : "Public Feed")),
    escapeCsvCell(job.postedDate || job.createdDate),
    escapeCsvCell(job.status || "Active"),
    escapeCsvCell(job.isHidden ? "Hidden" : "Visible"),
    escapeCsvCell(job.salaryRange || "Not specified"),
    escapeCsvCell(job.applicationUrl || ""),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}
