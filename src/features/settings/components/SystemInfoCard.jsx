import React from "react";
import { Server, HardDrive } from "lucide-react";

/**
 * SystemInfoCard Component
 * Right column overview displaying honest platform telemetry and environment metadata.
 */
export default function SystemInfoCard({ darkMode = false }) {
  const rows = [
    {
      label: "Application Version",
      value: "v2.4.1-prod",
      badge: "Release",
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      label: "Environment",
      value: "Production (Multi-Region)",
      badge: "Live",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      label: "Last Updated",
      value: "Oct 13, 2026",
    },
    {
      label: "Database Status",
      value: "Reactive Mock Store",
      statusDot: "bg-emerald-500",
      subtext: "Read/Write State (Frontend)",
    },
    {
      label: "API Services Status",
      value: "Operational (850ms)",
      statusDot: "bg-emerald-500",
      subtext: "Simulated Telemetry",
    },
    {
      label: "Last Deployment",
      value: "Oct 10, 2026, 04:15 UTC",
      subtext: "Build #1084 (Mock)",
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
          <Server className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            System Information
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Infra Health
        </span>
      </div>

      <div className="space-y-3 text-xs">
        {/* Storage Progress Bar */}
        <div
          className={`p-3 rounded-xl border space-y-1.5 ${
            darkMode
              ? "bg-[#0D1117] border-[#30363D]"
              : "bg-slate-50/70 border-slate-200/80"
          }`}
        >
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span>Storage Usage</span>
            </div>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              14.2 MB / 50.0 MB
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-300"
              style={{ width: "28.4%" }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>28.4% utilized</span>
            <span className="italic">Frontend Local Mock</span>
          </div>
        </div>

        {/* Key-Value Telemetry Grid */}
        <div
          className={`divide-y rounded-xl border overflow-hidden ${
            darkMode
              ? "divide-[#30363D] border-[#30363D] bg-[#0D1117]"
              : "divide-slate-200/60 border-slate-200/80 bg-white"
          }`}
        >
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="p-2.5 flex items-center justify-between gap-2 text-xs"
            >
              <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                {row.label}
              </span>

              <div className="flex items-center gap-1.5 text-right">
                {row.statusDot && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${row.statusDot} shrink-0`}
                  />
                )}

                <div className="flex flex-col items-end">
                  <span
                    className={`font-semibold font-mono text-[11px] ${
                      darkMode ? "text-slate-200" : "text-slate-900"
                    }`}
                  >
                    {row.value}
                  </span>

                  {row.subtext && (
                    <span className="text-[9px] text-slate-400">
                      {row.subtext}
                    </span>
                  )}
                </div>

                {row.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${row.badgeClass}`}
                  >
                    {row.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
