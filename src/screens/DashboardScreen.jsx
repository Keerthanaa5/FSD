import React from 'react';
import { useBilling } from '../context/BillingContext';
import { 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Eye, 
  ArrowRight,
  Receipt,
  Check,
  Package,
  Users
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { MONTHLY_REVENUE_DATA } from '../data/initialData';

export const DashboardScreen = () => {
  const { 
    invoices, 
    customers, 
    products,
    getStats, 
    navigateToCreateInvoice, 
    navigateToPreview, 
    setActiveTab, 
    markAsPaid 
  } = useBilling();

  const stats = getStats();

  // Pie chart data for Invoice Status distribution
  const statusPieData = [
    { name: 'Paid', value: stats.paidAmount || (stats.totalInvoices === 0 ? 0 : 0), count: stats.paidCount, color: '#10B981' },
    { name: 'Pending', value: stats.pendingAmount || (stats.totalInvoices === 0 ? 0 : 0), count: stats.pendingCount, color: '#F59E0B' },
    { name: 'Overdue', value: stats.overdueAmount || (stats.totalInvoices === 0 ? 0 : 0), count: stats.overdueCount, color: '#EF4444' }
  ];

  // Most recent invoices
  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome & Primary CTA Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Good morning, Admin 👋
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('invoices')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors"
          >
            View All Invoices
          </button>
          <button
            onClick={() => navigateToCreateInvoice()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 1. Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(stats.totalRevenue)}
            </h3>
            {stats.totalInvoices > 0 && (
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stats.revenueGrowth}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {stats.totalInvoices > 0 ? `${stats.totalInvoices} invoices generated` : 'No invoices generated yet'}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* 2. Total Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Invoices</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalInvoices}
            </h3>
            {stats.totalInvoices > 0 && (
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stats.invoicesGrowth}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">In your billing ledger</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* 3. Paid */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Paid Invoices</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(stats.paidAmount)}
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {stats.paidCount} invoices
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Successfully settled payments</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* 4. Pending & Overdue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Amount</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(stats.pendingAmount)}
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              {stats.pendingCount} pending
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {stats.overdueCount > 0 ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {stats.overdueCount} overdue ({formatCurrency(stats.overdueAmount)})
              </span>
            ) : (
              'Awaiting client payment'
            )}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Visual Charts: Revenue Overview & Invoice Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview Monthly Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue Overview</h3>
              <p className="text-xs text-slate-500 font-medium">Monthly collection trends (INR)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Total Billed
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Paid
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_REVENUE_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="revenue" name="Total Billed" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="paid" name="Paid Amount" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPaid)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Status Distribution (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Invoice Status</h3>
            <p className="text-xs text-slate-500 font-medium">Distribution by value & volume</p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center my-2">
            {stats.totalInvoices > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value), '']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                No invoice activity yet
              </div>
            )}
            {stats.totalInvoices > 0 && (
              <div className="absolute text-center">
                <span className="text-xs text-slate-400 font-medium block">Total</span>
                <span className="text-sm font-extrabold text-slate-900 block">{stats.totalInvoices} Invs</span>
              </div>
            )}
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Paid ({stats.paidCount})
              </span>
              <span className="font-bold text-slate-900">{formatCurrency(stats.paidAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pending ({stats.pendingCount})
              </span>
              <span className="font-bold text-slate-900">{formatCurrency(stats.pendingAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Overdue ({stats.overdueCount})
              </span>
              <span className="font-bold text-slate-900">{formatCurrency(stats.overdueAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Invoices</h3>
            <p className="text-xs text-slate-500 font-medium">Latest billing activity and payment records</p>
          </div>
          {invoices.length > 0 && (
            <button
              onClick={() => setActiveTab('invoices')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
            >
              <span>View All ({invoices.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="py-3 px-6">Invoice</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentInvoices.map((inv) => (
                  <tr 
                    key={inv.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => navigateToPreview(inv.id)}
                  >
                    <td className="py-4 px-6 font-bold text-indigo-600">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900">
                      {inv.customerName}
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {formatDate(inv.date)}
                    </td>
                    <td className="py-4 px-6 text-right font-extrabold text-slate-900">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {inv.status !== 'Paid' && (
                          <button
                            onClick={() => markAsPaid(inv.id)}
                            title="Mark as Paid"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Paid</span>
                          </button>
                        )}
                        <button
                          onClick={() => navigateToPreview(inv.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View & Print Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <div>
              <p className="font-semibold text-slate-700">No Invoices Created Yet</p>
              <p className="text-slate-400 mt-0.5">Click the button below to generate your first invoice</p>
            </div>
            <button
              onClick={() => navigateToCreateInvoice()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-sm inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Invoice</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
