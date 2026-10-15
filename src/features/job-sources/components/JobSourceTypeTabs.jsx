import React from "react";
import { Radio, Webhook, Globe, Building } from "lucide-react";

/**
 * JobSourceTypeTabs Component
 * Category tabs above search/filter toolbar:
 * - All Sources
 * - API Integrations
 * - Public Job Boards
 * - Internal
 * Each tab displays its current record count.
 */
export default function JobSourceTypeTabs({
  activeTab = "All Sources",
  onTabChange,
  counts = { all: 0, api: 0, job_board: 0, internal: 0 },
  darkMode = false,
}) {
  const tabs = [
    {
      id: "All Sources",
      label: "All Sources",
      count: counts.all ?? 0,
      icon: Radio,
      iconColor: "text-amber-500",
    },
    {
      id: "API Integrations",
      label: "API Integrations",
      count: counts.api ?? 0,
      icon: Webhook,
      iconColor: "text-blue-500",
    },
    {
      id: "Public Job Boards",
      label: "Public Job Boards",
      count: counts.job_board ?? 0,
      icon: Globe,
      iconColor: "text-purple-500",
    },
    {
      id: "Internal",
      label: "Internal",
      count: counts.internal ?? 0,
      icon: Building,
      iconColor: "text-emerald-500",
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
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                isActive
                  ? darkMode
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-amber-100 text-amber-800"
                  : darkMode
                  ? "bg-slate-800 text-slate-400"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
