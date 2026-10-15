import {
  generateSeedAiRequests,
  INITIAL_AI_BUDGET,
  MODEL_PRICING,
  PROVIDERS,
  AI_FEATURES,
} from "../constants/aiUsageData.js";
import { mockStore } from "../../../mocks/mockStore.js";

class AiUsageService {
  constructor() {
    this.requests = generateSeedAiRequests();
    this.budget = { ...INITIAL_AI_BUDGET };
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((cb) => {
      try {
        cb({ requests: this.requests, budget: this.budget });
      } catch (e) {
        console.error("AiUsageService listener error:", e);
      }
    });
  }

  getRequests() {
    return [...this.requests];
  }

  getBudget() {
    return { ...this.budget };
  }

  updateBudget(updates, admin = "admin@aifagen.com") {
    this.budget = {
      ...this.budget,
      ...updates,
      lastUpdated: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    // Log to platform audit logs if mockStore is present
    if (mockStore && typeof mockStore.recordAuditEvent === "function") {
      mockStore.recordAuditEvent({
        action: "AI_BUDGET_UPDATED",
        actionLabel: "AI Budget Governance Modified",
        category: "Administration",
        targetId: "res_ai_budget",
        targetName: "Monthly AI Budget Policy",
        targetType: "Configuration",
        details: `Updated monthly budget ceiling to $${this.budget.monthlyBudgetUsd.toFixed(2)} (Warning: ${this.budget.warningThresholdPct}%, Critical: ${this.budget.criticalThresholdPct}%)`,
        reason: "Administrative AI cost governance policy change",
        actorEmail: admin,
      });
    }

    this.notify();
    return { ...this.budget };
  }

  getRequestById(id) {
    return this.requests.find((r) => r.id === id) || null;
  }

  getRelatedRequests(targetRequest, limit = 5) {
    if (!targetRequest) return [];
    return this.requests
      .filter((r) => {
        if (r.id === targetRequest.id) return false;
        // Same correlation ID
        if (r.correlationId && targetRequest.correlationId && r.correlationId === targetRequest.correlationId) {
          return true;
        }
        // Same session ID
        if (r.sessionId && targetRequest.sessionId && r.sessionId === targetRequest.sessionId) {
          return true;
        }
        // Same actor and same feature within same 24h window
        if (
          r.actorId === targetRequest.actorId &&
          r.feature === targetRequest.feature &&
          Math.abs(new Date(r.timestamp).getTime() - new Date(targetRequest.timestamp).getTime()) < 24 * 3600 * 1000
        ) {
          return true;
        }
        return false;
      })
      .slice(0, limit);
  }

  getConsumerProfile(actorId) {
    const actorRequests = this.requests.filter((r) => r.actorId === actorId);
    if (actorRequests.length === 0) return null;

    const first = actorRequests[0];
    const totalRequests = actorRequests.length;
    const totalTokens = actorRequests.reduce((acc, r) => acc + (r.totalTokens || 0), 0);
    const totalCost = actorRequests.reduce((acc, r) => acc + (r.estimatedCost || 0), 0);
    const successfulRequests = actorRequests.filter((r) => r.status === "Success").length;

    // Feature distribution
    const featureCounts = {};
    actorRequests.forEach((r) => {
      featureCounts[r.feature] = (featureCounts[r.feature] || 0) + 1;
    });

    // Model distribution
    const modelCounts = {};
    actorRequests.forEach((r) => {
      modelCounts[r.model] = (modelCounts[r.model] || 0) + 1;
    });

    return {
      actorId: first.actorId,
      actorName: first.actorName,
      actorEmail: first.actorEmail,
      actorType: first.actorType,
      actorRole: first.actorRole,
      actorAvatar: first.actorAvatar,
      totalRequests,
      totalTokens,
      totalCost: Number(totalCost.toFixed(2)),
      successRate: totalRequests > 0 ? Number(((successfulRequests / totalRequests) * 100).toFixed(1)) : 100,
      featureCounts,
      modelCounts,
      recentRequests: actorRequests.slice(0, 10),
    };
  }

  getModelPricing() {
    return { ...MODEL_PRICING };
  }

  getProviders() {
    return [...PROVIDERS];
  }

  getFeatures() {
    return [...AI_FEATURES];
  }
}

export const aiUsageService = new AiUsageService();
