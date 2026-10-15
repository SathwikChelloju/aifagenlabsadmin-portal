/**
 * Design Tokens & Theme Constants
 * Matches AIFA GEN LABS Oxford Navy & Oxford Amber brand guidelines
 */

export const THEME_COLORS = {
  // Brand accents
  amber: {
    primary: "#D97706", // Amber 600
    hover: "#B45309",   // Amber 700
    light: "#FEF3C7",   // Amber 100
    subtle: "#FFFBEB",  // Amber 50
    border: "#FDE68A",  // Amber 200
  },
  navy: {
    primary: "#0B192C",
    surface: "#0F172A", // Slate 900
    secondary: "#1E293B", // Slate 800
    muted: "#475569",    // Slate 600
  },
  emerald: {
    primary: "#16A34A", // Logo AG green
    dark: "#15803D",
    subtle: "#ECFDF5",
    border: "#A7F3D0",
  },
  rose: {
    primary: "#E11D48",
    subtle: "#FFF1F2",
    border: "#FECDD3",
  },
  // Surfaces
  surface: {
    lightCanvas: "#F5F7FB",
    lightCard: "#FFFFFF",
    lightBorder: "rgba(226, 232, 240, 0.9)",
    darkCanvas: "#090D12",
    darkCard: "#161B22",
    darkHeader: "#0D1117",
    darkBorder: "#30363D",
    darkHover: "#21262D",
  },
};

export const BADGE_VARIANTS = {
  success: {
    light: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    dark: "bg-emerald-950/40 text-emerald-300 border border-emerald-800/60",
  },
  warning: {
    light: "bg-amber-50 text-amber-800 border border-amber-200",
    dark: "bg-amber-950/40 text-amber-300 border border-amber-800/60",
  },
  danger: {
    light: "bg-rose-50 text-rose-800 border border-rose-200",
    dark: "bg-rose-950/40 text-rose-300 border border-rose-800/60",
  },
  navy: {
    light: "bg-[#0B192C] text-white border border-[#0B192C]",
    dark: "bg-[#1E293B] text-slate-100 border border-slate-700",
  },
  neutral: {
    light: "bg-slate-100 text-slate-700 border border-slate-200",
    dark: "bg-[#21262D] text-slate-300 border border-[#30363D]",
  },
  accent: {
    light: "bg-amber-50 text-[#D97706] border border-amber-200/80",
    dark: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  },
};

export const STATUS_MAP = {
  Active: "success",
  Working: "success",
  Verified: "success",
  Attention: "warning",
  "Past Due": "warning",
  Stalled: "warning",
  Failed: "danger",
  Inactive: "neutral",
  None: "neutral",
  Draft: "neutral",
};
