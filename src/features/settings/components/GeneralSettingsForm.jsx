import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Building2,
  Globe,
  Sliders,
  History,
  RotateCcw,
  Save,
  Upload,
  Trash2,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { useToast } from "../../../hooks/useToast";
import aifaLogo from "../../../assets/aifa-logo.png";
import { processImageFile, isImageFile } from "../../../utils/imageUtils";

/**
 * Format date & time according to regional controls
 */
function formatRegionalDateTime(date, timezone, dateFormat, timeFormat) {
  try {
    // 1. Timezone-adjusted Date object or formatting
    const timeOptions = {
      timeZone: timezone || "Asia/Kolkata",
      hour12: timeFormat === "12-hour",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const formattedTime = new Intl.DateTimeFormat("en-US", timeOptions).format(date);

    // 2. Date formatting
    const dateOptions = {
      timeZone: timezone || "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
    };
    const parts = new Intl.DateTimeFormat("en-US", dateOptions).formatToParts(date);
    const day = parts.find((p) => p.type === "day")?.value || "13";
    const month = parts.find((p) => p.type === "month")?.value || "Oct";
    const year = parts.find((p) => p.type === "year")?.value || "2026";
    const monthNum = String(new Date().getMonth() + 1).padStart(2, "0");

    let formattedDate = `${month} ${day}, ${year}`;
    if (dateFormat === "13 Oct 2026") {
      formattedDate = `${day} ${month} ${year}`;
    } else if (dateFormat === "13/10/2026") {
      formattedDate = `${day}/${monthNum}/${year}`;
    } else if (dateFormat === "2026-10-13") {
      formattedDate = `${year}-${monthNum}-${day}`;
    }

    return { formattedDate, formattedTime };
  } catch {
    return {
      formattedDate: "Oct 13, 2026",
      formattedTime: "03:15:00 AM",
    };
  }
}

/**
 * GeneralSettingsForm Component
 * Default Settings section containing:
 * - A. Platform Information & Branding
 * - B. Regional Settings with Live Preview
 * - C. Platform Preferences (4 switches)
 * - Actions: View Changes, Reset, Save Changes
 */
export default function GeneralSettingsForm({
  generalSettings,
  onUpdateField,
  onSave,
  onReset,
  onOpenViewChanges,
  isDirty = false,
  isSaving = false,
  errors = {},
  darkMode = false,
}) {
  const { addToast } = useToast();
  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  // Live timer for Regional Preview Card
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { formattedDate, formattedTime } = useMemo(
    () =>
      formatRegionalDateTime(
        currentDate,
        generalSettings.timezone,
        generalSettings.dateFormat,
        generalSettings.timeFormat
      ),
    [
      currentDate,
      generalSettings.timezone,
      generalSettings.dateFormat,
      generalSettings.timeFormat,
    ]
  );

  // Logo file upload handler
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isImageFile(file)) {
      addToast("Please upload a valid image file (PNG, JPG, SVG, or WebP).", "error");
      if (e.target) e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast("Image size must be less than 5MB.", "error");
      if (e.target) e.target.value = "";
      return;
    }

    try {
      const dataUrl = await processImageFile(file, { maxWidth: 512, maxHeight: 512 });
      onUpdateField("general", "logoUrl", dataUrl);
      addToast("Platform logo updated.", "success");
    } catch (err) {
      addToast(err.message || "Failed to process logo image.", "error");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  // Favicon upload handler
  const handleFaviconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isImageFile(file)) {
      addToast("Please upload a valid icon file (PNG, ICO, SVG, or WebP).", "error");
      if (e.target) e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      addToast("Favicon size must be less than 2MB.", "error");
      if (e.target) e.target.value = "";
      return;
    }

    try {
      const dataUrl = await processImageFile(file, { maxWidth: 128, maxHeight: 128 });
      onUpdateField("general", "faviconUrl", dataUrl);
      addToast("Favicon updated.", "success");
    } catch (err) {
      addToast(err.message || "Failed to process favicon.", "error");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveLogo = () => {
    if (window.confirm("Remove custom logo and restore the default emblem?")) {
      onUpdateField("general", "logoUrl", null);
      if (logoInputRef.current) logoInputRef.current.value = "";
      addToast("Restored default brand logo.", "info");
    }
  };

  const handleRemoveFavicon = () => {
    if (window.confirm("Remove custom favicon and restore the default icon?")) {
      onUpdateField("general", "faviconUrl", null);
      if (faviconInputRef.current) faviconInputRef.current.value = "";
      addToast("Restored default favicon.", "info");
    }
  };

  const cardSurface = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90 shadow-2xs";

  const subCardSurface = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/70 border-slate-200/80";

  const inputClass = (hasError) => `w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors ${
    darkMode
      ? `bg-[#0D1117] border ${hasError ? "border-rose-500 text-white" : "border-[#30363D] text-slate-200 focus:border-amber-500"}`
      : `bg-slate-50/80 border ${hasError ? "border-rose-500 text-slate-900" : "border-slate-200 text-slate-900 focus:border-amber-500"}`
  }`;

  const selectClass = `w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors cursor-pointer ${
    darkMode
      ? "bg-[#0D1117] border border-[#30363D] text-slate-200 focus:border-amber-500"
      : "bg-slate-50/80 border border-slate-200 text-slate-900 focus:border-amber-500"
  }`;

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 transition-colors space-y-7 ${cardSurface}`}>
      {/* Top Header of the Main Form */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/70 dark:border-[#30363D]">
        <div>
          <h2
            className={`text-lg font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-[#0B192C]"
            }`}
          >
            General Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure your platform information, branding, and basic preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenViewChanges}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            darkMode
              ? "bg-[#21262D] border-[#30363D] text-slate-200 hover:text-white hover:bg-[#30363D]"
              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 shadow-2xs"
          }`}
        >
          <History className="w-3.5 h-3.5 text-amber-500" />
          <span>View Changes</span>
        </button>
      </div>

      {/* SECTION A: PLATFORM INFORMATION & BRANDING */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3
              className={`text-sm font-bold ${
                darkMode ? "text-white" : "text-[#0B192C]"
              }`}
            >
              Platform Information
            </h3>
            <p className="text-[11px] text-slate-400">
              Basic identification and organizational contact metadata.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 2-Column Fields in Left 2/3 */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Field 1: Platform Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Platform Name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={generalSettings.platformName || ""}
                onChange={(e) => onUpdateField("general", "platformName", e.target.value)}
                placeholder="AIFA GEN LABS"
                className={inputClass(errors.platformName)}
              />
              {errors.platformName && (
                <p className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.platformName}
                </p>
              )}
            </div>

            {/* Field 2: Company Tagline */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Company Tagline <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={generalSettings.companyTagline || ""}
                onChange={(e) => onUpdateField("general", "companyTagline", e.target.value)}
                placeholder="Career Optimization"
                className={inputClass(errors.companyTagline)}
              />
              {errors.companyTagline && (
                <p className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.companyTagline}
                </p>
              )}
            </div>

            {/* Field 3: Support Email */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Support Email <span className="text-amber-500">*</span>
              </label>
              <input
                type="email"
                value={generalSettings.supportEmail || ""}
                onChange={(e) => onUpdateField("general", "supportEmail", e.target.value)}
                placeholder="support@aifagenlabs.com"
                className={inputClass(errors.supportEmail)}
              />
              {errors.supportEmail && (
                <p className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.supportEmail}
                </p>
              )}
            </div>

            {/* Field 4: Contact Number */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Contact Number <span className="text-amber-500">*</span>
              </label>
              <input
                type="tel"
                value={generalSettings.contactNumber || ""}
                onChange={(e) => onUpdateField("general", "contactNumber", e.target.value)}
                placeholder="+91 98765 43210"
                className={inputClass(errors.contactNumber)}
              />
              {errors.contactNumber && (
                <p className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.contactNumber}
                </p>
              )}
            </div>

            {/* Field 5: Company Website */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Company Website <span className="text-amber-500">*</span>
              </label>
              <input
                type="url"
                value={generalSettings.companyWebsite || ""}
                onChange={(e) => onUpdateField("general", "companyWebsite", e.target.value)}
                placeholder="https://aifagenlabs.com"
                className={inputClass(errors.companyWebsite)}
              />
              {errors.companyWebsite && (
                <p className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.companyWebsite}
                </p>
              )}
            </div>

            {/* Field 6: Company Address */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Company Address <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={generalSettings.companyAddress || ""}
                onChange={(e) => onUpdateField("general", "companyAddress", e.target.value)}
                placeholder="Siddipet, Telangana, India"
                className={inputClass(errors.companyAddress)}
              />
              {errors.companyAddress && (
                <p className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.companyAddress}
                </p>
              )}
            </div>
          </div>

          {/* Platform Branding on the Right 1/3 */}
          <div className={`p-4 rounded-xl border space-y-4 ${subCardSurface}`}>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Platform Branding
              </span>
              <p className="text-[10px] text-slate-400">
                Logos appear in user navigation and email notifications.
              </p>
            </div>

            {/* Logo Preview & Action */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 block">
                Platform Logo
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#21262D] border border-slate-200 dark:border-[#30363D] p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                  <img
                    src={generalSettings.logoUrl || aifaLogo}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                      accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,.png,.jpg,.jpeg,.svg,.webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#0B192C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Change Logo</span>
                    </button>

                    {generalSettings.logoUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    PNG, JPG, SVG, or WebP up to 5MB
                  </div>
                </div>
              </div>
            </div>

            {/* Favicon Preview & Action */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-[#30363D]">
              <span className="text-[10px] font-semibold text-slate-400 block">
                Favicon
              </span>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#21262D] border border-slate-200 dark:border-[#30363D] p-1 flex items-center justify-center shrink-0 shadow-2xs">
                  <img
                    src={generalSettings.faviconUrl || aifaLogo}
                    alt="Favicon preview"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={faviconInputRef}
                      onChange={handleFaviconUpload}
                      accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml,image/jpeg,image/webp,.ico,.png,.svg,.jpg,.webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => faviconInputRef.current?.click()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#21262D] text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Change Favicon</span>
                    </button>

                    {generalSettings.faviconUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveFavicon}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove Favicon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    Square 32x32, 64x64 or ICO/SVG
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: REGIONAL SETTINGS */}
      <div className="space-y-4 pt-3 border-t border-slate-200/70 dark:border-[#30363D]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3
              className={`text-sm font-bold ${
                darkMode ? "text-white" : "text-[#0B192C]"
              }`}
            >
              Regional Settings
            </h3>
            <p className="text-[11px] text-slate-400">
              Configure platform localization, timestamps, and active timezone.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Controls: 2x2 grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Language */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Default Language
              </label>
              <select
                value={generalSettings.defaultLanguage || "English (US)"}
                onChange={(e) => onUpdateField("general", "defaultLanguage", e.target.value)}
                className={selectClass}
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Timezone
              </label>
              <select
                value={generalSettings.timezone || "Asia/Kolkata"}
                onChange={(e) => onUpdateField("general", "timezone", e.target.value)}
                className={selectClass}
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+05:30)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST - UTC-05:00)</option>
                <option value="Europe/London">Europe/London (GMT - UTC+00:00)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST - UTC+04:00)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT - UTC+08:00)</option>
              </select>
            </div>

            {/* Date Format */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Date Format
              </label>
              <select
                value={generalSettings.dateFormat || "Oct 13, 2026"}
                onChange={(e) => onUpdateField("general", "dateFormat", e.target.value)}
                className={selectClass}
              >
                <option value="Oct 13, 2026">Oct 13, 2026 (Mon DD, YYYY)</option>
                <option value="13 Oct 2026">13 Oct 2026 (DD Mon YYYY)</option>
                <option value="13/10/2026">13/10/2026 (DD/MM/YYYY)</option>
                <option value="2026-10-13">2026-10-13 (YYYY-MM-DD)</option>
              </select>
            </div>

            {/* Time Format */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Time Format
              </label>
              <select
                value={generalSettings.timeFormat || "12-hour"}
                onChange={(e) => onUpdateField("general", "timeFormat", e.target.value)}
                className={selectClass}
              >
                <option value="12-hour">12-hour (e.g., 03:15:00 AM/PM)</option>
                <option value="24-hour">24-hour (e.g., 15:15:00)</option>
              </select>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${subCardSurface}`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Regional Live Preview
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Clock
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Current Date</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Current Time</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {formattedTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 dark:border-[#30363D] text-[10px] text-slate-400">
              Active Zone: <span className="font-semibold text-slate-600 dark:text-slate-300">{generalSettings.timezone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION C: PLATFORM PREFERENCES */}
      <div className="space-y-4 pt-3 border-t border-slate-200/70 dark:border-[#30363D]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3
              className={`text-sm font-bold ${
                darkMode ? "text-white" : "text-[#0B192C]"
              }`}
            >
              Platform Preferences
            </h3>
            <p className="text-[11px] text-slate-400">
              Manage platform accessibility, registrations, telemetry, and notifications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Switch 1: Maintenance Mode */}
          <div
            className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${subCardSurface}`}
          >
            <div className="space-y-0.5 min-w-0">
              <label
                htmlFor="toggle-maintenance"
                className={`text-xs font-bold block cursor-pointer ${
                  darkMode ? "text-slate-200" : "text-slate-900"
                }`}
              >
                Enable Maintenance Mode
              </label>
              <p className="text-[11px] text-slate-400 leading-snug">
                Temporarily restrict platform access for maintenance
              </p>
            </div>
            <button
              id="toggle-maintenance"
              type="button"
              role="switch"
              aria-checked={generalSettings.enableMaintenanceMode}
              onClick={() =>
                onUpdateField(
                  "general",
                  "enableMaintenanceMode",
                  !generalSettings.enableMaintenanceMode
                )
              }
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                generalSettings.enableMaintenanceMode ? "bg-[#D97706]" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  generalSettings.enableMaintenanceMode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Switch 2: User Registration */}
          <div
            className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${subCardSurface}`}
          >
            <div className="space-y-0.5 min-w-0">
              <label
                htmlFor="toggle-registration"
                className={`text-xs font-bold block cursor-pointer ${
                  darkMode ? "text-slate-200" : "text-slate-900"
                }`}
              >
                Allow User Registration
              </label>
              <p className="text-[11px] text-slate-400 leading-snug">
                Allow new users to create accounts
              </p>
            </div>
            <button
              id="toggle-registration"
              type="button"
              role="switch"
              aria-checked={generalSettings.allowUserRegistration}
              onClick={() =>
                onUpdateField(
                  "general",
                  "allowUserRegistration",
                  !generalSettings.allowUserRegistration
                )
              }
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                generalSettings.allowUserRegistration ? "bg-[#D97706]" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  generalSettings.allowUserRegistration ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Switch 3: Email Notifications */}
          <div
            className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${subCardSurface}`}
          >
            <div className="space-y-0.5 min-w-0">
              <label
                htmlFor="toggle-email-notif"
                className={`text-xs font-bold block cursor-pointer ${
                  darkMode ? "text-slate-200" : "text-slate-900"
                }`}
              >
                Enable Email Notifications
              </label>
              <p className="text-[11px] text-slate-400 leading-snug">
                Send system notifications to administrators
              </p>
            </div>
            <button
              id="toggle-email-notif"
              type="button"
              role="switch"
              aria-checked={generalSettings.enableEmailNotifications}
              onClick={() =>
                onUpdateField(
                  "general",
                  "enableEmailNotifications",
                  !generalSettings.enableEmailNotifications
                )
              }
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                generalSettings.enableEmailNotifications ? "bg-[#D97706]" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  generalSettings.enableEmailNotifications ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Switch 4: Analytics Tracking */}
          <div
            className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${subCardSurface}`}
          >
            <div className="space-y-0.5 min-w-0">
              <label
                htmlFor="toggle-analytics"
                className={`text-xs font-bold block cursor-pointer ${
                  darkMode ? "text-slate-200" : "text-slate-900"
                }`}
              >
                Enable Analytics Tracking
              </label>
              <p className="text-[11px] text-slate-400 leading-snug">
                Collect usage analytics and performance data
              </p>
            </div>
            <button
              id="toggle-analytics"
              type="button"
              role="switch"
              aria-checked={generalSettings.enableAnalyticsTracking}
              onClick={() =>
                onUpdateField(
                  "general",
                  "enableAnalyticsTracking",
                  !generalSettings.enableAnalyticsTracking
                )
              }
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                generalSettings.enableAnalyticsTracking ? "bg-[#D97706]" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  generalSettings.enableAnalyticsTracking ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* FORM ACTIONS (RESET & SAVE CHANGES) */}
      <div className="pt-5 border-t border-slate-200/70 dark:border-[#30363D] flex items-center justify-between gap-3">
        <div>
          {isDirty && (
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
              ● Unsaved changes pending review
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              darkMode
                ? "bg-[#21262D] border-[#30363D] text-slate-300 hover:text-white hover:bg-[#30363D]"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0B192C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
