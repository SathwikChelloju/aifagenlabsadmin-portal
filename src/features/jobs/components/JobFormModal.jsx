import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";

function getInitialFormData(job) {
  if (!job) {
    return {
      title: "",
      company: "AIFA GEN LABS",
      type: "internal",
      location: "Remote",
      employmentType: "Full-time",
      status: "Active",
      salaryRange: "",
      source: "Internal",
      applicationUrl: "",
      visaVerified: true,
      visaSponsorshipNote: "Visa Sponsorship Confirmed",
      department: "Candidate Mobility",
      seniority: "Senior",
      skills: "",
      description: "",
    };
  }
  return {
    title: job.title || "",
    company: job.company || (job.type === "internal" ? "AIFA GEN LABS" : ""),
    type: job.type || "public",
    location: job.location || "",
    employmentType: job.employmentType || "Full-time",
    status: job.status || "Active",
    salaryRange: job.salaryRange || "",
    source: job.source || (job.type === "internal" ? "Internal" : "LinkedIn Global Jobs"),
    applicationUrl: job.applicationUrl || "",
    visaVerified: job.visaVerified ?? true,
    visaSponsorshipNote: job.visaSponsorshipNote || "",
    department: job.department || "Engineering",
    seniority: job.seniority || "Mid",
    skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
    description: job.description || "",
  };
}

/**
 * JobFormModal Component
 * Reusable modal for creating and editing both Public and Internal job postings.
 * Features conditional fields based on Job Type, form validation, and reactive submission.
 */
