import React, { useState, useEffect, useMemo } from "react";
import RecruitersHeader from "../components/RecruitersHeader";
import RecruitersStats from "../components/RecruitersStats";
import RecruiterPerformanceChart from "../components/RecruiterPerformanceChart";
import TopRecruitersCard from "../components/TopRecruitersCard";
import RecruitersFilters from "../components/RecruitersFilters";
import RecruitersTable from "../components/RecruitersTable";
import RecruiterDetailsDrawer from "../components/RecruiterDetailsDrawer";
import AddRecruiterModal from "../components/AddRecruiterModal";
import {
  recruiterService,
  isDateWithinFilter,
  formatJoinedDate,
} from "../services/recruiterService";
import { useToast } from "../../../hooks/useToast";

export default function RecruitersPage({ darkMode = false }) {
  const [recruiters, setRecruiters] = useState(() => recruiterService.getRecruiters());
  const [search, setSearch] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("q") || "";
    }
    return "";
  });
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
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

  const [sortField, setSortField] = useState("candidatesAssigned");
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { addToast } = useToast();

  // Keep state synced with recruiterService
  useEffect(() => {
    const unsubscribe = recruiterService.subscribe((updated) => {
      setRecruiters(updated);
      // If a recruiter is currently selected in the drawer, keep it synced
      setSelectedRecruiter((prev) => {
        if (!prev) return null;
        return updated.find((r) => r.id === prev.id) || prev;
      });
    });
    return unsubscribe;
  }, []);

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Filtered and Sorted Recruiters
  const filteredRecruiters = useMemo(() => {
    return recruiters
      .filter((r) => {
        // Search
        if (search) {
          const q = search.toLowerCase();
          const matchName = r.name.toLowerCase().includes(q);
          const matchEmail = r.email.toLowerCase().includes(q);
          const matchDept = r.department.toLowerCase().includes(q);
          const matchRole = r.role.toLowerCase().includes(q);
          const matchId = (r.employeeId || "").toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchDept && !matchRole && !matchId) return false;
        }

        // Department
        if (departmentFilter !== "All Departments" && r.department !== departmentFilter) {
          return false;
        }

        // Status
        if (statusFilter !== "All Statuses" && r.status !== statusFilter) {
          return false;
        }

        // Joined Date range filter
        if (!isDateWithinFilter(r.joinedAt, dateFilter)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === "joinedAt") {
          const timeA = new Date(valA || "1970-01-01").getTime();
          const timeB = new Date(valB || "1970-01-01").getTime();
          return sortDirection === "asc" ? timeA - timeB : timeB - timeA;
        }

        if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = (valB || "").toLowerCase();
        }

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [recruiters, search, departmentFilter, statusFilter, dateFilter, sortField, sortDirection]);

  // Handle Select Recruiter
  const handleSelectRecruiter = (recruiter) => {
    setSelectedRecruiter(recruiter);
    setIsDrawerOpen(true);
  };

  // Handle Successful Creation of Recruiter
  const handleRecruiterCreated = (newRecruiter) => {
    setIsAddModalOpen(false);
    setSelectedRecruiter(newRecruiter);
    setIsDrawerOpen(true);
    addToast(`Recruiter ${newRecruiter.name} added successfully!`, "success");
  };

  // Handle Export CSV
  const handleExportCsv = () => {
    try {
      const headers = [
        "Employee ID",
        "Name",
        "Email",
        "Role",
        "Department",
        "Joined Date",
        "Status",
        "Rating",
        "Candidates Assigned",
        "Interviews Conducted",
        "Successful Placements",
        "Placement Rate (%)",
        "Avg Time To Hire (Days)",
      ];

      const rows = filteredRecruiters.map((r) => [
        r.employeeId || r.id,
        `"${r.name}"`,
        r.email,
        `"${r.role}"`,
        `"${r.department}"`,
        formatJoinedDate(r.joinedAt),
        r.status,
        r.rating,
        r.candidatesAssigned,
        r.interviewsConducted,
        r.successfulPlacements,
        r.placementRate,
        r.avgTimeToHireDays,
      ]);

      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `recruiters-performance-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast("Recruiters report exported successfully", "success");
    } catch {
      addToast("Failed to export CSV report", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <RecruitersHeader
        onAddRecruiter={() => setIsAddModalOpen(true)}
        onExportCsv={handleExportCsv}
        darkMode={darkMode}
      />

      {/* 2. Top Summary KPI Cards */}
      <RecruitersStats
        recruiters={recruiters}
        darkMode={darkMode}
      />

      {/* 3. Performance Analytics & Top Recruiters Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-8">
          <RecruiterPerformanceChart darkMode={darkMode} />
        </div>
        <div className="xl:col-span-4">
          <TopRecruitersCard
            recruiters={recruiters}
            onSelectRecruiter={handleSelectRecruiter}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* 4. Filter Toolbar */}
      <RecruitersFilters
        search={search}
        setSearch={setSearch}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onResetFilters={() => {
          setSearch("");
          setDepartmentFilter("All Departments");
          setStatusFilter("All Statuses");
          setDateFilter("All Time");
        }}
        darkMode={darkMode}
      />

      {/* 5. Recruiters Data Table */}
      <RecruitersTable
        recruiters={filteredRecruiters}
        onSelectRecruiter={handleSelectRecruiter}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        darkMode={darkMode}
      />

      {/* 6. Recruiter Details Slide-out Drawer */}
      <RecruiterDetailsDrawer
        recruiter={selectedRecruiter}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        darkMode={darkMode}
      />

      {/* 7. Add Recruiter Modal */}
      <AddRecruiterModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleRecruiterCreated}
        darkMode={darkMode}
      />
    </div>
  );
}
