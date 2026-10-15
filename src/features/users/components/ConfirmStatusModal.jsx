import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import ErrorAlert from "../../../components/feedback/ErrorAlert";

/**
 * ConfirmStatusModal Component
 * Confirmation dialog for suspending or activating accounts.
 */
export default function ConfirmStatusModal({
  user,
  targetStatus,
  isOpen,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user || !targetStatus) return null;

  const isSuspending = targetStatus === "Suspended";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const success = await onConfirm(
        user.id,
        targetStatus,
        reason || `Admin requested status change to ${targetStatus}`,
      );
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
      title={isSuspending ? "Suspend User Account" : "Activate User Account"}
      description={`Confirm status modification for ${user.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSuspending ? (
          <ErrorAlert
            variant="danger"
            title="Account Suspension Warning"
            message="Suspending this account will immediately revoke portal access, halt AI resume ATS tailoring, and pause scheduled mock interview sessions."
          />
        ) : (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
            Activating this account will restore full candidate dashboard features and re-enable active interview prep workflows.
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Reason for status change
          </label>
          <input
            type="text"
            required={isSuspending}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={
              isSuspending
                ? "e.g., Suspicious automated prompt scrapers detected."
                : "e.g., Identity and visa documentation verified."
            }
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:bg-[#161B22] dark:border-[#30363D] dark:text-white focus:bg-white focus:outline-none focus:border-amber-500 font-medium transition-colors"
          />
        </div>

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
            variant={isSuspending ? "danger" : "amber"}
            size="md"
            loading={loading}
          >
            {isSuspending ? "Confirm Suspension" : "Activate Account"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
