import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  ArrowUpDown,
  Check
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';

export const InvoicesListScreen = () => {
  const { 
    invoices, 
    navigateToPreview, 
    navigateToCreateInvoice, 
    deleteInvoice, 
    markAsPaid 
  } = useBilling();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inv.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-desc') return b.total - a.total;
    if (sortBy === 'amount-asc') return a.total - b.total;
    return 0;
  });

  const filterTabs = ['All', 'Paid', 'Pending', 'Overdue', 'Draft'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Invoices
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage, filter and review all your business billing history
          </p>
        </div>

        <button
          onClick={() => navigateToCreateInvoice()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => {
            const count = tab === 'All' 
              ? invoices.length 
              : invoices.filter((i) => i.status.toLowerCase() === tab.toLowerCase()).length;

            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 ${
                  statusFilter === tab
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === tab ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="py-3.5 px-6">Invoice</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Due Date</th>
                <th className="py-3.5 px-6 text-right">Amount</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInvoices.map((inv) => (
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

                  <td className="py-4 px-6 text-slate-500 font-medium">
                    {formatDate(inv.date)}
                  </td>

                  <td className="py-4 px-6 text-slate-500 font-medium">
                    {formatDate(inv.dueDate)}
                  </td>

                  <td className="py-4 px-6 text-right font-extrabold text-slate-900">
                    {formatCurrency(inv.total)}
                  </td>

                  <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                    <StatusBadge status={inv.status} />
                  </td>

                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => markAsPaid(inv.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Mark as Paid"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Mark Paid</span>
                        </button>
                      )}
                      <button
                        onClick={() => navigateToPreview(inv.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="View invoice preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete invoice ${inv.invoiceNumber}?`)) {
                            deleteInvoice(inv.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No invoices found for this search/filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
