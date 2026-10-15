import React, { useState } from "react";
import {
  Globe,
  Copy,
  Check,
  Edit3,
  CreditCard,
  FileText,
  Briefcase,
  Activity,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Bookmark,
  Shield,
  ShieldAlert,
  ShieldCheck,
  MoreHorizontal,
  ChevronRight,
  ExternalLink,
  Download,
  KeyRound,
} from "lucide-react";
import Drawer from "../../../components/ui/Drawer";
import DropdownMenu from "../../../components/ui/DropdownMenu";
import EditProfileModal from "./EditProfileModal";
import ContactUserModal from "./ContactUserModal";
import ImpersonateInfoModal from "./ImpersonateInfoModal";
import InvoicePreviewModal from "./InvoicePreviewModal";
import {
  formatTokens,
  getUserInitials,
  formatJoinedDate,
} from "../utils/userUtils";
import { useToast } from "../../../hooks/useToast";

/**
 * UserDetailsDrawer Component
 * Production right-side slide-out inspection drawer with 4 tabs, profile management, and actions footer.
 * Fully synchronized with the application theme state.
 */
export default function UserDetailsDrawer({
  user,
  isOpen,
  onClose,
  onChangePlan,
  onToggleStatus,
  onSaveProfile,
  darkMode = false,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedField, setCopiedField] = useState(null);

  // Modals inside drawer
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isImpersonateModalOpen, setIsImpersonateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const { addToast } = useToast();

  if (!user) return null;

  const isSuspended = user.status === "Suspended";

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

  const handleExportUserData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `candidate-${user.id}-profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast(`Exported JSON profile for ${user.name}`, "success");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "applications", label: "Applications", icon: Briefcase },
  ];

  // Coordinated design tokens matching Dashboard conventions
  const cardSurface = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50 border-slate-200/90 shadow-2xs";

  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const labelText = darkMode ? "text-slate-400" : "text-slate-500";
  const valueText = darkMode ? "text-white" : "text-slate-900";
  const secondaryValueText = darkMode ? "text-slate-300" : "text-slate-700";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const dividerBorder = darkMode ? "border-[#30363D]" : "border-slate-200/80";

  const labelClass = `text-[10px] font-bold uppercase tracking-wider ${labelText} block mb-0.5`;
  const sectionTitleClass = `text-[11px] font-extrabold uppercase tracking-wider ${headingText}`;

  const customHeader = (
    <div className="flex items-start gap-3.5 pr-2">
      {/* Avatar */}
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className={`w-13 h-13 rounded-full object-cover border-2 shadow-xs shrink-0 ${
            darkMode ? "border-[#30363D]" : "border-slate-200"
          }`}
        />
      ) : (
        <div className="w-13 h-13 rounded-full bg-[#0B192C] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
          {getUserInitials(user.name)}
        </div>
      )}

      {/* User Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`text-base font-extrabold leading-tight truncate ${headingText}`}>
            {user.name}
          </h3>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              user.status === "Active"
                ? darkMode
                  ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/60"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : user.status === "Past Due"
                ? darkMode
                  ? "bg-amber-950/40 text-amber-300 border border-amber-800/60"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
                : user.status === "Suspended"
                ? darkMode
                  ? "bg-rose-950/40 text-rose-300 border border-rose-800/60"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
                : darkMode
                ? "bg-slate-800 text-slate-400 border border-slate-700"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                user.status === "Active"
                  ? "bg-emerald-500 animate-pulse"
                  : user.status === "Past Due"
                  ? "bg-amber-500"
                  : user.status === "Suspended"
                  ? "bg-rose-500"
                  : "bg-slate-400"
              }`}
            />
            {user.status}
          </span>
          <span
            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              darkMode
                ? "bg-[#21262D] text-slate-300 border-[#30363D]"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {user.plan || "None"} Tier
          </span>
        </div>

        {/* Email with copy */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className={`font-mono text-xs font-semibold truncate ${secondaryValueText}`}>
            {user.email}
          </span>
          <button
            type="button"
            onClick={() => handleCopy(user.email, "Email")}
            className={`p-1 rounded transition-colors cursor-pointer ${
              darkMode
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
            title="Copy email"
          >
            {copiedField === "Email" ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Mobile with copy + Joined info */}
        <div className={`flex flex-wrap items-center gap-x-3.5 gap-y-1 mt-1 text-[11px] ${subText}`}>
          {user.phone && (
            <div className="flex items-center gap-1 font-mono font-medium">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{user.phone}</span>
              <button
                type="button"
                onClick={() => handleCopy(user.phone, "Phone")}
                className={`p-0.5 rounded transition-colors cursor-pointer ${
                  darkMode
                    ? "text-slate-400 hover:text-white hover:bg-slate-800"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
                title="Copy phone"
              >
                {copiedField === "Phone" ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          )}
          <div className="flex items-center gap-1 font-mono font-medium">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Joined {formatJoinedDate(user.joinedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        customHeader={customHeader}
        width="w-full max-w-[490px]"
        contentClassName="p-0"
        darkMode={darkMode}
        footer={
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsImpersonateModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  darkMode
                    ? "bg-[#21262D] border-[#30363D] hover:bg-[#30363D] text-slate-200"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-xs"
                }`}
                title="View SOC2 impersonation audit guidelines"
              >
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                <span>Impersonate</span>
              </button>

              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  darkMode
                    ? "bg-[#21262D] border-[#30363D] hover:bg-[#30363D] text-slate-200"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-xs"
                }`}
                title="Send notification email to user"
              >
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span>Contact User</span>
              </button>
            </div>

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
                  title="More candidate actions"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                  <span>More</span>
                </button>
              }
              items={[
                {
                  label: "Copy User ID",
                  icon: KeyRound,
                  onClick: () => handleCopy(user.id, "User ID"),
                },
                {
                  label: "Copy Email",
                  icon: Mail,
                  onClick: () => handleCopy(user.email, "Email"),
                },
                {
                  label: "View Activity Feed",
                  icon: Activity,
                  onClick: () => setActiveTab("activity"),
                },
                {
                  label: "Change Subscription Plan",
                  icon: CreditCard,
                  onClick: () => onChangePlan(user),
                },
                {
                  label: "Export Profile (JSON)",
                  icon: Download,
                  onClick: handleExportUserData,
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
              ]}
            />
          </div>
        }
      >
        {/* Tab Navigation */}
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

        {/* Tab Content */}
        <div className="p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* SECTION A: KEY INFORMATION */}
              <div className={`p-4.5 rounded-2xl border ${cardSurface} space-y-3.5`}>
                <div className="flex items-center justify-between">
                  <div className={sectionTitleClass}>
                    Key Profile Information
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-[#D97706] hover:text-[#B45309] hover:underline cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <span className={labelClass}>Full Name</span>
                    <span className={`font-bold ${valueText}`}>{user.name}</span>
                  </div>

                  <div>
                    <span className={labelClass}>Email</span>
                    <span className={`font-mono font-medium truncate block ${secondaryValueText}`}>
                      {user.email}
                    </span>
                  </div>

                  <div>
                    <span className={labelClass}>Mobile</span>
                    <span className={`font-mono font-medium ${secondaryValueText}`}>
                      {user.phone || "--"}
                    </span>
                  </div>

                  <div>
                    <span className={labelClass}>Location</span>
                    <span className={`font-semibold ${secondaryValueText}`}>
                      {user.location || "--"}
                    </span>
                  </div>

                  <div>
                    <span className={labelClass}>Area of Interest</span>
                    <span className={`font-semibold ${secondaryValueText}`}>
                      {user.domain || "Technology"}
                    </span>
                  </div>

                  <div>
                    <span className={labelClass}>Role</span>
                    <span className={`font-semibold ${secondaryValueText}`}>
                      {user.role || "Candidate"}
                    </span>
                  </div>
                </div>

                {user.headline && (
                  <div className={`pt-2.5 border-t text-xs ${dividerBorder}`}>
                    <span className={labelClass}>Professional Headline</span>
                    <p className={`font-medium leading-relaxed ${secondaryValueText}`}>
                      {user.headline}
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION B: SUBSCRIPTION */}
              <div className={`p-4.5 rounded-2xl border ${cardSurface} space-y-3.5`}>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 ${sectionTitleClass}`}>
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Subscription Details</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChangePlan(user)}
                    className="flex items-center gap-1 text-xs font-bold text-[#D97706] hover:text-[#B45309] hover:underline cursor-pointer"
                  >
                    <span>Change Plan</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <span className={labelClass}>Current Tier</span>
                    <span className={`font-extrabold ${valueText}`}>
                      {user.plan || "None"}
                    </span>
                  </div>

                  <div>
                    <span className={labelClass}>Subscription Status</span>
                    <span
                      className={`font-bold ${
                        user.status === "Active"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : user.status === "Suspended"
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div>
                    <span className={labelClass}>Start Date</span>
                    <span className={`font-mono font-medium ${secondaryValueText}`}>
                      {user.subscription?.startDate || "--"}
                    </span>
                  </div>

                  <div>
                    <span className={labelClass}>Next Renewal</span>
                    <span className={`font-mono font-medium ${secondaryValueText}`}>
                      {user.subscription?.renewalDate || "--"}
                    </span>
                  </div>

                  <div>
                    <span className={labelClass}>Last Payment</span>
                    <span className={`font-mono font-extrabold ${valueText}`}>
                      {user.subscription?.lastPayment || "$0.00"}
                    </span>
                  </div>

                  <div>
                    <span className={labelClass}>Payment Method</span>
                    <span className={`font-medium ${secondaryValueText}`}>
                      {user.subscription?.paymentMethod || "--"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION C: USAGE SUMMARY */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className={sectionTitleClass}>
                    Platform Usage Summary
                  </div>
                  <button
                    type="button"
                    onClick={() => addToast("Navigating to AI Consumption Analytics: Module is configured for Phase 7.", "info")}
                    className={`flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer ${
                      darkMode
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <span>View All Usage</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-4 rounded-2xl border ${cardSurface}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${labelText}`}>
                        AI Compute
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className={`text-xl font-mono font-extrabold ${headingText}`}>
                      {formatTokens(user.aiUsageTokens)}
                    </div>
                    <div className={`text-[11px] font-mono mt-0.5 ${subText}`}>
                      ~{user.aiUsageCalls || 0} API invocations
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${cardSurface}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${labelText}`}>
                        Saved Jobs
                      </span>
                      <Bookmark className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div className={`text-xl font-mono font-extrabold ${headingText}`}>
                      {user.savedJobsCount || 0}
                    </div>
                    <div className={`text-[11px] font-mono mt-0.5 ${subText}`}>
                      Target abroad roles
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION D: MOBILITY TRACK */}
              <div className={`p-4.5 rounded-2xl border ${cardSurface} space-y-2.5 text-xs`}>
                <div className={`flex items-center gap-1.5 ${sectionTitleClass}`}>
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Target Mobility Track</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`font-medium ${labelText}`}>Destination:</span>
                  <span className={`font-bold ${valueText}`}>
                    {user.countryGoal || "Worldwide"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`font-medium ${labelText}`}>Visa Pathway:</span>
                  <span className={`font-mono font-semibold ${secondaryValueText}`}>
                    {user.targetVisa || "Skilled Employment"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`font-medium ${labelText}`}>ATS Resume Score:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {user.atsScore || 85}% Match
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY TIMELINE */}
          {activeTab === "activity" && (
            <div className="space-y-4">
              <div className={sectionTitleClass}>
                Chronological Activity History
              </div>

              {(!user.activities || user.activities.length === 0) ? (
                <div className={`py-12 text-center text-xs ${subText}`}>
                  No activity events recorded yet.
                </div>
              ) : (
                <div
                  className={`relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 ${
                    darkMode ? "before:bg-[#30363D]" : "before:bg-slate-200"
                  }`}
                >
                  {user.activities.map((act) => (
                    <div key={act.id} className="relative group">
                      <div
                        className={`absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full ring-4 ${
                          darkMode
                            ? "bg-amber-400 ring-[#161B22]"
                            : "bg-[#0B192C] ring-white"
                        }`}
                      />
                      <div className={`p-4 rounded-xl border ${cardSurface} space-y-1.5`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-bold ${headingText}`}>
                            {act.title}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                              darkMode
                                ? "bg-[#21262D] text-slate-300 border-[#30363D]"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {act.badge || "Event"}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed font-normal ${secondaryValueText}`}>
                          {act.description}
                        </p>
                        <div className={`text-[10px] font-mono pt-0.5 ${subText}`}>
                          {act.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BILLING HISTORY */}
          {activeTab === "billing" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={sectionTitleClass}>
                  Billing & Invoice Ledger
                </div>
                <span className={`text-xs font-mono font-bold ${subText}`}>
                  {user.billingHistory?.length || 0} Transactions
                </span>
              </div>

              {(!user.billingHistory || user.billingHistory.length === 0) ? (
                <div className={`py-12 text-center text-xs ${subText}`}>
                  No billing history on record for this account.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {user.billingHistory.map((inv) => (
                    <div
                      key={inv.id}
                      className={`p-4 rounded-xl border ${cardSurface} flex items-center justify-between gap-3 text-xs`}
                    >
                      <div className="min-w-0">
                        <div className={`font-bold truncate ${headingText}`}>
                          {inv.description}
                        </div>
                        <div className={`text-[11px] font-mono mt-0.5 ${subText}`}>
                          {inv.invoiceNumber} · {inv.date}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className={`font-mono font-extrabold ${valueText}`}>
                            {inv.amount}
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {inv.status}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold text-[#D97706] transition-colors shadow-2xs cursor-pointer ${
                            darkMode
                              ? "bg-[#21262D] border-[#30363D] hover:bg-[#30363D]"
                              : "bg-white border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: APPLICATIONS */}
          {activeTab === "applications" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={sectionTitleClass}>
                  Overseas Job Submissions
                </div>
                <span className={`text-xs font-mono font-bold ${subText}`}>
                  {user.applications?.length || 0} Applications
                </span>
              </div>

              {(!user.applications || user.applications.length === 0) ? (
                <div className={`py-12 text-center text-xs ${subText}`}>
                  No job applications submitted by this candidate yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {user.applications.map((app) => (
                    <div
                      key={app.id}
                      className={`p-4.5 rounded-xl border ${cardSurface} space-y-2.5 text-xs`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className={`font-bold text-sm ${headingText}`}>
                            {app.jobTitle}
                          </div>
                          <div className={`text-xs font-semibold mt-0.5 ${secondaryValueText}`}>
                            {app.company} · {app.location}
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            app.status === "Offer Received"
                              ? darkMode
                                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/60"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : app.status === "Interview Scheduled"
                              ? darkMode
                                ? "bg-amber-950/40 text-amber-300 border border-amber-800/60"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                              : darkMode
                              ? "bg-blue-950/40 text-blue-300 border border-blue-800/60"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className={`flex items-center justify-between text-[11px] font-mono pt-1.5 border-t ${subText} ${dividerBorder}`}>
                        <span>Applied: {app.appliedDate}</span>
                        <span>Stage: {app.stage || "Screening"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Drawer>

      {/* Edit Profile Modal */}
      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onSaveProfile}
        darkMode={darkMode}
      />

      {/* Contact User Modal */}
      <ContactUserModal
        user={user}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        darkMode={darkMode}
      />

      {/* Impersonate Info Modal */}
      <ImpersonateInfoModal
        user={user}
        isOpen={isImpersonateModalOpen}
        onClose={() => setIsImpersonateModalOpen(false)}
      />

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal
        invoice={selectedInvoice}
        user={user}
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        darkMode={darkMode}
      />
    </>
  );
}
