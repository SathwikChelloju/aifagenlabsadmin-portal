import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { DEFAULT_SUGGESTIONS } from "../constants/assistantConstants";

/**
 * SuggestedPrompts Component
 * Renders clickable query chips for fast, one-click access to core operational questions.
 * Font size: 13-14px, comfortable spacing and clear contrast.
 */
export default function SuggestedPrompts({ onSelectPrompt, disabled = false, darkMode = false }) {
  const handleClick = (e, prompt) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    onSelectPrompt(prompt);
  };

  return (
    <div className="space-y-2.5 pt-2 pb-1">
      <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>Suggested Queries</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {DEFAULT_SUGGESTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={(e) => handleClick(e, item.prompt)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] sm:text-[14px] font-medium border text-left transition-all select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-95 ${
              darkMode
                ? "bg-[#161B22] border-[#30363D] text-slate-200 hover:text-white hover:bg-[#21262D] hover:border-amber-500/50"
                : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-amber-500/50 shadow-2xs"
            }`}
          >
            <span>{item.label}</span>
            <ArrowRight className="w-3 h-3 text-amber-500 shrink-0 opacity-70" />
          </button>
        ))}
      </div>
    </div>
  );
}
