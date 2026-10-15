import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

/**
 * EditProfileModal Component
 * Allows editing user's key profile fields with validation.
 */
export default function EditProfileModal({
  user,
  isOpen,
  onClose,
  onSave,
  darkMode = false,
}) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    domain: user?.domain || "",
    headline: user?.headline || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prevUser, setPrevUser] = useState(user);

  // Sync state if user changes
  if (user !== prevUser) {
    setPrevUser(user);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      domain: user?.domain || "",
      headline: user?.headline || "",
    });
    setError("");
  }

  if (!user) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are mandatory fields.");
      return;
    }
    if (!formData.email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const success = await onSave(user.id, formData);
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User Profile"
      description={`Update administrative details for ${user.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Aarav Patel"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="e.g. candidate@example.com"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Phone / Mobile"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="e.g. +44 7700 900142"
          />

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="e.g. London, United Kingdom"
          />
        </div>

        <Input
          label="Area of Interest / Domain"
          value={formData.domain}
          onChange={(e) => handleChange("domain", e.target.value)}
          placeholder="e.g. DevOps & SRE"
        />

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Professional Headline
          </label>
          <textarea
            rows={2}
            value={formData.headline}
            onChange={(e) => handleChange("headline", e.target.value)}
            placeholder="e.g. Lead Site Reliability Engineer · Kubernetes & Terraform Specialist"
            className={`w-full px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-colors focus:outline-none focus:border-amber-500 ${
              darkMode
                ? "bg-[#0D1117] border-[#30363D] text-white"
                : "bg-slate-50 border-slate-200 text-slate-900"
            }`}
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-[#30363D]">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
