import React from "react";
import { ArrowUpRight, Clock, Eye, Sparkles } from "lucide-react";
import Badge from "../../../components/ui/Badge";

export default function RecentAiRequestsCard({
  recentRequests = [],
  onViewRequest,
  onViewAll,
  darkMode = false,
}) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div
      className={`border rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-extrabold uppercase tracking-wider mb-1 border border-amber-500/20">
              Live Stream
            </div>
            <h3 className={`text-base font-extrabold ${headingText}`}>
              Recent AI Requests
            </h3>
            <p className={`text-xs ${subText} mt-0.5`}>
              Latest real-time inference telemetry traces
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List of Recent Requests */}
        <div className="divide-y divide-slate-100 dark:divide-[#30363D]/60 my-2">
          {recentRequests.slice(0, 5).map((req) => (
            <div
              key={req.id}
              onClick={() => onViewRequest(req)}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-[#1F242C] px-2 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="min-w-0 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold truncate ${
                        darkMode ? "text-slate-100" : "text-slate-900"
                      }`}
                    >
                      {req.feature}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {req.model}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono truncate">
                    <span>{req.actorName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {req.relativeTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  size="sm"
                  variant={req.status === "Success" ? "success" : "danger"}
                >
                  {req.status}
                </Badge>

                <div className="p-1 rounded-lg text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-500/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Click any row to open full payload trace</span>
        <span className="text-amber-500 font-bold">Trace Inspector</span>
      </div>
    </div>
  );
}
