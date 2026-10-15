import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

/**
 * AddUserModal Component
 * Form modal to provision a new user account.
 */
export default function AddUserModal({ isOpen, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Candidate",
    plan: "Basic",
    countryGoal: "United Kingdom",
    targetVisa: "Skilled Worker Visa",
    domain: "Full Stack",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are required fields.");
      return;
    }
    if (!formData.email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const success = await onConfirm(formData);
      if (success) {
        setFormData({
          name: "",
          email: "",
          role: "Candidate",
          plan: "Basic",
          countryGoal: "United Kingdom",
          targetVisa: "Skilled Worker Visa",
          domain: "Full Stack",
        });
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
      title="Provision New User Account"
      description="Add a candidate or administrator to the AIFA console."
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Name"
          required
          placeholder="e.g., Priya Patel"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <Input
          label="Email Address"
          type="email"
          required
          placeholder="e.g., priya.p@outlook.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            options={[
              { value: "Candidate", label: "Candidate" },
              { value: "Recruiter", label: "Recruiter" },
              { value: "Admin", label: "Admin" },
            ]}
          />

          <Select
            label="Package Level"
            value={formData.plan}
            onChange={(e) => handleChange("plan", e.target.value)}
            options={[
              { value: "None", label: "None (Unenrolled)" },
              { value: "Basic", label: "Basic Tier ($45)" },
              { value: "Premium", label: "Premium Tier ($149)" },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Target Country"
            placeholder="e.g., Germany"
            value={formData.countryGoal}
            onChange={(e) => handleChange("countryGoal", e.target.value)}
          />

          <Input
            label="Technical Track"
            placeholder="e.g., DevOps"
            value={formData.domain}
            onChange={(e) => handleChange("domain", e.target.value)}
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" size="md" loading={loading}>
            Create User Account
          </Button>
        </div>
      </form>
    </Modal>
  );
}
