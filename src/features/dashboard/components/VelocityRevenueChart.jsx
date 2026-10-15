import React, { useState } from "react";

export default function VelocityRevenueChart({ cohortData, darkMode }) {
  const [hoveredBarIndex, setHoveredBarIndex] = useState(cohortData.length - 1);
  const activeBar =
    cohortData[hoveredBarIndex] || cohortData[cohortData.length - 1];

  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div
      className={`border rounded-3xl p-7 shadow-xs flex flex-col justify-between relative overflow-hidden transition-colors h-full ${cardBg}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-500/10">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-extrabold uppercase tracking-wider mb-1">
            Daily Velocity
          </div>
          <h3 className={`text-base font-extrabold ${headingText}`}>
            Signups & Intake Revenue Flow
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            Candidate registrations (Upward Navy) vs Collected revenue (Downward
            Amber)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F172A]" />
            <span className={subText}>Signups</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
            <span className={subText}>Revenue</span>
          </div>
        </div>
      </div>

      <div className="my-5 relative">
        <div className="h-56 w-full flex items-center relative">
          <div
            className={`absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] font-mono pointer-events-none z-10 ${subText}`}
          >
            <span>+80</span>
            <span>+40</span>
            <span className="font-bold text-slate-500">0</span>
            <span>-$8k</span>
            <span>-$16k</span>
          </div>

          <div className="ml-9 w-full h-full relative">
            <svg
              viewBox="0 0 540 220"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="oxfordNavyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F172A" />
                  <stop offset="70%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <linearGradient
                  id="oxfordAmberGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
              </defs>

              <line
                x1="0"
                y1="25"
                x2="540"
                y2="25"
                stroke={darkMode ? "#30363D" : "#F1F5F9"}
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="65"
                x2="540"
                y2="65"
                stroke={darkMode ? "#30363D" : "#F1F5F9"}
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="110"
                x2="540"
                y2="110"
                stroke={darkMode ? "#30363D" : "#CBD5E1"}
                strokeWidth="1.5"
              />
              <line
                x1="0"
                y1="155"
                x2="540"
                y2="155"
                stroke={darkMode ? "#30363D" : "#F1F5F9"}
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="195"
                x2="540"
                y2="195"
                stroke={darkMode ? "#30363D" : "#F1F5F9"}
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {cohortData.map((item, idx) => {
                const colWidth = 26;
                const colX = 18 + idx * 52;
                const signupH = Math.max(12, (item.signups / 90) * 85);
                const revenueH = Math.max(12, (item.revenue / 18000) * 85);
                const isHovered = hoveredBarIndex === idx;

                return (
                  <g
                    key={idx}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                  >
                    <rect
                      x={colX}
                      y={110 - signupH - 4}
                      width={colWidth}
                      height={signupH}
                      rx={colWidth / 2}
                      fill="url(#oxfordNavyGrad)"
                      opacity={isHovered ? 1 : 0.85}
                    />
                    <rect
                      x={colX}
                      y={110 + 4}
                      width={colWidth}
                      height={revenueH}
                      rx={colWidth / 2}
                      fill="url(#oxfordAmberGrad)"
                      opacity={isHovered ? 1 : 0.85}
                    />
                    <rect
                      x={colX - 10}
                      y={0}
                      width={colWidth + 20}
                      height={220}
                      fill="transparent"
                    />
                  </g>
                );
              })}
            </svg>

            {activeBar && (
              <div
                style={{
                  left: `${Math.min(Math.max(((hoveredBarIndex * 52 + 30) / 540) * 100, 18), 82)}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                className={`absolute p-3.5 rounded-2xl shadow-xl pointer-events-none z-30 min-w-[170px] border transition-colors ${
                  darkMode
                    ? "bg-[#0D1117] border-[#30363D] text-white"
                    : "bg-white/95 backdrop-blur-md border-slate-200 text-slate-900"
                }`}
              >
                <div className="text-[11px] font-bold border-b border-slate-500/20 pb-1.5 mb-2">
                  {activeBar.date}
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex items-center gap-1.5 font-medium ${subText}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#0F172A]" />
                      Signups
                    </span>
                    <span className="font-mono font-bold text-[#0F172A] dark:text-blue-400">
                      +{activeBar.signups} students
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex items-center gap-1.5 font-medium ${subText}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                      Revenue
                    </span>
                    <span className="font-mono font-bold text-[#D97706]">
                      ${activeBar.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`flex justify-between items-center text-[10px] font-mono mt-2 pl-9 pr-2 ${subText}`}
        >
          {cohortData.map((d, i) => (
            <span
              key={i}
              className={
                hoveredBarIndex === i
                  ? "text-[#0F172A] dark:text-white font-bold"
                  : ""
              }
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-500/10 flex items-center justify-between text-xs">
        <span className={subText}>
          Active Cycle Selected:{" "}
          <strong className={headingText}>{activeBar.date}</strong>
        </span>
        <div className="flex items-center gap-3 font-mono font-semibold">
          <span className="text-[#0F172A] dark:text-white">
            +{activeBar.signups} Signups
          </span>
          <span className="text-[#D97706]">
            ${activeBar.revenue.toLocaleString()} Intake
          </span>
        </div>
      </div>
    </div>
  );
}
