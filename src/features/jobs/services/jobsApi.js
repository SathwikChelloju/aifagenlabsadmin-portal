/**
 * Jobs Service API
 * Simulates asynchronous data layer connected to reactive MockStore.
 */

import { mockStore } from "../../../mocks/mockStore.js";

/**
 * Fetches all unified jobs from store
 * @returns {Promise<Array>}
 */
export async function getJobs() {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return mockStore.getAllJobs();
}

/**
 * Fetches single job by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getJobById(id) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const job = mockStore.getAllJobs().find((j) => j.id === id);
  if (!job) throw new Error(`Job ${id} not found`);
  return { ...job };
}

/**
 * Creates a new job
 * @param {Object} jobData
 * @param {string} admin
 * @returns {Promise<Object>}
 */
export async function createJob(jobData, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 120));
  const created = mockStore.createJob(jobData, admin);
  return { ...created };
}

/**
 * Updates an existing job
 * @param {string} id
 * @param {Object} updates
 * @param {string} admin
 * @returns {Promise<Object>}
 */
export async function updateJob(id, updates, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const updated = mockStore.updateJob(id, updates, admin);
  if (!updated) throw new Error(`Failed to update job ${id}`);
  return { ...updated };
}

/**
 * Deletes a job
 * @param {string} id
 * @param {string} admin
 * @returns {Promise<boolean>}
 */
export async function deleteJob(id, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const success = mockStore.deleteJob(id, admin);
  if (!success) throw new Error(`Failed to delete job ${id}`);
  return true;
}

/**
 * Quick status update
 * @param {string} id
 * @param {string} newStatus
 * @param {string} admin
 * @returns {Promise<Object>}
 */
export async function updateJobStatus(id, newStatus, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const updated = mockStore.updateJobStatus(id, newStatus, admin);
  return { ...updated };
}

/**
 * Bulk hide jobs
 * @param {Array<string>} ids
 * @param {string} admin
 * @returns {Promise<number>}
 */
export async function hideJobs(ids, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockStore.hideJobs(ids, admin);
}

/**
 * Bulk unhide jobs
 * @param {Array<string>} ids
 * @param {string} admin
 * @returns {Promise<number>}
 */
export async function unhideJobs(ids, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockStore.unhideJobs(ids, admin);
}

/**
 * Single job visibility change
 * @param {string} id
 * @param {boolean} isHidden
 * @param {string} admin
 * @returns {Promise<number>}
 */
export async function setJobVisibility(id, isHidden, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return mockStore.setJobVisibility(id, isHidden, admin);
}

/**
 * Bulk status update
 * @param {Array<string>} ids
 * @param {string} newStatus
 * @param {string} admin
 * @returns {Promise<number>}
 */
export async function bulkUpdateJobStatus(ids, newStatus, admin = "admin@aifagen.com") {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return mockStore.bulkUpdateJobStatus(ids, newStatus, admin);
}

