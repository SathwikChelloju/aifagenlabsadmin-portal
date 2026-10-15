/**
 * Deterministic Mock Notifications Dataset
 * AIFA GEN LABS Admin Console
 *
 * Covers all system modules with realistic operational events:
 * - Job Sources: Sync failure (Critical), Stale sync (Warning), Sync success (Success)
 * - Jobs: Duplicate imports (Warning), Review required (Warning), Ingested jobs (Info)
 * - Payments: Failed charge (Critical), Processed payment (Success), Subscription alert (Warning)
 * - AI Usage: Budget threshold (Warning), Error rate spike (Critical), Provider latency (Warning)
 * - Users: Suspended account (Warning), User onboarded (Info)
 * - Audit Logs: Sensitive security config change (Critical)
 * - Settings: Snapshot configuration saved (Success)
 */

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-job-src-01",
    title: "Greenhouse API Sync Failed",
    description: "Webhook connection timed out after 3 retries due to HTTP 429 upstream rate limiting on feed endpoint.",
    category: "Job Sources",
    severity: "critical",
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // 4m ago
    timestamp: "4m ago",
    isRead: false,
    readAt: null,
    route: "job-sources",
    relatedEntityId: "src-greenhouse-01",
    actionLabel: "Inspect Feed",
  },
  {
    id: "notif-ai-01",
    title: "Gemini 1.5 Pro Error Rate Exceeded 5%",
    description: "Requests to Google Vertex AI reported 7.8% failure rate over the past 15 minutes due to token quota saturation.",
    category: "AI Usage",
    severity: "critical",
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(), // 14m ago
    timestamp: "14m ago",
    isRead: false,
    readAt: null,
    route: "ai-usage",
    relatedEntityId: "model-gemini-1.5-pro",
    actionLabel: "View AI Metrics",
  },
  {
    id: "notif-pay-01",
    title: "Enterprise Invoice Payment Failed",
    description: "Automatic renewal charge of $4,850.00 for CloudScale AI failed (Declined: Expired Corporate Card).",
    category: "Payments",
    severity: "critical",
    createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(), // 32m ago
    timestamp: "32m ago",
    isRead: false,
    readAt: null,
    route: "payments",
    relatedEntityId: "inv-2026-902",
    actionLabel: "Resolve Invoice",
  },
  {
    id: "notif-audit-01",
    title: "Critical Security Setting Changed",
    description: "Mandatory Multi-Factor Authentication (MFA) enforcement policy was modified by SuperAdmin 'admin@aifagen.com'.",
    category: "Audit Logs",
    severity: "critical",
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(), // 55m ago
    timestamp: "55m ago",
    isRead: false,
    readAt: null,
    route: "audit-logs",
    relatedEntityId: "audit-evt-7712",
    actionLabel: "View Audit Log",
  },
  {
    id: "notif-jobs-01",
    title: "Potential Duplicate Job Postings Detected",
    description: "4 duplicate listings detected across Workday and Ashby feeds for 'Lead Backend Engineer (Go)'.",
    category: "Jobs",
    severity: "warning",
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(), // 1h ago
    timestamp: "1h ago",
    isRead: false,
    readAt: null,
    route: "jobs",
    relatedEntityId: "dup-batch-04",
    actionLabel: "Review Jobs",
  },
  {
    id: "notif-ai-02",
    title: "Anthropic Claude 3.5 Budget Alert",
    description: "Monthly allocated token budget has reached 84% ($4,200 / $5,000 ceiling). Consider increasing threshold limit.",
    category: "AI Usage",
    severity: "warning",
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(), // ~2h ago
    timestamp: "2h ago",
    isRead: false,
    readAt: null,
    route: "ai-usage",
    relatedEntityId: "budget-claude-35",
    actionLabel: "Inspect Budget",
  },
  {
    id: "notif-job-src-02",
    title: "Lever Feed Sync Interval Exceeded",
    description: "Feed has not updated in 6 hours (expected sync cadence: every 2 hours). Last response status was HTTP 200.",
    category: "Job Sources",
    severity: "warning",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3h ago
    timestamp: "3h ago",
    isRead: false,
    readAt: null,
    route: "job-sources",
    relatedEntityId: "src-lever-02",
    actionLabel: "Check Status",
  },
  {
    id: "notif-usr-01",
    title: "Suspicious User Account Suspended",
    description: "Candidate profile 'marcus.vance@techcorp.io' was automatically suspended following high-velocity resume scraping.",
    category: "Users",
    severity: "warning",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4h ago
    timestamp: "4h ago",
    isRead: true,
    readAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    route: "users",
    relatedEntityId: "usr-8812",
    actionLabel: "Review User",
  },
  {
    id: "notif-pay-02",
    title: "Enterprise Subscription Expiration Warning",
    description: "Apex Innovations tier 1 annual contract will expire in 3 days. Automated renewal reminder dispatched.",
    category: "Payments",
    severity: "warning",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), // 6h ago
    timestamp: "6h ago",
    isRead: true,
    readAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    route: "payments",
    relatedEntityId: "sub-apex-2026",
    actionLabel: "View Subscription",
  },
  {
    id: "notif-ai-03",
    title: "Mistral Large Latency Spike",
    description: "Average inference roundtrip latency jumped to 1,840ms (+65% over baseline) on European cluster.",
    category: "AI Usage",
    severity: "warning",
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), // 8h ago
    timestamp: "8h ago",
    isRead: true,
    readAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    route: "ai-usage",
    relatedEntityId: "model-mistral-large",
    actionLabel: "Latency Stats",
  },
  {
    id: "notif-jobs-02",
    title: "Job Posting Awaiting Compliance Review",
    description: "New posting 'Staff Quantum AI Engineer' flagged for required salary disclosure compliance in California.",
    category: "Jobs",
    severity: "warning",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12h ago
    timestamp: "12h ago",
    isRead: true,
    readAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    route: "jobs",
    relatedEntityId: "job-comp-502",
    actionLabel: "Review Posting",
  },
  {
    id: "notif-jobs-03",
    title: "18 New Postings Ingested from Workday",
    description: "Ingestion pipeline verified and imported 18 new engineering and product roles from Workday feed.",
    category: "Jobs",
    severity: "info",
    createdAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(), // 16h ago
    timestamp: "16h ago",
    isRead: true,
    readAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    route: "jobs",
    relatedEntityId: "ingest-workday-99",
    actionLabel: "View Listings",
  },
  {
    id: "notif-usr-02",
    title: "New Recruiter Profile Created",
    description: "Recruiter profile created for Sarah Jenkins (Department: Enterprise Search). Role assigned: Recruiter Admin.",
    category: "Users",
    severity: "info",
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), // 20h ago
    timestamp: "20h ago",
    isRead: true,
    readAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    route: "users",
    relatedEntityId: "usr-9014",
    actionLabel: "User Details",
  },
  {
    id: "notif-job-src-03",
    title: "LinkedIn Talent Hub Synced Successfully",
    description: "Scheduled synchronization completed in 1.2s. 42 existing jobs verified and active state refreshed.",
    category: "Job Sources",
    severity: "success",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1d ago
    timestamp: "Yesterday",
    isRead: true,
    readAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    route: "job-sources",
    relatedEntityId: "src-linkedin-01",
    actionLabel: "Inspect Feed",
  },
  {
    id: "notif-pay-03",
    title: "Wire Payment Received ($12,500.00)",
    description: "Enterprise tier wire transfer from Vertex Global Partners cleared and credited to Account #AC-9901.",
    category: "Payments",
    severity: "success",
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(), // 1d ago
    timestamp: "Yesterday",
    isRead: true,
    readAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    route: "payments",
    relatedEntityId: "pay-1049",
    actionLabel: "View Receipt",
  },
  {
    id: "notif-set-01",
    title: "System Snapshot Backup Saved",
    description: "Daily automated database snapshot and encryption bundle saved to cloud vault (SHA-256 verified).",
    category: "Settings",
    severity: "success",
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 1.5d ago
    timestamp: "2d ago",
    isRead: true,
    readAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
    route: "settings",
    relatedEntityId: "set-backup-daily",
    actionLabel: "View Settings",
  },
];
