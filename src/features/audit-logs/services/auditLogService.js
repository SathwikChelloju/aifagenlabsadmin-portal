import { mockStore } from "../../../mocks/mockStore";

/**
 * Service managing platform audit log events
 */
class AuditLogService {
  /**
   * Retrieves all audit log events from the store
   */
  getEvents() {
    return mockStore.getAuditLogs();
  }

  /**
   * Subscribes to audit log updates
   */
  subscribe(listener) {
    return mockStore.subscribe((state) => {
      listener(state.auditLogs);
    });
  }

  /**
   * Finds a specific event by ID
   */
  getEventById(id) {
    const events = mockStore.getAuditLogs();
    return events.find((e) => e.id === id) || null;
  }

  /**
   * Finds related events based on correlationId, operationId, or relatedEventIds
   */
  getRelatedEvents(targetEvent, eventList) {
    if (!targetEvent) return [];
    const allEvents = eventList || mockStore.getAuditLogs();

    return allEvents.filter((e) => {
      if (e.id === targetEvent.id) return false;

      // Direct explicit related link
      if (
        Array.isArray(targetEvent.relatedEventIds) &&
        targetEvent.relatedEventIds.includes(e.id)
      ) {
        return true;
      }
      if (
        Array.isArray(e.relatedEventIds) &&
        e.relatedEventIds.includes(targetEvent.id)
      ) {
        return true;
      }

      // Shared correlation ID
      if (
        targetEvent.correlationId &&
        e.correlationId &&
        targetEvent.correlationId === e.correlationId
      ) {
        return true;
      }

      // Shared operation ID
      if (
        targetEvent.operationId &&
        e.operationId &&
        targetEvent.operationId === e.operationId
      ) {
        return true;
      }

      // Same actor and same target
      if (
        targetEvent.actorId &&
        e.actorId &&
        targetEvent.actorId === e.actorId &&
        targetEvent.targetId &&
        e.targetId &&
        targetEvent.targetId === e.targetId
      ) {
        return true;
      }

      return false;
    });
  }

  /**
   * Records a new audit log event in the central store
   */
  recordEvent(eventPayload) {
    return mockStore.recordAuditEvent(eventPayload);
  }
}

export const auditLogService = new AuditLogService();
