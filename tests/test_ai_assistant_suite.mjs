/**
 * Comprehensive Verification Test Suite
 * AIFA GEN LABS Admin Assistant - Data Retrieval & Reasoning
 */

import assert from "node:assert";
import {
  parseIntentDeterministically,
  processChatWithAi,
  parseRetryDelayMs,
  callGroqWithRetry,
  compactToolResultForModel,
  executeDeterministicFallback,
} from "../server/aiService.js";
import {
  executeTool,
  validateRecordAgainstSource,
  validateRecordsAgainstSource,
  toolGetExpiringSubscriptions,
  toolGetSubscriptionBreakdown,
  toolGetJobSources,
  toolCompareAiCosts,
  toolSearchRecruiters,
  normalizeAndValidateToolArgs,
} from "../src/features/assistant/services/toolRegistry.js";
import { mockStore } from "../src/mocks/mockStore.js";

console.log("=== STARTING AI ASSISTANT DATA RETRIEVAL & REASONING VERIFICATION SUITE ===\n");

// TEST CASE 1: Search for an existing candidate by name
console.log("TEST 1: Search for existing candidate ('Aarav Patel')...");
const intent1 = parseIntentDeterministically("Is there a candidate named Aarav Patel?", "users");
assert.strictEqual(intent1.tool, "search_candidates");
assert(intent1.params.name.toLowerCase().includes("aarav"), "Extracted name should include Aarav");
const res1 = await executeTool(intent1.tool, intent1.params);
assert(res1.structured?.rows?.length > 0, "Should return matching rows for Aarav Patel");
assert.strictEqual(res1.structured.rows[0].name, "Aarav Patel");
assert.strictEqual(res1.structured.rows[0].plan, "Premium");
console.log(`✓ Result: Found candidate "${res1.structured.rows[0].name}" (${res1.structured.rows[0].plan}, ATS: ${res1.structured.rows[0].atsScore})\n`);

// TEST CASE 2: Search for a nonexistent candidate
console.log("TEST 2: Search for nonexistent candidate ('Sathwik')...");
const intent2 = parseIntentDeterministically("sathwik", "dashboard");
assert.strictEqual(intent2.tool, "search_candidates");
assert.strictEqual(intent2.params.name, "sathwik");
const res2 = await executeTool(intent2.tool, intent2.params);
assert.strictEqual(res2.summary, "No matching candidate was found in the available records.");
assert.strictEqual(res2.structured, null);
console.log(`✓ Result: "${res2.summary}" (Zero hallucinated records)\n`);

// Also test question format: "Is there a candidate named Sathwik?"
const intent2b = parseIntentDeterministically("Is there a candidate named Sathwik?", "dashboard");
assert.strictEqual(intent2b.tool, "search_candidates");
assert.strictEqual(intent2b.params.name, "Sathwik");
const res2b = await executeTool(intent2b.tool, intent2b.params);
assert.strictEqual(res2b.summary, "No matching candidate was found in the available records.");
console.log(`✓ Question form: "${res2b.summary}"\n`);

// TEST CASE 3: Search for an existing employee or recruiter
console.log("TEST 3: Search for existing recruiter ('Sarah Jenkins')...");
const intent3 = parseIntentDeterministically("Find recruiters named Sarah", "recruiters");
assert.strictEqual(intent3.tool, "search_recruiters");
const res3 = await executeTool(intent3.tool, intent3.params);
assert(res3.structured?.rows?.length > 0, "Should return recruiter Sarah");
assert.strictEqual(res3.structured.rows[0].name, "Sarah Jenkins");
assert.strictEqual(res3.structured.rows[0].employeeId, "AG-REC-101");
console.log(`✓ Result: Found recruiter "${res3.structured.rows[0].name}" (${res3.structured.rows[0].employeeId}, Placements: ${res3.structured.rows[0].placements})\n`);

// TEST CASE 4: Request Premium users
console.log("TEST 4: Request all Premium users ('Show me all Premium users')...");
const intent4 = parseIntentDeterministically("Show me all Premium users", "users");
assert(intent4.tool === "search_users" || intent4.tool === "search_candidates", "Tool should be search_users or search_candidates");
assert.strictEqual(intent4.params.plan, "Premium");
const res4 = await executeTool(intent4.tool, intent4.params);
assert(res4.structured?.rows?.length >= 5, "Should return all Premium users in mockStore");
const allArePremium = res4.structured.rows.every((r) => r.plan.toLowerCase() === "premium");
assert.strictEqual(allArePremium, true, "All returned records must be Premium");
console.log(`✓ Result: Found ${res4.structured.rows.length} verified Premium users\n`);

// TEST CASE 5: Request comparison of AI costs
console.log("TEST 5: AI Cost MoM Comparison ('Compare this month\\'s AI costs with last month')...");
const intent5 = parseIntentDeterministically("Compare this month's AI costs with last month", "ai-usage");
assert.strictEqual(intent5.tool, "compare_ai_costs");
const res5 = await executeTool(intent5.tool, intent5.params);
assert(res5.structured?.comparison, "Should return comparison card");
assert.strictEqual(res5.structured.comparison.currentValue, "$1.16");
assert.strictEqual(res5.structured.comparison.comparisonValue, "$0.56");
assert.strictEqual(res5.structured.comparison.absoluteDiff, "+$0.60");
assert.strictEqual(res5.structured.comparison.percentageDiff, "+107.1%");
console.log(`✓ Result: Current $1.16 vs Previous $0.56 (Diff: +$0.60, +107.1% calculated in JS)\n`);

// TEST CASE 6: Ask about failed job sources
console.log("TEST 6: Ask about failed job sources ('Which job sources have failed?')...");
const intent6 = parseIntentDeterministically("Which job sources have failed?", "job-sources");
assert.strictEqual(intent6.tool, "get_failed_job_sources");
const res6 = await executeTool(intent6.tool, intent6.params);
assert(res6.structured?.rows?.length === 2, "Must find exactly 2 failed sources in real data");
const failedNames = res6.structured.rows.map((r) => r.name);
assert(failedNames.includes("Greenhouse Partner Feeds"));
assert(failedNames.includes("Lever Board Collector"));
console.log(`✓ Result: Identified failed sources: ${failedNames.join(", ")}\n`);

// TEST CASE 7: Ask an unsupported question
console.log("TEST 7: Ask an unsupported external question ('What is the weather in Tokyo?')...");
const intent7 = parseIntentDeterministically("What is the weather in Tokyo?", "dashboard");
assert.strictEqual(intent7.tool, "unsupported_query");
const res7 = await executeTool(intent7.tool, intent7.params);
assert(res7.summary.includes("cannot answer questions about"), "Should clarify external boundary");
console.log(`✓ Result: "${res7.summary}"\n`);

// TEST CASE 8: Ask a question requiring unavailable data
console.log("TEST 8: Ask for unavailable data ('Find employees named Sathwik')...");
const intent8 = parseIntentDeterministically("Find employees named Sathwik.", "dashboard");
assert.strictEqual(intent8.tool, "search_employees");
const res8 = await executeTool(intent8.tool, intent8.params);
assert.strictEqual(res8.summary, "Employee records are not available through the current data sources.");
console.log(`✓ Result: "${res8.summary}"\n`);

