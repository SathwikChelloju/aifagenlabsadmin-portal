// import React, { useState } from "react";

// import {
//   Users,
//   CreditCard,
//   Briefcase,
//   TrendingUp,
//   AlertTriangle,
//   CheckCircle2,
//   Calendar,
//   ArrowUpRight,
//   RefreshCw,
//   ChevronRight,
//   ShieldCheck,
//   Zap,
//   X,
//   Globe,
//   PieChart as PieIcon,
//   Layers,
//   DollarSign,
//   Cpu,
// } from "lucide-react";

// const COHORT_30D_DATA = [
//   { label: "W1-D1", signups: 18, revenue: 3200, date: "Sep 10, 2026" },

//   { label: "W1-D4", signups: 26, revenue: 4800, date: "Sep 13, 2026" },

//   { label: "W2-D1", signups: 32, revenue: 5900, date: "Sep 17, 2026" },

//   { label: "W2-D4", signups: 44, revenue: 8400, date: "Sep 20, 2026" },

//   { label: "W3-D1", signups: 38, revenue: 7100, date: "Sep 24, 2026" },

//   { label: "W3-D4", signups: 58, revenue: 11200, date: "Sep 27, 2026" },

//   { label: "W4-D1", signups: 52, revenue: 9800, date: "Oct 01, 2026" },

//   { label: "W4-D4", signups: 68, revenue: 13400, date: "Oct 04, 2026" },

//   { label: "W5-D1", signups: 74, revenue: 14800, date: "Oct 07, 2026" },

//   { label: "Today", signups: 82, revenue: 16250, date: "Oct 10, 2026" },
// ];

// const INFOGRAPHIC_DATASETS = {
//   PLANS: {
//     title: "Candidate Membership Split",

//     description: "Volume of students enrolled in abroad placement tiers",

//     centerLabel: "TOTAL COHORT",

//     centerValue: "4,820",

//     centerSub: "Candidates",

//     segments: [
//       {
//         id: "premium",

//         label: "Premium Concierge",

//         value: 890,

//         formatted: "890 students",

//         pct: 18.5,

//         color: "#0B192C",
//       },

//       {
//         id: "basic",

//         label: "Basic Application",

//         value: 530,

//         formatted: "530 students",

//         pct: 11.0,

//         color: "#15803D",
//       },

//       {
//         id: "free",

//         label: "Unenrolled / Free",

//         value: 3400,

//         formatted: "3,400 students",

//         pct: 70.5,

//         color: "#CBD5E1",
//       },
//     ],
//   },

//   REVENUE: {
//     title: "Revenue Contribution by Tier",

//     description: "Gross billings generated per service tier this cycle",

//     centerLabel: "GROSS REVENUE",

//     centerValue: "$142,850",

//     centerSub: "+14.2% Growth",

//     segments: [
//       {
//         id: "premium_rev",

//         label: "Premium Tier ($149/mo)",

//         value: 119000,

//         formatted: "$119,000.00",

//         pct: 83.3,

//         color: "#0B192C",
//       },

//       {
//         id: "basic_rev",

//         label: "Basic Tier ($45/mo)",

//         value: 23850,

//         formatted: "$23,850.00",

//         pct: 16.7,

//         color: "#D97706",
//       },

//       {
//         id: "free_rev",

//         label: "Unenrolled (Zero-Tier)",

//         value: 0,

//         formatted: "$0.00",

//         pct: 0.0,

//         color: "#E2E8F0",
//       },
//     ],
//   },

//   REGIONS: {
//     title: "Abroad Placements by Destination",

//     description: "Geographic target markets for study & employment visas",

//     centerLabel: "GLOBAL VISAS",

//     centerValue: "4,820",

//     centerSub: "Worldwide Intake",

//     segments: [
//       {
//         id: "uk_eu",

//         label: "UK & European Union",

//         value: 2210,

//         formatted: "2,210 candidates",

//         pct: 45.8,

//         color: "#0B192C",
//       },

//       {
//         id: "us_ca",

//         label: "USA & Canada",

//         value: 1840,

//         formatted: "1,840 candidates",

//         pct: 38.2,

//         color: "#1D4ED8",
//       },

//       {
//         id: "apac",

//         label: "Australia, NZ & APAC",

//         value: 770,

//         formatted: "770 candidates",

//         pct: 16.0,

