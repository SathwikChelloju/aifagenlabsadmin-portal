import React from "react";
import { Building2, ArrowRight, CheckCircle } from "lucide-react";

export default function DepartmentOverviewCard({
  departments = [],
  onNavigate,
  darkMode = false,
}) {
  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const itemBorder = darkMode ? "border-[#30363D]" : "border-slate-100";
  const itemHover = darkMode ? "hover:bg-[#1C2128]" : "hover:bg-slate-50/70";

  return (
    <div
      className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className={`text-base font-extrabold ${headingText}`}>
                Department-wise Overview
              </h3>
              <p className={`text-[11px] ${subText}`}>
                Caseload & placements by division
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate("recruiters")}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                darkMode
                  ? "bg-[#0D1117] border-[#30363D] text-slate-300 hover:text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Roster</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Compact Department Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[9px] font-bold uppercase tracking-wider ${itemBorder} ${subText}`}>
                <th className="py-1.5 pr-2">Division</th>
                <th className="py-1.5 px-2 text-center">Team</th>
                <th className="py-1.5 px-2 text-center">Cases</th>
                <th className="py-1.5 pl-2 text-right">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {departments.map((dept) => (
                <tr
                  key={dept.name}
                  className={`text-xs transition-colors ${itemHover} ${itemBorder}`}
                >
                  <td className="py-2 pr-2 font-medium">
                    <span className={`block font-semibold truncate max-w-[120px] ${headingText}`}>
                      {dept.name}
                    </span>
                  </td>
                  <td className={`py-2 px-2 text-center font-mono ${subText}`}>
                    {dept.recruitersCount}
                  </td>
                  <td className={`py-2 px-2 text-center font-mono ${subText}`}>
                    {dept.candidatesAssigned}
                  </td>
                  <td className="py-2 pl-2 text-right">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-2.5 h-2.5 shrink-0" />
                      {dept.placements}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between ${itemBorder} ${subText}`}>
        <span>6 Operational Divisions</span>
        <span className="font-mono font-semibold">
          {departments.reduce((acc, d) => acc + d.placements, 0)} Total Placements
        </span>
      </div>
    </div>
  );
}
