import { useState, useEffect, useMemo, useCallback } from "react";
import { getPayments, issueRefund } from "../services/paymentsApi";
import { mockStore } from "../../../mocks/mockStore.js";
import { useToast } from "../../../hooks/useToast";

export function usePayments() {
  const [payments, setPayments] = useState(() => mockStore.getState().transactions || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("q") || "";
    }
    return "";
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
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
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [referenceTime] = useState(() => Date.now());
  const { addToast } = useToast();

  const loadPayments = useCallback(async () => {
    try {
      setError(null);
      const data = await getPayments();
      setPayments(data);
    } catch (err) {
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = mockStore.subscribe(() => {
      loadPayments();
    });
    return unsubscribe;
  }, [loadPayments]);

  // Derived available payment methods present in data
  const availableMethods = useMemo(() => {
    const methods = new Set();
    payments.forEach((p) => {
      const type = p.paymentMethodType || (p.paymentMethod ? p.paymentMethod.split(" ")[0] : null);
      if (type) methods.add(type);
    });
    return ["All", ...Array.from(methods)];
  }, [payments]);

  // Dynamic summary metrics calculated strictly across complete dataset
  const summaryMetrics = useMemo(() => {
    let revenue = 0;
    let successful = 0;
    let pending = 0;
    let failed = 0;

    payments.forEach((p) => {
      const isSuccess = p.status === "Successful" || p.status === "Paid";
      if (isSuccess) {
        revenue += typeof p.amount === "number" ? p.amount : parseFloat(p.amount) || 0;
        successful += 1;
      } else if (p.status === "Pending") {
        pending += 1;
      } else if (p.status === "Failed") {
        failed += 1;
      }
    });

    return {
      totalRevenue: revenue,
      successfulPayments: successful,
      pendingPayments: pending,
      failedPayments: failed,
      totalCount: payments.length,
    };
  }, [payments]);

  // Filter setter handlers that reset pagination to page 1
  const handleSetSearch = useCallback((val) => {
    setSearch(val);
    setCurrentPage(1);
  }, []);

  const handleSetStatusFilter = useCallback((val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  }, []);

  const handleSetMethodFilter = useCallback((val) => {
    setMethodFilter(val);
    setCurrentPage(1);
  }, []);

  const handleSetDateFilter = useCallback((val) => {
    setDateFilter(val);
    setCurrentPage(1);
  }, []);

  // Multi-faceted filtering
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      // 1. Search Query
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        (p.userName && p.userName.toLowerCase().includes(query)) ||
        (p.candidateName && p.candidateName.toLowerCase().includes(query)) ||
        (p.userEmail && p.userEmail.toLowerCase().includes(query)) ||
        (p.id && p.id.toLowerCase().includes(query)) ||
        (p.shortId && p.shortId.toLowerCase().includes(query)) ||
        (p.invoiceNumber && p.invoiceNumber.toLowerCase().includes(query));

      // 2. Status Filter
      const matchesStatus =
        statusFilter === "All" ||
        p.status === statusFilter ||
        (statusFilter === "Successful" && p.status === "Paid");

      // 3. Payment Method Filter
      const matchesMethod =
        methodFilter === "All" ||
        (p.paymentMethodType && p.paymentMethodType === methodFilter) ||
        (p.paymentMethod && p.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase()));

      // 4. Date Range Filter
      const matchesDate = (() => {
        if (dateFilter === "All Time") return true;
        if (!p.date) return false;
        const txnTime = new Date(p.date).getTime();
        if (isNaN(txnTime)) return false;

        if (dateFilter === "Today") {
          return txnTime >= referenceTime - 24 * 60 * 60 * 1000 && txnTime <= referenceTime;
        }
        if (dateFilter === "Last 7 Days") {
          return txnTime >= referenceTime - 7 * 24 * 60 * 60 * 1000 && txnTime <= referenceTime;
        }
        if (dateFilter === "Last 30 Days") {
          return txnTime >= referenceTime - 30 * 24 * 60 * 60 * 1000 && txnTime <= referenceTime;
        }
        if (dateFilter === "Last 90 Days") {
          return txnTime >= referenceTime - 90 * 24 * 60 * 60 * 1000 && txnTime <= referenceTime;
        }
        return true;
      })();

      return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    });
  }, [payments, search, statusFilter, methodFilter, dateFilter, referenceTime]);

  // Multi-column sorting
  const sortedPayments = useMemo(() => {
    return [...filteredPayments].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "userName") {
        aVal = (a.userName || a.candidateName || "").toLowerCase();
        bVal = (b.userName || b.candidateName || "").toLowerCase();
      } else if (sortField === "amount") {
        aVal = typeof a.amount === "number" ? a.amount : parseFloat(a.amount) || 0;
        bVal = typeof b.amount === "number" ? b.amount : parseFloat(b.amount) || 0;
      } else if (sortField === "date") {
        aVal = new Date(a.date || 0).getTime();
        bVal = new Date(b.date || 0).getTime();
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal || "").toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredPayments, sortField, sortDirection]);

  // Pagination calculation
  const totalCount = sortedPayments.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedPayments.slice(startIndex, startIndex + pageSize);
  }, [sortedPayments, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("All");
    setMethodFilter("All");
    setDateFilter("All Time");
    setCurrentPage(1);
  }, []);

  const executeRefund = async (transactionId, reason) => {
    try {
      await issueRefund(transactionId, reason);
      addToast(`Successfully refunded transaction ${transactionId}`, "success");
      return true;
    } catch (err) {
      addToast(`Refund failed: ${err.message}`, "error");
      return false;
    }
  };

  return {
    payments,
    filteredPayments,
    sortedPayments,
    paginatedPayments,
    totalCount,
    totalPages,
    loading,
    error,
    summaryMetrics,
    availableMethods,
    search,
    setSearch: handleSetSearch,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
    methodFilter,
    setMethodFilter: handleSetMethodFilter,
    dateFilter,
    setDateFilter: handleSetDateFilter,
    clearFilters,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    executeRefund,
  };
}
