import React from "react";
import {
  MoreHorizontal,
  Eye,
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  Copy,
} from "lucide-react";
import DropdownMenu from "../../../components/ui/DropdownMenu";
import { useToast } from "../../../hooks/useToast";

/**
 * UserActionsMenu Component
 * Three-dot menu for row-level user operations.
 */
export default function UserActionsMenu({
  user,
  onViewDetails,
  onChangePlan,
  onToggleStatus,
  darkMode = false,
}) {
  const { addToast } = useToast();

  const isSuspended = user.status === "Suspended";

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(user.email);
      addToast(`Copied ${user.email} to clipboard`, "info");
    } else {
      addToast(`Email: ${user.email}`, "info");
    }
  };

  const menuItems = [
    {
      label: "View User",
      icon: Eye,
      onClick: () => onViewDetails(user),
    },
    {
      label: "Change Plan",
      icon: CreditCard,
      onClick: () => onChangePlan(user),
    },
    {
      label: "Copy Email",
      icon: Copy,
      onClick: handleCopyEmail,
    },
    { type: "divider" },
    isSuspended
      ? {
          label: "Activate Account",
          icon: ShieldCheck,
          onClick: () => onToggleStatus(user, "Active"),
        }
      : {
          label: "Suspend Account",
          icon: ShieldAlert,
          danger: true,
          onClick: () => onToggleStatus(user, "Suspended"),
        },
  ];

  return (
    <DropdownMenu
      align="right"
      trigger={
        <button
          type="button"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            darkMode
              ? "text-slate-400 hover:text-white hover:bg-[#21262D]"
              : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          }`}
          title="User actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      }
      items={menuItems}
    />
  );
}
