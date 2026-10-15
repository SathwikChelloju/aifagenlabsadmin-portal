/**
 * Page Context Service
 * Provides authentic, page-specific explanations, active metrics,
 * controls, and capabilities for every route in the portal.
 */

import { mockStore } from "../../../mocks/mockStore.js";
import { recruiterService } from "../../recruiters/services/recruiterService.js";
import { aiUsageService } from "../../ai-usage/services/aiUsageService.js";

export function getPageContext(pageId = "dashboard") {
  const normId = (pageId || "dashboard")
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
  const state = mockStore.getState();

  const pageRegistry = {
    overview: {
      id: "overview",
      title: "Platform Overview",
      module: "Global Executive Telemetry",
      purpose:
        "Aggregates macro platform health, candidate placement trends, gross transactional volume, and cloud infrastructure benchmarks across all global regions.",
      getLiveMetrics: () => [
        {
          label: "Total Candidates",
          value: state.users?.length || 0,
          trend: "+12.4% MoM",
        },
        {
          label: "Active Jobs Index",
          value: state.publicJobs?.length || 0,
          trend: "+8.1% vs last wk",
        },
        {
          label: "Verified Recruiters",
          value: recruiterService.getRecruiters()?.length || 0,
          trend: "100% active",
        },
        { label: "System Health", value: "99.94%", trend: "Nominal" },
      ],
      mainControls: [
        "Time Range Selector (7d, 30d, 90d, 1y) to filter executive visualizations",
        "Export Executive Summary CSV button for executive reporting",
        "Global Ingestion Trigger to initiate immediate scraper synchronizations",
      ],
      whatYouCanFind: [
        "Cross-functional metrics correlating talent applications with job ingestion",
        "Conversion funnel from initial registration to successful international placement",
        "Regional breakdown across UK, EU, US, and APAC candidate destinations",
      ],
    },

    dashboard: {
      id: "dashboard",
      title: "Operational Dashboard",
      module: "Mission Control & Real-time Feeds",
      purpose:
        "Central command center monitoring real-time scraper queues, pending user approvals, active talent matches, and recent system audit events.",
      getLiveMetrics: () => [
        {
          label: "Active Scraper Feeds",
          value:
            state.jobSources?.filter((s) => s.status === "Active")?.length || 0,
          trend: "Operational",
        },
        {
          label: "Pending Candidate Triage",
          value: state.candidates?.length || 12,
          trend: "4 high priority",
        },
        {
          label: "Recent Ingestion Runs",
          value: state.syncHistory?.length || 0,
          trend: "Last 24h",
        },
      ],
      mainControls: [
        "Sync Feeds quick-action button in header",
        "Live Scraper Health widget with one-click restart for stalled workers",
        "Candidate Verification action card for manual ATS tier escalation",
      ],
      whatYouCanFind: [
        "Live status of data ingestion workers across LinkedIn, Greenhouse, Lever, and Naukri",
        "Recent audit trail snippet showing high-impact administrative actions",
        "Quick access navigation to candidates, recruiters, and financial transactions",
      ],
    },

    users: {
      id: "users",
      title: "Users & Candidate Management",
      module: "Talent Directory & Profiles",
      purpose:
        "Manages candidate accounts, career goals, target visa jurisdictions, ATS scoring records, subscription tiers, and AI token quotas.",
      getLiveMetrics: () => {
        const users = state.users || [];
        const premium = users.filter((u) => u.plan === "Premium").length;
        const active = users.filter((u) => u.status === "Active").length;
        return [
          { label: "Total Users", value: users.length, trend: "All verified" },
          {
            label: "Premium Subscribers",
            value: premium,
            trend: `${Math.round((premium / (users.length || 1)) * 100)}% conversion`,
          },
          {
            label: "Active Accounts",
            value: active,
            trend: "In good standing",
          },
        ];
      },
      mainControls: [
        "Global Search bar filtering candidates by name, email, visa goal, or target country",
        "Plan Filter (All, Premium, Starter, Enterprise) and Status Filter (Active, Suspended)",
        "Add Candidate modal for manual onboarding",
        "Change Plan & Status dropdowns in candidate profile drawer",
        "Export Users CSV button",
      ],
      whatYouCanFind: [
        "Comprehensive user records with ATS scores, tailored CV counts, and interview logs",
        "AI usage costs and compute consumption per candidate",
        "Target visa categories (e.g. UK Skilled Worker Tier 2, EU Blue Card, US H-1B)",
      ],
    },

    recruiters: {
      id: "recruiters",
      title: "Recruiter Operations",
      module: "Talent Acquisition Partners",
      purpose:
        "Supervises internal and partner talent consultants, candidate distribution pipelines, interview volumes, and successful placement rates.",
      getLiveMetrics: () => {
        const recruiters = recruiterService.getRecruiters() || [];
        const active = recruiters.filter((r) => r.status === "Active").length;
        const totalPlacements = recruiters.reduce(
          (sum, r) => sum + (Number(r.successfulPlacements) || 0),
          0,
        );
        return [
          {
            label: "Total Recruiters",
            value: recruiters.length,
            trend: "Directory",
          },
          {
            label: "Active Consultants",
            value: active,
            trend: `${active}/${recruiters.length} active`,
          },
          {
            label: "Total Placements",
            value: totalPlacements,
            trend: "Verified hires",
          },
        ];
      },
      mainControls: [
        "Add Recruiter button to invite and provision verified acquisition consultants",
        "Department and Status filters to segment specialists by sector",
        "Export Recruiter Performance CSV button",
        "Edit, Suspend, and Reassign candidate controls per recruiter row",
      ],
      whatYouCanFind: [
        "Individual recruiter performance metrics: interviews conducted vs placements achieved",
        "Placement conversion rates (%) calculated deterministically",
        "Assigned candidate queues and recent recruitment activity logs",
      ],
    },

    jobs: {
      id: "jobs",
      title: "Unified Job Repository",
      module: "Live Job Listings & Vacancies",
      purpose:
        "Indexes verified tech, engineering, and AI career opportunities ingested from partner ATS feeds, global scrapers, and direct internal employers.",
      getLiveMetrics: () => {
        const allJobs = mockStore.getAllJobs() || [];
        const active = allJobs.filter(
          (j) => j.status === "Active" || !j.status,
        ).length;
        return [
          {
            label: "Indexed Vacancies",
            value: allJobs.length,
            trend: "Unified database",
          },
          {
            label: "Active Listings",
            value: active,
            trend: "Open to candidates",
          },
          {
            label: "Internal Roles",
            value: (state.internalJobs || []).length,
            trend: "Verified internal",
          },
        ];
      },
      mainControls: [
        "Create Job posting form for direct internal employer recruitment",
        "Filter by Job Type (Full-time, Contract, Remote), Location, and Match Score",
        "Bulk Status Update and Hide/Unhide listings",
        "Export Jobs CSV button",
      ],
      whatYouCanFind: [
        "Salary benchmarks, visa sponsorship availability tags, and applicant counts",
        "ATS algorithmic match scores linking candidates to top vacancies",
        "Source provenance tracking (e.g. Greenhouse, Lever, LinkedIn, Internal)",
      ],
    },

    "internal-jobs": {
      id: "internal-jobs",
      title: "Internal Jobs Management",
      module: "AIFA GEN LABS Proprietary Openings",
      purpose:
        "Dedicated management for proprietary vacancies created and managed directly by AIFA GEN LABS administrators and verified hiring managers.",
      getLiveMetrics: () => {
        const internal = state.internalJobs || [];
        return [
          {
            label: "Internal Postings",
            value: internal.length,
            trend: "Direct hiring",
          },
          {
            label: "Applications",
            value: internal.reduce((s, j) => s + (j.applicantsCount || 0), 0),
            trend: "Direct applicants",
          },
        ];
      },
      mainControls: [
        "Add Internal Opening modal with role requirements and salary bands",
        "Direct Candidate Assignment for accelerated internal referral",
      ],
      whatYouCanFind: [
        "Proprietary engineering, research, and talent operations roles within AIFA GEN LABS",
        "Internal hiring manager contact information and pipeline stage metrics",
      ],
    },

    "job-sources": {
      id: "job-sources",
      title: "Job Ingestion & Scraper Sources",
      module: "Data Crawlers & ATS Connectors",
      purpose:
        "Monitors, configures, and tests automated job ingestion connectors across job boards, enterprise ATS APIs, and custom scraping proxy meshes.",
      getLiveMetrics: () => {
        const sources = state.jobSources || [];
        const active = sources.filter((s) => s.status === "Active").length;
        const totalFetched = sources.reduce(
          (s, src) => s + (src.jobsRetrieved || src.totalJobsRetrieved || 0),
          0,
        );
        return [
          {
            label: "Configured Sources",
            value: sources.length,
            trend: "Connectors",
          },
          {
            label: "Healthy Connectors",
            value: active,
            trend: `${active}/${sources.length} active`,
          },
          {
            label: "Total Ingested Jobs",
            value: totalFetched,
            trend: "All-time crawled",
          },
        ];
      },
      mainControls: [
        "Add Ingestion Source button to configure new REST, webhook, or crawler endpoints",
        "Trigger Manual Sync on any specific connector",
        "Restart Stalled Scraper queue workers",
        "Configure Polling Frequency, rate limit backoffs, and proxy settings",
      ],
      whatYouCanFind: [
        "Latency benchmarks, HTTP 429 rate limit diagnostics, and synchronization logs",
        "Historical crawler run logs detailing jobs discovered, added, and skipped",
        "Duplicate detection telemetry preventing redundant job indexing",
      ],
    },

    payments: {
      id: "payments",
      title: "Financial Transactions & Billing",
      module: "Revenue & Subscription Ledger",
      purpose:
        "Tracks candidate subscription billings, one-time placement concierge charges, enterprise fees, and refund lifecycle operations.",
      getLiveMetrics: () => {
        const txns = state.transactions || [];
        const successTxns = txns.filter((t) => t.status === "Successful");
        const totalRevenue = successTxns.reduce(
          (sum, t) => sum + (Number(t.usdAmount || t.amount) || 0),
          0,
        );
        return [
          {
            label: "Total Transactions",
            value: txns.length,
            trend: "Ledger records",
          },
          {
            label: "Gross Settled Revenue",
            value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            trend: `${successTxns.length} successful`,
          },
          {
            label: "Pending Transactions",
            value: txns.filter((t) => t.status === "Pending").length,
            trend: "Settling",
          },
        ];
      },
      mainControls: [
        "Filter by Status (Successful, Pending, Failed, Refunded)",
        "Currency Selector (USD, EUR, GBP, INR)",
        "Issue Refund dialog with mandatory audit trail reason",
        "Generate and Print PDF Invoices",
        "Export Financial Transactions CSV",
      ],
      whatYouCanFind: [
        "Complete payment audit trails with short IDs, transaction hashes, and payment method details",
        "Breakdown of subscription plan payments vs bespoke concierge career services",
      ],
    },

    "ai-usage": {
      id: "ai-usage",
      title: "AI Usage & Compute Telemetry",
      module: "LLM Consumption & Financial Governance",
      purpose:
        "Monitors token consumption, LLM model execution costs (OpenAI, Anthropic, Google Gemini), budget enforcement ceilings, and API latency benchmarks.",
      getLiveMetrics: () => {
        const requests = aiUsageService.getRequests() || [];
        const budget = aiUsageService.getBudget() || { monthlyBudgetUsd: 1500 };
        const totalCost = requests.reduce(
          (sum, r) => sum + (r.estimatedCost || 0),
          0,
        );
        const totalTokens = requests.reduce(
          (sum, r) => sum + (r.totalTokens || 0),
          0,
        );
        return [
          {
            label: "Total AI Calls",
            value: requests.length,
            trend: "Telemetry traces",
          },
          {
            label: "Estimated Spend",
            value: `$${totalCost.toFixed(2)}`,
            trend: `Budget: $${budget.monthlyBudgetUsd.toFixed(2)}`,
          },
          {
            label: "Tokens Processed",
            value: `${(totalTokens / 1_000_000).toFixed(2)}M`,
            trend: "Input + Output",
          },
        ];
      },
      mainControls: [
        "Time Range Selector (24h, 7d, 30d, 90d, All)",
        "Filter by Provider (OpenAI, Anthropic, Google, Mistral) and Feature",
        "Configure Monthly Budget & Alert Threshold modal",
        "Diagnostic Drawer inspecting input/output token counts and latency per request",
        "Export AI Telemetry CSV button",
      ],
      whatYouCanFind: [
        "Detailed cost comparisons between model architectures (e.g. Claude 3.5 Sonnet vs Gemini 1.5 Flash)",
        "Top AI compute consumers ranked by tokens, calls, and expenditure",
        "Cost optimization opportunities to lower monthly operational overhead",
      ],
    },

    "audit-logs": {
      id: "audit-logs",
      title: "Security & Platform Audit Logs",
      module: "Compliance & Governance Trail",
      purpose:
        "Immutable audit log tracking all administrative interventions, permission changes, security policy updates, and data exports for regulatory compliance.",
      getLiveMetrics: () => {
        const logs = state.auditLogs || [];
        return [
          {
            label: "Recorded Events",
            value: logs.length,
            trend: "Audit entries",
          },
          {
            label: "SuperAdmin Events",
            value: logs.filter((l) => l.admin?.includes("admin")).length,
            trend: "Privileged tier",
          },
        ];
      },
      mainControls: [
        "Search audit entries by administrator, action type, or target resource",
        "Filter by Category (Security, User Management, Billing, Ingestion, Administration)",
        "Export Audit Trail CSV for external compliance reviews",
      ],
      whatYouCanFind: [
        "Exact timestamped records of who modified what configuration parameter and when",
        "IP address origins, session identifiers, and recorded justification notes",
      ],
    },

    settings: {
      id: "settings",
      title: "Platform Administration Settings",
      module: "Global Configuration Console",
      purpose:
        "Centralized configuration workspace controlling organization metadata, branding logos, favicons, regional timezones, security policies, and integrations.",
      getLiveMetrics: () => {
        const general = state.settings?.general || {};
        return [
          {
            label: "Platform Name",
            value: general.platformName || "AIFA GEN LABS",
            trend: "Active branding",
          },
          {
            label: "Timezone",
            value: general.timezone || "Asia/Kolkata",
            trend: "Regional anchor",
          },
          {
            label: "Config Sections",
            value: "9 Sections",
            trend: "Fully customizable",
          },
        ];
      },
      mainControls: [
        "Platform Logo & Favicon upload controls with real-time browser preview",
        "Regional Settings (Language, Timezone, Date Format, Time Format)",
        "View Changes comparison modal highlighting modified parameters before saving",
        "Reset to Saved and Save Changes action buttons",
      ],
      whatYouCanFind: [
        "Platform Information and Contact Metadata",
        "Security & MFA enforcement policies",
        "Job Aggregation crawler polling intervals and duplicate detection modes",
      ],
    },
  };

  const matched = pageRegistry[normId] || pageRegistry.dashboard;
  return {
    ...matched,
    liveMetrics: matched.getLiveMetrics ? matched.getLiveMetrics() : [],
  };
}
