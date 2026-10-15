import React, { useState } from "react";
import {
  Cpu,
  Copy,
  Check,
  Shield,
  ArrowRight,
} from "lucide-react";
import Drawer from "../../../components/ui/Drawer";
import Badge from "../../../components/ui/Badge";
import { MODEL_PRICING } from "../constants/aiUsageData";

export default function AiRequestDetailsDrawer({
  isOpen,
  onClose,
  request,
  activeTab = "overview",
  onTabChange,
  relatedRequests = [],
  onSelectRelatedRequest,
  darkMode = false,
}) {
  const [copiedId, setCopiedId] = useState(null);

  if (!request) return null;

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const pricing = MODEL_PRICING[request.model] || {};
  const inRate = pricing.inputCostPer1M || 0;
  const outRate = pricing.outputCostPer1M || 0;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "io", label: "Input / Output" },
    { id: "performance", label: "Performance" },
    { id: "related", label: `Related (${relatedRequests.length})` },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      darkMode={darkMode}
      width="max-w-md sm:max-w-xl md:max-w-2xl"
      customHeader={
        <div className="flex items-start justify-between gap-3 w-full pr-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4
                  className={`text-base font-extrabold ${
                    darkMode ? "text-white" : "text-[#0B192C]"
                  }`}
                >
                  AI Request Details
                </h4>
                <Badge
                  size="sm"
                  variant={request.status === "Success" ? "success" : "danger"}
                >
                  {request.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {request.id} • {request.relativeTime}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* SUMMARY HERO BAR */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            darkMode
              ? "bg-[#0D1117] border-[#30363D]"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Executed Feature
            </span>
            <span
              className={`text-sm font-extrabold ${
                darkMode ? "text-white" : "text-[#0B192C]"
              } block mt-0.5`}
            >
              {request.feature}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {request.provider} / {request.model}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Execution Cost
            </span>
            <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
              ${request.estimatedCost.toFixed(4)}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {request.totalTokens.toLocaleString()} tokens
            </span>
          </div>
        </div>

        {/* TAB NAVIGATION BAR */}
        <div className="flex items-center gap-1 border-b border-slate-500/10 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#0B192C] text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Request ID */}
              <div
                className={`p-3 rounded-2xl border ${
                  darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  Request ID
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {request.id}
                  </span>
                  <button
                    onClick={() => handleCopy(request.id, "reqId")}
                    className="p-1 hover:text-amber-500 text-slate-400"
                    title="Copy ID"
                  >
                    {copiedId === "reqId" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Status & Code */}
              <div
                className={`p-3 rounded-2xl border ${
                  darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  Status & Response Code
                </span>
                <span className="font-mono font-bold block mt-1">
                  {request.status} (HTTP {request.httpStatus || 200})
                </span>
              </div>

              {/* Provider & Model */}
              <div
                className={`p-3 rounded-2xl border ${
                  darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  Provider & Model
                </span>
                <span className="font-bold block mt-1">
                  {request.provider} • {request.model}
                </span>
              </div>

              {/* Actor */}
              <div
                className={`p-3 rounded-2xl border ${
                  darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  Actor & Role
                </span>
                <span className="font-bold block mt-1 truncate">
                  {request.actorName} ({request.actorType})
                </span>
                <span className="text-[10px] text-slate-400 font-mono truncate block">
                  {request.actorEmail}
                </span>
              </div>

              {/* Session ID */}
              <div
                className={`p-3 rounded-2xl border ${
                  darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  Session ID
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-slate-600 dark:text-slate-300">
                    {request.sessionId || "N/A"}
                  </span>
                  {request.sessionId && (
                    <button
                      onClick={() => handleCopy(request.sessionId, "sessId")}
                      className="p-1 hover:text-amber-500 text-slate-400"
                    >
                      {copiedId === "sessId" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Correlation ID */}
              <div
                className={`p-3 rounded-2xl border ${
                  darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  Correlation ID
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-slate-600 dark:text-slate-300">
                    {request.correlationId || "N/A"}
                  </span>
                  {request.correlationId && (
                    <button
                      onClick={() => handleCopy(request.correlationId, "corrId")}
                      className="p-1 hover:text-amber-500 text-slate-400"
                    >
                      {copiedId === "corrId" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Timestamp (UTC) */}
              <div
                className={`p-3 rounded-2xl border ${
                  darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  Timestamp (UTC)
                </span>
                <span className="font-mono text-slate-600 dark:text-slate-300 block mt-1">
                  {request.timestamp}
                </span>
              </div>

              {/* Environment & Source App */}
              <div
                className={`p-3 rounded-2xl border ${
                  darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  Environment & App
                </span>
                <span className="font-bold block mt-1">
                  {request.environment}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {request.sourceApp}
                </span>
              </div>
            </div>

            {/* Token & Cost Card */}
            <div
              className={`p-4 rounded-2xl border ${
                darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
              }`}
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Token & Latency Summary
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    Input Tokens
                  </span>
                  <span className="font-mono font-bold mt-0.5 block">
                    {Number(request.inputTokens || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    Output Tokens
                  </span>
                  <span className="font-mono font-bold mt-0.5 block">
                    {Number(request.outputTokens || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    Total Tokens
                  </span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                    {Number(request.totalTokens || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    Total Latency
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {request.latencyFormatted}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INPUT / OUTPUT */}
        {activeTab === "io" && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            {/* Redaction Notice */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-start gap-2.5">
              <Shield className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <span className="font-bold block">Safe Diagnostic Telemetry Mode</span>
                <span className="text-[11px] leading-relaxed block mt-0.5">
                  Candidate resumes, sensitive credentials, and prompt secrets are automatically redacted from production observability logs. The simulated trace below illustrates the payload structure.
                </span>
              </div>
            </div>

            {/* Inference Parameters */}
            <div
              className={`p-3.5 rounded-2xl border ${
                darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
              }`}
            >
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Inference Hyperparameters & Prompt Template
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div className="p-2 rounded-xl bg-slate-500/5">
                  <span className="text-slate-400 block text-[10px]">Template</span>
                  <span className="font-bold">ats_v3.4</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-500/5">
                  <span className="text-slate-400 block text-[10px]">Temperature</span>
                  <span className="font-bold">0.20</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-500/5">
                  <span className="text-slate-400 block text-[10px]">Top P</span>
                  <span className="font-bold">0.95</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-500/5">
                  <span className="text-slate-400 block text-[10px]">Max Tokens</span>
                  <span className="font-bold">4,096</span>
                </div>
              </div>
            </div>

            {/* Input Diagnostic Preview */}
            <div
              className={`p-3.5 rounded-2xl border ${
                darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-500/10">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Prompt Payload (Redacted Preview)
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {request.inputTokens} Input Tokens
                </span>
              </div>
              <div
                className={`p-3 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto ${
                  darkMode ? "bg-[#161B22] text-slate-300" : "bg-slate-50 text-slate-700"
                }`}
              >
                {request.safePromptSummary}
              </div>
            </div>

            {/* Output Diagnostic Preview */}
            <div
              className={`p-3.5 rounded-2xl border ${
                darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-500/10">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Completion Payload (Diagnostic Preview)
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {request.outputTokens} Output Tokens
                </span>
              </div>
              <div
                className={`p-3 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto ${
                  darkMode ? "bg-[#161B22] text-slate-300" : "bg-slate-50 text-slate-700"
                }`}
              >
                {request.safeCompletionSummary}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PERFORMANCE */}
        {activeTab === "performance" && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            {/* Latency Breakdown Bar */}
            <div
              className={`p-4 rounded-2xl border ${
                darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Latency Timeline Breakdown
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Total: {request.latencyFormatted}
                </span>
              </div>

              {/* Proportional Segment Bar */}
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex my-2">
                <div
                  className="bg-blue-500 h-full"
                  style={{ width: "28%" }}
                  title="Time to First Token (TTFT): ~28%"
                />
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: "65%" }}
                  title="Inference Generation: ~65%"
                />
                <div
                  className="bg-purple-500 h-full"
                  style={{ width: "7%" }}
                  title="Transport & JSON Parse: ~7%"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-400">
                    TTFT: {request.ttftMs || Math.round(request.latencyMs * 0.28)}ms
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-400">
                    Gen: {Math.round(request.latencyMs * 0.65)}ms
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-slate-400">
                    Wire: {Math.round(request.latencyMs * 0.07)}ms
                  </span>
                </div>
              </div>
            </div>

            {/* Token Distribution Bar */}
            <div
              className={`p-4 rounded-2xl border ${
                darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Token Distribution
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {request.totalTokens.toLocaleString()} Tokens
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex my-2">
                <div
                  className="bg-amber-500 h-full"
                  style={{
                    width: `${
                      request.totalTokens > 0
                        ? (request.inputTokens / request.totalTokens) * 100
                        : 0
                    }%`,
                  }}
                  title={`Input: ${request.inputTokens} tokens`}
                />
                <div
                  className="bg-emerald-500 h-full"
                  style={{
                    width: `${
                      request.totalTokens > 0
                        ? (request.outputTokens / request.totalTokens) * 100
                        : 0
                    }%`,
                  }}
                  title={`Output: ${request.outputTokens} tokens`}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                <span>
                  Input: {request.inputTokens.toLocaleString()} (
                  {(
                    (request.inputTokens / (request.totalTokens || 1)) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
                <span>
                  Output: {request.outputTokens.toLocaleString()} (
                  {(
                    (request.outputTokens / (request.totalTokens || 1)) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              </div>
            </div>

            {/* Cost Formula Breakdown */}
            <div
              className={`p-4 rounded-2xl border ${
                darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50 border-slate-200"
              }`}
            >
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Cost Computation Formula ({request.model})
              </span>
              <div className="space-y-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Input: ({request.inputTokens.toLocaleString()} / 1M) × ${inRate}</span>
                  <span className="font-bold">
                    ${((request.inputTokens / 1_000_000) * inRate).toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Output: ({request.outputTokens.toLocaleString()} / 1M) × ${outRate}</span>
                  <span className="font-bold">
                    ${((request.outputTokens / 1_000_000) * outRate).toFixed(4)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-500/20 flex justify-between font-extrabold text-emerald-600 dark:text-emerald-400">
                  <span>Total Calculated Unit Spend:</span>
                  <span>${request.estimatedCost.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RELATED */}
        {activeTab === "related" && (
          <div className="space-y-3 animate-in fade-in duration-150 text-xs">
            <p className="text-slate-400 text-xs">
              Traces sharing correlation ID ({request.correlationId || "none"}), session ID ({request.sessionId || "none"}), or same candidate workflow:
            </p>

            {relatedRequests.length === 0 ? (
              <div
                className={`p-8 text-center rounded-2xl border ${
                  darkMode ? "border-[#30363D]" : "border-slate-200"
                }`}
              >
                <span className="text-slate-400">No related inference calls detected.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {relatedRequests.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelatedRequest && onSelectRelatedRequest(rel)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      darkMode
                        ? "bg-[#0D1117] border-[#30363D] hover:border-amber-500/60"
                        : "bg-white border-slate-200 hover:border-amber-500/60 shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {rel.feature}
                        </span>
                        <Badge
                          size="sm"
                          variant={rel.status === "Success" ? "success" : "danger"}
                        >
                          {rel.status}
                        </Badge>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-2">
                        <span>{rel.id}</span>
                        <span>•</span>
                        <span>{rel.model}</span>
                        <span>•</span>
                        <span>{rel.relativeTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-right">
                      <div>
                        <span className="font-mono font-bold block text-emerald-600 dark:text-emerald-400">
                          ${rel.estimatedCost.toFixed(4)}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {rel.latencyFormatted}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}