//         color: "#D97706",
//       },
//     ],
//   },

//   AI_QUOTAS: {
//     title: "AI Optimization Token Burn",

//     description: "LLM compute costs for resume ATS tuning & matching",

//     centerLabel: "COMPUTE SPEND",

//     centerValue: "4.82M",

//     centerSub: "$842.15 Total Cost",

//     segments: [
//       {
//         id: "ats_tailoring",

//         label: "Resume ATS Customization",

//         value: 2650000,

//         formatted: "2.65M tokens ($463.75)",

//         pct: 55.0,

//         color: "#0B192C",
//       },

//       {
//         id: "matching",

//         label: "Job Description Scoring",

//         value: 1440000,

//         formatted: "1.44M tokens ($252.00)",

//         pct: 30.0,

//         color: "#15803D",
//       },

//       {
//         id: "interviews",

//         label: "Mock Interview Copilot",

//         value: 730000,

//         formatted: "0.73M tokens ($126.40)",

//         pct: 15.0,

//         color: "#CBD5E1",
//       },
//     ],
//   },
// };

// const METRICS = {
//   totalUsers: 4820,

//   newUsers30d: 614,

//   payingUsers: 1420,

//   conversionRate: "29.4%",

//   revenueThisMonth: 142850.0,

//   activeJobs: 18450,

//   sourcesWorking: 14,

//   sourcesTotal: 16,
// };

// const EXPIRING_CANDIDATES = [
//   {
//     id: "usr_9104",

//     name: "Aarav Patel",

//     email: "aarav.p@outlook.com",

//     avatar:
//       "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",

//     countryGoal: "United Kingdom",

//     targetVisa: "Skilled Worker (Tier 2)",

//     domain: "DevOps",

//     plan: "Premium",

//     expiresInDays: 4,

//     atsScore: 94,

//     expiryDate: "Oct 13, 2026",
//   },

//   {
//     id: "usr_9182",

//     name: "Mei-Ling Zhou",

//     email: "meiling.z@gmail.com",

//     avatar:
//       "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",

//     countryGoal: "Germany",

//     targetVisa: "EU Blue Card",

//     domain: "Data Scientist",

//     plan: "Premium",

//     expiresInDays: 8,

//     atsScore: 88,

//     expiryDate: "Oct 17, 2026",
//   },

//   {
//     id: "usr_8821",

//     name: "Tariq Mansoor",

//     email: "t.mansoor@techmail.io",

//     avatar:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",

//     countryGoal: "United States",

//     targetVisa: "H-1B / STEM OPT",

//     domain: "Full Stack",

//     plan: "Basic",

//     expiresInDays: 12,

//     atsScore: 82,

//     expiryDate: "Oct 21, 2026",
//   },

//   {
//     id: "usr_9401",

//     name: "Elena Rostova",

//     email: "elena.rostova@yahoo.com",

//     avatar:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",

//     countryGoal: "Canada",

//     targetVisa: "Express Entry / PNP",

//     domain: "Quality Automation",

//     plan: "Premium",

//     expiresInDays: 19,

//     atsScore: 91,

//     expiryDate: "Oct 28, 2026",
//   },
// ];

// const JOB_SOURCES_STATUS = [
//   {
//     name: "LinkedIn Global Jobs",

//     status: "Working",

//     latency: "1.2s",

//     jobs24h: 420,
//   },

//   {
//     name: "Indeed Europe Enterprise",

//     status: "Working",

//     latency: "850ms",

//     jobs24h: 310,
//   },

//   {
//     name: "Greenhouse Partner Feeds",

//     status: "Attention",

//     latency: "5.4s",

//     jobs24h: 0,

//     note: "Cloudflare 403 Challenge",
//   },

//   {
//     name: "Lever Board Collector",

//     status: "Attention",

//     latency: "--",

//     jobs24h: 12,

//     note: "Worker Stalled (Retrying)",
//   },
// ];

// export default function Dashboard({ darkMode }) {
//   const [candidates, setCandidates] = useState(EXPIRING_CANDIDATES);

//   const [selectedCandidate, setSelectedCandidate] = useState(null);

//   const [showPlanModal, setShowPlanModal] = useState(false);

//   const [planForm, setPlanForm] = useState({ plan: "Premium", reason: "" });

