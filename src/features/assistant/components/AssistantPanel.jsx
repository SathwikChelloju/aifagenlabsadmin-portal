import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Loader2,
  ArrowUp,
  MapPin,
  Mic,
  MessageSquare,
  Square,
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import SuggestedPrompts from "./SuggestedPrompts";
import VoiceInterface from "./VoiceInterface";
import Tooltip from "../../../components/ui/Tooltip";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";

/**
 * AssistantPanel Component
 * Main floating conversational interface for the AI Admin Assistant.
 * Supports seamless Chat and Voice modes:
 * - [ Chat ] mode: Typed questions with suggested prompts and input box.
 * - [ Voice ] mode: Web Speech input, speech recognition transcript, and spoken responses.
 * Reuses the existing message-submission pipeline and preserves conversation history across mode switches.
 */
export default function AssistantPanel({
  isOpen = false,
  isExpanded = false,
  onClose,
  onToggleExpanded,
  messages = [],
  isProcessing = false,
  onSendMessage,
  onClearHistory,
  activePage = "dashboard",
  darkMode = false,
}) {
  const [inputText, setInputText] = useState("");
  const chatScrollRef = useRef(null);
  const textareaRef = useRef(null);

  // Hook for voice input and speech synthesis
  const {
    mode,
    setMode: handleModeChange,
    voiceStatus,
    transcript,
    voiceError,
    isRecognitionSupported,
    isListening,
    isSpeaking,
    isProcessingQuery,
    startListening,
    stopListening,
    stopSpeaking,
    clearVoiceError,
    spokenResponse,
  } = useVoiceAssistant({
    messages,
    isProcessing,
    onSendMessage,
    isOpen,
  });

  // Auto-scroll to bottom on new messages or loading state (in Chat mode)
  useEffect(() => {
    if (chatScrollRef.current && mode === "chat") {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isProcessing, mode]);

  // Focus textarea when panel opens in Chat mode
  useEffect(() => {
    if (isOpen && mode === "chat") {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  // Determine if user has already asked a question in this conversation
  const hasUserMessages = messages.some((m) => m.sender === "user");

  const submitQuestion = (e) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    const trimmed = inputText.trim();
    if (!trimmed || isProcessing) return;

    setInputText("");
    onSendMessage(trimmed);
  };

  const handleKeyDown = (e) => {
    // Isolate keyboard events so they never bubble to global shortcuts
    e.stopPropagation();

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitQuestion(e);
    }
  };

  const handleSelectSuggestion = (prompt) => {
    if (isProcessing) return;
    onSendMessage(prompt);
  };

  const handleClearChat = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    stopSpeaking();
    stopListening();
    onClearHistory();
    setInputText("");
    if (mode === "chat") {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const handleClose = () => {
    stopSpeaking();
    stopListening();
    onClose?.();
  };

  // Capitalize active page name for context badge
  const pageLabel = (activePage || "dashboard")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      role="dialog"
      aria-labelledby="assistant-title"
      className={`assistant-scope fixed z-50 transition-all duration-200 ease-out flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
        isExpanded
          ? "bottom-4 right-4 sm:right-6 w-[760px] max-w-[calc(100vw-2rem)] h-[760px] max-h-[calc(100vh-2rem)]"
          : "bottom-22 right-4 sm:right-6 w-[460px] max-w-[calc(100vw-2rem)] h-[640px] max-h-[calc(100vh-6.5rem)]"
      } ${
        darkMode
          ? "bg-[#0D1117] border-[#30363D] text-slate-100 shadow-black/70"
          : "bg-white border-slate-200 text-slate-900 shadow-slate-900/25"
      }`}
    >
      {/* 1. HEADER (Fixed at top) */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between gap-3 shrink-0 select-none ${
          darkMode
            ? "bg-[#161B22] border-[#30363D]"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-4.5 h-4.5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3
                id="assistant-title"
                className="text-[16px] sm:text-[17px] font-extrabold tracking-tight truncate text-slate-900 dark:text-white"
              >
                AI Admin Assistant
              </h3>

              {/* Active Route Context Badge */}
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 truncate">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{pageLabel}</span>
              </span>
            </div>

            <p className="text-[13px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
              Your intelligent admin helper
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <Tooltip content="Delete chat (Reset to initial state)" position="bottom">
            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-[#21262D] transition-colors cursor-pointer"
              aria-label="Delete chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip content={isExpanded ? "Collapse panel" : "Expand panel"} position="bottom">
            <button
              type="button"
              onClick={onToggleExpanded}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#21262D] transition-colors cursor-pointer"
              aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </Tooltip>

          <Tooltip content="Close assistant" position="bottom">
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#21262D] transition-colors cursor-pointer"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* 2. MODE SELECTOR: [ Chat ] [ Voice ] */}
      <div
        className={`px-4 py-2 border-b flex items-center justify-between shrink-0 select-none ${
          darkMode
            ? "bg-[#0D1117] border-[#30363D]"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D]">
          <button
            type="button"
            onClick={() => handleModeChange("chat")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === "chat"
                ? "bg-white dark:bg-[#21262D] text-slate-900 dark:text-white shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("voice")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === "voice"
                ? "bg-[#D97706] text-white shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice</span>
          </button>
        </div>

        {mode === "voice" && isSpeaking && (
          <button
            type="button"
            onClick={stopSpeaking}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-xs font-medium hover:bg-rose-100 cursor-pointer transition-colors"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop Speaking</span>
          </button>
        )}
      </div>

      {/* 3. BODY VIEW: SWITCHES BETWEEN CHAT AND VOICE MODE */}
      {mode === "voice" ? (
        <VoiceInterface
          voiceStatus={voiceStatus}
          transcript={transcript}
          spokenResponse={spokenResponse}
          voiceError={voiceError}
          isListening={isListening}
          isSpeaking={isSpeaking}
          isProcessingQuery={isProcessingQuery}
          isRecognitionSupported={isRecognitionSupported}
          onStartListening={startListening}
          onStopListening={stopListening}
          onStopSpeaking={stopSpeaking}
          onSwitchToChat={() => handleModeChange("chat")}
          onClearError={clearVoiceError}
          messages={messages}
          darkMode={darkMode}
        />
      ) : (
        <>
          {/* CHAT SCROLL AREA */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 text-[14px]"
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} darkMode={darkMode} />
            ))}

            {/* Suggested Prompts before first question */}
            {!hasUserMessages && (
              <div className="pt-1 pb-2">
                <SuggestedPrompts
                  onSelectPrompt={handleSelectSuggestion}
                  disabled={isProcessing}
                  darkMode={darkMode}
                />
              </div>
            )}

            {/* Processing Loading Indicator */}
            {isProcessing && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl rounded-tl-xs bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] w-fit max-w-[85%] text-slate-600 dark:text-slate-300 text-[13px] animate-pulse">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                <span className="font-mono">
                  Querying platform telemetry & executing tools...
                </span>
              </div>
            )}
          </div>

          {/* CHAT INPUT AREA */}
          <div
            className={`p-3.5 border-t shrink-0 ${
              darkMode
                ? "bg-[#161B22] border-[#30363D]"
                : "bg-white border-slate-200"
            }`}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                submitQuestion(e);
              }}
              className="relative flex items-end gap-2.5"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                placeholder="Ask about users, recruiters, jobs, AI costs..."
                className={`flex-1 resize-none max-h-28 py-2.5 px-3.5 rounded-xl text-[14px] sm:text-[15px] focus:outline-none transition-colors border leading-relaxed font-normal ${
                  darkMode
                    ? "bg-[#0D1117] border-[#30363D] text-slate-100 placeholder-slate-500 focus:border-amber-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500"
                }`}
              />

              <button
                type="button"
                onClick={submitQuestion}
                disabled={!inputText.trim() || isProcessing}
                className="w-10 h-10 rounded-xl bg-[#0B192C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs active:scale-95"
                title="Send query (Enter)"
                aria-label="Send query"
              >
                {isProcessing ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin text-amber-400 dark:text-amber-600" />
                ) : (
                  <ArrowUp className="w-4.5 h-4.5 text-amber-400 dark:text-amber-600 font-bold" />
                )}
              </button>
            </form>

            <div className="flex items-center justify-between text-[12px] text-slate-500 dark:text-slate-400 mt-2 px-1 font-mono">
              <span>Enter ↵ to send · Shift+Enter for newline</span>
              <button
                type="button"
                onClick={() => handleModeChange("voice")}
                className="text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1 font-sans cursor-pointer"
              >
                <Mic className="w-3 h-3" />
                <span>Switch to Voice</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
