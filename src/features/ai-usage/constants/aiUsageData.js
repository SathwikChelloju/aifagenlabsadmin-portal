/**
 * AI Usage & Telemetry Mock Dataset
 * AIFA GEN LABS Admin Portal
 *
 * Full data model supporting:
 * - Multi-model pricing table
 * - Pre-generated and dynamic requests spanning 90 days (Oct 2026 anchor)
 * - Safe diagnostics metadata (redacted prompts/completions)
 * - Structured correlation and session IDs for related traces
 */

export const MODEL_PRICING = {
  "GPT-4o": {
    provider: "OpenAI",
    inputCostPer1M: 5.0,
    outputCostPer1M: 15.0,
    latencyBenchmark: "920ms",
    contextWindow: "128k",
  },
  "GPT-4o Mini": {
    provider: "OpenAI",
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
    latencyBenchmark: "480ms",
    contextWindow: "128k",
  },
  "Claude 3.5 Sonnet": {
    provider: "Anthropic",
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
    latencyBenchmark: "1.15s",
    contextWindow: "200k",
  },
  "Claude 3 Haiku": {
    provider: "Anthropic",
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25,
    latencyBenchmark: "410ms",
    contextWindow: "200k",
  },
  "Gemini 1.5 Pro": {
    provider: "Google",
    inputCostPer1M: 3.5,
    outputCostPer1M: 10.5,
    latencyBenchmark: "1.28s",
    contextWindow: "1M",
  },
  "Gemini 1.5 Flash": {
    provider: "Google",
    inputCostPer1M: 0.35,
    outputCostPer1M: 1.05,
    latencyBenchmark: "390ms",
    contextWindow: "1M",
  },
  "Mistral Large": {
    provider: "Mistral",
    inputCostPer1M: 2.0,
    outputCostPer1M: 6.0,
    latencyBenchmark: "1.05s",
    contextWindow: "128k",
  },
  "Llama 3.3 70B": {
    provider: "Meta",
    inputCostPer1M: 0.9,
    outputCostPer1M: 0.9,
    latencyBenchmark: "860ms",
    contextWindow: "128k",
  },
};

export const PROVIDERS = [
  { id: "OpenAI", name: "OpenAI", color: "#10A37F" },
  { id: "Anthropic", name: "Anthropic", color: "#D97706" },
  { id: "Google", name: "Google", color: "#4285F4" },
  { id: "Mistral", name: "Mistral", color: "#FF7000" },
  { id: "Meta", name: "Meta", color: "#0668E1" },
];

export const AI_FEATURES = [
  { id: "Resume ATS Tailoring", name: "Resume ATS Tailoring", category: "Career Tools" },
  { id: "Mock Interview Copilot", name: "Mock Interview Copilot", category: "Interview Prep" },
  { id: "Job Matching Score", name: "Job Matching Score", category: "Job Search" },
  { id: "Cover Letter Generator", name: "Cover Letter Generator", category: "Career Tools" },
  { id: "Skills Gap Analyzer", name: "Skills Gap Analyzer", category: "Career Tools" },
  { id: "Visa Requirements Evaluation", name: "Visa Requirements Evaluation", category: "Compliance" },
];

