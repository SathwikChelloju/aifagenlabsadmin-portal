import React from "react";
import { getSourceInitials } from "../utils/jobSourceUtils";
import aifaLogo from "../../../assets/aifa-logo.png";

/**
 * SourceLogo Component
 * Renders authentic vector icons and brand badges for job ingestion sources.
 */
export default function SourceLogo({ source, className = "w-7 h-7" }) {
  const norm = (typeof source === "string" ? source : source?.name || "")
    .toLowerCase()
    .trim();

  if (norm.includes("linkedin")) {
    return (
      <div
        className={`${className} rounded-lg bg-[#0A66C2] text-white flex items-center justify-center font-bold text-xs shrink-0 font-sans shadow-2xs`}
        title="LinkedIn"
      >
        in
      </div>
    );
  }

  if (norm.includes("greenhouse")) {
    return (
      <div
        className={`${className} rounded-lg bg-[#008552] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
        title="Greenhouse ATS"
      >
        GH
      </div>
    );
  }

  if (norm.includes("indeed")) {
    return (
      <div
        className={`${className} rounded-full bg-[#003A9B] text-white flex items-center justify-center font-bold text-xs shrink-0 font-sans shadow-2xs`}
        title="Indeed"
      >
        i
      </div>
    );
  }

  if (norm.includes("lever")) {
    return (
      <div
        className={`${className} rounded-lg bg-[#111827] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
        title="Lever"
      >
        Lv
      </div>
    );
  }

  if (norm.includes("internal") || norm.includes("aifa")) {
    return (
      <div
        className={`${className} rounded-full overflow-hidden bg-black flex items-center justify-center shrink-0 shadow-2xs border border-slate-700/50`}
        title="AIFA Internal"
      >
        <img
          src={aifaLogo}
          alt="AIFA Internal"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (norm.includes("naukri")) {
    return (
      <div
        className={`${className} rounded-lg bg-[#1C1C1C] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
        title="Naukri"
      >
        N
      </div>
    );
  }

  if (norm.includes("workday")) {
    return (
      <div
        className={`${className} rounded-lg bg-[#0875E1] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
        title="Workday"
      >
        Wd
      </div>
    );
  }

  if (norm.includes("glassdoor")) {
    return (
      <div
        className={`${className} rounded-lg bg-[#0CAA41] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
        title="Glassdoor"
      >
        GD
      </div>
    );
  }

  // Fallback Initials
  const name = typeof source === "string" ? source : source?.name || "Job Source";
  const initials = getSourceInitials(name);

  return (
    <div
      className={`${className} rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs shrink-0`}
      title={name}
    >
      {initials}
    </div>
  );
}
