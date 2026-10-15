import React, { useState } from "react";
import {
  RefreshCw,
  Copy,
  Check,
  Key,
} from "lucide-react";
import { useToast } from "../../../hooks/useToast";

export default function IntegrationsApiSettingsForm({
  integrations = [],
  _onUpdateIntegrations,
  onSave,
  onReset,
  _isDirty = false,
  isSaving = false,
  darkMode = false,
}) {
  const { addToast } = useToast();
  const [testingId, setTestingId] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleTestConnection = (intItem) => {
    setTestingId(intItem.id);
    setTimeout(() => {
      setTestingId(null);
      addToast(
        `Connection verified for ${intItem.name}. Health: ${intItem.health}% (${intItem.latency})`,
        "success"
      );
    }, 800);
  };

  const handleCopyKey = (keyString) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(keyString);
      setCopiedKey(keyString);
      setTimeout(() => setCopiedKey(null), 1500);
      addToast("Copied masked API identifier.", "info");
    }
  };

  const cardSurface = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90 shadow-2xs";

  const subCardSurface = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/70 border-slate-200/80";

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 transition-colors space-y-7 ${cardSurface}`}>
      <div>
        <h2
          className={`text-lg font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-[#0B192C]"
          }`}
        >
          Integrations & API Connectors
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage partner credentials, webhook callbacks, and test connector latency.
        </p>
      </div>

      <div className="space-y-3.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Configured Connectors ({integrations.length})
        </span>

        <div className="space-y-3">
          {integrations.map((item) => {
            const isTesting = testingId === item.id;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border space-y-3 transition-colors ${subCardSurface}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#21262D] border border-slate-200 dark:border-[#30363D] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-xs font-bold ${
                            darkMode ? "text-white" : "text-[#0B192C]"
                          }`}
                        >
                          {item.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold border border-slate-200 dark:border-slate-700">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 break-all">
                        {item.endpoint}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === "Connected"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === "Connected" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      <span>{item.status}</span>
                    </span>

                    <button
                      type="button"
                      disabled={isTesting}
                      onClick={() => handleTestConnection(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        darkMode
                          ? "bg-[#21262D] border-[#30363D] hover:bg-[#30363D] text-slate-200"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-2xs"
                      }`}
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${
                          isTesting ? "text-amber-500 animate-spin" : "text-slate-400"
                        }`}
                      />
                      <span>{isTesting ? "Pinging..." : "Test Ping"}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/50 dark:border-[#30363D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-400 text-[11px]">API Key:</span>
                    <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {item.apiKeyMasked}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyKey(item.apiKeyMasked)}
                      className="text-slate-400 hover:text-amber-500 p-0.5 cursor-pointer"
                      title="Copy identifier"
                    >
                      {copiedKey === item.apiKeyMasked ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span>Latency: <strong className="text-slate-700 dark:text-slate-300">{item.latency}</strong></span>
                    <span>•</span>
                    <span>Health: <strong className="text-emerald-600 dark:text-emerald-400">{item.health}%</strong></span>
                    <span>•</span>
                    <span>Checked {item.lastPing}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-200/70 dark:border-[#30363D] flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onReset}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
            darkMode
              ? "bg-[#21262D] border-[#30363D] text-slate-300 hover:text-white"
              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0B192C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Integrations"}
        </button>
      </div>
    </div>
  );
}
