import {
  X,
  Copy,
  ExternalLink,
  Edit3,
  MoreHorizontal,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import CompanyLogo from "./CompanyLogo";
import SourceBadge from "./SourceBadge";
import { useToast } from "../../../hooks/useToast";

/**
 * JobDetailsPanel Component
 * Matches the exact right-side details panel from the reference screenshot:
 * - Brand logo + title + badges (Active, Public Job / Internal Role)
 * - JOB-2026-0042 + copy icon + Posted date subtext
 * - Tabs: Overview (active orange line), Applicants (42), Activity
 * - JOB INFORMATION + Edit Job action
 * - 2-column info grid (Job Title, Company, Job Type, Source, Location, Employment Type, Experience Level, Salary Range, Application URL, Status)
 * - JOB DESCRIPTION
 * - KEY RESPONSIBILITIES
 * - Footer: View on Source, Copy Job ID, More actions
 */
export default function JobDetailsPanel({
  job,
  onClose,
  onEditJob,
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

  const isPublic = job.type === "public";
  const bgCard = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const labelText = darkMode ? "text-slate-400" : "text-slate-400";
  const valText = darkMode ? "text-slate-200 font-semibold" : "text-slate-900 font-semibold";

  return (
    <div
      className={`w-full lg:w-[410px] xl:w-[450px] shrink-0 border rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs transition-colors ${bgCard}`}
    >
      {/* 1. Header with Company Logo, Title, Badges, ID, and Close */}
      <div className="p-5 border-b border-slate-100 dark:border-[#30363D] relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-11 h-11 rounded-full bg-white dark:bg-[#21262D] border border-slate-200 dark:border-[#30363D] flex items-center justify-center p-1.5 shadow-2xs shrink-0">
            <CompanyLogo company={job.company} className="w-7 h-7" />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className={`text-base font-bold leading-snug truncate ${headingText}`}
              title={job.title}
            >
              {job.title}
            </h3>

            {/* Badges row */}
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {job.status === "Active" ? "Active" : job.status}
              </span>

              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  isPublic
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50"
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50"
                }`}
              >
                {isPublic ? "Public Job" : "Internal Role"}
              </span>

              {job.isHidden && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <EyeOff className="w-2.5 h-2.5 text-slate-400" />
                  Hidden
                </span>
              )}
            </div>

            {/* ID & Relative Date */}
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
              <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                {job.id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-slate-400 hover:text-amber-500 transition-colors p-0.5 cursor-pointer"
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

        {/* 2. Tabs: Overview, Applicants (42), Activity */}
        <div className="flex items-center gap-6 mt-5 -mb-5 border-t border-slate-100 dark:border-[#30363D] pt-1 text-xs font-semibold">
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

      {/* 3. Panel Content Area */}
      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-5 text-xs">
        {activeTab === "overview" ? (
          <>
            {/* Section: JOB INFORMATION + Edit Job */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  JOB INFORMATION
                </span>
                <div className="flex items-center gap-3">
                  {onToggleVisibility && (
                    <button
                      type="button"
                      onClick={() => onToggleVisibility(job.id, !job.isHidden, job.title)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      {job.isHidden ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-500" />
                          <span>Unhide</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-slate-400" />
                          <span>Hide</span>
                        </>
                      )}
                    </button>
                  )}
                  {onEditJob && (
                    <button
                      type="button"
                      onClick={() => onEditJob(job)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-amber-500" />
                      <span>Edit Job</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 2-Column Info Grid */}
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
                {/* Row 1 */}
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

                {/* Row 2 */}
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

                {/* Row 3 */}
                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Location</span>
                  <span className={`block truncate ${valText}`}>
                    {job.location === "Bengaluru, IN" ? "Bengaluru, India" : job.location || "Remote"}
                  </span>
                </div>
                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Employment Type</span>
                  <span className={`block truncate ${valText}`}>{job.employmentType || "Full-time"}</span>
                </div>

                {/* Row 4 */}
                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Experience Level</span>
                  <span className={`block truncate ${valText}`}>
                    {job.experienceLevel || "Mid to Senior"}
                  </span>
                </div>
                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Salary Range</span>
                  <span className={`block truncate font-mono text-emerald-600 dark:text-emerald-400 font-bold`}>
                    {job.salaryRange || "₹20L - ₹35L / year"}
                  </span>
                </div>

                {/* Row 5: Application URL */}
                {job.applicationUrl && (
                  <div className="col-span-2">
                    <span className={`block text-[11px] mb-0.5 ${labelText}`}>Application URL</span>
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline break-all font-mono text-xs"
                    >
                      <span className="truncate max-w-[320px]">{job.applicationUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}

                {/* Row 6: Status */}
                <div>
                  <span className={`block text-[11px] mb-0.5 ${labelText}`}>Status</span>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{job.status === "Active" ? "Active" : job.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: JOB DESCRIPTION */}
            <div className="pt-3 border-t border-slate-100 dark:border-[#30363D]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                JOB DESCRIPTION
              </span>
              <p className={`text-xs leading-relaxed ${subText}`}>
                {job.description ||
                  "We are looking for a skilled Frontend Engineer to build scalable, high-performance web applications. You will work closely with product, design, and backend teams to deliver exceptional user experiences."}
              </p>
            </div>

            {/* Section: KEY RESPONSIBILITIES */}
            <div className="pt-3 border-t border-slate-100 dark:border-[#30363D]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                KEY RESPONSIBILITIES
              </span>
              <ul className={`space-y-1.5 text-xs ${subText}`}>
                {(job.responsibilities && job.responsibilities.length > 0
                  ? job.responsibilities
                  : [
                      "Develop and maintain frontend applications using React",
                      "Collaborate with cross-functional teams",
                      "Optimize application performance",
                      "Write clean, maintainable, and testable code",
                    ]
                ).map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : activeTab === "applicants" ? (
          <div className="py-8 text-center text-slate-400 space-y-2">
            <span className="font-bold text-sm text-slate-700 dark:text-slate-300 block">
              {job.applicantsCount ?? 42} Active Applicants
            </span>
            <p className="text-xs">
              Applicants are automatically synchronized with student cohort recommendations and resume ATS matchmaking.
            </p>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 space-y-2">
            <span className="font-bold text-sm text-slate-700 dark:text-slate-300 block">
              Job Audit Trail
            </span>
            <p className="text-xs">
              Job indexed via {job.source || "Feed"} on {job.postedDate || "Oct 10, 2026"}. Verified by AIFA GEN crawler.
            </p>
          </div>
        )}
      </div>

      {/* 4. Pinned Bottom Action Buttons */}
      <div className="p-4 border-t border-slate-100 dark:border-[#30363D] flex items-center justify-between gap-2.5 bg-slate-50/50 dark:bg-[#161B22]">
        {/* Button 1: View on Source */}
        {job.applicationUrl ? (
          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              darkMode
                ? "bg-[#21262D] border-[#30363D] text-slate-200 hover:text-white"
                : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs"
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            <span>View on Source</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={() => addToast("Internal role has no external source URL", "info")}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              darkMode
                ? "bg-[#21262D] border-[#30363D] text-slate-200 hover:text-white"
                : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs"
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            <span>View on Source</span>
          </button>
        )}

        {/* Button 2: Copy Job ID */}
        <button
          type="button"
          onClick={handleCopyId}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            darkMode
              ? "bg-[#21262D] border-[#30363D] text-slate-200 hover:text-white"
              : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs"
          }`}
        >
          {copiedId ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-500" />
          )}
          <span>{copiedId ? "Copied" : "Copy Job ID"}</span>
        </button>

        {/* Button 3: ··· More */}
        <button
          type="button"
          onClick={() => addToast(`Job actions for ${job.id}`, "info")}
          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            darkMode
              ? "bg-[#21262D] border-[#30363D] text-slate-200 hover:text-white"
              : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs"
          }`}
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
}
