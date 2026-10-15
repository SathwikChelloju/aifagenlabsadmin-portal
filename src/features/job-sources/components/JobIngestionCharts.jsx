import React, { useState, useMemo } from "react";
import { TrendingUp, PieChart as PieIcon } from "lucide-react";

const SOURCE_COLORS = {
  linkedin: "#0A66C2", // LinkedIn Blue
  indeed: "#2563EB", // Indeed Royal Blue
  naukri: "#D97706", // AIFA Amber/Orange
  greenhouse: "#059669", // Emerald Green
  glassdoor: "#0284C7", // Sky Blue
  "aifa-internal": "#10B981", // Teal Green
  aifa: "#10B981",
  lever: "#8B5CF6", // Purple
  workday: "#E11D48", // Rose Red
};

const FALLBACK_PALETTE = [
  "#F59E0B",
  "#6366F1",
  "#EC4899",
  "#14B8A6",
  "#84CC16",
  "#F97316",
];

/**
 * JobIngestionCharts Component
 * Performance Analytics section with two interactive, responsive SVG charts:
 * 1. Job Ingestion Performance: Multi-line chart showing individual source performance
 *    in "All Sources" mode and single-source focus in Source-Specific mode.
 * 2. Source Contribution: Donut chart showing unique jobs contributed by each source.
 */
