import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { formatCurrency } from "../utils/paymentUtils";

/**
 * IssueRefundModal Component
 * Confirmation dialog for reversing a settled payment transaction.
 */
export default function IssueRefundModal({
  transaction,
  isOpen,
  onClose,
  onConfirm,
  _darkMode = false,
}) {
  const [reason, setReason] = useState("Customer requested cancellation within 48h cooling off policy");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!transaction) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setIsSubmitting(true);
    await onConfirm(transaction.id, reason);
    setIsSubmitting(false);
    onClose();
  };

  const amountStr = formatCurrency(transaction.amount, transaction.currency, transaction.currencySymbol);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Transaction Refund"
      description={`Process reversal for ${transaction.id}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Warning Callout */}
        <div className="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-800 dark:text-amber-300">
              Simulated Ledger Reversal (Demo Sandbox)
            </p>
            <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
              This updates local mock state to mark transaction <strong>{transaction.id}</strong> as Refunded and records an audit log entry. In this frontend environment, no actual bank funds are transferred.
            </p>
          </div>
        </div>

        {/* Transaction Summary Card */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#30363D] bg-slate-50 dark:bg-[#0D1117] text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Customer:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {transaction.userName || transaction.candidateName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Refund Amount:</span>
            <span className="font-mono font-extrabold text-slate-900 dark:text-white">
              {amountStr}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Original Method:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {transaction.paymentMethod}
            </span>
          </div>
        </div>

        {/* Reason Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Audit Refund Justification <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this refund is being granted..."
            required
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#0D1117] text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-[#30363D]">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            size="sm"
            icon={RotateCcw}
            disabled={isSubmitting || !reason.trim()}
          >
            {isSubmitting ? "Processing..." : `Refund ${amountStr}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
