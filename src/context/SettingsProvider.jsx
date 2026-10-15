import React, { useState, useMemo, useCallback, useEffect } from "react";
import { mockStore } from "../mocks/mockStore";
import { useToast } from "../hooks/useToast";
import { updateFavicon, updateDocumentTitle } from "../utils/favicon";
import aifaLogo from "../assets/aifa-logo.png";
import {
  SettingsContext,
  STORAGE_KEY,
  loadInitialSettings,
  validateGeneralSettings,
} from "./SettingsContext";

export function SettingsProvider({ children }) {
  const { addToast } = useToast();

  const [savedSettings, setSavedSettings] = useState(() => loadInitialSettings());
  const [settings, setSettings] = useState(() => loadInitialSettings());
  const [activeSection, setActiveSection] = useState("general");
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Unsaved changes confirmation dialog state
  const [pendingSection, setPendingSection] = useState(null);
  const [isPendingSwitchModalOpen, setIsPendingSwitchModalOpen] = useState(false);

  // View Changes Modal state
  const [isViewChangesModalOpen, setIsViewChangesModalOpen] = useState(false);

  // Synchronize document Favicon in real-time
  useEffect(() => {
    const activeFavicon =
      settings?.general?.faviconUrl ||
      savedSettings?.general?.faviconUrl ||
      settings?.general?.logoUrl ||
      savedSettings?.general?.logoUrl ||
      aifaLogo;

    updateFavicon(activeFavicon);
  }, [
    settings?.general?.faviconUrl,
    savedSettings?.general?.faviconUrl,
    settings?.general?.logoUrl,
    savedSettings?.general?.logoUrl,
  ]);

  // Synchronize document Title in real-time
  useEffect(() => {
    const activeName =
      settings?.general?.platformName ||
      savedSettings?.general?.platformName ||
      "AIFA GEN LABS";

    updateDocumentTitle(`${activeName} Admin Portal`);
  }, [settings?.general?.platformName, savedSettings?.general?.platformName]);

  // Deep diffing calculation
  const diffs = useMemo(() => {
    const changes = [];
    const labels = {
      platformName: "Platform Name",
      companyTagline: "Company Tagline",
      supportEmail: "Support Email",
      contactNumber: "Contact Number",
      companyWebsite: "Company Website",
      companyAddress: "Company Address",
      logoUrl: "Platform Logo",
      faviconUrl: "Favicon",
      defaultLanguage: "Default Language",
      timezone: "Timezone",
      dateFormat: "Date Format",
      timeFormat: "Time Format",
      enableMaintenanceMode: "Maintenance Mode",
      allowUserRegistration: "User Registration",
      enableEmailNotifications: "Email Notifications",
      enableAnalyticsTracking: "Analytics Tracking",
      fullName: "Full Name",
      email: "Profile Email",
      phone: "Phone Number",
      department: "Department",
      bio: "Bio",
      crawlerIntervalMinutes: "Crawler Polling Interval",
      duplicateDetection: "Duplicate Detection Mode",
      defaultVisibility: "Default Job Visibility",
      autoExpireDays: "Auto-Expire Threshold",
      autoSyncOnStartup: "Auto-Sync on Startup",
      sessionTimeout: "Session Timeout",
      twoFactorAuth: "Two-Factor Authentication",
      minPasswordLength: "Minimum Password Length",
      ipWhitelist: "IP Whitelist",
      retentionDays: "Audit Retention Days",
    };

    function compareSection(secKey, secLabel) {
      const curSec = settings[secKey];
      const prevSec = savedSettings[secKey];
      if (!curSec || !prevSec) return;

      Object.keys(curSec).forEach((key) => {
        const curVal = curSec[key];
        const prevVal = prevSec[key];
        if (JSON.stringify(curVal) !== JSON.stringify(prevVal)) {
          changes.push({
            section: secKey,
            sectionLabel: secLabel,
            field: key,
            label: labels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
            previous: prevVal,
            current: curVal,
          });
        }
      });
    }

    compareSection("general", "General Settings");
    compareSection("profile", "Profile Settings");
    compareSection("notifications", "Notifications");
    compareSection("jobAggregation", "Job Aggregation");
    compareSection("security", "Security");
    compareSection("auditRetention", "Audit & Data Retention");

    return changes;
  }, [settings, savedSettings]);

  const isDirty = diffs.length > 0;

  // Field updater
  const updateField = useCallback((section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // Clear inline error if field was edited
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }, []);

  // Update whole section (e.g. team member array or integrations)
  const updateSection = useCallback((section, data) => {
    setSettings((prev) => ({
      ...prev,
      [section]: data,
    }));
  }, []);

  // Section switcher with unsaved guard
  const requestSwitchSection = useCallback(
    (newSectionId) => {
      if (newSectionId === activeSection) return;
      if (isDirty) {
        setPendingSection(newSectionId);
        setIsPendingSwitchModalOpen(true);
      } else {
        setActiveSection(newSectionId);
        setErrors({});
      }
    },
    [activeSection, isDirty]
  );

  const confirmDiscardAndSwitch = useCallback(() => {
    setSettings(JSON.parse(JSON.stringify(savedSettings)));
    setErrors({});
    if (pendingSection) {
      setActiveSection(pendingSection);
      setPendingSection(null);
    }
    setIsPendingSwitchModalOpen(false);
    addToast("Discarded unsaved changes.", "info");
  }, [savedSettings, pendingSection, addToast]);

  const cancelSwitchSection = useCallback(() => {
    setPendingSection(null);
    setIsPendingSwitchModalOpen(false);
  }, []);

  // Save changes handler
  const saveChanges = useCallback(async () => {
    // Validate active section
    if (activeSection === "general") {
      const fieldErrors = validateGeneralSettings(settings.general);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        addToast("Please correct the errors in the form before saving.", "error");
        return false;
      }
    }

    setIsSaving(true);
    try {
      // Simulate rapid async persistence
      await new Promise((resolve) => setTimeout(resolve, 250));

      const updated = JSON.parse(JSON.stringify(settings));
      setSavedSettings(updated);
      setErrors({});

      // Persist safe configuration to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn("localStorage persistence error:", err);
      }

      // Record audit event in mockStore
      try {
        const now = new Date();
        const formattedDate = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
        mockStore.state.auditLogs.unshift({
          id: `aud_${Date.now()}`,
          timestamp: formattedDate,
          admin: "admin@aifagen.com",
          action: "SETTINGS_UPDATED",
          target: `${activeSection.toUpperCase()}_CONFIGURATION`,
          details: `Updated settings with ${diffs.length} modified parameter(s)`,
          reason: "Administrator platform configuration update",
        });
        mockStore.notify();
      } catch (err) {
        console.warn("Audit log recording error:", err);
      }

      addToast("Settings successfully saved and applied.", "success");
      return true;
    } catch (err) {
      console.error(err);
      addToast("Failed to save settings.", "error");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [activeSection, settings, diffs.length, addToast]);

  const confirmSaveAndSwitch = useCallback(async () => {
    const success = await saveChanges();
    if (success && pendingSection) {
      setActiveSection(pendingSection);
      setPendingSection(null);
      setIsPendingSwitchModalOpen(false);
    }
  }, [saveChanges, pendingSection]);

  // Reset to last saved
  const resetToSaved = useCallback(() => {
    setSettings(JSON.parse(JSON.stringify(savedSettings)));
    setErrors({});
    addToast("Form restored to last saved configuration.", "info");
  }, [savedSettings, addToast]);

  const value = {
    settings,
    savedSettings,
    activeSection,
    setActiveSection,
    requestSwitchSection,
    updateField,
    updateSection,
    errors,
    diffs,
    isDirty,
    isSaving,
    saveChanges,
    resetToSaved,
    // Switch modal
    isPendingSwitchModalOpen,
    pendingSection,
    confirmDiscardAndSwitch,
    confirmSaveAndSwitch,
    cancelSwitchSection,
    // View changes modal
    isViewChangesModalOpen,
    setIsViewChangesModalOpen,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
