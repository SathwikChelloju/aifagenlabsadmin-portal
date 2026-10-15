import React, { useState, useEffect } from "react";
import { X, UserPlus, CheckCircle2 } from "lucide-react";
import { recruiterService } from "../services/recruiterService";

const DEPARTMENTS = [
  "Engineering & AI",
  "Cloud & Infrastructure",
  "Leadership & Strategy",
  "Product & Design",
  "Global Relocation",
  "Global Campus",
];

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  employeeId: "",
  email: "",
  department: "Engineering & AI",
  joinedAt: "2026-10-14",
  status: "Active",
  phone: "",
  role: "Talent Acquisition Specialist",
  location: "London, UK",
  reportingManager: "Sarah Jenkins",
  employmentType: "Full-Time",
};

const getInitialForm = () => {
  const all = recruiterService.getRecruiters();
  const nextNum = 100 + all.length + 1;
  return {
    ...INITIAL_FORM,
    employeeId: `AG-REC-${nextNum}`,
    joinedAt: new Date().toISOString().slice(0, 10),
  };
};

export default function AddRecruiterModal({
  isOpen,
  onClose,
  onSuccess,
  darkMode = false,
}) {
  const [formData, setFormData] = useState(getInitialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prevOpen, setPrevOpen] = useState(isOpen);

  if (isOpen && !prevOpen) {
    setPrevOpen(true);
    setFormData(getInitialForm());
    setErrors({});
    setIsSubmitting(false);
  } else if (!isOpen && prevOpen) {
    setPrevOpen(false);
  }

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = recruiterService.createRecruiter(formData);
    if (!result.success) {
      setErrors(result.errors || {});
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess(result.recruiter);
      }
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className={`w-full max-w-xl rounded-3xl border shadow-2xl relative overflow-hidden transition-all animate-in zoom-in-95 duration-150 ${
            darkMode
              ? "bg-[#0D1117] border-[#30363D] text-slate-100 shadow-black/80"
              : "bg-white border-slate-200 text-slate-900 shadow-slate-900/15"
          }`}
        >
          {/* Header */}
          <div
            className={`p-5 sm:p-6 border-b flex items-center justify-between ${
              darkMode ? "border-[#30363D] bg-[#161B22]/60" : "border-slate-100 bg-slate-50/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 id="modal-title" className="text-base font-extrabold tracking-tight">
                  Add New Recruiter
                </h3>
                <p className="text-xs text-slate-400">
                  Onboard a new internal talent partner or technical sourcer.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ${
                darkMode ? "hover:bg-[#21262D]" : "hover:bg-slate-100"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
            {/* Required Fields Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* First Name */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="e.g. Jessica"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden transition-colors ${
                      errors.firstName
                        ? "border-rose-500 bg-rose-500/5 text-rose-300"
                        : darkMode
                        ? "bg-[#161B22] border-[#30363D] text-white focus:border-amber-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="e.g. Miller"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden transition-colors ${
                      errors.lastName
                        ? "border-rose-500 bg-rose-500/5 text-rose-300"
                        : darkMode
                        ? "bg-[#161B22] border-[#30363D] text-white focus:border-amber-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Employee ID & Work Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Employee ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleChange("employeeId", e.target.value)}
                    placeholder="e.g. AG-REC-115"
                    className={`w-full px-3 py-2 rounded-xl border font-mono uppercase focus:outline-hidden transition-colors ${
                      errors.employeeId
                        ? "border-rose-500 bg-rose-500/5 text-rose-300"
                        : darkMode
                        ? "bg-[#161B22] border-[#30363D] text-white focus:border-amber-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500"
                    }`}
                  />
                  {errors.employeeId && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.employeeId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="name@aifagen.com"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden transition-colors ${
                      errors.email
                        ? "border-rose-500 bg-rose-500/5 text-rose-300"
                        : darkMode
                        ? "bg-[#161B22] border-[#30363D] text-white focus:border-amber-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Department, Joined Date & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border font-semibold focus:outline-hidden transition-colors ${
                      darkMode
                        ? "bg-[#161B22] border-[#30363D] text-white focus:border-amber-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500"
                    }`}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Date Joined <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.joinedAt}
                    onChange={(e) => handleChange("joinedAt", e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border font-mono focus:outline-hidden transition-colors ${
                      errors.joinedAt
                        ? "border-rose-500 bg-rose-500/5 text-rose-300"
                        : darkMode
                        ? "bg-[#161B22] border-[#30363D] text-white focus:border-amber-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500"
                    }`}
                  />
                  {errors.joinedAt && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.joinedAt}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border font-semibold focus:outline-hidden transition-colors ${
                      darkMode
                        ? "bg-[#161B22] border-[#30363D] text-white focus:border-amber-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500"
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Optional Fields Divider */}
            <div className="pt-2 border-t border-slate-500/15">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Optional Profile Metadata
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Job Title</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    placeholder="e.g. Senior Technical Recruiter"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden transition-colors ${
                      darkMode
                        ? "bg-[#161B22] border-[#30363D] text-white focus:border-amber-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="e.g. London, UK"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden transition-colors ${
                      darkMode
                        ? "bg-[#161B22] border-[#30363D] text-white focus:border-amber-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+44 20 7946 0999"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden transition-colors ${
                      darkMode
                        ? "bg-[#161B22] border-[#30363D] text-white focus:border-amber-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Reporting Manager
                  </label>
                  <input
                    type="text"
                    value={formData.reportingManager}
                    onChange={(e) => handleChange("reportingManager", e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-hidden transition-colors ${
                      darkMode
                        ? "bg-[#161B22] border-[#30363D] text-white focus:border-amber-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-500/15 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  darkMode
                    ? "bg-[#161B22] text-slate-300 hover:text-white hover:bg-[#21262D]"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-extrabold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? "Saving..." : "Create Recruiter"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
