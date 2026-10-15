import React, { useState, useMemo } from "react";
import { BarChart3 } from "lucide-react";

export default function PlatformPerformanceChart({
  timeSeries = [],
  periodLabel = "Last 30 Days",
  darkMode = false,
}) {
  const [selectedMetric, setSelectedMetric] = useState("combo"); // 'combo' | 'jobs' | 'candidates' | 'cost'
  const [cadence, setCadence] = useState("daily"); // 'daily' | 'weekly' | 'monthly'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const gridStroke = darkMode ? "#30363D" : "#F1F5F9";

  // SVG Chart Dimensions - compact & dense
  const svgWidth = 740;
  const svgHeight = 230;
  const padLeft = 38;
  const padRight = 42;
  const padTop = 20;
  const padBottom = 28;

  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  // Max volume for jobs / candidates
  const maxVolume = useMemo(() => {
    if (!timeSeries.length) return 100;
    let max = 0;
    timeSeries.forEach((d) => {
      max = Math.max(max, d.jobsFetched || 0, d.newCandidates || 0);
    });
    return Math.max(Math.ceil((max * 1.15) / 10) * 10, 50);
  }, [timeSeries]);

  // Max cost for AI spend line
  const maxCost = useMemo(() => {
    if (!timeSeries.length) return 50;
    let max = 0;
    timeSeries.forEach((d) => {
      max = Math.max(max, d.aiCost || 0);
    });
    return Math.max(Math.ceil((max * 1.2) / 10) * 10, 20);
  }, [timeSeries]);

  const numItems = timeSeries.length;
  const slotWidth = numItems > 0 ? chartWidth / numItems : chartWidth;

  const getVolumeY = (val) => {
    const safeVal = Math.max(val || 0, 0);
    return padTop + chartHeight - (safeVal / maxVolume) * chartHeight;
  };

  const getCostY = (cost) => {
    const safeVal = Math.max(cost || 0, 0);
    return padTop + chartHeight - (safeVal / maxCost) * chartHeight;
  };

  // Build cost line path
  const costLinePath = useMemo(() => {
    if (!timeSeries.length) return "";
    return timeSeries.reduce((acc, d, i) => {
      const cx = padLeft + i * slotWidth + slotWidth / 2;
      const cy = getCostY(d.aiCost);
      if (i === 0) return `M ${cx} ${cy}`;
      const prevX = padLeft + (i - 1) * slotWidth + slotWidth / 2;
      const prevY = getCostY(timeSeries[i - 1].aiCost);
      const cpX = (prevX + cx) / 2;
      return `${acc} C ${cpX} ${prevY}, ${cpX} ${cy}, ${cx} ${cy}`;
    }, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSeries, slotWidth, maxCost]);

  const activeItem = hoveredIndex !== null && timeSeries[hoveredIndex] ? timeSeries[hoveredIndex] : null;

  // Totals for the legend
  const totalJobs = timeSeries.reduce((acc, d) => acc + (d.jobsFetched || 0), 0);
  const totalCandidates = timeSeries.reduce((acc, d) => acc + (d.newCandidates || 0), 0);
  const totalCost = timeSeries.reduce((acc, d) => acc + (d.aiCost || 0), 0);

  return (
    <div className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}>
      {/* 1. Header & Controls */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                <BarChart3 className="w-3 h-3" />
                Platform Analytics
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {periodLabel}
              </span>
            </div>

            <h3 className={`text-base font-extrabold truncate ${headingText}`}>
              Platform Performance & Pipeline Velocity
            </h3>
            <p className={`text-xs ${subText} truncate`}>
              Track job discovery volume, candidate onboarding, and AI compute burn across time buckets.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Metric Mode Select */}
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-xl border focus:outline-hidden cursor-pointer ${
                darkMode
                  ? "bg-[#0D1117] border-[#30363D] text-slate-200"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <option value="combo">Combo View (All Metrics)</option>
              <option value="jobs">Jobs Volume Only</option>
              <option value="candidates">Candidates Only</option>
              <option value="cost">AI Cost Only</option>
            </select>

            {/* Segmented Cadence Controls */}
            <div
              className={`flex items-center p-0.5 rounded-xl border text-[11px] font-bold ${
                darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-100 border-slate-200"
              }`}
            >
              {["daily", "weekly", "monthly"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCadence(c)}
                  className={`px-2.5 py-0.5 rounded-lg capitalize transition-all cursor-pointer ${
                    cadence === c
                      ? darkMode
                        ? "bg-[#161B22] text-amber-400 shadow-2xs font-extrabold"
                        : "bg-white text-slate-900 shadow-2xs font-extrabold"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Legend Row */}
        <div className="flex flex-wrap items-center justify-between text-[11px] py-1.5 mb-2 border-b border-slate-100 dark:border-[#30363D]">
          <div className="flex items-center gap-4">
            {(selectedMetric === "combo" || selectedMetric === "jobs") && (
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 shrink-0" />
                <span className={subText}>Jobs:</span>
                <strong className={`font-mono ${headingText}`}>{totalJobs.toLocaleString()}</strong>
              </span>
            )}
            {(selectedMetric === "combo" || selectedMetric === "candidates") && (
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 shrink-0" />
                <span className={subText}>Candidates:</span>
                <strong className={`font-mono ${headingText}`}>{totalCandidates.toLocaleString()}</strong>
              </span>
            )}
            {(selectedMetric === "combo" || selectedMetric === "cost") && (
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className={subText}>AI Spend:</span>
                <strong className="font-mono text-amber-600 dark:text-amber-400">${totalCost.toFixed(2)}</strong>
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 hidden md:inline">
            Hover points for granular period breakdown
          </span>
        </div>

        {/* 3. SVG Chart Canvas */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
            style={{ maxHeight: "230px" }}
          >
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const y = padTop + chartHeight * (1 - pct);
              const labelVal = Math.round(maxVolume * pct);
              const costVal = Math.round(maxCost * pct);
              return (
                <g key={pct}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={padLeft + chartWidth}
                    y2={y}
                    stroke={gridStroke}
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  {/* Left Axis: Volume */}
                  <text
                    x={padLeft - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] font-mono fill-slate-400"
                  >
                    {labelVal}
                  </text>
                  {/* Right Axis: AI Cost */}
                  <text
                    x={padLeft + chartWidth + 6}
                    y={y + 3}
                    textAnchor="start"
                    className="text-[9px] font-mono fill-amber-500"
                  >
                    ${costVal}
                  </text>
                </g>
              );
            })}

            {/* Bars for Jobs and Candidates */}
            {timeSeries.map((d, i) => {
              const groupX = padLeft + i * slotWidth;
              const barWidth = Math.max(Math.min((slotWidth - 8) / 2, 12), 4);
              const isHovered = hoveredIndex === i;

              const jobsY = getVolumeY(d.jobsFetched);
              const jobsHeight = padTop + chartHeight - jobsY;

              const candsY = getVolumeY(d.newCandidates);
              const candsHeight = padTop + chartHeight - candsY;

              const showJobs = selectedMetric === "combo" || selectedMetric === "jobs";
              const showCandidates = selectedMetric === "combo" || selectedMetric === "candidates";

              return (
                <g
                  key={d.date + i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Subtle column hover background */}
                  {isHovered && (
                    <rect
                      x={groupX + 1}
                      y={padTop}
                      width={slotWidth - 2}
                      height={chartHeight}
                      fill={darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"}
                      rx="4"
                    />
                  )}

                  {/* Jobs Bar (Blue) */}
                  {showJobs && (
                    <rect
                      x={showCandidates ? groupX + slotWidth / 2 - barWidth - 1 : groupX + slotWidth / 2 - barWidth / 2}
                      y={jobsY}
                      width={barWidth}
                      height={Math.max(jobsHeight, 1)}
                      rx="2"
                      fill="#3B82F6"
                      opacity={isHovered ? 1 : 0.85}
                    />
                  )}

                  {/* Candidates Bar (Emerald) */}
                  {showCandidates && (
                    <rect
                      x={showJobs ? groupX + slotWidth / 2 + 1 : groupX + slotWidth / 2 - barWidth / 2}
                      y={candsY}
                      width={barWidth}
                      height={Math.max(candsHeight, 1)}
                      rx="2"
                      fill="#10B981"
                      opacity={isHovered ? 1 : 0.85}
                    />
                  )}

                  {/* X Axis Date Label */}
                  <text
                    x={groupX + slotWidth / 2}
                    y={padTop + chartHeight + 16}
                    textAnchor="middle"
                    className={`text-[9px] font-mono transition-colors ${
                      isHovered ? "fill-amber-500 font-bold" : "fill-slate-400"
                    }`}
                  >
                    {d.date}
                  </text>
                </g>
              );
            })}

            {/* AI Cost Curve & Marker Dots */}
            {(selectedMetric === "combo" || selectedMetric === "cost") && (
              <>
                <path
                  d={costLinePath}
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {timeSeries.map((d, i) => {
                  const cx = padLeft + i * slotWidth + slotWidth / 2;
                  const cy = getCostY(d.aiCost);
                  const isHovered = hoveredIndex === i;

                  return (
                    <g key={"point-" + i} pointerEvents="none">
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 5 : 3.5}
                        fill={isHovered ? "#D97706" : "#FFFFFF"}
                        stroke="#D97706"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </>
            )}
          </svg>

          {/* Interactive Tooltip Card */}
          {activeItem && (
            <div
              className={`absolute top-2 left-1/2 -translate-x-1/2 border px-3 py-1.5 rounded-xl shadow-md pointer-events-none flex items-center gap-3 text-xs z-20 backdrop-blur-md ${
                darkMode ? "bg-[#161B22]/95 border-[#30363D] text-white" : "bg-white/95 border-slate-200 text-slate-800"
              }`}
            >
              <span className="font-mono font-bold text-slate-400">{activeItem.date}</span>
              <span className="text-blue-500 font-bold font-mono">
                {activeItem.jobsFetched} Jobs
              </span>
              <span className="text-emerald-500 font-bold font-mono">
                {activeItem.newCandidates} Candidates
              </span>
              <span className="text-amber-500 font-bold font-mono">
                ${activeItem.aiCost} Cost
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Footer */}
      <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-[#30363D] flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          ↑ 14.2% Growth velocity vs previous period
        </span>
        <span className="font-mono text-[10px]">
          Target Benchmark: 85.0%
        </span>
      </div>
    </div>
  );
}