//   const [hoveredBarIndex, setHoveredBarIndex] = useState(5);

//   const [infographicDimension, setInfographicDimension] = useState("REGIONS");

//   const [hoveredSegment, setHoveredSegment] = useState(null);

//   const handlePlanSave = (e) => {
//     e.preventDefault();

//     if (!planForm.reason.trim()) {
//       alert("A reason is mandatory for the Audit Log.");

//       return;
//     }

//     setCandidates((prev) =>
//       prev.map((c) =>
//         c.id === selectedCandidate.id ? { ...c, plan: planForm.plan } : c,
//       ),
//     );

//     setShowPlanModal(false);
//   };

//   const activeDataset = INFOGRAPHIC_DATASETS[infographicDimension];

//   const outerRadius = 80;

//   const outerCircumference = 2 * Math.PI * outerRadius;

//   let outerOffsetTracker = 0;

//   const innerRadius = 58;

//   const innerCircumference = 2 * Math.PI * innerRadius;

//   let innerOffsetTracker = 0;

//   const activeBar = COHORT_30D_DATA[hoveredBarIndex];

//   return (
//     <div className="p-8 space-y-6">
//       {/* 4 KPI Cards (Now placed directly at the top) */}

//       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-slate-300 transition-all">
//           <div className="flex items-center justify-between text-slate-400 mb-3">
//             <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
//               Total Candidates
//             </span>

//             <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
//               <Users className="w-4 h-4" />
//             </div>
//           </div>

//           <div className="text-3xl font-extrabold font-mono tracking-tight text-slate-900">
//             {METRICS.totalUsers.toLocaleString()}
//           </div>

//           <div className="flex items-center gap-1.5 mt-2.5 text-xs font-medium">
//             <span className="text-emerald-700 font-bold font-mono bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
//               +{METRICS.newUsers30d}
//             </span>

//             <span className="text-slate-500">registered past 30 days</span>
//           </div>
//         </div>

//         <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-slate-300 transition-all">
//           <div className="flex items-center justify-between text-slate-400 mb-3">
//             <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
//               Enrolled Subscriptions
//             </span>

//             <div className="p-2.5 rounded-xl bg-amber-50 text-[#D97706]">
//               <CreditCard className="w-4 h-4" />
//             </div>
//           </div>

//           <div className="text-3xl font-extrabold font-mono tracking-tight text-slate-900">
//             {METRICS.payingUsers.toLocaleString()}
//           </div>

//           <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-500 font-medium">
//             <span className="font-bold text-[#D97706] font-mono bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
//               {METRICS.conversionRate}
//             </span>

//             <span>funnel conversion rate</span>
//           </div>
//         </div>

//         <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-slate-300 transition-all">
//           <div className="flex items-center justify-between text-slate-400 mb-3">
//             <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
//               Monthly Revenue
//             </span>

//             <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
//               <TrendingUp className="w-4 h-4" />
//             </div>
//           </div>

//           <div className="text-3xl font-extrabold font-mono tracking-tight text-slate-900">
//             $
//             {METRICS.revenueThisMonth.toLocaleString("en-US", {
//               minimumFractionDigits: 2,
//             })}
//           </div>

//           <div className="flex items-center gap-1.5 mt-2.5 text-xs font-bold text-emerald-700">
//             <span className="font-mono bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
//               +14.2%
//             </span>

//             <span className="font-medium text-slate-500">vs target intake</span>
//           </div>
//         </div>

//         <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-slate-300 transition-all">
//           <div className="flex items-center justify-between text-slate-400 mb-3">
//             <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
//               Abroad Ingestion Health
//             </span>

//             <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
//               <Zap className="w-4 h-4" />
//             </div>
//           </div>

//           <div className="text-3xl font-extrabold font-mono tracking-tight text-slate-900">
//             {METRICS.activeJobs.toLocaleString()}
//           </div>

//           <div className="flex items-center gap-2 mt-2.5 text-xs font-mono font-medium">
//             <span className="text-amber-800 font-bold flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
//               <AlertTriangle className="w-3 h-3" /> 2 Attention
//             </span>

//             <span className="text-slate-400">
//               · {METRICS.sourcesWorking} live
//             </span>
//           </div>
//         </div>
//       </section>

//       {/* Bi-Directional Pill Chart + Concentric Infographic Wheel */}

