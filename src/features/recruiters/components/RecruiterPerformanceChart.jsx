import React, { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { RECRUITER_PERFORMANCE_DATA } from "../data/mockRecruiters";

/**
 * Metric Configuration
 */
const METRIC_CONFIG = {
  combo: {
    id: "combo",
    label: "All Metrics (Combo View)",
    shortLabel: "Combo",
    icon: Layers,
  },
  candidates: {
    id: "candidates",
    label: "Candidates Assigned",
    shortLabel: "Candidates",
    color: "#3B82F6",
    colorClass: "bg-blue-500",
    textClass: "text-blue-500",
    icon: Users,
    unit: "",
  },
  interviews: {
    id: "interviews",
    label: "Interviews Conducted",
    shortLabel: "Interviews",
    color: "#10B981",
    colorClass: "bg-emerald-500",
    textClass: "text-emerald-500",
    icon: Calendar,
    unit: "",
  },
  placements: {
    id: "placements",
    label: "Successful Placements",
    shortLabel: "Placements",
    color: "#D97706",
    colorClass: "bg-amber-600",
    textClass: "text-amber-600",
    icon: CheckCircle2,
    unit: "",
  },
  rate: {
    id: "rate",
    label: "Placement Rate (%)",
    shortLabel: "Rate",
    color: "#F59E0B",
    colorClass: "bg-amber-500",
    textClass: "text-amber-500",
    icon: TrendingUp,
    unit: "%",
  },
};

export default function RecruiterPerformanceChart({ darkMode = false }) {
  const [timeframe, setTimeframe] = useState("daily"); // 'daily' | 'weekly' | 'monthly'
  const [selectedMetric, setSelectedMetric] = useState("combo"); // 'combo' | 'candidates' | 'interviews' | 'placements' | 'rate'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const rawData = useMemo(
    () => RECRUITER_PERFORMANCE_DATA[timeframe] || [],
    [timeframe]
  );

  // Theme tokens
  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const gridStroke = darkMode ? "#30363D" : "#E2E8F0";

  // SVG Chart Dimensions
  const svgWidth = 740;
  const svgHeight = 260;
  const padLeft = 45;
  const padRight = 50; // for secondary rate axis
  const padTop = 30;
  const padBottom = 35;

  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  // Compute Max Y for volume metrics
  const maxVolume = useMemo(() => {
    if (!rawData.length) return 100;
    let max = 0;
    rawData.forEach((d) => {
      if (selectedMetric === "combo") {
        max = Math.max(max, d.candidatesAssigned, d.interviewsConducted, d.successfulPlacements);
      } else if (selectedMetric === "candidates") {
        max = Math.max(max, d.candidatesAssigned);
      } else if (selectedMetric === "interviews") {
        max = Math.max(max, d.interviewsConducted);
      } else if (selectedMetric === "placements") {
        max = Math.max(max, d.successfulPlacements);
      } else if (selectedMetric === "rate") {
        max = 100;
      }
    });
    return Math.max(max * 1.15, 10);
  }, [rawData, selectedMetric]);

  // Coordinate calculations
  const numItems = rawData.length;
  const slotWidth = numItems > 0 ? chartWidth / numItems : chartWidth;

  // Rate Y-coordinate calculator (0% to 100%)
  const calcRateY = (rate) => {
    const clamped = Math.min(Math.max(rate || 0, 0), 100);
    return padTop + chartHeight - (clamped / 100) * chartHeight;
  };

  // Volume Y-coordinate calculator
  const getVolumeY = (val) => {
    const safeVal = Math.max(val || 0, 0);
    return padTop + chartHeight - (safeVal / maxVolume) * chartHeight;
  };

  // Build rate line path
  const rateLinePath = useMemo(() => {
    if (!rawData.length) return "";
    return rawData.reduce((acc, d, i) => {
      const cx = padLeft + i * slotWidth + slotWidth / 2;
      const cy = padTop + chartHeight - (Math.min(Math.max(d.placementRate || 0, 0), 100) / 100) * chartHeight;
      if (i === 0) return `M ${cx} ${cy}`;
      const prevX = padLeft + (i - 1) * slotWidth + slotWidth / 2;
      const prevRate = rawData[i - 1].placementRate || 0;
      const prevY = padTop + chartHeight - (Math.min(Math.max(prevRate, 0), 100) / 100) * chartHeight;
      const cpX = (prevX + cx) / 2;
      return `${acc} C ${cpX} ${prevY}, ${cpX} ${cy}, ${cx} ${cy}`;
    }, "");
  }, [rawData, slotWidth, padLeft, padTop, chartHeight]);

  // Summary statistics for current timeframe
  const summary = useMemo(() => {
    if (!rawData.length) return { assigned: 0, interviews: 0, placements: 0, avgRate: 0 };
    const assigned = rawData.reduce((acc, d) => acc + d.candidatesAssigned, 0);
    const interviews = rawData.reduce((acc, d) => acc + d.interviewsConducted, 0);
    const placements = rawData.reduce((acc, d) => acc + d.successfulPlacements, 0);
    const avgRate = interviews > 0 ? Math.round((placements / interviews) * 100) : 0;
    return { assigned, interviews, placements, avgRate };
  }, [rawData]);

  const activeItem = hoveredIndex !== null && rawData[hoveredIndex] ? rawData[hoveredIndex] : null;

  return (
    <div
      className={`border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors ${cardBg}`}
    >
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-slate-500/10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-extrabold uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5" />
              Recruiter Analytics
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {timeframe === "daily" ? "Last 14 Days" : timeframe === "weekly" ? "Last 8 Weeks" : "Last 6 Months"}
            </span>
          </div>

          <h3 className={`text-base sm:text-lg font-extrabold truncate ${headingText}`}>
            Talent Pipeline & Placement Velocity
          </h3>
          <p className={`text-xs ${subText} mt-0.5 truncate`}>
            Track interview volume, placement completions, and conversion ratios across time buckets.
          </p>
        </div>

        {/* Controls Container: Timeframe Buttons & Metric Selector beside each other */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-nowrap">
          {/* Timeframe Grouping (Daily / Weekly / Monthly) */}
          <div
            className={`p-1 rounded-xl border flex items-center text-xs font-bold shrink-0 ${
              darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-slate-100 border-slate-200/80"
            }`}
          >
            {["daily", "weekly", "monthly"].map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  setTimeframe(tf);
                  setHoveredIndex(null);
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  timeframe === tf
                    ? darkMode
                      ? "bg-amber-500 text-slate-950 font-extrabold shadow-xs"
                      : "bg-white text-slate-900 font-extrabold shadow-xs"
                    : darkMode
                    ? "text-slate-400 hover:text-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Metric Selector Dropdown / Combo View (All Metrics) */}
          <div className="relative shrink-0">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className={`text-xs font-bold py-1.5 pl-3 pr-8 rounded-xl border focus:outline-hidden cursor-pointer transition-colors ${
                darkMode
                  ? "bg-[#161B22] border-[#30363D] text-slate-200 focus:border-amber-500"
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500"
              }`}
            >
              <option value="combo">Combo View (All Metrics)</option>
              <option value="candidates">Candidates Assigned</option>
              <option value="interviews">Interviews Conducted</option>
              <option value="placements">Successful Placements</option>
              <option value="rate">Placement Rate (%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Legend & Context KPI Strip */}
      <div className="pt-3 pb-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Dynamic Legend */}
        <div className="flex flex-wrap items-center gap-4">
          {(selectedMetric === "combo" || selectedMetric === "candidates") && (
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" />
              <span className={subText}>Assigned:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                {summary.assigned.toLocaleString()}
              </span>
            </div>
          )}

          {(selectedMetric === "combo" || selectedMetric === "interviews") && (
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
              <span className={subText}>Interviews:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                {summary.interviews.toLocaleString()}
              </span>
            </div>
          )}

          {(selectedMetric === "combo" || selectedMetric === "placements") && (
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#D97706]" />
              <span className={subText}>Placements:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                {summary.placements.toLocaleString()}
              </span>
            </div>
          )}

          {(selectedMetric === "combo" || selectedMetric === "rate") && (
            <div className="flex items-center gap-1.5 font-medium">
              <div className="w-3.5 h-1 rounded-full bg-[#F59E0B]" />
              <span className={subText}>Placement Rate:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {summary.avgRate}% avg
              </span>
            </div>
          )}
        </div>

        <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
          Hover points for granular period breakdown
        </div>
      </div>

      {/* 3. Main Combination Chart SVG Area */}
      <div className="relative w-full my-3">
        {rawData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-xs text-slate-400">
            No telemetry records found for this period.
          </div>
        ) : (
          <div className="w-full relative overflow-visible">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-64 sm:h-72 overflow-visible select-none"
            >
              {/* Grid Lines (5 horizontal ticks) */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                const y = padTop + chartHeight * pct;
                const volumeVal = Math.round(maxVolume * (1 - pct));
                const rateVal = Math.round(100 * (1 - pct));

                return (
                  <g key={pct}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={svgWidth - padRight}
                      y2={y}
                      stroke={gridStroke}
                      strokeDasharray="4 4"
                      strokeWidth={1}
                    />

                    {/* Left Axis: Volume */}
                    <text
                      x={padLeft - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[10px] font-mono fill-slate-400 select-none"
                    >
                      {volumeVal}
                    </text>

                    {/* Right Axis: Percentage (for combo or rate view) */}
                    {(selectedMetric === "combo" || selectedMetric === "rate") && (
                      <text
                        x={svgWidth - padRight + 8}
                        y={y + 3}
                        textAnchor="start"
                        className="text-[10px] font-mono fill-amber-500/80 font-bold select-none"
                      >
                        {rateVal}%
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Bar Groups Rendering */}
              {rawData.map((d, i) => {
                const slotX = padLeft + i * slotWidth;
                const isHovered = hoveredIndex === i;

                // Determine bar widths & offsets based on selectedMetric
                let barMarkup = null;

                if (selectedMetric === "combo") {
                  // 3 grouped bars per slot
                  const groupWidth = Math.min(slotWidth * 0.72, 36);
                  const individualBarWidth = Math.max((groupWidth - 4) / 3, 4);
                  const groupStartX = slotX + (slotWidth - groupWidth) / 2;

                  const y1 = getVolumeY(d.candidatesAssigned);
                  const h1 = padTop + chartHeight - y1;

                  const y2 = getVolumeY(d.interviewsConducted);
                  const h2 = padTop + chartHeight - y2;

                  const y3 = getVolumeY(d.successfulPlacements);
                  const h3 = padTop + chartHeight - y3;

                  barMarkup = (
                    <g key={`bar-group-${i}`}>
                      {/* Bar 1: Candidates Assigned (Blue) */}
                      <rect
                        x={groupStartX}
                        y={y1}
                        width={individualBarWidth}
                        height={Math.max(h1, 0)}
                        rx={2.5}
                        fill="#3B82F6"
                        opacity={isHovered ? 1 : 0.82}
                        className="transition-all duration-150"
                      />

                      {/* Bar 2: Interviews Conducted (Emerald) */}
                      <rect
                        x={groupStartX + individualBarWidth + 2}
                        y={y2}
                        width={individualBarWidth}
                        height={Math.max(h2, 0)}
                        rx={2.5}
                        fill="#10B981"
                        opacity={isHovered ? 1 : 0.82}
                        className="transition-all duration-150"
                      />

                      {/* Bar 3: Placements (Amber/Orange) */}
                      <rect
                        x={groupStartX + (individualBarWidth + 2) * 2}
                        y={y3}
                        width={individualBarWidth}
                        height={Math.max(h3, 0)}
                        rx={2.5}
                        fill="#D97706"
                        opacity={isHovered ? 1 : 0.9}
                        className="transition-all duration-150"
                      />
                    </g>
                  );
                } else if (selectedMetric !== "rate") {
                  // Single metric bar mode
                  const barW = Math.min(slotWidth * 0.55, 28);
                  const barX = slotX + (slotWidth - barW) / 2;
                  const val =
                    selectedMetric === "candidates"
                      ? d.candidatesAssigned
                      : selectedMetric === "interviews"
                      ? d.interviewsConducted
                      : d.successfulPlacements;

                  const barColor = METRIC_CONFIG[selectedMetric]?.color || "#D97706";
                  const y = getVolumeY(val);
                  const h = padTop + chartHeight - y;

                  barMarkup = (
                    <rect
                      key={`single-bar-${i}`}
                      x={barX}
                      y={y}
                      width={barW}
                      height={Math.max(h, 0)}
                      rx={3}
                      fill={barColor}
                      opacity={isHovered ? 1 : 0.85}
                      className="transition-all duration-150"
                    />
                  );
                }

                return (
                  <g key={`slot-${i}`}>
                    {/* Hover column background highlight */}
                    {isHovered && (
                      <rect
                        x={slotX + 2}
                        y={padTop}
                        width={slotWidth - 4}
                        height={chartHeight}
                        rx={6}
                        fill={darkMode ? "#30363D" : "#F1F5F9"}
                        opacity={0.45}
                      />
                    )}

                    {/* Bars */}
                    {barMarkup}

                    {/* X-axis Tick Label */}
                    <text
                      x={slotX + slotWidth / 2}
                      y={svgHeight - 10}
                      textAnchor="middle"
                      className={`text-[10px] font-mono transition-colors ${
                        isHovered ? "font-bold fill-amber-500" : "fill-slate-400"
                      }`}
                    >
                      {d.period}
                    </text>

                    {/* Interactive hover trigger area */}
                    <rect
                      x={slotX}
                      y={padTop}
                      width={slotWidth}
                      height={chartHeight + padBottom}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  </g>
                );
              })}

              {/* Placement Rate Line & Dots (Rendered over bars in combo or rate view) */}
              {(selectedMetric === "combo" || selectedMetric === "rate") && (
                <g>
                  {/* Glowing line shadow */}
                  <path
                    d={rateLinePath}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="pointer-events-none drop-shadow-xs"
                  />

                  {/* Circular Nodes */}
                  {rawData.map((d, i) => {
                    const cx = padLeft + i * slotWidth + slotWidth / 2;
                    const cy = calcRateY(d.placementRate);
                    const isHovered = hoveredIndex === i;

                    return (
                      <g key={`rate-dot-${i}`} className="pointer-events-none">
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 5.5 : 3.5}
                          fill={isHovered ? "#F59E0B" : darkMode ? "#161B22" : "#FFFFFF"}
                          stroke="#F59E0B"
                          strokeWidth={2.5}
                          className="transition-all duration-150"
                        />
                        {isHovered && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={9}
                            fill="#F59E0B"
                            opacity={0.2}
                          />
                        )}
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>

            {/* Informative Floating Tooltip Card */}
            {activeItem && hoveredIndex !== null && (
              <div
                style={{
                  left: `${Math.min(
                    Math.max(
                      ((padLeft + hoveredIndex * slotWidth + slotWidth / 2) / svgWidth) * 100,
                      15
                    ),
                    85
                  )}%`,
                  top: "12px",
                }}
                className={`absolute -translate-x-1/2 z-20 pointer-events-none p-3 rounded-2xl border shadow-xl transition-all duration-150 w-52 sm:w-56 ${
                  darkMode
                    ? "bg-[#0D1117]/95 border-[#30363D] text-white shadow-black/80"
                    : "bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/10"
                } backdrop-blur-md`}
              >
                {/* Tooltip Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-500/15">
                  <span className="text-xs font-extrabold">{activeItem.period}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {activeItem.fullDate}
                  </span>
                </div>

                {/* Tooltip Metrics Rows */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                      <span className="text-slate-400 text-[11px]">Candidates:</span>
                    </div>
                    <span className="font-mono font-bold">
                      {activeItem.candidatesAssigned}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span className="text-slate-400 text-[11px]">Interviews:</span>
                    </div>
                    <span className="font-mono font-bold">
                      {activeItem.interviewsConducted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                      <span className="text-slate-400 text-[11px]">Placements:</span>
                    </div>
                    <span className="font-mono font-bold">
                      {activeItem.successfulPlacements}
                    </span>
                  </div>

                  <div className="pt-1.5 mt-1 border-t border-slate-500/15 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-amber-500">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Placement Rate:</span>
                    </div>
                    <span className="font-mono font-extrabold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {activeItem.placementRate}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Footer Insight Bar */}
      <div
        className={`pt-3 border-t border-slate-500/10 flex flex-wrap items-center justify-between text-xs ${subText}`}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-500">↑ 12.4%</span>
          <span>Interview conversion vs previous period</span>
        </div>

        <div className="font-mono text-[11px]">
          Target Benchmark: <strong className="text-slate-700 dark:text-slate-200">35.0%</strong>
        </div>
      </div>
    </div>
  );
}