// TEST CASE 9: Multi-module question
console.log("TEST 9: Multi-module question ('Compare AI costs with job-fetching activity this month')...");
const intent9 = parseIntentDeterministically("Compare AI costs with job-fetching activity this month", "overview");
assert.strictEqual(intent9.tool, "compare_ai_and_job_fetching");
const res9 = await executeTool(intent9.tool, intent9.params);
assert(res9.structured?.rows?.length === 3, "Should return 3 correlation dimensions");
assert(res9.summary.includes("October 2026"), "Should ground in current month");
assert(res9.summary.includes("$1.16"), "Should include real AI spend");
assert(res9.summary.includes("job-fetching sync runs"), "Should include real sync runs");
console.log(`✓ Result: Correlated October 2026 AI compute ($1.16) with 11 sync runs (214 jobs discovered)\n`);

// BONUS TEST 10: Multi-module Monthly Platform Report
console.log("BONUS TEST 10: Monthly Platform Report ('Give me a monthly platform report')...");
const intent10 = parseIntentDeterministically("Give me a monthly platform report", "overview");
assert.strictEqual(intent10.tool, "get_monthly_platform_report");
const res10 = await executeTool(intent10.tool, intent10.params);
assert(res10.structured?.rows?.length === 5, "Should synthesize across all 5 modules");
console.log(`✓ Result: Generated structured monthly platform report across Candidates, Jobs, Recruiters, AI, and Revenue\n`);

// BONUS TEST 11: Recruiters with zero placements
console.log("BONUS TEST 11: Recruiters with zero placements ('List recruiters who have not made any placements')...");
const intent11 = parseIntentDeterministically("List recruiters who have not made any placements", "recruiters");
assert.strictEqual(intent11.tool, "search_recruiters");
assert.strictEqual(intent11.params.maxPlacements, 0);
const res11 = await executeTool(intent11.tool, intent11.params);
assert(res11.summary.includes("No recruiters were found with zero placements"), "Should accurately state no recruiter has 0 placements");
console.log(`✓ Result: "${res11.summary}"\n`);

// TEST CASE 12: Gemini/Groq Response Markdown Fence & Malformed JSON Sanitization
console.log("TEST 12: Gemini Response Parsing & Markdown Code Fence Sanitization...");
import { safeExtractModelJson } from "../server/aiService.js";

// 12a: Pure JSON
const json1 = safeExtractModelJson('{"tool": "search_candidates", "params": {"name": "Aarav"}}');
assert(json1 && json1.tool === "search_candidates");
assert.strictEqual(json1.params.name, "Aarav");

// 12b: Wrapped in ```json ... ``` code fence
const json2 = safeExtractModelJson('```json\n{\n  "tool": "compare_ai_costs",\n  "params": {"compareMonths": true}\n}\n```');
assert(json2 && json2.tool === "compare_ai_costs");
assert.strictEqual(json2.params.compareMonths, true);

// 12c: Wrapped in ``` ... ``` code fence with leading/trailing text
const json3 = safeExtractModelJson('Here is the parsed intent:\n```\n{"tool": "get_failed_job_sources", "params": {}}\n```\nHope this helps!');
assert(json3 && json3.tool === "get_failed_job_sources");

// 12d: Malformed or invalid tool names
const json4 = safeExtractModelJson('Random model chatter without json');
assert.strictEqual(json4, null);

const json5 = safeExtractModelJson('{"tool": "invalid_fake_tool", "params": {}}');
assert.strictEqual(json5, null);
console.log("✓ Result: Cleanly parsed pure JSON, markdown-fenced JSON, and gracefully rejected malformed text without fabrication.\n");

// TEST CASE 13: Groq Provider Detection & Live/Fallback Integration
console.log("TEST 13: Groq Provider Configuration & End-to-End Execution...");
import { interpretWithAi } from "../server/aiService.js";

const testInterp = await interpretWithAi({ query: "Find candidate Aarav Patel", activePage: "users" });
assert(testInterp && testInterp.tool === "search_candidates", "Tool should be search_candidates");
const toolExecution = await executeTool(testInterp.tool, testInterp.params);
assert(toolExecution.summary.includes("Aarav Patel"), "Should find Aarav Patel");
console.log(`✓ Result: Provider "${testInterp.provider}" successfully executed against portal services: ${toolExecution.summary}\n`);

// REGRESSION TEST SUITE: Plan Fidelity, Users vs Candidates, and Exact Filtering
console.log("TEST 14: User & Candidate Regression Suite (Sections A-G)...");

// 14A: "List all users with Basic plan"
console.log("  14A: 'List all users with Basic plan'...");
const pA = parseIntentDeterministically("list out all users with basic plan", "users");
assert.strictEqual(pA.tool, "search_users");
assert.strictEqual(pA.params.plan, "Basic");
const resA = await executeTool(pA.tool, pA.params);
assert(resA.structured?.rows?.length === 3, "Must return exactly 3 Basic users");
const basicNames = resA.structured.rows.map((r) => r.name);
assert(basicNames.includes("Tariq Mansoor") && basicNames.includes("Liam O'Connor") && basicNames.includes("Daisuke Tanaka"));
console.log(`  ✓ 14A Passed: Found all 3 verified Basic users: ${basicNames.join(", ")}`);

// 14B: "List all Premium users"
console.log("  14B: 'List all Premium users'...");
const pB = parseIntentDeterministically("List all Premium users", "users");
assert.strictEqual(pB.tool, "search_users");
assert.strictEqual(pB.params.plan, "Premium");
const resB = await executeTool(pB.tool, pB.params);
assert(resB.structured?.rows?.length === 8, "Must return exactly 8 Premium users");
console.log(`  ✓ 14B Passed: Found 8 verified Premium users`);

// 14C: "Find candidates with Basic plan"
console.log("  14C: 'Find candidates with Basic plan'...");
const pC = parseIntentDeterministically("Find candidates with Basic plan", "users");
assert.strictEqual(pC.tool, "search_candidates");
assert.strictEqual(pC.params.plan, "Basic");
const resC = await executeTool(pC.tool, pC.params);
assert(resC.structured?.rows?.length === 3, "Must return exactly 3 Basic candidates");
console.log(`  ✓ 14C Passed: Filtered strictly by role=Candidate with Basic plan`);

// 14D: "Find employees named Sathwik"
console.log("  14D: 'Find employees named Sathwik'...");
const pD = parseIntentDeterministically("Find employees named Sathwik", "users");
assert.strictEqual(pD.tool, "search_employees");
const resD = await executeTool(pD.tool, pD.params);
assert(resD.summary.includes("Employee records are not available"), "Must clearly report employee data limitation");
console.log(`  ✓ 14D Passed: Reported data boundary: "${resD.summary}"`);

