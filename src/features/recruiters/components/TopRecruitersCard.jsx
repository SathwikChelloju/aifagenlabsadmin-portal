import React, { useState, useMemo } from "react";
import { Trophy, ChevronRight } from "lucide-react";

const METRIC_OPTIONS = [
  { id: "interviewsConducted", label: "Interviews", fullLabel: "Interviews Conducted", unit: "" },
  { id: "successfulPlacements", label: "Placements", fullLabel: "Successful Placements", unit: "" },
  { id: "candidatesAssigned", label: "Assigned", fullLabel: "Candidates Assigned", unit: "" },
  { id: "placementRate", label: "Placement Rate", fullLabel: "Placement Rate", unit: "%" },
];

export default function TopRecruitersCard({
  recruiters = [],
  onSelectRecruiter,
  darkMode = false,
}) {
  const [selectedMetric, setSelectedMetric] = useState("successfulPlacements");

  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  // Rank top 5 recruiters by selected metric
  const topRecruiters = useMemo(() => {
    if (!recruiters || recruiters.length === 0) return [];
    return [...recruiters]
      .sort((a, b) => {
        const valA = Number(a[selectedMetric]) || 0;
        const valB = Number(b[selectedMetric]) || 0;
        return valB - valA;
      })
      .slice(0, 5);
  }, [recruiters, selectedMetric]);

  // Max value for comparative bar scaling
  const maxMetricVal = useMemo(() => {
    if (topRecruiters.length === 0) return 1;
    const topVal = Number(topRecruiters[0][selectedMetric]) || 0;
    return topVal > 0 ? topVal : 1;
  }, [topRecruiters, selectedMetric]);

  const activeOption = METRIC_OPTIONS.find((m) => m.id === selectedMetric) || METRIC_OPTIONS[1];

  return (
    <div
      className={`border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      {/* Header & Metric Selector */}
      <div className="pb-4 border-b border-slate-500/10 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Trophy className="w-3.5 h-3.5" />
            </span>
            <div>
              <h3 className={`text-sm sm:text-base font-extrabold ${headingText}`}>
                Top Recruiters
              </h3>
              <p className={`text-[11px] ${subText}`}>Ranked by performance</p>
            </div>
          </div>

          {/* Compact Selector */}
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className={`text-xs font-bold py-1.5 pl-2.5 pr-7 rounded-xl border focus:outline-hidden cursor-pointer transition-colors ${
              darkMode
                ? "bg-[#0D1117] border-[#30363D] text-slate-200 focus:border-amber-500"
                : "bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500"
            }`}
          >
            {METRIC_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ranked List */}
      <div className="py-3 flex-1 flex flex-col justify-around divide-y divide-slate-500/10">
        {topRecruiters.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No recruiter records found.
          </div>
        ) : (
          topRecruiters.map((recruiter, idx) => {
            const rawVal = Number(recruiter[selectedMetric]) || 0;
            const barWidthPercent = Math.min(Math.max((rawVal / maxMetricVal) * 100, 4), 100);
            const rank = idx + 1;

            return (
              <div
                key={recruiter.id}
                onClick={() => onSelectRecruiter && onSelectRecruiter(recruiter)}
                className={`py-2.5 px-1.5 rounded-xl transition-all cursor-pointer group flex items-center gap-3 ${
                  darkMode ? "hover:bg-[#1C2128]" : "hover:bg-slate-50"
                }`}
              >
                {/* Rank Number */}
                <div
                  className={`w-6 h-6 rounded-lg text-xs font-mono font-extrabold flex items-center justify-center shrink-0 ${
                    rank === 1
                      ? "bg-amber-500 text-slate-950 shadow-2xs"
                      : rank === 2
                      ? "bg-slate-200 text-slate-800 dark:bg-[#30363D] dark:text-slate-200"
                      : rank === 3
                      ? "bg-amber-500/20 text-amber-500 dark:text-amber-400"
                      : darkMode
                      ? "bg-[#21262D] text-slate-400"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {rank}
                </div>

                {/* Avatar */}
                <img
                  src={recruiter.avatar}
                  alt={recruiter.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-500/20 shrink-0"
                />

                {/* Name & Comparative Progress Bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-xs font-bold truncate group-hover:text-amber-500 transition-colors ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {recruiter.name}
                    </span>
                    <span className="text-xs font-mono font-extrabold tabular-nums shrink-0 text-slate-800 dark:text-slate-200">
                      {rawVal.toLocaleString()}
                      {activeOption.unit}
                    </span>
                  </div>

                  {/* Horizontal comparison bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#21262D] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#D97706] transition-all duration-300"
                      style={{ width: `${barWidthPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5 truncate">
                    <span className="truncate">{recruiter.department}</span>
                    <span className="font-mono text-slate-400 shrink-0">
                      {recruiter.status}
                    </span>
                  </div>
                </div>

                {/* Hover indicator */}
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-500/10 flex items-center justify-between text-[11px] text-slate-400">
        <span>Evaluated across {recruiters.length} partners</span>
        <span className="font-mono text-amber-500 font-bold">Live Data</span>
      </div>
    </div>
  );
}
