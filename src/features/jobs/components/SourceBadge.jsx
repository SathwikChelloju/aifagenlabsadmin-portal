import React from "react";
import { Landmark, Globe } from "lucide-react";

/**
 * SourceBadge Component
 * Matches the exact source icons and typography from the screenshot:
 * - [in] LinkedIn
 * - [N] Naukri
 * - [🏛️] Internal
 * - [i] Indeed
 * - [G] Glassdoor
 */
export default function SourceBadge({ source, darkMode = false }) {
  const norm = (source || "").toLowerCase().trim();

  if (norm.includes("linkedin")) {
    return (
      <div className="inline-flex items-center gap-1.5 font-medium text-xs">
        <div className="w-4 h-4 rounded bg-[#0A66C2] text-white flex items-center justify-center font-bold text-[9px] shrink-0 font-sans leading-none">
          in
        </div>
        <span className={darkMode ? "text-slate-300" : "text-slate-700"}>LinkedIn</span>
      </div>
    );
  }

  if (norm.includes("naukri")) {
    return (
      <div className="inline-flex items-center gap-1.5 font-medium text-xs">
        <div className="w-4 h-4 rounded bg-[#1C1C1C] text-white flex items-center justify-center font-bold text-[9px] shrink-0 font-sans leading-none">
          N
        </div>
        <span className={darkMode ? "text-slate-300" : "text-slate-700"}>Naukri</span>
      </div>
    );
  }

  if (norm.includes("internal")) {
    return (
      <div className="inline-flex items-center gap-1.5 font-medium text-xs">
        <Landmark className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className={darkMode ? "text-slate-300" : "text-slate-700"}>Internal</span>
      </div>
    );
  }

  if (norm.includes("indeed")) {
    return (
      <div className="inline-flex items-center gap-1.5 font-medium text-xs">
        <div className="w-4 h-4 rounded-full bg-[#003A9B] text-white flex items-center justify-center font-bold text-[9px] shrink-0 font-sans leading-none">
          i
        </div>
        <span className={darkMode ? "text-slate-300" : "text-slate-700"}>Indeed</span>
      </div>
    );
  }

  if (norm.includes("glassdoor")) {
    return (
      <div className="inline-flex items-center gap-1.5 font-medium text-xs">
        <div className="w-4 h-4 rounded bg-[#0CAA41] text-white flex items-center justify-center font-bold text-[9px] shrink-0 font-sans leading-none">
          G
        </div>
        <span className={darkMode ? "text-slate-300" : "text-slate-700"}>Glassdoor</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 font-medium text-xs">
      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span className={darkMode ? "text-slate-300" : "text-slate-700"}>{source || "Public"}</span>
    </div>
  );
}
