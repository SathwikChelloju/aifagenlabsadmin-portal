import React, { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Edit3,
  MapPin,
  Building2,
  Briefcase,
  Users,
  ShieldCheck,
  Globe,
  Tag,
  Eye,
  EyeOff,
  Activity,
} from "lucide-react";
import Drawer from "../../../components/ui/Drawer";
import CompanyLogo from "./CompanyLogo";
import SourceBadge from "./SourceBadge";
import {
  getJobStatusBadge,
  getJobTypeBadge,
  getEmploymentTypeBadge,
} from "../utils/jobUtils";
import { useToast } from "../../../hooks/useToast";

/**
 * JobDetailsDrawer Component
 * Slide-out inspection panel displaying comprehensive metadata for both public and internal jobs.
 * Supports tabs: Overview, Applicants, Activity.
 */
export default function JobDetailsDrawer({
  job,
  isOpen,
  onClose,
  onEditJob,
  onStatusChange,
  onToggleVisibility,
  darkMode = false,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedId, setCopiedId] = useState(false);
  const { addToast } = useToast();

  if (!job) return null;

  const handleCopyId = () => {
    if (!job?.id) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(job.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 1800);
      addToast(`Copied Job ID ${job.id}`, "info");
    } else {
      addToast(`ID: ${job.id}`, "info");
    }
  };

  const statusMeta = getJobStatusBadge(job.status, darkMode);
  const typeMeta = getJobTypeBadge(job.type, darkMode);
  const empMeta = getEmploymentTypeBadge(job.employmentType, darkMode);
  const isPublic = job.type === "public";

  const cardSurface = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/70 border-slate-200/80";

  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const labelText = darkMode ? "text-slate-400" : "text-slate-400";
  const valText = darkMode ? "text-slate-200 font-semibold" : "text-slate-900 font-semibold";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-md sm:max-w-xl"
      darkMode={darkMode}
      customHeader={
        <div className="flex-1 pr-2 min-w-0">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-white dark:bg-[#21262D] border border-slate-200 dark:border-[#30363D] flex items-center justify-center p-1.5 shadow-2xs shrink-0 mt-0.5">
              <CompanyLogo company={job.company} className="w-7 h-7" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold tracking-wide uppercase ${typeMeta.badgeClass}`}
                >
                  {typeMeta.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-bold ${statusMeta.badgeClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dotClass}`} />
                  <span>{statusMeta.label}</span>
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-medium ${empMeta.badgeClass}`}
                >
                  {empMeta.label}
                </span>
                {job.isHidden && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <EyeOff className="w-2.5 h-2.5 text-slate-400" />
                    Hidden
                  </span>
                )}
              </div>

              <h3
                className={`text-base font-extrabold leading-snug truncate ${headingText}`}
                title={job.title}
              >
                {job.title}
              </h3>

              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {job.company}
                </span>
                <span>•</span>
                <span className="font-mono text-[11px]">{job.id}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="hover:text-amber-500 transition-colors cursor-pointer p-0.5"
                  title="Copy Job ID"
                >
                  {copiedId ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              <div className="text-[11px] text-slate-400 mt-1">
                Posted {job.postedDate || "Oct 10, 2026"} • {job.daysAgo || "2 days ago"}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 mt-4 -mb-2 border-t border-slate-100 dark:border-[#30363D] pt-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`pb-2.5 pt-2 relative transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "text-slate-900 dark:text-white font-bold"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              Overview
              {activeTab === "overview" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("applicants")}
              className={`pb-2.5 pt-2 relative transition-colors cursor-pointer ${
                activeTab === "applicants"
                  ? "text-slate-900 dark:text-white font-bold"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              Applicants ({job.applicantsCount ?? 42})
              {activeTab === "applicants" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("activity")}
              className={`pb-2.5 pt-2 relative transition-colors cursor-pointer ${
                activeTab === "activity"
                  ? "text-slate-900 dark:text-white font-bold"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              Activity
              {activeTab === "activity" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full" />
              )}
            </button>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between gap-2.5 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            {isPublic && job.applicationUrl ? (
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0B192C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
                <span>Open Posting</span>
              </a>
            ) : null}

            {onEditJob && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditJob(job);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  darkMode
                    ? "bg-[#21262D] border-[#30363D] hover:bg-[#30363D] text-white"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-2xs"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                <span>Edit Job</span>
              </button>
            )}

            {onStatusChange && (
              <button
                type="button"
                onClick={() => {
                  const newStatus = job.status === "Active" ? "Paused" : "Active";
                  onStatusChange(job.id, newStatus, job.title);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  darkMode
                    ? "bg-[#21262D] border-[#30363D] hover:bg-[#30363D] text-slate-300"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs"
                }`}
              >
                <span>{job.status === "Active" ? "Pause Job" : "Activate Job"}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer shrink-0 ${
              darkMode
                ? "bg-[#161B22] border-[#30363D] text-slate-400 hover:text-white"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {activeTab === "overview" && (
          <>
            {/* Quick Header Row: JOB INFORMATION + Unhide/Hide + Edit */}
            <div className={`p-4 rounded-2xl border space-y-3.5 ${cardSurface}`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-[#30363D]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  JOB INFORMATION
                </span>

                <div className="flex items-center gap-3">
                  {onToggleVisibility && (
                    <button
                      type="button"
                      onClick={() => onToggleVisibility(job.id, !job.isHidden, job.title)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      {job.isHidden ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Unhide from portal</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Hide from portal</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* 2-Column Info Grid */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Job Title</span>
                  <span className={`block truncate ${valText}`}>{job.title}</span>
                </div>

                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Company</span>
                  <div className="flex items-center gap-1.5 truncate">
                    <CompanyLogo company={job.company} className="w-4 h-4 shrink-0" />
                    <span className={valText}>{job.company}</span>
                  </div>
                </div>

                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Job Type</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isPublic
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50"
                    }`}
                  >
                    {isPublic ? "Public Job" : "Internal Role"}
                  </span>
                </div>

                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Source</span>
                  <SourceBadge source={job.source} darkMode={darkMode} />
                </div>

                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Location</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className={`truncate ${valText}`}>
                      {job.location === "Bengaluru, IN" ? "Bengaluru, India" : job.location || "Remote"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Employment Type</span>
                  <span className={`block truncate ${valText}`}>
                    {job.employmentType || "Full-time"}
                  </span>
                </div>

                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Experience Level</span>
                  <span className={`block truncate ${valText}`}>
                    {job.experienceLevel || "Mid to Senior"}
                  </span>
                </div>

                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Salary Range</span>
                  <span className="block truncate font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {job.salaryRange || "₹20L - ₹35L / year"}
                  </span>
                </div>

                {job.applicationUrl && (
                  <div className="col-span-2 pt-1 border-t border-slate-200/40 dark:border-[#30363D]">
                    <span className={`block text-[11px] mb-0.5 ${labelText}`}>Application URL</span>
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline break-all font-mono text-xs"
                    >
                      <span className="truncate max-w-[340px]">{job.applicationUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Public Specific Metadata (Visa, Country, Official URL) */}
            {isPublic && (
              <div className={`p-4 rounded-2xl border space-y-3 ${cardSurface}`}>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-500" />
                  Public Ingestion Details
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Ingested Source
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {job.source || "Partner Crawler"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Target Destination
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {job.country || job.location || "International"}
                    </span>
                  </div>

                  {job.visaVerified !== undefined && (
                    <div className="sm:col-span-2 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span className="text-[11px] font-semibold">
                        {job.visaSponsorshipNote || "Visa Sponsorship Verified by Crawler"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Internal Specific Metadata */}
            {!isPublic && (
              <div className={`p-4 rounded-2xl border space-y-3 ${cardSurface}`}>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-500" />
                  Internal Studio Information
                </h5>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Department
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {job.department || "Operations"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Seniority Level
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {job.seniority || "Mid-Senior"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Candidates
                    </span>
                    <div className="flex items-center gap-1.5 font-bold font-mono text-[#0B192C] dark:text-white">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.applicantsCount ?? 0} candidates</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Channel
                    </span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      Direct Studio Internal
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Job Description */}
            <div className={`p-4 rounded-2xl border space-y-2 ${cardSurface}`}>
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                Job Description
              </h5>
              <p className={`text-xs leading-relaxed whitespace-pre-line ${subText}`}>
                {job.description ||
                  "We are looking for a skilled Engineer to build scalable, high-performance systems and user interfaces. You will work closely with product, design, and backend teams to deliver exceptional user experiences."}
              </p>
            </div>

            {/* Key Responsibilities */}
            <div className={`p-4 rounded-2xl border space-y-2 ${cardSurface}`}>
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Key Responsibilities
              </h5>
              <ul className={`space-y-1.5 text-xs ${subText}`}>
                {(job.responsibilities && job.responsibilities.length > 0
                  ? job.responsibilities
                  : [
                      "Develop and maintain frontend applications using modern frameworks",
                      "Collaborate closely with product, engineering, and UX teams",
                      "Ensure high performance, accessibility, and responsiveness",
                      "Write clean, maintainable, and well-tested code",
                    ]
                ).map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills & Technologies */}
            {job.skills && job.skills.length > 0 && (
              <div className={`p-4 rounded-2xl border space-y-2.5 ${cardSurface}`}>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  Required Skills & Technologies
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                        darkMode
                          ? "bg-[#161B22] border-[#30363D] text-slate-200"
                          : "bg-white border-slate-200 text-slate-800 shadow-2xs"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab 2: Applicants */}
        {activeTab === "applicants" && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border ${cardSurface} text-center space-y-2`}>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-bold text-lg">
                {job.applicantsCount ?? 42}
              </div>
              <h4 className={`text-sm font-bold ${headingText}`}>Active Candidates Ingested</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Candidates are screened and matched with students and job seekers using AI matchmaking.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-3 ${cardSurface}`}>
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Matchmaking Pipeline
              </h5>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-[#161B22]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    High Fit (&gt;85% match)
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    18 candidates
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-[#161B22]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Moderate Fit (70-85%)
                  </span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    16 candidates
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-[#161B22]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Under Review
                  </span>
                  <span className="font-mono font-bold text-slate-500 dark:text-slate-400">
                    8 candidates
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Activity */}
        {activeTab === "activity" && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border space-y-3 ${cardSurface}`}>
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                Job Activity History
              </h5>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-200/50 dark:border-[#30363D]">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Ingested & Indexed
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Imported from {job.source || "Feed"} on {job.postedDate || "Oct 10, 2026"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-200/50 dark:border-[#30363D]">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Status marked as {job.status || "Active"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Automated ingestion pipeline verification
                    </span>
                  </div>
                </div>

                {job.isHidden && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        Hidden from Student Portal
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Admin toggled job visibility to hidden
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