export default function JobIngestionCharts({
  sources = [],
  timeSeriesData = [],
  darkMode = false,
}) {
  const [dateRange, setDateRange] = useState("14"); // "7" | "14" | "30"
  const [selectedSourceFilter, setSelectedSourceFilter] = useState("all");
  const [hoveredXIndex, setHoveredXIndex] = useState(null);
  const [hoveredLineKey, setHoveredLineKey] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const selectBg = darkMode
    ? "bg-[#0D1117] border-[#30363D] text-slate-200 focus:border-amber-500"
    : "bg-white border-slate-200 text-slate-800 focus:border-amber-500";

  // Slice timeSeriesData according to selected dateRange (7, 14, 30 days)
  const rangeCount = parseInt(dateRange, 10);
  const activeSeries = useMemo(() => {
    return timeSeriesData.slice(-rangeCount);
  }, [timeSeriesData, rangeCount]);

  // Determine active sources to plot
  const activeSourcesToPlot = useMemo(() => {
    if (selectedSourceFilter === "all") {
      return sources;
    }
    const single = sources.find((s) => (s.slug || s.id) === selectedSourceFilter);
    return single ? [single] : sources;
  }, [sources, selectedSourceFilter]);

  // Calculate multi-line SVG data
  const multiLineData = useMemo(() => {
    if (!activeSeries.length || !activeSourcesToPlot.length) {
      return { lines: [], maxVal: 20, chartWidth: 560, chartHeight: 180, dates: [] };
    }

    const chartWidth = 560;
    const chartHeight = 180;
    const paddingX = 24;
    const paddingY = 22;

    // Collect all daily values for active sources to compute global maxVal
    const allValues = [];
    activeSourcesToPlot.forEach((src) => {
      const key = src.slug || src.id;
      activeSeries.forEach((day) => {
        const val = day[key] ?? day[src.id] ?? day.aifa ?? 0;
        allValues.push(Number(val) || 0);
      });
    });

    const maxVal = Math.max(...allValues, 10);

    // Build line representation for each source
    const lines = activeSourcesToPlot.map((src, srcIdx) => {
      const key = src.slug || src.id;
      const color =
        SOURCE_COLORS[key] ||
        SOURCE_COLORS[src.slug] ||
        FALLBACK_PALETTE[srcIdx % FALLBACK_PALETTE.length];

      let totalPeriodJobs = 0;

      const points = activeSeries.map((day, idx) => {
        const val = Number(day[key] ?? day[src.id] ?? (key === "aifa-internal" ? day.aifa : 0) ?? 0);
        totalPeriodJobs += val;

        const x =
          paddingX +
          (idx / Math.max(activeSeries.length - 1, 1)) *
            (chartWidth - paddingX * 2);
        const y =
          chartHeight -
          paddingY -
          (val / maxVal) * (chartHeight - paddingY * 2);

        return { x, y, val, date: day.date };
      });

      // Compute smooth cubic bezier path
      const pathD = points.reduce((acc, pt, i) => {
        if (i === 0) return `M ${pt.x} ${pt.y}`;
        const prev = points[i - 1];
        const cx1 = prev.x + (pt.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (pt.x - prev.x) / 2;
        const cy2 = pt.y;
        return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
      }, "");

      // For single-source mode, also build area fill
      const areaD =
        points.length > 0
          ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
          : "";

      return {
        id: src.id,
        name: src.name,
        slug: key,
        color,
        points,
        pathD,
        areaD,
        totalPeriodJobs,
      };
    });

    const dates = activeSeries.map((d) => d.date);

    return {
      lines,
      maxVal,
      chartWidth,
      chartHeight,
      paddingX,
      paddingY,
      dates,
    };
  }, [activeSeries, activeSourcesToPlot]);

  // Donut chart source breakdown
  const donutData = useMemo(() => {
    const totalJobs = sources.reduce(
      (sum, s) => sum + (Number(s.totalJobsRetrieved) || 0),
      0
    );

    if (totalJobs === 0) return { segments: [], totalJobs: 0 };

    let currentOffset = 0;
    const outerRadius = 75;
    const circumference = 2 * Math.PI * outerRadius;

    const segments = sources
      .filter((s) => (Number(s.totalJobsRetrieved) || 0) > 0)
      .map((s) => {
        const jobs = Number(s.totalJobsRetrieved) || 0;
        const pct = (jobs / totalJobs) * 100;
        const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;
        const strokeDashoffset = -currentOffset;
        currentOffset += (pct / 100) * circumference;

        return {
          id: s.id,
          name: s.name,
          slug: s.slug || s.id,
          jobs,
          pct: pct.toFixed(1),
          color: SOURCE_COLORS[s.slug] || "#D97706",
          strokeDasharray,
          strokeDashoffset,
        };
      });

    return { segments, totalJobs, outerRadius, circumference };
  }, [sources]);

  // Current selected source details (if single source selected)
  const selectedSourceObj = useMemo(() => {
    if (selectedSourceFilter === "all") return null;
    return sources.find((s) => (s.slug || s.id) === selectedSourceFilter) || null;
  }, [sources, selectedSourceFilter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* 1. Job Ingestion Performance Multi-Line Chart (7 cols on lg) */}
      <div
        className={`lg:col-span-7 border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors ${cardBg}`}
      >
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-wider mb-1 border border-amber-200/60 dark:border-amber-800/50">
              <TrendingUp className="w-3 h-3" />
              Ingestion Velocity
            </div>
            <h3 className={`text-base font-extrabold ${headingText}`}>
              Job Ingestion Performance
            </h3>
            <p className={`text-xs ${subText} mt-0.5`}>
              {selectedSourceObj
                ? `Telemetry for ${selectedSourceObj.name} over last ${dateRange} days.`
                : `Comparative daily performance across ${multiLineData.lines.length} configured sources.`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Source Filter Dropdown */}
            <select
              value={selectedSourceFilter}
              onChange={(e) => {
                setSelectedSourceFilter(e.target.value);
                setHoveredLineKey(null);
                setHoveredXIndex(null);
              }}
              className={`text-xs py-1.5 px-2.5 rounded-xl border font-medium focus:outline-hidden cursor-pointer ${selectBg}`}
            >
              <option value="all">All Sources (Comparative)</option>
              {sources.map((s) => (
                <option key={s.id} value={s.slug || s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Date Range Selector */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200/80 dark:border-[#30363D]">
              {[
                { label: "7D", val: "7" },
                { label: "14D", val: "14" },
                { label: "30D", val: "30" },
              ].map((tab) => (
                <button
                  key={tab.val}
                  type="button"
                  onClick={() => {
                    setDateRange(tab.val);
                    setHoveredXIndex(null);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    dateRange === tab.val
                      ? "bg-white dark:bg-[#21262D] text-slate-900 dark:text-white shadow-2xs"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Legend */}
        <div className="pt-3 pb-1 flex items-center gap-2.5 flex-wrap">
          {multiLineData.lines.map((line) => {
            const isHovered = hoveredLineKey === line.slug;
            const isDimmed = hoveredLineKey && hoveredLineKey !== line.slug;

            return (
              <button
                key={line.id}
                type="button"
                onMouseEnter={() => setHoveredLineKey(line.slug)}
                onMouseLeave={() => setHoveredLineKey(null)}
                onClick={() => {
                  if (selectedSourceFilter === line.slug) {
                    setSelectedSourceFilter("all");
                  } else {
                    setSelectedSourceFilter(line.slug);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                  isHovered
                    ? "border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-slate-900 dark:text-white scale-102"
                    : isDimmed
                    ? "opacity-40 border-transparent text-slate-400"
                    : darkMode
                    ? "bg-[#0D1117] border-[#30363D] text-slate-300 hover:border-slate-600"
                    : "bg-slate-50 border-slate-200/80 text-slate-700 hover:border-slate-300"
                }`}
                title={`Click to focus on ${line.name}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: line.color }}
                />
                <span className="truncate max-w-[130px]">{line.name}</span>
                <span className="font-mono text-[10px] text-slate-400">
                  ({line.totalPeriodJobs})
                </span>
              </button>
            );
          })}
        </div>

        {/* SVG Chart Surface */}
        <div className="my-3 relative">
          <div className="h-56 w-full flex items-center relative">
            {/* Y-Axis scale indicators */}
            <div
              className={`absolute left-0 top-3 bottom-5 flex flex-col justify-between text-[10px] font-mono pointer-events-none select-none z-10 ${subText}`}
            >
              <span>{multiLineData.maxVal}</span>
              <span>{Math.round(multiLineData.maxVal * 0.5)}</span>
              <span>0</span>
            </div>

            {/* SVG Plot */}
            <div className="ml-8 w-full h-full relative">
              <svg
                viewBox={`0 0 ${multiLineData.chartWidth} ${multiLineData.chartHeight}`}
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Gradient for single-source focus */}
                  {selectedSourceObj && (
                    <linearGradient id="singleSourceAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={
                          SOURCE_COLORS[selectedSourceObj.slug] || "#D97706"
                        }
                        stopOpacity="0.30"
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          SOURCE_COLORS[selectedSourceObj.slug] || "#D97706"
                        }
                        stopOpacity="0.00"
                      />
                    </linearGradient>
                  )}
                </defs>

                {/* Horizontal reference grid lines */}
                <line
                  x1="20"
                  y1="22"
                  x2={multiLineData.chartWidth - 20}
                  y2="22"
                  stroke={darkMode ? "#30363D" : "#E2E8F0"}
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <line
                  x1="20"
                  y1="90"
                  x2={multiLineData.chartWidth - 20}
                  y2="90"
                  stroke={darkMode ? "#30363D" : "#E2E8F0"}
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <line
                  x1="20"
                  y1="158"
                  x2={multiLineData.chartWidth - 20}
                  y2="158"
                  stroke={darkMode ? "#30363D" : "#E2E8F0"}
                  strokeWidth="1"
                />

                {/* Single-Source Mode Area Fill */}
                {selectedSourceFilter !== "all" &&
                  multiLineData.lines[0]?.areaD && (
                    <path
                      d={multiLineData.lines[0].areaD}
                      fill="url(#singleSourceAreaGrad)"
                    />
                  )}

                {/* Active Lines */}
                {multiLineData.lines.map((line) => {
                  const isHovered = hoveredLineKey === line.slug;
                  const isDimmed = hoveredLineKey && hoveredLineKey !== line.slug;

                  return (
                    <g key={line.id}>
                      <path
                        d={line.pathD}
                        fill="none"
                        stroke={line.color}
                        strokeWidth={isHovered ? "3.5" : selectedSourceFilter !== "all" ? "3" : "2"}
                        strokeOpacity={isDimmed ? 0.25 : 1}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-150"
                      />
                    </g>
                  );
                })}

                {/* Vertical Cursor Guide when hovering an X point */}
                {hoveredXIndex !== null && multiLineData.lines[0]?.points[hoveredXIndex] && (
                  <line
                    x1={multiLineData.lines[0].points[hoveredXIndex].x}
                    y1="16"
                    x2={multiLineData.lines[0].points[hoveredXIndex].x}
                    y2="160"
                    stroke={darkMode ? "#64748B" : "#94A3B8"}
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                )}

                {/* Point Nodes */}
                {multiLineData.lines.map((line) => {
                  const isHoveredLine = hoveredLineKey === line.slug;
                  const isDimmed = hoveredLineKey && hoveredLineKey !== line.slug;

                  return line.points.map((pt, idx) => {
                    const isXHovered = hoveredXIndex === idx;
                    if (!isXHovered && !isHoveredLine && selectedSourceFilter === "all" && rangeCount > 14) {
                      return null; // keep graph clean from clutter when 30 days are rendered
                    }

                    return (
                      <circle
                        key={`${line.id}-${idx}`}
                        cx={pt.x}
                        cy={pt.y}
                        r={isXHovered ? 4.5 : 2.5}
                        fill={line.color}
                        stroke={darkMode ? "#161B22" : "#FFFFFF"}
                        strokeWidth={isXHovered ? "2" : "1.5"}
                        opacity={isDimmed ? 0.3 : 1}
                        className="transition-all duration-100 pointer-events-none"
                      />
                    );
                  });
                })}

                {/* Invisible vertical hover slices to capture mouse interactions smoothly */}
                {activeSeries.map((_, idx) => {
                  const x =
                    multiLineData.paddingX +
                    (idx / Math.max(activeSeries.length - 1, 1)) *
                      (multiLineData.chartWidth - multiLineData.paddingX * 2);

                  const sliceWidth =
                    (multiLineData.chartWidth - multiLineData.paddingX * 2) /
                    Math.max(activeSeries.length - 1, 1);

                  return (
                    <rect
                      key={idx}
                      x={x - sliceWidth / 2}
                      y={0}
                      width={sliceWidth}
                      height={multiLineData.chartHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredXIndex(idx)}
                      onMouseLeave={() => setHoveredXIndex(null)}
                    />
                  );
                })}
              </svg>

              {/* Tooltip Overlay */}
              {hoveredXIndex !== null && activeSeries[hoveredXIndex] && (
                <div
                  className="absolute pointer-events-none z-30 transition-transform duration-75"
                  style={{
                    left: `${(multiLineData.lines[0]?.points[hoveredXIndex]?.x / multiLineData.chartWidth) * 100}%`,
                    top: "10px",
                    transform:
                      hoveredXIndex > activeSeries.length / 2
                        ? "translateX(-105%)"
                        : "translateX(10px)",
                  }}
                >
                  <div className="bg-[#0B192C] text-white p-3 rounded-2xl shadow-2xl border border-slate-700/80 min-w-[180px] max-w-[240px]">
                    <div className="text-[11px] font-bold text-slate-300 pb-1.5 border-b border-slate-700 flex items-center justify-between">
                      <span>{activeSeries[hoveredXIndex].date}</span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        {selectedSourceFilter === "all" ? "All Sources" : "Single Source"}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 max-h-48 overflow-y-auto">
                      {multiLineData.lines
                        .map((l) => ({
                          ...l,
                          val: l.points[hoveredXIndex]?.val || 0,
                        }))
                        .sort((a, b) => b.val - a.val)
                        .map((l) => (
                          <div
                            key={l.id}
                            className="flex items-center justify-between text-[11px]"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: l.color }}
                              />
                              <span className="truncate text-slate-200">
                                {l.name}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-white ml-2">
                              {l.val}
                            </span>
                          </div>
                        ))}
                    </div>

                    {selectedSourceFilter === "all" && (
                      <div className="mt-2 pt-1.5 border-t border-slate-700 flex items-center justify-between text-[11px] font-bold text-amber-400 font-mono">
                        <span>Day Total:</span>
                        <span>
                          {multiLineData.lines.reduce(
                            (sum, l) => sum + (l.points[hoveredXIndex]?.val || 0),
                            0
                          )}{" "}
                          jobs
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* X-Axis dates */}
          <div className="flex justify-between items-center ml-8 text-[10px] text-slate-400 font-mono pt-1">
            <span>{multiLineData.dates[0]}</span>
            <span>
              {multiLineData.dates[Math.floor(multiLineData.dates.length / 2)]}
            </span>
            <span>{multiLineData.dates[multiLineData.dates.length - 1]}</span>
          </div>
        </div>
      </div>

      {/* 2. Source Contribution Donut Chart (5 cols on lg) */}
      <div
        className={`lg:col-span-5 border rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors ${cardBg}`}
      >
        {/* Header */}
        <div className="pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 text-[10px] font-extrabold uppercase tracking-wider mb-1 border border-purple-200/60 dark:border-purple-800/50">
            <PieIcon className="w-3 h-3" />
            Share of Ingestion
          </div>
          <h3 className={`text-base font-extrabold ${headingText}`}>
            Source Contribution
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            Unique jobs contributed by each source during period.
          </p>
        </div>

        {/* Donut and Legend Body */}
        <div className="my-auto py-3 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Donut Circle */}
          <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              {/* Background circle track */}
              <circle
                cx="100"
                cy="100"
                r={donutData.outerRadius || 75}
                fill="none"
                stroke={darkMode ? "#21262D" : "#F1F5F9"}
                strokeWidth="24"
              />

              {/* Segments */}
              {donutData.segments.map((seg) => {
                const isHovered = hoveredSegment === seg.id;
                return (
                  <circle
                    key={seg.id}
                    cx="100"
                    cy="100"
                    r={donutData.outerRadius || 75}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={isHovered ? 28 : 24}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredSegment(seg.id)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Info */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Total Jobs
              </span>
              <span
                className={`text-xl font-extrabold font-mono ${
                  darkMode ? "text-white" : "text-[#0B192C]"
                }`}
              >
                {donutData.totalJobs.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Interactive Legend */}
          <div className="flex-1 w-full space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {donutData.segments.map((seg) => {
              const isHovered = hoveredSegment === seg.id;
              return (
                <div
                  key={seg.id}
                  onMouseEnter={() => setHoveredSegment(seg.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className={`flex items-center justify-between p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                    isHovered
                      ? darkMode
                        ? "bg-[#21262D]"
                        : "bg-slate-100"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span
                      className={`font-semibold truncate text-[11px] ${
                        darkMode ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      {seg.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                      {seg.jobs}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 w-9 text-right">
                      {seg.pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
