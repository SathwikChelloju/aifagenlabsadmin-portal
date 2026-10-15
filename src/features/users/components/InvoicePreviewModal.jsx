import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Printer,
  Download,
  X,
  CheckCircle2,
  CreditCard,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { generateInvoicePDF } from "../utils/invoicePdfGenerator";
import { printInvoice } from "../utils/invoicePrintUtil";
import { useToast } from "../../../hooks/useToast";

/**
 * InvoicePreviewModal Component
 * Polished, high-fidelity invoice document modal inspired by Collect UI / Stripe billing receipts.
 * Includes smooth enter/exit animations, real A4 PDF download via jsPDF, and isolated iframe print.
 */
export default function InvoicePreviewModal({
  invoice,
  user,
  isOpen,
  onClose,
  _darkMode = false,
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const { addToast } = useToast();
  const modalRef = useRef(null);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  // Clean exit animation trigger before unmounting
  const handleRequestClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 160);
  }, [isClosing, onClose]);

  // Keyboard navigation (Escape key)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen && !isClosing) {
        e.preventDefault();
        handleRequestClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, isClosing, handleRequestClose]);

  if ((!isOpen && !isClosing) || !invoice || !user) return null;

  const invoiceNumber = invoice.invoiceNumber || invoice.id || "INV-2026-0091";
  const date = invoice.date || "Oct 09, 2026";
  const amount = invoice.amount || "$79.00";
  const description = invoice.description || "Career Placement Concierge";
  const paymentMethod = user.subscription?.paymentMethod || "Visa ending in 4242";

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const filename = await generateInvoicePDF(invoice, user);
      addToast(`Downloaded ${filename} successfully`, "success");
    } catch (err) {
      console.error("PDF generation error:", err);
      addToast("Failed to generate PDF document. Please try again.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  // Print Handler
  const handlePrint = () => {
    try {
      setIsPrinting(true);
      printInvoice(invoice, user);
      setTimeout(() => setIsPrinting(false), 800);
    } catch (err) {
      console.error("Print error:", err);
      setIsPrinting(false);
      addToast("Could not open print dialog.", "error");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 overflow-y-auto ${
        isClosing
          ? "animate-out fade-out duration-150"
          : "animate-in fade-in duration-200"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-preview-heading"
    >
      {/* Dimmed backdrop with subtle blur */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
        onClick={handleRequestClose}
        aria-hidden="true"
      />

      {/* Main Dialog Container */}
      <div
        ref={modalRef}
        className={`relative z-10 w-full max-w-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          isClosing
            ? "animate-out fade-out zoom-out-95 duration-150"
            : "animate-in fade-in zoom-in-95 duration-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar (Controls & Meta) */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-[#30363D] bg-slate-50/80 dark:bg-[#0D1117] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs shadow-xs shrink-0">
              AG
            </div>
            <div className="truncate">
              <h3
                id="invoice-preview-heading"
                className="text-sm font-extrabold text-[#0B192C] dark:text-white leading-tight flex items-center gap-2"
              >
                <span>{invoiceNumber}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> Paid
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Official Settlement Receipt · {date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#21262D] text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#30363D] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              title="Print invoice for A4 paper"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-xl bg-[#0B192C] hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-60"
              title="Download official PDF document"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isDownloading ? "Generating..." : "Download PDF"}</span>
            </button>

            <button
              type="button"
              onClick={handleRequestClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#21262D] transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar bg-slate-50/40 dark:bg-[#0D1117]/40 space-y-6">
          {/* Paper Document Card */}
          <div
            id="printable-invoice-modal-content"
            className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
          >
            {/* Header: Company branding and Invoice Badge */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200/90 dark:border-[#30363D]">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                    AG
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#0B192C] dark:text-white leading-tight">
                      AIFA GEN LABS INC.
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Global AI Career & Talent Placement Console
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 space-y-0.5">
                  <div>Tax ID / Reg: US-DE-9104820-AG</div>
                  <div>Operations: London · San Francisco · Bangalore</div>
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-xl font-extrabold tracking-tight text-[#0B192C] dark:text-white font-mono">
                  RECEIPT
                </div>
                <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                  #{invoiceNumber}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                  Issued: {date}
                </div>
              </div>
            </div>

            {/* Billed To & Transaction Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200/80 dark:border-[#30363D] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Billed To</span>
                </span>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white pt-0.5">
                  {user.name}
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-[#30363D] font-mono">
                  Candidate ID: {user.id}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200/80 dark:border-[#30363D] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Payment Information</span>
                </span>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Billing Term:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Monthly Concierge
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Currency:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    USD ($)
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-[#30363D]">
                  <span className="text-slate-500">Settlement:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> Cleared
                  </span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 dark:border-[#30363D] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#0D1117] border-b border-slate-200 dark:border-[#30363D] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Item & Description</th>
                    <th className="py-3 px-3 text-center w-16">Qty</th>
                    <th className="py-3 px-3 text-right w-24">Rate</th>
                    <th className="py-3 px-4 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#30363D]">
                  <tr>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {description}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Tier subscription for AI resume tailoring, global ATS alignment, and automated employer distribution.
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                      1
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                      {amount}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900 dark:text-white">
                      {amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Subtotal, Tax, and Grand Total */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                    {amount}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Estimated Tax (0.0%):</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    $0.00
                  </span>
                </div>
                <div className="pt-2 border-t-2 border-slate-200 dark:border-[#30363D] flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Total Paid:
                  </span>
                  <span className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {amount}
                  </span>
                </div>
              </div>
            </div>

            {/* Note & Security Policy */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0D1117] border border-slate-200/80 dark:border-[#30363D] text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Certified Electronic Receipt.
                </span>{" "}
                Payment processed by AIFA Payments Engine. This document complies with SOC2 Type II audit logging requirements. For billing inquiries, contact{" "}
                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                  billing@aifagenlabs.com
                </span>.
              </div>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#161B22] flex items-center justify-between shrink-0">
          <div className="text-[11px] font-mono text-slate-400">
            Esc to close · A4 print ready
          </div>
          <button
            type="button"
            onClick={handleRequestClose}
            className="px-4 py-2 rounded-xl bg-[#0B192C] hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
