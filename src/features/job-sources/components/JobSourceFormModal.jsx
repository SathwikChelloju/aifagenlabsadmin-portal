import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import { AlertCircle } from "lucide-react";

/**
 * JobSourceFormModal Component
 * Modal for creating or editing a job source integration.
 */
export default function JobSourceFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  darkMode = false,
}) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: "",
    type: "api",
    endpoint: "",
    frequency: "Every 15 minutes",
    status: "Active",
    protocol: "HTTPS / REST",
    apiKey: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "api",
        endpoint: initialData.endpoint || "",
        frequency: initialData.frequency || "Every 15 minutes",
        status: initialData.status || "Active",
        protocol: initialData.protocol || "HTTPS / REST",
        apiKey: initialData.maskedKey || "",
        description: initialData.description || "",
      });
    } else {
      setFormData({
        name: "",
        type: "api",
        endpoint: "",
        frequency: "Every 15 minutes",
        status: "Active",
        protocol: "HTTPS / REST",
        apiKey: "",
        description: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Source name is required";
    }
    if (!formData.endpoint.trim() && formData.type !== "internal") {
      newErrors.endpoint = "Endpoint URL or path is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      maskedKey: formData.apiKey ? `••••••••••••••••${formData.apiKey.slice(-4) || "8821"}` : undefined,
    };

    if (onSubmit) {
      onSubmit(payload);
    }
    onClose();
  };

  const inputClass = `w-full px-3.5 py-2.5 rounded-xl border text-xs transition-colors focus:outline-hidden ${
    darkMode
      ? "bg-[#0D1117] border-[#30363D] text-white focus:border-[#D97706]"
      : "bg-white border-slate-200 text-slate-800 focus:border-[#D97706]"
  }`;

  const labelClass = `block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
    darkMode ? "text-slate-400" : "text-slate-600"
  }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Job Source" : "Add Ingestion Source"}
      description={
        isEditing
          ? `Modify integration settings for ${initialData?.name || "this source"}.`
          : "Configure a new crawler, API integration, or internal job feed."
      }
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Source Name */}
        <div>
          <label className={labelClass}>Source Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. LinkedIn Global Jobs"
            className={`${inputClass} ${errors.name ? "border-rose-500!" : ""}`}
          />
          {errors.name && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Source Type & Status Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Source Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="api">API Integration</option>
              <option value="job_board">Public Job Board</option>
              <option value="internal">Internal Posting</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Initial Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
        </div>

        {/* Endpoint URL */}
        <div>
          <label className={labelClass}>
            Endpoint URL {formData.type !== "internal" && "*"}
          </label>
          <input
            type="text"
            name="endpoint"
            value={formData.endpoint}
            onChange={handleChange}
            placeholder={
              formData.type === "internal"
                ? "internal://jobs.aifagen.local/v1"
                : "https://api.provider.com/v2/jobs"
            }
            className={`${inputClass} font-mono ${errors.endpoint ? "border-rose-500!" : ""}`}
          />
          {errors.endpoint && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.endpoint}
            </p>
          )}
        </div>

        {/* Frequency & Protocol Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Ingestion Frequency</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Every 15 minutes">Every 15 minutes</option>
              <option value="Hourly">Hourly</option>
              <option value="Daily">Daily</option>
              <option value="Real-time Webhook">Real-time Webhook</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Protocol</label>
            <select
              name="protocol"
              value={formData.protocol}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="HTTPS / REST">HTTPS / REST</option>
              <option value="Webhook / JSON">Webhook / JSON</option>
              <option value="GraphQL">GraphQL</option>
              <option value="Browser Scraper">Browser Scraper</option>
            </select>
          </div>
        </div>

        {/* Mock API Key / Auth Token */}
        <div>
          <label className={labelClass}>API Secret / Auth Token</label>
          <input
            type="password"
            name="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            placeholder={isEditing ? "••••••••••••••••" : "sk_live_..."}
            className={`${inputClass} font-mono`}
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Encrypted immediately with AES-256 upon submission. Plaintext is never stored.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description / Notes</label>
          <textarea
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            placeholder="Additional ingestion notes, target pipeline, or source maintainer info."
            className={inputClass}
          />
        </div>

        {/* Form Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              darkMode
                ? "text-slate-400 hover:text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0B192C] hover:bg-slate-800 dark:bg-[#D97706] dark:hover:bg-[#B45309] shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            {isEditing ? "Save Changes" : "Create Integration"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
