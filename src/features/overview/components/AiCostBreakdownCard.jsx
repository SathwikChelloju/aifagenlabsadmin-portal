import React from "react";
import { Cpu, ArrowRight, Zap } from "lucide-react";

export default function AiCostBreakdownCard({
  aiActors = [],
  kpiAiCost,
  periodLabel = "Last 30 Days",
  onNavigate,
  darkMode = false,
}) {
  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const itemBorder = darkMode ? "border-[#30363D]" : "border-slate-100";

  const totalCost = kpiAiCost?.value || 842.15;
  const totalTokens = kpiAiCost?.tokens || 4820000;

  // Segment colors
  const segmentColors = {
    "Candidate Self-Service": { hex: "#D97706", text: "text-amber-500" },
    "Internal Recruiters": { hex: "#3B82F6", text: "text-blue-500" },
    "System Automations": { hex: "#10B981", text: "text-emerald-500" },
  };

  // Compute SVG Donut paths purely
  const radius = 38;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  const segmentsWithOffsets = React.useMemo(() => {
    return aiActors.map((actor, idx) => {
      const pct = (actor.pct || 0) / 100;
      const offset = aiActors.slice(0, idx).reduce((sum, a) => sum + (a.pct || 0) / 100, 0);
      return {
        ...actor,
        pctDecimal: pct,
        offset,
      };
    });
  }, [aiActors]);

  return (
    <div
      className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" />
            </span>
            <div>
              <h3 className={`text-base font-extrabold ${headingText}`}>
                AI Cost Allocation
              </h3>
              <p className={`text-[11px] ${subText}`}>
                Compute spend across subsystems ({periodLabel})
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate("ai-usage")}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                darkMode
                  ? "bg-[#0D1117] border-[#30363D] text-slate-300 hover:text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>AI Usage</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Donut chart + Summary */}
        <div
          className={`p-2.5 rounded-xl border mb-3 flex items-center justify-around ${
            darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50/80 border-slate-100"
          }`}
        >
          {/* SVG Donut */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={darkMode ? "#30363D" : "#E2E8F0"}
                strokeWidth={strokeWidth}
              />
              {/* Segment rings */}
              {segmentsWithOffsets.map((actor) => {
                const strokeDasharray = `${actor.pctDecimal * circumference} ${circumference}`;
                const strokeDashoffset = -actor.offset * circumference;
                const color = segmentColors[actor.actor]?.hex || "#64748B";

                return (
                  <circle
                    key={actor.actor}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-xs font-black font-mono leading-none ${headingText}`}>
                ${Math.round(totalCost)}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Total
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="space-y-1">
            <div>
              <span className={`text-[9px] uppercase font-bold tracking-wider ${subText}`}>
                Total Compute
              </span>
              <div className={`text-sm font-black font-mono ${headingText}`}>
                ${totalCost.toFixed(2)}
              </div>
            </div>
            <div>
              <span className={`text-[9px] uppercase font-bold tracking-wider ${subText}`}>
                Tokens Ingested
              </span>
              <div className="text-xs font-bold font-mono text-blue-500">
                {(totalTokens / 1_000_000).toFixed(2)}M Tokens
              </div>
            </div>
          </div>
        </div>

        {/* Actor Breakdown Rows */}
        <div className="space-y-1.5">
          {aiActors.map((actor) => {
            const conf = segmentColors[actor.actor] || { hex: "#64748B", text: "text-slate-500" };
            return (
              <div
                key={actor.actor}
                className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                  darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50/70 border-slate-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: conf.hex }}
                  />
                  <span className={`font-semibold ${headingText}`}>{actor.actor}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className={subText}>${actor.cost.toFixed(2)}</span>
                  <span className={`font-bold ${conf.text}`}>{actor.pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between ${itemBorder} ${subText}`}>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
          <Zap className="w-3 h-3" />
          Cache Hit Ratio: 78.4%
        </span>
        <span className="font-mono text-[10px]">
          Gemini 1.5 & Claude 3.5
        </span>
      </div>
    </div>
  );
}
