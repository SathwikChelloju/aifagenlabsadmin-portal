import React from "react";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import heroImg from "../../../assets/hero.png";
import aifaLogo from "../../../assets/aifa-logo.png";

/**
 * BrandPreviewCard Component
 * Right column live illustrative representation of how public platform branding appears to users.
 * Reflects saved/active platformName, companyTagline, and custom logo.
 */
export default function BrandPreviewCard({
  platformName = "AIFA GEN LABS",
  companyTagline = "Career Optimization",
  logoUrl = null,
  darkMode = false,
}) {
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-colors overflow-hidden ${
        darkMode
          ? "bg-[#161B22] border-[#30363D]"
          : "bg-white border-slate-200/90 shadow-2xs"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Brand Preview
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#21262D] text-slate-500 dark:text-slate-400 font-semibold border border-slate-200 dark:border-[#30363D]">
          Live View
        </span>
      </div>

      {/* Simulated Candidate Web Portal Container */}
      <div className="rounded-xl border border-slate-200 dark:border-[#30363D] overflow-hidden bg-slate-900 text-white shadow-xs">
        {/* Mock Browser Header / Nav Bar */}
        <div className="px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={logoUrl || aifaLogo}
              alt="Platform Logo"
              className="w-6 h-6 object-contain rounded-md shrink-0 bg-white p-0.5"
            />
            <div className="truncate min-w-0">
              <div className="text-[11px] font-extrabold tracking-tight truncate leading-tight">
                {platformName || "AIFA GEN LABS"}
              </div>
              <div className="text-[8px] text-amber-400 font-medium truncate leading-none">
                {companyTagline || "Career Optimization"}
              </div>
            </div>
          </div>

          {/* Sample Nav Links */}
          <div className="hidden sm:flex items-center gap-2 text-[9px] text-slate-400 font-medium">
            <span className="text-white font-bold">Jobs</span>
            <span>Companies</span>
            <span>Mentors</span>
          </div>
        </div>

        {/* Hero Section Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-[#0B192C] to-slate-950 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-2.5">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[9px] font-bold text-amber-400">
              <span>Next-Gen Global Placement</span>
            </div>

            <h4 className="text-sm sm:text-base font-extrabold leading-tight text-white max-w-[220px]">
              Accelerate Your Global Career
            </h4>

            <p className="text-[10px] text-slate-300 leading-relaxed max-w-[240px]">
              Discover amazing opportunities across the world with AI matchmaking and ATS compliance.
            </p>

            {/* Simulated Search Bar */}
            <div className="pt-1 flex items-center gap-1.5 max-w-[230px]">
              <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-[10px] text-slate-400">
                <Search className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">Search role or country...</span>
              </div>
              <button
                type="button"
                className="px-2 py-1.5 rounded-lg bg-[#D97706] hover:bg-amber-600 text-white text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Hero isometric asset on right */}
          <div className="absolute -bottom-2 -right-2 w-24 h-24 opacity-60 pointer-events-none">
            <img
              src={heroImg}
              alt="Platform Asset"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2.5">
        Reflects configured branding across candidates, emails, and job portals.
      </div>
    </div>
  );
}
