import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  PlusCircle, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  Receipt,
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeTab, setActiveTab, logout, invoices, clearAllData, currentUser } = useBilling();
  const [invoicesOpen, setInvoicesOpen] = useState(true);

  const pendingCount = invoices.filter((inv) => inv.status === 'Pending').length;
  const overdueCount = invoices.filter((inv) => inv.status === 'Overdue').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'products',
      label: 'Products & Services',
      icon: Package,
    },
    {
      id: 'invoices-group',
      label: 'Invoices',
      icon: FileText,
      hasSubmenu: true,
      badge: pendingCount + overdueCount > 0 ? pendingCount + overdueCount : null,
      subItems: [
        { id: 'invoices', label: 'All Invoices' },
        { id: 'create-invoice', label: 'Create Invoice', icon: PlusCircle }
      ]
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800/80 transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-wider font-sans">BILLFLOW</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">PRO</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Smart Billing System</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            
            if (item.hasSubmenu) {
              const isGroupActive = activeTab === 'invoices' || activeTab === 'create-invoice' || activeTab === 'invoice-preview';

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => setInvoicesOpen(!invoicesOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isGroupActive ? 'bg-slate-800/80 text-white' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isGroupActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.badge}
                        </span>
                      )}
                      {invoicesOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {invoicesOpen && (
                    <div className="pl-9 pr-2 space-y-1 py-1">
                      {item.subItems.map((sub) => {
                        const isSubActive = activeTab === sub.id || (sub.id === 'invoices' && activeTab === 'invoice-preview');
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleNavClick(sub.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              isSubActive
                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                            }`}
                          >
                            <span>{sub.label}</span>
                            {sub.id === 'create-invoice' && <PlusCircle className="w-3.5 h-3.5 text-indigo-200" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User Profile & Action Bar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/30 space-y-2">
          {/* Quick Demo Reset & Info */}
          <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online v2.4</span>
            </span>
            <button
              onClick={clearAllData}
              title="Clear all records"
              className="flex items-center gap-1 hover:text-rose-400 transition-colors py-0.5 px-1.5 rounded hover:bg-slate-800"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Clear Data</span>
            </button>
          </div>

          {/* User Card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                AD
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{currentUser?.name || 'Admin'}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser?.email || 'admin@billflow.in'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