//       <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//         {/* Chart 1: Bi-Directional Pill Chart */}

//         <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-7 shadow-xs flex flex-col justify-between relative overflow-hidden">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
//             <div>
//               <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold uppercase tracking-wider mb-1">
//                 Daily Velocity
//               </div>

//               <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
//                 Signups & Intake Revenue Flow
//               </h3>

//               <p className="text-xs text-slate-500 mt-0.5">
//                 Candidate registrations (Upward Navy) vs Collected revenue
//                 (Downward Amber)
//               </p>
//             </div>

//             <div className="flex items-center gap-3 text-xs font-semibold">
//               <div className="flex items-center gap-1.5">
//                 <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />

//                 <span className="text-slate-700">Signups</span>
//               </div>

//               <div className="flex items-center gap-1.5">
//                 <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />

//                 <span className="text-slate-700">Revenue</span>
//               </div>
//             </div>
//           </div>

//           <div className="my-5 relative">
//             <div className="h-56 w-full flex items-center relative">
//               <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] font-mono text-slate-400 pointer-events-none z-10">
//                 <span>+80</span>

//                 <span>+40</span>

//                 <span className="text-slate-900 font-bold">0</span>

//                 <span>-$8k</span>

//                 <span>-$16k</span>
//               </div>

//               <div className="ml-9 w-full h-full relative">
//                 <svg
//                   viewBox="0 0 540 220"
//                   preserveAspectRatio="none"
//                   className="w-full h-full overflow-visible"
//                 >
//                   <defs>
//                     <linearGradient
//                       id="oxfordNavyGrad"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop offset="0%" stopColor="#0F172A" />

//                       <stop offset="70%" stopColor="#1E293B" />

//                       <stop offset="100%" stopColor="#475569" />
//                     </linearGradient>

//                     <linearGradient
//                       id="oxfordAmberGrad"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop offset="0%" stopColor="#FDE68A" />

//                       <stop offset="50%" stopColor="#D97706" />

//                       <stop offset="100%" stopColor="#B45309" />
//                     </linearGradient>
//                   </defs>

//                   <line
//                     x1="0"
//                     y1="25"
//                     x2="540"
//                     y2="25"
//                     stroke="#F1F5F9"
//                     strokeWidth="1"
//                     strokeDasharray="3 3"
//                   />

//                   <line
//                     x1="0"
//                     y1="65"
//                     x2="540"
//                     y2="65"
//                     stroke="#F1F5F9"
//                     strokeWidth="1"
//                     strokeDasharray="3 3"
//                   />

//                   <line
//                     x1="0"
//                     y1="110"
//                     x2="540"
//                     y2="110"
//                     stroke="#CBD5E1"
//                     strokeWidth="1.5"
//                   />

//                   <line
//                     x1="0"
//                     y1="155"
//                     x2="540"
//                     y2="155"
//                     stroke="#F1F5F9"
//                     strokeWidth="1"
//                     strokeDasharray="3 3"
//                   />

//                   <line
//                     x1="0"
//                     y1="195"
//                     x2="540"
//                     y2="195"
//                     stroke="#F1F5F9"
//                     strokeWidth="1"
//                     strokeDasharray="3 3"
//                   />

//                   {COHORT_30D_DATA.map((item, idx) => {
//                     const colWidth = 26;

//                     const colX = 18 + idx * 52;

//                     const signupH = Math.max(12, (item.signups / 90) * 85);

//                     const revenueH = Math.max(12, (item.revenue / 18000) * 85);

//                     const isHovered = hoveredBarIndex === idx;

//                     return (
//                       <g
//                         key={idx}
//                         className="cursor-pointer transition-all duration-150"
//                         onMouseEnter={() => setHoveredBarIndex(idx)}
//                       >
//                         <rect
//                           x={colX}
//                           y={110 - signupH - 4}
//                           width={colWidth}
//                           height={signupH}
//                           rx={colWidth / 2}
//                           fill="url(#oxfordNavyGrad)"
//                           opacity={isHovered ? 1 : 0.85}
//                         />

//                         <rect
//                           x={colX}
//                           y={110 + 4}
//                           width={colWidth}
//                           height={revenueH}
//                           rx={colWidth / 2}
//                           fill="url(#oxfordAmberGrad)"
//                           opacity={isHovered ? 1 : 0.85}
//                         />

