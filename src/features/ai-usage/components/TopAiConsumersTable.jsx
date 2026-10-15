import React from "react";
import { Eye, TrendingUp } from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";

export default function TopAiConsumersTable({
  consumers = [],
  sortMetric,
  setSortMetric,
  onViewDetails,
  darkMode = false,
}) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const tableHeaderBg = darkMode ? "bg-[#0D1117]" : "bg-slate-50/80";

  return (
    <div
      className={`border rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-500/10">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-mono font-extrabold uppercase tracking-wider mb-1 border border-blue-500/20">
            High Volume Actors
          </div>
          <h3 className={`text-base font-extrabold ${headingText}`}>
            Top AI Consumers
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            Ranked by compute intensity and operational spend
          </p>
        </div>

        {/* Sort Metric Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-500/10 text-xs font-semibold">
          {[
            { id: "tokens", label: "Tokens" },
            { id: "cost", label: "Cost" },
            { id: "requests", label: "Requests" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSortMetric(m.id)}
              className={`px-3 py-1 rounded-lg transition-all ${
                sortMetric === m.id
                  ? "bg-[#0B192C] text-white shadow-xs dark:bg-white dark:text-slate-900 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="mt-4 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead>
            <tr
              className={`border-b border-slate-200 dark:border-[#30363D] text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider select-none ${tableHeaderBg}`}
            >
              <th className="py-2.5 px-3 first:pl-4 w-12 text-center">Rank</th>
              <th className="py-2.5 px-3">Actor / User</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3 text-right">Requests</th>
              <th className="py-2.5 px-3 text-right">Total Tokens</th>
              <th className="py-2.5 px-3 text-right">Est. Cost</th>
              <th className="py-2.5 px-3">Top Feature</th>
              <th className="py-2.5 px-3 text-center">Trend</th>
              <th className="py-2.5 px-3 last:pr-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-[#30363D]/60 font-medium">
            {consumers.slice(0, 7).map((c) => {
              return (
                <tr
                  key={c.actorId}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#1F242C] transition-colors"
                >
                  {/* Rank */}
                  <td className="py-2.5 px-3 first:pl-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-mono text-[11px] font-extrabold ${
                        c.rank === 1
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300"
                          : c.rank === 2
                          ? "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                          : c.rank === 3
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                          : "text-slate-400 font-mono"
                      }`}
                    >
                      {c.rank}
                    </span>
                  </td>

                  {/* Actor details */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {(c.name || "AI").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div
                          className={`font-bold truncate ${
                            darkMode ? "text-slate-100" : "text-slate-900"
                          }`}
                        >
                          {c.name || "Unknown"}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          {c.email || "no-email"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Actor Type Badge */}
                  <td className="py-2.5 px-3">
                    <Badge
                      size="sm"
                      variant={
                        c.actorType === "Admin"
                          ? "navy"
                          : c.actorType === "Employee"
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {c.actorType}
                    </Badge>
                  </td>

                  {/* AI Requests */}
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">
                    {Number(c.requests || 0).toLocaleString()}
                  </td>

                  {/* Total Tokens */}
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                    {(c.tokens || 0) >= 1_000_000
                      ? `${((c.tokens || 0) / 1_000_000).toFixed(2)}M`
                      : Number(c.tokens || 0).toLocaleString()}
                  </td>

                  {/* Estimated Cost */}
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ${Number(c.cost || 0).toFixed(2)}
                  </td>

                  {/* Top Feature */}
                  <td className="py-2.5 px-3 truncate max-w-[140px]" title={c.topFeature}>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {c.topFeature}
                    </span>
                  </td>

                  {/* Usage Trend */}
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-md">
                      <TrendingUp className="w-2.5 h-2.5" />
                      <span>Active</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 last:pr-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(c.actorId)}
                      className="py-1 px-2.5 text-[11px]"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Details</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-500/10 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Showing top {Math.min(7, consumers.length)} heavy actors</span>
        <span>Ranked by: {sortMetric.toUpperCase()}</span>
      </div>
    </div>
  );
}
