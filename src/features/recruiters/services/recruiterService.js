/**
 * Centralized Recruiter Service
 * AIFA GEN LABS Admin Portal
 *
 * Manages recruiter records with localStorage persistence, validation,
 * deterministic date calculations, and reactive subscriptions.
 */

import { INITIAL_RECRUITERS } from "../data/mockRecruiters.js";

const STORAGE_KEY = "aifa_admin_recruiters_v2";

/**
 * Robust date formatting: converts any ISO / standard date string to "Jan 15, 2024"
 */
export const formatJoinedDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Determines if a given date falls within a selected time filter
 * Reference Time: Oct 14, 2026 (matching app context)
 */
export const isDateWithinFilter = (dateString, filterOption) => {
  if (!filterOption || filterOption === "All Time") return true;
  if (!dateString) return false;

  const targetDate = new Date(dateString);
  if (isNaN(targetDate.getTime())) return true;

  // Use app reference context: Oct 14, 2026
  const refNow = new Date("2026-10-14T23:59:59Z");
  const diffMs = refNow.getTime() - targetDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < -1) return false; // In future

  switch (filterOption) {
    case "Last 7 Days":
      return diffDays <= 7;
    case "Last 30 Days":
      return diffDays <= 30;
    case "Last 90 Days":
      return diffDays <= 90;
    default:
      return true;
  }
};

class RecruiterService {
  constructor() {
    this.listeners = new Set();
    this.recruiters = this.loadRecruiters();
  }

  loadRecruiters() {
    if (typeof window === "undefined" || !window.localStorage) {
      return [...INITIAL_RECRUITERS];
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [...INITIAL_RECRUITERS];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Normalize each record
        return parsed.map((r) => this.normalizeRecruiter(r));
      }
      return [...INITIAL_RECRUITERS];
    } catch {
      return [...INITIAL_RECRUITERS];
    }
  }

  saveRecruiters(list) {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("RecruiterService storage write error:", e);
    }
  }

  normalizeRecruiter(r) {
    const joinedAt = r.joinedAt || r.joinedDate || "2025-01-01";
    const joinedDate = formatJoinedDate(joinedAt);
    const firstName = r.firstName || (r.name ? r.name.split(" ")[0] : "Recruiter");
    const lastName = r.lastName || (r.name ? r.name.split(" ").slice(1).join(" ") : "");
    const name = r.name || `${firstName} ${lastName}`.trim();

    return {
      ...r,
      firstName,
      lastName,
      name,
      joinedAt,
      joinedDate,
      employeeId: r.employeeId || `AG-REC-${Math.floor(100 + Math.random() * 900)}`,
      candidatesAssigned: Number(r.candidatesAssigned) || 0,
      interviewsConducted: Number(r.interviewsConducted) || 0,
      successfulPlacements: Number(r.successfulPlacements) || 0,
      placementRate:
        r.placementRate !== undefined
          ? Number(r.placementRate)
          : r.interviewsConducted > 0
          ? Math.round((Number(r.successfulPlacements) / Number(r.interviewsConducted)) * 100)
          : 0,
      assignedCandidates: r.assignedCandidates || [],
      interviews: r.interviews || [],
      placements: r.placements || [],
      activities: r.activities || [
        {
          id: `act_${Date.now()}`,
          title: "Account Provisioned",
          description: "Recruiter console account created and credentials verified.",
          timestamp: "Recently",
          type: "candidate",
        },
      ],
    };
  }

  notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.getRecruiters());
      } catch (err) {
        console.error("Error in recruiter listener:", err);
      }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    try {
      callback(this.getRecruiters());
    } catch (err) {
      console.error("Error invoking initial recruiter callback:", err);
    }
    return () => {
      this.listeners.delete(callback);
    };
  }

  getRecruiters() {
    return this.recruiters.map((r) => this.normalizeRecruiter(r));
  }

  getRecruiterById(id) {
    const found = this.recruiters.find((r) => r.id === id);
    return found ? this.normalizeRecruiter(found) : null;
  }

  validate(data) {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.firstName?.trim()) errors.firstName = "First name is required.";
    if (!data.lastName?.trim()) errors.lastName = "Last name is required.";

    if (!data.employeeId?.trim()) {
      errors.employeeId = "Employee ID is required.";
    } else {
      const dupId = this.recruiters.some(
        (r) => r.employeeId?.toLowerCase() === data.employeeId.trim().toLowerCase()
      );
      if (dupId) errors.employeeId = "This Employee ID is already in use.";
    }

    if (!data.email?.trim()) {
      errors.email = "Work email is required.";
    } else if (!emailRegex.test(data.email.trim())) {
      errors.email = "Please enter a valid email address.";
    } else {
      const dupEmail = this.recruiters.some(
        (r) => r.email?.toLowerCase() === data.email.trim().toLowerCase()
      );
      if (dupEmail) errors.email = "A recruiter with this work email already exists.";
    }

    if (!data.department || data.department === "All Departments") {
      errors.department = "Please select a department.";
    }

    if (!data.joinedAt) {
      errors.joinedAt = "Date Joined is required.";
    } else {
      const d = new Date(data.joinedAt);
      if (isNaN(d.getTime())) errors.joinedAt = "Please enter a valid date.";
    }

    if (!data.status) {
      errors.status = "Employment status is required.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  createRecruiter(formData) {
    const validation = this.validate(formData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const name = `${firstName} ${lastName}`;
    const email = formData.email.trim().toLowerCase();
    const employeeId = formData.employeeId.trim().toUpperCase();
    const joinedAt = formData.joinedAt;
    const joinedDate = formatJoinedDate(joinedAt);

    // Pick avatar or nice initials placeholder
    const avatar =
      formData.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0B192C&color=F59E0B&bold=true`;

    const newRecruiter = {
      id: `rec_${Date.now()}`,
      employeeId,
      firstName,
      lastName,
      name,
      email,
      phone: formData.phone?.trim() || "--",
      avatar,
      role: formData.role?.trim() || "Talent Acquisition Specialist",
      department: formData.department,
      status: formData.status || "Active",
      employmentType: formData.employmentType || "Full-Time",
      location: formData.location?.trim() || "Remote / Global",
      reportingManager: formData.reportingManager?.trim() || "Sarah Jenkins",
      joinedAt,
      joinedDate,
      rating: 5.0,
      candidatesAssigned: 0,
      interviewsConducted: 0,
      successfulPlacements: 0,
      placementRate: 0,
      activeRequisitions: 2,
      avgTimeToHireDays: 0,
      assignedCandidates: [],
      interviews: [],
      placements: [],
      activities: [
        {
          id: `act_${Date.now()}`,
          title: "Recruiter Profile Created",
          description: `Onboarded as ${formData.role || "Talent Partner"} in ${formData.department}.`,
          timestamp: "Just now",
          type: "candidate",
        },
      ],
    };

    this.recruiters = [newRecruiter, ...this.recruiters];
    this.saveRecruiters(this.recruiters);
    this.notify();

    return { success: true, recruiter: newRecruiter };
  }

  resetToDefaults() {
    this.recruiters = [...INITIAL_RECRUITERS];
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    this.notify();
  }
}

export const recruiterService = new RecruiterService();
