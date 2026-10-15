import { useState, useEffect, useCallback } from "react";
import { getDashboardOverview } from "../services/dashboardService";
import { mockStore } from "../../../mocks/mockStore";

/**
 * useDashboard Hook
 * Subscribes to central mockStore and provides dashboard state & mutations.
 */
export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      const result = await getDashboardOverview();
      setData(result);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCandidatePlan = useCallback(
    (candidateId, newPlan, reason) => {
      mockStore.updateCandidatePlan(candidateId, newPlan, reason);
      loadDashboard();
    },
    [loadDashboard],
  );

  useEffect(() => {
    loadDashboard();
    const unsubscribe = mockStore.subscribe(() => {
      loadDashboard();
    });
    return unsubscribe;
  }, [loadDashboard]);

  return {
    data,
    loading,
    refreshDashboard: loadDashboard,
    updateCandidatePlan,
  };
}
