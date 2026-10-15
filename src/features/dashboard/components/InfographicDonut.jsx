import React, { useState } from "react";
import { PieChart as PieIcon, ShieldCheck } from "lucide-react";

export default function InfographicDonut({ datasets, darkMode }) {
  const [dimension, setDimension] = useState("REVENUE");
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  const activeDataset = datasets[dimension] || datasets.REVENUE;
  const outerRadius = 80;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerRadius = 58;
  const innerCircumference = 2 * Math.PI * innerRadius;

  const segmentsWithOffsets = activeDataset.segments.map((seg, i, arr) => {
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
      className={`border rounded-3xl p-7 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-500/10">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider mb-1 border border-emerald-200/60">
            Market Breakdown
          </div>
          <h3
            className={`text-base font-extrabold flex items-center gap-2 ${headingText}`}
          >
            <PieIcon className="w-4 h-4 text-[#D97706]" />
            {activeDataset.title}
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            {activeDataset.description}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-full bg-slate-500/10">
          {Object.keys(datasets).map((k) => (
            <button
              key={k}
              onClick={() => {
                setDimension(k);
                setHoveredSegment(null);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                dimension === k
                  ? "bg-[#0B192C] text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {k === "AI_QUOTAS"
                ? "AI Cost"
                : k.charAt(0) + k.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="my-5 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={outerRadius}
              fill="none"
              stroke={darkMode ? "#21262D" : "#F1F5F9"}
              strokeWidth="15"
            />
            <circle
              cx="100"
              cy="100"
              r={innerRadius}
              fill="none"
              stroke={darkMode ? "#21262D" : "#F1F5F9"}
              strokeWidth="8"
            />

            {segmentsWithOffsets.map((seg) => {
              const strokeDasharray = `${(seg.pct / 100) * outerCircumference} ${outerCircumference}`;
              const strokeDashoffset = -seg.outerOffset;
              const isHovered = hoveredSegment?.id === seg.id;

              return (
                <circle
                  key={`outer-${seg.id}`}
                  cx="100"
                  cy="100"
                  r={outerRadius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? "18" : "15"}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredSegment(seg)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              );
            })}

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
                  strokeOpacity="0.4"
                  strokeWidth="7"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200"
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-3">
            {hoveredSegment ? (
              <div className="animate-in fade-in zoom-in-95 duration-150">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  {hoveredSegment.label.split(" ")[0]}
                </span>
                <span
                  className={`text-xl font-bold font-mono tracking-tight block leading-tight ${headingText}`}
                >
                  {hoveredSegment.pct}%
                </span>
                <span className="text-[11px] font-semibold text-[#D97706] font-mono block">
                  {hoveredSegment.formatted}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  {activeDataset.centerLabel}
                </span>
                <span
                  className={`text-2xl font-bold font-mono tracking-tight block ${headingText}`}
                >
                  {activeDataset.centerValue}
                </span>
                <span className={`text-[10px] ${subText} font-medium block`}>
                  {activeDataset.centerSub}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-2 w-full">
          {segmentsWithOffsets.map((seg) => {
            const isHovered = hoveredSegment?.id === seg.id;
            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredSegment(seg)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isHovered
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
                    className={darkMode ? "text-slate-300" : "text-slate-700"}
                  >
                    {seg.formatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
          darkMode
            ? "bg-[#0D1117] border-[#30363D]"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <span className="flex items-center gap-1.5 font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>
            Active breakdown:{" "}
            <strong className="text-amber-600 font-mono">{dimension}</strong>
          </span>
        </span>
        <span className={`text-[11px] font-mono ${subText}`}>
          Live 2026 Sync
        </span>
      </div>
    </div>
  );
}
