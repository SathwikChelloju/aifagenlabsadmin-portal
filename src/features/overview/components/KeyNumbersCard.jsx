import React from "react";
import { Gauge, Zap, Target, Clock, DollarSign, Activity } from "lucide-react";

export default function KeyNumbersCard({ keyNumbers = {}, darkMode = false }) {
  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const itemBg = darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50/80 border-slate-100";
  const itemBorder = darkMode ? "border-[#30363D]" : "border-slate-100";

  const metrics = [
    {
      label: "Ingestion Latency",
      value: keyNumbers.avgIngestionLatency || "1.2s",
      sub: "API round-trip",
      icon: Zap,
      color: "text-blue-500",
    },
    {
      label: "Placement Rate",
      value: `${keyNumbers.avgPlacementRate || 41}%`,
      sub: "Talent conversion",
      icon: Target,
      color: "text-emerald-500",
    },
    {
      label: "Avg Time-to-Hire",
      value: `${keyNumbers.avgTimeToHireDays || 21.4}d`,
      sub: "Interview to offer",
      icon: Clock,
      color: "text-amber-500",
    },
    {
      label: "AI Spend / Placement",
      value: keyNumbers.aiCostPerPlacement || "$14.56",
      sub: "Estimated compute",
      icon: DollarSign,
      color: "text-indigo-500",
    },
  ];

  return (
    <div
      className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Gauge className="w-4 h-4" />
          </span>
          <div>
            <h3 className={`text-base font-extrabold ${headingText}`}>
              Key Numbers
            </h3>
            <p className={`text-[11px] ${subText}`}>Operational baseline benchmarks</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className={`p-3 rounded-xl border flex flex-col justify-between ${itemBg}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${subText}`}>
                    {m.label}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                </div>
                <div>
                  <div className={`text-lg font-black font-mono ${headingText}`}>
                    {m.value}
                  </div>
                  <span className={`text-[10px] ${subText}`}>
                    {m.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between ${itemBorder} ${subText}`}>
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-emerald-500" />
          SLA Standards Met
        </span>
        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
          99.8% System Health
        </span>
      </div>
    </div>
  );
}
