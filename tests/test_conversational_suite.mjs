/**
 * Comprehensive Conversational AI Assistant Test Suite
 * Tests General Conversation, Tool Calling, Multi-Turn Follow-Ups,
 * Contextual Summarization, Boundaries, and Page Awareness.
 */

import assert from "node:assert";
import "../server/envLoader.js";
import { processChatWithAi } from "../server/aiService.js";

console.log("=== STARTING CONVERSATIONAL AI VERIFICATION SUITE ===\n");

// Helper to delay between live API calls to comfortably stay within Groq free-tier TPM limits
const delay = (ms = 2500) => new Promise((resolve) => setTimeout(resolve, Math.max(ms, 2500)));

async function runConversationalTests() {
  const conversationHistory = [];

  // TEST A: General conversation
  console.log("TEST A: General conversation ('Tell me about AIFA GEN LABS.')...");
  const resA = await processChatWithAi({
    query: "Tell me about AIFA GEN LABS.",
    activePage: "dashboard",
    history: [],
  });
  assert(resA.success, "Query A should succeed");
  assert(resA.text && resA.text.length > 50, "Should generate a detailed conversational answer");
  assert(
    resA.text.toLowerCase().includes("talent") ||
      resA.text.toLowerCase().includes("recruitment") ||
      resA.text.toLowerCase().includes("platform") ||
      resA.text.toLowerCase().includes("aifa"),
    "Should explain AIFA GEN LABS using verified platform facts"
  );
  console.log(`✓ Result A: [${resA.provider}] ${resA.text.slice(0, 140)}...\n`);
  conversationHistory.push({ sender: "user", text: "Tell me about AIFA GEN LABS." });
  conversationHistory.push({ sender: "assistant", text: resA.text });
  await delay(1200);

  // TEST B: Unseen natural-language question
  console.log("TEST B: Unseen natural-language question ('What aspects of our platform might need improvement?')...");
  const resB = await processChatWithAi({
    query: "What aspects of our platform might need improvement?",
    activePage: "overview",
    history: conversationHistory.slice(-2),
  });
  assert(resB.success, "Query B should succeed");
  assert(resB.text && resB.text.length > 50, "Should provide analytical response");
  console.log(`✓ Result B: [${resB.provider}] ${resB.text.slice(0, 140)}...\n`);
  await delay(1200);

  // TEST C: Data retrieval
  console.log("TEST C: Data retrieval ('List all users with the Basic plan.')...");
  const resC = await processChatWithAi({
    query: "List all users with the Basic plan.",
    activePage: "users",
    history: [],
  });
  assert(resC.success, "Query C should succeed");
  assert.strictEqual(resC.tool, "search_users", "Should invoke search_users tool");
  assert(resC.structured?.rows?.length === 3, "Must return exactly 3 Basic plan users");
  const basicNames = resC.structured.rows.map((r) => r.name);
  assert(basicNames.includes("Tariq Mansoor"));
  console.log(`✓ Result C: [Tool: ${resC.tool}] Found 3 users: ${basicNames.join(", ")}\n`);
  await delay(1200);

  // TEST C2: Expiring Candidates ('Just get me the details of candidates whose plan is going to expire soon.')
  console.log("TEST C2: Expiring candidate filtering ('Just get me the details of candidates whose plan is going to expire soon.')...");
  const resC2 = await processChatWithAi({
    query: "Just get me the details of candidates whose plan is going to expire soon.",
    activePage: "candidates",
    history: [],
  });
  assert(resC2.success, "Query C2 should succeed");
  assert.strictEqual(resC2.tool, "get_expiring_subscriptions", "Must route to get_expiring_subscriptions");
  assert(resC2.structured?.rows?.length === 7, "Must return 7 active candidates expiring in 30 days");
  const c2Names = resC2.structured.rows.map((r) => r.name);
  assert(!c2Names.includes("Tariq Mansoor"), "Tariq Mansoor (Past Due) must NOT be in expiring candidates list");
  assert(!resC2.text.includes("Tariq Mansoor"), "Conversational response must not single out Tariq Mansoor as expiring soon");
  console.log(`✓ Result C2: [Tool: ${resC2.tool}] Correctly returned ${resC2.structured.rows.length} active expiring candidates (Tariq Mansoor excluded)\n`);
  await delay(1200);

  // TEST D: Multi-step analysis
  console.log("TEST D: Multi-step analysis ('Compare our AI costs this month and last month, then explain what might be driving the change.')...");
  const resD = await processChatWithAi({
    query: "Compare our AI costs this month and last month, then explain what might be driving the change.",
    activePage: "ai-usage",
    history: [],
  });
  assert(resD.success, "Query D should succeed");
  assert(resD.tool === "compare_ai_costs", "Should invoke compare_ai_costs tool");
  assert(resD.structured !== null, "Must attach structured comparison data");
  console.log(`✓ Result D: [Tool: ${resD.tool}] ${resD.text.slice(0, 140)}...\n`);
  const costHistory = [
    { sender: "user", text: "Compare our AI costs this month and last month, then explain what might be driving the change." },
    { sender: "assistant", text: resD.text },
  ];
  await delay(1200);

  // TEST E: Follow-up question
  console.log("TEST E: Follow-up ('How can we reduce those costs?')...");
  const resE = await processChatWithAi({
    query: "How can we reduce those costs?",
    activePage: "ai-usage",
    history: costHistory,
  });
  assert(resE.success, "Query E should succeed");
  assert(resE.text && resE.text.length > 50, "Should provide advice based on previous context");
  console.log(`✓ Result E: [Follow-up] ${resE.text.slice(0, 140)}...\n`);
  costHistory.push({ sender: "user", text: "How can we reduce those costs?" });
  costHistory.push({ sender: "assistant", text: resE.text });
  await delay(1200);

  // TEST F: Contextual follow-up
  console.log("TEST F: Contextual follow-up ('Summarize that in three bullet points.')...");
  const resF = await processChatWithAi({
    query: "Summarize that in three bullet points.",
    activePage: "ai-usage",
    history: costHistory.slice(-2),
  });
  assert(resF.success, "Query F should succeed");
  assert(resF.text && resF.text.length > 20, "Should summarize previous advice");
  console.log(`✓ Result F: [Summary] ${resF.text.slice(0, 140)}...\n`);
  await delay(1200);

  // TEST G: Current-page understanding
  console.log("TEST G: Current-page understanding ('Explain this page.' on job-sources)...");
  const resG = await processChatWithAi({
    query: "Explain this page.",
    activePage: "job-sources",
    history: [],
  });
  assert(resG.success, "Query G should succeed");
  assert(
    resG.text.toLowerCase().includes("job") ||
      resG.text.toLowerCase().includes("source") ||
      resG.text.toLowerCase().includes("feed") ||
      resG.text.toLowerCase().includes("scraper"),
    "Should explain the job-sources page context"
  );
  console.log(`✓ Result G: [Page Awareness] ${resG.text.slice(0, 140)}...\n`);
  await delay(1200);

  // TEST H: Unsupported company facts
  console.log("TEST H: Unsupported company facts ('What is our customer churn rate in Antarctica?')...");
  const resH = await processChatWithAi({
    query: "What is our customer churn rate in Antarctica?",
    activePage: "dashboard",
    history: [],
  });
  const lowerH = resH.text.toLowerCase();
  assert(
    lowerH.includes("not") ||
      lowerH.includes("doesn't") ||
      lowerH.includes("doesn’t") ||
      lowerH.includes("don't") ||
      lowerH.includes("don’t") ||
      lowerH.includes("unavailable") ||
      lowerH.includes("no data") ||
      lowerH.includes("do not track") ||
      lowerH.includes("cannot") ||
      lowerH.includes("sorry"),
    "Should honestly decline to invent untracked metrics"
  );
  console.log(`✓ Result H: [Honest Boundary] ${resH.text.slice(0, 140)}...\n`);
  await delay(1200);

  // TEST I: Missing data (Employees)
  console.log("TEST I: Missing data ('Find employees named Sathwik.')...");
  const resI = await processChatWithAi({
    query: "Find employees named Sathwik.",
    activePage: "users",
    history: [],
  });
  assert(resI.success, "Query I should succeed");
  assert(
    resI.text.includes("Employee records are not available") ||
      resI.text.toLowerCase().includes("employee") ||
      resI.text.toLowerCase().includes("not available"),
    "Must report employee data availability boundary"
  );
  console.log(`✓ Result I: [Data Boundary] ${resI.text.slice(0, 140)}...\n`);

  // TEST J: API failure simulation / Deterministic Fallback
  console.log("TEST J: API failure simulation / Deterministic Fallback...");
  const oldKey = process.env.GROQ_API_KEY;
  try {
    delete process.env.GROQ_API_KEY;
    const resJ = await processChatWithAi({
      query: "List all users with the Basic plan.",
      activePage: "users",
      history: [],
    });
    assert(resJ.success, "Fallback should succeed");
    assert.strictEqual(resJ.isOfflineFallback, true, "Must flag offline fallback");
    assert.strictEqual(resJ.structured?.rows?.length, 3, "Must still return 3 real users via fallback");
    console.log(`✓ Result J: [Fallback Engaged] Flagged isOfflineFallback: true, returned ${resJ.structured.rows.length} real records.\n`);
  } finally {
    process.env.GROQ_API_KEY = oldKey;
  }

  console.log("======================================================================");
  console.log("=== ALL 10 CONVERSATIONAL AGENT BEHAVIORS VERIFIED SUCCESSFULLY ===");
  console.log("======================================================================");
}

runConversationalTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
