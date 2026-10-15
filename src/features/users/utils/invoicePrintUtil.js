/**
 * printInvoice
 * Spawns an isolated print frame containing only the formatted invoice document.
 * Guarantees that neither the dashboard, sidebar rail, drawer backdrop, nor modal buttons are printed.
 * 
 * @param {Object} invoice - The billing invoice record
 * @param {Object} user - The candidate / user record
 */
export function printInvoice(invoice, user) {
  if (!invoice || !user) return;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const paymentMethod = user.subscription?.paymentMethod || "Visa ending in 4242";
  const invoiceNumber = invoice.invoiceNumber || invoice.id || "INV-2026-0091";
  const date = invoice.date || "Oct 01, 2026";
  const amount = invoice.amount || "$0.00";
  const description = invoice.description || "Career Placement Concierge";

  const printHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>AIFA-Invoice-${invoiceNumber}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 15mm 18mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0F172A;
          background: #FFFFFF;
          font-size: 13px;
          line-height: 1.5;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .container {
          max-width: 100%;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 20px;
          border-bottom: 2px solid #E2E8F0;
        }
        .brand-logo {
          display: inline-block;
          background: #16A34A;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 15px;
          width: 36px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          border-radius: 8px;
          margin-bottom: 6px;
        }
        .brand-title {
          font-size: 18px;
          font-weight: 800;
          color: #0B192C;
          letter-spacing: -0.02em;
        }
        .brand-sub {
          font-size: 11px;
          color: #64748B;
          margin-top: 2px;
        }
        .invoice-tag-group {
          text-align: right;
        }
        .invoice-title {
          font-size: 26px;
          font-weight: 800;
          color: #0B192C;
          letter-spacing: -0.03em;
        }
        .status-badge {
          display: inline-block;
          background: #DCFCE7;
          color: #15803D;
          border: 1px solid #BBF7D0;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 999px;
          margin-top: 4px;
        }
        .grid-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
          margin-bottom: 28px;
        }
        .meta-col {
          width: 48%;
        }
        .meta-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748B;
          margin-bottom: 6px;
        }
        .meta-name {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 2px;
        }
        .meta-text {
          font-size: 12px;
          color: #475569;
          line-height: 1.4;
        }
        .table-wrap {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;
        }
        .table-wrap th {
          background: #F8FAFC;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #475569;
          padding: 10px 14px;
          text-align: left;
          border-bottom: 1px solid #E2E8F0;
        }
        .table-wrap td {
          padding: 14px;
          border-bottom: 1px solid #F1F5F9;
          font-size: 13px;
        }
        .item-name {
          font-weight: 700;
          color: #0F172A;
        }
        .item-desc {
          font-size: 11px;
          color: #64748B;
          margin-top: 2px;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 28px;
        }
        .totals-table {
          width: 260px;
        }
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 12px;
          color: #64748B;
        }
        .totals-row.grand {
          border-top: 2px solid #E2E8F0;
          margin-top: 8px;
          padding-top: 10px;
          font-size: 16px;
          font-weight: 800;
          color: #0B192C;
        }
        .note-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 30px;
        }
        .note-title {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 4px;
        }
        .note-body {
          font-size: 11px;
          color: #64748B;
          line-height: 1.4;
        }
        .footer {
          border-top: 1px solid #E2E8F0;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #94A3B8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <div class="brand-logo">AG</div>
            <div class="brand-title">AIFA GEN LABS INC.</div>
            <div class="brand-sub">Global AI Career & Talent Optimization Console</div>
            <div class="brand-sub">London · San Francisco · Bangalore</div>
          </div>
          <div class="invoice-tag-group">
            <div class="invoice-title">INVOICE</div>
            <div class="status-badge">PAID IN FULL</div>
            <div class="brand-sub" style="margin-top: 6px;"># ${invoiceNumber}</div>
            <div class="brand-sub">Issued: ${date}</div>
          </div>
        </div>

        <div class="grid-meta">
          <div class="meta-col">
            <div class="meta-label">Billed To</div>
            <div class="meta-name">${user.name}</div>
            <div class="meta-text">${user.email}</div>
            ${user.phone ? `<div class="meta-text">${user.phone}</div>` : ""}
            ${user.location ? `<div class="meta-text">${user.location}</div>` : ""}
            <div class="meta-text" style="margin-top: 4px; font-family: monospace;">Candidate ID: ${user.id}</div>
          </div>
          <div class="meta-col" style="text-align: right;">
            <div class="meta-label">Payment Breakdown</div>
            <div class="meta-text">Method: <strong>${paymentMethod}</strong></div>
            <div class="meta-text">Billing Period: <strong>Monthly Concierge</strong></div>
            <div class="meta-text">Currency: <strong>USD ($)</strong></div>
            <div class="meta-text">Transaction Status: <strong>Cleared / Settled</strong></div>
          </div>
        </div>

        <table class="table-wrap">
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-center" style="width: 60px;">Qty</th>
              <th class="text-right" style="width: 100px;">Rate</th>
              <th class="text-right" style="width: 100px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="item-name">${description}</div>
                <div class="item-desc">Comprehensive AI candidate placement, ATS scoring, and interview scheduling pipeline.</div>
              </td>
              <td class="text-center font-mono">1</td>
              <td class="text-right font-mono">${amount}</td>
              <td class="text-right font-mono"><strong>${amount}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="totals-section">
          <div class="totals-table">
            <div class="totals-row">
              <span>Subtotal</span>
              <span class="font-mono">${amount}</span>
            </div>
            <div class="totals-row">
              <span>Estimated Tax (0.0%)</span>
              <span class="font-mono">$0.00</span>
            </div>
            <div class="totals-row grand">
              <span>Total Paid</span>
              <span class="font-mono">${amount}</span>
            </div>
          </div>
        </div>

        <div class="note-box">
          <div class="note-title">Payment Receipt & Enterprise Terms</div>
          <div class="note-body">
            This electronic receipt confirms successful settlement via ${paymentMethod}.
            Services are rendered pursuant to AIFA GEN LABS Candidate & Employer Terms of Service.
            All subscriptions renew automatically unless paused or cancelled via console settings.
          </div>
        </div>

        <div class="footer">
          <div>AIFA GEN LABS INC. · Registered Operations · contact@aifagenlabs.com</div>
          <div>Page 1 of 1</div>
        </div>
      </div>
    </body>
    </html>
  `;

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(printHtml);
  doc.close();

  // Allow styles and DOM to settle, then print
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (err) {
      console.error("Print execution failed:", err);
    } finally {
      // Remove iframe from DOM after user interacts with print dialog
      setTimeout(() => {
        iframe.remove();
      }, 1000);
    }
  }, 250);
}
