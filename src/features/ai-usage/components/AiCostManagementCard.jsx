import React from "react";
import { Sliders, ShieldCheck } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function AiCostManagementCard({
  costManagement,
  onOpenConfigure,
  darkMode = false,
}) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  const {
    monthlyBudget = 0,
    estimatedSpend = 0,
    remainingBudget = 0,
    consumedPct = 0,
    isWarning = false,
    isCritical = false,
    providerBreakdown = [],
    warningThresholdPct = 75,
    criticalThresholdPct = 90,
  } = costManagement || {};

  // Progress bar color
  const progressColor = isCritical
    ? "bg-rose-500"
    : isWarning
    ? "bg-amber-500"
    : "bg-emerald-500";

  const providerColors = {
    OpenAI: "#10A37F",
    Anthropic: "#D97706",
    Google: "#3B82F6",
    Mistral: "#EC4899",
    Meta: "#0668E1",
  };

  return (
    <div
      className={`border rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-500/10">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-mono font-extrabold uppercase tracking-wider mb-1 border border-purple-500/20">
              Budget Governance
            </div>
            <h3 className={`text-base font-extrabold ${headingText}`}>
              AI Cost Management
            </h3>
            <p className={`text-xs ${subText} mt-0.5`}>
              Spend ceilings, real-time burn pacing, and model quotas
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Sliders}
            onClick={onOpenConfigure}
            className="shrink-0"
          >
            Configure
          </Button>
        </div>

        {/* Top Metric Grid (2x2 layout prevents cramped text) */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <div
            className={`p-3 rounded-2xl border ${
              darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
              Monthly Budget
            </span>
            <span className={`text-sm sm:text-base font-extrabold font-mono ${headingText} mt-0.5 block`}>
              ${Number(monthlyBudget || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border ${
              darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
              Estimated Spend
            </span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-0.5 block">
              ${Number(estimatedSpend || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border ${
              darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
              Remaining Budget
            </span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              ${Number(remainingBudget || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border ${
              darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
              Consumed
            </span>
            <span
              className={`text-sm sm:text-base font-extrabold font-mono mt-0.5 block ${
                isCritical
                  ? "text-rose-600 dark:text-rose-400"
                  : isWarning
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {consumedPct}%
            </span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-1.5 my-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={subText}>Budget Utilization</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {consumedPct}% of ${monthlyBudget.toLocaleString()} ceiling
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-[#30363D] overflow-hidden relative">
            {/* Warning threshold indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
              style={{ left: `${warningThresholdPct}%` }}
              title={`Warning threshold at ${warningThresholdPct}%`}
            />
            {/* Critical threshold indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
              style={{ left: `${criticalThresholdPct}%` }}
              title={`Critical threshold at ${criticalThresholdPct}%`}
            />

            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${Math.min(100, consumedPct)}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>0%</span>
            <span>Warn: {warningThresholdPct}%</span>
            <span>Crit: {criticalThresholdPct}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Provider Breakdown List */}
        <div className="mt-4 pt-3 border-t border-slate-500/10">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Cost Breakdown by Provider
          </span>
          <div className="space-y-2">
            {providerBreakdown.map((item) => (
              <div key={item.provider} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: providerColors[item.provider] || "#94A3B8",
                      }}
                    />
                    <span>{item.provider}</span>
                  </span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    ${item.cost.toFixed(2)}{" "}
                    <span className="text-slate-400 text-[10px]">({item.pct}%)</span>
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: providerColors[item.provider] || "#94A3B8",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Notice Footer */}
      <div
        className={`mt-4 p-2.5 rounded-2xl border text-[11px] font-medium flex items-center gap-2 ${
          darkMode
            ? "bg-[#0D1117] border-[#30363D] text-slate-400"
            : "bg-slate-50 border-slate-200 text-slate-600"
        }`}
      >
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>
          Governance Simulation: Threshold warnings monitor velocity without interrupting active LLM inferences.
        </span>
      </div>
    </div>
  );
}
