import React, { useState } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  RotateCcw,
  Receipt,
} from "lucide-react";
import PaymentActionsMenu from "./PaymentActionsMenu";
import PaymentMethodBadge from "./PaymentMethodBadge";
import {
  formatCurrency,
  formatShortTxnId,
  getPaymentStatusBadge,
} from "../utils/paymentUtils";
import { getUserInitials } from "../../users/utils/userUtils";
import { useToast } from "../../../hooks/useToast";

/**
 * PaymentsTable Component
 * Dense, accessible transaction table matching the reference screenshot.
 * Columns in order:
 * 1. Transaction ID
 * 2. User
 * 3. Amount
 * 4. Payment Method
 * 5. Date
 * 6. Status
 * 7. Invoice
 * 8. Actions
 */
export default function PaymentsTable({
  payments = [],
  loading = false,
  sortField = "date",
  sortDirection = "desc",
  onSort,
  currentPage = 1,
  totalCount = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  onViewInvoice,
  onIssueRefund,
  onClearFilters,
  isFiltered = false,
  darkMode = false,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const { addToast } = useToast();

  const handleCopyId = (e, id) => {
    e.stopPropagation();
    if (!id) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
      addToast(`Copied transaction ID ${id}`, "info");
    } else {
      addToast(`ID: ${id}`, "info");
    }
  };

  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D] text-white"
    : "bg-white border-slate-200/90 text-slate-900";

  const tableHeader = darkMode
    ? "bg-[#0D1117] text-slate-400 border-[#30363D]"
    : "bg-slate-50/70 text-slate-500 border-slate-200";
  const tableRowHover = darkMode
    ? "hover:bg-[#1F242C] border-[#30363D]/60"
    : "hover:bg-slate-50/80 border-slate-100";
  const dividerColor = darkMode ? "divide-[#30363D]/60" : "divide-slate-100";
  const footerBg = darkMode
    ? "bg-[#0D1117]/60 border-[#30363D]/60 text-slate-400"
    : "bg-slate-50/60 border-slate-100 text-slate-500";

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-40 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#D97706]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#D97706]" />
    );
  };

  const renderSortableHeader = (field, label, align = "left") => (
    <th
      className={`py-3.5 px-4 first:pl-6 last:pr-6 select-none cursor-pointer group transition-colors ${
        darkMode ? "hover:text-white" : "hover:text-slate-900"
      } ${
        align === "right"
          ? "text-right"
          : align === "center"
          ? "text-center"
          : "text-left"
      }`}
      onClick={() => onSort && onSort(field)}
    >
      <div
        className={`inline-flex items-center gap-1.5 ${
          align === "right"
            ? "justify-end"
            : align === "center"
            ? "justify-center"
            : "justify-start"
        }`}
      >
        <span>{label}</span>
        {getSortIcon(field)}
      </div>
    </th>
  );

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Helper to split date and time cleanly
  const splitDateTime = (isoDate, formattedDate) => {
    if (formattedDate && formattedDate.includes("·")) {
      const [d, t] = formattedDate.split("·");
      return { datePart: d.trim(), timePart: t.trim() };
    }
    if (!isoDate) return { datePart: "--", timePart: "" };
    try {
      const d = new Date(isoDate);
      const datePart = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
      const timePart = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
      return { datePart, timePart };
    } catch {
      return { datePart: isoDate, timePart: "" };
    }
  };

  return (
    <div className={`border rounded-3xl shadow-xs overflow-hidden transition-colors ${cardBg}`}>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b ${tableHeader} uppercase font-bold tracking-wider text-[10px]`}>
              {renderSortableHeader("id", "Transaction ID")}
              {renderSortableHeader("userName", "User")}
              {renderSortableHeader("amount", "Amount", "left")}
              {renderSortableHeader("paymentMethodType", "Payment Method")}
              {renderSortableHeader("date", "Date")}
              {renderSortableHeader("status", "Status", "center")}
              <th className="py-3.5 px-4 text-center">Invoice</th>
              <th className="py-3.5 px-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className={`divide-y ${dividerColor} font-medium`}>
            {loading ? (
              <tr>
                <td colSpan="8" className="py-16 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>Loading transactions...</span>
                  </div>
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-16 text-center">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                      No matching transactions found
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Try adjusting your search terms or clearing your status, method, and date filters.
                    </p>
                    {isFiltered && onClearFilters && (
                      <button
                        type="button"
                        onClick={onClearFilters}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#21262D] text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#30363D] transition-colors shadow-2xs cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                        <span>Clear All Filters</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              payments.map((txn) => {
                const statusMeta = getPaymentStatusBadge(txn.status, darkMode);
                const userName = txn.userName || txn.candidateName || "Valued Customer";
                const userEmail = txn.userEmail || "--";
                const { datePart, timePart } = splitDateTime(txn.date, txn.formattedDate);

                return (
                  <tr
                    key={txn.id}
                    onClick={() => onViewDetails && onViewDetails(txn)}
                    className={`transition-colors border-b cursor-pointer ${tableRowHover}`}
                  >
                    {/* 1. Transaction ID */}
                    <td className="py-3.5 px-4 pl-6 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="text-xs">{formatShortTxnId(txn.id)}</span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyId(e, txn.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title={`Copy full ID: ${txn.id}`}
                        >
                          {copiedId === txn.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* 2. User (Name + Avatar + Email underneath) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {txn.userAvatar ? (
                          <img
                            src={txn.userAvatar}
                            alt={userName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                            {getUserInitials(userName)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                            {userName}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
                            {userEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 3. Amount */}
                    <td className="py-3.5 px-4 text-left whitespace-nowrap">
                      <div className="font-mono font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {formatCurrency(txn.amount, txn.currency, txn.currencySymbol)}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">
                        {txn.currency || "USD"}
                      </div>
                    </td>

                    {/* 4. Payment Method with Logo */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      <PaymentMethodBadge
                        method={txn.paymentMethod}
                        type={txn.paymentMethodType}
                      />
                    </td>

                    {/* 5. Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {datePart}
                      </div>
                      {timePart && (
                        <div className="text-[10px] font-mono text-slate-400">
                          {timePart}
                        </div>
                      )}
                    </td>

                    {/* 6. Status Badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${statusMeta.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                        {statusMeta.label}
                      </span>
                    </td>

                    {/* 7. Invoice */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {txn.invoiceNumber ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onViewInvoice) {
                              onViewInvoice(txn);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer shadow-2xs"
                          title={`View Invoice ${txn.invoiceNumber}`}
                        >
                          <Receipt className="w-3 h-3 text-amber-500" />
                          <span>{txn.invoiceNumber}</span>
                        </button>
                      ) : (
                        <span className="font-mono text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* 8. Actions */}
                    <td
                      className="py-3.5 px-4 pr-6 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <PaymentActionsMenu
                        transaction={txn}
                        onViewDetails={onViewDetails}
                        onViewInvoice={onViewInvoice}
                        onIssueRefund={onIssueRefund}
                        darkMode={darkMode}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className={`p-4 border-t ${footerBg} flex flex-col sm:flex-row items-center justify-between gap-3 text-xs`}>
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="font-mono text-slate-900 dark:text-white">{startItem}</strong> to{" "}
            <strong className="font-mono text-slate-900 dark:text-white">{endItem}</strong> of{" "}
            <strong className="font-mono text-slate-900 dark:text-white">{totalCount}</strong> transactions
          </span>

          {onPageSizeChange && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-[#30363D]">
              <span className="text-[11px] text-slate-400">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className={`py-0.5 px-2 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                  darkMode
                    ? "bg-[#161B22] border-[#30363D] text-white"
                    : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                darkMode
                  ? "bg-[#161B22] border-[#30363D] hover:bg-[#21262D] text-white"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800"
              }`}
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0B192C] text-white dark:bg-amber-500 dark:text-slate-950 shadow-xs"
                      : darkMode
                      ? "bg-[#161B22] border border-[#30363D] hover:bg-[#21262D] text-slate-300"
                      : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                darkMode
                  ? "bg-[#161B22] border-[#30363D] hover:bg-[#21262D] text-white"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800"
              }`}
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
