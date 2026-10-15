import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Universal Modal Primitive
 * Backdrop blur and rounded-3xl dialog container matching audit plan modal.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-md",
  className = "",
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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal dialog box */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full ${maxWidth} bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${className}`}
      >
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-100 dark:border-slate-500/10 gap-3">
          <div>
            <h4 className="text-base font-extrabold text-[#0B192C] dark:text-white leading-tight">
              {title}
            </h4>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
