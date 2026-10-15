import React, { useState } from "react";
import { ShieldCheck, DollarSign } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function AiBudgetConfigModal({
  isOpen,
  onClose,
  initialBudget,
  onSave,
}) {
  const [monthlyBudget, setMonthlyBudget] = useState(
    initialBudget?.monthlyBudgetUsd || 2000
  );
  const [warningThreshold, setWarningThreshold] = useState(
    initialBudget?.warningThresholdPct || 75
  );
  const [criticalThreshold, setCriticalThreshold] = useState(
    initialBudget?.criticalThresholdPct || 90
  );
  const [notificationEmail, setNotificationEmail] = useState(
    initialBudget?.notificationEmail || "admin@aifagen.com"
  );

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const budgetVal = parseFloat(monthlyBudget);
    const warnVal = parseInt(warningThreshold, 10);
    const critVal = parseInt(criticalThreshold, 10);

    if (isNaN(budgetVal) || budgetVal < 0) {
      setError("Please specify a valid non-negative monthly budget.");
      return;
    }
    if (isNaN(warnVal) || warnVal < 1 || warnVal > 100) {
      setError("Warning threshold must be between 1% and 100%.");
      return;
    }
    if (isNaN(critVal) || critVal < 1 || critVal > 100) {
      setError("Critical threshold must be between 1% and 100%.");
      return;
    }
    if (warnVal >= critVal) {
      setError("Warning threshold must be less than critical threshold.");
      return;
    }

    setError("");
    onSave({
      monthlyBudgetUsd: budgetVal,
      warningThresholdPct: warnVal,
      criticalThresholdPct: critVal,
      notificationEmail,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure AI Budget Governance"
      description="Set monthly compute spending limits, alert warning thresholds, and operator notifications."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Monthly Budget Input */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono text-[11px]">
            Monthly AI Budget ($ USD)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              min="0"
              step="50"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-[#30363D] bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">
            Ceiling applies across OpenAI, Anthropic, Google, and Mistral inference endpoints.
          </p>
        </div>

        {/* Thresholds Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono text-[11px]">
              Warning Threshold (%)
            </label>
            <input
              type="number"
              min="1"
              max="99"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#30363D] bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              required
            />
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              Triggers amber banner in console
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono text-[11px]">
              Critical Threshold (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#30363D] bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              required
            />
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              Escalates to ops duty officer
            </p>
          </div>
        </div>

        {/* Notification Email */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono text-[11px]">
            Alert Recipient Email
          </label>
          <input
            type="email"
            value={notificationEmail}
            onChange={(e) => setNotificationEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#30363D] bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
            required
          />
        </div>

        {/* Governance Disclaimer */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            <strong>Simulation Note:</strong> In this admin portal simulation, updating the monthly budget recalculates remaining allocation immediately and records an audit log entry.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-500/10 flex items-center justify-end gap-2.5">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="amber" type="submit">
            Save Governance Policy
          </Button>
        </div>
      </form>
    </Modal>
  );
}
