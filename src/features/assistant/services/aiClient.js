/**
 * AI Client Adapter Layer
 * AIFA GEN LABS Admin Portal
 *
 * Implements the client-side bridge between the conversational assistant UI
 * and the secure backend AI interpretation endpoint (/api/assistant/interpret).
 *
 * Flow:
 * 1. Sends user question to backend (/api/assistant/interpret).
 * 2. Backend uses live AI model (Gemini or Groq) if API key is configured in server env,
 *    or the deterministic semantic NLU parser if no key is present.
 * 3. Client receives the interpreted tool and parameters.
 * 4. Client executes the deterministic tool against the real data sources in toolRegistry.js.
 * 5. Returns real, unhallucinated results formatted as structured tables, cards, and text.
 */

import { executeTool, validateRecordsAgainstSource } from "./toolRegistry.js";
import { parseIntentDeterministically } from "../../../../server/aiService.js";

export class AiAssistantClient {
  constructor(endpoint = "/api/assistant/interpret") {
    this.endpoint = endpoint;
  }

  async processQuery({ query, activePage = "dashboard", history = [] }) {
    let interpreted = null;

    // 1. Attempt to call secure backend AI interpreter
    try {
      const res = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, activePage, history }),
      });

      if (res.ok) {
        interpreted = await res.json();
      }
    } catch {
      // Fallback if backend endpoint is unavailable (e.g. pure static build without dev server)
      interpreted = null;
    }

    // 2. If backend responded with conversational text or structured tool result
    if (interpreted && (interpreted.text || interpreted.summary || interpreted.structured)) {
      let validatedStructured = interpreted.structured;
      if (validatedStructured && Array.isArray(validatedStructured.rows)) {
        validatedStructured = {
          ...validatedStructured,
          rows: validateRecordsAgainstSource(validatedStructured.rows),
        };
      }

      return {
        title: interpreted.title || null,
        summary: interpreted.text || interpreted.summary || "Query processed.",
        text: interpreted.text || interpreted.summary || "Query processed.",
        structured: validatedStructured,
        tool: interpreted.tool || "conversation",
        aiMetadata: interpreted.aiMetadata || {
          provider: interpreted.provider || "groq",
          model: interpreted.model || "Groq (openai/gpt-oss-120b)",
          isOfflineFallback: interpreted.isOfflineFallback || false,
          reasoning: interpreted.reasoning,
          notice: interpreted.notice,
        },
      };
    }

    // 3. Client-side deterministic fallback if backend was unreachable or returned bare tool
    const fallback = (!interpreted || !interpreted.tool)
      ? parseIntentDeterministically(query, activePage, history)
      : interpreted;

    const toolResult = await executeTool(fallback.tool, fallback.params || {});

    return {
      title: toolResult.title,
      summary: toolResult.summary,
      text: toolResult.summary,
      structured: toolResult.structured,
      tool: toolResult.tool,
      aiMetadata: {
        provider: "local_semantic_parser",
        model: "Deterministic Semantic NLU Parser",
        isOfflineFallback: true,
        reasoning: fallback.reasoning,
        notice: "Connected directly via local deterministic parser.",
      },
    };
  }
}

export function getAiClient() {
  return new AiAssistantClient();
}
