import React from "react";
import { ArrowUpDown, Zap } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import { PROVIDERS } from "../constants/aiUsageData";

export default function ProviderModelPerformanceTable({
  models = [],
  providerFilter,
  setProviderFilter,
  sortField,
  sortDirection,
  onSort,
  onViewModelRequests,
  darkMode = false,
}) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const tableHeaderBg = darkMode ? "bg-[#0D1117]" : "bg-slate-50/80";

  const providerColors = {
    OpenAI: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Anthropic: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Google: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Mistral: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    Meta: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  };

  const renderSortIndicator = (field) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-400 ml-1 opacity-60 inline" />;
    return (
      <span className="text-amber-500 ml-1 font-bold inline">
        {sortDirection === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  return (
    <div
      className={`border rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors ${cardBg}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-500/10">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-extrabold uppercase tracking-wider mb-1 border border-amber-500/20">
            Foundation Models
          </div>
          <h3 className={`text-base font-extrabold ${headingText}`}>
            Provider & Model Performance
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            Unit economics, token throughput, and latency benchmarks across active LLMs
          </p>
        </div>

        {/* Provider Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Filter:</span>
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none focus:border-amber-500 transition-colors ${
              darkMode
                ? "bg-[#0D1117] border-[#30363D] text-white"
                : "bg-slate-50 border-slate-200 text-slate-900"
            }`}
          >
            <option value="all">All Configured Providers</option>
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="mt-4 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead>
            <tr
              className={`border-b border-slate-200 dark:border-[#30363D] text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider select-none ${tableHeaderBg}`}
            >
              <th
                onClick={() => onSort("model")}
                className="py-2.5 px-2.5 sm:px-3 first:pl-4 cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Provider / Model {renderSortIndicator("model")}
              </th>
              <th
                onClick={() => onSort("requests")}
                className="py-2.5 px-2 sm:px-3 text-right cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Requests {renderSortIndicator("requests")}
              </th>
              <th
                onClick={() => onSort("inputTokens")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Input Tokens {renderSortIndicator("inputTokens")}
              </th>
              <th
                onClick={() => onSort("outputTokens")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Output Tokens {renderSortIndicator("outputTokens")}
              </th>
              <th
                onClick={() => onSort("totalTokens")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Total Tokens {renderSortIndicator("totalTokens")}
              </th>
              <th
                onClick={() => onSort("successRate")}
                className="py-3 px-3 text-center cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Success Rate {renderSortIndicator("successRate")}
              </th>
              <th
                onClick={() => onSort("avgLatencyMs")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Avg Latency {renderSortIndicator("avgLatencyMs")}
              </th>
              <th
                onClick={() => onSort("estimatedCost")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Estimated Cost {renderSortIndicator("estimatedCost")}
              </th>
              <th className="py-3 px-3 last:pr-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-[#30363D]/60 font-medium">
            {models.map((m) => {
              const pillClass =
                providerColors[m.provider] ||
                "bg-slate-500/10 text-slate-600 border-slate-500/20";

              return (
                <tr
                  key={m.model}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#1F242C] transition-colors"
                >
                  {/* Model & Provider */}
                  <td className="py-3 px-3 first:pl-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${pillClass}`}
                      >
                        {m.provider}
                      </span>
                      <span
                        className={`font-bold font-mono text-xs ${
                          darkMode ? "text-slate-100" : "text-slate-900"
                        }`}
                      >
                        {m.model}
                      </span>
                    </div>
                  </td>

                  {/* Requests */}
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    {Number(m.requests || 0).toLocaleString()}
                  </td>

                  {/* Input Tokens */}
                  <td className="py-3 px-3 text-right font-mono text-slate-500 dark:text-slate-400">
                    {Number(m.inputTokens || 0).toLocaleString()}
                  </td>

                  {/* Output Tokens */}
                  <td className="py-3 px-3 text-right font-mono text-slate-500 dark:text-slate-400">
                    {Number(m.outputTokens || 0).toLocaleString()}
                  </td>

                  {/* Total Tokens */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                    {Number(m.totalTokens || 0).toLocaleString()}
                  </td>

                  {/* Success Rate */}
                  <td className="py-3 px-3 text-center">
                    <Badge
                      size="sm"
                      variant={
                        m.successRate >= 98
                          ? "success"
                          : m.successRate >= 95
                          ? "warning"
                          : "danger"
                      }
                    >
                      {m.successRate}%
                    </Badge>
                  </td>

                  {/* Avg Latency */}
                  <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {m.avgLatencyFormatted}
                  </td>

                  {/* Estimated Cost */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {m.estimatedCost !== undefined && m.estimatedCost !== null
                      ? `$${Number(m.estimatedCost).toFixed(2)}`
                      : "Not configured"}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 last:pr-4 text-center">
                    <button
                      onClick={() => onViewModelRequests && onViewModelRequests(m.model)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors cursor-pointer"
                      title="Inspect model calls"
                    >
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Traces</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-500/10 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>{models.length} active models benchmarked</span>
        <span>Sorted by: {sortField.toUpperCase()} ({sortDirection})</span>
      </div>
    </div>
  );
}
