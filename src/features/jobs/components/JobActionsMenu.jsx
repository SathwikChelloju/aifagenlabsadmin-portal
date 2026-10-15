import {
  MoreHorizontal,
  Eye,
  EyeOff,
  Edit3,
  Copy,
  ExternalLink,
  Trash2,
  PauseCircle,
  PlayCircle,
  XCircle,
} from "lucide-react";
import DropdownMenu from "../../../components/ui/DropdownMenu";
import { useToast } from "../../../hooks/useToast";

/**
 * JobActionsMenu Component
 * Three-dot contextual menu for row-level job actions:
 * - View Details
 * - Edit Job
 * - Hide / Unhide Job
 * - Change Status (Pause, Activate, Close)
 * - Copy Job ID
 * - Open Official URL (for public jobs with applicationUrl)
 * - Delete Job (prompts confirmation modal)
 */
export default function JobActionsMenu({
  job,
  onViewDetails,
  onEditJob,
  onDeleteJob,
  onStatusChange,
  onHideJob,
  onUnhideJob,
  _darkMode = false,
}) {
  const { addToast } = useToast();

  const handleCopyId = () => {
    if (!job?.id) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(job.id);
      addToast(`Copied Job ID ${job.id}`, "info");
    } else {
      addToast(`ID: ${job.id}`, "info");
    }
  };

  const handleOpenUrl = () => {
    if (job?.applicationUrl) {
      window.open(job.applicationUrl, "_blank", "noopener,noreferrer");
    }
  };

  const currentStatus = (job?.status || "Active").toLowerCase();

  const menuItems = [
    {
      label: "View Details",
      icon: Eye,
      onClick: () => onViewDetails && onViewDetails(job),
    },
    {
      label: "Edit Job",
      icon: Edit3,
      onClick: () => onEditJob && onEditJob(job),
    },
    {
      label: "Copy Job ID",
      icon: Copy,
      onClick: handleCopyId,
    },
    {
      label: job?.isHidden ? "Unhide Job" : "Hide Job",
      icon: job?.isHidden ? Eye : EyeOff,
      onClick: () => {
        if (job?.isHidden) {
          if (onUnhideJob) onUnhideJob(job);
        } else {
          if (onHideJob) onHideJob(job);
        }
      },
    },
  ];

  // Official public posting external URL
  if (job?.type === "public" && job?.applicationUrl) {
    menuItems.push({
      label: "Open Official Posting",
      icon: ExternalLink,
      onClick: handleOpenUrl,
    });
  }

  // Quick Status change options
  const statusActions = [];
  if (currentStatus === "active" || currentStatus === "open") {
    statusActions.push({
      label: "Pause Job",
      icon: PauseCircle,
      onClick: () => onStatusChange && onStatusChange(job.id, "Paused", job.title),
    });
    statusActions.push({
      label: "Close Job",
      icon: XCircle,
      onClick: () => onStatusChange && onStatusChange(job.id, "Closed", job.title),
    });
  } else if (currentStatus === "paused") {
    statusActions.push({
      label: "Activate Job",
      icon: PlayCircle,
      onClick: () => onStatusChange && onStatusChange(job.id, "Active", job.title),
    });
    statusActions.push({
      label: "Close Job",
      icon: XCircle,
      onClick: () => onStatusChange && onStatusChange(job.id, "Closed", job.title),
    });
  } else if (currentStatus === "draft") {
    statusActions.push({
      label: "Publish & Activate",
      icon: PlayCircle,
      onClick: () => onStatusChange && onStatusChange(job.id, "Active", job.title),
    });
  } else if (currentStatus === "closed" || currentStatus === "filled") {
    statusActions.push({
      label: "Reopen Job",
      icon: PlayCircle,
      onClick: () => onStatusChange && onStatusChange(job.id, "Active", job.title),
    });
  }

  if (statusActions.length > 0) {
    menuItems.push({ type: "divider" });
    menuItems.push(...statusActions);
  }

  // Delete Action
  menuItems.push({ type: "divider" });
  menuItems.push({
    label: "Delete Job",
    icon: Trash2,
    danger: true,
    onClick: () => onDeleteJob && onDeleteJob(job),
  });

  return (
    <DropdownMenu
      align="right"
      trigger={
        <button
          type="button"
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          title="Job Actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      }
      items={menuItems}
    />
  );
}
