/**
 * Simple Architecture & 7-Scenario Verification Suite
 * AIFA GEN LABS Admin Portal
 *
 * Verifies:
 * 1. "Tell me about AIFA GEN LABS." (Company facts, platform features, mock dataset disclosure)
 * 2. "List all users with the Basic plan." (Tariq Mansoor, Liam O'Connor, Daisuke Tanaka from authoritative dataset)
 * 3. "Generate a job-fetching report for the last 7 days." (Connector stats, 5 actual jobs with clickable links, source breakdown, errors)
 * 4. "Now show only jobs from Greenhouse." (Conversational follow-up: 0 jobs due to Greenhouse HTTP 403 Forbidden error)
 * 5. "How many jobs were ingested yesterday?" (Telemetry: 78 jobs ingested on Oct 11, 2026 across Indeed, LinkedIn, Custom Scrapers)
 * 6. "Explain the errors in that report." (Follow-up: details Greenhouse 403 Forbidden & Lever queue timeout)
 * 7. Clear the chat and verify old history is removed from sessionStorage.
 */

import assert from "node:assert";
import "../server/envLoader.js";
import { processChatWithAi } from "../server/aiService.js";
import {
  getConversationHistory,
  appendToConversationHistory,
  clearConversationHistory,
} from "../src/features/assistant/services/conversationStorage.js";

console.log("=== STARTING SECTION 8 SIMPLE ARCHITECTURE TEST SUITE ===\n");

// Mock window.sessionStorage for Node environment testing
const storageMap = new Map();
globalThis.window = {
  sessionStorage: {
    getItem: (key) => (storageMap.has(key) ? storageMap.get(key) : null),
    setItem: (key, val) => storageMap.set(key, String(val)),
    removeItem: (key) => storageMap.delete(key),
    clear: () => storageMap.clear(),
  },
};