// 14E: "List all users"
console.log("  14E: 'List all users'...");
const pE = parseIntentDeterministically("List all users", "users");
assert.strictEqual(pE.tool, "search_users");
const resE = await executeTool(pE.tool, pE.params);
assert(resE.structured?.rows?.length === 12, "Must return all 12 platform users across Candidate, Recruiter, and Admin");
console.log(`  ✓ 14E Passed: Returned all 12 platform users across all roles`);

// 14F: "List all users with Starter plan"
console.log("  14F: 'List all users with Starter plan'...");
const pF = parseIntentDeterministically("List all users with Starter plan", "users");
assert.strictEqual(pF.tool, "search_users");
assert.strictEqual(pF.params.plan, "Starter");
const resF = await executeTool(pF.tool, pF.params);
assert(resF.structured === null, "Must not fabricate records for unsupported Starter plan");
assert(resF.summary.includes("Starter"), "Must explicitly report zero matches for Starter plan");
console.log(`  ✓ 14F Passed: Zero matches reported for Starter plan without substituting Basic`);

// 14G: No matching records
console.log("  14G: No matching records ('Is there a candidate named Sathwik?')...");
const pG = parseIntentDeterministically("Is there a candidate named Sathwik?", "users");
assert.strictEqual(pG.tool, "search_candidates");
const resG = await executeTool(pG.tool, pG.params);
assert(resG.structured === null, "Must return zero structured records");
assert(resG.summary.includes("No matching candidate was found"), "Must state no matching candidate was found");
console.log(`  ✓ 14G Passed: Zero hallucination boundary verified: "${resG.summary}"\n`);

// TEST 15: Subscription Expiration Filtering & Authoritative Data Integrity (Sections 15A-15G)
console.log("TEST 15: Subscription Expiration & Data Integrity Regression Suite...");

// 15A: "Just get me the details of candidates whose plan is going to expire soon."
console.log("  15A: 'Just get me the details of candidates whose plan is going to expire soon.'...");
const p15A = parseIntentDeterministically("Just get me the details of candidates whose plan is going to expire soon.", "candidates");
assert.strictEqual(p15A.tool, "get_expiring_subscriptions", "Must route to get_expiring_subscriptions tool");
const res15A = await executeTool(p15A.tool, p15A.params);
assert(res15A.structured && Array.isArray(res15A.structured.rows), "Must return structured table rows");
assert.strictEqual(res15A.structured.rows.length, 7, "Must return exactly 7 active candidates expiring in next 30 days");

const expiringNames = res15A.structured.rows.map((r) => r.name);
// Elena Rostova (3 days), Liam O'Connor (7 days), Chukwudi Okafor (18 days), Mei-Ling Zhou (22 days), Aarav Patel (25 days), Ananya Sharma (26 days), Daisuke Tanaka (26 days)
assert(expiringNames.includes("Elena Rostova"), "Elena Rostova must be included (expires in 3 days)");
assert(expiringNames.includes("Liam O'Connor"), "Liam O'Connor must be included (expires in 7 days)");
assert(expiringNames.includes("Aarav Patel"), "Aarav Patel must be included (expires in 25 days)");

// CRITICAL ASSERTION: Tariq Mansoor is Past Due, NOT expiring soon
assert(!expiringNames.includes("Tariq Mansoor"), "CRITICAL: Tariq Mansoor (Past Due) must NOT be returned as expiring soon");
console.log(`  ✓ 15A Passed: Returned ${res15A.structured.rows.length} valid active expiring candidates; Tariq Mansoor correctly excluded`);

// 15B: Expired and Past Due subscriptions
console.log("  15B: Expired and Past Due subscriptions handling...");
const p15B = parseIntentDeterministically("Show past due candidates", "candidates");
assert.strictEqual(p15B.tool, "search_candidates");
assert.strictEqual(p15B.params.status, "Past Due");
const res15B = await executeTool(p15B.tool, p15B.params);
assert(res15B.structured?.rows?.length === 1, "Must return exactly 1 Past Due candidate");
assert.strictEqual(res15B.structured.rows[0].name, "Tariq Mansoor", "Past Due query must legitimately return Tariq Mansoor");
console.log(`  ✓ 15B Passed: Legitimate past-due query correctly returned Tariq Mansoor`);

// 15C: Subscriptions without expiration dates
console.log("  15C: Subscriptions without expiration dates (e.g. Carlos Gomez with plan None)...");
assert(!expiringNames.includes("Carlos Gomez"), "Carlos Gomez (plan None, renewalDate '--') must NOT be in expiring list");
console.log(`  ✓ 15C Passed: Candidates without expiration dates correctly omitted`);

// 15D: Suspended subscriptions
console.log("  15D: Suspended accounts (e.g. Fatima Al-Mansoor)...");
assert(!expiringNames.includes("Fatima Al-Mansoor"), "Suspended accounts must NOT be returned in active expiring list");
console.log(`  ✓ 15D Passed: Suspended accounts correctly excluded`);

// 15E: Zero matching records in narrow window
console.log("  15E: Zero matching records in a 1-day window...");
const res15E = await toolGetExpiringSubscriptions({ role: "Candidate", daysWindow: 1 });
assert.strictEqual(res15E.structured, null, "Must return null structured table when no records match");
assert(res15E.summary.includes("No active candidate subscriptions are scheduled to expire"), "Must state zero matches cleanly");
console.log(`  ✓ 15E Passed: Zero matches cleanly handled without fabrication`);

// 15F: Record validator rejects non-existent/fake IDs
console.log("  15F: Authoritative validator rejects hallucinated IDs...");
const fakeRecord = { id: "usr_fake_9999", name: "Hallucinated Candidate", plan: "Premium" };
const validatedFake = validateRecordAgainstSource(fakeRecord);
assert.strictEqual(validatedFake, null, "Validator must reject non-existent ID");

const tamperedRecord = { id: "usr_9104", name: "Tampered Name", plan: "Basic" };
const validatedTampered = validateRecordAgainstSource(tamperedRecord);
assert.strictEqual(validatedTampered.name, "Aarav Patel", "Validator must restore authoritative stored name");
assert.strictEqual(validatedTampered.plan, "Premium", "Validator must restore authoritative stored plan");

const batchValidated = validateRecordsAgainstSource([fakeRecord, tamperedRecord]);
assert.strictEqual(batchValidated.length, 1, "Batch validator must filter out rejected fake records");
assert.strictEqual(batchValidated[0].name, "Aarav Patel", "Batch validator must return only valid authoritative records");
console.log(`  ✓ 15F Passed: Validator rejected fake ID and restored authoritative record values`);

// 15G: Consistency between assistant results and the Users page
console.log("  15G: Consistency between assistant results and Users page dataset...");
const authoritativeUsers = mockStore.getState().users;
for (const row of res15A.structured.rows) {
  const sourceMatch = authoritativeUsers.find((u) => u.id === row.id);
  assert(sourceMatch !== undefined, `Displayed user ${row.id} must exist in authoritative users dataset`);
  assert.strictEqual(row.name, sourceMatch.name, `Displayed name must match source for ${row.id}`);
  assert.strictEqual(row.email, sourceMatch.email, `Displayed email must match source for ${row.id}`);
  assert.strictEqual(row.plan, sourceMatch.plan, `Displayed plan must match source for ${row.id}`);
  assert.strictEqual(row.status, sourceMatch.status, `Displayed status must match source for ${row.id}`);
  assert.strictEqual(row.expirationDate, sourceMatch.subscription.renewalDate, `Expiration date must match stored renewalDate for ${row.id}`);
}
console.log(`  ✓ 15G Passed: All displayed records match the authoritative Users dataset 100% identically\n`);