export default function JobFormModal({
  isOpen,
  onClose,
  onSubmit,
  jobToEdit = null,
  availableSources = [],
  darkMode = false,
}) {
  const isEditing = Boolean(jobToEdit);

  const [formData, setFormData] = useState(() => getInitialFormData(jobToEdit));
  const [prevJob, setPrevJob] = useState(jobToEdit);
  const [errors, setErrors] = useState({});

  if (jobToEdit !== prevJob) {
    setPrevJob(jobToEdit);
    setFormData(getInitialFormData(jobToEdit));
    setErrors({});
  }

  const sourcesList = availableSources && availableSources.length > 0
    ? availableSources.filter((s) => s !== "All Sources")
    : [
        "LinkedIn Global Jobs",
        "Indeed Europe Enterprise",
        "Greenhouse Partner Feeds",
        "Lever Board Collector",
        "Workday Direct Feed",
      ];

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      company:
        newType === "internal"
          ? prev.company === "" || prev.company === "Company"
            ? "AIFA GEN LABS"
            : prev.company
          : prev.company === "AIFA GEN LABS"
          ? ""
          : prev.company,
      source: newType === "internal" ? "Internal" : "LinkedIn Global Jobs",
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = "Job Title is required.";
    }
    if (!formData.company.trim()) {
      errs.company = "Company name is required.";
    }
    if (!formData.location.trim()) {
      errs.location = "Location is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (onSubmit) {
      onSubmit(payload);
    }
    onClose();
  };

  const inputBg = darkMode
    ? "bg-[#0D1117] border-[#30363D] text-white placeholder-slate-500 focus:border-amber-500"
    : "bg-slate-50/70 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500";
  const labelColor = darkMode ? "text-slate-300" : "text-slate-700";
  const optionBg = darkMode ? "bg-[#161B22] text-white" : "bg-white text-slate-900";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Job" : "Add New Job"}
      description={
        isEditing
          ? "Update job parameters, requirements, and status."
          : "Create a new public listing or internal studio posting."
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Job Type Selector Pills */}
        <div>
          <label className={`block font-bold mb-1.5 ${labelColor}`}>
            Job Type <span className="text-amber-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange("internal")}
              className={`py-2 px-3 rounded-xl font-bold border transition-all text-xs cursor-pointer ${
                formData.type === "internal"
                  ? darkMode
                    ? "bg-purple-950/40 text-purple-300 border-purple-800/80 shadow-xs"
                    : "bg-purple-50 text-purple-700 border-purple-300 shadow-xs"
                  : darkMode
                  ? "bg-[#21262D] border-[#30363D] text-slate-400 hover:text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Internal Studio Role
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("public")}
              className={`py-2 px-3 rounded-xl font-bold border transition-all text-xs cursor-pointer ${
                formData.type === "public"
                  ? darkMode
                    ? "bg-sky-950/40 text-sky-300 border-sky-800/80 shadow-xs"
                    : "bg-sky-50 text-sky-700 border-sky-300 shadow-xs"
                  : darkMode
                  ? "bg-[#21262D] border-[#30363D] text-slate-400 hover:text-white"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Public Ingested Listing
            </button>
          </div>
        </div>

        {/* Two-column layout for title and company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={`block font-bold mb-1 ${labelColor}`}>
              Job Title <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Senior Backend Engineer"
              className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none ${inputBg}`}
            />
            {errors.title && (
              <p className="text-rose-500 text-[11px] mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className={`block font-bold mb-1 ${labelColor}`}>
              Company <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. AIFA GEN LABS or Monzo"
              className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none ${inputBg}`}
            />
            {errors.company && (
              <p className="text-rose-500 text-[11px] mt-1">{errors.company}</p>
            )}
          </div>
        </div>

        {/* Location & Employment Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={`block font-bold mb-1 ${labelColor}`}>
              Location <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. London, UK (Hybrid) or Remote"
              className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none ${inputBg}`}
            />
            {errors.location && (
              <p className="text-rose-500 text-[11px] mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label className={`block font-bold mb-1 ${labelColor}`}>
              Employment Type
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none cursor-pointer ${inputBg}`}
            >
              <option value="Full-time" className={optionBg}>Full-time</option>
              <option value="Part-time" className={optionBg}>Part-time</option>
              <option value="Contract" className={optionBg}>Contract</option>
              <option value="Internship" className={optionBg}>Internship</option>
            </select>
          </div>
        </div>

        {/* Status & Salary Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={`block font-bold mb-1 ${labelColor}`}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none cursor-pointer ${inputBg}`}
            >
              <option value="Active" className={optionBg}>Active</option>
              <option value="Draft" className={optionBg}>Draft</option>
              <option value="Paused" className={optionBg}>Paused</option>
              <option value="Closed" className={optionBg}>Closed</option>
            </select>
          </div>

          <div>
            <label className={`block font-bold mb-1 ${labelColor}`}>
              Salary Range
            </label>
            <input
              type="text"
              value={formData.salaryRange}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              placeholder="e.g. £95,000 - £120,000"
              className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none ${inputBg}`}
            />
          </div>
        </div>

        {/* Conditional Fields: Public vs Internal */}
        {formData.type === "public" ? (
          <div className="p-3.5 rounded-2xl border border-sky-500/20 bg-sky-500/5 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">
              Public Listing Settings
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`block font-bold mb-1 ${labelColor}`}>
                  Crawler Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none cursor-pointer ${inputBg}`}
                >
                  {sourcesList.map((src) => (
                    <option key={src} value={src} className={optionBg}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block font-bold mb-1 ${labelColor}`}>
                  Application URL
                </label>
                <input
                  type="url"
                  value={formData.applicationUrl}
                  onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                  placeholder="https://company.com/careers/job"
                  className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none ${inputBg}`}
                />
              </div>
            </div>

            <div>
              <label className={`block font-bold mb-1 ${labelColor}`}>
                Visa Sponsorship Note
              </label>
              <input
                type="text"
                value={formData.visaSponsorshipNote}
                onChange={(e) => setFormData({ ...formData, visaSponsorshipNote: e.target.value })}
                placeholder="e.g. Tier 2 Skilled Worker Sponsorship Confirmed"
                className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none ${inputBg}`}
              />
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl border border-purple-500/20 bg-purple-500/5 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
              Internal Studio Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`block font-bold mb-1 ${labelColor}`}>
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none cursor-pointer ${inputBg}`}
                >
                  <option value="Candidate Mobility" className={optionBg}>Candidate Mobility</option>
                  <option value="Gen AI Lab" className={optionBg}>Gen AI Lab</option>
                  <option value="Data Platform" className={optionBg}>Data Platform</option>
                  <option value="Student Operations" className={optionBg}>Student Operations</option>
                  <option value="Engineering" className={optionBg}>Engineering</option>
                </select>
              </div>

              <div>
                <label className={`block font-bold mb-1 ${labelColor}`}>
                  Seniority Level
                </label>
                <select
                  value={formData.seniority}
                  onChange={(e) => setFormData({ ...formData, seniority: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none cursor-pointer ${inputBg}`}
                >
                  <option value="Junior" className={optionBg}>Junior</option>
                  <option value="Mid" className={optionBg}>Mid</option>
                  <option value="Senior" className={optionBg}>Senior</option>
                  <option value="Lead" className={optionBg}>Lead</option>
                  <option value="Director" className={optionBg}>Director</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Required Skills (Comma-separated) */}
        <div>
          <label className={`block font-bold mb-1 ${labelColor}`}>
            Required Skills (comma separated)
          </label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="e.g. React, TypeScript, GraphQL, AWS"
            className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none ${inputBg}`}
          />
        </div>

        {/* Description */}
        <div>
          <label className={`block font-bold mb-1 ${labelColor}`}>
            Job Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide key responsibilities, requirements, and background..."
            className={`w-full px-3.5 py-2 rounded-xl border transition-colors focus:outline-none resize-none ${inputBg}`}
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
              darkMode
                ? "bg-[#21262D] border-[#30363D] hover:bg-[#30363D] text-slate-300"
                : "bg-slate-100 border-slate-200 hover:bg-slate-200/70 text-slate-700"
            }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl font-bold bg-[#0B192C] hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {isEditing ? "Save Changes" : "Create Job"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
