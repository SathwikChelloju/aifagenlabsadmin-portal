import React, { useState, useMemo } from "react";
import UsersHeader from "../components/UsersHeader";
import UsersStats from "../components/UsersStats";
import UsersFilters from "../components/UsersFilters";
import UsersTable from "../components/UsersTable";
import UserDetailsDrawer from "../components/UserDetailsDrawer";
import ChangePlanModal from "../components/ChangePlanModal";
import ConfirmStatusModal from "../components/ConfirmStatusModal";
import AddUserModal from "../components/AddUserModal";
import { useUsers } from "../hooks/useUsers";
import { formatJoinedDate } from "../utils/userUtils";
import { useToast } from "../../../hooks/useToast";

/**
 * Users Page
 * Complete Users Management feature for AIFA GEN LABS Admin Portal.
 */
export default function UsersPage({ darkMode = false }) {
  const {
    users,
    paginatedUsers,
    filteredUsers,
    totalCount,
    loading,
    summaryMetrics,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    planFilter,
    setPlanFilter,
    dateFilter,
    setDateFilter,
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
  } = useUsers();

  const { addToast } = useToast();

  // Modals & Drawer State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [planModalUser, setPlanModalUser] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const [statusModalUser, setStatusModalUser] = useState(null);
  const [targetStatus, setTargetStatus] = useState("Active");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Keep selectedUser in sync with store updates (e.g. after profile edit or plan change)
  const currentSelectedUser = useMemo(() => {
    if (!selectedUser) return null;
    return users.find((u) => u.id === selectedUser.id) || selectedUser;
  }, [users, selectedUser]);

  // Handlers
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleOpenPlanModal = (user) => {
    setPlanModalUser(user);
    setIsPlanModalOpen(true);
  };

  const handleOpenStatusModal = (user, newStatus) => {
    setStatusModalUser(user);
    setTargetStatus(newStatus);
    setIsStatusModalOpen(true);
  };

  // CSV Export
  const handleExportCsv = () => {
    if (!filteredUsers || filteredUsers.length === 0) {
      addToast("No user records to export", "info");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Location",
      "Role",
      "Plan",
      "Status",
      "AI Usage Tokens",
      "ATS Score",
      "Country Goal",
      "Target Visa",
      "Domain",
      "Joined Date",
    ];

    const rows = filteredUsers.map((u) => [
      `"${u.id || ""}"`,
      `"${(u.name || "").replace(/"/g, '""')}"`,
      `"${(u.email || "").replace(/"/g, '""')}"`,
      `"${(u.phone || "").replace(/"/g, '""')}"`,
      `"${(u.location || "").replace(/"/g, '""')}"`,
      `"${u.role || "Candidate"}"`,
      `"${u.plan || "None"}"`,
      `"${u.status || "Active"}"`,
      u.aiUsageTokens || 0,
      `"${u.atsScore || ""}"`,
      `"${(u.countryGoal || "").replace(/"/g, '""')}"`,
      `"${(u.targetVisa || "").replace(/"/g, '""')}"`,
      `"${(u.domain || "").replace(/"/g, '""')}"`,
      `"${formatJoinedDate(u.joinedAt)}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `aifa-users-export-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast(`Exported ${filteredUsers.length} user records to CSV`, "success");
  };

  const isFiltered =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    planFilter !== "All" ||
    dateFilter !== "All Time";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <UsersHeader
        totalCount={users.length}
        onAddUser={() => setIsAddModalOpen(true)}
        onExportCsv={handleExportCsv}
        darkMode={darkMode}
      />

      {/* Summary KPI Metrics */}
      <UsersStats stats={summaryMetrics} darkMode={darkMode} />

      {/* Unified Filters Bar */}
      <UsersFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        clearFilters={clearFilters}
        resultCount={totalCount}
        darkMode={darkMode}
      />

      {/* Users DataTable */}
      <UsersTable
        users={paginatedUsers}
        loading={loading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onViewDetails={handleViewDetails}
        onChangePlan={handleOpenPlanModal}
        onToggleStatus={handleOpenStatusModal}
        onClearFilters={clearFilters}
        isFiltered={isFiltered}
        darkMode={darkMode}
      />

      {/* User Details Slide-out Drawer */}
      <UserDetailsDrawer
        user={currentSelectedUser}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onChangePlan={handleOpenPlanModal}
        onToggleStatus={handleOpenStatusModal}
        onSaveProfile={executeProfileUpdate}
        darkMode={darkMode}
      />

      {/* Change Subscription Plan Modal */}
      <ChangePlanModal
        user={planModalUser}
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setPlanModalUser(null);
        }}
        onConfirm={executePlanChange}
      />

      {/* Suspend / Activate Confirmation Modal */}
      <ConfirmStatusModal
        user={statusModalUser}
        targetStatus={targetStatus}
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setStatusModalUser(null);
        }}
        onConfirm={executeStatusChange}
      />

      {/* Provision New User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={executeCreateUser}
      />
    </div>
  );
}