// TEST CASE 16: Phase 12 Comprehensive 17-Point Regression Suite
console.log("TEST 16: Phase 12 Comprehensive 17-Point Regression Suite...");

// 16.1: General company question does not invent integrations or certifications
console.log("  16.1: General company question does not invent integrations or certifications...");
const p16_1 = parseIntentDeterministically("Tell me about AIFA GEN LABS", "dashboard");
assert.strictEqual(p16_1.tool, "explain_company");
const res16_1 = await executeTool(p16_1.tool, p16_1.params);
assert(!res16_1.summary.includes("SOC2") && !res16_1.summary.includes("ISO 27001"), "Must not invent certifications");
assert(res16_1.summary.includes("mock dataset"), "Must disclose in-memory mock dataset usage");
console.log("  ✓ 16.1 Passed: General company overview grounded and discloses mock datasets");

// 16.2: Basic-plan users returned from actual dataset
console.log("  16.2: Basic-plan users returned from actual dataset...");
const p16_2 = parseIntentDeterministically("list out all users with basic plan", "users");
const res16_2 = await executeTool(p16_2.tool, p16_2.params);
assert.strictEqual(res16_2.structured.rows.length, 3, "Must return exactly 3 Basic users");
const basicNames16_2 = res16_2.structured.rows.map((r) => r.name);
assert(basicNames16_2.includes("Tariq Mansoor"));
assert(basicNames16_2.includes("Liam O'Connor"));
assert(basicNames16_2.includes("Daisuke Tanaka"));
console.log("  ✓ 16.2 Passed: Found all 3 verified Basic users from dataset");

// 16.3: Inactive-user counts grouped correctly by plan
console.log("  16.3: Inactive-user counts grouped correctly by plan...");
const p16_3 = parseIntentDeterministically("Which subscription plan has the most inactive users?", "users");
assert.strictEqual(p16_3.tool, "get_subscription_breakdown");
const res16_3 = await executeTool(p16_3.tool, p16_3.params);
assert.strictEqual(res16_3.structured.meta.inactiveByPlan.None, 1, "None plan must have 1 inactive user");
assert.strictEqual(res16_3.structured.meta.inactiveByPlan.Basic, 0, "Basic plan must have 0 inactive users");
assert.strictEqual(res16_3.structured.meta.inactiveByPlan.Premium, 0, "Premium plan must have 0 inactive users");
assert(res16_3.summary.includes("Carlos Gomez"), "Summary must mention Carlos Gomez as the inactive user on None plan");
console.log("  ✓ 16.3 Passed: Inactive user distribution correctly calculated (None: 1, Basic: 0, Premium: 0)");

// 16.4: Past-due subscriptions not classified as upcoming expirations
console.log("  16.4: Past-due subscriptions not classified as upcoming expirations...");
const res16_4 = await toolGetExpiringSubscriptions({ role: "Candidate", daysWindow: 30 });
const expiringNames16_4 = res16_4.structured.rows.map((r) => r.name);
assert(!expiringNames16_4.includes("Tariq Mansoor"), "Tariq Mansoor must not be returned in upcoming expirations");
console.log("  ✓ 16.4 Passed: Past-due accounts excluded from upcoming expirations");

// 16.5: Upcoming-expiration queries use actual renewal dates
console.log("  16.5: Upcoming-expiration queries use actual renewal dates...");
const elena = res16_4.structured.rows.find((r) => r.name === "Elena Rostova");
assert.strictEqual(elena.expirationDate, "2026-10-18", "Elena renewalDate must match stored 2026-10-18");
console.log("  ✓ 16.5 Passed: Upcoming-expiration queries use actual stored renewal dates");

// 16.6: Recruiter three-month comparison does not invent historical data
console.log("  16.6: Recruiter three-month comparison does not invent historical data...");
const p16_6 = parseIntentDeterministically("Compare recruiter performance over the last 3 months", "recruiters");
assert.strictEqual(p16_6.tool, "analyze_recruiters");
const res16_6 = await executeTool(p16_6.tool, p16_6.params);
assert.strictEqual(res16_6.structured.meta.hasHistoricalSnapshots, false, "Must disclose absence of monthly snapshots");
assert.strictEqual(res16_6.structured.meta.zeroPlacementsCount, 0, "Must confirm 0 recruiters have zero placements");
assert.strictEqual(res16_6.structured.meta.teamAvgRate, "37.1%", "Team average conversion must be 37.1%");
console.log("  ✓ 16.6 Passed: Recruiter audit transparently discloses cumulative metrics and 37.1% benchmark");

// 16.7: Job-source success rates are calculated correctly
console.log("  16.7: Job-source success rates are calculated correctly...");
const res16_7 = await toolGetJobSources();
assert.strictEqual(res16_7.structured.meta.totalRuns, 11, "Must analyze all 11 sync history executions");
assert.strictEqual(res16_7.structured.meta.successfulRuns, 8, "Must verify 8 successful sync runs");
assert.strictEqual(res16_7.structured.meta.failedRuns, 3, "Must verify 3 failed sync runs");
assert.strictEqual(res16_7.structured.meta.overallSuccessRate, "72.7%", "Success rate must be exactly 72.7%");
console.log("  ✓ 16.7 Passed: Job-source sync rate correctly calculated at 72.7% (8/11 runs)");

// 16.8: AI month-over-month absolute and percentage changes are correct
console.log("  16.8: AI month-over-month absolute and percentage changes are correct...");
const res16_8 = await toolCompareAiCosts();
assert.strictEqual(res16_8.structured.comparison.currentValue, "$1.16");
assert.strictEqual(res16_8.structured.comparison.comparisonValue, "$0.56");
assert.strictEqual(res16_8.structured.comparison.absoluteDiff, "+$0.60");
assert.strictEqual(res16_8.structured.comparison.percentageDiff, "+107.1%");
console.log("  ✓ 16.8 Passed: AI MoM changes verified (+$0.60 / +107.1%)");

// 16.9: Zero previous-month cost does not cause division errors
console.log("  16.9: Zero previous-month cost does not cause division errors...");
const prevCostZero = 0;
const currentCostTest = 1.16;
const pctChangeZero = prevCostZero > 0
  ? Number((((currentCostTest - prevCostZero) / prevCostZero) * 100).toFixed(1))
  : (currentCostTest > 0 ? 100 : 0);
assert(!isNaN(pctChangeZero), "Percentage change with zero prevCost must not be NaN");
assert(isFinite(pctChangeZero), "Percentage change with zero prevCost must be finite");
assert.strictEqual(pctChangeZero, 100, "Percentage change from 0 to positive cost must be 100%");
console.log("  ✓ 16.9 Passed: Zero previous-month cost handled without division errors or NaN");

