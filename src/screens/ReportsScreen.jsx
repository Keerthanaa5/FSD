import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  CreditCard, 
  Download, 
  Calendar,
  Percent,
  CheckCircle2,
  PieChart as PieIcon,
  IndianRupee
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MONTHLY_REVENUE_DATA } from '../data/initialData';

export const ReportsScreen = () => {
  const { customers, invoices, getStats, addToast } = useBilling();
  const [timeRange, setTimeRange] = useState('6M'); // 6M, 1Y

  const stats = getStats();

  // Top Customers ranked by billed amount
  const rankedCustomers = [...customers]
    .sort((a, b) => (b.totalBilled || 0) - (a.totalBilled || 0))
    .slice(0, 5);

  const maxCustomerBilled = Math.max(...rankedCustomers.map((c) => c.totalBilled || 1), 1);

  // Status Distribution Data
  const statusData = [
    { name: 'Paid', value: stats.paidAmount, color: '#10B981' },
    { name: 'Pending', value: stats.pendingAmount, color: '#F59E0B' },
    { name: 'Overdue', value: stats.overdueAmount, color: '#EF4444' }
  ];

  const handleExportCSV = () => {
    // Generate CSV data from invoices
    const headers = "Invoice,Customer,Date,Amount,Status,PaymentMethod\n";
    const rows = invoices.map(i => `"${i.invoiceNumber}","${i.customerName}","${i.date}",${i.total},"${i.status}","${i.paymentMethod || 'Bank'}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Billflow_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    addToast('Financial report exported to CSV successfully!', 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Financial Reports & Analytics
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Executive revenue metrics, tax collection and top client insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setTimeRange('6M')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${timeRange === '6M' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'}`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setTimeRange('1Y')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${timeRange === '1Y' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'}`}
            >
              FY 2026-27
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards (Exact from requirements) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Revenue</span>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(stats.totalRevenue)}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12.5% vs previous quarter
          </p>
        </div>

        {/* Total Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Invoices</span>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{stats.totalInvoices}</h3>
          <p className="text-xs text-slate-500 font-medium mt-2">
            Avg {Math.round(stats.totalInvoices / 6)} invoices / month
          </p>
        </div>

        {/* Average Invoice Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Average Invoice Value</span>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(stats.avgInvoiceValue)}</h3>
          <p className="text-xs text-indigo-600 font-semibold mt-2">
            Higher ticket B2B transactions
          </p>
        </div>

        {/* Outstanding Amount */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Outstanding Amount</span>
          <h3 className="text-2xl font-extrabold text-amber-700 tracking-tight">{formatCurrency(stats.totalReceivable)}</h3>
          <p className="text-xs text-amber-700 font-semibold mt-2">
            {stats.pendingCount + stats.overdueCount} pending settlements
          </p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview Monthly Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Sales Overview</h3>
              <p className="text-xs text-slate-500 font-medium">Billed revenue vs realized settlements</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_REVENUE_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="revenue" name="Total Billed" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="paid" name="Collected" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Invoice Status Distribution</h3>
              <p className="text-xs text-slate-500 font-medium">Breakdown by cash realization status</p>
            </div>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(value), '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100 text-xs">
            <div className="p-2 rounded-xl bg-emerald-50">
              <span className="text-emerald-700 font-bold block">Paid</span>
              <span className="text-slate-900 font-extrabold">{formatCurrency(stats.paidAmount)}</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50">
              <span className="text-amber-700 font-bold block">Pending</span>
              <span className="text-slate-900 font-extrabold">{formatCurrency(stats.pendingAmount)}</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-50">
              <span className="text-rose-700 font-bold block">Overdue</span>
              <span className="text-slate-900 font-extrabold">{formatCurrency(stats.overdueAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Customers Ranking Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Top Customers by Revenue</h3>
            <p className="text-xs text-slate-500 font-medium">Highest contributing client accounts</p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {rankedCustomers.length > 0 ? (
            rankedCustomers.map((cust, idx) => {
              const percentage = Math.round(((cust.totalBilled || 0) / maxCustomerBilled) * 100);

              return (
                <div key={cust.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="text-slate-900">{cust.name}</span>
                      <span className="text-slate-400 font-normal">({cust.invoicesCount} invoices)</span>
                    </div>
                    <span className="font-extrabold text-slate-900">{formatCurrency(cust.totalBilled)}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-1" />
              No customer billing data available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
