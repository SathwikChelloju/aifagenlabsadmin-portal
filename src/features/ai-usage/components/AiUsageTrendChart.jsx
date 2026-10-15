import React, { useState } from "react";

export default function AiUsageTrendChart({
  trendData,
  metric,
  setMetric,
  range,
  setRange,
  darkMode = false,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  const { buckets = [], models = [], modelColors = {} } = trendData;
  const activeBucket =
    hoveredIndex !== null && buckets[hoveredIndex]
      ? buckets[hoveredIndex]
      : null;

  // SVG dimensions
  const svgWidth = 620;
  const svgHeight = 220;
  const chartPaddingLeft = 45;
  const chartPaddingRight = 20;
  const chartPaddingTop = 20;
  const chartPaddingBottom = 30;

  const innerWidth = svgWidth - chartPaddingLeft - chartPaddingRight;
  const innerHeight = svgHeight - chartPaddingTop - chartPaddingBottom;

  // Find max value across all buckets and series with dynamic headroom
  let rawMax = 0;
  buckets.forEach((b) => {
    models.forEach((m) => {
      const val = b.series?.[m] || 0;
      if (val > rawMax) rawMax = val;
    });
  });

  const maxValue =
    rawMax > 0
      ? rawMax * 1.15
      : metric === "cost"
      ? 0.1
      : metric === "tokens"
      ? 1000
      : 10;

  // Calculate coordinates for each model line
  const linesData = models.map((model) => {
    const points = buckets.map((b, idx) => {
      const x =
        chartPaddingLeft +
        (buckets.length > 1 ? (idx / (buckets.length - 1)) * innerWidth : innerWidth / 2);
      const val = b.series?.[model] || 0;
      const y = chartPaddingTop + innerHeight - (val / maxValue) * innerHeight;
      return { x, y, val };
    });

    const pathD = points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      // Smooth curve
      const prev = points[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
    }, "");

    return {
      model,
      color: modelColors[model] || "#D97706",
      points,
      pathD,
    };
  });

  const formatYValue = (val) => {
    if (metric === "cost") {
      return val < 0.1 ? `$${val.toFixed(2)}` : val < 10 ? `$${val.toFixed(2)}` : `$${Math.round(val)}`;
    }
    if (metric === "tokens") {
      if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
      if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
      return Math.round(val).toLocaleString();
    }
    return val >= 1_000 ? `${(val / 1_000).toFixed(1)}k` : Math.round(val);
  };

  const formatTooltipValue = (val) => {
    if (metric === "cost") return `$${val.toFixed(3)}`;
    if (metric === "tokens") return `${Math.round(val).toLocaleString()} tok`;
    return `${Math.round(val).toLocaleString()} req`;
  };

  // Chart display mode (default to "bar" as requested)
  const [chartType, setChartType] = useState("bar"); // "bar" or "line"

  // Bar layout metrics
  const colWidth = innerWidth / (buckets.length || 1);
  const clusterWidth = Math.min(colWidth * 0.78, 52);
  const barGap = 2;
  const barWidth = Math.max(3, (clusterWidth - (models.length - 1) * barGap) / (models.length || 1));

  return (
    <div
      className={`border rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      {/* Top Header: Title, Metrics Selector, Date Range Selector, Chart Type */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 pb-4 border-b border-slate-500/10">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-extrabold uppercase tracking-wider mb-1 border border-amber-500/20">
            Multi-Model Telemetry
          </div>
          <h3 className={`text-base font-extrabold ${headingText}`}>
            AI Usage Trend
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            Throughput, invocation volume, and unit spend comparison across models
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Chart View Toggle (Bar vs Line) */}
          <div className="flex items-center p-1 rounded-xl bg-slate-500/10 text-xs font-semibold">
            <button
              onClick={() => setChartType("bar")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                chartType === "bar"
                  ? "bg-[#D97706] text-white shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title="Grouped Bar Chart"
            >
              Bars
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                chartType === "line"
                  ? "bg-[#D97706] text-white shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title="Multi-line Area Chart"
            >
              Lines
            </button>
          </div>

          {/* Metric Selector (Requests, Tokens, Cost) */}
          <div className="flex items-center p-1 rounded-xl bg-slate-500/10 text-xs font-bold">
            <button
              onClick={() => setMetric("requests")}
              className={`px-3 py-1 rounded-lg transition-all ${
                metric === "requests"
                  ? "bg-[#0B192C] text-white shadow-xs dark:bg-white dark:text-slate-900"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Requests
            </button>
            <button
              onClick={() => setMetric("tokens")}
              className={`px-3 py-1 rounded-lg transition-all ${
                metric === "tokens"
                  ? "bg-[#0B192C] text-white shadow-xs dark:bg-white dark:text-slate-900"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Tokens
            </button>
            <button
              onClick={() => setMetric("cost")}
              className={`px-3 py-1 rounded-lg transition-all ${
                metric === "cost"
                  ? "bg-[#0B192C] text-white shadow-xs dark:bg-white dark:text-slate-900"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Cost
            </button>
          </div>

          {/* Range Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-500/10 text-xs font-semibold">
            {[
              { id: "24h", label: "24h" },
              { id: "7d", label: "7d" },
              { id: "30d", label: "30d" },
              { id: "90d", label: "90d" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  range === r.id
                    ? "bg-[#D97706] text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend Row */}
      <div className="flex flex-wrap items-center gap-4 py-3 text-xs font-semibold border-b border-slate-500/10">
        {models.map((m) => (
          <div key={m} className="flex items-center gap-2">
            <span
              className="w-3 h-2 rounded-xs"
              style={{ backgroundColor: modelColors[m] || "#D97706" }}
            />
            <span className={darkMode ? "text-slate-300" : "text-slate-700"}>{m}</span>
          </div>
        ))}
      </div>

      {/* Chart SVG Canvas */}
      <div className="my-4 relative">
        <div className="h-64 w-full relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            onMouseLeave={() => setHoveredIndex(null)}
            className="w-full h-full overflow-visible"
          >
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = chartPaddingTop + innerHeight * (1 - pct);
              return (
                <g key={i}>
                  <line
                    x1={chartPaddingLeft}
                    y1={y}
                    x2={svgWidth - chartPaddingRight}
                    y2={y}
                    stroke={darkMode ? "#30363D" : "#E2E8F0"}
                    strokeWidth="1"
                    strokeDasharray={pct === 0 ? undefined : "3 3"}
                  />
                  <text
                    x={chartPaddingLeft - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] font-mono fill-slate-400 select-none"
                  >
                    {formatYValue(maxValue * pct)}
                  </text>
                </g>
              );
            })}

            {/* Vertical hover highlight column */}
            {hoveredIndex !== null && buckets[hoveredIndex] && (
              <rect
                x={chartPaddingLeft + hoveredIndex * colWidth}
                y={chartPaddingTop - 4}
                width={colWidth}
                height={innerHeight + 8}
                rx="6"
                fill={darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(217, 119, 6, 0.07)"}
              />
            )}

            {/* BAR GRAPH RENDERING */}
            {chartType === "bar" &&
              buckets.map((b, bIdx) => {
                const colCenterX = chartPaddingLeft + (bIdx + 0.5) * colWidth;
                const clusterStartX = colCenterX - clusterWidth / 2;
                const isHovered = hoveredIndex === bIdx;

                return (
                  <g key={`bucket-bars-${bIdx}`} className="transition-all duration-150">
                    {models.map((model, mIdx) => {
                      const barX = clusterStartX + mIdx * (barWidth + barGap);
                      const val = b.series?.[model] || 0;
                      const barH =
                        val > 0
                          ? Math.max(3, (val / maxValue) * innerHeight)
                          : 1.5;
                      const barY = chartPaddingTop + innerHeight - barH;
                      const color = modelColors[model] || "#D97706";

                      return (
                        <rect
                          key={`${model}-${bIdx}`}
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={barH}
                          rx={val > 0 ? "2.5" : "1"}
                          fill={color}
                          opacity={
                            isHovered
                              ? 1
                              : hoveredIndex !== null
                              ? 0.4
                              : val > 0
                              ? 0.88
                              : 0.25
                          }
                          className="transition-all duration-150"
                        />
                      );
                    })}
                  </g>
                );
              })}

            {/* LINE CHART RENDERING (WHEN TOGGLED) */}
            {chartType === "line" &&
              linesData.map((line) => (
                <g key={line.model}>
                  <path
                    d={line.pathD}
                    fill="none"
                    stroke={line.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {hoveredIndex !== null && line.points[hoveredIndex] && (
                    <circle
                      cx={line.points[hoveredIndex].x}
                      cy={line.points[hoveredIndex].y}
                      r="4.5"
                      fill={line.color}
                      stroke={darkMode ? "#161B22" : "#FFFFFF"}
                      strokeWidth="2"
                    />
                  )}
                </g>
              ))}

            {/* Transparent hover capture zones */}
            {buckets.map((b, idx) => {
              const x = chartPaddingLeft + idx * colWidth;
              return (
                <rect
                  key={idx}
                  x={x}
                  y={chartPaddingTop}
                  width={colWidth}
                  height={innerHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                />
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip (shown on hover only) */}
          {activeBucket && (
            <div
              style={{
                left: `${Math.min(
                  Math.max(
                    (hoveredIndex / (buckets.length - 1 || 1)) * 100,
                    22
                  ),
                  78
                )}%`,
                top: "10px",
                transform: "translateX(-50%)",
              }}
              className={`absolute p-3 rounded-2xl shadow-xl pointer-events-none z-20 min-w-[190px] border transition-all ${
                darkMode
                  ? "bg-[#0D1117]/95 border-[#30363D] text-white"
                  : "bg-white/95 backdrop-blur-md border-slate-200 text-slate-900"
              }`}
            >
              <div className="text-[11px] font-bold border-b border-slate-500/20 pb-1.5 mb-1.5 flex items-center justify-between">
                <span>{activeBucket.label}</span>
                <span className="text-[10px] font-mono text-amber-500 uppercase">
                  {metric}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                {models.map((m) => (
                  <div key={m} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: modelColors[m] }}
                      />
                      <span className="truncate max-w-[100px]">{m}</span>
                    </span>
                    <span className="font-mono font-bold text-[11px]">
                      {formatTooltipValue(activeBucket.series?.[m] || 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between items-center text-[10px] font-mono mt-2 pl-10 pr-4 text-slate-400">
          {buckets.map((b, i) => (
            <span
              key={i}
              className={
                hoveredIndex === i
                  ? "text-amber-500 font-bold"
                  : ""
              }
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Summary */}
      <div className="pt-3 border-t border-slate-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
        <span className={subText}>
          Selected Cycle:{" "}
          <strong className={headingText}>
            {activeBucket ? activeBucket.label : `${range.toUpperCase()} Telemetry Window`}
          </strong>
        </span>
        <div className="flex items-center gap-4 font-mono font-semibold text-[11px]">
          <span className="text-emerald-600 dark:text-emerald-400">
            Peak: {formatYValue(maxValue)}
          </span>
          <span className="text-amber-600 dark:text-amber-400">
            Active Metric: {metric.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