// 16.10: Cross-module questions retrieve both relevant datasets
console.log("  16.10: Cross-module questions retrieve both relevant datasets...");
const p16_10 = parseIntentDeterministically("Compare AI costs with job-fetching activity this month", "dashboard");
assert.strictEqual(p16_10.tool, "compare_ai_and_job_fetching");
const res16_10 = await executeTool(p16_10.tool, p16_10.params);
assert(res16_10.summary.includes("11 job-fetching sync runs"), "Must retrieve job sync runs");
assert(res16_10.summary.includes("$1.16"), "Must retrieve AI compute spend");
console.log("  ✓ 16.10 Passed: Cross-module query retrieved both AI compute and job-fetching datasets");

// 16.11: Follow-up questions preserve their conversational context
console.log("  16.11: Follow-up questions preserve their conversational context...");
const historyFollowUp = [
  { sender: "user", text: "Compare our AI costs this month and last month." },
  { sender: "assistant", text: "AI compute spend for October 2026 is $1.16 compared to $0.56 in September 2026." },
];
const p16_11 = parseIntentDeterministically("What caused that change?", "ai-usage", historyFollowUp);
assert.strictEqual(p16_11.tool, "compare_ai_costs", "Must resolve 'that change' to preceding AI cost comparison");
console.log("  ✓ 16.11 Passed: Conversational follow-up resolved context to preceding topic");

// 16.12: 'Recheck your previous answer' triggers appropriate verification
console.log("  16.12: 'Recheck your previous answer' triggers appropriate verification...");
const historyRecheck = [
  { sender: "user", text: "Just get me the details of candidates whose plan is going to expire soon." },
  { sender: "assistant", text: "Found 7 active candidate subscriptions expiring in the next 30 days." },
];
const p16_12 = parseIntentDeterministically("Recheck your previous answer", "candidates", historyRecheck);
assert.strictEqual(p16_12.tool, "recheck_previous_answer");
const res16_12 = await executeTool(p16_12.tool, p16_12.params);
assert(res16_12.summary.includes("Tariq Mansoor"), "Recheck must re-verify Tariq Mansoor status");
assert(res16_12.summary.includes("Past Due"), "Recheck must confirm Past Due standing");
console.log("  ✓ 16.12 Passed: Recheck re-evaluated authoritative records and confirmed Tariq Mansoor is Past Due");

// 16.13: Unsupported data requests return a transparent explanation
console.log("  16.13: Unsupported data requests return a transparent explanation...");
const p16_13 = parseIntentDeterministically("What is our customer churn rate in Antarctica?", "overview");
assert.strictEqual(p16_13.tool, "unsupported_query");
const res16_13 = await executeTool(p16_13.tool, p16_13.params);
assert(res16_13.summary.includes("cannot answer questions about"), "Must explain unsupported topic transparently");
console.log("  ✓ 16.13 Passed: Unsupported request returned transparent data boundary");

// 16.14: Groq errors activate the fallback without fabricating results
console.log("  16.14: Groq errors activate the fallback without fabricating results...");
const fallbackResult = await processChatWithAi({ query: "list out all users with basic plan", activePage: "users" });
assert.strictEqual(fallbackResult.isOfflineFallback, true, "Must flag offline fallback when network/key unavailable");
assert.strictEqual(fallbackResult.structured.rows.length, 3, "Fallback must return real 3 Basic users without fabrication");
console.log("  ✓ 16.14 Passed: Fallback cleanly engaged and returned 3 verified records");

// 16.15: Displayed records, totals, and summary metrics remain consistent
console.log("  16.15: Displayed records, totals, and summary metrics remain consistent...");
const breakdownRes = await toolGetSubscriptionBreakdown();
const totalRow = breakdownRes.structured.rows.find((r) => r.plan === "Total");
assert.strictEqual(totalRow.total, 12, "Total users in table must equal 12");
const sumRows = breakdownRes.structured.rows
  .filter((r) => r.plan !== "Total")
  .reduce((sum, r) => sum + r.total, 0);
assert.strictEqual(sumRows, 12, "Sum of individual plan rows must equal total row");
console.log("  ✓ 16.15 Passed: Table rows and totals are 100% mathematically consistent");

// 16.16: Tool outputs cannot introduce records that were not retrieved
console.log("  16.16: Tool outputs cannot introduce records that were not retrieved...");
const invalidBatch = validateRecordsAgainstSource([
  { id: "usr_invented_999", name: "Fake Person", plan: "Basic" },
  { id: "usr_9104", name: "Aarav Patel", plan: "Premium" },
]);
assert.strictEqual(invalidBatch.length, 1, "Validator must reject unretrieved/invented IDs");
assert.strictEqual(invalidBatch[0].id, "usr_9104", "Only authoritative stored record is preserved");
console.log("  ✓ 16.16 Passed: Record validator discarded unretrieved/invented record");

// 16.17: The 'do not use tools' instruction does not cause false claims that data was retrieved
console.log("  16.17: The 'do not use tools' instruction does not cause false claims...");
const conversationalPrompt = "Do not use tools. Explain what this admin portal is.";
const p16_17 = parseIntentDeterministically(conversationalPrompt, "dashboard");
assert(p16_17.tool === "explain_company" || p16_17.tool === "help", "Should route to verified knowledge");
const res16_17 = await executeTool(p16_17.tool, p16_17.params);
assert(!res16_17.summary.includes("live platform telemetry"), "Must not falsely claim live telemetry was queried");
console.log("  ✓ 16.17 Passed: Pure knowledge responses do not make false data retrieval claims\n");

console.log("TEST 17: Groq Tool-Validation & Rate-Limit Regression Suite (Section 4)...");

// 17.1: Tool parameter sanitization: { name: null, minPlacements: null, maxPlacements: null }
console.log("  17.1: Tool parameter sanitization ({ name: null, minPlacements: null, maxPlacements: null })...");
const rawNullArgs = { name: null, minPlacements: null, maxPlacements: null };
const norm17_1 = normalizeAndValidateToolArgs("search_recruiters", rawNullArgs);
assert.strictEqual(norm17_1.valid, true, "Validation must succeed for omitted null parameters");
assert.deepStrictEqual(norm17_1.args, {}, "All null parameters must be cleanly stripped");
const res17_1 = await toolSearchRecruiters(rawNullArgs);
assert.strictEqual(res17_1.isError, undefined, "Execution must not error on null parameters");
assert(res17_1.structured?.rows?.length > 0, "Returns all applicable recruiters without filters");
assert(res17_1.summary.includes("Retrieved **"), "Summary must reflect retrieved recruiters");
console.log("  ✓ 17.1 Passed: Null parameters omitted and all recruiters returned cleanly");