//                         <rect
//                           x={colX - 10}
//                           y={0}
//                           width={colWidth + 20}
//                           height={220}
//                           fill="transparent"
//                         />
//                       </g>
//                     );
//                   })}
//                 </svg>

//                 {activeBar && (
//                   <div
//                     style={{
//                       left: `${Math.min(Math.max(((hoveredBarIndex * 52 + 30) / 540) * 100, 18), 82)}%`,

//                       top: "50%",

//                       transform: "translate(-50%, -50%)",
//                     }}
//                     className="absolute bg-white/95 backdrop-blur-md border border-slate-200/90 p-3.5 rounded-2xl shadow-xl pointer-events-none z-30 min-w-[170px]"
//                   >
//                     <div className="text-[11px] font-bold text-slate-900 border-b border-slate-100 pb-1.5 mb-2">
//                       {activeBar.date}
//                     </div>

//                     <div className="space-y-1.5 text-xs">
//                       <div className="flex items-center justify-between">
//                         <span className="flex items-center gap-1.5 text-slate-600 font-medium">
//                           <span className="w-2 h-2 rounded-full bg-slate-900" />
//                           Signups
//                         </span>

//                         <span className="font-mono font-bold text-slate-900">
//                           +{activeBar.signups} students
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <span className="flex items-center gap-1.5 text-slate-600 font-medium">
//                           <span className="w-2 h-2 rounded-full bg-[#D97706]" />
//                           Revenue
//                         </span>

//                         <span className="font-mono font-bold text-[#D97706]">
//                           ${activeBar.revenue.toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2 pl-9 pr-2">
//               {COHORT_30D_DATA.map((d, i) => (
//                 <span
//                   key={i}
//                   className={
//                     hoveredBarIndex === i ? "text-slate-900 font-bold" : ""
//                   }
//                 >
//                   {d.label}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
//             <span className="text-slate-500">
//               Active Cycle Selected:{" "}
//               <strong className="text-slate-900 font-mono">
//                 {activeBar.date}
//               </strong>
//             </span>

//             <div className="flex items-center gap-3 font-mono font-semibold">
//               <span className="text-slate-900">
//                 +{activeBar.signups} Signups
//               </span>

//               <span className="text-[#D97706]">
//                 ${activeBar.revenue.toLocaleString()} Intake
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Chart 2: Concentric Infographic Wheel */}

//         <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-7 shadow-xs flex flex-col justify-between">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
//             <div>
//               <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold uppercase tracking-wider mb-1">
//                 Market Breakdown
//               </div>

//               <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
//                 <PieIcon className="w-4 h-4 text-[#D97706]" />

//                 {activeDataset.title}
//               </h3>

//               <p className="text-xs text-slate-500 mt-0.5">
//                 {activeDataset.description}
//               </p>
//             </div>

//             <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
//               <button
//                 onClick={() => {
//                   setInfographicDimension("PLANS");

//                   setHoveredSegment(null);
//                 }}
//                 className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
//                   infographicDimension === "PLANS"
//                     ? "bg-slate-900 text-white shadow-xs"
//                     : "text-slate-600 hover:text-slate-900"
//                 }`}
//               >
//                 <Layers className="w-3 h-3" />
//                 Plans
//               </button>

//               <button
//                 onClick={() => {
//                   setInfographicDimension("REVENUE");

//                   setHoveredSegment(null);
//                 }}
//                 className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
//                   infographicDimension === "REVENUE"
//                     ? "bg-slate-900 text-white shadow-xs"
//                     : "text-slate-600 hover:text-slate-900"
//                 }`}
//               >
//                 <DollarSign className="w-3 h-3" />
//                 Revenue
//               </button>

//               <button
//                 onClick={() => {
//                   setInfographicDimension("REGIONS");

//                   setHoveredSegment(null);
//                 }}
//                 className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
//                   infographicDimension === "REGIONS"
//                     ? "bg-slate-900 text-white shadow-xs"
//                     : "text-slate-600 hover:text-slate-900"
//                 }`}
//               >
//                 <Globe className="w-3 h-3" />
//                 Visas
//               </button>

//               <button
//                 onClick={() => {
//                   setInfographicDimension("AI_QUOTAS");