export const ACTORS = [
  // Candidates / Users
  {
    id: "usr_9104",
    name: "Aarav Patel",
    email: "aarav.p@outlook.com",
    actorType: "User",
    role: "Candidate",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    track: "DevOps",
  },
  {
    id: "usr_9182",
    name: "Mei-Ling Zhou",
    email: "meiling.z@gmail.com",
    actorType: "User",
    role: "Candidate",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    track: "Data Science",
  },
  {
    id: "usr_8821",
    name: "Tariq Mansoor",
    email: "t.mansoor@techmail.io",
    actorType: "User",
    role: "Candidate",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    track: "Full Stack",
  },
  {
    id: "usr_9401",
    name: "Elena Rostova",
    email: "elena.rostova@yahoo.com",
    actorType: "User",
    role: "Candidate",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    track: "QA Automation",
  },
  {
    id: "usr_7732",
    name: "Carlos Gomez",
    email: "carlos.g@domain.com",
    actorType: "User",
    role: "Candidate",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    track: "Cloud Architect",
  },
  {
    id: "usr_6521",
    name: "Ananya Sharma",
    email: "ananya.s@outlook.in",
    actorType: "User",
    role: "Candidate",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    track: "Backend Systems",
  },
  {
    id: "usr_5412",
    name: "Marcus Vance",
    email: "m.vance@techlead.co.uk",
    actorType: "User",
    role: "Candidate",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    track: "Security",
  },
  // Employees (Staff / Recruiters / Mentors)
  {
    id: "emp_101",
    name: "Sarah Jenkins",
    email: "sarah.j@aifagen.internal",
    actorType: "Employee",
    role: "Placement Mentor",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    track: "Candidate Concierge",
  },
  {
    id: "emp_102",
    name: "David Kalu",
    email: "d.kalu@aifagen.internal",
    actorType: "Employee",
    role: "Talent Acquisition",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
    track: "Global Mobility",
  },
  {
    id: "emp_103",
    name: "Liam O'Connor",
    email: "l.oconnor@aifagen.internal",
    actorType: "Employee",
    role: "Resume Reviewer",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    track: "ATS Optimization",
  },
  // Admins & System Automations
  {
    id: "adm_01",
    name: "Ops Lead",
    email: "admin@aifagen.com",
    actorType: "Admin",
    role: "Platform Operations",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    track: "System Admin",
  },
  {
    id: "adm_00",
    name: "Alex Morgan",
    email: "alex.morgan@aifagen.internal",
    actorType: "Admin",
    role: "Super Admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    track: "Executive",
  },
  {
    id: "sys_bot_01",
    name: "Crawler Auto-Tagger",
    email: "crawler-bot@aifagen.internal",
    actorType: "Admin",
    role: "Automated Worker",
    avatar: null,
    track: "Pipeline",
  },
];

/**
 * Calculates estimated cost for a given model, input tokens, and output tokens
 */
export function calculateTokenCost(model, inputTokens = 0, outputTokens = 0) {
  const pricing = MODEL_PRICING[model];
  if (!pricing) return null;
  const inCost = (inputTokens / 1_000_000) * pricing.inputCostPer1M;
  const outCost = (outputTokens / 1_000_000) * pricing.outputCostPer1M;
  return Number((inCost + outCost).toFixed(4));
}

export const INITIAL_AI_BUDGET = {
  monthlyBudgetUsd: 2000.0,
  warningThresholdPct: 75,
  criticalThresholdPct: 90,
  notificationEmail: "admin@aifagen.com",
  alertOnSpikes: true,
  lastUpdated: "Oct 01, 2026",
};

/**
 * Generates an extensive, stable set of realistic AI telemetry requests
 * anchored around Oct 13, 2026.
 */
