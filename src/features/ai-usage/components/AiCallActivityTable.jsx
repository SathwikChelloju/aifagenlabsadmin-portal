import React from "react";
import {
  Search,
  Filter,
  Eye,
  RotateCcw,
  Download,
  ArrowUpDown,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Pagination from "../../../components/data-display/Pagination";
import { PROVIDERS, AI_FEATURES } from "../constants/aiUsageData";

export default function AiCallActivityTable({
  requests = [],
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  sortField,
  sortDirection,
  onSort,
  searchQuery,
  setSearchQuery,
  actorTypeFilter,
  setActorTypeFilter,
  featureFilter,
  setFeatureFilter,
  providerFilter,
  setProviderFilter,
  statusFilter,
  setStatusFilter,
  onClearFilters,
  onViewRequest,
  onExportCsv,
  darkMode = false,
}) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const selectBg = darkMode
    ? "bg-[#0D1117] border-[#30363D] text-slate-200"
    : "bg-slate-50 border-slate-200 text-slate-800";
  const tableHeaderBg = darkMode ? "bg-[#0D1117]" : "bg-slate-50/80";

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
      id="ai-call-activity-section"
      className={`border rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors ${cardBg}`}
    >
      {/* Title & Subtitle */}
      <div className="pb-4 border-b border-slate-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-mono font-extrabold uppercase tracking-wider mb-1 border border-blue-500/20">
            Invocation Log
          </div>
          <h3 className={`text-base font-extrabold ${headingText}`}>
            AI Call Activity Table
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            Granular log of inference calls, token telemetry, and execution traces
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Matching Records:</span>
          <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            {totalCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="py-4 border-b border-slate-500/10 space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by actor, email, request ID, feature, model..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:border-amber-500 transition-colors ${selectBg}`}
            />
          </div>

          {/* Actor Type Filter */}
          <div className="relative">
            <select
              value={actorTypeFilter}
              onChange={(e) => setActorTypeFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none focus:border-amber-500 transition-colors ${selectBg}`}
            >
              <option value="all">All Actor Types</option>
              <option value="User">Candidates (Users)</option>
              <option value="Employee">Employees (Staff)</option>
              <option value="Admin">Admins & System</option>
            </select>
          </div>

          {/* Feature Filter */}
          <div className="relative">
            <select
              value={featureFilter}
              onChange={(e) => setFeatureFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none focus:border-amber-500 transition-colors ${selectBg}`}
            >
              <option value="all">All Features</option>
              {AI_FEATURES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Provider Filter */}
          <div className="relative">
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none focus:border-amber-500 transition-colors ${selectBg}`}
            >
              <option value="all">All Providers</option>
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none focus:border-amber-500 transition-colors ${selectBg}`}
            >
              <option value="all">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed / Error</option>
            </select>
          </div>

          {/* Clear Filters */}
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={onClearFilters}
            className="text-slate-500"
          >
            Clear Filters
          </Button>

          {/* Export CSV Button */}
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={onExportCsv}
            className="ml-auto"
          >
            Export Filtered CSV
          </Button>
        </div>
      </div>

      {/* Table Body */}
      <div className="mt-4 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead>
            <tr
              className={`border-b border-slate-200 dark:border-[#30363D] text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider select-none ${tableHeaderBg}`}
            >
              <th
                onClick={() => onSort("actorName")}
                className="py-3 px-3 first:pl-4 cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Actor {renderSortIndicator("actorName")}
              </th>
              <th
                onClick={() => onSort("feature")}
                className="py-3 px-3 cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Feature {renderSortIndicator("feature")}
              </th>
              <th
                onClick={() => onSort("model")}
                className="py-3 px-3 cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Provider / Model {renderSortIndicator("model")}
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
                onClick={() => onSort("estimatedCost")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Est. Cost {renderSortIndicator("estimatedCost")}
              </th>
              <th
                onClick={() => onSort("latencyMs")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Latency {renderSortIndicator("latencyMs")}
              </th>
              <th
                onClick={() => onSort("timestamp")}
                className="py-3 px-3 cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Date & Time {renderSortIndicator("timestamp")}
              </th>
              <th
                onClick={() => onSort("status")}
                className="py-3 px-3 text-center cursor-pointer hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Status {renderSortIndicator("status")}
              </th>
              <th className="py-3 px-3 last:pr-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-[#30363D]/60 font-medium">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="11" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-6 h-6 text-slate-400" />
                    <span className="text-sm font-semibold">No matching AI calls found</span>
                    <span className="text-xs">Try clearing filters or adjusting search criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onViewRequest(r)}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#1F242C] transition-colors cursor-pointer group"
                >
                  {/* Actor */}
                  <td className="py-3 px-3 first:pl-4">
                    <div className="flex items-center gap-2 min-w-0">
                      {r.actorAvatar ? (
                        <img
                          src={r.actorAvatar}
                          alt={r.actorName}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {(r.actorName || "AI").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div
                          className={`font-bold truncate ${
                            darkMode ? "text-slate-100" : "text-slate-900"
                          }`}
                        >
                          {r.actorName || "Unknown Actor"}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          {r.actorEmail || "no-email"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Feature */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                        darkMode
                          ? "bg-slate-800 border-slate-700 text-slate-300"
                          : "bg-slate-100 border-slate-200 text-slate-700"
                      }`}
                    >
                      {r.feature}
                    </span>
                  </td>

                  {/* Provider / Model */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-[10px] text-slate-400">{r.provider}:</span>
                      <span
                        className={`font-semibold ${
                          darkMode ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        {r.model}
                      </span>
                    </div>
                  </td>

                  {/* Input Tokens */}
                  <td className="py-3 px-3 text-right font-mono text-slate-500 dark:text-slate-400">
                    {Number(r.inputTokens || 0).toLocaleString()}
                  </td>

                  {/* Output Tokens */}
                  <td className="py-3 px-3 text-right font-mono text-slate-500 dark:text-slate-400">
                    {Number(r.outputTokens || 0).toLocaleString()}
                  </td>

                  {/* Total Tokens */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                    {Number(r.totalTokens || 0).toLocaleString()}
                  </td>

                  {/* Estimated Cost */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ${Number(r.estimatedCost || 0).toFixed(4)}
                  </td>

                  {/* Latency */}
                  <td className="py-3 px-3 text-right font-mono text-slate-500 dark:text-slate-400">
                    {r.latencyFormatted}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {r.formattedDate}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    <Badge
                      size="sm"
                      variant={r.status === "Success" ? "success" : "danger"}
                    >
                      {r.status}
                    </Badge>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 last:pr-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewRequest(r);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      title="Inspect request trace"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Page Size Control */}
      <div className="pt-4 border-t border-slate-500/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={`px-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none ${selectBg}`}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          className="border-0 p-0 bg-transparent dark:bg-transparent"
        />
      </div>
    </div>
  );
}
