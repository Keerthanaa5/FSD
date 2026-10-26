import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  Search, 
  Filter, 
  Eye, 
  Check,
  Building,
  DollarSign,
  Receipt
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';

export const PaymentsScreen = () => {
  const { 
    invoices, 
    markAsPaid, 
    navigateToPreview, 
    getStats 
  } = useBilling();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, pending, paid, overdue
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [paymentMethodSelect, setPaymentMethodSelect] = useState('Bank Transfer (NEFT)');

  const stats = getStats();

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'pending') return inv.status === 'Pending';
    if (filterType === 'paid') return inv.status === 'Paid';
    if (filterType === 'overdue') return inv.status === 'Overdue';
    return true;
  });

  const handleConfirmPayment = () => {
    if (selectedInvoiceForPayment) {
      markAsPaid(selectedInvoiceForPayment.id, paymentMethodSelect);
      setSelectedInvoiceForPayment(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Payments & Collections
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Monitor client settlements, record incoming payments, and track receivables
          </p>
        </div>
      </div>

      {/* 4 Summary Cards (Exact matching prompt specifications) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Receivable */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Receivable</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(stats.totalReceivable)}
          </h3>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Pending + Overdue invoices
          </p>
        </div>

        {/* Paid This Month */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Paid This Month</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(stats.paidAmount)}
          </h3>
          <p className="text-xs text-emerald-600 mt-2 font-semibold">
            {stats.paidCount} invoices cleared
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(stats.pendingAmount)}
          </h3>
          <p className="text-xs text-amber-700 mt-2 font-semibold">
            {stats.pendingCount} within credit term
          </p>
        </div>

        {/* Overdue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overdue</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-rose-600 tracking-tight">
            {formatCurrency(stats.overdueAmount)}
          </h3>
          <p className="text-xs text-rose-600 mt-2 font-semibold">
            {stats.overdueCount} past due date
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'pending', label: 'Pending Payment' },
            { id: 'overdue', label: 'Overdue Only' },
            { id: 'paid', label: 'Settled / Paid' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="py-3.5 px-6">Invoice</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6 text-right">Amount</th>
                <th className="py-3.5 px-6">Due Date</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.map((inv) => {
                const isSettled = inv.status === 'Paid';

                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => navigateToPreview(inv.id)}
                  >
                    <td className="py-4 px-6 font-bold text-indigo-600">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {inv.customerName}
                    </td>

                    <td className="py-4 px-6 text-right font-extrabold text-slate-900">
                      {formatCurrency(inv.total)}
                    </td>

                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {formatDate(inv.dueDate)}
                    </td>

                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={inv.status} />
                    </td>

                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {!isSettled ? (
                          <button
                            onClick={() => setSelectedInvoiceForPayment(inv)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.02] flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>MARK AS PAID</span>
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Settled
                          </span>
                        )}

                        <button
                          onClick={() => navigateToPreview(inv.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    <CreditCard className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark As Paid Confirmation Modal */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Record Payment</h3>
            <p className="text-xs text-slate-500 mt-1">
              Mark invoice <strong className="text-slate-800">{selectedInvoiceForPayment.invoiceNumber}</strong> for <strong className="text-slate-800">{selectedInvoiceForPayment.customerName}</strong> as fully paid.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 my-5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Settlement Amount:</span>
                <span className="font-extrabold text-base text-slate-900">{formatCurrency(selectedInvoiceForPayment.total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-slate-800">{selectedInvoiceForPayment.customerName}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs mb-6">
              <label className="block font-bold text-slate-700 uppercase tracking-wider">
                Payment Channel / Mode
              </label>
              <select
                value={paymentMethodSelect}
                onChange={(e) => setPaymentMethodSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="Bank Transfer (NEFT / RTGS)">Bank Transfer (NEFT / RTGS)</option>
                <option value="UPI / QR Code">UPI / QR Code</option>
                <option value="Cheque Deposit">Cheque Deposit</option>
                <option value="Cash Payment">Cash Payment</option>
                <option value="Credit / Debit Card">Credit / Debit Card</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedInvoiceForPayment(null)}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                Confirm & Mark Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
