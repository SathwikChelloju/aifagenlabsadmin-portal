import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, ArrowUpRight, RefreshCw } from "lucide-react";
import { mockStore } from "../../../mocks/mockStore";
import { useToast } from "../../../hooks/useToast";

export default function JobHealthCard({ health, darkMode }) {
  const [isRestarting, setIsRestarting] = useState(false);
  const { addToast } = useToast();

  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const badgeBg = darkMode
    ? "bg-[#0D1117] border-[#30363D] text-slate-300"
    : "bg-slate-100 border-slate-200 text-slate-700";

  const handleRestartStalledScrapers = async () => {
    if (isRestarting) return;

    // Identify stalled / error sources directly from store state
    const currentSources = mockStore.getState().jobSources || [];
    const stalled = currentSources.filter(
      (s) =>
        s.status === "Error" ||
        s.status === "Stalled" ||
        s.status === "Failed" ||
        (s.note && s.note.toLowerCase().includes("stalled"))
    );

    if (stalled.length === 0) {
      addToast("No stalled scrapers found. All active scrapers are running normally.", "info");
      return;
    }

    try {
      setIsRestarting(true);
      const names = stalled.map((s) => s.name).join(", ");
      addToast(`Restarting ${stalled.length} stalled scraper(s): ${names}...`, "info");

      // Realistic asynchronous recovery simulation
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const result = mockStore.restartStalledScrapers();

      if (result.restartedCount > 0) {
        addToast(
          `Scraper restart completed successfully. ${result.restartedCount} scraper(s) recovered and resumed polling.`,
          "success"
        );
      } else {
        addToast("No stalled scrapers were eligible for restart.", "info");
      }
    } catch {
      addToast("Failed to complete simulated scraper restart.", "error");
    } finally {
      setIsRestarting(false);
    }
  };

  return (
    <div
      className={`border rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-colors h-full ${cardBg}`}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-base font-bold ${headingText}`}>
            Global Job Ingestion
          </h3>
          <span
            className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${badgeBg}`}
          >
            Workers Active
          </span>
        </div>
        <p className={`text-xs ${subText} mb-4`}>
          Automated abroad portals collecting international employment listings.
        </p>

        <div className="space-y-3">
          {health.sourcesList.map((src) => {
            const isProblem = src.status !== "Working";
            return (
              <div
                key={src.name}
                className={`p-3.5 rounded-2xl border text-xs transition-colors ${
                  isProblem
                    ? "bg-amber-500/10 border-amber-500/30"
                    : darkMode
                      ? "bg-[#0D1117] border-[#30363D]"
                      : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${headingText}`}>
                    {src.name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isProblem
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {isProblem ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    {src.status}
                  </span>
                </div>
                <div
                  className={`mt-2 flex items-center justify-between text-[11px] font-mono ${subText}`}
                >
                  <span>Latency: {src.latency}</span>
                  <span>+{src.jobs24h} jobs / 24h</span>
                </div>
                {src.note && (
                  <div className="mt-2 text-[11px] text-amber-800 font-medium bg-amber-100/70 p-1.5 rounded-lg border border-amber-200/50">
                    Alert: {src.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleRestartStalledScrapers}
        disabled={isRestarting}
        className={`mt-5 w-full py-2.5 bg-[#0B192C] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
          isRestarting ? "opacity-75 cursor-not-allowed" : "active:scale-95"
        }`}
      >
        {isRestarting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            <span>Restarting Scrapers...</span>
          </>
        ) : (
          <>
            <span>Restart Stalled Scrapers</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </>
        )}
      </button>
    </div>
  );
}
