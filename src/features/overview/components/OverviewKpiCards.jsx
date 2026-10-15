import React from "react";
import {
  Cpu,
  Briefcase,
  UserPlus,
  Users,
  UserCheck,
  Building,
} from "lucide-react";

export default function OverviewKpiCards({
  kpis,
  onNavigate,
  darkMode = false,
}) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D] hover:border-slate-600"
    : "bg-white border-slate-200/80 hover:border-slate-300";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const iconBoxBg = darkMode
    ? "bg-[#0D1117] border-[#30363D] text-slate-400"
    : "bg-slate-50 border-slate-100 text-slate-500";

  const cards = [
    {
      id: "ai-cost",
      label: "AI COST",
      value: `$${(kpis?.aiCost?.value || 842.15).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      badge: "+14.2%",
      badgeStyle:
        "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
      sub: "vs last 30d",
      icon: Cpu,
      route: "ai-usage",
    },
    {
      id: "jobs-fetched",
      label: "JOBS FETCHED",
      value: (kpis?.jobsFetched?.value || 1248).toLocaleString(),
      badge: `${kpis?.jobsFetched?.activeSources || 5} Active`,
      badgeStyle:
        "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
      sub: "sources",
      icon: Briefcase,
      route: "jobs",
    },
    {
      id: "new-candidates",
      label: "NEW CANDIDATES",
      value: `+${(kpis?.newCandidates?.value || 482).toLocaleString()}`,
      badge: "+18.5%",
      badgeStyle:
        "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
      sub: "vs last 30d",
      icon: UserPlus,
      route: "users",
    },
    {
      id: "total-students",
      label: "TOTAL STUDENTS",
      value: (kpis?.totalStudents?.value || 4820).toLocaleString(),
      badge: "890 Prem",
      badgeStyle:
        "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
      sub: "530 Basic",
      icon: Users,
      route: "users",
    },
    {
      id: "recruiters",
      label: "RECRUITERS",
      value: (kpis?.totalRecruiters?.value || 12).toString(),
      badge: `${kpis?.totalRecruiters?.activeCount || 11} Active`,
      badgeStyle:
        "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
      sub: `${kpis?.totalRecruiters?.onLeaveCount || 1} on leave`,
      icon: UserCheck,
      route: "recruiters",
    },
    {
      id: "new-employees",
      label: "NEW EMPLOYEES",
      value: (kpis?.newlyJoinedEmployees?.value || 3).toString(),
      badge: "Onboarded",
      badgeStyle:
        "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20",
      sub: "this period",
      icon: Building,
      route: "recruiters",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            onClick={() => onNavigate?.(c.route)}
            className={`border rounded-2xl p-4 shadow-2xs transition-all cursor-pointer flex flex-col justify-between ${cardBg}`}
            title={`Drill down to ${c.label}`}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
                {c.label}
              </span>
              <div
                className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${iconBoxBg}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div
                className={`text-2xl sm:text-2xl font-black font-mono tracking-tight ${headingText}`}
              >
                {c.value}
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-[11px] truncate">
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border font-mono shrink-0 ${c.badgeStyle}`}
                >
                  {c.badge}
                </span>
                <span className={`truncate ${subText}`}>{c.sub}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
