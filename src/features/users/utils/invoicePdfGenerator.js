import { jsPDF } from "jspdf";

/**
 * generateInvoicePDF
 * Generates an authentic, selectable-text A4 PDF invoice document for AIFA GEN LABS.
 * 
 * @param {Object} invoice - The billing transaction object
 * @param {Object} user - The candidate / account entity
 * @returns {Promise<string>} - Resolves with the saved filename
 */
export async function generateInvoicePDF(invoice, user) {
  if (!invoice || !user) {
    throw new Error("Missing invoice or user data for PDF generation");
  }

  // Create A4 portrait document (210mm x 297mm)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2; // 170mm

  // Colors
  const brandGreen = [22, 163, 74]; // #16A34A
  const primaryNavy = [11, 25, 44]; // #0B192C
  const textMuted = [100, 116, 139]; // #64748B
  const textDark = [15, 23, 42]; // #0F172A
  const borderGray = [226, 232, 240]; // #E2E8F0
  const bgLight = [248, 250, 252]; // #F8FAFC

  let y = 20;

  // 1. HEADER BRANDING (Left: Logo + Name, Right: INVOICE tag)
  // Green AG Logo Box
  doc.setFillColor(...brandGreen);
  doc.roundedRect(margin, y, 12, 12, 2.5, 2.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("AG", margin + 6, y + 7.5, { align: "center", baseline: "middle" });

  // Company Name
  doc.setTextColor(...primaryNavy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("AIFA GEN LABS INC.", margin + 16, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...textMuted);
  doc.text("Global AI Career & Talent Optimization Console", margin + 16, y + 9.5);
  doc.text("contact@aifagenlabs.com · console.aifagenlabs.com", margin + 16, y + 13.5);

  // Right Header: INVOICE & Meta
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...primaryNavy);
  doc.text("INVOICE", pageWidth - margin, y + 6, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...brandGreen);
  doc.text("PAID IN FULL", pageWidth - margin, y + 11.5, { align: "right" });

  y += 24;

  // Divider Line
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;

  // 2. INVOICE META & BILLED TO (Two columns)
  // Left Column: Billed To
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...textMuted);
  doc.text("BILLED TO", margin, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...textDark);
  doc.text(user.name || "Valued Customer", margin, y + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...textMuted);
  let leftY = y + 10;
  doc.text(user.email || "--", margin, leftY);
  if (user.phone) {
    leftY += 4.5;
    doc.text(user.phone, margin, leftY);
  }
  if (user.location) {
    leftY += 4.5;
    doc.text(user.location, margin, leftY);
  }
  leftY += 4.5;
  doc.text(`Account ID: ${user.id || "CAND-000"}`, margin, leftY);

  // Right Column: Invoice Details Box
  const rightColX = pageWidth - margin - 70;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...textMuted);
  doc.text("INVOICE DETAILS", rightColX, y);

  const metaItems = [
    { label: "Invoice Number:", val: invoice.invoiceNumber || invoice.id || "INV-2026-0000" },
    { label: "Invoice Date:", val: invoice.date || "Oct 01, 2026" },
    { label: "Payment Status:", val: invoice.status || "Paid" },
    { label: "Payment Method:", val: user.subscription?.paymentMethod || "Visa ending in 4242" },
  ];

  let rightY = y + 5;
  metaItems.forEach((item) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...textMuted);
    doc.text(item.label, rightColX, rightY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textDark);
    doc.text(item.val, pageWidth - margin, rightY, { align: "right" });
    rightY += 4.5;
  });

  y = Math.max(leftY, rightY) + 10;

  // 3. LINE ITEMS TABLE
  // Table Header Background
  doc.setFillColor(...bgLight);
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setDrawColor(...borderGray);
  doc.rect(margin, y, contentWidth, 8, "S");

  // Table Headers
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...textDark);
  doc.text("ITEM & DESCRIPTION", margin + 4, y + 5);
  doc.text("QTY", margin + 110, y + 5, { align: "center" });
  doc.text("UNIT PRICE", margin + 138, y + 5, { align: "right" });
  doc.text("TOTAL", margin + contentWidth - 4, y + 5, { align: "right" });

  y += 8;

  // Table Row
  const itemHeight = 16;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, itemHeight, "F");
  doc.setDrawColor(...borderGray);
  doc.rect(margin, y, contentWidth, itemHeight, "S");

  const description = invoice.description || "Career Placement Concierge";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...textDark);
  doc.text(description, margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text("AI-Driven Career Mobility, ATS Optimization & Placement Sync", margin + 4, y + 11);

  // Qty, Unit, Total
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...textDark);
  doc.text("1", margin + 110, y + 7, { align: "center" });
  doc.text(invoice.amount || "$0.00", margin + 138, y + 7, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.text(invoice.amount || "$0.00", margin + contentWidth - 4, y + 7, { align: "right" });

  y += itemHeight + 6;

  // 4. FINANCIAL SUMMARY (Right aligned box)
  const summaryBoxWidth = 80;
  const summaryX = pageWidth - margin - summaryBoxWidth;

  // Subtotal
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...textMuted);
  doc.text("Subtotal:", summaryX, y);
  doc.setTextColor(...textDark);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.amount || "$0.00", pageWidth - margin, y, { align: "right" });
  y += 5;

  // Applicable Tax
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textMuted);
  doc.text("Estimated Tax (0.0%):", summaryX, y);
  doc.setTextColor(...textDark);
  doc.setFont("helvetica", "bold");
  doc.text("$0.00", pageWidth - margin, y, { align: "right" });
  y += 5;

  // Total divider
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.line(summaryX, y, pageWidth - margin, y);
  y += 5;

  // Grand Total Highlight
  doc.setFillColor(...bgLight);
  doc.roundedRect(summaryX - 4, y - 4, summaryBoxWidth + 4, 10, 1.5, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryNavy);
  doc.text("Total Paid:", summaryX, y + 2.5);

  doc.setFontSize(12);
  doc.text(invoice.amount || "$0.00", pageWidth - margin, y + 2.5, { align: "right" });

  y += 24;

  // 5. PAYMENT RECEIPT CONFIRMATION & TERMS
  doc.setFillColor(...bgLight);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "F");
  doc.setDrawColor(...borderGray);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...textDark);
  doc.text("PAYMENT NOTE & TRANSACTION AUDIT", margin + 4, y + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text(
    `Processed securely via ${user.subscription?.paymentMethod || "Visa ending in 4242"} on ${invoice.date || "Oct 01, 2026"}.`,
    margin + 4,
    y + 10.5
  );
  doc.text(
    "All subscriptions include full AI platform access, ATS scoring, and recruiter synchronization under AIFA GEN LABS Terms of Service.",
    margin + 4,
    y + 15
  );

  // 6. BOTTOM FOOTER
  const footerY = 280;
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text("AIFA GEN LABS INC. · Registered Delaware C-Corp · EU/UK Talent Cloud Operations", margin, footerY + 5);
  doc.text("For billing triage or VAT queries: billing@aifagenlabs.com", pageWidth - margin, footerY + 5, { align: "right" });

  // Save the document with clean filename
  const cleanInvNum = (invoice.invoiceNumber || invoice.id || "INV-2026").replace(/[^a-zA-Z0-9_-]/g, "");
  const filename = `AIFA-Invoice-${cleanInvNum}.pdf`;
  doc.save(filename);

  return filename;
}
