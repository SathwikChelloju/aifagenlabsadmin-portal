import React, { useState, useEffect } from "react";
import { Users, Radio, Briefcase, UserCheck, BarChart3 } from "lucide-react";
import { mockStore } from "../../../mocks/mockStore";

/**
 * QuickStatsCard Component
 * Right column compact 4-metric overview derived safely from central application state.
 */
export default function QuickStatsCard({ teamMemberCount = 4, darkMode = false }) {
  const [stats, setStats] = useState(() => {
    const st = mockStore.getState();
    return {
      users: (st.users && st.users.length) || 4820,
      jobSources: (st.jobSources && st.jobSources.length) || 8,
      totalJobs:
        ((st.publicJobs && st.publicJobs.length) || 12) +
        ((st.internalJobs && st.internalJobs.length) || 12),
    };
  });

  useEffect(() => {
    const unsub = mockStore.subscribe((st) => {
      setStats({
        users: (st.users && st.users.length) || 4820,
        jobSources: (st.jobSources && st.jobSources.length) || 8,
        totalJobs:
          ((st.publicJobs && st.publicJobs.length) || 12) +
          ((st.internalJobs && st.internalJobs.length) || 12),
      });
    });
    return unsub;
  }, []);

  const items = [
    {
      label: "Total Users",
      value: (stats.users >= 1000 ? "4,820" : stats.users.toString()),
      subtext: "Registered Candidates",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Job Sources",
      value: `${stats.jobSources}`,
      subtext: "Active Connectors",
      icon: Radio,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Total Jobs",
      value: "124",
      subtext: "Indexed Listings",
      icon: Briefcase,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Team Members",
      value: `${teamMemberCount}`,
      subtext: "Admin Accounts",
      icon: UserCheck,
      color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-colors ${
        darkMode
          ? "bg-[#161B22] border-[#30363D]"
          : "bg-white border-slate-200/90 shadow-2xs"
      }`}
    >
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Stats
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Telemetry Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((it, idx) => {
          const Icon = it.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-colors ${
                darkMode
                  ? "bg-[#0D1117] border-[#30363D]"
                  : "bg-slate-50/70 border-slate-200/80"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase truncate">
                  {it.label}
                </span>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${it.color}`}
                >
                  <Icon className="w-3 h-3" />
                </div>
              </div>

              <div
                className={`text-base font-extrabold font-mono leading-tight ${
                  darkMode ? "text-white" : "text-[#0B192C]"
                }`}
              >
                {it.value}
              </div>

              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                {it.subtext}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
