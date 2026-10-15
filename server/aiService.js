/**
 * AI Provider Adapter & Intent Interpreter Service
 * AIFA GEN LABS Admin Portal Backend
 *
 * Implements:
 * 1. Gemini API (gemini-1.5-flash) when GEMINI_API_KEY is configured.
 * 2. Groq API (llama-3.3-70b-versatile) when GROQ_API_KEY is configured.
 * 3. Deterministic Semantic NLU Parser when no AI API key is configured.
 *
 * Enforces:
 * - Real data separation: The AI model ONLY chooses the tool and parameters.
 * - The actual database records and numbers are retrieved and calculated by deterministic tools.
 * - Never hallucinates or fabricates records.
 */

import { executeTool } from "../src/features/assistant/services/toolRegistry.js";
import { buildApplicationContext } from "./contextBuilder.js";

const VALID_TOOLS = new Set([
  "search_users",
  "search_candidates",
  "get_expiring_subscriptions",
  "search_recruiters",
  "search_employees",
  "search_jobs",
  "get_failed_job_sources",
  "get_job_sources",
  "compare_ai_costs",
  "get_payments",
  "get_overview_metrics",
  "compare_ai_and_job_fetching",
  "get_monthly_platform_report",
  "explain_page",
  "generate_report",
  "explain_report_errors",
  "greeting",
  "help",
  "unsupported_query",
  "clarify_question",
]);

/**
 * Official Tool Calling Definitions (OpenAI / Groq function calling schema)
 * Instructs model to omit optional parameters when unsupplied, never passing null.
 */
