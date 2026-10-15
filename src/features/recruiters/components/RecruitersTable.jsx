import React from "react";
import { ArrowUpDown, ChevronRight, Star } from "lucide-react";
import { formatJoinedDate } from "../services/recruiterService";

export default function RecruitersTable({
  recruiters = [],
  onSelectRecruiter,
  sortField,
  sortDirection,
  onSort,
  darkMode = false,
}) {
  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/90";
  const headerBg = darkMode ? "bg-[#0D1117]/60 text-slate-400" : "bg-slate-50/70 text-slate-500";
  const rowHover = darkMode ? "hover:bg-[#1C2128]" : "hover:bg-slate-50/80";
  const borderCol = darkMode ? "border-[#30363D]/60" : "border-slate-100";

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 ml-1 inline opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return (
      <span className="text-amber-500 font-extrabold ml-1">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className={`border rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs ${cardBg}`}>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${headerBg} ${borderCol}`}>
              <th className="py-3.5 px-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => onSort("name")}
                  className="group flex items-center cursor-pointer"
                >
                  <span>Recruiter</span>
                  {renderSortIndicator("name")}
                </button>
              </th>
              <th className="py-3.5 px-4">
                <button
                  type="button"
                  onClick={() => onSort("department")}
                  className="group flex items-center cursor-pointer"
                >
                  <span>Department & Role</span>
                  {renderSortIndicator("department")}
                </button>
              </th>
              <th className="py-3.5 px-3">
                <button
                  type="button"
                  onClick={() => onSort("joinedAt")}
                  className="group flex items-center cursor-pointer"
                >
                  <span>Joined Date</span>
                  {renderSortIndicator("joinedAt")}
                </button>
              </th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3 text-right">
                <button
                  type="button"
                  onClick={() => onSort("candidatesAssigned")}
                  className="group inline-flex items-center cursor-pointer"
                >
                  <span>Assigned</span>
                  {renderSortIndicator("candidatesAssigned")}
                </button>
              </th>
              <th className="py-3.5 px-3 text-right">
                <button
                  type="button"
                  onClick={() => onSort("interviewsConducted")}
                  className="group inline-flex items-center cursor-pointer"
                >
                  <span>Interviews</span>
                  {renderSortIndicator("interviewsConducted")}
                </button>
              </th>
              <th className="py-3.5 px-3 text-right">
                <button
                  type="button"
                  onClick={() => onSort("successfulPlacements")}
                  className="group inline-flex items-center cursor-pointer"
                >
                  <span>Placements</span>
                  {renderSortIndicator("successfulPlacements")}
                </button>
              </th>
              <th className="py-3.5 px-4 min-w-[150px]">
                <button
                  type="button"
                  onClick={() => onSort("placementRate")}
                  className="group flex items-center cursor-pointer"
                >
                  <span>Placement Rate</span>
                  {renderSortIndicator("placementRate")}
                </button>
              </th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${borderCol}`}>
            {recruiters.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  No recruiters match your search and filter criteria.
                </td>
              </tr>
            ) : (
              recruiters.map((recruiter) => (
                <tr
                  key={recruiter.id}
                  onClick={() => onSelectRecruiter(recruiter)}
                  className={`transition-colors cursor-pointer ${rowHover}`}
                >
                  {/* Recruiter Avatar & Info */}
                  <td className="py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={recruiter.avatar}
                        alt={recruiter.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-500/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold truncate ${darkMode ? "text-white" : "text-slate-900"}`}>
                            {recruiter.name}
                          </span>
                          <span className="flex items-center text-[10px] text-amber-500 font-mono font-bold">
                            <Star className="w-2.5 h-2.5 fill-amber-500 mr-0.5" />
                            {recruiter.rating}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate font-mono">
                          {recruiter.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Department & Role */}
                  <td className="py-3 px-4">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {recruiter.department}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {recruiter.role}
                    </div>
                  </td>

                  {/* Joined Date */}
                  <td className="py-3 px-3">
                    <span className="font-mono text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {formatJoinedDate(recruiter.joinedAt)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        recruiter.status === "Active"
                          ? darkMode
                            ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : darkMode
                          ? "bg-amber-950/40 text-amber-300 border border-amber-800/40"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {recruiter.status}
                    </span>
                  </td>

                  {/* Candidates Assigned */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-blue-500">
                    {recruiter.candidatesAssigned}
                  </td>

                  {/* Interviews Conducted */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-500">
                    {recruiter.interviewsConducted}
                  </td>

                  {/* Successful Placements */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                    {recruiter.successfulPlacements}
                  </td>

                  {/* Placement Rate Bar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-[#21262D] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600"
                          style={{ width: `${Math.min(recruiter.placementRate, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-9 text-right shrink-0">
                        {recruiter.placementRate}%
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRecruiter(recruiter);
                      }}
                      className={`p-1.5 rounded-xl transition-colors ${
                        darkMode
                          ? "text-slate-400 hover:text-white hover:bg-[#21262D]"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                      title="View Recruiter Profile"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
