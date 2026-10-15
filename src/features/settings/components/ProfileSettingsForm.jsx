import React, { useState } from "react";
import {
  KeyRound,
  Smartphone,
  Laptop,
  AlertCircle,
} from "lucide-react";
import { useToast } from "../../../hooks/useToast";
import aifaLogo from "../../../assets/aifa-logo.png";

export default function ProfileSettingsForm({
  profileSettings,
  onUpdateField,
  onSave,
  onReset,
  _isDirty = false,
  isSaving = false,
  darkMode = false,
}) {
  const { addToast } = useToast();
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });
  const [passError, setPassError] = useState("");

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.current) {
      setPassError("Please enter your current password.");
      return;
    }
    if (passwords.newPass.length < 8) {
      setPassError("New password must be at least 8 characters.");
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      setPassError("New passwords do not match.");
      return;
    }

    setPassError("");
    setPasswords({ current: "", newPass: "", confirmPass: "" });
    addToast("Password changed successfully (frontend mock).", "success");
  };

  const cardSurface = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90 shadow-2xs";

  const subCardSurface = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/70 border-slate-200/80";

  const inputClass = `w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors ${
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
          Profile Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal account credentials, role details, and active sessions.
        </p>
      </div>

      {/* Account Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200/70 dark:border-[#30363D] bg-slate-50/50 dark:bg-[#0D1117]">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-black flex items-center justify-center shadow-xs shrink-0 border border-slate-700/50">
            <img
              src={aifaLogo}
              alt="Admin AIFA"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold truncate ${darkMode ? "text-white" : "text-[#0B192C]"}`}>
                {profileSettings.fullName || "Admin AIFA"}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                {profileSettings.role || "Super Administrator"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              {profileSettings.email || "admin@aifagen.com"}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Active since Sep 2026 • Security Clearance Tier 1
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={profileSettings.fullName || ""}
              onChange={(e) => onUpdateField("profile", "fullName", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={profileSettings.email || ""}
              onChange={(e) => onUpdateField("profile", "email", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileSettings.phone || ""}
              onChange={(e) => onUpdateField("profile", "phone", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Department
            </label>
            <input
              type="text"
              value={profileSettings.department || ""}
              onChange={(e) => onUpdateField("profile", "department", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Bio & Role Description
            </label>
            <textarea
              rows={2}
              value={profileSettings.bio || ""}
              onChange={(e) => onUpdateField("profile", "bio", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className={`p-4 rounded-xl border space-y-3 ${subCardSurface}`}>
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-500" />
          <h4 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-white" : "text-[#0B192C]"}`}>
            Change Password
          </h4>
        </div>

        <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.confirmPass}
              onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
              className={inputClass}
            />
          </div>

          {passError && (
            <div className="sm:col-span-3 text-[11px] text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          <div className="sm:col-span-3 flex justify-end pt-1">
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0B192C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Active Sessions */}
      <div className="space-y-3">
        <h4 className={`text-xs font-bold uppercase tracking-wider text-slate-400`}>
          Active Login Sessions
        </h4>
        <div className="space-y-2">
          <div className="p-3 rounded-xl border border-slate-200 dark:border-[#30363D] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <Laptop className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  macOS Chrome 130 • Hyderabad, India
                </span>
                <span className="text-[11px] text-slate-400">
                  Current Session • IP 103.21.244.18
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              Active Now
            </span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-[#30363D] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  iOS Mobile Safari • Bengaluru, India
                </span>
                <span className="text-[11px] text-slate-400">
                  Last active 3 hours ago
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => addToast("Revoked mobile session.", "info")}
              className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline font-semibold cursor-pointer"
            >
              Revoke
            </button>
          </div>
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
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
