import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { formatJoinedDate } from "../services/recruiterService";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "candidates", label: "Candidates" },
  { id: "interviews", label: "Interviews" },
  { id: "placements", label: "Placements" },
  { id: "activity", label: "Activity" },
];

export default function RecruiterDetailsDrawer({
  recruiter,
  isOpen,
  onClose,
  darkMode = false,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [prevRecruiterId, setPrevRecruiterId] = useState(recruiter?.id);

  if (recruiter?.id !== prevRecruiterId) {
    setPrevRecruiterId(recruiter?.id);
    setActiveTab("overview");
  }

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !recruiter) return null;

  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/90";
  const innerCard = darkMode ? "bg-[#0D1117]/60 border-[#30363D]/70" : "bg-slate-50 border-slate-200/80";
  const borderCol = darkMode ? "border-[#30363D]" : "border-slate-200";
  const textSub = darkMode ? "text-slate-400" : "text-slate-500";

  const joinedFormatted = formatJoinedDate(recruiter.joinedAt || recruiter.joinedDate);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div
          className={`w-screen max-w-xl sm:max-w-2xl border-l shadow-2xl flex flex-col justify-between transition-all animate-in slide-in-from-right duration-200 ${
            darkMode
              ? "bg-[#0D1117] border-[#30363D] text-slate-100"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          {/* 1. Header (Sticky & Stable) */}
          <div
            className={`p-5 sm:p-6 border-b flex items-start justify-between gap-4 sticky top-0 z-10 ${
              darkMode ? "bg-[#161B22]/95 border-[#30363D]" : "bg-white/95 border-slate-200"
            } backdrop-blur-md`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={recruiter.avatar}
                alt={recruiter.name}
                className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-500/20 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-extrabold truncate">
                    {recruiter.name}
                  </h3>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#21262D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#30363D]">
                    {recruiter.employeeId}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      recruiter.status === "Active"
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40"
                    }`}
                  >
                    {recruiter.status}
                  </span>
                </div>
                <p className={`text-xs ${textSub} truncate mt-0.5`}>
                  {recruiter.role} • {recruiter.department}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors cursor-pointer shrink-0 ${
                darkMode ? "hover:bg-[#21262D]" : "hover:bg-slate-100"
              }`}
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Profile Information Strip (Calm, structured metadata) */}
          <div
            className={`px-5 sm:px-6 py-3.5 border-b text-xs grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 ${
              darkMode ? "bg-[#161B22]/40 border-[#30363D]" : "bg-slate-50/70 border-slate-200/70"
            }`}
          >
            <div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${textSub} block`}>
                Work Email
              </span>
              <span className="font-mono font-medium truncate block select-all">
                {recruiter.email}
              </span>
            </div>

            <div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${textSub} block`}>
                Phone
              </span>
              <span className="font-mono font-medium truncate block">
                {recruiter.phone || "--"}
              </span>
            </div>

            <div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${textSub} block`}>
                Date Joined
              </span>
              <span className="font-mono font-medium block">
                {joinedFormatted}
              </span>
            </div>

            <div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${textSub} block`}>
                Department
              </span>
              <span className="font-medium truncate block">
                {recruiter.department}
              </span>
            </div>

            <div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${textSub} block`}>
                Employment Type
              </span>
              <span className="font-medium block">
                {recruiter.employmentType || "Full-Time"}
              </span>
            </div>

            <div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${textSub} block`}>
                Reporting Manager
              </span>
              <span className="font-medium truncate block">
                {recruiter.reportingManager || "Sarah Jenkins"}
              </span>
            </div>
          </div>

          {/* 3. Navigation Tabs */}
          <div className={`px-5 sm:px-6 border-b flex items-center gap-2 overflow-x-auto custom-scrollbar ${borderCol}`}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px cursor-pointer ${
                    isActive
                      ? "border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold"
                      : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 4. Tab Body Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar text-xs">
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* 4 Neutral KPI Cards */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Operational Metrics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className={`p-3.5 rounded-2xl border ${innerCard}`}>
                      <span className={`text-[11px] font-medium ${textSub} block mb-1`}>
                        Candidates Assigned
                      </span>
                      <div className="text-2xl font-mono font-extrabold tabular-nums text-slate-900 dark:text-white">
                        {recruiter.candidatesAssigned}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Active pool</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl border ${innerCard}`}>
                      <span className={`text-[11px] font-medium ${textSub} block mb-1`}>
                        Interviews Conducted
                      </span>
                      <div className="text-2xl font-mono font-extrabold tabular-nums text-slate-900 dark:text-white">
                        {recruiter.interviewsConducted}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Completed</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl border ${innerCard}`}>
                      <span className={`text-[11px] font-medium ${textSub} block mb-1`}>
                        Placements
                      </span>
                      <div className="text-2xl font-mono font-extrabold tabular-nums text-amber-600 dark:text-amber-400">
                        {recruiter.successfulPlacements}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Confirmed hires</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl border ${innerCard}`}>
                      <span className={`text-[11px] font-medium ${textSub} block mb-1`}>
                        Placement Rate
                      </span>
                      <div className="text-2xl font-mono font-extrabold tabular-nums text-amber-600 dark:text-amber-400">
                        {recruiter.placementRate}%
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Conversion</span>
                    </div>
                  </div>
                </div>

                {/* Performance vs Target Section */}
                <div className={`p-4.5 rounded-2xl border ${innerCard} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-xs">Performance vs Benchmark</h5>
                    <span className="font-mono text-[11px] text-slate-400">Q4 Targets</span>
                  </div>

                  {/* Benchmark 1: Placement Rate */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Placement Conversion Rate</span>
                      <span className="font-mono font-bold">
                        {recruiter.placementRate}% / 35% target
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-[#21262D] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${Math.min((recruiter.placementRate / 35) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Benchmark 2: Time to Hire */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Avg Time to Hire</span>
                      <span className="font-mono font-bold">
                        {recruiter.avgTimeToHireDays || 22} days / 25 days SLA
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-[#21262D] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${Math.min(
                            ((25 - Math.min(recruiter.avgTimeToHireDays || 22, 25)) / 25) * 100 + 40,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Benchmark 3: Open Requisition Capacity */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Requisitions Managed</span>
                      <span className="font-mono font-bold">
                        {recruiter.activeRequisitions} active requisitions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Section */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recent Activity
                  </h4>

                  <div className={`divide-y rounded-2xl border overflow-hidden ${cardBg} ${borderCol}`}>
                    {recruiter.activities?.length > 0 ? (
                      recruiter.activities.map((act) => (
                        <div key={act.id} className="p-3.5 flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-xs">{act.title}</span>
                              <span className="font-mono text-[10px] text-slate-400 shrink-0">
                                {act.timestamp}
                              </span>
                            </div>
                            <p className={`text-[11px] ${textSub} mt-0.5 leading-relaxed`}>
                              {act.description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No recent activity logged for this recruiter.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CANDIDATES */}
            {activeTab === "candidates" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Assigned Candidate Pipeline ({recruiter.assignedCandidates?.length || 0})
                  </h4>
                </div>

                <div className={`divide-y rounded-2xl border overflow-hidden ${cardBg} ${borderCol}`}>
                  {recruiter.assignedCandidates?.length > 0 ? (
                    recruiter.assignedCandidates.map((c) => (
                      <div key={c.id} className="p-3.5 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{c.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {c.email}
                            </span>
                          </div>
                          <span className={`text-[11px] ${textSub} block mt-0.5`}>
                            {c.role}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {c.stage}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            {c.date}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No candidates currently assigned to this recruiter.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: INTERVIEWS */}
            {activeTab === "interviews" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Interview Sessions ({recruiter.interviews?.length || 0})
                  </h4>
                </div>

                <div className={`divide-y rounded-2xl border overflow-hidden ${cardBg} ${borderCol}`}>
                  {recruiter.interviews?.length > 0 ? (
                    recruiter.interviews.map((intv) => (
                      <div key={intv.id} className="p-3.5 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs">{intv.candidateName}</div>
                          <div className={`text-[11px] ${textSub} mt-0.5`}>
                            {intv.type} • {intv.duration}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              intv.outcome === "Passed"
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200"
                                : "bg-slate-100 dark:bg-[#21262D] text-slate-600 dark:text-slate-300 border border-slate-200"
                            }`}
                          >
                            {intv.outcome}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            {intv.date}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No interview logs found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: PLACEMENTS */}
            {activeTab === "placements" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Confirmed Placements ({recruiter.placements?.length || 0})
                  </h4>
                </div>

                <div className={`divide-y rounded-2xl border overflow-hidden ${cardBg} ${borderCol}`}>
                  {recruiter.placements?.length > 0 ? (
                    recruiter.placements.map((plc) => (
                      <div key={plc.id} className="p-3.5 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs">{plc.candidateName}</div>
                          <div className={`text-[11px] ${textSub} mt-0.5`}>
                            {plc.role} at <strong className="text-slate-800 dark:text-slate-200">{plc.company}</strong>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-extrabold text-xs text-amber-600 dark:text-amber-400 block">
                            {plc.baseSalary}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            {plc.placementDate}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No completed placements logged yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: ACTIVITY */}
            {activeTab === "activity" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Audit Activity Feed
                  </h4>
                </div>

                <div className={`divide-y rounded-2xl border overflow-hidden ${cardBg} ${borderCol}`}>
                  {recruiter.activities?.length > 0 ? (
                    recruiter.activities.map((act) => (
                      <div key={act.id} className="p-3.5 flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs">{act.title}</span>
                            <span className="font-mono text-[10px] text-slate-400 shrink-0">
                              {act.timestamp}
                            </span>
                          </div>
                          <p className={`text-[11px] ${textSub} mt-0.5`}>
                            {act.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No audit events recorded.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 5. Footer Actions (Sticky) */}
          <div
            className={`p-4 border-t flex items-center justify-between sticky bottom-0 z-10 ${
              darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-slate-50 border-slate-200"
            }`}
          >
            <span className="text-[11px] font-mono text-slate-400">
              Employee ID: {recruiter.employeeId}
            </span>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                darkMode ? "bg-[#21262D] text-white hover:bg-[#30363D]" : "bg-slate-200 text-slate-800 hover:bg-slate-300"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
