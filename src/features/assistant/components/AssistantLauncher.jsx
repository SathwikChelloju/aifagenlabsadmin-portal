import React from "react";
import { Sparkles, MessageSquare } from "lucide-react";
import Tooltip from "../../../components/ui/Tooltip";

/**
 * AssistantLauncher Component
 * Floating action button positioned in bottom-right corner across all portal pages.
 */
export default function AssistantLauncher({
  isOpen = false,
  onClick,
  darkMode = false,
}) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Tooltip
        content={isOpen ? "Minimize AI Assistant" : "AI Admin Assistant — Ask anything about portal telemetry"}
        position="left"
      >
        <button
          type="button"
          onClick={onClick}
          aria-label="Toggle AI Admin Assistant"
          className={`relative group flex items-center justify-center w-13 h-13 rounded-2xl shadow-xl transition-all duration-200 cursor-pointer select-none active:scale-95 ${
            isOpen
              ? "bg-[#D97706] text-white ring-4 ring-amber-500/20 rotate-0 shadow-amber-500/20"
              : darkMode
              ? "bg-[#161B22] text-amber-400 border border-[#30363D] hover:bg-[#21262D] hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10"
              : "bg-[#0B192C] text-amber-400 border border-slate-700/40 hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/20"
          }`}
        >
          {/* Subtle Outer Pulsing Ring */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-2xl bg-amber-500/15 animate-ping pointer-events-none opacity-40 duration-1000" />
          )}

          <div className="relative flex items-center justify-center">
            {isOpen ? (
              <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-105" />
            ) : (
              <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110 text-amber-400" />
            )}
          </div>

          {/* Active Status Beacon */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-[#161B22]" />
        </button>
      </Tooltip>
    </div>
  );
}
