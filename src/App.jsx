import React, { useState } from 'react';
import { BillingProvider, useBilling } from './context/BillingContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/Toast';

import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { CustomersScreen } from './screens/CustomersScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { CreateInvoiceScreen } from './screens/CreateInvoiceScreen';
import { InvoicePreviewScreen } from './screens/InvoicePreviewScreen';
import { InvoicesListScreen } from './screens/InvoicesListScreen';
import { PaymentsScreen } from './screens/PaymentsScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const MainLayout = () => {
  const { isAuthenticated, activeTab } = useBilling();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If unauthenticated or on login tab, show Login Screen
  if (!isAuthenticated || activeTab === 'login') {
    return <LoginScreen />;
  }

  // Render active content screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'customers':
        return <CustomersScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'invoices':
        return <InvoicesListScreen />;
      case 'create-invoice':
        return <CreateInvoiceScreen />;
      case 'invoice-preview':
        return <InvoicePreviewScreen />;
      case 'payments':
        return <PaymentsScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header onOpenMobileMenu={() => setIsMobileSidebarOpen(true)} />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderScreen()}
        </main>
      </div>

      {/* Global Toast Alert Notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <BillingProvider>
      <MainLayout />
    </BillingProvider>
  );
}

export default App;
