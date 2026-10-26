import React, { useState, useRef, useEffect } from 'react';
import { useBilling } from '../../context/BillingContext';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  User, 
  LogOut, 
  Settings, 
  Shield, 
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const Header = ({ onOpenMobileMenu }) => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    logout, 
    invoices, 
    customers, 
    products, 
    navigateToCreateInvoice,
    navigateToPreview
  } = useBilling();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingInvoices = invoices.filter((i) => i.status === 'Pending');
  const overdueInvoices = invoices.filter((i) => i.status === 'Overdue');
  const totalNotifications = pendingInvoices.length + overdueInvoices.length;

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: "Here's what's happening with your business today." };
      case 'customers':
        return { title: 'Customers', subtitle: 'Manage your customer information' };
      case 'products':
        return { title: 'Products & Services', subtitle: 'Manage items, inventory & billing rates' };
      case 'invoices':
        return { title: 'Invoices', subtitle: 'Track and manage all client billings & history' };
      case 'create-invoice':
        return { title: 'Create Invoice', subtitle: 'Generate a new GST-compliant business invoice' };
      case 'invoice-preview':
        return { title: 'Invoice Preview', subtitle: 'Print, download PDF or share with client' };
      case 'payments':
        return { title: 'Payments', subtitle: 'Track receivables, recorded payments & settlements' };
      case 'reports':
        return { title: 'Financial Reports', subtitle: 'Sales analytics, tax summary & top customer trends' };
      case 'settings':
        return { title: 'Settings', subtitle: 'Business profile, GST configuration & preferences' };
      default:
        return { title: 'BILLFLOW', subtitle: 'Billing & Invoice Management' };
    }
  };

  const pageInfo = getPageTitle();

  // Filtered results for global search
  const searchResults = searchQuery.trim() ? {
    invoices: invoices.filter((inv) => 
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    customers: customers.filter((cust) => 
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cust.phone.includes(searchQuery)
    ).slice(0, 3),
    products: products.filter((prod) => 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3)
  } : null;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {pageInfo.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Search, Quick Actions, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Global Quick Search */}
        <div className="relative hidden md:block w-64 lg:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setGlobalSearchOpen(true)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Quick Search Dropdown Results */}
          {globalSearchOpen && searchQuery.trim() && searchResults && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-fade-in max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase">
                <span>Quick Results</span>
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">Clear</button>
              </div>

              {/* Invoices */}
              {searchResults.invoices.length > 0 && (
                <div className="mb-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Invoices</div>
                  {searchResults.invoices.map((inv) => (
                    <button
                      key={inv.id}
                      onClick={() => {
                        navigateToPreview(inv.id);
                        setGlobalSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-semibold text-indigo-600">{inv.invoiceNumber}</span>
                      <span className="text-slate-600 truncate max-w-[120px]">{inv.customerName}</span>
                      <span className="font-medium text-slate-900">{formatCurrency(inv.total)}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Customers */}
              {searchResults.customers.length > 0 && (
                <div className="mb-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Customers</div>
                  {searchResults.customers.map((cust) => (
                    <button
                      key={cust.id}
                      onClick={() => {
                        setActiveTab('customers');
                        setGlobalSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-slate-800">{cust.name}</span>
                      <span className="text-slate-500 text-[11px]">{cust.phone}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Products */}
              {searchResults.products.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Products</div>
                  {searchResults.products.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => {
                        setActiveTab('products');
                        setGlobalSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-slate-800 truncate max-w-[150px]">{prod.name}</span>
                      <span className="font-medium text-slate-900">{formatCurrency(prod.price)}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.invoices.length === 0 && searchResults.customers.length === 0 && searchResults.products.length === 0 && (
                <div className="p-3 text-center text-slate-500 text-xs">
                  No matching records found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary CTA: + Create Invoice */}
        <button
          onClick={() => navigateToCreateInvoice()}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Invoice</span>
          <span className="sm:hidden">Create</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {totalNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Notifications</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-semibold border border-rose-100">
                    {totalNotifications} action items
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  Close
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                {overdueInvoices.map((inv) => (
                  <div 
                    key={inv.id}
                    onClick={() => {
                      navigateToPreview(inv.id);
                      setShowNotifications(false);
                    }}
                    className="py-3 flex items-start gap-3 hover:bg-rose-50/50 p-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-rose-100 text-rose-600 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900">
                        Invoice {inv.invoiceNumber} is Overdue!
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {inv.customerName} • {formatCurrency(inv.total)}
                      </p>
                      <p className="text-[10px] text-rose-600 font-medium mt-0.5">Due date was {inv.dueDate}</p>
                    </div>
                  </div>
                ))}

                {pendingInvoices.map((inv) => (
                  <div 
                    key={inv.id}
                    onClick={() => {
                      navigateToPreview(inv.id);
                      setShowNotifications(false);
                    }}
                    className="py-3 flex items-start gap-3 hover:bg-amber-50/50 p-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-600 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900">
                        Payment Pending ({inv.invoiceNumber})
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {inv.customerName} • {formatCurrency(inv.total)}
                      </p>
                      <p className="text-[10px] text-amber-600 font-medium mt-0.5">Due on {inv.dueDate}</p>
                    </div>
                  </div>
                ))}

                {totalNotifications === 0 && (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    All client payments are up to date!
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 mt-2 text-center">
                <button
                  onClick={() => {
                    setActiveTab('payments');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View All Payment Statuses →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User / Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              AD
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-bold text-slate-800 leading-none">{currentUser?.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{currentUser?.role || 'Business Owner'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Administrator
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Company Profile & Settings</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('reports');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Financial Reports</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
