/**
 * Session Storage Conversation History Manager
 * AIFA GEN LABS Admin Portal
 *
 * Implements conversational persistence in the browser's sessionStorage:
 * - Stores message history as { role: 'user' | 'assistant', content: string }
 * - Restores history on page reload within the same tab session
 * - Clears session history when browser tab closes or clear-chat is invoked
 */

export const SESSION_HISTORY_KEY = "aifa_assistant_session_history";
export const SESSION_UI_KEY = "aifa_assistant_ui_messages";

/**
 * Retrieves conversational history for LLM context from sessionStorage.
 * @returns {Array<{ role: 'user' | 'assistant', content: string }>}
 */
export function getConversationHistory() {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return [];
  }
  try {
    const raw = window.sessionStorage.getItem(SESSION_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      );
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Saves conversation history array to sessionStorage.
 * @param {Array<{ role: 'user' | 'assistant', content: string }>} history
 */
export function saveConversationHistory(history) {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    const sanitized = Array.isArray(history)
      ? history
          .filter(
            (m) =>
              m &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string"
          )
          .slice(-16) // Keep last 16 turns to prevent token bloat
      : [];
    window.sessionStorage.setItem(
      SESSION_HISTORY_KEY,
      JSON.stringify(sanitized)
    );
  } catch (err) {
    console.warn("Failed to save conversation history to sessionStorage:", err);
  }
}

/**
 * Appends a single message turn to sessionStorage.
 * @param {'user' | 'assistant'} role
 * @param {string} content
 */
export function appendToConversationHistory(role, content) {
  if (!content) return [];
  const history = getConversationHistory();
  history.push({ role, content });
  const trimmed = history.slice(-16);
  saveConversationHistory(trimmed);
  return trimmed;
}

/**
 * Completely clears sessionStorage conversation and UI messages.
 */
export function clearConversationHistory() {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    window.sessionStorage.removeItem(SESSION_HISTORY_KEY);
    window.sessionStorage.removeItem(SESSION_UI_KEY);
  } catch (err) {
    console.warn("Failed to clear conversation history from sessionStorage:", err);
  }
}

/**
 * Retrieves persisted UI messages (including structured tables/cards) for page reload.
 */
export function getSessionUiMessages() {
  if (typeof window === "undefined" || !window.sessionStorage) return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_UI_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Persists full UI message objects to sessionStorage for page reload within current tab.
 */
export function saveSessionUiMessages(messages) {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    window.sessionStorage.setItem(SESSION_UI_KEY, JSON.stringify(messages));
  } catch (err) {
    console.warn("Failed to save UI messages to sessionStorage:", err);
  }
}
