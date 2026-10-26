import React from 'react';
import { useBilling } from '../../context/BillingContext';
import { X, Building, Mail, Phone, MapPin, Hash, Plus, Eye, Receipt, CheckCircle, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

export const CustomerDetailsModal = ({ customerId, onClose }) => {
  const { customers, invoices, navigateToCreateInvoice, navigateToPreview } = useBilling();

  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return null;

  const customerInvoices = invoices.filter((inv) => inv.customerId === customer.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-lg flex items-center justify-center">
              {customer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{customer.name}</h3>
              <p className="text-xs text-slate-500 font-medium">Customer ID: {customer.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Metrics Overview Cards */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Billed</span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 block mt-1">
              {formatCurrency(customer.totalBilled)}
            </span>
            <span className="text-[10px] text-slate-500">{customerInvoices.length} invoices</span>
          </div>

          <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Total Paid</span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-700 block mt-1">
              {formatCurrency(customer.totalPaid)}
            </span>
            <span className="text-[10px] text-emerald-600">Settled</span>
          </div>

          <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Outstanding</span>
            <span className="text-base sm:text-lg font-extrabold text-amber-700 block mt-1">
              {formatCurrency(customer.outstanding)}
            </span>
            <span className="text-[10px] text-amber-600">Receivable</span>
          </div>
        </div>

        {/* Contact & GST Details */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 space-y-2.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="font-semibold">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{customer.email || 'No email provided'}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-slate-700 pt-1">
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              {customer.address ? `${customer.address}, ${customer.city || ''} ${customer.state || ''} ${customer.pincode || ''}` : 'Address not specified'}
            </span>
          </div>

          {customer.gstin && (
            <div className="flex items-center gap-2 text-slate-700 pt-1 border-t border-slate-200/50">
              <Hash className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="font-medium">GSTIN: <span className="font-mono font-bold text-indigo-900">{customer.gstin}</span></span>
            </div>
          )}
        </div>

        {/* Customer's Invoices List */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900">Invoice History ({customerInvoices.length})</h4>
            <button
              onClick={() => {
                onClose();
                navigateToCreateInvoice(customer);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Invoice</span>
            </button>
          </div>

          {customerInvoices.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
              No invoices created yet for this customer.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden text-xs">
              {customerInvoices.map((inv) => (
                <div 
                  key={inv.id}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <span className="font-bold text-indigo-600 block">{inv.invoiceNumber}</span>
                    <span className="text-slate-400 text-[11px]">{formatDate(inv.date)} • Due: {formatDate(inv.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900">{formatCurrency(inv.total)}</span>
                    <StatusBadge status={inv.status} size="sm" />
                    <button
                      onClick={() => {
                        onClose();
                        navigateToPreview(inv.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      title="View Invoice"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