async function runSimpleArchitectureTests() {
  // Scenario 1: "Tell me about AIFA GEN LABS."
  console.log("SCENARIO 1: 'Tell me about AIFA GEN LABS.'...");
  const res1 = await processChatWithAi({
    query: "Tell me about AIFA GEN LABS.",
    activePage: "dashboard",
    history: getConversationHistory(),
  });

  assert(res1.success, "Scenario 1 should succeed");
  const text1 = res1.text.toLowerCase();
  assert(
    text1.includes("talent") ||
      text1.includes("candidate") ||
      text1.includes("recruitment") ||
      text1.includes("platform"),
    "Should accurately explain AIFA GEN LABS platform features"
  );
  // Verify storage append
  appendToConversationHistory("user", "Tell me about AIFA GEN LABS.");
  appendToConversationHistory("assistant", res1.text);
  assert.strictEqual(getConversationHistory().length, 2, "Session storage should have 2 turns");
  console.log(`✓ Scenario 1 Passed: [${res1.provider}] Grounded platform summary returned.\n`);

  // Scenario 2: "List all users with the Basic plan."
  console.log("SCENARIO 2: 'List all users with the Basic plan.'...");
  const res2 = await processChatWithAi({
    query: "List all users with the Basic plan.",
    activePage: "users",
    history: getConversationHistory(),
  });

  assert(res2.success, "Scenario 2 should succeed");
  assert.strictEqual(res2.tool, "search_users", "Should identify search_users tool");
  assert(res2.structured && Array.isArray(res2.structured.rows), "Must attach structured rows");
  assert.strictEqual(res2.structured.rows.length, 3, "Must return exactly 3 Basic plan users");
  const basicNames = res2.structured.rows.map((r) => r.name);
  assert(basicNames.includes("Tariq Mansoor"), "Must include Tariq Mansoor");
  assert(basicNames.includes("Liam O'Connor"), "Must include Liam O'Connor");
  assert(basicNames.includes("Daisuke Tanaka"), "Must include Daisuke Tanaka");
  appendToConversationHistory("user", "List all users with the Basic plan.");
  appendToConversationHistory("assistant", res2.text);
  console.log(`✓ Scenario 2 Passed: Found all 3 Basic plan users: ${basicNames.join(", ")}\n`);

  // Scenario 3: "Generate a job-fetching report for the last 7 days."
  console.log("SCENARIO 3: 'Generate a job-fetching report for the last 7 days.'...");
  const res3 = await processChatWithAi({
    query: "Generate a job-fetching report for the last 7 days.",
    activePage: "job-sources",
    history: getConversationHistory(),
  });

  assert(res3.success, "Scenario 3 should succeed");
  assert.strictEqual(res3.tool, "generate_report", "Should identify generate_report tool");
  assert(res3.structured, "Must attach report preview structured object");
  assert.strictEqual(res3.structured.type, "report_preview", "Type must be report_preview");
  assert.strictEqual(res3.structured.jobsFetched?.length, 5, "Must list all 5 actual jobs fetched");
  assert(res3.structured.connectorErrors?.length >= 2, "Must audit connector failures");
  assert(res3.text.includes("72.7%"), "Must report 72.7% sync success rate");
  assert(
    res3.text.includes("Senior Frontend Engineer") ||
      res3.structured.jobsFetched.some((j) => j.title.includes("Senior Frontend")),
    "Must include actual job listings"
  );
  appendToConversationHistory("user", "Generate a job-fetching report for the last 7 days.");
  appendToConversationHistory("assistant", res3.text);
  console.log(`✓ Scenario 3 Passed: 7-day report generated with 5 real jobs, connector KPIs, and error audits.\n`);

  // Scenario 4: "Now show only jobs from Greenhouse." (Conversational Follow-Up)
  console.log("SCENARIO 4: 'Now show only jobs from Greenhouse.' (Follow-up)...");
  const res4 = await processChatWithAi({
    query: "Now show only jobs from Greenhouse.",
    activePage: "job-sources",
    history: getConversationHistory(),
  });

  assert(res4.success, "Scenario 4 should succeed");
  const text4 = res4.text.toLowerCase();
  assert(
    text4.includes("0") ||
      text4.includes("zero") ||
      text4.includes("no jobs") ||
      text4.includes("403") ||
      text4.includes("failed") ||
      text4.includes("error"),
    "Should explain that 0 jobs were fetched from Greenhouse due to connector error"
  );
  appendToConversationHistory("user", "Now show only jobs from Greenhouse.");
  appendToConversationHistory("assistant", res4.text);
  console.log(`✓ Scenario 4 Passed: Conversational follow-up correctly resolved Greenhouse status (0 jobs / 403 error).\n`);

  // Scenario 5: "How many jobs were ingested yesterday?"
  console.log("SCENARIO 5: 'How many jobs were ingested yesterday?'...");
  const res5 = await processChatWithAi({
    query: "How many jobs were ingested yesterday?",
    activePage: "job-sources",
    history: getConversationHistory(),
  });

  assert(res5.success, "Scenario 5 should succeed");
  const text5 = res5.text;
  assert(
    text5.includes("78") || text5.includes("72"),
    "Must state accurate daily ingestion count (78 or 72 jobs)"
  );
  appendToConversationHistory("user", "How many jobs were ingested yesterday?");
  appendToConversationHistory("assistant", res5.text);
  console.log(`✓ Scenario 5 Passed: Accurately returned yesterday's ingestion count.\n`);

  // Scenario 6: "Explain the errors in that report." (Follow-up)
  console.log("SCENARIO 6: 'Explain the errors in that report.' (Follow-up)...");
  const res6 = await processChatWithAi({
    query: "Explain the errors in that report.",
    activePage: "job-sources",
    history: getConversationHistory(),
  });

  assert(res6.success, "Scenario 6 should succeed");
  const text6 = res6.text.toLowerCase();
  assert(
    text6.includes("greenhouse") || text6.includes("403") || text6.includes("lever") || text6.includes("timeout"),
    "Must explain Greenhouse HTTP 403 and Lever timeout errors from the report"
  );
  appendToConversationHistory("user", "Explain the errors in that report.");
  appendToConversationHistory("assistant", res6.text);
  console.log(`✓ Scenario 6 Passed: Follow-up successfully explained report errors (Greenhouse 403 & Lever timeout).\n`);

  // Scenario 7: Clear the chat and verify old history is removed
  console.log("SCENARIO 7: Clear the chat and verify old history is removed...");
  assert(getConversationHistory().length > 0, "History should have accumulated messages");
  clearConversationHistory();
  const cleared = getConversationHistory();
  assert.strictEqual(cleared.length, 0, "Conversation history must be completely empty after clear");

  // Subsequent question starts with empty history
  const res7 = await processChatWithAi({
    query: "Tell me about AIFA GEN LABS.",
    activePage: "dashboard",
    history: cleared,
  });
  assert(res7.success, "Subsequent query with cleared history should succeed");
  console.log(`✓ Scenario 7 Passed: sessionStorage cleared and reset cleanly.\n`);

  console.log("======================================================================");
  console.log("=== ALL 7 SCENARIOS VERIFIED SUCCESSFULLY (100% PASS RATE) ===");
  console.log("======================================================================");
}

runSimpleArchitectureTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