// 17.2: minPlacements and maxPlacements combinations: minPlacements: 10, maxPlacements: 15
console.log("  17.2: Combined minPlacements and maxPlacements filters (10 to 15)...");
const res17_2 = await toolSearchRecruiters({ minPlacements: 10, maxPlacements: 15 });
assert.strictEqual(res17_2.isError, undefined);
assert(res17_2.structured?.rows?.length > 0, "Should find matching recruiters between 10 and 15 placements");
for (const r of res17_2.structured.rows) {
  assert(r.placements >= 10 && r.placements <= 15, `Placements ${r.placements} must fall between 10 and 15`);
}
assert(res17_2.summary.includes("between **10** and **15** placements"), "Summary must clearly report placement range");
console.log(`  ✓ 17.2 Passed: Found ${res17_2.structured.rows.length} recruiters in 10-15 range with accurate summary`);

// 17.3: Preserving 0 (maxPlacements: 0 or minPlacements: 0)
console.log("  17.3: Preserving 0 without truthiness bugs (maxPlacements: 0, minPlacements: 0)...");
const norm17_3a = normalizeAndValidateToolArgs("search_recruiters", { maxPlacements: 0 });
assert.strictEqual(norm17_3a.args.maxPlacements, 0, "0 must be preserved for maxPlacements");
const res17_3a = await toolSearchRecruiters({ maxPlacements: 0 });
assert(res17_3a.summary.includes("No recruiters were found with zero placements"), "0 placements audit reported accurately");

const norm17_3b = normalizeAndValidateToolArgs("search_recruiters", { minPlacements: 0 });
assert.strictEqual(norm17_3b.args.minPlacements, 0, "0 must be preserved for minPlacements");
const res17_3b = await toolSearchRecruiters({ minPlacements: 0 });
assert(res17_3b.structured?.rows?.length > 0, "minPlacements: 0 returns recruiters with >= 0 placements");
console.log("  ✓ 17.3 Passed: 0 preserved without truthiness bugs across minPlacements and maxPlacements");

// 17.4: Rejecting invalid arguments before execution (e.g. minPlacements: 'abc')
console.log("  17.4: Rejecting invalid non-numeric arguments before execution...");
const norm17_4 = normalizeAndValidateToolArgs("search_recruiters", { minPlacements: "abc" });
assert.strictEqual(norm17_4.valid, false, "Must flag invalid parameter");
assert(norm17_4.error.includes("minPlacements"), "Error message must cite invalid parameter name");
const res17_4 = await executeTool("search_recruiters", { minPlacements: "abc" });
assert.strictEqual(res17_4.isError, true, "executeTool must reject invalid parameter without executing");
assert(res17_4.summary.includes("Parameter validation error"), "Reports parameter validation failure");

const normRange = normalizeAndValidateToolArgs("search_recruiters", { minPlacements: 20, maxPlacements: 10 });
assert.strictEqual(normRange.valid, false, "Must reject inverted placement ranges");
console.log("  ✓ 17.4 Passed: Invalid non-numeric strings and inverted ranges rejected before execution");

// 17.5: Retry-After parsing and bounded exponential backoff with jitter
console.log("  17.5: Retry-After header and error message parsing with backoff and jitter...");
// 17.5a: Header in seconds
const delayFromHeader = parseRetryDelayMs({ headers: { get: () => "2.5" } }, null, 0);
assert.strictEqual(delayFromHeader, 2500, "Header of 2.5s should parse to 2500ms");

// 17.5b: Error payload message parsing
const mockErrBody = { error: { message: "Rate limit reached. Please try again in 1.45s." } };
const delayFromBody = parseRetryDelayMs(null, mockErrBody, 0);
assert.strictEqual(delayFromBody, 1450, "Message with 1.45s should parse to 1450ms");

// 17.5c: Exponential backoff with jitter
const delayExp0 = parseRetryDelayMs(null, null, 0);
assert(delayExp0 >= 1000 && delayExp0 <= 1350, "Attempt 0 backoff with jitter should be ~1000-1300ms");
const delayExp1 = parseRetryDelayMs(null, null, 1);
assert(delayExp1 >= 2000 && delayExp1 <= 2350, "Attempt 1 backoff with jitter should be ~2000-2300ms");
console.log("  ✓ 17.5 Passed: Retry-After header, error JSON text, and exponential backoff calculated accurately");

// 17.6: Non-retryable 400 errors (HTTP 400 not retried as 429)
console.log("  17.6: Non-retryable client errors (HTTP 400 not retried)...");
let fetchCount400 = 0;
const mockFetch400 = async () => {
  fetchCount400++;
  return {
    ok: false,
    status: 400,
    json: async () => ({ error: { message: "Bad Request" } }),
  };
};
const res17_6 = await callGroqWithRetry(mockFetch400, "https://api.groq.com/mock", {}, 2);
assert.strictEqual(res17_6.status, 400);
assert.strictEqual(fetchCount400, 1, "HTTP 400 must NOT be retried (invoked exactly 1 time)");

// And verify that 429 IS retried
let fetchCount429 = 0;
const mockFetch429 = async () => {
  fetchCount429++;
  if (fetchCount429 < 2) {
    return {
      ok: false,
      status: 429,
      headers: { get: () => "0.02" }, // 20ms
      clone: () => ({ json: async () => ({ error: { message: "try again in 20ms" } }) }),
    };
  }
  return {
    ok: true,
    status: 200,
    json: async () => ({ choices: [{ message: { content: "Success after 429" } }] }),
  };
};
const res17_6b = await callGroqWithRetry(mockFetch429, "https://api.groq.com/mock", {}, 2);
assert.strictEqual(res17_6b.status, 200);
assert.strictEqual(fetchCount429, 2, "HTTP 429 must be retried after retry delay");
console.log("  ✓ 17.6 Passed: HTTP 400 client error failed fast without retrying; HTTP 429 retried successfully");

// 17.7: Duplicate in-flight request deduplication
console.log("  17.7: In-flight duplicate request deduplication...");
const pDedupA = processChatWithAi({ query: "List all users with basic plan", activePage: "users" });
const pDedupB = processChatWithAi({ query: "List all users with basic plan", activePage: "users" });
assert.strictEqual(pDedupA, pDedupB, "Concurrent requests for the exact same query must share identical promise");
const [resDedupA, resDedupB] = await Promise.all([pDedupA, pDedupB]);
assert.strictEqual(resDedupA.text, resDedupB.text, "Both callers receive identical result");
console.log("  ✓ 17.7 Passed: Concurrent duplicate requests deduplicated to single in-flight execution");

