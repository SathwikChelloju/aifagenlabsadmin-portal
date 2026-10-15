/**
 * AI Admin Assistant Constants & Default Configurations
 * AIFA GEN LABS Admin Portal
 */

export const ASSISTANT_STORAGE_KEY = "aifa_admin_assistant_chat_v1";

export const DEFAULT_SUGGESTIONS = [
  {
    id: "explain_page",
    label: "Explain this page",
    prompt: "Explain this page",
    category: "context",
  },
  {
    id: "premium_users",
    label: "List all users on the Premium plan",
    prompt: "List all users on the Premium plan",
    category: "users",
  },
  {
    id: "ai_cost_compare",
    label: "Compare AI costs this month and last month",
    prompt: "Compare AI costs this month and last month",
    category: "ai-usage",
  },
  {
    id: "active_recruiters",
    label: "Show active recruiters",
    prompt: "Show active recruiters",
    category: "recruiters",
  },
  {
    id: "best_job_source",
    label: "Which job source has the highest success rate?",
    prompt: "Which job source has the highest success rate?",
    category: "job-sources",
  },
  {
    id: "job_fetch_report",
    label: "Generate a job-fetching report for the last 7 days",
    prompt: "Generate a job-fetching report for the last 7 days",
    category: "reports",
  },
];

export const INITIAL_ASSISTANT_MESSAGE = {
  id: "msg_welcome",
  sender: "assistant",
  timestamp: new Date().toISOString(),
  text: "Hello! I am your **AI Admin Assistant** for AIFA GEN LABS. I have live access to platform telemetry, candidates, recruiters, jobs, scraping feeds, payments, and AI model expenditures.",
  structured: {
    type: "welcome",
    quickCapabilities: [
      "Ask **'Explain this page'** anytime to understand the active module and its live metrics.",
      "Query candidate records, filter by plan (e.g. **Premium**), or inspect user activity.",
      "Compare **AI usage costs** month-over-month with deterministic financial metrics.",
      "Audit **job scrapers & sources** to identify highest success rates and stalled workers.",
      "Generate and download **real operational reports** on demand.",
    ],
  },
};