//                   setHoveredSegment(null);
//                 }}
//                 className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
//                   infographicDimension === "AI_QUOTAS"
//                     ? "bg-slate-900 text-white shadow-xs"
//                     : "text-slate-600 hover:text-slate-900"
//                 }`}
//               >
//                 <Cpu className="w-3 h-3" />
//                 AI Cost
//               </button>
//             </div>
//           </div>

//           <div className="my-5 flex flex-col sm:flex-row items-center justify-between gap-6">
//             <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
//               <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
//                 <circle
//                   cx="100"
//                   cy="100"
//                   r={outerRadius}
//                   fill="none"
//                   stroke="#F1F5F9"
//                   strokeWidth="15"
//                 />

//                 <circle
//                   cx="100"
//                   cy="100"
//                   r={innerRadius}
//                   fill="none"
//                   stroke="#F1F5F9"
//                   strokeWidth="8"
//                 />

//                 {activeDataset.segments.map((seg) => {
//                   const strokeDasharray = `${(seg.pct / 100) * outerCircumference} ${outerCircumference}`;

//                   const strokeDashoffset = -outerOffsetTracker;

//                   outerOffsetTracker += (seg.pct / 100) * outerCircumference;

//                   const isHovered = hoveredSegment?.id === seg.id;

//                   return (
//                     <circle
//                       key={`outer-${seg.id}`}
//                       cx="100"
//                       cy="100"
//                       r={outerRadius}
//                       fill="transparent"
//                       stroke={seg.color}
//                       strokeWidth={isHovered ? "18" : "15"}
//                       strokeDasharray={strokeDasharray}
//                       strokeDashoffset={strokeDashoffset}
//                       className="transition-all duration-200 cursor-pointer"
//                       onMouseEnter={() => setHoveredSegment(seg)}
//                       onMouseLeave={() => setHoveredSegment(null)}
//                     />
//                   );
//                 })}

//                 {activeDataset.segments.map((seg) => {
//                   const strokeDasharray = `${(seg.pct / 100) * innerCircumference} ${innerCircumference}`;

//                   const strokeDashoffset = -innerOffsetTracker;

//                   innerOffsetTracker += (seg.pct / 100) * innerCircumference;

//                   return (
//                     <circle
//                       key={`inner-${seg.id}`}
//                       cx="100"
//                       cy="100"
//                       r={innerRadius}
//                       fill="transparent"
//                       stroke={seg.color}
//                       strokeOpacity="0.4"
//                       strokeWidth="7"
//                       strokeDasharray={strokeDasharray}
//                       strokeDashoffset={strokeDashoffset}
//                       className="transition-all duration-200"
//                     />
//                   );
//                 })}
//               </svg>

//               <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-3">
//                 {hoveredSegment ? (
//                   <div className="animate-in fade-in zoom-in-95 duration-150">
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
//                       {hoveredSegment.label.split(" ")[0]}
//                     </span>

//                     <span className="text-xl font-bold font-mono tracking-tight text-slate-900 block leading-tight">
//                       {hoveredSegment.pct}%
//                     </span>

//                     <span className="text-[11px] font-semibold text-[#D97706] font-mono block">
//                       {hoveredSegment.formatted}
//                     </span>
//                   </div>
//                 ) : (
//                   <div>
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
//                       {activeDataset.centerLabel}
//                     </span>

//                     <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 block">
//                       {activeDataset.centerValue}
//                     </span>

//                     <span className="text-[10px] text-slate-500 font-medium block">
//                       {activeDataset.centerSub}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex-1 space-y-2 w-full">
//               {activeDataset.segments.map((seg) => {
//                 const isHovered = hoveredSegment?.id === seg.id;

//                 return (
//                   <div
//                     key={seg.id}
//                     onMouseEnter={() => setHoveredSegment(seg)}
//                     onMouseLeave={() => setHoveredSegment(null)}
//                     className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
//                       isHovered
//                         ? "bg-amber-50/50 border-amber-300 shadow-xs translate-x-1"
//                         : "bg-slate-50 border-slate-200 hover:bg-slate-100"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between text-xs">
//                       <div className="flex items-center gap-2">
//                         <span
//                           className="w-2.5 h-2.5 rounded-full shrink-0"
//                           style={{ backgroundColor: seg.color }}
//                         />

//                         <span className="font-semibold text-slate-800">
//                           {seg.label}
//                         </span>
//                       </div>

