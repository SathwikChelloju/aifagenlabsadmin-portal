import React from "react";
import { History, ArrowRight, Shield } from "lucide-react";

export default function RecentActivityFeed({
  activities = [],
  onNavigate,
  darkMode = false,
}) {
  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const itemBorder = darkMode ? "border-[#30363D]" : "border-slate-100";
  const itemHover = darkMode ? "hover:bg-[#1C2128]" : "hover:bg-slate-50/70";

  const formatTime = (ts) => {
    if (!ts) return "Recently";
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return ts;
    }
  };

  const getActionBadgeColor = (action = "") => {
    const act = action.toLowerCase();
    if (act.includes("create") || act.includes("add")) {
      return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20";
    }
    if (act.includes("delete") || act.includes("revoke") || act.includes("failed")) {
      return "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20";
    }
    if (act.includes("update") || act.includes("edit") || act.includes("modify")) {
      return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20";
    }
    return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20";
  };

  return (
    <div
      className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors ${cardBg}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-slate-500/10 text-slate-500 flex items-center justify-center shrink-0">
              <History className="w-4 h-4" />
            </span>
            <div>
              <h3 className={`text-base font-extrabold ${headingText}`}>
                Recent Platform Activity
              </h3>
              <p className={`text-[11px] ${subText}`}>
                Chronological operations and audit trail
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate("audit-logs")}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                darkMode
                  ? "bg-[#0D1117] border-[#30363D] text-slate-300 hover:text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Full Audit Log</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 2-column compact grid of activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {activities.slice(0, 6).map((act) => (
            <div
              key={act.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 text-xs transition-colors ${itemHover} ${
                darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50/70 border-slate-100"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase border shrink-0 ${getActionBadgeColor(
                    act.action
                  )}`}
                >
                  {act.action}
                </span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${headingText}`}>
                    {act.target || act.details || "System event"}
                  </p>
                  <p className={`text-[10px] truncate ${subText}`}>
                    by <span className="font-semibold text-slate-700 dark:text-slate-300">{act.admin}</span>
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-mono shrink-0 ${subText}`}>
                {formatTime(act.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between ${itemBorder} ${subText}`}>
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          Immutable Audit Trail Active
        </span>
        <span className="font-mono text-[10px]">
          Live Operational Stream
        </span>
      </div>
    </div>
  );
}