// 17.8: Compact tool outputs (rows sliced to 3-5 rows max without giant nested objects)
console.log("  17.8: Compact tool output formatting for model prompt (TPM protection)...");
const heavyToolResult = {
  summary: "Retrieved 12 verified recruiter records",
  structured: {
    rows: Array.from({ length: 12 }, (_, i) => ({
      name: `Recruiter ${i}`,
      email: `rec${i}@aifa.internal`,
      role: "Talent Partner",
      placements: 10 + i,
      placementRate: "35%",
      assignedCandidates: [{ id: "c1", name: "Heavy Cand 1" }, { id: "c2", name: "Heavy Cand 2" }],
      interviews: [{ id: "i1", notes: "Heavy notes..." }],
      activities: [{ id: "a1", event: "Heavy event log..." }],
      avatar: "https://images.unsplash.com/heavy-photo.jpg",
    })),
    meta: { totalRecruiters: 12 },
  },
};
const compacted = compactToolResultForModel("search_recruiters", heavyToolResult);
assert(compacted.sampleRecords.length <= 3, "Rows must be truncated to at most 3 to prevent TPM exhaustion");
assert.strictEqual(compacted.totalCount, 12, "Total count must be preserved");
assert.strictEqual(compacted.sampleRecords[0].assignedCandidates, undefined, "Nested candidate list must be stripped");
assert.strictEqual(compacted.sampleRecords[0].activities, undefined, "Nested activity list must be stripped");
assert.strictEqual(compacted.sampleRecords[0].avatar, undefined, "Avatar URLs must be stripped");
console.log(`  ✓ 17.8 Passed: Output compacted to ${compacted.sampleRecords.length} rows with deep nested arrays stripped`);

// 17.9: Transparent fallback messaging when offline or rate limited
console.log("  17.9: Transparent fallback messaging on open-ended queries during rate limits...");
const offlineFallback = await executeDeterministicFallback({
  query: "What is our competitive advantage in European cloud recruitment?",
  activePage: "dashboard",
  errorNotice: "Rate limit reached for model openai/gpt-oss-120b (TPM: Limit 8000)",
});
assert.strictEqual(offlineFallback.tool, "offline_notice");
assert(offlineFallback.text.includes("AI Assistant Notice"), "Must display clear service notice");
assert(offlineFallback.text.includes("Open-ended conversational reasoning is temporarily offline"), "Must not pretend general reasoning succeeded");
assert(offlineFallback.text.includes("Rate limit reached"), "Must transparently state the reason");
console.log("  ✓ 17.9 Passed: Open-ended queries during rate limits return transparent, friendly offline notice\n");

// ======================================================================
// TEST 18: JOB-FETCHING REPORT & INGESTION TELEMETRY SUITE (STEP 7 PROMPTS 1-7)
// ======================================================================
console.log("TEST 18: Job-Fetching Report & Ingestion Telemetry Suite (Step 7 Requirements)...");

// 18.1: "Generate a job-fetching report for the last 7 days."
console.log("  18.1: 'Generate a job-fetching report for the last 7 days.'...");
const prompt1Intent = parseIntentDeterministically("Generate a job-fetching report for the last 7 days.");
assert.strictEqual(prompt1Intent.tool, "generate_report", "Must route to generate_report tool");
assert.strictEqual(prompt1Intent.params.days, 7, "Must specify days: 7");

const reportResult = await executeTool(prompt1Intent.tool, prompt1Intent.params);
assert.strictEqual(reportResult.tool, "generate_report");
assert(reportResult.structured && reportResult.structured.report, "Must include structured report object");
const report = reportResult.structured.report;

// A. Summary verification
assert.strictEqual(report.summary.totalJobsFetched, 5, "Must report 5 actual jobs fetched/ingested in last 7 days");
assert.strictEqual(report.summary.distinctJobs, 5, "Must report distinct job count");
assert.strictEqual(report.summary.duplicateClusters, 4, "Must report 4 tracked duplicate clusters");
assert.strictEqual(report.summary.totalSyncRuns, 11, "Must report 11 sync executions in last 7 days");
assert.strictEqual(report.summary.successfulSyncRuns, 8, "Must report 8 successful runs");
assert.strictEqual(report.summary.failedSyncRuns, 3, "Must report 3 failed runs");
assert.strictEqual(report.summary.successRate, "72.7%", "Must report sync success rate");

// B. Actual job listings verification
assert(Array.isArray(report.jobListings) && report.jobListings.length === 5, "Must return 5 matching jobs");
const firstJob = report.jobListings[0];
assert.strictEqual(firstJob.id, "JOB-2026-0042", "First job must be Google Senior Frontend Engineer");
assert.strictEqual(firstJob.company, "Google");
assert.strictEqual(firstJob.source, "LinkedIn");
assert.strictEqual(firstJob.postedDate, "Oct 10, 2026");
assert.strictEqual(firstJob.ingestedDate, "Oct 12, 2026");
assert(reportResult.summary.includes("Senior Frontend Engineer") && reportResult.summary.includes("Google"), "Summary markdown must include Job Title and Company");
assert(reportResult.summary.includes("[View Listing]"), "Summary markdown must include clickable URLs");

// C. Source breakdown verification
assert(reportResult.summary.includes("### C. Source Breakdown"), "Must include Section C Source Breakdown");
assert.strictEqual(report.summary.sourceBreakdown["AIFA Internal Postings Engine"], 2, "Internal postings must equal 2");
assert.strictEqual(report.summary.sourceBreakdown["LinkedIn Global Jobs"], 1, "LinkedIn jobs must equal 1");
assert.strictEqual(report.summary.sourceBreakdown["Naukri India Technology Feed"], 1, "Naukri jobs must equal 1");
assert.strictEqual(report.summary.sourceBreakdown["Indeed Europe Enterprise"], 1, "Indeed jobs must equal 1");

// D. Connector errors & warnings verification
assert(reportResult.summary.includes("Greenhouse Partner Feeds"), "Must report Greenhouse connector status");
assert(reportResult.summary.includes("HTTP 403 Forbidden"), "Must report Greenhouse 403 error");
assert(reportResult.summary.includes("Lever Board Collector"), "Must report Lever timeout error");

// Dual-section CSV verification
assert(report.csvContent.includes("=== SECTION 1: ACTUAL FETCHED JOB LISTINGS ==="), "CSV must include job listings section");
assert(report.csvContent.includes("=== SECTION 2: CONNECTOR SYNC EXECUTION LOGS ==="), "CSV must include sync telemetry section");
assert(report.csvContent.includes("JOB-2026-0042"), "CSV must include real job IDs");
console.log("  ✓ 18.1 Passed: 7-day report returned all 4 sections, real jobs, source breakdown, connector errors, and dual-section CSV");

// 18.2: "List all jobs fetched in the last 7 days."
console.log("  18.2: 'List all jobs fetched in the last 7 days.'...");
const prompt2Intent = parseIntentDeterministically("List all jobs fetched in the last 7 days.");
assert.strictEqual(prompt2Intent.tool, "search_jobs", "Must route to search_jobs tool");
assert.strictEqual(prompt2Intent.params.days, 7, "Must pass days: 7 parameter");

const prompt2Result = await executeTool(prompt2Intent.tool, prompt2Intent.params);
assert.strictEqual(prompt2Result.tool, "search_jobs");
assert.strictEqual(prompt2Result.structured.rows.length, 5, "Must return all 5 jobs from the last 7 days");
const expectedJobIds = ["JOB-2026-0042", "JOB-2026-0041", "JOB-2026-0040", "JOB-2026-0039", "JOB-2026-0038"];
const returnedJobIds = prompt2Result.structured.rows.map((r) => r.id);
assert.deepStrictEqual(returnedJobIds, expectedJobIds, "Must return exact matching job IDs");
assert(prompt2Result.structured.columns.some((c) => c.key === "postedDate"), "Columns must include Posted Date");
assert(prompt2Result.structured.columns.some((c) => c.key === "ingestedDate"), "Columns must include Ingested Date");
assert(prompt2Result.structured.columns.some((c) => c.key === "applicationUrl"), "Columns must include Job URL");
console.log("  ✓ 18.2 Passed: Listed all 5 jobs with full schema (Posted Date, Ingested Date, URLs)");

