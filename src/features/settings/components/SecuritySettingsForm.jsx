import React from "react";
import { AlertCircle } from "lucide-react";

export default function SecuritySettingsForm({
  security = {},
  onUpdateField,
  onSave,
  onReset,
  _isDirty = false,
  isSaving = false,
  darkMode = false,
}) {
  const cardSurface = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90 shadow-2xs";

  const subCardSurface = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/70 border-slate-200/80";

  const selectClass = `w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors cursor-pointer ${
    darkMode
      ? "bg-[#0D1117] border border-[#30363D] text-slate-200 focus:border-amber-500"
      : "bg-slate-50/80 border border-slate-200 text-slate-900 focus:border-amber-500"
  }`;

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 transition-colors space-y-7 ${cardSurface}`}>
      <div>
        <h2
          className={`text-lg font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-[#0B192C]"
          }`}
        >
          Security & Access Hardening
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure authentication timeouts, multi-factor enforcement, and trusted IP ranges.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Session Timeout */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Admin Inactivity Timeout
          </label>
          <select
            value={security.sessionTimeout || "30 minutes"}
            onChange={(e) => onUpdateField("security", "sessionTimeout", e.target.value)}
            className={selectClass}
          >
            <option value="15 minutes">15 minutes (Strict)</option>
            <option value="30 minutes">30 minutes (Recommended)</option>
            <option value="1 hour">1 hour</option>
            <option value="4 hours">4 hours</option>
            <option value="1 day">24 hours</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Automatically closes idle sessions to prevent unauthorized device access.
          </p>
        </div>

        {/* Password Expiry */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Password Rotation Cycle
          </label>
          <select
            value={security.passwordExpiryDays || 90}
            onChange={(e) =>
              onUpdateField("security", "passwordExpiryDays", Number(e.target.value))
            }
            className={selectClass}
          >
            <option value={60}>Every 60 Days</option>
            <option value={90}>Every 90 Days (SOC 2 Standard)</option>
            <option value={180}>Every 180 Days</option>
            <option value={0}>Never Expire</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">
            Prompts administrators to rotate passwords at scheduled intervals.
          </p>
        </div>
      </div>

      {/* Security Switches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${subCardSurface}`}
        >
          <div className="space-y-0.5 min-w-0">
            <span className={`text-xs font-bold block ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
              Two-Factor Authentication (2FA)
            </span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Require TOTP authenticator app verification upon login
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={security.twoFactorAuth}
            onClick={() =>
              onUpdateField("security", "twoFactorAuth", !security.twoFactorAuth)
            }
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              security.twoFactorAuth ? "bg-[#D97706]" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                security.twoFactorAuth ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div
          className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${subCardSurface}`}
        >
          <div className="space-y-0.5 min-w-0">
            <span className={`text-xs font-bold block ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
              Unrecognized Device Alerts
            </span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Send verification challenge when logging in from new IP
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={security.alertOnNewDevice}
            onClick={() =>
              onUpdateField("security", "alertOnNewDevice", !security.alertOnNewDevice)
            }
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              security.alertOnNewDevice ? "bg-[#D97706]" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                security.alertOnNewDevice ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* IP Whitelist CIDRs */}
      <div className={`p-4 rounded-xl border space-y-2 ${subCardSurface}`}>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Trusted IP Whitelist CIDRs
        </label>
        <p className="text-xs text-slate-400">
          Restrict access to designated corporate VPNs or office network blocks (comma-separated).
        </p>
        <textarea
          rows={2}
          value={security.ipWhitelist || ""}
          onChange={(e) => onUpdateField("security", "ipWhitelist", e.target.value)}
          placeholder="103.21.244.0/24, 14.139.0.0/16"
          className={`w-full rounded-xl px-3.5 py-2 text-xs font-mono border focus:outline-none ${
            darkMode
              ? "bg-[#161B22] border-[#30363D] text-white"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        />
        <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Note: Network policies are simulated locally on frontend until gateway proxy integration.</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-200/70 dark:border-[#30363D] flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onReset}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
            darkMode
              ? "bg-[#21262D] border-[#30363D] text-slate-300 hover:text-white"
              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0B192C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Security Rules"}
        </button>
      </div>
    </div>
  );
}
