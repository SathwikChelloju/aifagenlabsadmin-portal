import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Badge from "../../../components/ui/Badge";
import { getPlanBadgeVariant } from "../utils/userUtils";

/**
 * ChangePlanModal Component
 * Modal to modify candidate subscription package with mandatory audit logging.
 */
export default function ChangePlanModal({
  user,
  isOpen,
  onClose,
  onConfirm,
}) {
  const [selectedPlan, setSelectedPlan] = useState(user?.plan || "Premium");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prevUser, setPrevUser] = useState(user);

  if (user !== prevUser) {
    setPrevUser(user);
    setSelectedPlan(user?.plan || "Premium");
    setReason("");
    setError("");
  }

  if (!user) return null;

  const isSamePlan = user.plan === selectedPlan;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSamePlan) {
      setError("User is already enrolled in the selected tier.");
      return;
    }
    if (!reason.trim()) {
      setError("An audit reason is mandatory for compliance.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const success = await onConfirm(user.id, selectedPlan, reason);
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
      title="Modify Subscription Tier"
      description={`Update package level for ${user.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Summary Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200/80 dark:border-[#30363D] flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
            <div className="text-slate-400 font-mono text-[11px]">{user.email}</div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Current:</span>
            <Badge variant={getPlanBadgeVariant(user.plan)} size="sm">
              {user.plan}
            </Badge>
          </div>
        </div>

        {/* Tier Selector */}
        <div>
          <Select
            label="Target Subscription Package"
            value={selectedPlan}
            onChange={(e) => {
              setSelectedPlan(e.target.value);
              setError("");
            }}
            options={[
              { value: "None", label: "None — Unenrolled Tier ($0/mo)" },
              { value: "Basic", label: "Basic Application Tier ($45/mo)" },
              { value: "Premium", label: "Premium Concierge Tier ($149/mo)" },
            ]}
          />
        </div>

        {/* Mandatory Reason */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Mandatory Audit Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            placeholder="e.g., Extended student tier for UK visa sponsorship timeline."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 dark:bg-[#161B22] dark:border-[#30363D] dark:text-white focus:bg-white focus:outline-none focus:border-amber-500 placeholder:text-slate-400 transition-colors font-medium resize-none"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
        )}

        {/* Actions */}
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

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            disabled={isSamePlan}
          >
            Commit to Audit Log
          </Button>
        </div>
      </form>
    </Modal>
  );
}
