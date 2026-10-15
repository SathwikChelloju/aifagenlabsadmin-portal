import React, { useState } from "react";
import { UserPlus, Shield, Trash2, AlertCircle } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import { useToast } from "../../../hooks/useToast";

export default function TeamAccessSettingsForm({
  team = [],
  onUpdateTeam,
  onSave,
  onReset,
  _isDirty = false,
  isSaving = false,
  darkMode = false,
}) {
  const { addToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "Recruiter",
  });
  const [addError, setAddError] = useState("");

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.email.trim()) {
      setAddError("Name and Email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMember.email.trim())) {
      setAddError("Please enter a valid email address.");
      return;
    }

    const initials = newMember.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const memberObj = {
      id: `usr_adm_${Date.now()}`,
      name: newMember.name.trim(),
      email: newMember.email.trim(),
      role: newMember.role,
      status: "Active",
      lastActive: "Just now",
      avatarInitials: initials || "TM",
      badgeColor:
        newMember.role === "Super Admin"
          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
          : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
    };

    onUpdateTeam([...team, memberObj]);
    setIsAddModalOpen(false);
    setNewMember({ name: "", email: "", role: "Recruiter" });
    setAddError("");
    addToast(`Added ${memberObj.name} to authorized team.`, "success");
  };

  const handleRemoveMember = (id, name) => {
    if (window.confirm(`Revoke team admin access for ${name}?`)) {
      const filtered = team.filter((m) => m.id !== id);
      onUpdateTeam(filtered);
      addToast(`Removed ${name} from admin team.`, "info");
    }
  };

  const handleRoleChange = (id, newRole) => {
    const updated = team.map((m) => (m.id === id ? { ...m, role: newRole } : m));
    onUpdateTeam(updated);
    addToast("Updated team member role.", "info");
  };

  const cardSurface = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90 shadow-2xs";

  const subCardSurface = darkMode
    ? "bg-[#0D1117] border-[#30363D]"
    : "bg-slate-50/70 border-slate-200/80";

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 transition-colors space-y-7 ${cardSurface}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/70 dark:border-[#30363D]">
        <div>
          <h2
            className={`text-lg font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-[#0B192C]"
            }`}
          >
            Team & Access Control
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage authorized portal administrators, role permissions, and staff credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0B192C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Team Member List Table */}
      <div className="space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Authorized Team Members ({team.length})
        </span>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#30363D]">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b text-[10px] font-bold uppercase tracking-wider ${
                darkMode
                  ? "bg-[#0D1117] border-[#30363D] text-slate-400"
                  : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
            >
              <tr>
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Last Active</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? "divide-[#30363D]" : "divide-slate-200/70"
              }`}
            >
              {team.map((member) => (
                <tr
                  key={member.id}
                  className={`transition-colors ${
                    darkMode ? "hover:bg-[#161B22]" : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                        {member.avatarInitials || "AD"}
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`font-bold block truncate ${
                            darkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {member.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className={`text-[11px] font-semibold rounded-lg px-2 py-1 border transition-colors cursor-pointer ${
                        darkMode
                          ? "bg-[#0D1117] border-[#30363D] text-slate-200"
                          : "bg-white border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Ops Lead">Ops Lead</option>
                      <option value="Recruiter">Recruiter</option>
                      <option value="Operator">Operator</option>
                    </select>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        member.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          member.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {member.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    {member.lastActive}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Revoke Access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Matrix */}
      <div className={`p-4 rounded-xl border space-y-3 ${subCardSurface}`}>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500" />
          <h4 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-white" : "text-[#0B192C]"}`}>
            Role Permissions Overview
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200/60 dark:border-[#30363D] bg-white dark:bg-[#161B22] space-y-1">
            <span className="font-bold text-amber-600 dark:text-amber-400 block">Super Admin</span>
            <p className="text-[11px] text-slate-400">Full unrestricted platform control, billing, API keys, and audit deletion policies.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200/60 dark:border-[#30363D] bg-white dark:bg-[#161B22] space-y-1">
            <span className="font-bold text-blue-600 dark:text-blue-400 block">Ops Lead</span>
            <p className="text-[11px] text-slate-400">Manage candidate placements, refund workflows, crawler retries, and job reviews.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200/60 dark:border-[#30363D] bg-white dark:bg-[#161B22] space-y-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Recruiter</span>
            <p className="text-[11px] text-slate-400">View student ATS matchmaking, manage job postings, and schedule candidate reviews.</p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200/60 dark:border-[#30363D] bg-white dark:bg-[#161B22] space-y-1">
            <span className="font-bold text-slate-600 dark:text-slate-300 block">Operator</span>
            <p className="text-[11px] text-slate-400">Read-only monitoring of crawlers, job ingestion status, and basic support ticketing.</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-200/70 dark:border-[#30363D] flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onReset}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
            darkMode
              ? "bg-[#21262D] border-[#30363D] text-slate-300 hover:text-white"
              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0B192C] dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Team Changes"}
        </button>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Authorized Team Member"
        description="Invite a staff administrator to access the AIFA GEN LABS console."
        size="md"
        darkMode={darkMode}
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#21262D]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddSubmit}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#D97706] hover:bg-amber-600 text-white shadow-2xs"
            >
              Add Member
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Henderson"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className={`w-full rounded-xl px-3 py-2 border ${
                darkMode ? "bg-[#0D1117] border-[#30363D] text-white" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="alex.h@aifagen.internal"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              className={`w-full rounded-xl px-3 py-2 border ${
                darkMode ? "bg-[#0D1117] border-[#30363D] text-white" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Role Permission</label>
            <select
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              className={`w-full rounded-xl px-3 py-2 border ${
                darkMode ? "bg-[#0D1117] border-[#30363D] text-white" : "bg-slate-50 border-slate-200"
              }`}
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Ops Lead">Ops Lead</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Operator">Operator</option>
            </select>
          </div>

          {addError && (
            <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {addError}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}
