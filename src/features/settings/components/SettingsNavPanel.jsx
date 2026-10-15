import React from "react";
import { SETTINGS_SECTIONS } from "../constants/settingsData";

/**
 * SettingsNavPanel Component (Column 1)
 * Vertical Settings navigation rail with all 9 prescribed sections,
 * icons, primary labels, secondary descriptions, and active orange styling.
 */
export default function SettingsNavPanel({
  activeSection = "general",
  onSelectSection,
  darkMode = false,
}) {
  return (
    <div
      className={`rounded-2xl border p-2 sm:p-2.5 space-y-1 transition-colors ${
        darkMode
          ? "bg-[#161B22] border-[#30363D]"
          : "bg-white border-slate-200/90 shadow-2xs"
      }`}
    >
      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Navigation
      </div>

      <nav className="space-y-1">
        {SETTINGS_SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? darkMode
                    ? "bg-amber-500/15 text-white border border-amber-500/30 font-bold"
                    : "bg-amber-50/70 text-slate-900 border border-amber-200/80 shadow-2xs font-bold"
                  : darkMode
                  ? "text-slate-400 hover:text-slate-200 hover:bg-[#21262D]/60 border border-transparent"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
              }`}
            >
              {/* Active left indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#D97706] rounded-r-full" />
              )}

              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isActive
                    ? darkMode
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-amber-100 text-amber-700"
                    : darkMode
                    ? "bg-[#21262D] text-slate-400"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={`text-xs leading-snug truncate ${
                    isActive
                      ? darkMode
                        ? "text-white font-bold"
                        : "text-[#0B192C] font-bold"
                      : darkMode
                      ? "text-slate-300 font-semibold"
                      : "text-slate-800 font-semibold"
                  }`}
                >
                  {sec.label}
                </div>
                <div
                  className={`text-[11px] leading-tight mt-0.5 line-clamp-1 ${
                    isActive
                      ? darkMode
                        ? "text-amber-400/90"
                        : "text-amber-800/80"
                      : "text-slate-400"
                  }`}
                >
                  {sec.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
