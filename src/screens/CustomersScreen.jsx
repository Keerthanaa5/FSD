import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { 
  Users, 
  Plus, 
  Search, 
  Building, 
  Phone, 
  Mail, 
  Eye, 
  FilePlus, 
  Trash2, 
  Edit,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { AddCustomerModal } from '../components/customers/AddCustomerModal';
import { CustomerDetailsModal } from '../components/customers/CustomerDetailsModal';

export const CustomersScreen = () => {
  const { 
    customers, 
    deleteCustomer, 
    navigateToCreateInvoice 
  } = useBilling();

  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('all'); // all, outstanding, settled
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search) ||
      (customer.email && customer.email.toLowerCase().includes(search.toLowerCase())) ||
      (customer.gstin && customer.gstin.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterState === 'outstanding') return (customer.outstanding || 0) > 0;
    if (filterState === 'settled') return (customer.outstanding || 0) === 0;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Customers
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage your customer information
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, phone, GSTIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterState('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
              filterState === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Customers ({customers.length})
          </button>
          <button
            onClick={() => setFilterState('outstanding')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
              filterState === 'outstanding'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Has Outstanding ({customers.filter((c) => (c.outstanding || 0) > 0).length})
          </button>
          <button
            onClick={() => setFilterState('settled')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
              filterState === 'settled'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Settled ({customers.filter((c) => (c.outstanding || 0) === 0).length})
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Phone</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6 text-center">Total Invoices</th>
                <th className="py-3.5 px-6 text-right">Outstanding</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCustomers.map((customer) => {
                const hasOutstanding = (customer.outstanding || 0) > 0;

                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setSelectedCustomerId(customer.id)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {customer.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {customer.city ? `${customer.city}, ${customer.state}` : customer.contactPerson || customer.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-medium text-slate-700">
                      {customer.phone}
                    </td>

                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {customer.email || '—'}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs">
                        {customer.invoicesCount || 0}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <span className={`font-bold ${hasOutstanding ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {formatCurrency(customer.outstanding || 0)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateToCreateInvoice(customer)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Create invoice for this customer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Invoice</span>
                        </button>
                        <button
                          onClick={() => setSelectedCustomerId(customer.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View customer profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete customer "${customer.name}"?`)) {
                              deleteCustomer(customer.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No customers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCustomerAdded={(newCust) => setSelectedCustomerId(newCust.id)}
      />

      {/* Customer Details Modal */}
      {selectedCustomerId && (
        <CustomerDetailsModal
          customerId={selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
        />
      )}
    </div>
  );
};
