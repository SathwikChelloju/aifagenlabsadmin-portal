import React, { useState } from "react";
import { Filter } from "lucide-react";

export default function AiUsageActorDonut({
  actorMetrics,
  selectedActorFilter,
  onSelectActorFilter,
  darkMode = false,
}) {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  const {
    totalRequests = 0,
    segments = [],
    avgCostPerReq = "$0.00",
    avgTokensPerReq = "0",
    avgLatency = "0ms",
  } = actorMetrics || {};

  const outerRadius = 78;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerRadius = 56;
  const innerCircumference = 2 * Math.PI * innerRadius;

  // Offsets for stroke-dasharray
  const segmentsWithOffsets = segments.map((seg, i, arr) => {
    const outerOffset = arr
      .slice(0, i)
      .reduce((sum, s) => sum + (s.pct / 100) * outerCircumference, 0);
    const innerOffset = arr
      .slice(0, i)
      .reduce((sum, s) => sum + (s.pct / 100) * innerCircumference, 0);
    return { ...seg, outerOffset, innerOffset };
  });

  return (
    <div
      className={`border rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      {/* Header */}
      <div className="pb-3 border-b border-slate-500/10 flex items-start justify-between gap-3">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-extrabold uppercase tracking-wider mb-1 border border-emerald-500/20">
            Consumer Split
          </div>
          <h3 className={`text-base font-extrabold ${headingText}`}>
            Usage by Actor Type
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            Invocation volume and telemetry distributed by role
          </p>
        </div>

        {selectedActorFilter !== "all" && (
          <button
            onClick={() => onSelectActorFilter("all")}
            className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            title="Reset role filter"
          >
            <Filter className="w-3 h-3" />
            <span>Reset ({selectedActorFilter})</span>
          </button>
        )}
      </div>

      {/* Donut & Legend Content */}
      <div className="my-5 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background track */}
            <circle
              cx="100"
              cy="100"
              r={outerRadius}
              fill="none"
              stroke={darkMode ? "#21262D" : "#F1F5F9"}
              strokeWidth="16"
            />
            <circle
              cx="100"
              cy="100"
              r={innerRadius}
              fill="none"
              stroke={darkMode ? "#21262D" : "#F1F5F9"}
              strokeWidth="8"
            />

            {/* Outer Segment Rings */}
            {segmentsWithOffsets.map((seg) => {
              const strokeDasharray = `${(seg.pct / 100) * outerCircumference} ${outerCircumference}`;
              const strokeDashoffset = -seg.outerOffset;
              const isHovered = hoveredSegment?.id === seg.id;
              const isSelected = selectedActorFilter === seg.id;

              return (
                <circle
                  key={`outer-${seg.id}`}
                  cx="100"
                  cy="100"
                  r={outerRadius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered || isSelected ? "20" : "16"}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredSegment(seg)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  onClick={() =>
                    onSelectActorFilter(
                      selectedActorFilter === seg.id ? "all" : seg.id
                    )
                  }
                />
              );
            })}

            {/* Inner Decorative Rings */}
            {segmentsWithOffsets.map((seg) => {
              const strokeDasharray = `${(seg.pct / 100) * innerCircumference} ${innerCircumference}`;
              const strokeDashoffset = -seg.innerOffset;

              return (
                <circle
                  key={`inner-${seg.id}`}
                  cx="100"
                  cy="100"
                  r={innerRadius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeOpacity="0.35"
                  strokeWidth="7"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200"
                />
              );
            })}
          </svg>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
            {hoveredSegment ? (
              <div className="animate-in fade-in zoom-in-95 duration-150">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  {hoveredSegment.id}
                </span>
                <span
                  className={`text-xl font-extrabold font-mono tracking-tight block ${headingText}`}
                >
                  {hoveredSegment.pct}%
                </span>
                <span className="text-[10px] font-bold text-amber-500 font-mono block">
                  {hoveredSegment.count.toLocaleString()} calls
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  TOTAL CALLS
                </span>
                <span
                  className={`text-2xl font-extrabold font-mono tracking-tight block ${headingText}`}
                >
                  {totalRequests.toLocaleString()}
                </span>
                <span className={`text-[10px] ${subText} font-medium block`}>
                  100% Volume
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Legend & Filter Click Cards */}
        <div className="flex-1 space-y-2 w-full">
          {segments.map((seg) => {
            const isHovered = hoveredSegment?.id === seg.id;
            const isSelected = selectedActorFilter === seg.id;

            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredSegment(seg)}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={() =>
                  onSelectActorFilter(
                    selectedActorFilter === seg.id ? "all" : seg.id
                  )
                }
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/40 shadow-xs"
                    : isHovered
                    ? "bg-slate-500/10 border-slate-300 dark:border-slate-600 shadow-xs translate-x-1"
                    : "border-slate-500/10 hover:bg-slate-500/5"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className={`font-semibold ${headingText}`}>
                      {seg.label}
                    </span>
                  </div>
                  <span className={`font-mono font-bold ${headingText}`}>
                    {seg.pct}%
                  </span>
                </div>

                <div
                  className={`mt-1 flex items-center justify-between text-[11px] font-mono ${subText}`}
                >
                  <span>Volume:</span>
                  <span
                    className={`font-semibold ${
                      darkMode ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {seg.count.toLocaleString()} calls
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sub-Metrics Footer: Avg Cost, Avg Tokens, Avg Latency */}
      <div className="pt-3 border-t border-slate-500/10 grid grid-cols-3 gap-2">
        <div
          className={`p-2 rounded-2xl border text-center transition-colors ${
            darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
            Avg Cost / Req
          </span>
          <span
            className={`text-xs sm:text-sm font-extrabold font-mono ${headingText} mt-0.5 block`}
          >
            {avgCostPerReq}
          </span>
        </div>

        <div
          className={`p-2 rounded-2xl border text-center transition-colors ${
            darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
            Avg Tokens / Req
          </span>
          <span
            className={`text-xs sm:text-sm font-extrabold font-mono ${headingText} mt-0.5 block`}
          >
            {avgTokensPerReq}
          </span>
        </div>

        <div
          className={`p-2 rounded-2xl border text-center transition-colors ${
            darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
            Avg Latency
          </span>
          <span
            className={`text-xs sm:text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block`}
          >
            {avgLatency}
          </span>
        </div>
      </div>
    </div>
  );
}
