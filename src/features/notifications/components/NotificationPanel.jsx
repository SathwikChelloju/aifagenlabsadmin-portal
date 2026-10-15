import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCheck,
  X,
  RotateCcw,
  ShieldCheck,
  Inbox,
  CheckCircle2,
} from "lucide-react";
import NotificationItem from "./NotificationItem";

export default function NotificationPanel({
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onUndoDismiss,
  canUndo = false,
  onNavigate,
  onClose,
  darkMode = false,
}) {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'unread' | 'critical'
  const panelRef = useRef(null);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    // Delay slightly to prevent immediate closing on initial bell toggle click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Filter notifications
  const criticalCount = notifications.filter((n) => n.severity === "critical").length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "critical") return n.severity === "critical";
    return true;
  });

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Notifications Center"
      className={`absolute right-0 top-full mt-2 w-[390px] sm:w-[450px] max-w-[calc(100vw-24px)] rounded-2xl border shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-150 animate-in fade-in slide-in-from-top-2 ${
        darkMode
          ? "bg-[#0D1117] border-[#30363D] text-slate-100 shadow-black/80"
          : "bg-white border-slate-200 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.15)]"
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3.5 border-b flex items-center justify-between gap-3 ${
          darkMode ? "border-[#30363D] bg-[#161B22]/80" : "border-slate-100 bg-slate-50/60"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold tracking-tight">Notifications</h3>
              {unreadCount > 0 && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    darkMode
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              System alerts & operational updates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                darkMode
                  ? "text-slate-300 hover:text-white hover:bg-[#21262D]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-xl text-slate-400 transition-colors cursor-pointer ${
              darkMode ? "hover:text-white hover:bg-[#21262D]" : "hover:text-slate-900 hover:bg-slate-100"
            }`}
            aria-label="Close notification panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`px-3 py-2 border-b flex items-center gap-1.5 ${
          darkMode ? "border-[#30363D] bg-[#090D12]/50" : "border-slate-100 bg-white"
        }`}
      >
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "all"
              ? darkMode
                ? "bg-[#21262D] text-white border border-[#30363D]"
                : "bg-slate-100 text-slate-900 border border-slate-200/80 shadow-2xs"
              : darkMode
              ? "text-slate-400 hover:text-slate-200"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span>All</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              darkMode ? "bg-[#161B22] text-slate-300" : "bg-white text-slate-600"
            }`}
          >
            {notifications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("unread")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "unread"
              ? darkMode
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs"
              : darkMode
              ? "text-slate-400 hover:text-slate-200"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span>Unread</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              activeTab === "unread"
                ? darkMode
                  ? "bg-amber-500/30 text-amber-200"
                  : "bg-amber-100 text-amber-800"
                : darkMode
                ? "bg-[#161B22] text-slate-300"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {unreadCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("critical")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "critical"
              ? darkMode
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs"
              : darkMode
              ? "text-slate-400 hover:text-slate-200"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span>Critical</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              activeTab === "critical"
                ? darkMode
                  ? "bg-rose-500/30 text-rose-200"
                  : "bg-rose-100 text-rose-800"
                : darkMode
                ? "bg-[#161B22] text-slate-300"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {criticalCount}
          </span>
        </button>
      </div>

      {/* Undo Notification Banner */}
      {canUndo && (
        <div
          className={`px-4 py-2 text-xs flex items-center justify-between border-b animate-in fade-in ${
            darkMode
              ? "bg-[#161B22] border-[#30363D] text-slate-300"
              : "bg-amber-50/60 border-amber-200/80 text-amber-900"
          }`}
        >
          <span className="truncate">Notification dismissed</span>
          <button
            type="button"
            onClick={onUndoDismiss}
            className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-h-[460px] overflow-y-auto custom-scrollbar divide-y divide-transparent">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkAsRead={onMarkAsRead}
              onDismiss={onDismiss}
              onNavigate={(route, entityId) => {
                onClose();
                onNavigate(route, entityId);
              }}
              darkMode={darkMode}
            />
          ))
        ) : (
          /* Empty States */
          <div className="py-12 px-6 text-center space-y-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
                darkMode ? "bg-[#161B22] text-slate-400" : "bg-slate-100 text-slate-500"
              }`}
            >
              {activeTab === "unread" ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              ) : activeTab === "critical" ? (
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              ) : (
                <Inbox className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {activeTab === "unread"
                  ? "All caught up!"
                  : activeTab === "critical"
                  ? "No critical alerts"
                  : "No notifications"}
              </h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                {activeTab === "unread"
                  ? "There are no unread notifications in your inbox."
                  : activeTab === "critical"
                  ? "All mission-critical systems and feeds are operating normally."
                  : "You have dismissed or cleared all notifications."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`px-4 py-2.5 border-t text-[11px] flex items-center justify-between ${
          darkMode ? "border-[#30363D] bg-[#161B22]/50 text-slate-400" : "border-slate-100 bg-slate-50 text-slate-500"
        }`}
      >
        <span className="font-mono">AIFA GEN LABS Console</span>
        <button
          type="button"
          onClick={() => {
            onClose();
            onNavigate("audit-logs");
          }}
          className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
        >
          View Audit History →
        </button>
      </div>
    </div>
  );
}
