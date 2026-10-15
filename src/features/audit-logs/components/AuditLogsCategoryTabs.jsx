import React from "react";
import {
  Layers,
  ShieldCheck,
  Users,
  CreditCard,
  Briefcase,
  Radio,
  Sliders,
  Cpu,
} from "lucide-react";

/**
 * AuditLogsCategoryTabs Component
 * Category tabs below summary cards:
 * 1. All Events
 * 2. Security
 * 3. Users
 * 4. Payments
 * 5. Jobs
 * 6. Job Sources
 * 7. Administration
 * 8. System
 * Each displays icon, title, and dynamic event count badge.
 */
export default function AuditLogsCategoryTabs({
  activeTab = "All Events",
  onTabChange,
  counts = {},
  darkMode = false,
}) {
  const tabs = [
    {
      id: "All Events",
      label: "All Events",
      count: counts["All Events"] ?? 0,
      icon: Layers,
      iconColor: "text-amber-500",
    },
    {
      id: "Security",
      label: "Security",
      count: counts["Security"] ?? 0,
      icon: ShieldCheck,
      iconColor: "text-red-500",
    },
    {
      id: "Users",
      label: "Users",
      count: counts["Users"] ?? 0,
      icon: Users,
      iconColor: "text-blue-500",
    },
    {
      id: "Payments",
      label: "Payments",
      count: counts["Payments"] ?? 0,
      icon: CreditCard,
      iconColor: "text-emerald-500",
    },
    {
      id: "Jobs",
      label: "Jobs",
      count: counts["Jobs"] ?? 0,
      icon: Briefcase,
      iconColor: "text-violet-500",
    },
    {
      id: "Job Sources",
      label: "Job Sources",
      count: counts["Job Sources"] ?? 0,
      icon: Radio,
      iconColor: "text-cyan-500",
    },
    {
      id: "Administration",
      label: "Administration",
      count: counts["Administration"] ?? 0,
      icon: Sliders,
      iconColor: "text-indigo-500",
    },
    {
      id: "System",
      label: "System",
      count: counts["System"] ?? 0,
      icon: Cpu,
      iconColor: "text-slate-400",
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 pt-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange && onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs shrink-0 ${
              isActive
                ? darkMode
                  ? "bg-[#161B22] border-2 border-amber-500/80 text-white shadow-amber-500/10"
                  : "bg-white border-2 border-[#D97706] text-slate-900 shadow-[0_2px_12px_rgba(217,119,6,0.12)]"
                : darkMode
                ? "bg-[#161B22] border border-[#30363D] text-slate-400 hover:text-white hover:bg-[#21262D]"
                : "bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50/80"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 shrink-0 ${tab.iconColor}`} />
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                isActive
                  ? darkMode
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-amber-100 text-amber-900"
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
