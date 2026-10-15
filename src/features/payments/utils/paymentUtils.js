/**
 * Payment and Financial Ledger Utility Functions
 */

/**
 * Formats a monetary amount into currency representation
 * @param {number|string} amount 
 * @param {string} currency 
 * @param {string} symbol 
 * @returns {string} e.g. "$79.00"
 */
export function formatCurrency(amount, currency = "USD", symbol) {
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    INR: "₹",
    JPY: "¥",
    GBP: "£",
  };
  const activeSymbol = symbol || currencySymbols[currency] || "$";
  if (amount === undefined || amount === null) return `${activeSymbol}0.00`;
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
  if (isNaN(num)) return `${activeSymbol}0.00`;
  if (currency === "JPY") {
    return `${activeSymbol}${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `${activeSymbol}${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Shortens a transaction ID for table display (e.g. txn_88291 -> #88291)
 * @param {string} id 
 * @returns {string}
 */
export function formatShortTxnId(id) {
  if (!id) return "--";
  if (id.startsWith("txn_")) {
    return `#${id.replace("txn_", "")}`;
  }
  return id;
}

/**
 * Formats ISO or string dates into human-readable format
 * @param {string} dateStr 
 * @returns {string} e.g. "Oct 10, 2026 · 14:22"
 */
export function formatPaymentDate(dateStr) {
  if (!dateStr) return "--";
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;

  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

/**
 * Returns accessible styling for transaction status badges
 * @param {string} status 
 * @param {boolean} darkMode 
 * @returns {Object} badgeClasses & dotClasses
 */
export function getPaymentStatusBadge(status, darkMode = false) {
  switch (status) {
    case "Successful":
    case "Paid":
      return {
        badge: darkMode
          ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60"
          : "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
        label: "Successful",
      };
    case "Pending":
      return {
        badge: darkMode
          ? "bg-amber-950/40 text-amber-300 border-amber-800/60"
          : "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
        label: "Pending",
      };
    case "Failed":
      return {
        badge: darkMode
          ? "bg-rose-950/40 text-rose-300 border-rose-800/60"
          : "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-500",
        label: "Failed",
      };
    case "Refunded":
      return {
        badge: darkMode
          ? "bg-slate-800 text-slate-300 border-slate-700"
          : "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-400",
        label: "Refunded",
      };
    default:
      return {
        badge: darkMode
          ? "bg-slate-800 text-slate-400 border-slate-700"
          : "bg-slate-100 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
        label: status || "Unknown",
      };
  }
}

/**
 * Generates an RFC 4180-compliant CSV string from payment transactions
 * @param {Array} transactions 
 * @returns {string}
 */
export function generatePaymentsCsv(transactions = []) {
  const headers = [
    "Transaction ID",
    "Customer Name",
    "Email",
    "Amount",
    "Currency",
    "Payment Method",
    "Date",
    "Status",
    "Plan",
    "Invoice Number",
    "Gateway",
  ];

  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = transactions.map((t) => [
    t.id,
    t.userName || t.candidateName || "",
    t.userEmail || "",
    t.amount !== undefined ? t.amount.toFixed(2) : "0.00",
    t.currency || "USD",
    t.paymentMethod || "",
    t.date || "",
    t.status || "",
    t.plan || "",
    t.invoiceNumber || "",
    t.gateway || "",
  ]);

  const csvContent = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ].join("\r\n");

  return csvContent;
}
