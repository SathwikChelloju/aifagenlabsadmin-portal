/**
 * User Utilities & Formatting Helpers
 */

export function formatTokens(num) {
  if (num === 0) return "0 tokens";
  if (!num) return "--";
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M tokens`;
  }
  if (num >= 1000) {
    return `${Math.round(num / 1000)}k tokens`;
  }
  return `${num} tokens`;
}

export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function getUserInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getPlanBadgeVariant(plan) {
  switch (plan) {
    case "Premium":
      return "navy";
    case "Basic":
      return "neutral";
    case "None":
    default:
      return "neutral";
  }
}

export function getStatusBadgeVariant(status) {
  switch (status) {
    case "Active":
      return "success";
    case "Past Due":
      return "warning";
    case "Suspended":
      return "danger";
    case "Inactive":
    default:
      return "neutral";
  }
}

export function formatJoinedDate(dateStr) {
  if (!dateStr) return "--";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "--";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return "--";
  }
}
