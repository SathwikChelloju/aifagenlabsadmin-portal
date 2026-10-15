import React, { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Check,
  X,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/**
 * Returns icon and styling for severity level
 */
const getSeverityConfig = (severity, darkMode) => {
  switch (severity) {
    case "critical":
      return {
        icon: AlertCircle,
        label: "Critical",
        badgeClass: darkMode
          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
          : "bg-rose-50 text-rose-700 border border-rose-200",
        iconClass: "text-rose-500",
        dotClass: "bg-rose-500",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        label: "Warning",
        badgeClass: darkMode
          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
          : "bg-amber-50 text-amber-700 border border-amber-200",
        iconClass: "text-amber-500",
        dotClass: "bg-amber-500",
      };
    case "success":
      return {
        icon: CheckCircle2,
        label: "Success",
        badgeClass: darkMode
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          : "bg-emerald-50 text-emerald-700 border border-emerald-200",
        iconClass: "text-emerald-500",
        dotClass: "bg-emerald-500",
      };
    case "info":
    default:
      return {
        icon: Info,
        label: "Info",
        badgeClass: darkMode
          ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
          : "bg-blue-50 text-blue-700 border border-blue-200",
        iconClass: "text-blue-500",
        dotClass: "bg-blue-500",
      };
  }
};

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDismiss,
  onNavigate,
  darkMode = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const severityConfig = getSeverityConfig(notification.severity, darkMode);
  const Icon = severityConfig.icon;

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onNavigate && notification.route) {
      onNavigate(notification.route, notification.relatedEntityId);
    }
  };

  const handleToggleRead = (e) => {
    e.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    if (onDismiss) {
      onDismiss(notification.id);
    }
  };

  return (
    <div
      className={`group relative p-3.5 transition-colors border-b last:border-b-0 ${
        darkMode ? "border-[#30363D]/60" : "border-slate-100"
      } ${
        !notification.isRead
          ? darkMode
            ? "bg-[#161B22]/60 hover:bg-[#161B22]"
            : "bg-amber-500/[0.03] hover:bg-slate-50"
          : darkMode
          ? "hover:bg-[#161B22]/40 opacity-85 hover:opacity-100"
          : "hover:bg-slate-50/80 opacity-90 hover:opacity-100"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Severity Icon */}
        <div
          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${severityConfig.badgeClass}`}
        >
          <Icon className="w-4 h-4 shrink-0" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Pill */}
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                darkMode
                  ? "bg-[#21262D] text-slate-300 border border-[#30363D]"
                  : "bg-slate-100 text-slate-600 border border-slate-200/80"
              }`}
            >
              {notification.category}
            </span>

            {/* Severity Pill */}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${severityConfig.badgeClass}`}
            >
              {severityConfig.label}
            </span>

            {/* Timestamp */}
            <span className="text-[11px] text-slate-400 font-medium ml-auto">
              {notification.timestamp}
            </span>

            {/* Unread dot */}
            {!notification.isRead && (
              <span
                className="w-2 h-2 rounded-full bg-[#D97706] shrink-0 animate-pulse"
                title="Unread notification"
              />
            )}
          </div>

          {/* Title & Click to expand */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left group/title focus:outline-hidden"
          >
            <div className="flex items-center justify-between gap-1">
              <h4
                className={`text-xs leading-snug line-clamp-1 transition-colors ${
                  !notification.isRead
                    ? darkMode
                      ? "font-bold text-white group-hover/title:text-amber-400"
                      : "font-bold text-slate-900 group-hover/title:text-amber-600"
                    : darkMode
                    ? "font-semibold text-slate-300 group-hover/title:text-white"
                    : "font-semibold text-slate-700 group-hover/title:text-slate-900"
                }`}
              >
                {notification.title}
              </h4>
              <span className="text-slate-400 group-hover/title:text-slate-200">
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                )}
              </span>
            </div>
          </button>

          {/* Description */}
          <p
            className={`text-xs leading-relaxed ${
              isExpanded ? "line-clamp-none" : "line-clamp-2"
            } ${darkMode ? "text-slate-400" : "text-slate-600"}`}
          >
            {notification.description}
          </p>

          {/* Expanded extra metadata */}
          {isExpanded && notification.relatedEntityId && (
            <div
              className={`pt-1.5 pb-0.5 text-[11px] font-mono flex items-center gap-2 ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              <span>ID: {notification.relatedEntityId}</span>
              <span>•</span>
              <span>
                {new Date(notification.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-1.5 flex items-center justify-between gap-2">
            {/* Primary Context Navigation Action */}
            {notification.actionLabel && notification.route ? (
              <button
                type="button"
                onClick={handleActionClick}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  darkMode
                    ? "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100/80 border border-amber-200/80 shadow-2xs"
                }`}
              >
                <span>{notification.actionLabel}</span>
                <ArrowUpRight className="w-3 h-3 shrink-0" />
              </button>
            ) : <div />}

            {/* Quick Actions (Mark Read & Dismiss) */}
            <div className="flex items-center gap-1">
              {!notification.isRead && (
                <button
                  type="button"
                  onClick={handleToggleRead}
                  className={`p-1 rounded-lg text-xs font-medium transition-colors ${
                    darkMode
                      ? "text-slate-400 hover:text-emerald-400 hover:bg-[#21262D]"
                      : "text-slate-400 hover:text-emerald-600 hover:bg-slate-100"
                  }`}
                  title="Mark as read"
                  aria-label="Mark as read"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={handleDismiss}
                className={`p-1 rounded-lg text-xs font-medium transition-colors ${
                  darkMode
                    ? "text-slate-400 hover:text-rose-400 hover:bg-[#21262D]"
                    : "text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                }`}
                title="Dismiss notification"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
