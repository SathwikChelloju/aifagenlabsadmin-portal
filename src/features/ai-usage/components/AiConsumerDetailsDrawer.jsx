import React from "react";
import { ArrowRight } from "lucide-react";
import Drawer from "../../../components/ui/Drawer";
import Badge from "../../../components/ui/Badge";

export default function AiConsumerDetailsDrawer({
  isOpen,
  onClose,
  consumerProfile,
  onViewRequest,
  darkMode = false,
}) {
  if (!consumerProfile) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      darkMode={darkMode}
      width="max-w-md sm:max-w-xl"
      customHeader={
        <div className="flex items-center gap-3">
          {consumerProfile.actorAvatar ? (
            <img
              src={consumerProfile.actorAvatar}
              alt={consumerProfile.actorName}
              className="w-10 h-10 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
              {(consumerProfile.actorName || "AI").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4
                className={`text-base font-extrabold ${
                  darkMode ? "text-white" : "text-[#0B192C]"
                }`}
              >
                {consumerProfile.actorName}
              </h4>
              <Badge
                size="sm"
                variant={
                  consumerProfile.actorType === "Admin"
                    ? "navy"
                    : consumerProfile.actorType === "Employee"
                    ? "warning"
                    : "neutral"
                }
              >
                {consumerProfile.actorType}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {consumerProfile.actorEmail}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div
            className={`p-3 rounded-2xl border ${
              darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
              Requests
            </span>
            <span className="font-mono font-extrabold text-sm block mt-1">
              {consumerProfile.totalRequests}
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border ${
              darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
              Tokens
            </span>
            <span className="font-mono font-extrabold text-sm text-amber-600 dark:text-amber-400 block mt-1">
              {consumerProfile.totalTokens >= 1_000_000
                ? `${(consumerProfile.totalTokens / 1_000_000).toFixed(2)}M`
                : consumerProfile.totalTokens.toLocaleString()}
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border ${
              darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
              Spend
            </span>
            <span className="font-mono font-extrabold text-sm text-emerald-600 dark:text-emerald-400 block mt-1">
              ${consumerProfile.totalCost.toFixed(2)}
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border ${
              darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
              Success
            </span>
            <span className="font-mono font-extrabold text-sm block mt-1">
              {consumerProfile.successRate}%
            </span>
          </div>
        </div>

        {/* Feature Usage Breakdown */}
        <div
          className={`p-4 rounded-2xl border ${
            darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
          }`}
        >
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
            Feature Invocations
          </span>
          <div className="space-y-1.5 text-xs">
            {Object.entries(consumerProfile.featureCounts).map(([feature, count]) => {
              const pct = (
                (count / (consumerProfile.totalRequests || 1)) *
                100
              ).toFixed(1);
              return (
                <div key={feature} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-600 dark:text-slate-300 truncate">
                      {feature}
                    </span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {count} calls ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Invocations by this consumer */}
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
            Recent Invocations
          </span>
          <div className="space-y-2">
            {consumerProfile.recentRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => onViewRequest && onViewRequest(req)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs ${
                  darkMode
                    ? "bg-[#0D1117] border-[#30363D] hover:border-amber-500/60"
                    : "bg-white border-slate-200 hover:border-amber-500/60 shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{req.feature}</span>
                    <Badge
                      size="sm"
                      variant={req.status === "Success" ? "success" : "danger"}
                    >
                      {req.status}
                    </Badge>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {req.id} • {req.model} • {req.relativeTime}
                  </div>
                </div>

                <div className="text-right flex items-center gap-2">
                  <div>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                      ${req.estimatedCost.toFixed(4)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      {req.latencyFormatted}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
