import { mockStore } from "../../../mocks/mockStore";

/**
 * Dashboard Service
 * Connects Dashboard views to the reactive centralized mock store.
 */
export async function getDashboardOverview() {
  const state = mockStore.getState();

  return {
    stats: state.metrics,
    cohort30dData: state.cohort30dData,
    infographicDatasets: state.infographicDatasets,
    expiringCandidates: (state.candidates || []).filter(
      (c) => c.status === "Active" && c.expiresInDays > 0 && c.expiresInDays <= 30,
    ),
    jobHealth: {
      sourcesList: (state.jobSources || []).map((s) => ({
        ...s,
        status: s.status === "Active" ? "Working" : s.status === "Error" ? "Attention" : s.status,
      })),
    },
  };
}
