import React from "react";
import {
  MoreHorizontal,
  Eye,
  Receipt,
  Copy,
  RotateCcw,
} from "lucide-react";
import DropdownMenu from "../../../components/ui/DropdownMenu";
import { useToast } from "../../../hooks/useToast";

/**
 * PaymentActionsMenu Component
 * Three-dot menu for row-level transaction actions matching the reference screenshot.
 */
export default function PaymentActionsMenu({
  transaction,
  onViewDetails,
  onViewInvoice,
  onIssueRefund,
  darkMode = false,
}) {
  const { addToast } = useToast();

  const handleCopyId = () => {
    if (!transaction?.id) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(transaction.id);
      addToast(`Copied transaction ID ${transaction.id}`, "info");
    } else {
      addToast(`ID: ${transaction.id}`, "info");
    }
  };

  const isRefundable =
    transaction?.status === "Successful" || transaction?.status === "Paid";

  const menuItems = [
    {
      label: "View Transaction",
      icon: Eye,
      onClick: () => onViewDetails && onViewDetails(transaction),
    },
    ...(transaction?.invoiceNumber
      ? [
          {
            label: "View Invoice",
            icon: Receipt,
            onClick: () => onViewInvoice && onViewInvoice(transaction),
          },
        ]
      : []),
    {
      label: "Copy Transaction ID",
      icon: Copy,
      onClick: handleCopyId,
    },
    ...(isRefundable && onIssueRefund
      ? [
          { type: "divider" },
          {
            label: "Issue Refund",
            icon: RotateCcw,
            danger: true,
            onClick: () => onIssueRefund(transaction),
          },
        ]
      : []),
  ];

  return (
    <DropdownMenu
      align="right"
      trigger={
        <button
          type="button"
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            darkMode
              ? "bg-[#21262D] border-[#30363D] hover:bg-[#30363D] text-slate-300 hover:text-white"
              : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs"
          }`}
          title="Transaction Actions"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      }
      items={menuItems}
    />
  );
}
