import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Universal Drawer Primitive (Slide-out inspection panel)
 * Slides in from the right for candidate details, AI request payloads, and audit diffs.
 */
export default function Drawer({
  isOpen,
  onClose,
  title,
  description,
  customHeader,
  children,
  footer,
  width = "max-w-md sm:max-w-lg",
  className = "",
  contentClassName = "p-6",
  darkMode = false,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const panelBg = darkMode
    ? "bg-[#161B22] border-[#30363D] text-white"
    : "bg-white border-slate-200 text-slate-900";

  const headerBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200";

  const footerBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200";

  const closeBtnClass = darkMode
    ? "text-slate-400 hover:text-white hover:bg-[#21262D]"
    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full ${width} h-full ${panelBg} border-l shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200 ${className}`}
      >
        {/* Header */}
        {(title || customHeader) && (
          <div
            className={`p-5 sm:p-6 border-b ${headerBg} flex items-start justify-between gap-3 shrink-0`}
          >
            {customHeader || (
              <div>
                <h4
                  className={`text-base font-extrabold leading-tight ${
                    darkMode ? "text-white" : "text-[#0B192C]"
                  }`}
                >
                  {title}
                </h4>
                {description && (
                  <p
                    className={`text-xs mt-1 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {description}
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className={`p-1 rounded-full transition-colors cursor-pointer shrink-0 ${closeBtnClass}`}
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content body */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${contentClassName}`}>
          {children}
        </div>

        {/* Optional footer */}
        {footer && (
          <div
            className={`p-4 sm:p-5 border-t ${footerBg} shrink-0 relative z-20`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