//                       <span className="font-mono font-bold text-slate-900">
//                         {seg.pct}%
//                       </span>
//                     </div>

//                     <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-500">
//                       <span>Volume:</span>

//                       <span className="font-semibold text-slate-700">
//                         {seg.formatted}
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
//             <span className="flex items-center gap-1.5 text-xs font-semibold">
//               <ShieldCheck className="w-4 h-4 text-slate-800" />

//               <span>
//                 Active breakdown:{" "}
//                 <strong className="text-slate-900 font-mono">
//                   {infographicDimension}
//                 </strong>
//               </span>
//             </span>

//             <span className="text-[11px] text-slate-400 font-mono">
//               Live 2026 Sync
//             </span>
//           </div>
//         </div>
//       </section>

//       {/* Table Section */}

//       <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//         <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden flex flex-col justify-between">
//           <div>
//             <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//               <div>
//                 <h3 className="text-base font-bold text-slate-900">
//                   Candidate Subscriptions Expiring (Next 30 Days)
//                 </h3>

//                 <p className="text-xs text-slate-500 mt-0.5">
//                   Follow up with students preparing for foreign university
//                   interviews or job transitions.
//                 </p>
//               </div>

//               <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-50 text-[#D97706] border border-amber-200 rounded-full">
//                 {candidates.length} Critical Actions
//               </span>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
//                     <th className="py-3 px-6">Candidate</th>

//                     <th className="py-3 px-4">Target Country / Visa</th>

//                     <th className="py-3 px-4">Track</th>

//                     <th className="py-3 px-4">ATS Score</th>

//                     <th className="py-3 px-4">Package</th>

//                     <th className="py-3 px-6 text-right">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100 text-sm">
//                   {candidates.map((c) => (
//                     <tr
//                       key={c.id}
//                       className="hover:bg-slate-50 transition-colors"
//                     >
//                       <td className="py-3.5 px-6">
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={c.avatar}
//                             alt={c.name}
//                             className="w-9 h-9 rounded-full object-cover border border-slate-200"
//                           />

//                           <div>
//                             <div className="font-bold text-slate-900 text-sm leading-tight">
//                               {c.name}
//                             </div>

//                             <div className="text-xs text-slate-400 font-mono">
//                               {c.email}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="py-3.5 px-4">
//                         <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
//                           <Globe className="w-3.5 h-3.5 text-slate-800" />

//                           {c.countryGoal}
//                         </div>

//                         <div className="text-[11px] text-slate-500 font-mono mt-0.5">
//                           {c.targetVisa}
//                         </div>
//                       </td>

//                       <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
//                         {c.domain}
//                       </td>

//                       <td className="py-3.5 px-4">
//                         <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
//                           {c.atsScore}% ATS
//                         </span>
//                       </td>

//                       <td className="py-3.5 px-4">
//                         <span
//                           className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
//                             c.plan === "Premium"
//                               ? "bg-slate-900 text-white"
//                               : "bg-slate-100 text-slate-800 border border-slate-300"
//                           }`}
//                         >
//                           {c.plan}
//                         </span>
//                       </td>

//                       <td className="py-3.5 px-6 text-right">
//                         <button
//                           onClick={() => {
//                             setSelectedCandidate(c);

//                             setPlanForm({ plan: c.plan, reason: "" });

//                             setShowPlanModal(true);
//                           }}
//                           className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 shadow-xs transition-all"
//                         >
//                           Update Plan
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium bg-slate-50/50">
//             <span>Showing priority renewals expiring in &lt; 30 days</span>

//             <button className="text-slate-900 font-bold hover:underline flex items-center gap-1">
//               Full Candidate Directory <ChevronRight className="w-3.5 h-3.5" />
//             </button>
//           </div>
//         </div>

//         {/* Job Ingestion Telemetry Card */}

//         <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
//           <div>
//             <div className="flex items-center justify-between mb-1">
//               <h3 className="text-base font-bold text-slate-900">
//                 Global Job Ingestion
//               </h3>

//               <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-bold">
//                 Workers Active
//               </span>
//             </div>

//             <p className="text-xs text-slate-500 mb-4">
//               Automated abroad portals collecting international employment
//               listings.
//             </p>

//             <div className="space-y-3">
//               {JOB_SOURCES_STATUS.map((src) => {
//                 const isProblem = src.status !== "Working";