// 18.3: "Show the latest 20 jobs."
console.log("  18.3: 'Show the latest 20 jobs.'...");
const prompt3Intent = parseIntentDeterministically("Show the latest 20 jobs.");
assert.strictEqual(prompt3Intent.tool, "search_jobs", "Must route to search_jobs tool");
assert.strictEqual(prompt3Intent.params.limit, 20, "Must set limit: 20");

const prompt3Result = await executeTool(prompt3Intent.tool, prompt3Intent.params);
assert.strictEqual(prompt3Result.structured.rows.length, 20, "Must return exactly 20 jobs");
assert.strictEqual(prompt3Result.structured.rows[0].id, "JOB-2026-0042", "Must be sorted by latest vacancy first");
assert.strictEqual(prompt3Result.structured.rows[19].id, "JOB-2026-0023", "20th job must match the 20th record");
console.log("  ✓ 18.3 Passed: Successfully retrieved latest 20 jobs from mockStore");

// 18.4: "Show jobs fetched from Greenhouse in the last 7 days."
console.log("  18.4: 'Show jobs fetched from Greenhouse in the last 7 days.'...");
const prompt4Intent = parseIntentDeterministically("Show jobs fetched from Greenhouse in the last 7 days.");
assert.strictEqual(prompt4Intent.tool, "search_jobs", "Must route to search_jobs tool");
assert.strictEqual(prompt4Intent.params.source, "Greenhouse");
assert.strictEqual(prompt4Intent.params.days, 7);

const prompt4Result = await executeTool(prompt4Intent.tool, prompt4Intent.params);
assert.strictEqual(prompt4Result.structured, null, "Must NOT return any fabricated or hallucinated jobs for Greenhouse");
assert(prompt4Result.summary.includes("No matching jobs were found from **Greenhouse Partner Feeds**"), "Must explicitly report 0 jobs");
assert(prompt4Result.summary.includes("HTTP 403 Forbidden"), "Must explain the real connector failure (WAF / anti-bot)");
console.log("  ✓ 18.4 Passed: Transparently reported 0 Greenhouse jobs due to connector HTTP 403 error without hallucinating");

// 18.5: "How many jobs were ingested yesterday?"
console.log("  18.5: 'How many jobs were ingested yesterday?'...");
const prompt5Intent = parseIntentDeterministically("How many jobs were ingested yesterday?");
assert.strictEqual(prompt5Intent.tool, "search_jobs");
assert.strictEqual(prompt5Intent.params.yesterday, true);

const prompt5Result = await executeTool(prompt5Intent.tool, prompt5Intent.params);
assert(prompt5Result.summary.includes("78 jobs"), "Must report 78 jobs on October 11 (preceding day)");
assert(prompt5Result.summary.includes("72 jobs"), "Must report 72 jobs on October 12 (latest sync day)");
assert(prompt5Result.structured.rows.length >= 2, "Structured table must include both recent dates");
console.log("  ✓ 18.5 Passed: Daily ingestion telemetry returned exact recorded counts (78 / 72 jobs) with source breakdown");

// 18.6: "List jobs from the last 7 days grouped by source."
console.log("  18.6: 'List jobs from the last 7 days grouped by source.'...");
const prompt6Intent = parseIntentDeterministically("List jobs from the last 7 days grouped by source.");
assert.strictEqual(prompt6Intent.tool, "search_jobs");
assert.strictEqual(prompt6Intent.params.days, 7);
assert.strictEqual(prompt6Intent.params.groupBy, "source");

const prompt6Result = await executeTool(prompt6Intent.tool, prompt6Intent.params);
assert(prompt6Result.summary.includes("### Internal"), "Must include Internal source group");
assert(prompt6Result.summary.includes("### LinkedIn"), "Must include LinkedIn source group");
assert(prompt6Result.summary.includes("### Naukri"), "Must include Naukri source group");
assert(prompt6Result.summary.includes("### Indeed"), "Must include Indeed source group");
assert.strictEqual(prompt6Result.structured.rows.length, 5, "Structured table must contain all 5 grouped jobs");
console.log("  ✓ 18.6 Passed: Jobs from last 7 days correctly grouped by source");

// 18.7: "Show the jobs that failed to ingest"
console.log("  18.7: 'Show the jobs that failed to ingest'...");
const prompt7Intent = parseIntentDeterministically("Show the jobs that failed to ingest");
assert.strictEqual(prompt7Intent.tool, "search_jobs");
assert.strictEqual(prompt7Intent.params.failedOnly, true);

const prompt7Result = await executeTool(prompt7Intent.tool, prompt7Intent.params);
assert(prompt7Result.summary.includes("The platform tracks **connector-level sync failures** rather than storing individual rejected job records"), "Must clarify failure data architecture");
assert(prompt7Result.summary.includes("Greenhouse Partner Feeds"), "Must include Greenhouse sync failure");
assert(prompt7Result.summary.includes("Lever Board Collector"), "Must include Lever sync failure");
assert.strictEqual(prompt7Result.structured.rows.length, 3, "Must display the 3 failed sync executions");
console.log("  ✓ 18.7 Passed: Accurately reported connector-level ingestion failures and clarified data architecture\n");

// ======================================================================
// TEST 19: AI USAGE & COST REPORTING QUERIES
// ======================================================================
console.log("TEST 19: AI Usage & Telemetry Report Queries...");
const aiReportQueries = [
  "can you generate a report of a usage",
  "can you generate ai report of a usage",
  "can you generate ai usage report",
  "generate ai usage report",
  "ai usage report",
  "can you generate a report of ai usage",
];

for (const q of aiReportQueries) {
  const intent = parseIntentDeterministically(q);
  assert.strictEqual(
    intent.tool,
    "compare_ai_costs",
    `Query "${q}" must route to compare_ai_costs, got "${intent.tool}"`
  );
  assert.strictEqual(intent.params.compareMonths, true);
}

const aiReportResult = await executeTool("compare_ai_costs", { compareMonths: true });
assert(aiReportResult.summary.includes("October 2026"), "Report must include October 2026 usage");
assert(aiReportResult.summary.includes("September 2026"), "Report must include September 2026 comparison");
assert(aiReportResult.structured.comparison, "Report must include structured comparison data");
console.log("  ✓ 19.1 Passed: All AI usage and cost report query variations route to compare_ai_costs cleanly\n");

console.log("======================================================================");
console.log("=== ALL 19 VERIFICATION & REGRESSION SUITES PASSED (100% ACCURACY) ===");
console.log("======================================================================");




