import React from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Globe,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import UserActionsMenu from "./UserActionsMenu";
import {
  formatTokens,
  getUserInitials,
  formatJoinedDate,
} from "../utils/userUtils";

/**
 * UsersTable Component
 * Production-quality table strictly conditioned on portal light/dark theme.
 */
export default function UsersTable({
  users = [],
  loading = false,
  sortField = "name",
  sortDirection = "asc",
  onSort,
  currentPage = 1,
  totalCount = 0,
  pageSize = 8,
  onPageChange,
  onViewDetails,
  onChangePlan,
  onToggleStatus,
  onClearFilters,
  isFiltered = false,
  darkMode = false,
}) {
  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D] text-white"
    : "bg-white border-slate-200/90 text-slate-900";

  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const tableHeader = darkMode
    ? "bg-[#0D1117] text-slate-400 border-[#30363D]"
    : "bg-slate-50/70 text-slate-500 border-slate-200";
  const tableRowHover = darkMode
    ? "hover:bg-[#1F242C] border-[#30363D]/60"
    : "hover:bg-slate-50/80 border-slate-100";
  const dividerColor = darkMode ? "divide-[#30363D]/60" : "divide-slate-100";
  const footerBg = darkMode
    ? "bg-[#0D1117]/60 border-[#30363D]/60 text-slate-400"
    : "bg-slate-50/60 border-slate-100 text-slate-500";

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-40 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#D97706]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#D97706]" />
    );
  };

  const renderSortableHeader = (field, label, align = "left") => (
    <th
      className={`py-3.5 px-4 first:pl-6 last:pr-6 select-none cursor-pointer group transition-colors ${
        darkMode ? "hover:text-white" : "hover:text-slate-900"
      } ${
        align === "right"
          ? "text-right"
          : align === "center"
          ? "text-center"
          : "text-left"
      }`}
      onClick={() => onSort && onSort(field)}
    >
      <div
        className={`inline-flex items-center gap-1.5 ${
          align === "right"
            ? "justify-end"
            : align === "center"
            ? "justify-center"
            : "justify-start"
        }`}
      >
        <span>{label}</span>
        {getSortIcon(field)}
      </div>
    </th>
  );

  const renderPlanBadge = (plan) => {
    if (plan === "Premium") {
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
            darkMode
              ? "bg-[#1E293B] text-slate-100 border border-slate-700"
              : "bg-[#0B192C] text-white"
          }`}
        >
          Premium
        </span>
      );
    }
    if (plan === "Basic") {
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
            darkMode
              ? "bg-slate-800 text-slate-300 border border-slate-700"
              : "bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          Basic
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
          darkMode
            ? "bg-slate-800/60 text-slate-400 border border-slate-700/60"
            : "bg-slate-100 text-slate-500 border border-slate-200"
        }`}
      >
        {plan || "None"}
      </span>
    );
  };

  const renderStatusBadge = (status) => {
    if (status === "Active") {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
            darkMode
              ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/60"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      );
    }
    if (status === "Past Due") {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
            darkMode
              ? "bg-amber-950/40 text-amber-300 border border-amber-800/60"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Past Due
        </span>
      );
    }
    if (status === "Suspended") {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
            darkMode
              ? "bg-rose-950/40 text-rose-300 border border-rose-800/60"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Suspended
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
          darkMode
            ? "bg-slate-800 text-slate-400 border border-slate-700"
            : "bg-slate-100 text-slate-500 border border-slate-200"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        {status || "Inactive"}
      </span>
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div
      className={`border rounded-3xl overflow-hidden shadow-xs transition-colors ${cardBg}`}
    >
      <div className="overflow-x-auto min-h-[360px]">
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <span className="text-sm font-semibold text-slate-400 animate-pulse">
              Loading candidates...
            </span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <p className={`text-base font-bold ${headingText}`}>
              No candidates found
            </p>
            <p className={`text-xs mt-1 max-w-sm ${subText}`}>
              {isFiltered
                ? "Try adjusting your search criteria or resetting active filters."
                : "No users have registered in the portal directory yet."}
            </p>
            {isFiltered && (
              <button
                type="button"
                onClick={onClearFilters}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#0B192C] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                className={`border-b ${tableHeader} font-bold uppercase tracking-wider`}
              >
                {renderSortableHeader("name", "User")}
                {renderSortableHeader("email", "Email")}
                {renderSortableHeader("role", "Role")}
                {renderSortableHeader("plan", "Subscription Plan")}
                {renderSortableHeader("status", "Status")}
                {renderSortableHeader("aiUsageTokens", "AI Usage")}
                {renderSortableHeader("joinedAt", "Joined Date")}
                <th className="py-3.5 px-6 text-right font-bold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y ${dividerColor} text-sm`}>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`transition-colors ${tableRowHover}`}
                >
                  {/* User Profile */}
                  <td className="py-3 px-4 pl-6">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-500/20 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {getUserInitials(user.name)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onViewDetails && onViewDetails(user)}
                          className={`font-bold text-sm leading-tight text-left block truncate cursor-pointer transition-colors ${headingText} hover:text-[#D97706]`}
                        >
                          {user.name}
                        </button>
                        {user.countryGoal && (
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-medium">
                            <Globe className="w-2.5 h-2.5 text-slate-400" />
                            {user.countryGoal}{" "}
                            {user.visaTrack ? `· ${user.visaTrack}` : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4">
                    <span className={`font-mono text-xs ${subText}`}>
                      {user.email}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {user.role || "Candidate"}
                    </span>
                  </td>

                  {/* Plan Badge */}
                  <td className="py-3 px-4">
                    {renderPlanBadge(user.plan)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    {renderStatusBadge(user.status)}
                  </td>

                  {/* AI Tokens */}
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono text-xs font-bold ${
                        darkMode ? "text-slate-200" : "text-slate-900"
                      }`}
                    >
                      {formatTokens(user.aiUsageTokens)}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-3 px-4">
                    <span className={`font-mono text-xs ${subText}`}>
                      {formatJoinedDate(user.joinedAt)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-6 text-right">
                    <UserActionsMenu
                      user={user}
                      onViewDetails={onViewDetails}
                      onChangePlan={onChangePlan}
                      onToggleStatus={onToggleStatus}
                      darkMode={darkMode}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && users.length > 0 && (
        <div
          className={`px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t ${footerBg}`}
        >
          <div className="font-mono">
            Showing{" "}
            <strong className={headingText}>
              {(currentPage - 1) * pageSize + 1}
            </strong>{" "}
            to{" "}
            <strong className={headingText}>
              {Math.min(totalCount, currentPage * pageSize)}
            </strong>{" "}
            of <strong className={headingText}>{totalCount}</strong> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                darkMode
                  ? "bg-[#161B22] border-[#30363D] text-slate-200 hover:bg-[#21262D]"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            <span className={`font-mono font-bold px-2 ${headingText}`}>
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                darkMode
                  ? "bg-[#161B22] border-[#30363D] text-slate-200 hover:bg-[#21262D]"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
              }`}
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
