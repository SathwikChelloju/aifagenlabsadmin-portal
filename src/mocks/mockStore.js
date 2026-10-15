/**
 * Reactive Observable In-Memory Mock Store
 * Enables cross-module reactivity without backend coupling.
 */

import {
  INITIAL_METRICS,
  INITIAL_COHORT_30D_DATA,
  INITIAL_INFOGRAPHIC_DATASETS,
  INITIAL_PUBLIC_JOBS,
  INITIAL_INTERNAL_JOBS,
  INITIAL_AI_USAGE,
  INITIAL_SETTINGS,
} from "./mockDatabase.js";
import { MOCK_USERS } from "./users.js";
import { MOCK_PAYMENTS } from "./payments.js";
import {
  INITIAL_JOB_SOURCES_EXPANDED,
  INITIAL_SYNC_HISTORY,
  INITIAL_DUPLICATE_JOBS,
  INITIAL_INGESTION_TIME_SERIES,
} from "./jobSourcesData.js";
import { INITIAL_AUDIT_LOGS_EXPANDED } from "./auditLogsData.js";

class MockStore {
  constructor() {
    this.state = {
      metrics: { ...INITIAL_METRICS },
      cohort30dData: [...INITIAL_COHORT_30D_DATA],
      infographicDatasets: JSON.parse(JSON.stringify(INITIAL_INFOGRAPHIC_DATASETS)),
      users: [...MOCK_USERS],
      candidates: MOCK_USERS.filter((u) => (u.role || "").toLowerCase() === "candidate").map((u) => {
        const sub = u.subscription || {};
        const renewalDate = sub.renewalDate || u.expiryDate;
        let daysRemaining = 0;
        let expiryFormatted = renewalDate || "--";
        if (renewalDate && renewalDate !== "--" && renewalDate !== "Expired") {
          const t = new Date(renewalDate).getTime();
          if (!isNaN(t)) {
            const now = new Date("2026-10-15T00:00:00Z").getTime();
            daysRemaining = Math.max(0, Math.ceil((t - now) / (1000 * 60 * 60 * 24)));
            expiryFormatted = new Date(renewalDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
          }
        }
        if (u.status === "Past Due" || u.status === "Suspended" || u.status === "Inactive") {
          daysRemaining = 0;
          expiryFormatted = u.status;
        }
        return {
          ...u,
          expiresInDays: daysRemaining,
          expiryDate: expiryFormatted,
        };
      }),
      transactions: [...MOCK_PAYMENTS],
      publicJobs: [...INITIAL_PUBLIC_JOBS],
      internalJobs: [...INITIAL_INTERNAL_JOBS],
      jobSources: JSON.parse(JSON.stringify(INITIAL_JOB_SOURCES_EXPANDED)),
      syncHistory: JSON.parse(JSON.stringify(INITIAL_SYNC_HISTORY)),
      duplicateJobs: JSON.parse(JSON.stringify(INITIAL_DUPLICATE_JOBS)),
      ingestionTimeSeries: JSON.parse(JSON.stringify(INITIAL_INGESTION_TIME_SERIES)),
      aiUsage: JSON.parse(JSON.stringify(INITIAL_AI_USAGE)),
      auditLogs: JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS_EXPANDED)),
      settings: JSON.parse(JSON.stringify(INITIAL_SETTINGS)),
    };
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (err) {
        console.error("MockStore listener error:", err);
      }
    });
  }

  /**
   * Updates candidate plan, recalculates cohorts & logs audit entry
   */
  updateCandidatePlan(candidateId, newPlan, reason = "Plan updated via console", admin = "admin@aifagen.com") {
    const candidate = this.state.candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    const oldPlan = candidate.plan;
    candidate.plan = newPlan;

    // Append to immutable audit log
    const now = new Date();
    const formattedDate = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedDate,
      admin,
      action: "PLAN_CHANGE",
      target: `${candidate.name} (${candidate.id})`,
      details: `Changed package level from ${oldPlan} to ${newPlan}`,
      reason: reason || "Administrative update",
    });

    // Recalculate candidate membership split for infographic wheel
    const total = this.state.candidates.length;
    const premiumCount = this.state.candidates.filter((c) => c.plan === "Premium").length;
    const basicCount = this.state.candidates.filter((c) => c.plan === "Basic").length;
    const freeCount = total - premiumCount - basicCount;

    this.state.infographicDatasets.PLANS.segments = [
      {
        id: "premium",
        label: "Premium Concierge",
        value: 890 + (premiumCount - 3) * 10,
        formatted: `${890 + (premiumCount - 3) * 10} students`,
        pct: Number(((premiumCount / total) * 100).toFixed(1)),
        color: "#0B192C",
      },
      {
        id: "basic",
        label: "Basic Application",
        value: 530 + (basicCount - 1) * 10,
        formatted: `${530 + (basicCount - 1) * 10} students`,
        pct: Number(((basicCount / total) * 100).toFixed(1)),
        color: "#15803D",
      },
      {
        id: "free",
        label: "Unenrolled / Free",
        value: 3400,
        formatted: "3,400 students",
        pct: Number(((freeCount / total) * 100).toFixed(1)),
        color: "#CBD5E1",
      },
    ];

    // Also update in users list if present
    const userInList = this.state.users.find((u) => u.id === candidateId);
    if (userInList) {
      userInList.plan = newPlan;
    }

    this.notify();
  }

  /**
   * Updates user plan directly from the Users management module
   */
  updateUserPlan(userId, newPlan, reason = "Subscription tier changed", admin = "admin@aifagen.com") {
    const user = this.state.users.find((u) => u.id === userId);
    if (!user) return false;

    const oldPlan = user.plan;
    user.plan = newPlan;

    // Sync in candidates array if present
    const candidate = this.state.candidates.find((c) => c.id === userId);
    if (candidate) {
      candidate.plan = newPlan;
    }

    const now = new Date();
    const formattedDate = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedDate,
      admin,
      action: "PLAN_CHANGE",
      target: `${user.name} (${user.id})`,
      details: `Changed subscription tier from ${oldPlan} to ${newPlan}`,
      reason: reason || "User tier adjustment",
    });

    this.notify();
    return true;
  }

  /**
   * Updates user account status (Active, Suspended, Inactive)
   */
  updateUserStatus(userId, newStatus, reason = "Status updated", admin = "admin@aifagen.com") {
    const user = this.state.users.find((u) => u.id === userId);
    if (!user) return false;

    const oldStatus = user.status;
    user.status = newStatus;

    // Sync in candidates array if present
    const candidate = this.state.candidates.find((c) => c.id === userId);
    if (candidate) {
      candidate.status = newStatus;
    }

    const now = new Date();
    const formattedDate = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedDate,
      admin,
      action: newStatus === "Suspended" ? "USER_SUSPENDED" : "USER_STATUS_CHANGE",
      target: `${user.name} (${user.id})`,
      details: `Changed account status from ${oldStatus} to ${newStatus}`,
      reason: reason || `Account ${newStatus.toLowerCase()}`,
    });

    this.notify();
    return true;
  }

  /**
   * Updates user profile fields (name, email, phone, location, domain, headline)
   */
  updateUserProfile(userId, profileUpdates, admin = "admin@aifagen.com") {
    const user = this.state.users.find((u) => u.id === userId);
    if (!user) return null;

    Object.assign(user, profileUpdates);

    // Sync candidates array if matching
    const candidate = this.state.candidates.find((c) => c.id === userId);
    if (candidate) {
      if (profileUpdates.name) candidate.name = profileUpdates.name;
      if (profileUpdates.email) candidate.email = profileUpdates.email;
      if (profileUpdates.countryGoal) candidate.countryGoal = profileUpdates.countryGoal;
      if (profileUpdates.targetVisa) candidate.targetVisa = profileUpdates.targetVisa;
      if (profileUpdates.domain) candidate.domain = profileUpdates.domain;
    }

    const now = new Date();
    const formattedDate = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedDate,
      admin,
      action: "PROFILE_UPDATE",
      target: `${user.name} (${user.id})`,
      details: `Updated profile attributes (${Object.keys(profileUpdates).join(", ")})`,
      reason: "Administrative profile edit",
    });

    if (!user.activities) user.activities = [];
    user.activities.unshift({
      id: `act_${Date.now()}`,
      type: "profile_update",
      title: "Profile Updated",
      description: `Updated profile details (${Object.keys(profileUpdates).join(", ")})`,
      timestamp: `${now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} · ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`,
      badge: "Profile",
    });

    this.notify();
    return { ...user };
  }

  /**
   * Creates a new user record
   */
  createUser(userData, admin = "admin@aifagen.com") {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    const formattedTime = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    const newUser = {
      id: `usr_${Date.now().toString().slice(-4)}`,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      role: userData.role || "Candidate",
      plan: userData.plan || "Basic",
      status: "Active",
      countryGoal: userData.countryGoal || "United Kingdom",
      targetVisa: userData.targetVisa || "Skilled Worker Visa",
      domain: userData.domain || "Software Engineering",
      atsScore: userData.atsScore || 85,
      aiUsageTokens: 0,
      aiUsageCostUsd: 0.0,
      joinedAt: now.toISOString(),
      formattedJoinedDate: formattedDate,
      resumesTailored: 0,
      interviewsCompleted: 0,
      lastActive: "Just now",
    };

    this.state.users.unshift(newUser);

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTime,
      admin,
      action: "USER_CREATED",
      target: `${newUser.name} (${newUser.id})`,
      details: `Created new user account with ${newUser.plan} tier`,
      reason: "Admin manual registration",
    });

    this.notify();
    return newUser;
  }

  /**
   * Issues refund, adjusts ledger & creates audit trail
   */
  issueRefund(transactionId, reason = "Customer requested refund", admin = "admin@aifagen.com") {
    const txn = this.state.transactions.find((t) => t.id === transactionId);
    if (!txn || txn.status === "Refunded") return;

    txn.status = "Refunded";
    txn.refundReason = reason;

    const now = new Date();
    const formattedDate = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedDate,
      admin,
      action: "REFUND_ISSUED",
      target: `${txn.userName || txn.candidateName} (${txn.id})`,
      details: `Processed full refund of $${txn.amount.toFixed(2)}`,
      reason,
    });

    this.notify();
  }

  /**
   * Creates an internal job posting & creates audit trail
   */
  createInternalJob(jobData, admin = "admin@aifagen.com") {
    const newJob = {
      id: `int_${Date.now()}`,
      title: jobData.title,
      department: jobData.department || "Engineering",
      seniority: jobData.seniority || "Mid",
      location: jobData.location || "Remote",
      applicantsCount: 0,
      status: "Open",
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      description: jobData.description || "",
    };

    this.state.internalJobs.unshift(newJob);

    const now = new Date();
    const formattedDate = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedDate,
      admin,
      action: "ROLE_CREATED",
      target: `${newJob.title} (${newJob.id})`,
      details: `Created new internal studio role in ${newJob.department}`,
      reason: "Studio hiring expansion",
    });

    this.notify();
  }

  /**
   * Retrieves all jobs unified across public listings and internal postings
   */
  getAllJobs() {
    const publicMapped = (this.state.publicJobs || []).map((j) => ({
      ...j,
      type: "public",
      status: j.status || (j.isVisible ? "Active" : "Paused"),
      company: j.company || "Unknown",
      source: j.source || "Public Feed",
      employmentType: j.employmentType || "Full-time",
      skills: Array.isArray(j.skills) ? j.skills : [],
      isHidden: Boolean(j.isHidden),
    }));

    const internalMapped = (this.state.internalJobs || []).map((j) => ({
      ...j,
      type: "internal",
      company: j.company || "AIFA GEN LABS",
      source: j.source || "Internal",
      status: j.status === "Open" ? "Active" : j.status === "Filled" ? "Closed" : (j.status || "Active"),
      postedDate: j.postedDate || j.createdDate || "Oct 01, 2026",
      employmentType: j.employmentType || "Full-time",
      skills: Array.isArray(j.skills) ? j.skills : [],
      isHidden: Boolean(j.isHidden),
    }));

    const all = [...publicMapped, ...internalMapped];
    all.sort((a, b) => b.id.localeCompare(a.id));
    return all;
  }

  /**
   * Unified Create Job
   */
  createJob(jobData, admin = "admin@aifagen.com") {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    const isInternal = jobData.type === "internal";
    const idPrefix = isInternal ? "int_" : "job_";
    const newId = `${idPrefix}${Date.now().toString().slice(-6)}`;

    const newJob = {
      id: newId,
      title: jobData.title,
      company: isInternal ? (jobData.company || "AIFA GEN LABS") : (jobData.company || "Company"),
      type: isInternal ? "internal" : "public",
      location: jobData.location || "Remote",
      employmentType: jobData.employmentType || "Full-time",
      source: isInternal ? "Internal" : (jobData.source || "Public Feed"),
      postedDate: formattedDate,
      status: jobData.status || "Active",
      salaryRange: jobData.salaryRange || "",
      description: jobData.description || "",
      skills: Array.isArray(jobData.skills)
        ? jobData.skills
        : typeof jobData.skills === "string"
        ? jobData.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      // Public specifics
      applicationUrl: !isInternal ? (jobData.applicationUrl || "") : undefined,
      visaVerified: !isInternal ? Boolean(jobData.visaVerified) : undefined,
      visaSponsorshipNote: !isInternal ? (jobData.visaSponsorshipNote || "") : undefined,
      isVisible: !isInternal ? jobData.status === "Active" : undefined,
      // Internal specifics
      department: isInternal ? (jobData.department || "Operations") : undefined,
      seniority: isInternal ? (jobData.seniority || "Mid") : undefined,
      applicantsCount: isInternal ? (jobData.applicantsCount || 0) : undefined,
    };

    if (isInternal) {
      this.state.internalJobs.unshift(newJob);
    } else {
      this.state.publicJobs.unshift(newJob);
    }

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTimestamp,
      admin,
      action: isInternal ? "INTERNAL_JOB_CREATED" : "PUBLIC_JOB_CREATED",
      target: `${newJob.title} (${newJob.id})`,
      details: `Created new ${newJob.type} job listing at ${newJob.company}`,
      reason: "Jobs catalog update",
    });

    this.notify();
    return newJob;
  }

  /**
   * Unified Update Job
   */
  updateJob(jobId, jobUpdates, admin = "admin@aifagen.com") {
    let target = this.state.internalJobs.find((j) => j.id === jobId);
    let isInternal = true;

    if (!target) {
      target = this.state.publicJobs.find((j) => j.id === jobId);
      isInternal = false;
    }

    if (!target) return null;

    if (jobUpdates.skills && typeof jobUpdates.skills === "string") {
      jobUpdates.skills = jobUpdates.skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    Object.assign(target, jobUpdates);

    if (!isInternal && jobUpdates.status) {
      target.isVisible = jobUpdates.status === "Active";
    }

    const now = new Date();
    const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTimestamp,
      admin,
      action: "JOB_UPDATED",
      target: `${target.title} (${target.id})`,
      details: `Updated job attributes (${Object.keys(jobUpdates).join(", ")})`,
      reason: "Administrative job revision",
    });

    this.notify();
    return { ...target };
  }

  /**
   * Unified Delete Job
   */
  deleteJob(jobId, admin = "admin@aifagen.com") {
    const intIndex = this.state.internalJobs.findIndex((j) => j.id === jobId);
    let deletedTitle = "";

    if (intIndex !== -1) {
      deletedTitle = this.state.internalJobs[intIndex].title;
      this.state.internalJobs.splice(intIndex, 1);
    } else {
      const pubIndex = this.state.publicJobs.findIndex((j) => j.id === jobId);
      if (pubIndex !== -1) {
        deletedTitle = this.state.publicJobs[pubIndex].title;
        this.state.publicJobs.splice(pubIndex, 1);
      } else {
        return false;
      }
    }

    const now = new Date();
    const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTimestamp,
      admin,
      action: "JOB_DELETED",
      target: `${deletedTitle || "Job"} (${jobId})`,
      details: `Removed job listing from catalog`,
      reason: "Administrative deletion",
    });

    this.notify();
    return true;
  }

  /**
   * Quick status transition
   */
  updateJobStatus(jobId, newStatus, admin = "admin@aifagen.com") {
    return this.updateJob(jobId, { status: newStatus }, admin);
  }

  /**
   * Bulk hides jobs from standard listings without modifying status
   */
  hideJobs(jobIds = [], admin = "admin@aifagen.com") {
    const idSet = new Set(jobIds);
    let count = 0;

    [...this.state.publicJobs, ...this.state.internalJobs].forEach((job) => {
      if (idSet.has(job.id)) {
        job.isHidden = true;
        if (job.type === "public") {
          job.isVisible = false; // Hidden from candidate/user portal
        }
        count += 1;
      }
    });

    if (count > 0) {
      const now = new Date();
      const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

      this.state.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        timestamp: formattedTimestamp,
        admin,
        action: "JOBS_BULK_HIDDEN",
        target: `${count} Job Listings`,
        details: `Hid ${count} jobs from user portal (retained in Admin Console)`,
        reason: "User portal catalog curation",
      });

      this.notify();
    }

    return count;
  }

  /**
   * Bulk unhides jobs and restores them to standard listings
   */
  unhideJobs(jobIds = [], admin = "admin@aifagen.com") {
    const idSet = new Set(jobIds);
    let count = 0;

    [...this.state.publicJobs, ...this.state.internalJobs].forEach((job) => {
      if (idSet.has(job.id)) {
        job.isHidden = false;
        if (job.type === "public") {
          job.isVisible = job.status === "Active"; // Restored to user portal
        }
        count += 1;
      }
    });

    if (count > 0) {
      const now = new Date();
      const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

      this.state.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        timestamp: formattedTimestamp,
        admin,
        action: "JOBS_BULK_UNHIDDEN",
        target: `${count} Job Listings`,
        details: `Restored user portal visibility for ${count} jobs`,
        reason: "User portal catalog curation",
      });

      this.notify();
    }

    return count;
  }

  /**
   * Single job visibility toggle
   */
  setJobVisibility(jobId, isHidden, admin = "admin@aifagen.com") {
    return isHidden ? this.hideJobs([jobId], admin) : this.unhideJobs([jobId], admin);
  }

  /**
   * Bulk updates publication status
   */
  bulkUpdateJobStatus(jobIds = [], newStatus, admin = "admin@aifagen.com") {
    const idSet = new Set(jobIds);
    let count = 0;

    [...this.state.publicJobs, ...this.state.internalJobs].forEach((job) => {
      if (idSet.has(job.id)) {
        job.status = newStatus;
        if (job.type === "public") {
          job.isVisible = newStatus === "Active";
        }
        count += 1;
      }
    });

    if (count > 0) {
      const now = new Date();
      const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

      this.state.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        timestamp: formattedTimestamp,
        admin,
        action: "JOBS_BULK_STATUS_CHANGE",
        target: `${count} Job Listings`,
        details: `Transitioned status to ${newStatus} for ${count} jobs`,
        reason: "Administrative batch workflow",
      });

      this.notify();
    }

    return count;
  }

  /**
   * Toggles public job candidate visibility
   */
  togglePublicJobVisibility(jobId) {
    const job = this.state.publicJobs.find((j) => j.id === jobId);
    if (!job) return;
    job.isVisible = !job.isVisible;
    job.status = job.isVisible ? "Active" : "Paused";
    this.notify();
  }

  /**
   * Simulates restarting stalled crawlers
   */
  restartScrapers(admin = "admin@aifagen.com") {
    this.state.jobSources.forEach((src) => {
      src.status = "Working";
      src.latency = src.latency === "--" ? "1.8s" : src.latency;
      src.note = undefined;
    });

    this.state.metrics.sourcesWorking = this.state.jobSources.length;

    const now = new Date();
    const formattedDate = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedDate,
      admin,
      action: "SCRAPERS_RESTART",
      target: "All Ingestion Pipelines",
      details: "Cleared blocked challenges and resumed stalled worker queues",
      reason: "Manual operator recovery trigger",
    });

    this.notify();
  }

  /**
   * Retrieves all job sources
   */
  getAllJobSources() {
    return [...this.state.jobSources];
  }

  /**
   * Retrieves single source by ID
   */
  getJobSourceById(id) {
    const src = this.state.jobSources.find((s) => s.id === id);
    return src ? { ...src } : null;
  }

  /**
   * Retrieves all sync history
   */
  getAllSyncHistory() {
    return [...this.state.syncHistory];
  }

  /**
   * Retrieves sync history for a specific source
   */
  getSyncHistoryForSource(sourceId) {
    return this.state.syncHistory.filter((h) => h.sourceId === sourceId);
  }

  /**
   * Creates new job source
   */
  createJobSource(sourceData, admin = "admin@aifagen.com") {
    const nextNum = this.state.jobSources.length + 1;
    const newId = `SRC-${String(nextNum).padStart(3, "0")}`;
    const now = new Date();
    const createdDate = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    const newSource = {
      id: newId,
      name: sourceData.name || "Custom Integration",
      slug: (sourceData.name || "custom").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      type: sourceData.type || "api",
      status: sourceData.status || "Active",
      endpoint: sourceData.endpoint || "https://api.source.internal/v1/jobs",
      protocol: sourceData.protocol || "REST API Poller",
      authMethod: sourceData.authMethod || "Bearer Token",
      maskedSecret: sourceData.maskedSecret || "int_sec_••••••••••••209a",
      latency: sourceData.latency || "950ms",
      frequency: sourceData.frequency || "Hourly Polling",
      configStatus: sourceData.status === "Paused" ? "Paused" : "Configured",
      createdDate,
      lastSync: now.toISOString(),
      lastSuccessSync: now.toISOString(),
      description: sourceData.description || "Configured ingestion connector for technology job vacancies.",
      totalJobsRetrieved: 0,
      jobsRetrieved: 0,
      jobsToday: 0,
      jobsRetrievedToday: 0,
      note: null,
    };

    this.state.jobSources.unshift(newSource);

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTimestamp,
      admin,
      action: "JOB_SOURCE_CREATED",
      target: `${newSource.name} (${newSource.id})`,
      details: `Configured new ${newSource.type} source with endpoint ${newSource.endpoint}`,
      reason: "Ingestion pipeline expansion",
    });

    this.notify();
    return { ...newSource };
  }

  /**
   * Updates an existing job source
   */
  updateJobSource(sourceId, updates, admin = "admin@aifagen.com") {
    const src = this.state.jobSources.find((s) => s.id === sourceId);
    if (!src) return null;

    Object.assign(src, updates);

    const now = new Date();
    const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTimestamp,
      admin,
      action: "JOB_SOURCE_UPDATED",
      target: `${src.name} (${src.id})`,
      details: `Updated source properties: ${Object.keys(updates).join(", ")}`,
      reason: "Connector configuration adjustment",
    });

    this.notify();
    return { ...src };
  }

  /**
   * Deletes a job source
   */
  deleteJobSource(sourceId, admin = "admin@aifagen.com") {
    const idx = this.state.jobSources.findIndex((s) => s.id === sourceId);
    if (idx === -1) return false;

    const removed = this.state.jobSources.splice(idx, 1)[0];

    const now = new Date();
    const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTimestamp,
      admin,
      action: "JOB_SOURCE_DELETED",
      target: `${removed.name} (${removed.id})`,
      details: "Removed connector from ingestion catalog",
      reason: "Source deprecation",
    });

    this.notify();
    return true;
  }

  /**
   * Toggles pause / active status
   */
  toggleJobSourceStatus(sourceId, admin = "admin@aifagen.com") {
    const src = this.state.jobSources.find((s) => s.id === sourceId);
    if (!src) return null;

    const newStatus = src.status === "Active" ? "Paused" : "Active";
    src.status = newStatus;
    src.configStatus = newStatus === "Paused" ? "Paused" : "Active Polling";
    if (newStatus === "Active") {
      src.note = null;
    }

    const now = new Date();
    const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTimestamp,
      admin,
      action: "JOB_SOURCE_STATUS_TOGGLED",
      target: `${src.name} (${src.id})`,
      details: `Transitioned source status to ${newStatus}`,
      reason: "Operator toggle",
    });

    this.notify();
    return { ...src };
  }

  /**
   * Simulates running sync for single source
   */
  triggerSyncJobSource(sourceId, admin = "admin@aifagen.com") {
    const src = this.state.jobSources.find((s) => s.id === sourceId);
    if (!src) return null;

    const now = new Date();
    const isoNow = now.toISOString();
    const newCount = Math.floor(Math.random() * 8) + 3;
    const updatedCount = Math.floor(Math.random() * 12) + 5;
    const totalDiscovered = newCount + updatedCount;
    const durationSec = (Math.random() * 1.5 + 0.6).toFixed(1);

    const syncEntry = {
      id: `SYNC-${now.getFullYear()}-${Date.now().toString().slice(-4)}`,
      sourceId: src.id,
      sourceName: src.name,
      startTime: new Date(now.getTime() - 25000).toISOString(),
      completionTime: isoNow,
      duration: `${durationSec}s`,
      result: "Success",
      jobsDiscovered: totalDiscovered,
      newJobs: newCount,
      updatedJobs: updatedCount,
      errorSummary: null,
    };

    // Update source metrics
    src.lastSync = isoNow;
    src.lastSuccessSync = isoNow;
    src.status = "Active";
    src.note = null;
    src.jobsToday = (src.jobsToday || 0) + newCount;
    src.jobsRetrievedToday = src.jobsToday;
    src.totalJobsRetrieved = (src.totalJobsRetrieved || 0) + newCount;
    src.jobsRetrieved = src.totalJobsRetrieved;

    this.state.syncHistory.unshift(syncEntry);

    const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTimestamp,
      admin,
      action: "JOB_SOURCE_SYNC_TRIGGERED",
      target: `${src.name} (${src.id})`,
      details: `Simulated sync completed (${newCount} new jobs, ${updatedCount} updated)`,
      reason: "Manual operator sync trigger",
    });

    this.notify();
    return syncEntry;
  }

  /**
   * Simulates syncing all active sources
   */
  syncAllJobSources(admin = "admin@aifagen.com") {
    const activeSources = this.state.jobSources.filter((s) => s.status !== "Paused");
    let totalNew = 0;

    activeSources.forEach((src) => {
      const now = new Date();
      const isoNow = now.toISOString();
      const newCount = Math.floor(Math.random() * 6) + 2;
      const updatedCount = Math.floor(Math.random() * 10) + 4;
      const durationSec = (Math.random() * 1.2 + 0.5).toFixed(1);

      src.lastSync = isoNow;
      src.lastSuccessSync = isoNow;
      src.status = "Active";
      src.note = null;
      src.jobsToday = (src.jobsToday || 0) + newCount;
      src.jobsRetrievedToday = src.jobsToday;
      src.totalJobsRetrieved = (src.totalJobsRetrieved || 0) + newCount;
      src.jobsRetrieved = src.totalJobsRetrieved;
      totalNew += newCount;

      this.state.syncHistory.unshift({
        id: `SYNC-${now.getFullYear()}-${Date.now().toString().slice(-4)}`,
        sourceId: src.id,
        sourceName: src.name,
        startTime: new Date(now.getTime() - 20000).toISOString(),
        completionTime: isoNow,
        duration: `${durationSec}s`,
        result: "Success",
        jobsDiscovered: newCount + updatedCount,
        newJobs: newCount,
        updatedJobs: updatedCount,
        errorSummary: null,
      });
    });

    const now = new Date();
    const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTimestamp,
      admin,
      action: "JOB_SOURCES_SYNC_ALL",
      target: `${activeSources.length} Active Connectors`,
      details: `Simulated batch sync completed across ${activeSources.length} sources (${totalNew} total new jobs)`,
      reason: "Manual batch ingest trigger",
    });

    this.notify();
    return { syncedCount: activeSources.length, totalNew };
  }

  /**
   * Identifies stalled or failed scrapers and simulates an operational restart
   * @param {string} admin
   * @returns {{ restartedCount: number, sources: Array }}
   */
  restartStalledScrapers(admin = "admin@aifagen.com") {
    // Only restart sources with error, stalled or failed statuses (do NOT touch paused or healthy)
    const stalledSources = this.state.jobSources.filter(
      (s) =>
        s.status === "Error" ||
        s.status === "Stalled" ||
        s.status === "Failed" ||
        (s.note && s.note.toLowerCase().includes("stalled"))
    );

    if (stalledSources.length === 0) {
      return { restartedCount: 0, sources: [] };
    }

    const now = new Date();
    const isoNow = now.toISOString();

    stalledSources.forEach((src) => {
      src.status = "Active";
      src.configStatus = "Active Polling";
      src.note = null;
      src.latency = "1.1s";
      src.lastSync = isoNow;
      src.lastRestarted = isoNow;
    });

    const formattedTimestamp = `${now.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })} ${now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTimestamp,
      admin,
      action: "SCRAPERS_RESTART",
      target: stalledSources.map((s) => s.name).join(", "),
      details: `Simulated worker recovery executed for ${stalledSources.length} stalled scraper(s)`,
      reason: "Manual operator console recovery",
    });

    this.notify();
    return {
      restartedCount: stalledSources.length,
      sources: stalledSources.map((s) => ({ id: s.id, name: s.name })),
    };
  }

  /**
   * Topbar Sync Feeds: triggers simulated polling across active feeds without clearing errors on stalled sources or changing paused sources
   * @param {string} admin
   * @returns {{ syncedCount: number, totalNew: number }}
   */
  syncFeeds(admin = "admin@aifagen.com") {
    // Synchronize active feeds without mutating paused or error sources
    const eligibleSources = this.state.jobSources.filter((s) => s.status !== "Paused");
    let totalNew = 0;
    const now = new Date();
    const isoNow = now.toISOString();

    eligibleSources.forEach((src) => {
      const isWorking = src.status === "Active";
      const newCount = isWorking ? Math.floor(Math.random() * 6) + 2 : 0;
      src.lastSync = isoNow;

      if (isWorking) {
        src.lastSuccessSync = isoNow;
        src.jobsToday = (src.jobsToday || 0) + newCount;
        src.jobsRetrievedToday = src.jobsToday;
        src.totalJobsRetrieved = (src.totalJobsRetrieved || 0) + newCount;
        src.jobsRetrieved = src.totalJobsRetrieved;
        totalNew += newCount;
      }

      const durationSec = (Math.random() * 0.8 + 0.6).toFixed(1);
      this.state.syncHistory.unshift({
        id: `SYNC-${now.getFullYear()}-${Date.now().toString().slice(-4)}`,
        sourceId: src.id,
        sourceName: src.name,
        startTime: new Date(now.getTime() - 15000).toISOString(),
        completionTime: isoNow,
        duration: `${durationSec}s`,
        result: isWorking ? "Success" : "Failed",
        jobsDiscovered: newCount,
        newJobs: newCount,
        updatedJobs: Math.floor(newCount / 2),
        errorSummary: !isWorking ? src.note || "Feed ingestion failed" : null,
      });
    });

    const formattedTimestamp = `${now.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })} ${now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTimestamp,
      admin,
      action: "FEEDS_SYNC",
      target: `${eligibleSources.length} Feeds`,
      details: `Simulated topbar feed sync completed (${totalNew} total new jobs indexed)`,
      reason: "Manual topbar feed synchronization",
    });

    this.notify();
    return { syncedCount: eligibleSources.length, totalNew };
  }

  /**
   * Returns duplicate jobs records
   */
  getAllDuplicateJobs() {
    return [...this.state.duplicateJobs];
  }

  /**
   * Resolves a potential duplicate job entry
   * @param {string} duplicateId
   * @param {"MERGE" | "KEEP_BOTH" | "DISMISS"} action
   * @param {string} admin
   */
  resolveDuplicateJob(duplicateId, action, admin = "admin@aifagen.com") {
    const dup = this.state.duplicateJobs.find((d) => d.id === duplicateId);
    if (!dup) return null;

    let newStatus = "Resolved (Merged)";
    let detailsText = "Merged duplicate records into primary vacancy entity";

    if (action === "KEEP_BOTH") {
      newStatus = "Resolved (Kept Both)";
      detailsText = "Retained both postings as separate distinct vacancies";
    } else if (action === "DISMISS") {
      newStatus = "Dismissed";
      detailsText = "Dismissed duplicate warning";
    }

    dup.status = newStatus;

    const now = new Date();
    const formattedTimestamp = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedTimestamp,
      admin,
      action: "DUPLICATE_JOB_RESOLVED",
      target: `${dup.jobTitle} (${dup.id})`,
      details: `${detailsText} with confidence ${dup.confidenceScore}%`,
      reason: "Manual operator deduplication review",
    });

    this.notify();
    return { ...dup };
  }

  /**
   * Returns time-series ingestion data for specified timeframe and source
   */
  getIngestionTimeSeries(days = 14, sourceSlug = null) {
    const sliceCount = Math.min(days, this.state.ingestionTimeSeries.length);
    const data = this.state.ingestionTimeSeries.slice(-sliceCount);

    if (!sourceSlug || sourceSlug === "all") {
      return data;
    }

    // Filter to selected source
    return data.map((d) => ({
      date: d.date,
      total: d[sourceSlug] || 0,
      [sourceSlug]: d[sourceSlug] || 0,
    }));
  }

  /**
   * Adds new team admin
   */
  addAdmin(email, role = "Operator", admin = "admin@aifagen.com") {
    if (!email) return;
    this.state.settings.admins.push({
      email,
      role,
      addedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    });

    const now = new Date();
    const formattedDate = `${now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric" })} ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

    this.state.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      timestamp: formattedDate,
      admin,
      action: "SETTINGS_UPDATED",
      target: `Admin Team: ${email}`,
      details: `Granted ${role} privileges`,
      reason: "Team access provisioning",
    });

    this.notify();
  }

  /**
   * Retrieves all immutable audit log events
   */
  getAuditLogs() {
    return [...this.state.auditLogs];
  }

  /**
   * Records a new structured audit log event
   */
  recordAuditEvent(eventData) {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    const formattedTime = `${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })} UTC`;

    const newEvent = {
      id: eventData.id || `EVT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: eventData.timestamp || now.toISOString(),
      formattedDate,
      formattedTime,
      actorId: eventData.actorId || "usr_adm_01",
      actorName: eventData.actorName || "Admin AIFA",
      actorEmail: eventData.actorEmail || "admin@aifagen.com",
      actorRole: eventData.actorRole || "Super Administrator",
      actorType: eventData.actorType || "Admin",
      actorAvatar: eventData.actorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      action: eventData.action || "GENERIC_ACTION",
      actionLabel: eventData.actionLabel || eventData.action || "System Event Recorded",
      category: eventData.category || "Administration",
      targetId: eventData.targetId || "res_system",
      targetName: eventData.targetName || "System Resource",
      targetType: eventData.targetType || "Configuration",
      targetEmail: eventData.targetEmail || null,
      result: eventData.result || "Success",
      source: eventData.source || "Admin Portal",
      description: eventData.description || "Administrative operation logged.",
      changes: Array.isArray(eventData.changes) ? eventData.changes : [],
      ipAddress: eventData.ipAddress || "192.168.1.142",
      userAgent: eventData.userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "Mozilla/5.0"),
      sessionId: eventData.sessionId || `sess_${Math.random().toString(36).substring(2, 10)}`,
      correlationId: eventData.correlationId || `corr_${Math.random().toString(36).substring(2, 8)}`,
      operationId: eventData.operationId || `op_${Math.random().toString(36).substring(2, 8)}`,
      environment: eventData.environment || "Production (us-east-1)",
      metadata: eventData.metadata || {},
      relatedEventIds: Array.isArray(eventData.relatedEventIds) ? eventData.relatedEventIds : [],
    };

    this.state.auditLogs.unshift(newEvent);
    this.notify();
    return newEvent;
  }
}

export const mockStore = new MockStore();