//                 return (
//                   <div
//                     key={src.name}
//                     className={`p-3.5 rounded-2xl border text-xs ${
//                       isProblem
//                         ? "bg-amber-50/60 border-amber-200"
//                         : "bg-slate-50 border-slate-200"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="font-semibold text-slate-900">
//                         {src.name}
//                       </span>

//                       <span
//                         className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
//                           isProblem
//                             ? "bg-amber-100 text-amber-800"
//                             : "bg-emerald-50 text-emerald-800 border border-emerald-200"
//                         }`}
//                       >
//                         {isProblem ? (
//                           <AlertTriangle className="w-3 h-3" />
//                         ) : (
//                           <CheckCircle2 className="w-3 h-3" />
//                         )}

//                         {src.status}
//                       </span>
//                     </div>

//                     <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
//                       <span>Latency: {src.latency}</span>

//                       <span>+{src.jobs24h} jobs / 24h</span>
//                     </div>

//                     {src.note && (
//                       <div className="mt-2 text-[11px] text-amber-800 font-medium bg-amber-100/70 p-1.5 rounded-lg">
//                         Alert: {src.note}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <button
//             onClick={() => alert("Scrapers restarted.")}
//             className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
//           >
//             Restart Stalled Scrapers
//             <ArrowUpRight className="w-4 h-4 text-amber-400" />
//           </button>
//         </div>
//       </section>

//       {/* Audit-Enforced Plan Modification Modal */}

//       {showPlanModal && (
//         <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
//             <div className="flex items-center justify-between pb-3 border-b border-slate-200">
//               <h4 className="text-base font-bold text-slate-900">
//                 Update Plan: {selectedCandidate?.name}
//               </h4>

//               <button
//                 onClick={() => setShowPlanModal(false)}
//                 className="text-slate-400 hover:text-slate-700 p-1 rounded-full"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handlePlanSave} className="mt-4 space-y-4">
//               <div>
//                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
//                   Package Level
//                 </label>

//                 <select
//                   value={planForm.plan}
//                   onChange={(e) =>
//                     setPlanForm({ ...planForm, plan: e.target.value })
//                   }
//                   className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
//                 >
//                   <option value="None">None (Unenrolled)</option>

//                   <option value="Basic">Basic Tier</option>

//                   <option value="Premium">Premium Tier</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
//                   Mandatory Audit Reason
//                 </label>

//                 <textarea
//                   required
//                   rows={3}
//                   value={planForm.reason}
//                   onChange={(e) =>
//                     setPlanForm({ ...planForm, reason: e.target.value })
//                   }
//                   placeholder="e.g., Extended student tier for UK visa sponsorship timeline."
//                   className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400"
//                 />
//               </div>

//               <div className="flex items-center justify-end gap-2.5 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowPlanModal(false)}
//                   className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-xs"
//                 >
//                   Commit to Audit Log
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React from "react";
import { RefreshCw } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import OverviewStats from "../components/OverviewStats";
import VelocityRevenueChart from "../components/VelocityRevenueChart";
import InfographicDonut from "../components/InfographicDonut";
import ExpiringPlansTable from "../components/ExpiringPlansTable";
import JobHealthCard from "../components/JobHealthCard";

export default function DashboardPage({ darkMode, onNavigate }) {
  const { data, loading, updateCandidatePlan } =
    useDashboard();

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 animate-spin text-[#D97706]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 Primary Top KPI Metrics */}
      <OverviewStats stats={data.stats} darkMode={darkMode} />

      {/* Analytics Row: Bi-Directional Pill Chart + Concentric Donut Wheel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 flex flex-col">
          <VelocityRevenueChart
            cohortData={data.cohort30dData}
            darkMode={darkMode}
          />
        </div>
        <div className="lg:col-span-6 flex flex-col">
          <InfographicDonut
            datasets={data.infographicDatasets}
            darkMode={darkMode}
          />
        </div>
      </section>

      {/* Operations Row: Expiring Candidate Actions + Ingestion Telemetry */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col">
          <ExpiringPlansTable
            candidates={data.expiringCandidates}
            onPlanUpdate={updateCandidatePlan}
            onNavigate={onNavigate}
            darkMode={darkMode}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <JobHealthCard health={data.jobHealth} darkMode={darkMode} />
        </div>
      </section>
    </div>
  );
}
