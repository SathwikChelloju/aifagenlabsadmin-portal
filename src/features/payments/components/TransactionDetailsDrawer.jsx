import React, { useState, useMemo } from "react";
import {
  Copy,
  Check,
  CreditCard,
  FileText,
  Receipt,
  Activity,
  Mail,
  Globe,
  MoreHorizontal,
  AlertTriangle,
  Clock,
  RotateCcw,
  Download,
  KeyRound,
  ExternalLink,
  History,
  Eye,
} from "lucide-react";
import Drawer from "../../../components/ui/Drawer";
import DropdownMenu from "../../../components/ui/DropdownMenu";
import PaymentMethodBadge from "./PaymentMethodBadge";
import {
  formatCurrency,
  formatShortTxnId,
  getPaymentStatusBadge,
} from "../utils/paymentUtils";
import { getUserInitials } from "../../users/utils/userUtils";
import { useToast } from "../../../hooks/useToast";

/**
 * TransactionDetailsDrawer Component
 * Slide-out inspection drawer with 3 tabs:
 * 1. Overview (Transaction Details & Billing Information)
 * 2. Invoice (Tax Receipt Summary with Full Modal Trigger)
 * 3. Activity (Complete Customer Past Transactions History & Audit Trail)
 */
export default function TransactionDetailsDrawer({
  transaction,
  allTransactions = [],
  onSelectTransaction,
  isOpen,
  onClose,
  onViewInvoice,
  onIssueRefund,
  darkMode = false,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedField, setCopiedField] = useState(null);
  const { addToast } = useToast();

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 1800);
      addToast(`Copied ${fieldName} to clipboard`, "info");
    } else {
      addToast(`${fieldName}: ${text}`, "info");
    }
  };

  const handleExportJson = () => {
    if (!transaction) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transaction, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `transaction-${transaction.id}-ledger.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast(`Exported JSON record for ${transaction.id}`, "success");
  };

  const statusMeta = getPaymentStatusBadge(transaction?.status, darkMode);
  const userName = transaction?.userName || transaction?.candidateName || "Valued Customer";
  const userEmail = transaction?.userEmail || "--";
  const userPhone = transaction?.userPhone || "+1 (555) 234-5678";
  const userLocation = transaction?.userLocation || "Global";

  // Filter all past transactions belonging to this customer
  const userPastTransactions = useMemo(() => {
    if (!transaction) return [];
    if (!allTransactions || allTransactions.length === 0) {
      return [transaction];
    }
    const matched = allTransactions.filter((t) => {
      if (transaction.userId && t.userId) {
        return t.userId === transaction.userId;
      }
      if (transaction.userEmail && t.userEmail) {
        return t.userEmail.toLowerCase() === transaction.userEmail.toLowerCase();
      }
      if (userName && (t.userName || t.candidateName)) {
        return (t.userName || t.candidateName) === userName;
      }
      return false;
    });

    if (matched.length === 0) {
      return [transaction];
    }

    return [...matched].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transaction, allTransactions, userName]);

  // Total lifetime settled revenue by this customer
  const totalSettledByCustomer = useMemo(() => {
    return userPastTransactions
      .filter((t) => t.status === "Successful" || t.status === "Paid")
      .reduce((sum, t) => sum + (typeof t.amount === "number" ? t.amount : parseFloat(t.amount) || 0), 0);
  }, [userPastTransactions]);

  // Card & Typography Tokens matching UserDetailsDrawer
  const cardSurface = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50 border-slate-200/90 shadow-2xs";

  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const labelText = darkMode ? "text-slate-400" : "text-slate-500";
  const valueText = darkMode ? "text-white" : "text-slate-900";
  const secondaryValueText = darkMode ? "text-slate-300" : "text-slate-700";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";

  const labelClass = `text-[10px] font-bold uppercase tracking-wider ${labelText} block mb-0.5`;
  const sectionTitleClass = `text-[11px] font-extrabold uppercase tracking-wider ${headingText}`;

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "invoice", label: "Invoice", icon: Receipt },
    {
      id: "activity",
      label: `Activity (${userPastTransactions.length})`,
      icon: Activity,
    },
  ];

  if (!transaction) return null;

  // Drawer Header
  const customHeader = (
    <div className="flex items-start gap-3.5 pr-2">
      {transaction.userAvatar ? (
        <img
          src={transaction.userAvatar}
          alt={userName}
          className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
          {getUserInitials(userName)}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`text-base font-extrabold leading-tight truncate ${headingText}`}>
            {userName}
          </h3>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${statusMeta.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
            {statusMeta.label}
          </span>
          {transaction.plan && (
            <span
              className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                darkMode
                  ? "bg-[#21262D] text-slate-300 border-[#30363D]"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {transaction.plan}
            </span>
          )}
        </div>

        {/* Transaction ID with Copy */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`font-mono text-xs font-bold ${valueText}`}>
            {transaction.id}
          </span>
          <button
            type="button"
            onClick={() => handleCopy(transaction.id, "Transaction ID")}
            className={`p-1 rounded transition-colors cursor-pointer ${
              darkMode
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
            title="Copy Transaction ID"
          >
            {copiedField === "Transaction ID" ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Date and Time */}
        <div className={`flex items-center gap-2 mt-1 text-[11px] font-mono ${subText}`}>
          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{transaction.formattedDate || transaction.date}</span>
        </div>
      </div>
    </div>
  );

  const canRefund = transaction.status === "Successful" || transaction.status === "Paid";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      customHeader={customHeader}
      width="w-full max-w-[500px]"
      contentClassName="p-0"
      darkMode={darkMode}
      footer={
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {transaction.invoiceNumber && (
              <button
                type="button"
                onClick={() => onViewInvoice && onViewInvoice(transaction)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  darkMode
                    ? "bg-[#21262D] border-[#30363D] hover:bg-[#30363D] text-slate-200"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-xs"
                }`}
              >
                <Receipt className="w-3.5 h-3.5 text-amber-500" />
                <span>View Invoice</span>
              </button>
            )}

            <button
              type="button"
              disabled={!canRefund}
              onClick={() => onIssueRefund && onIssueRefund(transaction)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                canRefund
                  ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-400"
                  : darkMode
                  ? "bg-[#21262D] border-[#30363D] text-slate-500"
                  : "bg-slate-100 border-slate-200 text-slate-400"
              }`}
              title={canRefund ? "Issue refund for settled transaction" : "Cannot refund this status"}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refund Payment</span>
            </button>
          </div>

          {/* More Actions Menu */}
          <DropdownMenu
            direction="up"
            align="right"
            trigger={
              <button
                type="button"
                className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  darkMode
                    ? "bg-amber-500 hover:bg-amber-600 border-amber-600 text-slate-950 font-extrabold"
                    : "bg-[#0B192C] hover:bg-slate-800 text-white shadow-xs"
                }`}
                title="More transaction actions"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
                <span>More</span>
              </button>
            }
            items={[
              {
                label: "Copy Transaction ID",
                icon: KeyRound,
                onClick: () => handleCopy(transaction.id, "Transaction ID"),
              },
              ...(transaction.invoiceNumber
                ? [
                    {
                      label: `Copy Invoice (${transaction.invoiceNumber})`,
                      icon: Receipt,
                      onClick: () => handleCopy(transaction.invoiceNumber, "Invoice Number"),
                    },
                  ]
                : []),
              {
                label: "Copy Customer Email",
                icon: Mail,
                onClick: () => handleCopy(userEmail, "Customer Email"),
              },
              {
                label: "Export Ledger Record (JSON)",
                icon: Download,
                onClick: handleExportJson,
              },
            ]}
          />
        </div>
      }
    >
      {/* Tab Navigation Strip */}
      <div
        className={`border-b px-6 sticky top-0 z-10 ${
          darkMode
            ? "bg-[#161B22] border-[#30363D]"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center gap-6 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? darkMode
                      ? "border-amber-400 text-white"
                      : "border-[#0B192C] text-[#0B192C]"
                    : darkMode
                    ? "border-transparent text-slate-400 hover:text-white"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#D97706]" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Diagnostic Alert for Failed or Refunded */}
            {transaction.status === "Failed" && (
              <div className="p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-rose-900 dark:text-rose-300">
                      Payment Failure Telemetry
                    </h5>
                    <p className="mt-0.5 text-rose-800 dark:text-rose-400 font-mono text-[11px]">
                      {transaction.failureReason || "Gateway declined authorization (generic card error)."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {transaction.status === "Refunded" && (
              <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
                <div className="flex items-start gap-2.5">
                  <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-amber-900 dark:text-amber-300">
                      Ledger Reversal Completed
                    </h5>
                    <p className="mt-0.5 text-amber-800 dark:text-amber-400 text-[11px]">
                      Reason: <span className="font-mono">{transaction.refundReason || "Administrative refund"}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CARD 1: Transaction Details */}
            <div className={`p-4.5 rounded-2xl border transition-colors ${cardSurface}`}>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-[#30363D]">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <span className={sectionTitleClass}>Transaction Details</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${statusMeta.badge}`}>
                  {statusMeta.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div>
                  <span className={labelClass}>Transaction ID</span>
                  <span className={`font-mono font-bold ${valueText}`}>
                    {transaction.id}
                  </span>
                </div>

                <div>
                  <span className={labelClass}>Invoice Number</span>
                  {transaction.invoiceNumber ? (
                    <button
                      type="button"
                      onClick={() => onViewInvoice && onViewInvoice(transaction)}
                      className="font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{transaction.invoiceNumber}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className={`font-mono ${subText}`}>None generated</span>
                  )}
                </div>

                <div>
                  <span className={labelClass}>Amount & Currency</span>
                  <span className={`font-mono font-extrabold text-sm ${valueText}`}>
                    {formatCurrency(transaction.amount, transaction.currency, transaction.currencySymbol)}
                  </span>
                </div>

                <div>
                  <span className={labelClass}>Payment Method</span>
                  <div className="mt-1">
                    <PaymentMethodBadge
                      method={transaction.paymentMethod}
                      type={transaction.paymentMethodType}
                    />
                  </div>
                </div>

                <div>
                  <span className={labelClass}>Transaction Date & Time</span>
                  <span className={`font-mono text-[11px] ${secondaryValueText}`}>
                    {transaction.formattedDate || transaction.date}
                  </span>
                </div>

                <div>
                  <span className={labelClass}>Associated Plan</span>
                  <span className={`font-bold ${valueText}`}>
                    {transaction.plan || "Concierge Tier"}
                  </span>
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-200/60 dark:border-[#30363D]/60">
                  <span className={labelClass}>Service Description</span>
                  <span className={`text-xs ${secondaryValueText}`}>
                    {transaction.description || "Career Placement Concierge"}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className={labelClass}>Settlement Destination</span>
                  <span className={`font-mono text-[11px] ${subText}`}>
                    {transaction.settlementAccount || "AIFA Global Operations"}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 2: Billing Details */}
            <div className={`p-4.5 rounded-2xl border transition-colors ${cardSurface}`}>
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-200/80 dark:border-[#30363D]">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className={sectionTitleClass}>Billing Details</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div>
                  <span className={labelClass}>Billing Name</span>
                  <span className={`font-bold ${valueText}`}>
                    {userName}
                  </span>
                </div>

                <div>
                  <span className={labelClass}>Email Address</span>
                  <span className={`font-mono truncate block ${secondaryValueText}`}>
                    {userEmail}
                  </span>
                </div>

                <div>
                  <span className={labelClass}>Phone Number</span>
                  <span className={`font-mono ${secondaryValueText}`}>
                    {userPhone}
                  </span>
                </div>

                <div>
                  <span className={labelClass}>Country / Location</span>
                  <span className={`font-medium ${secondaryValueText}`}>
                    {userLocation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: INVOICE ===================== */}
        {activeTab === "invoice" && (
          <div className="space-y-4">
            {transaction.invoiceNumber ? (
              <div className={`p-5 rounded-2xl border transition-colors ${cardSurface} space-y-4`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-[#30363D]">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4.5 h-4.5 text-amber-500" />
                    <div>
                      <h4 className={`text-xs font-extrabold ${headingText}`}>
                        Invoice {transaction.invoiceNumber}
                      </h4>
                      <p className={`text-[10px] font-mono ${subText}`}>
                        Issued on {transaction.formattedDate?.split("·")[0] || "Oct 12, 2026"}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${statusMeta.badge}`}>
                    {statusMeta.label}
                  </span>
                </div>

                {/* Invoice Summary Card */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-[#30363D]/50">
                    <span className={subText}>Billed To</span>
                    <span className={`font-bold ${valueText}`}>{userName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-[#30363D]/50">
                    <span className={subText}>Email</span>
                    <span className={`font-mono ${secondaryValueText}`}>{userEmail}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-[#30363D]/50">
                    <span className={subText}>Item Description</span>
                    <span className={`font-medium ${secondaryValueText}`}>{transaction.description}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-[#30363D]/50">
                    <span className={subText}>Quantity</span>
                    <span className={`font-mono ${valueText}`}>1</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-sm">
                    <span className={headingText}>Total Paid</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">
                      {formatCurrency(transaction.amount, transaction.currency, transaction.currencySymbol)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onViewInvoice && onViewInvoice(transaction)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0B192C] hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Open Full Printable Invoice Modal</span>
                </button>
              </div>
            ) : (
              <div className={`p-8 text-center rounded-2xl border ${cardSurface} space-y-2`}>
                <Receipt className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <h4 className={`text-xs font-bold ${headingText}`}>
                  No Official Invoice Generated
                </h4>
                <p className={`text-[11px] max-w-xs mx-auto ${subText}`}>
                  Invoices are generated upon successful settlement. Pending or declined transactions do not have tax receipts.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: ACTIVITY (PAST TRANSACTIONS) ===================== */}
        {activeTab === "activity" && (
          <div className="space-y-4">
            {/* Header: Customer History Summary */}
            <div className={`p-4.5 rounded-2xl border transition-colors ${cardSurface}`}>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-[#30363D]">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-500" />
                  <span className={sectionTitleClass}>Past Transactions History</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-[#21262D] ${subText}`}>
                  {userPastTransactions.length} Total Records
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className={labelClass}>Customer</span>
                  <span className={`font-bold ${headingText}`}>{userName}</span>
                </div>
                <div className="text-right">
                  <span className={labelClass}>Lifetime Settled</span>
                  <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalSettledByCustomer)}
                  </span>
                </div>
              </div>
            </div>

            {/* List of All Past Transactions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${labelText}`}>
                  All Transactions ({userPastTransactions.length})
                </span>
                <span className={`text-[10px] font-mono ${subText}`}>
                  Sorted by date (latest first)
                </span>
              </div>

              {userPastTransactions.map((pastTxn) => {
                const isCurrent = pastTxn.id === transaction.id;
                const pastStatusMeta = getPaymentStatusBadge(pastTxn.status, darkMode);

                return (
                  <div
                    key={pastTxn.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? darkMode
                          ? "bg-amber-500/10 border-amber-500/40 shadow-xs"
                          : "bg-amber-50/60 border-amber-300 shadow-xs ring-1 ring-amber-400/30"
                        : `${cardSurface} hover:border-slate-300 dark:hover:border-slate-700`
                    }`}
                  >
                    {/* Top Row: Txn ID, Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-extrabold ${isCurrent ? "text-[#D97706]" : valueText}`}>
                          {formatShortTxnId(pastTxn.id)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(pastTxn.id, `ID ${pastTxn.id}`)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            darkMode
                              ? "text-slate-400 hover:text-white hover:bg-slate-800"
                              : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          }`}
                          title="Copy ID"
                        >
                          {copiedField === `ID ${pastTxn.id}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60">
                            Current Selection
                          </span>
                        )}
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${pastStatusMeta.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${pastStatusMeta.dot}`} />
                        {pastStatusMeta.label}
                      </span>
                    </div>

                    {/* Middle Row: Description & Amount */}
                    <div className="flex items-center justify-between gap-2 text-xs mb-2.5">
                      <div className="min-w-0 flex-1">
                        <p className={`font-semibold truncate ${headingText}`}>
                          {pastTxn.description || "Career Placement Concierge"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[11px] font-medium ${subText}`}>
                            {pastTxn.plan || "Concierge"} Tier
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">·</span>
                          <PaymentMethodBadge
                            method={pastTxn.paymentMethod}
                            type={pastTxn.paymentMethodType}
                          />
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`font-mono font-extrabold text-sm ${valueText}`}>
                          {formatCurrency(pastTxn.amount, pastTxn.currency, pastTxn.currencySymbol)}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">
                          {pastTxn.currency || "USD"}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Date & Actions */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60 dark:border-[#30363D]/60 text-xs">
                      <div className={`flex items-center gap-1.5 font-mono text-[11px] ${subText}`}>
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{pastTxn.formattedDate || pastTxn.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {pastTxn.invoiceNumber && (
                          <button
                            type="button"
                            onClick={() => onViewInvoice && onViewInvoice(pastTxn)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-[#161B22] text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors cursor-pointer shadow-2xs"
                            title={`View Invoice ${pastTxn.invoiceNumber}`}
                          >
                            <Receipt className="w-3 h-3 text-amber-500" />
                            <span>{pastTxn.invoiceNumber}</span>
                          </button>
                        )}

                        {!isCurrent && onSelectTransaction && (
                          <button
                            type="button"
                            onClick={() => onSelectTransaction(pastTxn)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${
                              darkMode
                                ? "bg-[#21262D] border-[#30363D] hover:bg-[#30363D] text-slate-200"
                                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <Eye className="w-3 h-3 text-amber-500" />
                            <span>Inspect</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Transaction Audit Telemetry Trail */}
            <div className={`p-4 rounded-2xl border transition-colors ${cardSurface} mt-4`}>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/80 dark:border-[#30363D]">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Current Txn Lifecycle ({formatShortTxnId(transaction.id)})
                  </span>
                </div>
                <span className={`text-[10px] font-mono ${subText}`}>
                  Telemetry
                </span>
              </div>

              <div className="relative pl-5 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-[#30363D]">
                {transaction.activities && transaction.activities.length > 0 ? (
                  transaction.activities.map((act, index) => (
                    <div key={act.id || index} className="relative">
                      <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-amber-500 border border-white dark:border-[#0D1117]" />
                      <div className="text-xs">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${headingText}`}>{act.title}</span>
                          <span className={`text-[10px] font-mono ${subText}`}>{act.timestamp}</span>
                        </div>
                        <p className={`mt-0.5 text-[11px] leading-relaxed ${secondaryValueText}`}>
                          {act.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative">
                    <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-[#0D1117]" />
                    <div className="text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${headingText}`}>Payment Processed</span>
                        <span className={`text-[10px] font-mono ${subText}`}>{transaction.formattedDate}</span>
                      </div>
                      <p className={`mt-0.5 text-[11px] leading-relaxed ${secondaryValueText}`}>
                        Processed via {transaction.paymentMethod}. Status: {transaction.status}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
