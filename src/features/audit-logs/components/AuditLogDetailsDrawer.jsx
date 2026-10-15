import React, { useState } from "react";
import {
  ShieldAlert,
  Copy,
  Check,
  User,
  Target,
  Info,
  Clock,
  Code,
  Sliders,
  Bot,
} from "lucide-react";
import Drawer from "../../../components/ui/Drawer";
import AuditLogChangesTable from "./AuditLogChangesTable";
import {
  getResultBadgeClasses,
  getCategoryBadgeClasses,
  getActorTypeBadgeClasses,
  formatRelativeTime,
} from "../utils/auditLogUtils";

/**
 * AuditLogDetailsDrawer Component
 * Right-side inspection slide-over drawer with 4 functional tabs:
 * 1. Overview (Actor info, Target info, Event info, Changes, Additional details)
 * 2. Changes (Full before/after field changes diff table)
 * 3. Context (Technical telemetry, IP, user-agent, correlation IDs, raw JSON inspection)
 * 4. Related Events (Correlated events by correlationId, operationId, actor+target)
 */
export default function AuditLogDetailsDrawer({
  isOpen,
  onClose,
  event,
  activeTab = "overview",
  onTabChange,
  relatedEvents = [],
  onSelectRelatedEvent,
  darkMode = false,
}) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!event) return null;

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const cardBg = darkMode ? "bg-[#161B22] border-[#30363D]" : "bg-white border-slate-200";
  const subCardBg = darkMode ? "bg-[#0D1117] border-[#30363D]" : "bg-slate-50/70 border-slate-200/80";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const monoText = darkMode ? "text-slate-300" : "text-slate-800";

  const resultBadge = getResultBadgeClasses(event.result, darkMode);
  const categoryBadge = getCategoryBadgeClasses(event.category, darkMode);
  const actorBadge = getActorTypeBadgeClasses(event.actorType, darkMode);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "changes", label: "Changes", count: event.changes?.length || 0 },
    { id: "context", label: "Context" },
    { id: "related", label: "Related Events", count: relatedEvents.length },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-xl sm:max-w-2xl"
      darkMode={darkMode}
      customHeader={
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl border ${
              darkMode
                ? "bg-[#21262D] border-[#30363D] text-[#D97706]"
                : "bg-amber-50 border-amber-200/80 text-[#D97706]"
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`text-base font-extrabold leading-tight ${headingText}`}>
              Event Details
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`font-mono text-xs ${subText}`}>{event.id}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(event.id, "header_id")}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
                title="Copy Event ID"
              >
                {copiedKey === "header_id" ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-5 pb-6">
        {/* EVENT SUMMARY TOP BANNER */}
        <div className={`p-4 rounded-2xl border shadow-2xs ${subCardBg} space-y-3`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border uppercase tracking-wider ${resultBadge}`}
                >
                  {event.result}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${categoryBadge}`}
                >
                  {event.category}
                </span>
                <span className={`text-[11px] ${subText}`}>
                  via <strong className={headingText}>{event.source}</strong>
                </span>
              </div>

              <h3 className={`text-base font-bold mt-1.5 leading-snug ${headingText}`}>
                {event.actionLabel || event.action}
              </h3>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 justify-end">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{formatRelativeTime(event.timestamp)}</span>
              </div>
              <div className={`text-[11px] mt-0.5 font-mono ${subText}`}>
                {event.formattedDate}
              </div>
            </div>
          </div>

          <p className={`text-xs leading-relaxed ${subText}`}>
            {event.description}
          </p>
        </div>

        {/* 4 TABS NAVIGATION */}
        <div className={`border-b ${darkMode ? "border-[#30363D]" : "border-slate-200"}`}>
          <div className="flex items-center gap-1 -mb-px overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange && onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "border-[#D97706] text-[#D97706]"
                      : darkMode
                      ? "border-transparent text-slate-400 hover:text-slate-200"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isActive
                          ? "bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300"
                          : darkMode
                          ? "bg-slate-800 text-slate-400"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Section A: ACTOR INFORMATION */}
            <div className={`border rounded-xl p-4 ${cardBg} space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    ACTOR INFORMATION
                  </h5>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${actorBadge}`}>
                  {event.actorType}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {event.actorAvatar ? (
                  <img
                    src={event.actorAvatar}
                    alt={event.actorName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
                  />
                ) : event.actorType === "System" ? (
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {event.actorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-bold truncate ${headingText}`}>
                    {event.actorName}
                  </div>
                  <div className={`text-xs ${subText} truncate`}>
                    {event.actorRole}
                  </div>
                  {event.actorEmail && (
                    <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {event.actorEmail}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {event.actorId}
                  </span>
                </div>
              </div>
            </div>

            {/* Section B: TARGET INFORMATION */}
            <div className={`border rounded-xl p-4 ${cardBg} space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-slate-400" />
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    TARGET INFORMATION
                  </h5>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {event.targetType}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className={`text-sm font-bold truncate ${headingText}`}>
                    {event.targetName}
                  </div>
                  {event.targetEmail && (
                    <div className="text-xs text-slate-400 font-mono truncate mt-0.5">
                      {event.targetEmail}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {event.targetId}
                  </span>
                </div>
              </div>
            </div>

            {/* Section C: EVENT INFORMATION */}
            <div className={`border rounded-xl p-4 ${cardBg} space-y-3`}>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400" />
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  EVENT INFORMATION
                </h5>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className={`block text-[11px] ${subText}`}>Action Code</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {event.action}
                  </span>
                </div>
                <div>
                  <span className={`block text-[11px] ${subText}`}>Category</span>
                  <span className={`font-semibold ${headingText}`}>{event.category}</span>
                </div>
                <div>
                  <span className={`block text-[11px] ${subText}`}>Result Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {event.result}
                  </span>
                </div>
                <div>
                  <span className={`block text-[11px] ${subText}`}>Source Portal</span>
                  <span className={`font-semibold ${headingText}`}>{event.source}</span>
                </div>
                <div>
                  <span className={`block text-[11px] ${subText}`}>IP Address</span>
                  <span className="font-mono text-slate-500">
                    {event.ipAddress || "--"}
                  </span>
                </div>
                <div>
                  <span className={`block text-[11px] ${subText}`}>Session ID</span>
                  <span className="font-mono text-slate-500 truncate block">
                    {event.sessionId || "--"}
                  </span>
                </div>
              </div>
            </div>

            {/* Section D: CHANGES (Compact) */}
            <div className={`border rounded-xl p-4 ${cardBg} space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-slate-400" />
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    CHANGES RECORDED ({event.changes?.length || 0})
                  </h5>
                </div>
                {event.changes?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onTabChange("changes")}
                    className="text-xs text-[#D97706] hover:underline font-semibold cursor-pointer"
                  >
                    View Diff Table →
                  </button>
                )}
              </div>

              <AuditLogChangesTable changes={event.changes} compact darkMode={darkMode} />
            </div>

            {/* Section E: ADDITIONAL DETAILS */}
            <div className={`border rounded-xl p-4 ${cardBg} space-y-3`}>
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                ADDITIONAL DETAILS & METADATA
              </h5>

              <div className="space-y-2 text-xs">
                {event.metadata?.reason && (
                  <div>
                    <span className={`font-semibold ${subText}`}>Reason / Justification: </span>
                    <span className={monoText}>{event.metadata.reason}</span>
                  </div>
                )}
                <div>
                  <span className={`font-semibold ${subText}`}>Environment: </span>
                  <span className="font-mono text-slate-500">
                    {event.environment || "Production"}
                  </span>
                </div>
                <div>
                  <span className={`font-semibold ${subText}`}>Timestamp (UTC): </span>
                  <span className="font-mono text-slate-500">
                    {event.timestamp} ({event.formattedTime})
                  </span>
                </div>
                {event.correlationId && (
                  <div>
                    <span className={`font-semibold ${subText}`}>Correlation ID: </span>
                    <span className="font-mono text-slate-500">{event.correlationId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHANGES */}
        {activeTab === "changes" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h5 className={`text-sm font-bold ${headingText}`}>Field Change Diff</h5>
                <p className={`text-xs ${subText} mt-0.5`}>
                  Before and after state values captured at execution time.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-400">
                {event.changes?.length || 0} fields modified
              </span>
            </div>

            <AuditLogChangesTable changes={event.changes} darkMode={darkMode} />
          </div>
        )}

        {/* TAB 3: CONTEXT */}
        {activeTab === "context" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h5 className={`text-sm font-bold ${headingText}`}>Contextual Telemetry</h5>
              <p className={`text-xs ${subText} mt-0.5`}>
                Network origin, system user agents, and tracing correlation identifiers.
              </p>
            </div>

            <div className={`border rounded-xl divide-y ${cardBg} ${darkMode ? "divide-[#30363D]" : "divide-slate-100"}`}>
              {/* IP Address */}
              <div className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className={`font-semibold ${headingText}`}>IP Address</div>
                  <div className="font-mono text-slate-400 mt-0.5">{event.ipAddress || "--"}</div>
                </div>
                {event.ipAddress && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(event.ipAddress, "ip")}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Copy IP Address"
                  >
                    {copiedKey === "ip" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* User Agent */}
              <div className="p-3.5 flex items-start justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1">
                  <div className={`font-semibold ${headingText}`}>User Agent</div>
                  <div className="font-mono text-[11px] text-slate-400 break-all mt-0.5">
                    {event.userAgent || "--"}
                  </div>
                </div>
                {event.userAgent && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(event.userAgent, "ua")}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
                    title="Copy User Agent"
                  >
                    {copiedKey === "ua" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Session ID */}
              <div className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className={`font-semibold ${headingText}`}>Session ID</div>
                  <div className="font-mono text-slate-400 mt-0.5">{event.sessionId || "--"}</div>
                </div>
                {event.sessionId && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(event.sessionId, "sess")}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Copy Session ID"
                  >
                    {copiedKey === "sess" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Correlation ID */}
              <div className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className={`font-semibold ${headingText}`}>Correlation ID</div>
                  <div className="font-mono text-slate-400 mt-0.5">{event.correlationId || "--"}</div>
                </div>
                {event.correlationId && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(event.correlationId, "corr")}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Copy Correlation ID"
                  >
                    {copiedKey === "corr" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Operation ID */}
              <div className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className={`font-semibold ${headingText}`}>Operation ID</div>
                  <div className="font-mono text-slate-400 mt-0.5">{event.operationId || "--"}</div>
                </div>
                {event.operationId && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(event.operationId, "op")}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Copy Operation ID"
                  >
                    {copiedKey === "op" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {/* Raw JSON viewer */}
            <div className={`border rounded-xl p-4 ${cardBg} space-y-2`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold">Raw Event Payload</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(JSON.stringify(event, null, 2), "raw_json")}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "raw_json" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" /> Copied JSON
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy JSON
                    </>
                  )}
                </button>
              </div>

              <pre
                className={`p-3 rounded-lg text-[10px] font-mono overflow-x-auto max-h-56 custom-scrollbar ${
                  darkMode ? "bg-[#090D12] text-slate-300" : "bg-slate-900 text-slate-200"
                }`}
              >
                {JSON.stringify(event, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: RELATED EVENTS */}
        {activeTab === "related" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h5 className={`text-sm font-bold ${headingText}`}>Related Audit Events</h5>
              <p className={`text-xs ${subText} mt-0.5`}>
                Events sharing correlation ID, batch operation ID, or the same actor and target.
              </p>
            </div>

            {relatedEvents.length === 0 ? (
              <div
                className={`border rounded-xl p-6 text-center text-xs ${
                  darkMode
                    ? "border-[#30363D] bg-[#0D1117] text-slate-400"
                    : "border-slate-200 bg-slate-50/50 text-slate-500"
                }`}
              >
                <Info className="w-5 h-5 mx-auto mb-2 text-slate-400 opacity-60" />
                No correlated events found for this audit record.
              </div>
            ) : (
              <div className="space-y-2.5">
                {relatedEvents.map((rel) => {
                  const relResult = getResultBadgeClasses(rel.result, darkMode);
                  return (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelatedEvent && onSelectRelatedEvent(rel)}
                      className={`border rounded-xl p-3.5 transition-all cursor-pointer hover:border-amber-500/80 shadow-2xs ${cardBg}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold border uppercase ${relResult}`}
                            >
                              {rel.result}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {rel.id}
                            </span>
                          </div>
                          <div className={`text-xs font-bold mt-1 truncate ${headingText}`}>
                            {rel.actionLabel || rel.action}
                          </div>
                          <div className={`text-[11px] ${subText} mt-0.5 truncate`}>
                            Actor: <strong>{rel.actorName}</strong> → Target: {rel.targetName}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[10px] font-mono text-slate-400">
                            {formatRelativeTime(rel.timestamp)}
                          </div>
                          <span className="inline-flex items-center text-[11px] text-[#D97706] font-semibold mt-2 hover:underline">
                            Inspect →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}
