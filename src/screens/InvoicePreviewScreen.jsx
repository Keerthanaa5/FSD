import React, { useState, useRef } from 'react';
import { useBilling } from '../context/BillingContext';
import { 
  Printer, 
  Download, 
  Send, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Hash, 
  Receipt,
  FileText,
  Clock,
  Sparkles,
  X,
  Share2
} from 'lucide-react';
import { formatCurrency, formatDate, numberToWordsINR } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';

export const InvoicePreviewScreen = () => {
  const { 
    invoices, 
    previewInvoiceId, 
    setActiveTab, 
    customers, 
    company, 
    markAsPaid, 
    addToast 
  } = useBilling();

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Find invoice
  const invoice = invoices.find((inv) => inv.id === previewInvoiceId) || invoices[0];
  const customer = customers.find((c) => c.id === invoice?.customerId) || {
    name: invoice?.customerName || 'Customer',
    phone: '+91 98765 43210',
    email: 'accounts@customer.com',
    address: 'Commercial Complex, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    gstin: '29AABCR1234A1Z5'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    addToast(`Preparing high-res PDF for ${invoice.invoiceNumber}...`, 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleSendInvoice = (e) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSendModalOpen(false);
      addToast(`Invoice #${invoice.invoiceNumber} emailed to ${recipientEmail || customer.email}!`, 'success');
    }, 700);
  };

  if (!invoice) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">No Invoice Selected</h3>
        <button
          onClick={() => setActiveTab('invoices')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          View All Invoices
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-16">
      {/* Top Action Bar (no-print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('invoices')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {invoice.invoiceNumber}
              </h2>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Billed to <strong className="text-slate-800">{invoice.customerName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {invoice.status !== 'Paid' && (
            <button
              onClick={() => markAsPaid(invoice.id)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Paid</span>
            </button>
          )}

          <button
            onClick={() => {
              setRecipientEmail(customer.email || '');
              setIsSendModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-indigo-600" />
            <span>Send</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Paper (A4 Style) */}
      <div 
        id="printable-invoice"
        className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 text-slate-800 space-y-8"
      >
        {/* Invoice Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-indigo-600/20">
                BF
              </div>
              <div>
                <span className="font-extrabold text-xl text-slate-900 tracking-wider">BILLFLOW</span>
                <p className="text-[11px] text-slate-500 font-medium">Billing & Invoice Management</p>
              </div>
            </div>

            {/* Issuer details */}
            <div className="mt-4 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900 text-sm">{company.name}</p>
              <p>{company.address}, {company.city} - {company.pincode}</p>
              <p>{company.state}, India</p>
              <p>Phone: {company.phone} • Email: {company.email}</p>
              <p className="font-semibold text-slate-800 pt-0.5">
                GSTIN: <span className="font-mono text-indigo-700">{company.gstin}</span>
              </p>
            </div>
          </div>

          {/* Tax Invoice Badge & Number */}
          <div className="text-left sm:text-right space-y-2">
            <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-black uppercase tracking-widest text-slate-800">
              TAX INVOICE
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Invoice Number</span>
              <span className="text-xl font-black text-indigo-700 font-mono">{invoice.invoiceNumber}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs pt-1 sm:text-right">
              <div>
                <span className="text-slate-400 block font-medium">Invoice Date:</span>
                <span className="font-bold text-slate-800">{formatDate(invoice.date)}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Due Date:</span>
                <span className="font-bold text-slate-800">{formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To & Dispatch Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Bill To / Buyer
            </span>
            <p className="text-sm font-extrabold text-slate-900">{customer.name}</p>
            <p className="text-slate-600 mt-1 leading-relaxed">
              {customer.address}, {customer.city} {customer.state} - {customer.pincode}
            </p>
            <p className="text-slate-600 mt-1">Phone: <span className="font-medium text-slate-800">{customer.phone}</span></p>
            <p className="text-slate-600">Email: <span className="font-medium text-slate-800">{customer.email || '—'}</span></p>
            {customer.gstin && (
              <p className="text-slate-700 mt-1.5">
                GSTIN: <span className="font-mono font-bold text-indigo-800 bg-white px-2 py-0.5 rounded border border-slate-200">{customer.gstin}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Payment & Dispatch Info
            </span>
            <div className="flex items-center justify-between text-slate-600">
              <span>Payment Status:</span>
              <StatusBadge status={invoice.status} size="sm" />
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Payment Mode:</span>
              <span className="font-semibold text-slate-800">{invoice.paymentMethod || 'Bank Transfer'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Place of Supply:</span>
              <span className="font-semibold text-slate-800">{customer.state || 'Tamil Nadu'} (State Code: {customer.gstin?.substring(0, 2) || '33'})</span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-hidden border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Description of Goods / Services</th>
                <th className="py-3 px-4 text-center">HSN/SAC</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-center">GST %</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items?.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{index + 1}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{item.name}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-500">{item.hsn || '8471'}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">{item.quantity}</td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-700">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-600">{item.taxRate}%</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations Breakdown & Bank Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
          {/* Left: Bank Details & Terms */}
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Bank Settlement Details
              </span>
              <p><strong className="text-slate-700">Bank:</strong> {company.bankName}</p>
              <p><strong className="text-slate-700">Account No:</strong> <span className="font-mono font-bold text-slate-900">{company.accountNo}</span></p>
              <p><strong className="text-slate-700">IFSC Code:</strong> <span className="font-mono font-bold text-slate-900">{company.ifscCode}</span></p>
              <p><strong className="text-slate-700">Branch:</strong> {company.branch}</p>
              <p className="pt-1"><strong className="text-slate-700">UPI ID:</strong> <span className="font-mono text-indigo-700 font-bold">{company.upiId}</span></p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Terms & Conditions
              </span>
              <p className="text-slate-500 leading-relaxed whitespace-pre-line text-[11px]">
                {invoice.notes || company.terms}
              </p>
            </div>
          </div>

          {/* Right: Calculations Summary */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900">{formatCurrency(invoice.subtotal)}</span>
            </div>

            {invoice.discountAmount > 0 && (
              <div className="flex items-center justify-between py-1 text-slate-600">
                <span>Discount:</span>
                <span className="font-bold text-rose-600">- {formatCurrency(invoice.discountAmount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5 text-slate-700 border-t border-slate-200 font-semibold">
              <span>Taxable Value:</span>
              <span className="font-bold text-slate-900">{formatCurrency(invoice.taxableAmount || (invoice.subtotal - (invoice.discountAmount || 0)))}</span>
            </div>

            {/* CGST/SGST or IGST */}
            {invoice.isInterstate ? (
              <div className="flex items-center justify-between py-1 text-slate-500">
                <span>Integrated GST (IGST 18%):</span>
                <span className="font-medium text-slate-800">{formatCurrency(invoice.igst || invoice.taxAmount)}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between py-1 text-slate-500">
                  <span>Central GST (CGST 9%):</span>
                  <span className="font-medium text-slate-800">{formatCurrency(invoice.cgst || (invoice.taxAmount / 2))}</span>
                </div>
                <div className="flex items-center justify-between py-1 text-slate-500">
                  <span>State GST (SGST 9%):</span>
                  <span className="font-medium text-slate-800">{formatCurrency(invoice.sgst || (invoice.taxAmount / 2))}</span>
                </div>
              </>
            )}

            {/* Grand Total */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1 mt-3 shadow-md">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">TOTAL AMOUNT</span>
                <span className="text-2xl font-black text-white">{formatCurrency(invoice.total)}</span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium italic pt-1">
                Amount in words: {numberToWordsINR(invoice.total)}
              </p>
            </div>
          </div>
        </div>

        {/* Signatory Footer */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-xs">
          <div className="text-slate-400 text-[11px]">
            <p>This is a computer generated invoice and carries authorized digital validation.</p>
            <p className="mt-0.5">Thank you for partnering with <strong>{company.name}</strong>!</p>
          </div>

          <div className="text-center sm:text-right">
            <div className="h-12 flex items-end justify-center sm:justify-end">
              <span className="font-serif italic font-bold text-indigo-900 text-base">Authorized Signatory</span>
            </div>
            <p className="font-bold text-slate-900 mt-1">For {company.name}</p>
            <p className="text-slate-400 text-[10px]">Authorised Signature & Seal</p>
          </div>
        </div>
      </div>

      {/* Send Invoice Modal */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600" />
                <span>Send Invoice via Email</span>
              </h3>
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvoice} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recipient Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="accounts@customer.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Message
                </label>
                <textarea
                  rows={3}
                  defaultValue={`Dear ${customer.name},\n\nPlease find attached tax invoice #${invoice.invoiceNumber} for ${formatCurrency(invoice.total)}.\n\nRegards,\n${company.name}`}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 resize-none"
                />
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>PDF attachment ({invoice.invoiceNumber}.pdf) will be included.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  {isSending ? 'Sending...' : 'Send Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