export function generateSeedAiRequests() {
  const baseTimestamp = new Date("2026-10-13T18:45:00Z").getTime();

  // Curated explicit recent requests for high fidelity
  const curatedRequests = [
    {
      id: "req_ai_9921",
      offsetMinutes: 12,
      actorIndex: 0, // Aarav Patel
      feature: "Resume ATS Tailoring",
      provider: "Anthropic",
      model: "Claude 3.5 Sonnet",
      inputTokens: 2840,
      outputTokens: 580,
      latencyMs: 1420,
      status: "Success",
      httpStatus: 200,
      retryCount: 0,
      sessionId: "sess_aarav_8921",
      correlationId: "corr_ats_tailor_9921",
      sourceApp: "Candidate Portal v2.4",
      environment: "Production (us-east-1)",
      safePromptSummary: "Optimized candidate summary and skills alignment for Senior DevOps Engineer vacancy at Google Bengaluru.",
      safeCompletionSummary: "Generated 4 tailored impact statements with quantified Kubernetes deployment metrics and Tier 2 visa keywords.",
      ttftMs: 380,
    },
    {
      id: "req_ai_9920",
      offsetMinutes: 48,
      actorIndex: 1, // Mei-Ling Zhou
      feature: "Job Matching Score",
      provider: "OpenAI",
      model: "GPT-4o Mini",
      inputTokens: 1200,
      outputTokens: 240,
      latencyMs: 480,
      status: "Success",
      httpStatus: 200,
      retryCount: 0,
      sessionId: "sess_meiling_4102",
      correlationId: "corr_match_4102",
      sourceApp: "Candidate Portal v2.4",
      environment: "Production (us-east-1)",
      safePromptSummary: "Semantic comparison of candidate curriculum against EU Blue Card data scientist postings.",
      safeCompletionSummary: "Computed 92% semantic alignment for Amazon NYC and Mistral AI Amsterdam positions.",
      ttftMs: 180,
    },
    {
      id: "req_ai_9919",
      offsetMinutes: 95,
      actorIndex: 3, // Elena Rostova
      feature: "Mock Interview Copilot",
      provider: "Google",
      model: "Gemini 1.5 Pro",
      inputTokens: 4120,
      outputTokens: 1700,
      latencyMs: 2150,
      status: "Success",
      httpStatus: 200,
      retryCount: 0,
      sessionId: "sess_elena_7719",
      correlationId: "corr_interview_copilot_9919",
      sourceApp: "Mock Interview Studio v3",
      environment: "Production (us-east-1)",
      safePromptSummary: "Behavioral interview simulation rubric focusing on quality assurance leadership and Canadian tech visa hurdles.",
      safeCompletionSummary: "Synthesized dynamic follow-up probing automated Playwright pipeline design and regression risk mitigation.",
      ttftMs: 540,
    },
    {
      id: "req_ai_9918",
      offsetMinutes: 140,
      actorIndex: 7, // Sarah Jenkins (Employee)
      feature: "Skills Gap Analyzer",
      provider: "OpenAI",
      model: "GPT-4o",
      inputTokens: 3100,
      outputTokens: 890,
      latencyMs: 1320,
      status: "Success",
      httpStatus: 200,
      retryCount: 0,
      sessionId: "sess_sarah_concierge_01",
      correlationId: "corr_ats_tailor_9921", // Shared with req_ai_9921 for related trace!
      sourceApp: "Mentor Console v1.8",
      environment: "Production (us-east-1)",
      safePromptSummary: "Mentor evaluation of candidate skill gaps for Tier 2 sponsorship readiness.",
      safeCompletionSummary: "Generated 3 priority recommendations: Terraform module testing, Prometheus alerting runbooks.",
      ttftMs: 360,
    },
    {
      id: "req_ai_9917",
      offsetMinutes: 210,
      actorIndex: 2, // Tariq Mansoor
      feature: "Cover Letter Generator",
      provider: "Anthropic",
      model: "Claude 3 Haiku",
      inputTokens: 1840,
      outputTokens: 620,
      latencyMs: 420,
      status: "Success",
      httpStatus: 200,
      retryCount: 0,
      sessionId: "sess_tariq_2104",
      correlationId: "corr_cover_2104",
      sourceApp: "Candidate Portal v2.4",
      environment: "Production (us-east-1)",
      safePromptSummary: "Tailored letter for Full Stack role highlighting H-1B transfer readiness.",
      safeCompletionSummary: "Created structured 3-paragraph cover letter targeting Monzo Bank London.",
      ttftMs: 160,
    },
    {
      id: "req_ai_9916",
      offsetMinutes: 280,
      actorIndex: 4, // Carlos Gomez
      feature: "Visa Requirements Evaluation",
      provider: "Mistral",
      model: "Mistral Large",
      inputTokens: 2450,
      outputTokens: 510,
      latencyMs: 1110,
      status: "Success",
      httpStatus: 200,
      retryCount: 0,
      sessionId: "sess_carlos_9082",
      correlationId: "corr_visa_eval_9082",
      sourceApp: "Candidate Portal v2.4",
      environment: "Production (us-east-1)",
      safePromptSummary: "Evaluated remote contract salary against Spanish Digital Nomad income thresholds.",
      safeCompletionSummary: "Confirmed eligibility criteria met with 114% margin over statutory minimum.",
      ttftMs: 290,
    },
    {
      id: "req_ai_9915",
      offsetMinutes: 340,
      actorIndex: 5, // Ananya Sharma
      feature: "Resume ATS Tailoring",
      provider: "OpenAI",
      model: "GPT-4o",
      inputTokens: 3890,
      outputTokens: 940,
      latencyMs: 1640,
      status: "Success",
      httpStatus: 200,
      retryCount: 0,
      sessionId: "sess_ananya_3145",
      correlationId: "corr_ananya_ats_3145",
      sourceApp: "Candidate Portal v2.4",
      environment: "Production (us-east-1)",
      safePromptSummary: "Optimized backend system architecture highlights for Australian Subclass 189 assessment.",
      safeCompletionSummary: "Formatted ACS-compliant project deliverables with PostgreSQL sharding metrics.",
      ttftMs: 410,
    },
    {
      id: "req_ai_9914",
      offsetMinutes: 420,
      actorIndex: 6, // Marcus Vance
      feature: "Mock Interview Copilot",
      provider: "OpenAI",
      model: "GPT-4o",
      inputTokens: 2950,
      outputTokens: 0,
      latencyMs: 820,
      status: "Failed",
      httpStatus: 429,
      retryCount: 2,
      sessionId: "sess_marcus_failed_01",
      correlationId: "corr_marcus_failed_01",
      sourceApp: "Mock Interview Studio v3",
      environment: "Production (us-east-1)",
      safePromptSummary: "Real-time threat modeling query against upstream provider rate limits.",
      safeCompletionSummary: "Provider rate limit exceeded (HTTP 429: Too Many Requests). Circuit breaker engaged.",
      ttftMs: 0,
    },
    {
      id: "req_ai_9913",
      offsetMinutes: 510,
      actorIndex: 8, // David Kalu (Employee)
      feature: "Job Matching Score",
      provider: "Google",
      model: "Gemini 1.5 Flash",
      inputTokens: 1650,
      outputTokens: 310,
      latencyMs: 380,
      status: "Success",
      httpStatus: 200,
      retryCount: 0,
      sessionId: "sess_david_intake",
      correlationId: "corr_david_intake_01",
      sourceApp: "Recruiter Hub v2.1",
      environment: "Production (us-east-1)",
      safePromptSummary: "Batch candidate score for UK Skilled Worker engineering pool.",
      safeCompletionSummary: "Computed fit scores for 8 candidate profiles against Atlassian Sydney requirements.",
      ttftMs: 140,
    },
    {
      id: "req_ai_9912",
      offsetMinutes: 630,
      actorIndex: 10, // Admin Ops (Admin)
      feature: "Resume ATS Tailoring",
      provider: "Anthropic",
      model: "Claude 3.5 Sonnet",
      inputTokens: 3410,
      outputTokens: 780,
      latencyMs: 1390,
      status: "Success",
      httpStatus: 200,
      retryCount: 0,
      sessionId: "sess_adm_eval_01",
      correlationId: "corr_adm_eval_01",
      sourceApp: "Admin Portal",
      environment: "Production (us-east-1)",
      safePromptSummary: "Regression benchmark verifying ATS prompt template revision v3.4.",
      safeCompletionSummary: "Verified output schema adheres to JSON output constraints without hallucinations.",
      ttftMs: 350,
    },
    {
      id: "req_ai_9911",
      offsetMinutes: 720,
      actorIndex: 12, // System Crawler Bot
      feature: "Job Matching Score",
      provider: "Meta",
      model: "Llama 3.3 70B",
      inputTokens: 1400,
      outputTokens: 220,
      latencyMs: 780,
      status: "Success",
      httpStatus: 200,
      retryCount: 0,
      sessionId: "sess_crawler_mesh",
      correlationId: "corr_crawler_tag_9911",
      sourceApp: "Pipeline Ingestion Worker",
      environment: "Production (us-east-1)",
      safePromptSummary: "Automated taxonomy classification for newly scraped Greenhouse partner postings.",
      safeCompletionSummary: "Classified 14 job descriptions with verified visa sponsorship tags.",
      ttftMs: 220,
    },
    {
      id: "req_ai_9910",
      offsetMinutes: 840,
      actorIndex: 0, // Aarav Patel
      feature: "Mock Interview Copilot",
      provider: "Anthropic",
      model: "Claude 3.5 Sonnet",
      inputTokens: 4600,
      outputTokens: 1850,
      latencyMs: 2310,
      status: "Success",
      httpStatus: 200,
      retryCount: 0,
      sessionId: "sess_aarav_interview_02",
      correlationId: "corr_ats_tailor_9921", // Related to same candidate session!
      sourceApp: "Mock Interview Studio v3",
      environment: "Production (us-east-1)",
      safePromptSummary: "Live technical simulation: Terraform state locking & multi-cloud AWS Kubernetes DR.",
      safeCompletionSummary: "Interactive feedback: Excellent explanation of Raft consensus; recommended sharpening RTO/RPO targets.",
      ttftMs: 490,
    },
  ];

  // Additional procedural requests across 90 days to achieve realistic volume and distributions
  const allRequests = [];

  // 1. Add curated explicit requests
  curatedRequests.forEach((req) => {
    const actor = ACTORS[req.actorIndex];
    const totalTokens = req.inputTokens + req.outputTokens;
    const estimatedCost = calculateTokenCost(req.model, req.inputTokens, req.outputTokens);
    const dateObj = new Date(baseTimestamp - req.offsetMinutes * 60 * 1000);

    allRequests.push({
      id: req.id,
      timestamp: dateObj.toISOString(),
      formattedDate: dateObj.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      relativeTime: formatRelativeTime(req.offsetMinutes),
      actorId: actor.id,
      actorName: actor.name,
      actorEmail: actor.email,
      actorType: actor.actorType,
      actorRole: actor.role,
      actorAvatar: actor.avatar,
      feature: req.feature,
      provider: req.provider,
      model: req.model,
      inputTokens: req.inputTokens,
      outputTokens: req.outputTokens,
      totalTokens,
      estimatedCost,
      latencyMs: req.latencyMs,
      latencyFormatted: formatLatency(req.latencyMs),
      status: req.status,
      httpStatus: req.httpStatus,
      retryCount: req.retryCount,
      sessionId: req.sessionId,
      correlationId: req.correlationId,
      sourceApp: req.sourceApp,
      environment: req.environment,
      safePromptSummary: req.safePromptSummary,
      safeCompletionSummary: req.safeCompletionSummary,
      ttftMs: req.ttftMs,
    });
  });

  // 2. Procedural historical generation spanning 90 days
  const models = Object.keys(MODEL_PRICING);
  const features = AI_FEATURES.map((f) => f.name);

  // Distribution weights across time:
  // Days 0-1 (last 24h): ~35 requests
  // Days 1-7 (last 7d): ~60 requests
  // Days 7-30 (last 30d): ~80 requests
  // Days 30-90 (last 90d): ~85 requests
  // Total ~270 requests for rich, realistic, instant aggregation without lag
  const timeBuckets = [
    { startHours: 15, endHours: 24, count: 25 },
    { startHours: 24, endHours: 168, count: 65 }, // 1 to 7 days
    { startHours: 168, endHours: 720, count: 85 }, // 7 to 30 days
    { startHours: 720, endHours: 2160, count: 95 }, // 30 to 90 days
  ];

  let reqCounter = 9909;

  timeBuckets.forEach((bucket) => {
    for (let i = 0; i < bucket.count; i++) {
      const hoursAgo = bucket.startHours + (i / bucket.count) * (bucket.endHours - bucket.startHours);
      const minutesAgo = Math.floor(hoursAgo * 60 + ((i * 17) % 59));
      const dateObj = new Date(baseTimestamp - minutesAgo * 60 * 1000);

      // Deterministic pseudo-random selections based on loop index
      const actorIdx = (i * 3 + minutesAgo) % ACTORS.length;
      const actor = ACTORS[actorIdx];
      const model = models[(i * 2 + actorIdx) % models.length];
      const provider = MODEL_PRICING[model].provider;
      const feature = features[(i + actorIdx * 2) % features.length];

      // Realistic token sizes based on feature
      let inTokens = 1200 + ((i * 137) % 2400);
      let outTokens = 250 + ((i * 89) % 1100);
      if (feature === "Mock Interview Copilot") {
        inTokens = 2500 + ((i * 181) % 2200);
        outTokens = 1100 + ((i * 211) % 1400);
      } else if (feature === "Job Matching Score") {
        inTokens = 750 + ((i * 97) % 950);
        outTokens = 120 + ((i * 43) % 280);
      }

      // Latency simulation
      const baseLat = model.includes("Mini") || model.includes("Flash") || model.includes("Haiku") ? 420 : 1250;
      const latencyMs = baseLat + ((i * 73) % 650);

      // Status: 98.5% Success, occasional Failed (429 or 503) or Rate Limited
      let status = "Success";
      let httpStatus = 200;
      let retries = 0;
      if (i % 38 === 0) {
        status = "Failed";
        httpStatus = 429;
        retries = 1;
        outTokens = 0;
      } else if (i % 71 === 0) {
        status = "Failed";
        httpStatus = 503;
        retries = 3;
        outTokens = 0;
      }

      const totalTokens = inTokens + outTokens;
      const estimatedCost = calculateTokenCost(model, inTokens, outTokens);
      const reqId = `req_ai_${reqCounter--}`;
      const corrId = `corr_${feature.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 8)}_${i % 12}`;

      allRequests.push({
        id: reqId,
        timestamp: dateObj.toISOString(),
        formattedDate: dateObj.toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        relativeTime: formatRelativeTime(minutesAgo),
        actorId: actor.id,
        actorName: actor.name,
        actorEmail: actor.email,
        actorType: actor.actorType,
        actorRole: actor.role,
        actorAvatar: actor.avatar,
        feature,
        provider,
        model,
        inputTokens: inTokens,
        outputTokens: outTokens,
        totalTokens,
        estimatedCost,
        latencyMs,
        latencyFormatted: formatLatency(latencyMs),
        status,
        httpStatus,
        retryCount: retries,
        sessionId: `sess_${actor.id}_${(i % 5) + 1}`,
        correlationId: corrId,
        sourceApp: actor.actorType === "Admin" ? "Admin Portal" : actor.actorType === "Employee" ? "Staff Hub" : "Candidate Portal v2.4",
        environment: "Production (us-east-1)",
        safePromptSummary: `Simulated diagnostic execution of ${feature} for ${actor.name} (${actor.track || actor.role}).`,
        safeCompletionSummary: status === "Success"
          ? `Returned structured diagnostic response (${outTokens} output tokens) matching API schema.`
          : `Execution halted with HTTP ${httpStatus}. Diagnostics captured in error trace.`,
        ttftMs: Math.round(latencyMs * 0.28),
      });
    }
  });

  // Sort descending by timestamp
  allRequests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return allRequests;
}

function formatLatency(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatRelativeTime(minutes) {
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
