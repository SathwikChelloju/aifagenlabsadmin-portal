/**
 * Centralized Notification Service / Store
 * AIFA GEN LABS Admin Console
 *
 * Manages notification state, read/unread status, dismissals, and undo actions.
 * Persists changes safely in localStorage with full resilience against
 * quota limits, private mode, and malformed data.
 */

import { INITIAL_NOTIFICATIONS } from "../data/mockNotifications.js";

const STORAGE_KEYS = {
  READ_IDS: "aifa_admin_notifications_read_v1",
  DISMISSED_IDS: "aifa_admin_notifications_dismissed_v1",
  CUSTOM_EVENTS: "aifa_admin_notifications_custom_v1",
};

class NotificationService {
  constructor() {
    this.listeners = new Set();
    this.readIds = this.loadIdSet(STORAGE_KEYS.READ_IDS);
    this.dismissedIds = this.loadIdSet(STORAGE_KEYS.DISMISSED_IDS);
    this.customNotifications = this.loadCustomNotifications();
    this.lastDismissedId = null;
  }

  loadIdSet(key) {
    if (typeof window === "undefined" || !window.localStorage) {
      return new Set();
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? new Set(parsed) : new Set();
    } catch {
      return new Set();
    }
  }

  saveIdSet(key, set) {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(Array.from(set)));
    } catch (e) {
      console.warn("NotificationService storage write error:", e);
    }
  }

  loadCustomNotifications() {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.CUSTOM_EVENTS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveCustomNotifications(list) {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.CUSTOM_EVENTS, JSON.stringify(list));
    } catch (e) {
      console.warn("NotificationService custom notifications storage error:", e);
    }
  }

  notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.getNotifications());
      } catch (err) {
        console.error("Error in notification listener:", err);
      }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // Immediately invoke with current state
    try {
      callback(this.getNotifications());
    } catch (err) {
      console.error("Error invoking initial notification callback:", err);
    }
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Get all active notifications (excluding dismissed ones)
   */
  getNotifications() {
    const combined = [...this.customNotifications, ...INITIAL_NOTIFICATIONS];

    return combined
      .filter((n) => !this.dismissedIds.has(n.id))
      .map((n) => {
        const isRead = this.readIds.has(n.id) || Boolean(n.isRead);
        return {
          ...n,
          isRead,
          readAt: isRead ? n.readAt || new Date().toISOString() : null,
        };
      });
  }

  /**
   * Returns total count of unread notifications
   */
  getUnreadCount() {
    return this.getNotifications().filter((n) => !n.isRead).length;
  }

  /**
   * Mark a single notification as read
   */
  markAsRead(id) {
    if (!id || this.readIds.has(id)) return;
    this.readIds.add(id);
    this.saveIdSet(STORAGE_KEYS.READ_IDS, this.readIds);
    this.notify();
  }

  /**
   * Mark all active notifications as read
   */
  markAllAsRead() {
    const active = this.getNotifications();
    active.forEach((n) => this.readIds.add(n.id));
    this.saveIdSet(STORAGE_KEYS.READ_IDS, this.readIds);
    this.notify();
  }

  /**
   * Dismiss a notification from the active inbox
   */
  dismiss(id) {
    if (!id) return;
    this.dismissedIds.add(id);
    this.lastDismissedId = id;
    this.saveIdSet(STORAGE_KEYS.DISMISSED_IDS, this.dismissedIds);
    this.notify();
  }

  /**
   * Restore the last dismissed notification
   */
  undoLastDismiss() {
    if (!this.lastDismissedId) return false;
    this.dismissedIds.delete(this.lastDismissedId);
    const restoredId = this.lastDismissedId;
    this.lastDismissedId = null;
    this.saveIdSet(STORAGE_KEYS.DISMISSED_IDS, this.dismissedIds);
    this.notify();
    return restoredId;
  }

  /**
   * Check if undo is available
   */
  canUndo() {
    return Boolean(this.lastDismissedId && this.dismissedIds.has(this.lastDismissedId));
  }

  /**
   * Publish a new notification (for future modules / testing)
   */
  addNotification(notification) {
    const newRecord = {
      id: notification.id || `notif-custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      timestamp: "Just now",
      isRead: false,
      readAt: null,
      severity: "info",
      ...notification,
    };
    this.customNotifications.unshift(newRecord);
    this.saveCustomNotifications(this.customNotifications);
    this.notify();
    return newRecord;
  }

  /**
   * Reset store to default initial mock data
   */
  resetToDefaults() {
    this.readIds.clear();
    this.dismissedIds.clear();
    this.customNotifications = [];
    this.lastDismissedId = null;
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.READ_IDS);
        window.localStorage.removeItem(STORAGE_KEYS.DISMISSED_IDS);
        window.localStorage.removeItem(STORAGE_KEYS.CUSTOM_EVENTS);
      } catch {}
    }
    this.notify();
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
