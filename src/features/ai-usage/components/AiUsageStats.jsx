import React from "react";
import {
  Activity,
  Layers,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

/**
 * Helper to render mini SVG sparkline
 */
function MiniSparkline({ data = [], color = "#D97706", height = 28 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const width = 80;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  const polylineStr = points.join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polylineStr}
      />
    </svg>
  );
}

export default function AiUsageStats({ stats, darkMode = false }) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const titleColor = darkMode ? "text-slate-400" : "text-slate-500";
  const metricColor = darkMode ? "text-white" : "text-[#0B192C]";
  const subTextColor = darkMode ? "text-slate-400" : "text-slate-500";

  const s = stats || {
    totalRequests: 0,
    totalTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    estimatedCost: 0,
    successRate: 100,
    successCount: 0,
    failedCount: 0,
    requestsTrend: "+14.2%",
    sparklines: {},
  };

  const formatNumber = (num = 0) => {
    const n = Number(num || 0);
    if (n >= 1_000_000) {
      return `${(n / 1_000_000).toFixed(2)}M`;
    }
    if (n >= 10_000) {
      return `${(n / 1_000).toFixed(1)}k`;
    }
    return n.toLocaleString();
  };

  const cards = [
    {
      id: "requests",
      label: "TOTAL AI REQUESTS",
      metric: Number(s.totalRequests || 0).toLocaleString(),
      icon: Activity,
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      trend: s.requestsTrend || "+14.2%",
      trendPositive: true,
      subText: "Across all models & environments",
      secondaryInfo: `${s.totalRequests || 0} active traces logged`,
      sparkline: s.sparklines?.requests || [12, 18, 15, 22, 28, 25, 34, 38],
      sparklineColor: "#3B82F6",
    },
    {
      id: "tokens",
      label: "TOTAL TOKENS CONSUMED",
      metric: formatNumber(s.totalTokens),
      rawMetric: `${Number(s.totalTokens || 0).toLocaleString()} tokens`,
      icon: Layers,
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      subText: `Input: ${formatNumber(s.inputTokens)} • Output: ${formatNumber(s.outputTokens)}`,
      secondaryInfo: "Split by prompt & completion",
      sparkline: s.sparklines?.tokens || [45, 60, 52, 70, 68, 85, 92, 98],
      sparklineColor: "#D97706",
    },
    {
      id: "cost",
      label: "ESTIMATED AI SPEND",
      metric: `$${Number(s.estimatedCost || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      trend: "Unit Priced",
      trendPositive: true,
      subText: `Avg. $${(s.totalRequests > 0 ? (s.estimatedCost || 0) / s.totalRequests : 0).toFixed(3)} / request`,
      secondaryInfo: "Active unit rates",
      sparkline: s.sparklines?.cost || [14, 20, 18, 26, 32, 29, 38, 42],
      sparklineColor: "#10B981",
    },
    {
      id: "successRate",
      label: "SUCCESS RATE",
      metric: `${s.successRate || 0}%`,
      icon: CheckCircle2,
      iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      trend: (s.failedCount || 0) > 0 ? `${s.failedCount} failed` : "Zero errors",
      trendPositive: (s.successRate || 0) >= 98,
      subText: `${Number(s.successCount || 0).toLocaleString()} success • ${s.failedCount || 0} error`,
      secondaryInfo: "SLA target: 98.0% availability",
      sparkline: s.sparklines?.success || [98, 99, 97, 99, 98, 99, 100, 99],
      sparklineColor: "#8B5CF6",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`border rounded-3xl p-5 shadow-xs transition-colors flex flex-col justify-between ${cardBg}`}
          >
            <div>
              {/* Header row: Label + Icon */}
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-mono font-bold tracking-wider ${titleColor}`}>
                  {card.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Main Metric Row */}
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <div
                  className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${metricColor}`}
                  title={card.rawMetric || card.metric}
                >
                  {card.metric}
                </div>

                {card.trend && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      card.trendPositive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40"
                    }`}
                  >
                    {card.trendPositive && <TrendingUp className="w-3 h-3" />}
                    {!card.trendPositive && <AlertCircle className="w-3 h-3" />}
                    <span>{card.trend}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Sparkline & Supporting Info Footer */}
            <div className="mt-4 pt-3 border-t border-slate-500/10 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className={`text-xs font-semibold truncate ${metricColor}`}>
                  {card.subText}
                </div>
                <div className={`text-[10px] font-mono truncate ${subTextColor}`}>
                  {card.secondaryInfo}
                </div>
              </div>

              <MiniSparkline
                data={card.sparkline}
                color={card.sparklineColor}
                height={26}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
