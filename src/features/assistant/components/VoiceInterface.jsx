import React from "react";
import {
  Mic,
  Square,
  Loader2,
  Volume2,
  AlertCircle,
  RotateCcw,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { createVoiceAgentUtterance } from "../services/voiceService";

/**
 * VoiceInterface Component
 * Voice mode UI for the AI Admin Assistant.
 * Built with accessible controls, restrained orange accents (#D97706),
 * clear listening/thinking/speaking visual states, and conversation synchronization.
 */
export default function VoiceInterface({
  voiceStatus = "idle",
  transcript = "",
  spokenResponse = "",
  voiceError = null,
  voiceSpeed = 0.92,
  onSetVoiceSpeed,
  isListening = false,
  isSpeaking = false,
  isProcessingQuery = false,
  isRecognitionSupported = true,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  onSwitchToChat,
  onClearError,
  messages = [],
  darkMode = false,
}) {
  // Retrieve the latest exchange for display in voice mode
  const latestAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.sender === "assistant");
  const latestUserMessage = [...messages]
    .reverse()
    .find((m) => m.sender === "user");

  return (
    <div className="flex-1 flex flex-col justify-between p-5 min-h-0 overflow-y-auto">
      {/* 1. TOP: LATEST CONVERSATION EXCHANGE PREVIEW */}
      <div className="space-y-3 mb-4">
        {latestUserMessage && (
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-xs px-3.5 py-2.5 bg-[#0B192C] text-white dark:bg-[#21262D] dark:text-slate-100 text-xs sm:text-sm font-medium shadow-xs">
              <span className="text-[10px] text-amber-400 font-mono block mb-0.5">
                Spoken Question
              </span>
              <p>{latestUserMessage.text}</p>
            </div>
          </div>
        )}

        {latestAssistantMessage && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 max-w-[90%]">
              <div
                className={`p-3.5 rounded-2xl rounded-tl-xs border text-xs sm:text-sm ${
                  darkMode
                    ? "bg-[#161B22] border-[#30363D] text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Voice Agent Response
                  </span>
                  {isSpeaking && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-amber-400 animate-pulse font-medium">
                      <Volume2 className="w-3 h-3" /> Speaking...
                    </span>
                  )}
                </div>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {spokenResponse || createVoiceAgentUtterance(latestAssistantMessage)}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-[#30363D]/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Full data recorded on screen
                  </span>
                  <button
                    type="button"
                    onClick={onSwitchToChat}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>View full details in Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. CENTER: VOICE INTERACTION STAGE */}
      <div className="my-auto py-6 flex flex-col items-center justify-center text-center">
        {/* Status Indicator Pill */}
        <div className="mb-6">
          {voiceStatus === "listening" && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-700 dark:text-amber-300 text-xs font-semibold animate-pulse shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#D97706] animate-ping" />
              <span>I'm listening...</span>
            </div>
          )}

          {voiceStatus === "processing" && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs">
              <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}

          {voiceStatus === "speaking" && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-700 dark:text-amber-300 text-xs font-semibold shadow-xs">
              <div className="flex items-center gap-0.5 h-3 px-0.5">
                <span className="w-0.5 h-2 bg-[#D97706] rounded-full animate-pulse" />
                <span className="w-0.5 h-3.5 bg-[#D97706] rounded-full animate-bounce" />
                <span className="w-0.5 h-2 bg-[#D97706] rounded-full animate-pulse" />
                <span className="w-0.5 h-3 bg-[#D97706] rounded-full animate-bounce" />
              </div>
              <span>Speaking response aloud...</span>
            </div>
          )}

          {voiceStatus === "idle" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-slate-400 text-xs font-medium">
              <span>Tap the microphone to speak</span>
            </div>
          )}

          {voiceStatus === "error" && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Voice Notice</span>
            </div>
          )}
        </div>

        {/* Large Central Microphone Button */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Subtle Orange Listening Wave Rings */}
          {isListening && (
            <>
              <div className="absolute w-28 h-28 rounded-full bg-amber-500/20 animate-ping pointer-events-none" />
              <div className="absolute w-36 h-36 rounded-full border border-amber-500/30 animate-pulse pointer-events-none" />
            </>
          )}

          <button
            type="button"
            onClick={() => {
              if (isListening) {
                onStopListening();
              } else if (isSpeaking) {
                onStopSpeaking();
              } else {
                onStartListening();
              }
            }}
            disabled={isProcessingQuery}
            aria-label={
              isListening
                ? "Stop recording"
                : isSpeaking
                ? "Stop speaking"
                : "Tap to speak"
            }
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isListening
                ? "bg-[#D97706] text-white scale-105 shadow-amber-500/40 ring-4 ring-amber-500/30"
                : isSpeaking
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 ring-4 ring-amber-500/25"
                : "bg-amber-500/10 dark:bg-amber-500/15 border-2 border-amber-500/40 text-[#D97706] dark:text-amber-400 hover:bg-[#D97706] hover:text-white hover:scale-105"
            }`}
          >
            {isProcessingQuery ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : isSpeaking ? (
              <Square className="w-7 h-7 fill-current" />
            ) : isListening ? (
              <Mic className="w-8 h-8 animate-pulse" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Real-time Spoken Transcript or Guidance */}
        <div className="max-w-xs min-h-[44px] flex items-center justify-center">
          {transcript ? (
            <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-[#161B22] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#30363D]">
              "{transcript}"
            </p>
          ) : isListening ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Listening for one question...
            </p>
          ) : isSpeaking ? (
            <button
              type="button"
              onClick={onStopSpeaking}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#21262D] dark:hover:bg-[#30363D] text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <Square className="w-3 h-3 fill-current" />
              Stop Speaking
            </button>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ask about candidates, recruiters, jobs, or AI telemetry.
            </p>
          )}
        </div>

        {/* SaaS Voice Cadence Selector */}
        <div className="mt-4 flex items-center justify-center gap-2 select-none">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
            Cadence:
          </span>
          <div className="inline-flex items-center rounded-xl p-0.5 bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D]">
            {[
              { speed: 0.88, label: "0.88x Calm" },
              { speed: 0.92, label: "0.92x Clear" },
              { speed: 1.0, label: "1.0x Normal" },
            ].map((opt) => {
              const isSelected = Math.abs(voiceSpeed - opt.speed) < 0.02;
              return (
                <button
                  key={opt.speed}
                  type="button"
                  onClick={() => onSetVoiceSpeed?.(opt.speed)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white dark:bg-[#21262D] text-[#D97706] dark:text-amber-400 shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                  title={`Set voice reading speed to ${opt.label}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Feedback Banner */}
        {voiceError && (
          <div
            role="alert"
            className="mt-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-200 text-xs leading-relaxed max-w-sm text-left flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{voiceError}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearError?.();
                    onStartListening();
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-900 dark:text-rose-200 font-semibold hover:bg-rose-200 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Try Again
                </button>
                <button
                  type="button"
                  onClick={onSwitchToChat}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 hover:underline cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3" /> Use Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unsupported Browser Warning */}
        {!isRecognitionSupported && (
          <div
            role="alert"
            className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs text-left max-w-sm"
          >
            <p className="font-semibold mb-1">Web Speech API Unavailable</p>
            <p className="text-slate-600 dark:text-slate-300 mb-2">
              Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari, or switch back to Chat mode.
            </p>
            <button
              type="button"
              onClick={onSwitchToChat}
              className="px-3 py-1 rounded-lg bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition cursor-pointer"
            >
              Switch to Chat Mode
            </button>
          </div>
        )}
      </div>

      {/* 3. BOTTOM: HELPER CONTROLS */}
      <div
        className={`pt-3 border-t flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono ${
          darkMode ? "border-[#30363D]" : "border-slate-200"
        }`}
      >
        <span>Natural Voice Engine • {voiceSpeed.toFixed(2)}x Cadence</span>
        <button
          type="button"
          onClick={onSwitchToChat}
          className="text-[#D97706] hover:underline font-sans font-medium cursor-pointer"
        >
          Type a question instead →
        </button>
      </div>
    </div>
  );
}
