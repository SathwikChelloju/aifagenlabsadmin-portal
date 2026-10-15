import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Mail, Send } from "lucide-react";
import { useToast } from "../../../hooks/useToast";

/**
 * ContactUserModal Component
 * Composes and dispatches administrative communication to the user.
 */
export default function ContactUserModal({
  user,
  isOpen,
  onClose,
  darkMode = false,
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToast } = useToast();

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError("Subject and message body are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // Simulate dispatch latency
      await new Promise((res) => setTimeout(res, 250));
      addToast(`Administrative message dispatched to ${user.email}`, "success");
      setSubject("");
      setMessage("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Candidate / User"
      description={`Compose message to ${user.name}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Recipient
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-xs font-mono text-slate-700 dark:text-slate-300">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{user.name} &lt;{user.email}&gt;</span>
          </div>
        </div>

        <Input
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Schedule Foreign University Technical Interview Prep"
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Message Body
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message to the candidate here..."
            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl border transition-colors focus:outline-none focus:border-amber-500 ${
              darkMode
                ? "bg-[#0D1117] border-[#30363D] text-white"
                : "bg-slate-50 border-slate-200 text-slate-900"
            }`}
            required
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-[#30363D]">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={loading} icon={Send}>
            Send Message
          </Button>
        </div>
      </form>
    </Modal>
  );
}
