/**
 * AI Assistant Orchestration Service
 * AIFA GEN LABS Admin Portal
 *
 * Coordinates question submission, AI engine resolution,
 * structured formatting, and conversation persistence.
 */

import { getAiClient } from "./aiClient.js";
import { INITIAL_ASSISTANT_MESSAGE } from "../constants/assistantConstants.js";
import {
  getConversationHistory,
  appendToConversationHistory,
  clearConversationHistory,
  getSessionUiMessages,
  saveSessionUiMessages,
} from "./conversationStorage.js";

class AssistantService {
  constructor() {
    this.client = getAiClient("deterministic");
    this.messages = this.loadHistory();
    this.listeners = new Set();
    this.isProcessing = false;
  }

  loadHistory() {
    const sessionMessages = getSessionUiMessages();
    if (sessionMessages && sessionMessages.length > 0) {
      return sessionMessages;
    }
    return [{ ...INITIAL_ASSISTANT_MESSAGE }];
  }

  saveHistory(messages) {
    saveSessionUiMessages(messages);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener({
          messages: [...this.messages],
          isProcessing: this.isProcessing,
        });
      } catch (e) {
        console.error("AssistantService listener error:", e);
      }
    });
  }

  getMessages() {
    return [...this.messages];
  }

  getIsProcessing() {
    return this.isProcessing;
  }

  clearHistory() {
    clearConversationHistory();
    this.messages = [{ ...INITIAL_ASSISTANT_MESSAGE, id: `msg_${Date.now()}` }];
    this.isProcessing = false;
    this.saveHistory(this.messages);
    this.notify();
  }

  async sendQuestion({ prompt, activePage = "dashboard" }) {
    if (!prompt || !prompt.trim()) return;

    // Resilience: If previous request failed to release processing lock, unblock it
    if (this.isProcessing) {
      this.isProcessing = false;
    }

    const trimmedPrompt = prompt.trim();
    const userMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      timestamp: new Date().toISOString(),
      text: trimmedPrompt,
      activePage,
    };

    // 1. Collect user question and retrieve previous history from sessionStorage
    const previousHistory = getConversationHistory();

    // 2. Add to UI and append user message to sessionStorage history
    this.messages.push(userMessage);
    appendToConversationHistory("user", trimmedPrompt);
    this.isProcessing = true;
    this.notify();

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI response timed out")), 25000)
      );

      // 3. Send question, previous conversation history, and active page
      const queryPromise = this.client.processQuery({
        query: trimmedPrompt,
        activePage,
        history: previousHistory,
      });

      const result = await Promise.race([queryPromise, timeoutPromise]);

      const assistantMessage = {
        id: `ast_${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toISOString(),
        title: result?.title || null,
        text: result?.text || result?.summary || "Query completed successfully.",
        structured: result?.structured || null,
        tool: result?.tool || "conversation",
        aiMetadata: result?.aiMetadata || null,
      };

      // 4. Save assistant response to sessionStorage history and UI messages
      appendToConversationHistory("assistant", assistantMessage.text);
      this.messages.push(assistantMessage);
      this.saveHistory(this.messages);
    } catch (error) {
      console.error("Assistant query processing error:", error);
      const errorMessage = {
        id: `err_${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toISOString(),
        isError: true,
        text: "I encountered an issue processing that query across platform telemetry. Please verify the active module or try asking a suggested question.",
      };
      this.messages.push(errorMessage);
      this.saveHistory(this.messages);
    } finally {
      this.isProcessing = false;
      this.notify();
    }
  }
}

export const assistantService = new AssistantService();
