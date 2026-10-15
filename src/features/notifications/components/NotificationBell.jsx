import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { notificationService } from "../services/notificationService";
import NotificationPanel from "./NotificationPanel";

export default function NotificationBell({ onNavigate, darkMode = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((list) => {
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.isRead).length);
    });
    return unsubscribe;
  }, []);

  const hasCritical = notifications.some((n) => !n.isRead && n.severity === "critical");

  const badgeText = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 ${
          isOpen
            ? darkMode
              ? "bg-[#21262D] border-amber-500/50 text-amber-400"
              : "bg-amber-50/80 border-amber-300 text-amber-700 shadow-xs"
            : darkMode
            ? "bg-[#161B22] border-[#30363D] text-slate-300 hover:text-white hover:bg-[#21262D] hover:border-slate-600"
            : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs"
        }`}
      >
        <Bell className="w-4 h-4 shrink-0 transition-transform active:scale-95" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-mono font-extrabold text-white rounded-full ring-2 shadow-xs transition-transform ${
              darkMode ? "ring-[#0D1117]" : "ring-white"
            } ${
              hasCritical
                ? "bg-rose-500 animate-pulse"
                : "bg-[#D97706]"
            }`}
          >
            {badgeText}
          </span>
        )}
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={(id) => notificationService.markAsRead(id)}
          onMarkAllAsRead={() => notificationService.markAllAsRead()}
          onDismiss={(id) => notificationService.dismiss(id)}
          onUndoDismiss={() => notificationService.undoLastDismiss()}
          canUndo={notificationService.canUndo()}
          onNavigate={(route, entityId) => {
            setIsOpen(false);
            if (onNavigate) {
              onNavigate(route, entityId);
            }
          }}
          onClose={() => setIsOpen(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
