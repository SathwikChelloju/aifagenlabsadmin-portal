import React from "react";
import SettingsHeader from "../components/SettingsHeader";
import SettingsNavPanel from "../components/SettingsNavPanel";
import GeneralSettingsForm from "../components/GeneralSettingsForm";
import ProfileSettingsForm from "../components/ProfileSettingsForm";
import TeamAccessSettingsForm from "../components/TeamAccessSettingsForm";
import NotificationsSettingsForm from "../components/NotificationsSettingsForm";
import JobAggregationSettingsForm from "../components/JobAggregationSettingsForm";
import IntegrationsApiSettingsForm from "../components/IntegrationsApiSettingsForm";
import SecuritySettingsForm from "../components/SecuritySettingsForm";
import BillingSubscriptionSettingsForm from "../components/BillingSubscriptionSettingsForm";
import AuditRetentionSettingsForm from "../components/AuditRetentionSettingsForm";
import BrandPreviewCard from "../components/BrandPreviewCard";
import QuickStatsCard from "../components/QuickStatsCard";
import SystemInfoCard from "../components/SystemInfoCard";
import ViewChangesModal from "../components/ViewChangesModal";
import UnsavedChangesModal from "../components/UnsavedChangesModal";
import { useSettings } from "../hooks/useSettings";

/**
 * SettingsPage Component
 * Three-column Settings workspace matching the AIFA GEN LABS Admin Console design system:
 * - Column 1: Vertical 9-section navigation rail
 * - Column 2: Main settings form (General Settings by default)
 * - Column 3: Brand preview, quick stats telemetry, and system infrastructure info
 */
export default function SettingsPage({ darkMode = false }) {
  const {
    settings,
    activeSection,
    requestSwitchSection,
    updateField,
    updateSection,
    errors,
    diffs,
    isDirty,
    isSaving,
    saveChanges,
    resetToSaved,
    // Unsaved changes confirmation dialog
    isPendingSwitchModalOpen,
    confirmDiscardAndSwitch,
    confirmSaveAndSwitch,
    cancelSwitchSection,
    // View changes modal
    isViewChangesModalOpen,
    setIsViewChangesModalOpen,
  } = useSettings();

  const renderActiveSectionForm = () => {
    switch (activeSection) {
      case "general":
        return (
          <GeneralSettingsForm
            generalSettings={settings.general}
            onUpdateField={updateField}
            onSave={saveChanges}
            onReset={resetToSaved}
            onOpenViewChanges={() => setIsViewChangesModalOpen(true)}
            isDirty={isDirty}
            isSaving={isSaving}
            errors={errors}
            darkMode={darkMode}
          />
        );

      case "profile":
        return (
          <ProfileSettingsForm
            profileSettings={settings.profile}
            onUpdateField={updateField}
            onSave={saveChanges}
            onReset={resetToSaved}
            isDirty={isDirty}
            isSaving={isSaving}
            darkMode={darkMode}
          />
        );

      case "team":
        return (
          <TeamAccessSettingsForm
            team={settings.team}
            onUpdateTeam={(newTeam) => updateSection("team", newTeam)}
            onSave={saveChanges}
            onReset={resetToSaved}
            isDirty={isDirty}
            isSaving={isSaving}
            darkMode={darkMode}
          />
        );

      case "notifications":
        return (
          <NotificationsSettingsForm
            notifications={settings.notifications}
            onUpdateField={updateField}
            onSave={saveChanges}
            onReset={resetToSaved}
            isDirty={isDirty}
            isSaving={isSaving}
            darkMode={darkMode}
          />
        );

      case "job-aggregation":
        return (
          <JobAggregationSettingsForm
            jobAggregation={settings.jobAggregation}
            onUpdateField={updateField}
            onSave={saveChanges}
            onReset={resetToSaved}
            isDirty={isDirty}
            isSaving={isSaving}
            darkMode={darkMode}
          />
        );

      case "integrations":
        return (
          <IntegrationsApiSettingsForm
            integrations={settings.integrations}
            onUpdateIntegrations={(newInts) => updateSection("integrations", newInts)}
            onSave={saveChanges}
            onReset={resetToSaved}
            isDirty={isDirty}
            isSaving={isSaving}
            darkMode={darkMode}
          />
        );

      case "security":
        return (
          <SecuritySettingsForm
            security={settings.security}
            onUpdateField={updateField}
            onSave={saveChanges}
            onReset={resetToSaved}
            isDirty={isDirty}
            isSaving={isSaving}
            darkMode={darkMode}
          />
        );

      case "billing":
        return (
          <BillingSubscriptionSettingsForm
            billing={settings.billing}
            onSave={saveChanges}
            onReset={resetToSaved}
            isDirty={isDirty}
            isSaving={isSaving}
            darkMode={darkMode}
          />
        );

      case "audit-retention":
        return (
          <AuditRetentionSettingsForm
            auditRetention={settings.auditRetention}
            onUpdateField={updateField}
            onSave={saveChanges}
            onReset={resetToSaved}
            isDirty={isDirty}
            isSaving={isSaving}
            darkMode={darkMode}
          />
        );

      default:
        return (
          <GeneralSettingsForm
            generalSettings={settings.general}
            onUpdateField={updateField}
            onSave={saveChanges}
            onReset={resetToSaved}
            onOpenViewChanges={() => setIsViewChangesModalOpen(true)}
            isDirty={isDirty}
            isSaving={isSaving}
            errors={errors}
            darkMode={darkMode}
          />
        );
    }
  };

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <SettingsHeader
        isDirty={isDirty}
        diffCount={diffs.length}
        darkMode={darkMode}
      />

      {/* Main Three-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* COLUMN 1: Settings Navigation Rail (Width: 3 cols on desktop) */}
        <div className="lg:col-span-4 xl:col-span-3 w-full">
          <SettingsNavPanel
            activeSection={activeSection}
            onSelectSection={requestSwitchSection}
            darkMode={darkMode}
          />
        </div>

        {/* COLUMN 2: Active Settings Form Panel (Width: 6 cols on XL desktop) */}
        <div className="lg:col-span-8 xl:col-span-6 w-full min-w-0">
          {renderActiveSectionForm()}
        </div>

        {/* COLUMN 3: Right-hand Information Column (Width: 3 cols on XL desktop, reflows below on tablet) */}
        <div className="lg:col-span-12 xl:col-span-3 w-full space-y-4">
          <BrandPreviewCard
            platformName={settings.general?.platformName}
            companyTagline={settings.general?.companyTagline}
            logoUrl={settings.general?.logoUrl}
            darkMode={darkMode}
          />

          <QuickStatsCard
            teamMemberCount={(settings.team && settings.team.length) || 4}
            darkMode={darkMode}
          />

          <SystemInfoCard darkMode={darkMode} />
        </div>
      </div>

      {/* View Changes Modal */}
      <ViewChangesModal
        isOpen={isViewChangesModalOpen}
        onClose={() => setIsViewChangesModalOpen(false)}
        diffs={diffs}
        onSaveNow={saveChanges}
        darkMode={darkMode}
      />

      {/* Unsaved Changes Guard Dialog */}
      <UnsavedChangesModal
        isOpen={isPendingSwitchModalOpen}
        onClose={cancelSwitchSection}
        onDiscardAndSwitch={confirmDiscardAndSwitch}
        onSaveAndSwitch={confirmSaveAndSwitch}
        darkMode={darkMode}
      />
    </div>
  );
}
