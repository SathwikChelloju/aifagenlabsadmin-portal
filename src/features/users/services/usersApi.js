/**
 * Users Service Layer (Simulated Asynchronous API)
 * Communicates with the centralized reactive mockStore.
 */

import { mockStore } from "../../../mocks/mockStore.js";

const SIMULATED_LATENCY_MS = 60;

function sleep(ms = SIMULATED_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getUsers() {
  await sleep();
  const state = mockStore.getState();
  return [...state.users];
}

export async function getUserById(userId) {
  await sleep();
  const state = mockStore.getState();
  const user = state.users.find((u) => u.id === userId);
  if (!user) throw new Error(`User with ID ${userId} not found`);
  return { ...user };
}

export async function changeUserPlan(userId, newPlan, reason = "Plan updated via console") {
  await sleep();
  const success = mockStore.updateUserPlan(userId, newPlan, reason);
  if (!success) throw new Error("Failed to change user subscription plan");
  return { success, userId, newPlan };
}

export async function updateUserStatus(userId, newStatus, reason = "Status changed via console") {
  await sleep();
  const success = mockStore.updateUserStatus(userId, newStatus, reason);
  if (!success) throw new Error("Failed to update user account status");
  return { success, userId, newStatus };
}

export async function createUser(userData) {
  await sleep();
  if (!userData.name || !userData.email) {
    throw new Error("Name and email are mandatory");
  }
  const newUser = mockStore.createUser(userData);
  return { ...newUser };
}

export async function updateUserProfile(userId, profileUpdates) {
  await sleep();
  const updatedUser = mockStore.updateUserProfile(userId, profileUpdates);
  if (!updatedUser) throw new Error(`User with ID ${userId} not found`);
  return { ...updatedUser };
}

export async function updateUser(userId, updates) {
  await sleep();
  const state = mockStore.getState();
  const user = state.users.find((u) => u.id === userId);
  if (!user) throw new Error(`User with ID ${userId} not found`);
  Object.assign(user, updates);
  mockStore.notify();
  return { ...user };
}
