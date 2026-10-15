/**
 * Payments Service API
 * Simulates asynchronous transactions data layer connected to MockStore.
 */

import { mockStore } from "../../../mocks/mockStore.js";

/**
 * Fetches all transactions from store
 * @returns {Promise<Array>}
 */
export async function getPayments() {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return [...mockStore.getState().transactions];
}

/**
 * Fetches single transaction by ID
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export async function getPaymentById(id) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const txn = mockStore.getState().transactions.find((t) => t.id === id);
  if (!txn) throw new Error(`Transaction ${id} not found`);
  return { ...txn };
}

/**
 * Issues a refund on a transaction
 * @param {string} transactionId 
 * @param {string} reason 
 * @returns {Promise<Object>}
 */
export async function issueRefund(transactionId, reason) {
  await new Promise((resolve) => setTimeout(resolve, 150));
  mockStore.issueRefund(transactionId, reason);
  const updated = mockStore.getState().transactions.find((t) => t.id === transactionId);
  return { ...updated };
}
