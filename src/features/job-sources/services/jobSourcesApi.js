/**
 * Job Sources Service API
 * Interacts with reactive MockStore with simulated asynchronous network delays.
 */

import { mockStore } from "../../../mocks/mockStore.js";

/**
 * Fetches all job sources
 * @returns {Promise<Array>}
 */
export async function getJobSources() {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return mockStore.getAllJobSources();
}

/**
 * Fetches single source by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getJobSourceById(id) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const src = mockStore.getJobSourceById(id);
  if (!src) throw new Error(`Job source ${id} not found`);
  return { ...src };
}

/**
 * Fetches sync history for all sources or single source
 * @param {string} [sourceId]
 * @returns {Promise<Array>}
 */
export async function getSyncHistory(sourceId) {
  await new Promise((resolve) => setTimeout(resolve, 60));
  return sourceId
    ? mockStore.getSyncHistoryForSource(sourceId)
    : mockStore.getAllSyncHistory();
}

/**
 * Creates new job source
 * @param {Object} sourceData
 * @param {string} admin
 * @returns {Promise<Object>}
 */
export async function createJobSource(sourceData, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return mockStore.createJobSource(sourceData, admin);
}

/**
 * Updates existing job source
 * @param {string} id
 * @param {Object} updates
 * @param {string} admin
 * @returns {Promise<Object>}
 */
export async function updateJobSource(id, updates, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const updated = mockStore.updateJobSource(id, updates, admin);
  if (!updated) throw new Error(`Failed to update job source ${id}`);
  return { ...updated };
}

/**
 * Deletes job source
 * @param {string} id
 * @param {string} admin
 * @returns {Promise<boolean>}
 */
export async function deleteJobSource(id, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const success = mockStore.deleteJobSource(id, admin);
  if (!success) throw new Error(`Failed to delete job source ${id}`);
  return true;
}

/**
 * Toggles status (Active / Paused)
 * @param {string} id
 * @param {string} admin
 * @returns {Promise<Object>}
 */
export async function toggleJobSourceStatus(id, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return mockStore.toggleJobSourceStatus(id, admin);
}

/**
 * Triggers simulated synchronization for single source
 * @param {string} id
 * @param {string} admin
 * @returns {Promise<Object>}
 */
export async function syncJobSource(id, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return mockStore.triggerSyncJobSource(id, admin);
}

/**
 * Triggers simulated batch synchronization across all active sources
 * @param {string} admin
 * @returns {Promise<Object>}
 */
export async function syncAllJobSources(admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockStore.syncAllJobSources(admin);
}

/**
 * Fetches all duplicate jobs records
 * @returns {Promise<Array>}
 */
export async function getDuplicateJobs() {
  await new Promise((resolve) => setTimeout(resolve, 60));
  return mockStore.getAllDuplicateJobs();
}

/**
 * Resolves a duplicate job record
 * @param {string} id
 * @param {"MERGE" | "KEEP_BOTH" | "DISMISS"} action
 * @param {string} admin
 * @returns {Promise<Object>}
 */
export async function resolveDuplicateJob(id, action, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockStore.resolveDuplicateJob(id, action, admin);
}

/**
 * Fetches ingestion time series data
 * @param {number} days
 * @param {string} [sourceSlug]
 * @returns {Promise<Array>}
 */
export async function getIngestionTimeSeries(days = 14, sourceSlug = null) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockStore.getIngestionTimeSeries(days, sourceSlug);
}
