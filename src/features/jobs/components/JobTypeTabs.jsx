import React from "react";
import { Briefcase, Globe, Users, Radio } from "lucide-react";

/**
 * JobTypeTabs Component
 * Category controls matching the reference:
 * [ All Jobs ] [ Public Jobs ] [ Internal Jobs ] [ Job Sources ]
 */
export default function JobTypeTabs({
  activeTab = "All Jobs",
  onTabChange,
  onNavigateJobSources,
  counts = { all: 124, public: 78, internal: 46 },
  darkMode = false,
}) {
  const tabs = [
    {
      id: "All Jobs",
      label: "All Jobs",
      count: counts.all || 124,
      icon: Briefcase,
      iconColor: "text-amber-500",
    },
    {
      id: "Public Jobs",
      label: "Public Jobs",
      count: counts.public || 78,
      icon: Globe,
      iconColor: "text-blue-500",
    },
    {
      id: "Internal Jobs",
      label: "Internal Jobs",
      count: counts.internal || 46,
      icon: Users,
      iconColor: "text-rose-400",
    },
  ];

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto custom-scrollbar pb-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange && onTabChange(tab.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              isActive
                ? darkMode
                  ? "bg-[#161B22] border-2 border-amber-500/80 text-white shadow-amber-500/10"
                  : "bg-white border-2 border-amber-400/90 text-slate-900 shadow-[0_2px_12px_rgba(245,158,11,0.12)]"
                : darkMode
                ? "bg-[#161B22] border border-[#30363D] text-slate-400 hover:text-white hover:bg-[#21262D]"
                : "bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50/80"
            }`}
          >
            <Icon className={`w-4 h-4 ${tab.iconColor}`} />
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                isActive
                  ? darkMode
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-amber-50 text-amber-700"
                  : darkMode
                  ? "bg-[#21262D] text-slate-400"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}

      {/* Navigation button to Job Sources */}
      <button
        type="button"
        onClick={() => onNavigateJobSources && onNavigateJobSources()}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs group ${
          darkMode
            ? "bg-[#161B22] border border-[#30363D] text-slate-300 hover:text-white hover:border-amber-500/40 hover:bg-[#21262D]"
            : "bg-white border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:border-amber-300 hover:bg-amber-50/30"
        }`}
        title="View Job Sources"
      >
        <Radio className="w-4 h-4 text-emerald-500 group-hover:scale-105 transition-transform" />
        <span>Job Sources</span>
      </button>
    </div>
  );
}
