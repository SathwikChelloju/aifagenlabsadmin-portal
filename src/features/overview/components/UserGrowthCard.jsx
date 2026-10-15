import React from "react";
import { Users2, ArrowRight, Sparkles, TrendingUp } from "lucide-react";

export default function UserGrowthCard({
  userGrowth = {},
  onNavigate,
  darkMode = false,
}) {
  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const itemBorder = darkMode ? "border-[#30363D]" : "border-slate-100";

  // 6-month trajectory data points for mini sparkline
  const growthTrend = [
    { month: "May", count: 3200 },
    { month: "Jun", count: 3580 },
    { month: "Jul", count: 3940 },
    { month: "Aug", count: 4260 },
    { month: "Sep", count: 4590 },
    { month: "Oct", count: 4820 },
  ];

  const minVal = 3000;
  const maxVal = 5000;
  const svgWidth = 260;
  const svgHeight = 44;

  const points = growthTrend.map((d, i) => {
    const x = (i / (growthTrend.length - 1)) * (svgWidth - 20) + 10;
    const y = svgHeight - 6 - ((d.count - minVal) / (maxVal - minVal)) * (svgHeight - 16);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div
      className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Users2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className={`text-base font-extrabold ${headingText}`}>
                User Growth & Tiers
              </h3>
              <p className={`text-[11px] ${subText}`}>
                Student cohort trajectory & membership
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate("users")}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                darkMode
                  ? "bg-[#0D1117] border-[#30363D] text-slate-300 hover:text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Candidates</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Mini Growth Trend Sparkline */}
        <div
          className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between ${
            darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50/80 border-slate-100"
          }`}
        >
          <div>
            <span className={`text-[9px] uppercase font-bold tracking-wider ${subText}`}>
              Active Cohort
            </span>
            <div className={`text-base font-black font-mono ${headingText}`}>
              {(userGrowth.total || 4820).toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +50.6% 6-mo
            </span>
          </div>

          {/* SVG Sparkline */}
          <div className="w-36 h-11">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              {growthTrend.map((d, i) => {
                const x = (i / (growthTrend.length - 1)) * (svgWidth - 20) + 10;
                const y = svgHeight - 6 - ((d.count - minVal) / (maxVal - minVal)) * (svgHeight - 16);
                return (
                  <circle
                    key={d.month}
                    cx={x}
                    cy={y}
                    r={i === growthTrend.length - 1 ? 3.5 : 2}
                    fill={i === growthTrend.length - 1 ? "#10B981" : "#FFFFFF"}
                    stroke="#10B981"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Stacked Proportional Bar */}
        <div className="mb-3">
          <div className="flex h-2 w-full rounded-full overflow-hidden gap-0.5 bg-slate-100 dark:bg-[#0D1117]">
            {(userGrowth.tiers || []).map((tier) => (
              <div
                key={tier.name}
                style={{ width: `${tier.pct}%`, backgroundColor: tier.color }}
                className="h-full first:rounded-l-full last:rounded-r-full"
                title={`${tier.name}: ${tier.count} (${tier.pct}%)`}
              />
            ))}
          </div>
        </div>

        {/* Tier rows */}
        <div className="space-y-1.5">
          {(userGrowth.tiers || []).map((tier) => (
            <div
              key={tier.name}
              className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50/70 border-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: tier.color }}
                />
                <span className={`font-semibold ${headingText}`}>{tier.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className={subText}>{tier.count.toLocaleString()}</span>
                <span className="font-bold" style={{ color: tier.color }}>
                  {tier.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between ${itemBorder} ${subText}`}>
        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
          <Sparkles className="w-3 h-3" />
          29.5% Paid Subscribers
        </span>
        <span className="font-mono text-[10px]">
          94% Cohort Retention
        </span>
      </div>
    </div>
  );
}