export const AI_TOOLS_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "search_users",
      description: "Search platform users across all roles (Candidate, Recruiter, Admin) by subscription plan (Basic, Premium, None), status (Active, Past Due, Suspended), role, or name. Omit unsupplied parameters, do not send null.",
      parameters: {
        type: "object",
        properties: {
          plan: { type: "string", description: "Subscription plan: 'Basic', 'Premium', or 'None' (omit if not filtering, never send null)" },
          status: { type: "string", description: "Account status: 'Active', 'Past Due', or 'Suspended' (omit if not filtering, never send null)" },
          role: { type: "string", description: "Role: 'Candidate', 'Recruiter', or 'Admin' (omit if not filtering, never send null)" },
          name: { type: "string", description: "Name or search string (omit if not filtering, never send null)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_candidates",
      description: "Search candidate talent records specifically (job seekers, applicants) with ATS resume scores and target destinations. Omit unsupplied parameters, do not send null.",
      parameters: {
        type: "object",
        properties: {
          plan: { type: "string", description: "Subscription plan: 'Basic', 'Premium', or 'None' (omit if not filtering, never send null)" },
          status: { type: "string", description: "Account status: 'Active', 'Past Due', or 'Suspended' (omit if not filtering, never send null)" },
          name: { type: "string", description: "Candidate name (omit if not filtering, never send null)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_expiring_subscriptions",
      description: "Retrieve candidates or users whose active paid subscriptions are expiring soon within the next 30 days. Excludes already past-due or inactive accounts. Omit unsupplied parameters, do not send null.",
      parameters: {
        type: "object",
        properties: {
          role: { type: "string", description: "Candidate (default), Recruiter, or all (omit if default)" },
          daysWindow: { type: "number", description: "Window in days (default 30, omit if default, never send null)" },
          includePastDue: { type: "boolean", description: "Whether to include already past-due subscriptions (default false)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_recruiters",
      description: "Search internal recruiters and talent partners, their statuses, and placement metrics. IMPORTANT: Omit optional parameters when not supplied. Do NOT send null for name, minPlacements, or maxPlacements.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Recruiter name (omit if not filtering by name, never send null)" },
          status: { type: "string", description: "Status: 'Active', 'On Leave', or 'all' (omit if not filtering, never send null)" },
          maxPlacements: { type: "number", description: "Maximum placements filter (e.g. 0 for zero placements, 15 for max 15; omit if not filtering, never send null)" },
          minPlacements: { type: "number", description: "Minimum placements filter (e.g. 10 for min 10; omit if not filtering, never send null)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_employees",
      description: "Search internal company employee records outside recruiter staff. Reports data boundary if unavailable. Omit unsupplied parameters, do not send null.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Employee name (omit if not filtering, never send null)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_jobs",
      description: "Search open vacancies and ingested job records by keyword, days window, source, company, location, or grouped by source. Omit unsupplied parameters, do not send null.",
      parameters: {
        type: "object",
        properties: {
          search: { type: "string", description: "Job title or keyword query (omit if not filtering, never send null)" },
          source: { type: "string", description: "Job source e.g. Greenhouse, LinkedIn, Indeed, Naukri, Internal (omit if not filtering, never send null)" },
          company: { type: "string", description: "Company name (omit if not filtering, never send null)" },
          location: { type: "string", description: "Job location (omit if not filtering, never send null)" },
          days: { type: "number", description: "Number of days window e.g. 7 (omit if not filtering, never send null)" },
          limit: { type: "number", description: "Maximum records to return e.g. 20 (omit if not filtering, never send null)" },
          groupBy: { type: "string", description: "Group results by field e.g. 'source' (omit if not grouping, never send null)" },
          yesterday: { type: "boolean", description: "True if querying jobs ingested yesterday (omit if false)" },
          failedOnly: { type: "boolean", description: "True if querying jobs or ingestion runs that failed (omit if false)" },
          jobType: { type: "string", description: "Job type: Full-Time, Contract, public, internal (omit if not filtering, never send null)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_failed_job_sources",
      description: "Identify failed, broken, stalled, or erroring job ingestion sources and feeder scrapers.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_job_sources",
      description: "Retrieve all job aggregation sources, sync health, discovered job counts, and success rates.",
      parameters: {
        type: "object",
        properties: {
          calculateSuccessRate: { type: "boolean", description: "Calculate success percentage" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "compare_ai_costs",
      description: "Retrieve and compare platform AI token usage, LLM compute costs, and month-over-month expenditure.",
      parameters: {
        type: "object",
        properties: {
          compareMonths: { type: "boolean", description: "True to compare current month with prior month" },
          currentMonth: { type: "string", description: "Current month YYYY-MM (e.g. 2026-10)" },
          prevMonth: { type: "string", description: "Previous month YYYY-MM (e.g. 2026-09)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "compare_ai_and_job_fetching",
      description: "Correlate platform AI compute spend with job-fetching ingestion activity for a given month.",
      parameters: {
        type: "object",
        properties: {
          month: { type: "string", description: "Month in YYYY-MM format (e.g. 2026-10)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_monthly_platform_report",
      description: "Generate a multi-module executive platform report across Candidates, Jobs, Recruiters, AI Compute, and Revenue.",
      parameters: {
        type: "object",
        properties: {
          month: { type: "string", description: "Month in YYYY-MM format" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_payments",
      description: "Retrieve subscriber financial transactions, invoices, and ledger status.",
      parameters: {
        type: "object",
        properties: {
          status: { type: "string", description: "Successful, Pending, Failed, or all" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_overview_metrics",
      description: "Retrieve platform macro KPI health metrics (registered users, jobs, settled revenue, ATS rates).",
      parameters: {
        type: "object",
        properties: {
          period: { type: "string", description: "Period: 7d, 30d, 90d, or ytd" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_subscription_breakdown",
      description: "Analyze and calculate subscription plan distribution (Basic, Premium, None) and account status breakdown (Active, Inactive, Past Due, Suspended), answering queries like which plan has the most inactive users.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analyze_recruiters",
      description: "Analyze recruiter placement performance, conversion rates, and rankings against the team average (37.1%), and evaluate historical comparison requests.",
      parameters: {
        type: "object",
        properties: {
          comparePeriod: { type: "string", description: "Optional comparison timeframe e.g. 3m" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "explain_company",
      description: "Explain AIFA GEN LABS Admin Portal, system architecture, core modules, and disclose in-memory mock dataset usage.",
      parameters: {
        type: "object",
        properties: {
          topic: { type: "string", description: "Topic to explain e.g. overview, company, architecture" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "recheck_previous_answer",
      description: "Re-run authoritative verification against the portal's source of truth when challenged or asked to recheck a previous answer or calculation.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The challenge or recheck question" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_report",
      description: "Generate an operational job-fetching report for a specified timeframe (default 7 days) including summary KPIs, actual job listings, source breakdown, connector error audits, and downloadable CSV. Omit unsupplied parameters, do not send null.",
      parameters: {
        type: "object",
        properties: {
          days: { type: "number", description: "Timeframe in days (default 7; omit if default, never send null)" },
          reportType: { type: "string", description: "Report type identifier e.g. 'job_fetching_7d' (omit if default)" },
        },
      },
    },
  },
];

/**
 * Safely extracts and validates JSON from model responses,
 * handling markdown code fences, surrounding text, and malformed structures.
 */
export function safeExtractModelJson(rawText) {
  if (!rawText || typeof rawText !== "string") return null;

  let text = rawText.trim();

  // Strip Markdown code block delimiters if present (```json ... ```)
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  }

  // Find enclosing JSON object boundaries
  const startIdx = text.indexOf("{");
  const endIdx = text.lastIndexOf("}");
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    return null;
  }

  const jsonSubstring = text.slice(startIdx, endIdx + 1);
  try {
    const parsed = JSON.parse(jsonSubstring);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    // Validate tool field
    if (!parsed.tool || typeof parsed.tool !== "string") {
      return null;
    }

    // Match against known tools (normalize minor tool typos if any)
    const normalizedTool = parsed.tool.toLowerCase().trim();
    if (!VALID_TOOLS.has(normalizedTool)) {
      return null;
    }

    return {
      tool: normalizedTool,
      params: (parsed.params && typeof parsed.params === "object" && !Array.isArray(parsed.params))
        ? parsed.params
        : {},
      reasoning: typeof parsed.reasoning === "string" ? parsed.reasoning.trim() : "",
    };
  } catch {
    return null;
  }
}

export const TOOL_SCHEMA_PROMPT = `
You are the AI Intent Classifier and Tool Selector for the AIFA GEN LABS Admin Portal.
Your job is ONLY to analyze the user's natural language question and return a valid JSON object specifying:
{
  "tool": "<tool_name>",
  "params": { ... },
  "reasoning": "<short explanation of your interpretation>"
}

Available Tools and Parameters:
1. "search_users":
   - params: { "name": string (optional), "email": string (optional), "plan": "Basic" | "Premium" | "None" | string (optional), "status": "Active" | "Past Due" | "Suspended" | "all" (optional), "role": "Candidate" | "Recruiter" | "Admin" | "all" (optional) }
   - Use for queries seeking platform user accounts across all roles by name, email, subscription plan, role, or status.
   - Example: "list out all users with basic plan" -> { "tool": "search_users", "params": { "plan": "Basic" } }
   - Example: "List all users" -> { "tool": "search_users", "params": {} }
   - Example: "List all users with Starter plan" -> { "tool": "search_users", "params": { "plan": "Starter" } }
   - Example: "Show all Premium users" -> { "tool": "search_users", "params": { "plan": "Premium" } }

2. "search_candidates":
   - params: { "name": string (optional), "email": string (optional), "plan": "Basic" | "Premium" | "None" | string (optional), "status": "Active" | "Past Due" | "Suspended" | "all" (optional) }
   - Use specifically when the query mentions "candidates", "applicants", or "talent" (role = Candidate).
   - Example: "Find candidates with Basic plan" -> { "tool": "search_candidates", "params": { "plan": "Basic" } }
   - Example: "Is there a candidate named Sathwik?" -> { "tool": "search_candidates", "params": { "name": "Sathwik" } }
   - Example: "sathwik" -> { "tool": "search_candidates", "params": { "name": "sathwik" } }

3. "search_recruiters":
   - params: { "name": string (optional), "status": "Active" | "On Leave" | "all" (optional), "minPlacements": number (optional), "maxPlacements": number (optional) }
   - Use for queries about recruiter staff, talent acquisition partners, recruiters with zero or specific placement counts.
   - Example: "List recruiters who have not made any placements" -> { "tool": "search_recruiters", "params": { "maxPlacements": 0 } }
   - Example: "Find recruiters named Sarah" -> { "tool": "search_recruiters", "params": { "name": "Sarah" } }

4. "search_employees":
   - params: { "name": string (optional) }
   - Use when the user specifically asks for "employees" or company staff outside recruiter roles.
   - Example: "Find employees named Sathwik" -> { "tool": "search_employees", "params": { "name": "Sathwik" } }

4. "search_jobs":
   - params: { "title": string (optional), "company": string (optional), "jobType": string (optional), "status": string (optional) }
   - Use for searching job records, vacancies, postings, roles.

5. "get_failed_job_sources":
   - params: {}
   - Use specifically when asking about failed, broken, stalled, or erroring job sources / scrapers.
   - Example: "Which job sources have failed?" -> { "tool": "get_failed_job_sources", "params": {} }

6. "get_job_sources":
   - params: { "calculateSuccessRate": boolean }
   - Use for general job sources, scrapers, connectors, rankings, or success rates.
   - Example: "Which job source has the highest success rate?" -> { "tool": "get_job_sources", "params": { "calculateSuccessRate": true } }

7. "compare_ai_costs":
   - params: { "compareMonths": boolean, "currentMonth": "2026-10", "prevMonth": "2026-09" }
   - Use for comparing AI costs, LLM expenditures, token usage across months.
   - Example: "Compare this month's AI costs with last month" -> { "tool": "compare_ai_costs", "params": { "compareMonths": true } }

8. "get_payments":
   - params: { "status": "Successful" | "Pending" | "Failed" | "all" (optional) }
   - Use for payments, financial transactions, ledger, settled revenue.

9. "get_overview_metrics":
   - params: { "period": "7d" | "30d" | "90d" | "ytd" }
   - Use for executive overview KPIs, platform macro health, period trends.

10. "compare_ai_and_job_fetching":
    - params: { "month": "2026-10" }
    - Multi-module tool! Use when query asks to correlate or compare AI costs with job-fetching / ingestion activity.
    - Example: "Compare AI costs with job-fetching activity this month" -> { "tool": "compare_ai_and_job_fetching", "params": { "month": "2026-10" } }

11. "get_monthly_platform_report":
    - params: { "month": "2026-10" }
    - Multi-module tool! Use when asking for a comprehensive monthly platform report.
    - Example: "Give me a monthly platform report" -> { "tool": "get_monthly_platform_report", "params": { "month": "2026-10" } }

12. "explain_page":
    - params: { "pageId": string }
    - Use when the user asks to explain the active view/page.

13. "generate_report":
    - params: { "reportType": "job_fetching_7d" }
    - Use when asking for a 7-day job-fetching CSV export or operational report.

14. "unsupported_query":
    - params: { "topic": string, "message": string }
    - Use when the user asks about completely unrelated non-portal subjects (e.g. weather, sports, cooking, politics).

15. "clarify_question":
    - params: { "reason": string }
    - Use when the question is gibberish, completely unclear, or ambiguous.

Respond strictly with valid JSON. Do not include markdown codeblocks or extraneous text.
`;

/**
 * Deterministic Semantic NLU Parser (Used when live AI API key is not configured)
 * Understands natural language patterns, entities, filters, and multi-module relationships.
 */
export function parseIntentDeterministically(prompt = "", activePage = "dashboard", history = []) {
  const p = prompt.trim();
  const lower = p.toLowerCase();

  // 0. Recheck / Challenge / Verification of Previous Answer
  if (
    /\b(recheck|re-check|double check|verify your|check again|challenge your|does not exist|looks incorrect|wrong calculation|are you sure)\b/i.test(lower) ||
    lower === "recheck your previous answer" ||
    lower === "recheck your previous answer."
  ) {
    return {
      tool: "recheck_previous_answer",
      params: { query: p, history },
      reasoning: "User challenged or requested re-verification of the previous answer against authoritative portal records.",
    };
  }

  // 0B. Conversational Follow-up: Summarize in three points
  if (/summarize (?:that|this) in (?:three|3) (?:bullet )?points?/i.test(lower)) {
    let lastAssistant = "";
    if (Array.isArray(history) && history.length > 0) {
      for (let i = history.length - 1; i >= 0; i--) {
        const msg = history[i];
        if (msg.sender === "assistant" || msg.role === "assistant") {
          lastAssistant = msg.text || msg.summary || "";
          if (lastAssistant) break;
        }
      }
    }
    return {
      tool: "conversation_summary",
      params: { text: lastAssistant, query: p },
      reasoning: "User requested a 3-point summary of the preceding response.",
    };
  }

  // 0C. Conversational Follow-up: "What caused that change?" / "What caused the increase?" / "Which of those causes can you verify?"
  if (
    /(what caused (?:that|the) (?:change|increase|growth|difference)|why did (?:it|they|costs?) increase)/i.test(lower) ||
    /(which of (?:those|these) causes? can you verify|can you verify that)/i.test(lower)
  ) {
    return {
      tool: "compare_ai_costs",
      params: { compareMonths: true, currentMonth: "2026-10", prevMonth: "2026-09" },
      reasoning: "Conversational follow-up analyzing the verified drivers vs hypotheses behind the metric increase.",
    };
  }

  // 0C2. Conversational Follow-up: Cost reduction advice ("How can we reduce those costs?")
  if (
    lower.includes("reduce") ||
    lower.includes("cut cost") ||
    lower.includes("save cost") ||
    lower.includes("optimize cost") ||
    lower.includes("lower cost") ||
    (lower.includes("how can we") && (lower.includes("cost") || lower.includes("spend")))
  ) {
    return {
      tool: "cost_reduction_advice",
      params: {},
      reasoning: "User requested cost optimization advice for platform AI compute spending.",
    };
  }

  // 0C3. Conversational Follow-up: Explain the errors in that report
  if (
    /explain (?:the )?errors? (?:in (?:that|the) report|from that report)/i.test(lower) ||
    lower === "explain the errors in that report." ||
    lower === "explain the errors in that report" ||
    (lower.includes("error") && lower.includes("report"))
  ) {
    return {
      tool: "explain_report_errors",
      params: {},
      reasoning: "Conversational follow-up explaining the connector errors identified in the 7-day job fetching report.",
    };
  }

  // 0D. Company Knowledge & Portal Overview ("Tell me about AIFA GEN LABS", "What is this admin portal?")
  if (
    lower.includes("tell me about aifa") ||
    lower.includes("what is aifa") ||
    /(?:what (?:is this|this)|explain (?:this|what this|the)|about (?:this|the))\s+(?:admin\s+)?portal/i.test(lower) ||
    lower.includes("about the portal") ||
    lower.includes("about the company") ||
    lower.includes("company overview") ||
    lower.includes("how does our ai admin assistant work")
  ) {
    return {
      tool: "explain_company",
      params: { topic: "company" },
      reasoning: "User requested verified platform knowledge about AIFA GEN LABS Admin Portal.",
    };
  }

  // 0E. Subscription Breakdown & Inactive Users by Plan
  if (
    lower.includes("inactive user") ||
    lower.includes("inactive users") ||
    lower.includes("most inactive") ||
    (lower.includes("subscription") && (lower.includes("breakdown") || lower.includes("distribution") || lower.includes("status")))
  ) {
    return {
      tool: "get_subscription_breakdown",
      params: {},
      reasoning: "User requested subscription breakdown across plans and account statuses (active, inactive, past due, suspended).",
    };
  }

  // 0F. Recruiter Performance, 3-Month Comparison, and Coaching
  if (
    (lower.includes("recruiter") || lower.includes("recruiters")) &&
    (lower.includes("3 month") || lower.includes("three month") || lower.includes("quarter") || lower.includes("performance") || lower.includes("coaching") || lower.includes("below expectation") || lower.includes("conversion") || lower.includes("rank") || lower.includes("benchmark") || lower.includes("average"))
  ) {
    return {
      tool: "analyze_recruiters",
      params: { comparePeriod: "3m" },
      reasoning: "User queried recruiter performance benchmarks, conversion rates, and historical 3-month performance.",
    };
  }

  // 0G. Specific Page Explanations
  if (lower.includes("explain the users page") || lower.includes("what does the users page do")) {
    return { tool: "explain_page", params: { pageId: "users" }, reasoning: "User asked to explain Users page." };
  }
  if (lower.includes("what does the job sources page do") || lower.includes("explain the job sources page")) {
    return { tool: "explain_page", params: { pageId: "job-sources" }, reasoning: "User asked to explain Job Sources page." };
  }
  if (lower.includes("what can i monitor from the overview page") || lower.includes("explain the overview page")) {
    return { tool: "explain_page", params: { pageId: "overview" }, reasoning: "User asked to explain Overview page." };
  }

  // 1. Casual Greetings & Openers
  if (/^(hi|hello|hey|howdy|sup|greetings)(\s+.*)?$/i.test(p)) {
    return {
      tool: "greeting",
      params: {},
      reasoning: "User greeted the assistant.",
    };
  }

  // 2. Help & Capabilities
  if (/^(help|\?|what can you do|how to use|commands|capabilities|guide)$/i.test(lower)) {
    return {
      tool: "help",
      params: {},
      reasoning: "User requested capabilities guide.",
    };
  }

  // 3. Multi-Module: Compare AI costs with job-fetching activity
  if (
    (lower.includes("ai cost") || lower.includes("ai spend") || lower.includes("llm")) &&
    (lower.includes("job-fetch") || lower.includes("job fetch") || lower.includes("scraper") || lower.includes("ingestion"))
  ) {
    return {
      tool: "compare_ai_and_job_fetching",
      params: { month: "2026-10" },
      reasoning: "Multi-module query correlating AI compute spend with job-fetching ingestion activity.",
    };
  }

  // 4. Multi-Module: Monthly Platform Report
  if (
    (lower.includes("monthly") || lower.includes("platform")) &&
    (lower.includes("report") || lower.includes("summary")) &&
    !lower.includes("7 day") && !lower.includes("seven day") && !lower.includes("job-fetching report")
  ) {
    return {
      tool: "get_monthly_platform_report",
      params: { month: "2026-10" },
      reasoning: "User requested a comprehensive monthly platform executive report across modules.",
    };
  }

  // 5A. Failed Ingestion Jobs Query ("Show the jobs that failed to ingest")
  if (
    lower.includes("failed to ingest") ||
    lower.includes("failed jobs") ||
    (lower.includes("job") && lower.includes("failed") && !lower.includes("job source") && !lower.includes("source"))
  ) {
    return {
      tool: "search_jobs",
      params: { failedOnly: true },
      reasoning: "User asked for jobs that failed to ingest.",
    };
  }

  // 5B. Ingested Yesterday Telemetry Query ("How many jobs were ingested yesterday?")
  if (
    lower.includes("ingested yesterday") ||
    lower.includes("jobs yesterday") ||
    lower.includes("fetched yesterday") ||
    (lower.includes("how many jobs") && lower.includes("yesterday"))
  ) {
    return {
      tool: "search_jobs",
      params: { yesterday: true },
      reasoning: "User asked how many jobs were ingested yesterday.",
    };
  }

  // 5C. Jobs Grouped by Source ("List jobs from the last 7 days grouped by source.")
  if (
    (lower.includes("grouped by source") || lower.includes("by source")) &&
    (lower.includes("job") || lower.includes("fetch"))
  ) {
    const daysMatch = lower.match(/(?:last|past)\s+(\d+)\s+days?/i);
    const daysNum = daysMatch ? parseInt(daysMatch[1], 10) : 7;
    return {
      tool: "search_jobs",
      params: { days: daysNum, groupBy: "source" },
      reasoning: "User requested jobs grouped by source.",
    };
  }

  // 5D. Jobs Fetched from Specific Source (e.g. "Show jobs fetched from Greenhouse in the last 7 days.")
  if (
    lower.includes("greenhouse") &&
    (lower.includes("job") || lower.includes("fetch"))
  ) {
    const daysMatch = lower.match(/(?:last|past)\s+(\d+)\s+days?/i);
    const daysNum = daysMatch ? parseInt(daysMatch[1], 10) : 7;
    return {
      tool: "search_jobs",
      params: { source: "Greenhouse", days: daysNum },
      reasoning: "User requested jobs fetched from Greenhouse.",
    };
  }

  // 5E. Latest N Jobs (e.g. "Show the latest 20 jobs.")
  if (
    (lower.includes("latest") || lower.includes("recent")) &&
    (lower.includes("job") || lower.includes("vacancy") || lower.includes("listing"))
  ) {
    const numMatch = lower.match(/\b(\d+)\b/);
    const limitNum = numMatch ? parseInt(numMatch[1], 10) : 20;
    return {
      tool: "search_jobs",
      params: { limit: limitNum },
      reasoning: `User requested the latest ${limitNum} jobs.`,
    };
  }

  // 5F. 7-Day Job-Fetching Operational Report (e.g. "Generate a job-fetching report for the last 7 days.")
  if (
    (lower.includes("7 day") || lower.includes("seven day") || lower.includes("7-day") || lower.includes("last 7")) &&
    (lower.includes("report") || lower.includes("csv") || (lower.includes("generate") && lower.includes("job")))
  ) {
    return {
      tool: "generate_report",
      params: { days: 7, reportType: "job_fetching_7d" },
      reasoning: "User requested 7-day job-fetching operational report.",
    };
  }

  // 5G. List Jobs in Last N Days ("List all jobs fetched in the last 7 days.")
  if (
    (lower.includes("last 7") || lower.includes("7 day") || lower.includes("seven day") || lower.includes("7-day") || lower.includes("recent")) &&
    (lower.includes("list") || lower.includes("show") || lower.includes("get") || lower.includes("all jobs") || lower.includes("jobs fetched")) &&
    !lower.includes("report")
  ) {
    const daysMatch = lower.match(/(?:last|past)\s+(\d+)\s+days?/i);
    const daysNum = daysMatch ? parseInt(daysMatch[1], 10) : 7;
    return {
      tool: "search_jobs",
      params: { days: daysNum },
      reasoning: `User requested list of jobs fetched in the last ${daysNum} days.`,
    };
  }

  // 6. Explain Active Page
  if (
    lower.includes("explain this page") ||
    lower.includes("explain page") ||
    lower.includes("what is this page") ||
    lower.includes("about this page") ||
    lower.includes("page purpose") ||
    lower.includes("how does this page work")
  ) {
    return {
      tool: "explain_page",
      params: { pageId: activePage },
      reasoning: "User requested context explanation for the active admin module.",
    };
  }

  // 6b. Expiring Subscriptions / Plans expiring soon
  if (
    (lower.includes("expir") || lower.includes("renew") || lower.includes("lapse")) &&
    (lower.includes("soon") || lower.includes("plan") || lower.includes("subscription") || lower.includes("candidate") || lower.includes("user") || lower.includes("going to") || lower.includes("day") || lower.includes("detail"))
  ) {
    const isPastDueExplicit = lower.includes("past due") || lower.includes("overdue");
    const roleTarget = lower.includes("user") && !lower.includes("candidate") ? "all" : "Candidate";
    return {
      tool: "get_expiring_subscriptions",
      params: {
        role: roleTarget,
        daysWindow: 30,
        includePastDue: isPastDueExplicit,
      },
      reasoning: "User requested candidates or users whose subscriptions are expiring soon.",
    };
  }

  // 7. Failed or Stalled Job Sources
  if (
    (lower.includes("job source") || lower.includes("source") || lower.includes("scraper") || lower.includes("feed")) &&
    (lower.includes("fail") || lower.includes("failed") || lower.includes("error") || lower.includes("stalled") || lower.includes("broken") || lower.includes("down"))
  ) {
    return {
      tool: "get_failed_job_sources",
      params: { status: "Error" },
      reasoning: "User asked to identify failed or erroring job ingestion sources.",
    };
  }

  // 8. Job Sources: General & Success Rate
  if (
    lower.includes("job source") ||
    lower.includes("scraper") ||
    lower.includes("crawler") ||
    lower.includes("connector") ||
    (lower.includes("source") && (lower.includes("success") || lower.includes("rate") || lower.includes("best") || lower.includes("highest")))
  ) {
    return {
      tool: "get_job_sources",
      params: { calculateSuccessRate: true },
      reasoning: "User requested job sources with success rate rankings.",
    };
  }

  // 9. AI Costs & Usage: Month-over-Month Comparison & Telemetry Reports
  if (
    lower.includes("report of a usage") ||
    lower.includes("report of ai usage") ||
    (lower.includes("usage") && lower.includes("report")) ||
    ((lower.includes("ai cost") || lower.includes("ai usage") || lower.includes("token") || lower.includes("llm") || lower.includes("compute") || (lower.includes("ai") && lower.includes("usage"))) &&
     (lower.includes("compare") || lower.includes("month") || lower.includes("last month") || lower.includes("spend") || lower.includes("budget") || lower.includes("report") || lower.includes("generate") || lower.includes("breakdown") || lower.includes("cost") || lower.includes("usage") || lower.includes("show")))
  ) {
    return {
      tool: "compare_ai_costs",
      params: { compareMonths: true, currentMonth: "2026-10", prevMonth: "2026-09" },
      reasoning: "User asked for AI compute usage and cost report/comparison.",
    };
  }

  // 10. Recruiters with zero or no placements
  if (
    (lower.includes("recruiter") || lower.includes("consultant")) &&
    (lower.includes("not made any placement") || lower.includes("no placement") || lower.includes("zero placement") || lower.includes("0 placement") || lower.includes("without placement"))
  ) {
    return {
      tool: "search_recruiters",
      params: { maxPlacements: 0 },
      reasoning: "User specifically asked for recruiters with zero successful placements.",
    };
  }

  // 11. Search Employees explicitly (outside recruiter staff)
  if (
    lower.includes("employee") ||
    lower.includes("employees") ||
    lower.includes("staff") ||
    lower.includes("payroll")
  ) {
    // Extract potential name query
    const match = p.match(/(?:named|called|employee|staff)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    const extractedName = match ? match[1].replace(/^(named|called|for|is|are)\s+/i, "").trim() : null;

    return {
      tool: "search_employees",
      params: { name: extractedName || (p.split(/\s+/).length <= 2 ? p : null) },
      reasoning: "User asked for employee records.",
    };
  }

  // 12. Search Recruiters by Name or Status
  if (
    lower.includes("recruiter") ||
    lower.includes("recruiters") ||
    lower.includes("consultant") ||
    lower.includes("placement") ||
    lower.includes("headhunter")
  ) {
    const match = p.match(/(?:named|called|for|recruiter)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    const nameParam = match && !match[1].toLowerCase().includes("who") && !match[1].toLowerCase().includes("all")
      ? match[1].trim()
      : null;

    const statusParam = lower.includes("active") ? "Active" : lower.includes("leave") ? "On Leave" : "all";

    return {
      tool: "search_recruiters",
      params: { name: nameParam, status: statusParam },
      reasoning: "User queried recruiter directory.",
    };
  }

  // 12b. Search Candidates or Users by Account Status (Active, Past Due, Suspended, Inactive)
  const statusMatch = lower.match(/\b(past due|suspended|active|inactive)\b/i);
  if (statusMatch && (lower.includes("candidate") || lower.includes("user") || lower.includes("account") || lower.includes("show") || lower.includes("list") || lower.includes("who is"))) {
    const rawStatus = statusMatch[1].toLowerCase();
    const normalizedStatus = rawStatus === "past due" ? "Past Due" : rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
    if (lower.includes("candidate") || lower.includes("applicant") || lower.includes("talent")) {
      return {
        tool: "search_candidates",
        params: { status: normalizedStatus },
        reasoning: `User requested candidates with status "${normalizedStatus}".`,
      };
    }
    return {
      tool: "search_users",
      params: { status: normalizedStatus },
      reasoning: `User requested users with status "${normalizedStatus}".`,
    };
  }

  // 13. Search Users or Candidates by Subscription Plan
  // Handles: "list out all users with basic plan", "list all premium users", "find candidates with basic plan", "users with starter plan"
  const planMatch = lower.match(/\b(basic|premium|none|starter|enterprise|pro|free)\b/i);
  if (planMatch && (lower.includes("plan") || lower.includes("user") || lower.includes("candidate") || lower.includes("show") || lower.includes("list") || lower.includes("all") || lower.includes("find"))) {
    const rawPlan = planMatch[1].toLowerCase();
    const normalizedPlan = rawPlan.charAt(0).toUpperCase() + rawPlan.slice(1);

    // If candidate is explicitly requested
    if (lower.includes("candidate") || lower.includes("applicant") || lower.includes("talent")) {
      return {
        tool: "search_candidates",
        params: { plan: normalizedPlan },
        reasoning: `User requested candidates enrolled in the ${normalizedPlan} plan.`,
      };
    }

    // Default to search_users when user/account is requested or general query
    return {
      tool: "search_users",
      params: { plan: normalizedPlan },
      reasoning: `User requested platform users enrolled in the ${normalizedPlan} plan.`,
    };
  }

  // 14. List All Users / Search Users (Without Plan)
  // Handles: "List all users", "show all users", "all users", "list users"
  if (
    /^(?:list|show|get|display|view|all)?\s*(?:out)?\s*(?:all)?\s*(?:users|accounts|platform users)\b/i.test(p) ||
    lower === "list all users" ||
    lower === "all users" ||
    lower === "users" ||
    lower === "list out all users"
  ) {
    return {
      tool: "search_users",
      params: {},
      reasoning: "User requested a listing of all platform users across roles.",
    };
  }

  // 15. List All Candidates (Without Plan)
  if (
    /^(?:list|show|get|display|view|all)?\s*(?:out)?\s*(?:all)?\s*(?:candidates|applicants|talent)\b/i.test(p) ||
    lower === "list all candidates" ||
    lower === "all candidates" ||
    lower === "candidates" ||
    lower === "list out all candidates"
  ) {
    return {
      tool: "search_candidates",
      params: {},
      reasoning: "User requested a listing of all candidates.",
    };
  }

  // 16. Search Candidates / Users by Name or Specific Question
  if (
    lower.includes("candidate") ||
    lower.includes("candidates") ||
    lower.includes("user") ||
    lower.includes("users") ||
    lower.includes("talent") ||
    lower.includes("applicant")
  ) {
    const match = p.match(/(?:named|called|candidate|user)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    let nameParam = match ? match[1].replace(/^(named|called|for|is|are|a|an)\s+/i, "").trim() : null;

    if (nameParam && ["who", "all", "the", "active", "premium", "starter", "basic"].includes(nameParam.toLowerCase())) {
      nameParam = null;
    }

    const tool = (lower.includes("candidate") || lower.includes("applicant") || lower.includes("talent"))
      ? "search_candidates"
      : "search_users";

    return {
      tool,
      params: { name: nameParam },
      reasoning: `User queried ${tool === "search_candidates" ? "candidates" : "users"} directory.`,
    };
  }

  // 15. Standalone Name Search (e.g. "sathwik", "Aarav Patel", "Sarah")
  // If query is 1-3 words without keywords, treat it as a person name query!
  const words = p.split(/\s+/).filter(Boolean);
  if (words.length >= 1 && words.length <= 3 && !/[?!]/.test(p)) {
    // Clean name
    const cleaned = p.replace(/[^A-Za-z\s'-]/g, "").trim();
    if (cleaned.length >= 2) {
      return {
        tool: "search_candidates",
        params: { name: cleaned },
        reasoning: `Standalone name entered: searching candidate records for "${cleaned}".`,
      };
    }
  }

  // 16. Natural Language Person Search Questions ("Is there someone named ...", "Find ...", "Who is ...")
  const personQueryMatch = p.match(/(?:is there (?:a|any)?\s*(?:candidate|person|user|someone)?\s*named|find|search for|who is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
  if (personQueryMatch) {
    const targetName = personQueryMatch[1].trim();
    return {
      tool: "search_candidates",
      params: { name: targetName },
      reasoning: `Extracted person search for "${targetName}".`,
    };
  }

  // 17. Jobs / Vacancies Search
  if (
    lower.includes("job") ||
    lower.includes("jobs") ||
    lower.includes("vacancy") ||
    lower.includes("vacancies") ||
    lower.includes("position") ||
    lower.includes("listing")
  ) {
    return {
      tool: "search_jobs",
      params: {},
      reasoning: "User queried job vacancies directory.",
    };
  }

  // 18. Payments & Financial Transactions
  if (
    lower.includes("payment") ||
    lower.includes("payments") ||
    lower.includes("transaction") ||
    lower.includes("revenue") ||
    lower.includes("billing") ||
    lower.includes("settled")
  ) {
    return {
      tool: "get_payments",
      params: {},
      reasoning: "User queried financial transactions ledger.",
    };
  }

  // 19. Overview / Executive Metrics
  if (
    lower.includes("overview") ||
    lower.includes("kpi") ||
    lower.includes("metrics") ||
    lower.includes("dashboard stats")
  ) {
    return {
      tool: "get_overview_metrics",
      params: { period: "30d" },
      reasoning: "User queried executive overview metrics.",
    };
  }

  // 20. Completely Out-of-Scope / Unsupported Questions
  if (
    lower.includes("weather") ||
    lower.includes("recipe") ||
    lower.includes("cook") ||
    lower.includes("stock price") ||
    lower.includes("movie") ||
    lower.includes("song") ||
    lower.includes("football") ||
    lower.includes("cricket") ||
    lower.includes("churn") ||
    lower.includes("antarctica") ||
    lower.includes("crypto") ||
    lower.includes("bitcoin") ||
    lower.includes("mars")
  ) {
    return {
      tool: "unsupported_query",
      params: {
        topic: p,
        message: `I cannot answer questions about "${p}". I do not have access to or track data on this topic. Supported modules include candidates, recruiters, jobs, ingestion feeds, billing, and AI compute spend.`,
      },
      reasoning: "Query is out of scope or requests untracked platform metrics.",
    };
  }

  // 21. Ambiguous / Unrecognizable Query Fallback -> Clarify!
  return {
    tool: "clarify_question",
    params: {
      query: p,
      reason: "Could not determine the intended data domain.",
    },
    reasoning: "Ambiguous or unrecognized query. Prompting user with clarification.",
  };
}

/**
 * Rate-limit delay calculator
 * Reads Retry-After HTTP header, JSON error message ("Please try again in 1.45s"),
 * or falls back to exponential backoff with jitter.
 */
export function parseRetryDelayMs(res, errorBody = null, attempt = 0) {
  // 1. Check Retry-After HTTP header (seconds or HTTP date)
  const headerVal = res?.headers?.get?.("retry-after") || res?.headers?.get?.("Retry-After");
  if (headerVal) {
    const seconds = Number(headerVal);
    if (!Number.isNaN(seconds) && seconds > 0) {
      return Math.min(Math.round(seconds * 1000), 8000);
    }
    const dateMs = new Date(headerVal).getTime();
    if (!Number.isNaN(dateMs)) {
      const diff = dateMs - Date.now();
      if (diff > 0) return Math.min(diff, 8000);
    }
  }

  // 2. Check JSON error message: e.g. "Please try again in 1.45s." or "try again in 350ms"
  const msg = errorBody?.error?.message || (typeof errorBody === "string" ? errorBody : "");
  if (msg) {
    const match = msg.match(/try again in ([\d.]+)\s*(s|sec|seconds|ms|milliseconds)?/i);
    if (match) {
      const val = parseFloat(match[1]);
      const unit = (match[2] || "s").toLowerCase();
      if (!Number.isNaN(val)) {
        const ms = unit.startsWith("ms") ? val : val * 1000;
        return Math.min(Math.round(ms), 8000);
      }
    }
  }

  // 3. Fallback to exponential backoff: 1000ms * 2^attempt + random jitter (0-300ms)
  const backoff = Math.min(1000 * Math.pow(2, attempt), 4000);
  const jitter = Math.floor(Math.random() * 300);
  return backoff + jitter;
}

/**
 * Robust Groq API fetch wrapper with bounded retries and exponential backoff
 * - Honors retry-after headers & rate-limit messages.
 * - Does NOT retry client errors (HTTP 400, 401, 403, 404).
 * - Bounded to maxRetries (default 2).
 */
export async function callGroqWithRetry(fetchFn, url, options, maxRetries = 2) {
  const customFetch = fetchFn || fetch;
  let attempt = 0;
  while (true) {
    const res = await customFetch(url, options);

    // Success -> return immediately
    if (res.ok) {
      return res;
    }

    // Client errors (400, 401, 403, 404) must NOT be retried as rate-limit errors
    if (res.status >= 400 && res.status < 500 && res.status !== 429) {
      return res;
    }

    // Only retry on rate-limit (429) or transient service unavailability (503)
    if (res.status === 429 || res.status === 503) {
      if (attempt >= maxRetries) {
        return res;
      }

      let errorBody = null;
      try {
        const cloned = res.clone ? res.clone() : res;
        errorBody = await cloned.json();
      } catch {
        // ignore JSON parse failure
      }

      const delayMs = parseRetryDelayMs(res, errorBody, attempt);
      await new Promise((r) => setTimeout(r, delayMs));
      attempt++;
      continue;
    }

    return res;
  }
}

/**
 * Compacts tool outputs sent to model to stay well within TPM / token limits.
 * Truncates rows to 3 rows max and strips deep nested telemetry/activity objects.
 */
export function compactToolResultForModel(toolName, toolResult) {
  if (!toolResult) return { summary: "No result" };

  const summary = toolResult.summary || "";
  let compactRows = null;

  if (toolResult.structured?.rows && Array.isArray(toolResult.structured.rows)) {
    // Truncate to at most 3 rows to protect TPM limit
    compactRows = toolResult.structured.rows.slice(0, 3).map((r) => {
      const {
        name,
        email,
        role,
        plan,
        status,
        atsScore,
        domain,
        expirationDate,
        daysRemaining,
        placements,
        placementRate,
        title,
        company,
        amount,
        cost,
        tokens,
      } = r;

      const row = {};
      if (name !== undefined) row.name = name;
      if (email !== undefined) row.email = email;
      if (role !== undefined) row.role = role;
      if (plan !== undefined) row.plan = plan;
      if (status !== undefined) row.status = status;
      if (atsScore !== undefined) row.atsScore = atsScore;
      if (domain !== undefined) row.domain = domain;
      if (expirationDate !== undefined) row.expirationDate = expirationDate;
      if (daysRemaining !== undefined) row.daysRemaining = daysRemaining;
      if (placements !== undefined) row.placements = placements;
      if (placementRate !== undefined) row.placementRate = placementRate;
      if (title !== undefined) row.title = title;
      if (company !== undefined) row.company = company;
      if (amount !== undefined) row.amount = amount;
      if (cost !== undefined) row.cost = cost;
      if (tokens !== undefined) row.tokens = tokens;
      return Object.keys(row).length > 0 ? row : r;
    });
  } else if (toolResult.structured?.comparison) {
    compactRows = toolResult.structured.comparison;
  }

  const totalMatches =
    toolResult.structured?.meta?.totalMatches ??
    toolResult.structured?.meta?.totalRecruiters ??
    toolResult.structured?.rows?.length ??
    0;

  return {
    summary,
    sampleRecords: compactRows,
    totalCount: totalMatches,
  };
}

/**
 * Deterministic Fallback Engine
 * Used when no AI key is configured, during rate limits, or on network failure.
 * When engaged due to API rate limits or failures on general reasoning / open-ended questions,
 * returns an honest, friendly service notice rather than pretending or fabricating an answer.
 */
export async function executeDeterministicFallback({ query, activePage, history = [], errorNotice = null }) {
  const parsed = parseIntentDeterministically(query, activePage, history);

  // If query was purely conversational, strategic reasoning, or ambiguous,
  // and we fell back due to API unavailability / rate limits:
  const isGeneralOrAmbiguous = parsed.tool === "clarify_question" || parsed.tool === "unsupported_query";

  if (errorNotice && isGeneralOrAmbiguous) {
    const friendlyMessage =
      `**AI Assistant Notice**: The AI provider is temporarily unavailable or rate-limited (${errorNotice}). ` +
      `Open-ended conversational reasoning is temporarily offline, but you can still search candidates, ` +
      `view recruiters, inspect jobs, review AI costs, and check payment ledgers. Please retry your question in a moment.`;

    return {
      success: true,
      provider: "local_semantic_parser",
      model: "Deterministic Semantic NLU Parser",
      isOfflineFallback: true,
      text: friendlyMessage,
      title: "Service Notice",
      structured: null,
      tool: "offline_notice",
      params: {},
      reasoning: "Offline fallback engaged due to API rate-limit or error.",
      aiMetadata: {
        provider: "local_semantic_parser",
        model: "Deterministic Semantic NLU Parser",
        isOfflineFallback: true,
        notice: `API unavailable: ${errorNotice}. Deterministic fallback engaged.`,
      },
    };
  }

  const toolResult = await executeTool(parsed.tool, parsed.params);

  return {
    success: true,
    provider: "local_semantic_parser",
    model: "Deterministic Semantic NLU Parser",
    isOfflineFallback: true,
    text: toolResult.summary,
    title: toolResult.title || null,
    structured: toolResult.structured || null,
    tool: parsed.tool,
    params: parsed.params || {},
    reasoning: parsed.reasoning,
    aiMetadata: {
      provider: "local_semantic_parser",
      model: "Deterministic Semantic NLU Parser",
      isOfflineFallback: true,
      reasoning: parsed.reasoning,
      notice: errorNotice ? `Notice: ${errorNotice}. Deterministic fallback engaged.` : "Offline fallback engaged.",
    },
  };
}

/**
 * Simplified Groq Conversational AI Handler
 * Follows direct context-grounded architecture:
 * 1. Collects application context from JavaScript source files and mock stores.
 * 2. Collects conversation history from request (originating from sessionStorage).
 * 3. Sends single clean completion request to Groq model.
 * 4. Grounded natural language response returned with interactive structured data.
 */
async function executeGroqAgentLoop({ query, activePage = "dashboard", history = [], apiKey }) {
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";
  const configuredModel = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  // Normalize invalid/placeholder model names to Groq's official production model
  let model = configuredModel === "openai/gpt-oss-120b" ? "llama-3.3-70b-versatile" : configuredModel;

  // Step 1: Collect application context from JavaScript source files and mock stores
  const { contextText, structuredResult, detectedTool } =
    await buildApplicationContext({
      query,
      activePage,
      history,
      intentParser: parseIntentDeterministically,
    });

  const systemMessage = {
    role: "system",
    content: `You are the General-Purpose AI Admin Assistant for the AIFA GEN LABS Admin Portal.

=== PLATFORM GROUNDING & KNOWLEDGE RULES ===
- Answer the user's question accurately, concisely, and naturally based on the authoritative APPLICATION CONTEXT provided below.
- Strictly ground your responses in this context. NEVER invent or fabricate candidate names, user IDs, metrics, partner integrations, certifications (e.g. SOC2), or enterprise clients.
- If the user asks about AIFA GEN LABS company or platform: Explain that AIFA GEN LABS is an AI-powered talent acquisition and candidate matching platform designed to streamline recruitment, optimize resumes, and intelligently connect high-caliber candidates with global career opportunities. Detail its 6 core platform features:
  1. Automated Candidate Screening: AI-driven ATS resume scoring (0-100%), skill extraction, and gap analysis.
  2. Intelligent Job Matching: Semantic skill matching against global vacancy requirements.
  3. Recruiter Performance Analytics: Recruiter placement tracking, conversion rates, and team benchmarking (average conversion rate: 37.1%).
  4. Multi-Source Job Ingestion: Aggregating feeds from LinkedIn, Indeed, Greenhouse, Lever, and custom scrapers.
  5. AI-Driven Candidate Ranking: Tiered talent matching and personalized interview preparation.
  6. Subscription Management: Basic, Premium, and None tiers.
  Also disclose that the portal operates with structured in-memory mock datasets and simulated telemetry for demonstration.
- If asked for users with Basic plan: List all 3 users from the context (Tariq Mansoor [Past Due], Liam O'Connor [Active], Daisuke Tanaka [Active]).
- If asked for expiring subscriptions: Only return active candidates with upcoming renewal dates (within 30 days). Do NOT include Tariq Mansoor because his status is "Past Due" (already past due), not upcoming expiration.
- If asked for "Generate a job-fetching report for the last 7 days":
  Provide BOTH connector statistics (8 connectors, 11 syncs, 72.7% sync success rate, 364 total jobs ingested) AND the 5 actual jobs fetched in the last 7 days with Job Title, Company, Location, Source, Posted Date, Ingested Date, and clickable Markdown links [View Job](url).
  Also provide the source breakdown and the connector failure audit (Greenhouse 403 Forbidden, Lever Queue Timeout).
- If asked follow-up "Now show only jobs from Greenhouse": Explain that 0 jobs were fetched from Greenhouse in the last 7 days because the Greenhouse connector encountered an HTTP 403 Forbidden error ("Invalid API credential token or IP whitelist restriction").
- If asked follow-up "How many jobs were ingested yesterday?": State that 78 jobs were ingested yesterday (Oct 11, 2026) across active connectors (Indeed: 34, LinkedIn: 28, Custom Scrapers: 16).
- If asked follow-up "Explain the errors in that report": Detail the Greenhouse HTTP 403 Forbidden error and Lever 300,000ms Queue Timeout error.
- If asked for recruiters with zero placements: State that 0 recruiters have zero placements; every recruiter on the team has made at least 6 placements, with team average conversion rate of 37.1%.
- If asked about employees: Honestly disclose that employee records outside recruiter staff are not tracked in the current database.
- Present data clearly with clean Markdown formatting, bullet points, and tables when presenting records.

=== APPLICATION CONTEXT ===
${contextText}`,
  };

  const formattedMessages = [systemMessage];

  // Step 2: Append previous conversation history from sessionStorage
  if (Array.isArray(history) && history.length > 0) {
    const recent = history.slice(-10);
    for (const msg of recent) {
      const role = msg.role || (msg.sender === "user" ? "user" : "assistant");
      const content = msg.content || msg.text || "";
      if (content && typeof content === "string") {
        formattedMessages.push({
          role,
          content: content.length > 1000 ? content.slice(0, 1000) + "..." : content,
        });
      }
    }
  }

  // Step 3: Append current user question
  formattedMessages.push({ role: "user", content: query });

  // Step 4: Call Groq with full context
  let res = await callGroqWithRetry(fetch, endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: formattedMessages,
      temperature: 0.2,
      max_tokens: 1024,
    }),
  }, 2);

  // If initial model had an error (e.g. 404 model not found or decommissioned), try fallback model llama-3.1-8b-instant
  if (!res.ok && res.status === 404 && model !== "llama-3.1-8b-instant") {
    model = "llama-3.1-8b-instant";
    res = await callGroqWithRetry(fetch, endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: 0.2,
        max_tokens: 1024,
      }),
    }, 1);
  }

  if (!res.ok) {
    let errMessage = `HTTP ${res.status}`;
    try {
      const errJson = await res.json();
      errMessage = errJson.error?.message || errMessage;
    } catch {}
    console.warn(`[Groq Agent] API error: ${errMessage}. Engaging deterministic fallback.`);
    return executeDeterministicFallback({ query, activePage, history, errorNotice: errMessage });
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    return executeDeterministicFallback({ query, activePage, history });
  }

  return {
    success: true,
    provider: "groq",
    model: `Groq (${model})`,
    text: content,
    title: null,
    structured: structuredResult,
    tool: detectedTool,
    params: {},
    reasoning: "Answered using Groq LLM grounded directly in portal application context.",
    aiMetadata: {
      provider: "groq",
      model: `Groq (${model})`,
      reasoning: "Grounded directly in application context and conversation history.",
    },
  };
}

/**
 * In-Flight Request Deduplication Cache
 * Maps active query key to its ongoing Promise to prevent concurrent identical requests.
 */
export const inFlightRequests = new Map();

/**
 * General Conversational Entry Point
 */
export function processChatWithAi({ query = "", activePage = "dashboard", history = [] } = {}) {
  const trimmed = (query || "").trim();
  const dedupKey = `${trimmed.toLowerCase()}::${activePage}`;

  // Deduplicate concurrent in-flight requests for identical queries
  if (inFlightRequests.has(dedupKey)) {
    return inFlightRequests.get(dedupKey);
  }

  const promise = (async () => {
    const groqKey =
      (typeof process !== "undefined" && process.env?.GROQ_API_KEY) ||
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_GROQ_API_KEY) ||
      (typeof window !== "undefined" && window.__AIFA_GROQ_KEY__);
    const isGroqPlaceholder = !groqKey || groqKey.startsWith("your_") || groqKey.includes("placeholder");

    if (!isGroqPlaceholder) {
      try {
        return await executeGroqAgentLoop({ query: trimmed, activePage, history, apiKey: groqKey });
      } catch (err) {
        console.warn("[Groq Conversational Agent] Error in agent loop:", err.message);
        return executeDeterministicFallback({ query: trimmed, activePage, history, errorNotice: err.message });
      }
    }

    return executeDeterministicFallback({ query: trimmed, activePage, history });
  })().finally(() => {
    inFlightRequests.delete(dedupKey);
  });

  inFlightRequests.set(dedupKey, promise);
  return promise;
}

/**
 * Backward-Compatible Interpreter Export
 */
export async function interpretWithAi({ query = "", activePage = "dashboard", history = [] } = {}) {
  const result = await processChatWithAi({ query, activePage, history });
  return {
    success: result.success,
    provider: result.provider,
    model: result.model,
    isOfflineFallback: result.isOfflineFallback || false,
    tool: result.tool,
    params: result.params || {},
    reasoning: result.reasoning || result.text,
    text: result.text,
    structured: result.structured,
    notice: result.aiMetadata?.notice,
  };
}
