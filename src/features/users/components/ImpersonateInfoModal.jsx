import React from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { ShieldCheck, Lock } from "lucide-react";

/**
 * ImpersonateInfoModal Component
 * Informs administrator about session security policy and read-only status.
 */
export default function ImpersonateInfoModal({
  user,
  isOpen,
  onClose,
}) {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Administrative Impersonation Policy"
      description={`Session takeover rules for ${user.name}`}
      size="md"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
            <strong>Candidate Privacy Policy:</strong> Direct candidate session takeover is locked under SOC2 multi-tenant compliance controls. Elevated Level-3 keys are required to impersonate active student accounts.
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span>Target Account:</span>
            <span className="font-bold text-slate-900 dark:text-white">{user.name}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>User ID:</span>
            <span className="font-mono text-slate-800 dark:text-slate-300">{user.id}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Access Mode:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Full Audit Inspection
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          You may review resumes, ATS scores, application status, and modify subscriptions directly through this inspection drawer.
        </p>

        <div className="pt-3 flex items-center justify-end border-t border-slate-100 dark:border-[#30363D]">
          <Button variant="primary" size="sm" onClick={onClose}>
            Acknowledge
          </Button>
        </div>
      </div>
    </Modal>
  );
}
