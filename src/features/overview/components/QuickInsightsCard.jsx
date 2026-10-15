import React from "react";
import { Lightbulb, CheckCircle2, AlertTriangle, ArrowRight, Zap, Target } from "lucide-react";

export default function QuickInsightsCard({ onNavigate, darkMode = false }) {
  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const itemBorder = darkMode ? "border-[#30363D]" : "border-slate-100";
  const itemHover = darkMode ? "hover:bg-[#1C2128]" : "hover:bg-slate-50/70";

  const insights = [
    {
      id: "crawler-health",
      rank: 1,
      type: "warning",
      title: "Ingestion Connectors",
      description: "3 of 5 job pipelines running sub-second. Greenhouse & Lever have occasional retries.",
      actionText: "Manage Sources",
      route: "job-sources",
      icon: AlertTriangle,
      iconColor: "text-amber-500",
    },
    {
      id: "ai-efficiency",
      rank: 2,
      type: "positive",
      title: "Token Optimization",
      description: "Claude 3.5 Sonnet and GPT-4o Mini maintain an optimal $0.17 cost per tailored CV.",
      actionText: "View AI Usage",
      route: "ai-usage",
      icon: Zap,
      iconColor: "text-blue-500",
    },
    {
      id: "candidate-focus",
      rank: 3,
      type: "info",
      title: "Market Distribution",
      description: "United Kingdom (44%) and Germany remain primary destination goals for students.",
      actionText: "Candidates",
      route: "users",
      icon: Target,
      iconColor: "text-emerald-500",
    },
    {
      id: "recruiter-capacity",
      rank: 4,
      type: "positive",
      title: "Caseload Velocity",
      description: "12 talent partners handle 453 active candidates with a 41% placement conversion.",
      actionText: "Recruiters",
      route: "recruiters",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <div
      className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4" />
            </span>
            <div>
              <h3 className={`text-base font-extrabold ${headingText}`}>
                Quick Insights
              </h3>
              <p className={`text-[11px] ${subText}`}>Operational signals & priorities</p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
              darkMode
                ? "bg-[#0D1117] text-slate-400 border-[#30363D]"
                : "bg-slate-50 text-slate-500 border-slate-200"
            }`}
          >
            Live Feed
          </span>
        </div>

        <div className="divide-y divide-inherit">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`py-2.5 first:pt-1 last:pb-1 transition-colors rounded-xl px-2 -mx-2 ${itemHover} ${itemBorder}`}
              >
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-[#0D1117] text-[10px] font-mono font-bold flex items-center justify-center text-slate-500 shrink-0">
                      {item.rank}
                    </span>
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${item.iconColor}`} />
                    <span className={`text-xs font-bold truncate ${headingText}`}>
                      {item.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate?.(item.route)}
                    className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5 shrink-0 cursor-pointer"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
                <p className={`text-[11px] leading-tight pl-7 ${subText}`}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between ${itemBorder} ${subText}`}>
        <span>Evaluated across all subsystems</span>
        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
          ● Live Telemetry
        </span>
      </div>
    </div>
  );
}
