import React from "react";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

/**
 * Universal ErrorAlert Primitive
 * Matches warning banners and crawler incident badges.
 */
export default function ErrorAlert({
  title,
  message,
  variant = "warning",
  className = "",
  children,
}) {
  const variantClasses = {
    warning:
      "bg-amber-50/80 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-800/60 dark:text-amber-200",
    danger:
      "bg-rose-50/80 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:border-rose-800/60 dark:text-rose-200",
    info:
      "bg-blue-50/80 border-blue-200 text-blue-900 dark:bg-blue-950/20 dark:border-blue-800/60 dark:text-blue-200",
  };

  const icons = {
    warning: AlertTriangle,
    danger: AlertCircle,
    info: Info,
  };

  const Icon = icons[variant] || AlertTriangle;

  return (
    <div
      className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 transition-colors ${
        variantClasses[variant] || variantClasses.warning
      } ${className}`}
    >
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0">
        {title && <div className="font-bold leading-tight mb-0.5">{title}</div>}
        {message && <div className="font-medium leading-relaxed opacity-90">{message}</div>}
        {children}
      </div>
    </div>
  );
}
