import React from "react";
import { Users, Calendar, CheckCircle2, Award } from "lucide-react";

export default function RecruitersStats({ recruiters = [], darkMode = false }) {
  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  const totalRecruiters = recruiters.length;
  const activeRecruiters = recruiters.filter((r) => r.status === "Active").length;
  const onLeaveRecruiters = recruiters.filter((r) => r.status === "On Leave").length;
  const totalAssigned = recruiters.reduce((sum, r) => sum + (r.candidatesAssigned || 0), 0);
  const totalInterviews = recruiters.reduce((sum, r) => sum + (r.interviewsConducted || 0), 0);
  const totalPlacements = recruiters.reduce((sum, r) => sum + (r.successfulPlacements || 0), 0);
  const avgPlacementRate =
    totalInterviews > 0 ? Math.round((totalPlacements / totalInterviews) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Total Talent Partners */}
      <div
        className={`border rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-colors flex flex-col justify-between h-full ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Total Recruiters
          </span>
          <div
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              darkMode
                ? "bg-[#21262D] border-[#30363D] text-slate-400"
                : "bg-slate-100 border-slate-200/60 text-slate-600"
            }`}
          >
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-3xl sm:text-[2.15rem] leading-none font-extrabold font-mono tracking-[-0.04em] ${headingText}`}
        >
          {totalRecruiters}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-xs font-medium">
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded-lg border text-[11px] ${
              darkMode
                ? "bg-emerald-950/30 text-emerald-300 border-emerald-800/40"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
            }`}
          >
            {activeRecruiters} Active
          </span>
          <span className={subText}>{onLeaveRecruiters} on leave</span>
        </div>
      </div>

      {/* 2. Candidates Assigned */}
      <div
        className={`border rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-colors flex flex-col justify-between h-full ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Candidates Assigned
          </span>
          <div
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              darkMode
                ? "bg-blue-950/30 border-blue-900/40 text-blue-400"
                : "bg-blue-50 border-blue-100 text-blue-600"
            }`}
          >
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-3xl sm:text-[2.15rem] leading-none font-extrabold font-mono tracking-[-0.04em] ${headingText}`}
        >
          {totalAssigned.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-xs font-medium">
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded-lg border text-[11px] ${
              darkMode
                ? "bg-[#21262D] text-slate-300 border-[#30363D]"
                : "bg-slate-100 text-slate-700 border-slate-200/80"
            }`}
          >
            {totalRecruiters > 0 ? Math.round(totalAssigned / totalRecruiters) : 0} avg / recruiter
          </span>
          <span className={subText}>active caseload</span>
        </div>
      </div>

      {/* 3. Interviews Conducted */}
      <div
        className={`border rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-colors flex flex-col justify-between h-full ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Interviews Conducted
          </span>
          <div
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              darkMode
                ? "bg-emerald-950/30 border-emerald-900/40 text-emerald-400"
                : "bg-emerald-50 border-emerald-100 text-emerald-600"
            }`}
          >
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-3xl sm:text-[2.15rem] leading-none font-extrabold font-mono tracking-[-0.04em] ${headingText}`}
        >
          {totalInterviews.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-xs font-medium">
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded-lg border text-[11px] ${
              darkMode
                ? "bg-emerald-950/30 text-emerald-300 border-emerald-800/40"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
            }`}
          >
            +18.2%
          </span>
          <span className={subText}>vs last 30d</span>
        </div>
      </div>

      {/* 4. Successful Placements */}
      <div
        className={`border rounded-2xl sm:rounded-[22px] p-4.5 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-colors flex flex-col justify-between h-full ${cardBg}`}
      >
        <div className="flex items-center justify-between text-slate-400 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Successful Placements
          </span>
          <div
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              darkMode
                ? "bg-amber-950/30 border-amber-900/40 text-amber-400"
                : "bg-amber-50 border-amber-100 text-amber-600"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-3xl sm:text-[2.15rem] leading-none font-extrabold font-mono tracking-[-0.04em] ${headingText}`}
        >
          {totalPlacements.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-xs font-medium">
          <span
            className={`font-bold font-mono px-2 py-0.5 rounded-lg border text-[11px] ${
              darkMode
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                : "bg-amber-50 text-amber-800 border-amber-200/80"
            }`}
          >
            {avgPlacementRate}% Placement Rate
          </span>
          <span className={subText}>global average</span>
        </div>
      </div>
    </div>
  );
}
