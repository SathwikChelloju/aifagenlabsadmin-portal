import React, { useState } from "react";
import { Globe, ChevronRight, X } from "lucide-react";

export default function ExpiringPlansTable({
  candidates,
  onPlanUpdate,
  onNavigate,
  darkMode,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [planForm, setPlanForm] = useState({ plan: "Premium", reason: "" });

  const cardBg = darkMode
    ? "bg-[#161B22] border-[#30363D]"
    : "bg-white border-slate-200/90";
  const headingText = darkMode ? "text-white" : "text-[#0B192C]";
  const subText = darkMode ? "text-slate-400" : "text-slate-500";
  const tableHeader = darkMode
    ? "bg-[#0D1117] text-slate-400 border-[#30363D]"
    : "bg-slate-50/70 text-slate-500 border-slate-200";
  const tableRowHover = darkMode
    ? "hover:bg-[#1F242C] border-[#30363D]"
    : "hover:bg-slate-50/80 border-slate-100";

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!planForm.reason.trim()) {
      alert("A reason is mandatory for the Audit Log.");
      return;
    }
    onPlanUpdate(selectedCandidate.id, planForm.plan);
    setShowModal(false);
  }

  return (
    <div
      className={`border rounded-3xl shadow-xs overflow-hidden transition-colors ${cardBg}`}
    >
      <div className="p-6 border-b border-slate-500/10 flex justify-between items-center">
        <div>
          <h3 className={`text-base font-bold ${headingText}`}>
            Candidate Subscriptions Expiring (Next 30 Days)
          </h3>
          <p className={`text-xs ${subText} mt-0.5`}>
            Follow up with students preparing for foreign university interviews
            or job transitions.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
          {candidates.length} Critical Actions
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              className={`border-b ${tableHeader} uppercase font-bold tracking-wider`}
            >
              <th className="py-3 px-6">Candidate</th>
              <th className="py-3 px-4">Target Country / Visa</th>
              <th className="py-3 px-4">Track</th>
              <th className="py-3 px-4">ATS Score</th>
              <th className="py-3 px-4">Package</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-500/10 text-sm">
            {candidates.map((c) => (
              <tr key={c.id} className={`transition-colors ${tableRowHover}`}>
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-500/20"
                    />
                    <div>
                      <div
                        className={`font-bold text-sm leading-tight ${headingText}`}
                      >
                        {c.name}
                      </div>
                      <div className={`text-xs font-mono ${subText}`}>
                        {c.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#0B192C] dark:text-blue-400" />
                    <span className={headingText}>{c.countryGoal}</span>
                  </div>
                  <div className={`text-[11px] font-mono mt-0.5 ${subText}`}>
                    {c.targetVisa}
                  </div>
                </td>
                <td className={`py-3.5 px-4 text-xs font-medium ${subText}`}>
                  {c.domain}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {c.atsScore}% ATS
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      c.plan === "Premium"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-800 border border-slate-300"
                    }`}
                  >
                    {c.plan}
                  </span>
                </td>
                <td className="py-3.5 px-6 text-right">
                  <button
                    onClick={() => {
                      setSelectedCandidate(c);
                      setPlanForm({ plan: c.plan, reason: "" });
                      setShowModal(true);
                    }}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      darkMode
                        ? "bg-[#161B22] border-[#30363D] hover:bg-[#21262D] text-white"
                        : "bg-white border-slate-300 hover:bg-slate-50 text-slate-800 shadow-xs"
                    }`}
                  >
                    Update Plan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-500/10 flex items-center justify-between text-xs font-medium">
        <span className={subText}>
          Showing priority renewals expiring in &lt; 30 days
        </span>
        <button
          type="button"
          onClick={() => {
            if (onNavigate) {
              onNavigate("users");
            } else if (typeof window !== "undefined") {
              window.history.pushState(null, "", "/users");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }
          }}
          className="text-[#D97706] font-bold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          aria-label="Navigate to full candidate directory"
        >
          Full Candidate Directory <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`border rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${cardBg}`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-500/20">
              <h4 className={`text-base font-bold ${headingText}`}>
                Update Plan: {selectedCandidate?.name}
              </h4>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div>
                <label
                  className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${subText}`}
                >
                  Package Level
                </label>
                <select
                  value={planForm.plan}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, plan: e.target.value })
                  }
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 border ${
                    darkMode
                      ? "bg-[#0D1117] border-[#30363D] text-white"
                      : "bg-slate-50 border-slate-300 text-slate-800"
                  }`}
                >
                  <option value="None">None (Unenrolled)</option>
                  <option value="Basic">Basic Tier</option>
                  <option value="Premium">Premium Tier</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${subText}`}
                >
                  Mandatory Audit Reason
                </label>
                <textarea
                  required
                  rows={3}
                  value={planForm.reason}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, reason: e.target.value })
                  }
                  placeholder="e.g., Extended student tier for UK visa sponsorship timeline."
                  className={`w-full rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 border ${
                    darkMode
                      ? "bg-[#0D1117] border-[#30363D] text-white"
                      : "bg-slate-50 border-slate-300 text-slate-800"
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 text-xs font-semibold hover:underline ${subText}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#D97706] text-white rounded-xl hover:bg-[#b45309] transition-all shadow-xs"
                >
                  Commit to Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
