import React, { useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { ToastContext } from "../../context/ToastContext";

/**
 * Universal Toast Notification Provider & Component
 * Dispatches ephemeral feedback for actions like refunds, restarts, plan changes.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3500) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success:
      "border-emerald-200 bg-white text-emerald-800 dark:bg-[#161B22] dark:border-emerald-800/60 dark:text-emerald-300",
    warning:
      "border-amber-200 bg-white text-amber-800 dark:bg-[#161B22] dark:border-amber-800/60 dark:text-amber-300",
    error:
      "border-rose-200 bg-white text-rose-800 dark:bg-[#161B22] dark:border-rose-800/60 dark:text-rose-300",
    info:
      "border-blue-200 bg-white text-blue-800 dark:bg-[#161B22] dark:border-blue-800/60 dark:text-blue-300",
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const Icon = icons[t.type] || CheckCircle2;
          return (
            <div
              key={t.id}
              className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 ${
                colors[t.type] || colors.success
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 min-w-0 leading-tight">{t.message}</span>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="opacity-60 hover:opacity-100 p-0.5 rounded cursor-pointer transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
