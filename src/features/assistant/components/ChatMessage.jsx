import React, { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import StructuredResults from "./StructuredResults";

/**
 * ChatMessage Component
 * Renders user and assistant bubbles with 14-15px typography and clear contrast.
 */
export default function ChatMessage({ message, darkMode = false }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === "user";

  const handleCopy = () => {
    if (!message.text) return;
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const formatText = (text = "") => {
    if (!text) return null;

    // Convert **bold**, `code`, and [links](url) into HTML spans safely
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-200/90 dark:bg-[#30363D] text-[13px] font-mono text-amber-700 dark:text-amber-300 font-semibold">$1</code>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-amber-600 dark:text-amber-400 underline hover:text-amber-500 font-semibold inline-flex items-center gap-1">$1</a>');

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-in fade-in slide-in-from-bottom-2 duration-150">
        <div className="max-w-[85%] rounded-2xl rounded-tr-xs px-4 py-3 bg-[#0B192C] text-white dark:bg-[#21262D] dark:text-slate-100 shadow-xs border border-transparent dark:border-[#30363D]">
          <p className="text-[14px] sm:text-[15px] leading-relaxed break-words font-medium">
            {message.text}
          </p>
          <span className="block text-[12px] text-slate-400 dark:text-slate-400 text-right mt-1.5 font-mono">
            {message.timestamp
              ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : ""}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-5 animate-in fade-in slide-in-from-bottom-2 duration-150 group">
      {/* Assistant Avatar */}
      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Message Bubble Container */}
        <div
          className={`rounded-2xl rounded-tl-xs p-4 border text-[14px] sm:text-[15px] shadow-2xs transition-colors ${
            message.isError
              ? "bg-rose-50/80 border-rose-300 text-rose-950 dark:bg-rose-950/25 dark:border-rose-900/50 dark:text-rose-100"
              : darkMode
              ? "bg-[#161B22] border-[#30363D] text-slate-100"
              : "bg-white border-slate-200/90 text-slate-800"
          }`}
        >
          {message.title && (
            <div className="text-[13px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5">
              {message.title}
            </div>
          )}

          <div className="leading-relaxed break-words space-y-2.5">
            {message.text && (
              <div className="text-[14px] sm:text-[15px] leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                {formatText(message.text)}
              </div>
            )}

            {/* Embedded Structured Results */}
            {message.structured && (
              <StructuredResults structured={message.structured} darkMode={darkMode} />
            )}
          </div>

          {/* Bottom Info Bar: Timestamp, AI Engine Tag & Copy */}
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 dark:border-[#21262D] text-[12px] text-slate-400 dark:text-slate-400 font-mono gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span>
                {message.timestamp
                  ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "Now"}
              </span>

              {message.aiMetadata && (
                <span
                  title={message.aiMetadata.notice || message.aiMetadata.reasoning || "AI Interpreter Engine"}
                  className={`px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-sans font-medium border ${
                    message.aiMetadata.provider === "gemini"
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25"
                      : message.aiMetadata.provider === "groq"
                      ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25"
                      : "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/25"
                  }`}
                >
                  {message.aiMetadata.model || "Deterministic NLU"}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 opacity-75 hover:opacity-100 transition-opacity cursor-pointer px-1.5 py-0.5 rounded text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              title="Copy response"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
