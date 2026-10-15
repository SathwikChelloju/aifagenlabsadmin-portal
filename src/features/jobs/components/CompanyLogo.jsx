import React from "react";
import aifaLogo from "../../../assets/aifa-logo.png";
import { useSettings } from "../../../context/SettingsContext";

/**
 * CompanyLogo Component
 * Renders authentic brand SVGs for major tech companies and clean initials fallback.
 */
export default function CompanyLogo({ company, className = "w-6 h-6" }) {
  const norm = (company || "").toLowerCase().trim();
  const { settings } = useSettings();
  const currentLogo = settings?.general?.logoUrl || aifaLogo;

  if (norm.includes("google")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          fill="#EA4335"
        />
      </svg>
    );
  }

  if (norm.includes("microsoft")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" rx="1" />
        <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" rx="1" />
        <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" rx="1" />
        <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" rx="1" />
      </svg>
    );
  }

  if (norm.includes("aifa") || norm.includes("labs")) {
    return (
      <div className={`${className} rounded-full overflow-hidden bg-black flex items-center justify-center shrink-0 shadow-xs border border-slate-700/50`}>
        <img
          src={currentLogo}
          alt={settings?.general?.platformName || "AIFA GEN LABS"}
          className="h-full w-full object-contain p-0.5"
        />
      </div>
    );
  }

  if (norm.includes("openai")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.28 9.9a5.98 5.98 0 0 0-.52-4.94 6.07 6.07 0 0 0-6.52-2.88 5.98 5.98 0 0 0-4.63-2.07 6.07 6.07 0 0 0-5.78 4.2 5.98 5.98 0 0 0-4.11 2.88 6.07 6.07 0 0 0 .74 7.11 5.98 5.98 0 0 0 .52 4.94 6.07 6.07 0 0 0 6.52 2.88 5.98 5.98 0 0 0 4.63 2.07 6.07 6.07 0 0 0 5.78-4.2 5.98 5.98 0 0 0 4.11-2.88 6.07 6.07 0 0 0-.74-7.1zM12 14.88a2.88 2.88 0 1 1 2.88-2.88A2.88 2.88 0 0 1 12 14.88z" />
      </svg>
    );
  }

  if (norm.includes("atlassian")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path
          d="M11.45 2.15a.9.9 0 0 0-1.28 0L2.3 9.99a.9.9 0 0 0 .64 1.54h7.55a.9.9 0 0 0 .9-.9V2.15z"
          fill="#0052CC"
        />
        <path
          d="M12.55 21.85a.9.9 0 0 0 1.28 0l7.87-7.84a.9.9 0 0 0-.64-1.54h-7.55a.9.9 0 0 0-.9.9v8.48z"
          fill="#2684FF"
        />
      </svg>
    );
  }

  if (norm.includes("amazon")) {
    return (
      <div className={`${className} flex items-center justify-center font-black text-slate-900 dark:text-white text-base tracking-tighter`}>
        a<span className="text-[#FF9900] -ml-0.5 text-xs">↷</span>
      </div>
    );
  }

  if (norm.includes("meta")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#0668E1">
        <path d="M16.98 3.5c-2.4 0-4.32 1.5-5.02 3.16-.7-1.66-2.62-3.16-5.02-3.16-3.7 0-6.94 3.06-6.94 7.6 0 4.8 3.38 8.4 7.14 8.4 2.44 0 4.24-1.42 4.82-2.76.58 1.34 2.38 2.76 4.82 2.76 3.76 0 7.14-3.6 7.14-8.4 0-4.54-3.24-7.6-6.94-7.6zm-9.92 12.8c-2.28 0-4.46-2.18-4.46-5.2 0-3.08 2.1-5.08 4.46-5.08 1.94 0 3.66 1.44 4.14 3.64-.14.4-.34.84-.58 1.28-1.04 1.88-2.3 5.36-3.56 5.36zm9.84 0c-1.26 0-2.52-3.48-3.56-5.36-.24-.44-.44-.88-.58-1.28.48-2.2 2.2-3.64 4.14-3.64 2.36 0 4.46 2 4.46 5.08 0 3.02-2.18 5.2-4.46 5.2z" />
      </svg>
    );
  }

  // Fallback 2-letter initials circle
  const initials = norm
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={`${className} rounded-lg bg-slate-100 dark:bg-[#21262D] text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-[10px] border border-slate-200 dark:border-[#30363D] shrink-0`}
    >
      {initials || "JB"}
    </div>
  );
}
