import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getUsers,
  changeUserPlan,
  updateUserStatus,
  createUser,
  updateUserProfile,
} from "../services/usersApi";
import { mockStore } from "../../../mocks/mockStore.js";
import { useToast } from "../../../hooks/useToast";

export function useUsers() {
  const [users, setUsers] = useState(() => mockStore.getState().users || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters (Role removed from filter bar, replaced with Joined Date)
  const [search, setSearch] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("q") || "";
    }
    return "";
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");

  useEffect(() => {
    const syncQueryParam = () => {
      const q = new URLSearchParams(window.location.search).get("q");
      if (q !== null && q !== undefined) {
        setSearch(q);
      }
    };
    syncQueryParam();
    window.addEventListener("popstate", syncQueryParam);
    return () => window.removeEventListener("popstate", syncQueryParam);
  }, []);

  // Sorting
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const { addToast } = useToast();

  const loadUsers = useCallback(async () => {
    try {
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = mockStore.subscribe(() => {
      loadUsers();
    });
    return unsubscribe;
  }, [loadUsers]);

  const [referenceTime] = useState(() => Date.now());

  // Dynamic summary metrics calculated strictly from complete dataset
  const summaryMetrics = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "Active").length;
    const suspended = users.filter((u) => u.status === "Suspended").length;
    const paid = users.filter(
      (u) => u.plan === "Premium" || u.plan === "Basic",
    ).length;

    const thirtyDaysAgo = referenceTime - 30 * 24 * 60 * 60 * 1000;
    const recent30d = users.filter((u) => {
      if (!u.joinedAt) return false;
      const joinedTime = new Date(u.joinedAt).getTime();
      return !isNaN(joinedTime) && joinedTime >= thirtyDaysAgo && joinedTime <= referenceTime;
    }).length;

    return {
      totalUsers: total,
      activeUsers: active,
      suspendedUsers: suspended,
      paidSubscribers: paid,
      recent30dUsers: recent30d,
    };
  }, [users, referenceTime]);

  // Multi-faceted Filtering (Search, Status, Plan, Joined Date)
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        search.trim() === "" ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.countryGoal && u.countryGoal.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === "All" || u.status === statusFilter;

      const matchesPlan =
        planFilter === "All" || u.plan === planFilter;

      const matchesDate = (() => {
        if (dateFilter === "All Time") return true;
        if (!u.joinedAt) return false;
        const joinedTime = new Date(u.joinedAt).getTime();
        if (isNaN(joinedTime)) return false;

        if (dateFilter === "Last 7 Days") {
          return joinedTime >= referenceTime - 7 * 24 * 60 * 60 * 1000 && joinedTime <= referenceTime;
        }
        if (dateFilter === "Last 30 Days") {
          return joinedTime >= referenceTime - 30 * 24 * 60 * 60 * 1000 && joinedTime <= referenceTime;
        }
        if (dateFilter === "Last 90 Days") {
          return joinedTime >= referenceTime - 90 * 24 * 60 * 60 * 1000 && joinedTime <= referenceTime;
        }
        return true;
      })();

      return matchesSearch && matchesStatus && matchesPlan && matchesDate;
    });
  }, [users, search, statusFilter, planFilter, dateFilter, referenceTime]);

  // Sorting
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    sorted.sort((a, b) => {
      if (sortField === "aiUsageTokens") {
        const valA = a.aiUsageTokens || 0;
        const valB = b.aiUsageTokens || 0;
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }

      if (sortField === "joinedAt") {
        const timeA = new Date(a.joinedAt || 0).getTime();
        const timeB = new Date(b.joinedAt || 0).getTime();
        return sortDirection === "asc" ? timeA - timeB : timeB - timeA;
      }

      const valA = a[sortField] || "";
      const valB = b[sortField] || "";

      if (typeof valA === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === "asc" ? valA - valB : valB - valA;
    });
    return sorted;
  }, [filteredUsers, sortField, sortDirection]);

  // Pagination slice
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedUsers.slice(startIndex, startIndex + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  const handleSetSearch = useCallback((val) => {
    setSearch(val);
    setCurrentPage(1);
  }, []);

  const handleSetStatusFilter = useCallback((val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  }, []);

  const handleSetPlanFilter = useCallback((val) => {
    setPlanFilter(val);
    setCurrentPage(1);
  }, []);

  const handleSetDateFilter = useCallback((val) => {
    setDateFilter(val);
    setCurrentPage(1);
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
    setDateFilter("All Time");
    setCurrentPage(1);
  };

  const executePlanChange = async (userId, newPlan, reason) => {
    try {
      await changeUserPlan(userId, newPlan, reason);
      addToast(`Updated subscription tier to ${newPlan}`, "success");
      return true;
    } catch (err) {
      addToast(err.message || "Failed to update plan", "error");
      return false;
    }
  };

  const executeStatusChange = async (userId, newStatus, reason) => {
    try {
      await updateUserStatus(userId, newStatus, reason);
      addToast(`Account status updated to ${newStatus}`, "success");
      return true;
    } catch (err) {
      addToast(err.message || "Failed to update status", "error");
      return false;
    }
  };

  const executeProfileUpdate = async (userId, updates) => {
    try {
      const updated = await updateUserProfile(userId, updates);
      addToast(`Profile updated for ${updated.name}`, "success");
      return true;
    } catch (err) {
      addToast(err.message || "Failed to update profile", "error");
      return false;
    }
  };

  const executeCreateUser = async (userData) => {
    try {
      const created = await createUser(userData);
      addToast(`Created user account for ${created.name}`, "success");
      return true;
    } catch (err) {
      addToast(err.message || "Failed to create user", "error");
      return false;
    }
  };

  return {
    users,
    paginatedUsers,
    filteredUsers,
    totalCount: filteredUsers.length,
    loading,
    error,
    summaryMetrics,
    search,
    setSearch: handleSetSearch,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
    planFilter,
    setPlanFilter: handleSetPlanFilter,
    dateFilter,
    setDateFilter: handleSetDateFilter,
    clearFilters,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    pageSize,
    executePlanChange,
    executeStatusChange,
    executeProfileUpdate,
    executeCreateUser,
    refreshUsers: loadUsers,
  };
}
