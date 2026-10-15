import React, { useState } from "react";
import PaymentsHeader from "../components/PaymentsHeader";
import PaymentsStats from "../components/PaymentsStats";
import PaymentsFilters from "../components/PaymentsFilters";
import PaymentsTable from "../components/PaymentsTable";
import TransactionDetailsDrawer from "../components/TransactionDetailsDrawer";
import IssueRefundModal from "../components/IssueRefundModal";
import InvoicePreviewModal from "../../users/components/InvoicePreviewModal";
import { usePayments } from "../hooks/usePayments";
import { generatePaymentsCsv, formatCurrency } from "../utils/paymentUtils";
import { useToast } from "../../../hooks/useToast";

/**
 * Payments Page
 * Complete Payments & Financial Ledger Management module for AIFA GEN LABS.
 */
export default function PaymentsPage({ darkMode = false }) {
  const {
    payments,
    filteredPayments,
    paginatedPayments,
    totalCount,
    loading,
    summaryMetrics,
    availableMethods,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    dateFilter,
    setDateFilter,
    clearFilters,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    executeRefund,
  } = usePayments();

  const { addToast } = useToast();

  // Drawers and Modals State
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [refundTransaction, setRefundTransaction] = useState(null);
  const [selectedInvoiceTransaction, setSelectedInvoiceTransaction] = useState(null);

  // CSV Export Handler
  const handleExportCsv = () => {
    if (filteredPayments.length === 0) {
      addToast("No transactions match current filters to export.", "info");
      return;
    }

    try {
      const csvString = generatePaymentsCsv(filteredPayments);
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "payments-export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast(`Exported ${filteredPayments.length} transaction records`, "success");
    } catch (err) {
      console.error("CSV Export Error:", err);
      addToast("Failed to generate CSV export file", "error");
    }
  };

  // Convert transaction record into standard invoice and user payload for InvoicePreviewModal
  const invoicePayload = selectedInvoiceTransaction
    ? {
        id: selectedInvoiceTransaction.invoiceNumber || selectedInvoiceTransaction.id,
        invoiceNumber: selectedInvoiceTransaction.invoiceNumber,
        date: selectedInvoiceTransaction.formattedDate
          ? selectedInvoiceTransaction.formattedDate.split(" · ")[0]
          : "Oct 10, 2026",
        amount: formatCurrency(
          selectedInvoiceTransaction.amount,
          selectedInvoiceTransaction.currency,
          selectedInvoiceTransaction.currencySymbol,
        ),
        description:
          selectedInvoiceTransaction.description || "Career Placement Concierge (Monthly)",
        status:
          selectedInvoiceTransaction.status === "Successful" ||
          selectedInvoiceTransaction.status === "Paid"
            ? "Paid"
            : selectedInvoiceTransaction.status,
      }
    : null;

  const userPayload = selectedInvoiceTransaction
    ? {
        id: selectedInvoiceTransaction.userId || "usr_9104",
        name:
          selectedInvoiceTransaction.userName ||
          selectedInvoiceTransaction.candidateName ||
          "Valued Customer",
        email: selectedInvoiceTransaction.userEmail || "--",
        phone: selectedInvoiceTransaction.userPhone || null,
        location: selectedInvoiceTransaction.userLocation || null,
        subscription: {
          paymentMethod: selectedInvoiceTransaction.paymentMethod || "Visa ending in 4242",
          plan: selectedInvoiceTransaction.plan || "Premium",
        },
      }
    : null;

  const isFiltered =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    methodFilter !== "All" ||
    dateFilter !== "All Time";

  return (
    <div className="space-y-6">
      {/* 1. Payments Header */}
      <PaymentsHeader
        totalCount={summaryMetrics.totalCount}
        onExportCsv={handleExportCsv}
        darkMode={darkMode}
      />

      {/* 2. Top Financial KPI Summary Cards */}
      <PaymentsStats
        stats={summaryMetrics}
        darkMode={darkMode}
      />

      {/* 3. Transaction Search and Filter Bar */}
      <PaymentsFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        methodFilter={methodFilter}
        setMethodFilter={setMethodFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        availableMethods={availableMethods}
        clearFilters={clearFilters}
        resultCount={totalCount}
        darkMode={darkMode}
      />

      {/* 4. Transactions Table */}
      <PaymentsTable
        payments={paginatedPayments}
        loading={loading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onViewDetails={(txn) => setSelectedTransaction(txn)}
        onViewInvoice={(txn) => setSelectedInvoiceTransaction(txn)}
        onIssueRefund={(txn) => setRefundTransaction(txn)}
        onClearFilters={clearFilters}
        isFiltered={isFiltered}
        darkMode={darkMode}
      />

      {/* 5. Transaction Details Inspection Drawer */}
      <TransactionDetailsDrawer
        transaction={selectedTransaction}
        allTransactions={payments}
        onSelectTransaction={(txn) => setSelectedTransaction(txn)}
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        onViewInvoice={(txn) => {
          setSelectedInvoiceTransaction(txn);
        }}
        onIssueRefund={(txn) => {
          setRefundTransaction(txn);
        }}
        darkMode={darkMode}
      />

      {/* 6. Issue Refund Confirmation Modal */}
      <IssueRefundModal
        transaction={refundTransaction}
        isOpen={Boolean(refundTransaction)}
        onClose={() => setRefundTransaction(null)}
        onConfirm={async (id, reason) => {
          await executeRefund(id, reason);
          if (selectedTransaction && selectedTransaction.id === id) {
            setSelectedTransaction((prev) => (prev ? { ...prev, status: "Refunded", refundReason: reason } : null));
          }
        }}
        _darkMode={darkMode}
      />

      {/* 7. Official Invoice Document Preview Modal */}
      <InvoicePreviewModal
        invoice={invoicePayload}
        user={userPayload}
        isOpen={Boolean(selectedInvoiceTransaction)}
        onClose={() => setSelectedInvoiceTransaction(null)}
        _darkMode={darkMode}
      />
    </div>
  );
}
