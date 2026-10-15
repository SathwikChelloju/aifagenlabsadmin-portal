import { createContext, useContext } from "react";
import { DEFAULT_SETTINGS } from "../features/settings/constants/settingsData";

export const STORAGE_KEY = "aifa_admin_settings_v1";

export function loadInitialSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        general: { ...DEFAULT_SETTINGS.general, ...(parsed.general || {}) },
        profile: { ...DEFAULT_SETTINGS.profile, ...(parsed.profile || {}) },
        notifications: { ...DEFAULT_SETTINGS.notifications, ...(parsed.notifications || {}) },
        jobAggregation: { ...DEFAULT_SETTINGS.jobAggregation, ...(parsed.jobAggregation || {}) },
        security: { ...DEFAULT_SETTINGS.security, ...(parsed.security || {}) },
        billing: { ...DEFAULT_SETTINGS.billing, ...(parsed.billing || {}) },
        auditRetention: { ...DEFAULT_SETTINGS.auditRetention, ...(parsed.auditRetention || {}) },
      };
    }
  } catch (err) {
    console.warn("Failed to load settings from localStorage:", err);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Validates General Settings fields
 */
export function validateGeneralSettings(general) {
  const errors = {};
  if (!general.platformName || !general.platformName.trim()) {
    errors.platformName = "Platform Name is required.";
  }
  if (!general.companyTagline || !general.companyTagline.trim()) {
    errors.companyTagline = "Company Tagline is required.";
  }
  if (!general.supportEmail || !general.supportEmail.trim()) {
    errors.supportEmail = "Support Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(general.supportEmail.trim())) {
    errors.supportEmail = "Enter a valid email address (e.g., support@domain.com).";
  }
  if (!general.contactNumber || !general.contactNumber.trim()) {
    errors.contactNumber = "Contact Number is required.";
  }
  if (!general.companyWebsite || !general.companyWebsite.trim()) {
    errors.companyWebsite = "Company Website is required.";
  } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(general.companyWebsite.trim())) {
    errors.companyWebsite = "Enter a valid website URL (e.g., https://aifagenlabs.com).";
  }
  if (!general.companyAddress || !general.companyAddress.trim()) {
    errors.companyAddress = "Company Address is required.";
  }
  return errors;
}

export const SettingsContext = createContext(null);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    const fallbackSettings = loadInitialSettings();
    return {
      settings: fallbackSettings,
      savedSettings: fallbackSettings,
      activeSection: "general",
      setActiveSection: () => {},
      requestSwitchSection: () => {},
      updateField: () => {},
      updateSection: () => {},
      errors: {},
      diffs: [],
      isDirty: false,
      isSaving: false,
      saveChanges: async () => false,
      resetToSaved: () => {},
      isPendingSwitchModalOpen: false,
      pendingSection: null,
      confirmDiscardAndSwitch: () => {},
      confirmSaveAndSwitch: () => {},
      cancelSwitchSection: () => {},
      isViewChangesModalOpen: false,
      setIsViewChangesModalOpen: () => {},
    };
  }
  return context;
}
