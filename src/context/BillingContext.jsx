import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_COMPANY, 
  INITIAL_CUSTOMERS, 
  INITIAL_PRODUCTS, 
  INITIAL_INVOICES 
} from '../data/initialData';
import api from '../services/api';
import confetti from 'canvas-confetti';

const BillingContext = createContext(null);

export const BillingProvider = ({ children }) => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('billflow_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-1',
      name: 'Admin User',
      email: 'admin@billflow.in',
      role: 'Business Owner'
    };
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('billflow_auth');
    return saved ? JSON.parse(saved) : true;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('billflow_token') || '';
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [previewInvoiceId, setPreviewInvoiceId] = useState(null);
  const [editInvoiceData, setEditInvoiceData] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Entities state
  const [company, setCompany] = useState(() => {
    const saved = localStorage.getItem('billflow_company');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('billflow_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('billflow_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('billflow_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist LocalStorage
  useEffect(() => {
    localStorage.setItem('billflow_company', JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem('billflow_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('billflow_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('billflow_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('billflow_auth', JSON.stringify(isAuthenticated));
    localStorage.setItem('billflow_user', JSON.stringify(currentUser));
    if (token) {
      localStorage.setItem('billflow_token', token);
    } else {
      localStorage.removeItem('billflow_token');
    }
  }, [isAuthenticated, currentUser, token]);

  // Toast Notification helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore if confetti blocked
    }
  };

  // Fetch all data from backend API
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch customers
      try {
        const custRes = await api.customers.getAll();
        if (custRes?.success && Array.isArray(custRes.data)) {
          const formatted = custRes.data.map(c => ({ ...c, id: c._id || c.id }));
          setCustomers(formatted);
        }
      } catch (e) {
        console.warn('API fetch customers error (using local state):', e.message);
      }

      // Fetch products
      try {
        const prodRes = await api.products.getAll();
        if (prodRes?.success && Array.isArray(prodRes.data)) {
          const formatted = prodRes.data.map(p => ({ ...p, id: p._id || p.id }));
          setProducts(formatted);
        }
      } catch (e) {
        console.warn('API fetch products error (using local state):', e.message);
      }

      // Fetch invoices
      try {
        const invRes = await api.invoices.getAll();
        if (invRes?.success && Array.isArray(invRes.data)) {
          const formatted = invRes.data.map(i => ({ ...i, id: i.invoiceNumber || i._id || i.id }));
          setInvoices(formatted);
        }
      } catch (e) {
        console.warn('API fetch invoices error (using local state):', e.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch backend data on startup
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  // Auth actions
  const login = async (email, password) => {
    try {
      const res = await api.auth.login({ email, password });
      if (res?.success && res.user) {
        setIsAuthenticated(true);
        setCurrentUser(res.user);
        if (res.token) setToken(res.token);
        setActiveTab('dashboard');
        addToast(`Welcome back, ${res.user.name}! Successfully logged in.`, 'success');
        fetchAllData();
        return;
      }
    } catch (err) {
      console.warn('Backend login fallback to local session:', err.message);
    }

    // Local fallback
    setIsAuthenticated(true);
    setCurrentUser({
      id: 'usr-1',
      name: email.startsWith('staff') ? 'Billing Staff' : 'Admin User',
      email: email || 'admin@billflow.in',
      role: email.startsWith('staff') ? 'Staff' : 'Business Owner'
    });
    setActiveTab('dashboard');
    addToast('Welcome back! Successfully logged in.', 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken('');
    setActiveTab('login');
    addToast('You have been logged out.', 'info');
  };

  // Recalculate customer metrics locally
  const syncCustomerMetrics = (currentInvoices, currentCustomers) => {
    return currentCustomers.map((cust) => {
      const custInvoices = currentInvoices.filter((inv) => inv.customerId === cust.id || inv.customerId === cust._id || inv.customerName === cust.name);
      const totalBilled = custInvoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
      const totalPaid = custInvoices.filter((inv) => inv.status === 'Paid').reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
      const outstanding = totalBilled - totalPaid;
      return {
        ...cust,
        invoicesCount: custInvoices.length,
        totalBilled,
        totalPaid,
        outstanding: Math.max(0, outstanding)
      };
    });
  };

  // Customer CRUD with API
  const addCustomer = async (customerData) => {
    try {
      const res = await api.customers.create(customerData);
      if (res?.success && res.data) {
        const newCust = { ...res.data, id: res.data._id || res.data.id };
        setCustomers((prev) => [newCust, ...prev]);
        addToast(`Customer "${newCust.name}" saved to database!`);
        return newCust;
      }
    } catch (error) {
      console.warn('API error adding customer, saving locally:', error.message);
    }

    // Fallback local save
    const newId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    const newCustomer = {
      id: newId,
      ...customerData,
      totalBilled: 0,
      totalPaid: 0,
      outstanding: 0,
      invoicesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    addToast(`Customer "${newCustomer.name}" added successfully!`);
    return newCustomer;
  };

  const updateCustomer = async (id, updatedData) => {
    try {
      const res = await api.customers.update(id, updatedData);
      if (res?.success && res.data) {
        const updated = { ...res.data, id: res.data._id || res.data.id };
        setCustomers((prev) => prev.map((c) => (c.id === id || c._id === id ? updated : c)));
        addToast('Customer details updated in database!');
        return;
      }
    } catch (error) {
      console.warn('API error updating customer, updating locally:', error.message);
    }

    setCustomers((prev) => prev.map((c) => (c.id === id || c._id === id ? { ...c, ...updatedData } : c)));
    addToast('Customer details updated successfully!');
  };

  const deleteCustomer = async (id) => {
    try {
      await api.customers.delete(id);
    } catch (error) {
      console.warn('API error deleting customer, removing locally:', error.message);
    }

    const customer = customers.find((c) => c.id === id || c._id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id && c._id !== id));
    addToast(`Customer "${customer?.name || id}" removed.`, 'info');
  };

  // Product CRUD with API
  const addProduct = async (productData) => {
    try {
      const res = await api.products.create(productData);
      if (res?.success && res.data) {
        const newProd = { ...res.data, id: res.data._id || res.data.id };
        setProducts((prev) => [newProd, ...prev]);
        addToast(`Product "${newProd.name}" saved to database!`);
        return newProd;
      }
    } catch (error) {
      console.warn('API error adding product, saving locally:', error.message);
    }

    const newId = `PROD-${String(products.length + 1).padStart(3, '0')}`;
    const newProduct = {
      id: newId,
      status: 'Active',
      ...productData,
      price: Number(productData.price) || 0,
      taxRate: Number(productData.taxRate) || 18
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast(`Product "${newProduct.name}" added successfully!`);
    return newProduct;
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const res = await api.products.update(id, updatedData);
      if (res?.success && res.data) {
        const updated = { ...res.data, id: res.data._id || res.data.id };
        setProducts((prev) => prev.map((p) => (p.id === id || p._id === id ? updated : p)));
        addToast('Product updated in database!');
        return;
      }
    } catch (error) {
      console.warn('API error updating product, updating locally:', error.message);
    }

    setProducts((prev) => prev.map((p) => (p.id === id || p._id === id ? { ...p, ...updatedData, price: Number(updatedData.price || p.price), taxRate: Number(updatedData.taxRate || p.taxRate) } : p)));
    addToast('Product updated successfully!');
  };

  const deleteProduct = async (id) => {
    try {
      await api.products.delete(id);
    } catch (error) {
      console.warn('API error deleting product, removing locally:', error.message);
    }

    const product = products.find((p) => p.id === id || p._id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
    addToast(`Product "${product?.name || id}" removed.`, 'info');
  };

  // Invoice CRUD with API
  const createInvoice = async (invoiceData) => {
    const nextInvoiceNumber = invoiceData.invoiceNumber || `INV-${String(invoices.length + 1).padStart(4, '0')}`;
    const preparedData = {
      ...invoiceData,
      invoiceNumber: nextInvoiceNumber
    };

    try {
      const res = await api.invoices.create(preparedData);
      if (res?.success && res.data) {
        const newInvoice = {
          ...res.data,
          id: res.data.invoiceNumber || res.data._id
        };
        const updatedInvoices = [newInvoice, ...invoices];
        setInvoices(updatedInvoices);
        setCustomers((prev) => syncCustomerMetrics(updatedInvoices, prev));

        addToast(`Invoice #${newInvoice.invoiceNumber} saved to MongoDB!`);
        setPreviewInvoiceId(newInvoice.id || newInvoice.invoiceNumber);
        setActiveTab('invoice-preview');
        return newInvoice;
      }
    } catch (error) {
      console.warn('API error creating invoice, saving locally:', error.message);
    }

    // Fallback local save
    const newInvoice = {
      id: nextInvoiceNumber,
      ...preparedData,
      createdAt: new Date().toISOString()
    };

    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    setCustomers((prev) => syncCustomerMetrics(updatedInvoices, prev));

    addToast(`Invoice #${newInvoice.invoiceNumber} created successfully!`);
    setPreviewInvoiceId(newInvoice.id);
    setActiveTab('invoice-preview');
    return newInvoice;
  };

  const updateInvoice = async (id, updatedData) => {
    try {
      const res = await api.invoices.update(id, updatedData);
      if (res?.success && res.data) {
        const updated = { ...res.data, id: res.data.invoiceNumber || res.data._id };
        const updatedInvoices = invoices.map((inv) => (inv.id === id || inv._id === id || inv.invoiceNumber === id ? updated : inv));
        setInvoices(updatedInvoices);
        setCustomers((prev) => syncCustomerMetrics(updatedInvoices, prev));
        addToast(`Invoice #${updated.invoiceNumber} updated in database!`);
        return;
      }
    } catch (error) {
      console.warn('API error updating invoice, updating locally:', error.message);
    }

    const updatedInvoices = invoices.map((inv) => (inv.id === id || inv._id === id || inv.invoiceNumber === id ? { ...inv, ...updatedData } : inv));
    setInvoices(updatedInvoices);
    setCustomers((prev) => syncCustomerMetrics(updatedInvoices, prev));
    addToast(`Invoice #${id} updated successfully!`);
  };

  const deleteInvoice = async (id) => {
    try {
      await api.invoices.delete(id);
    } catch (error) {
      console.warn('API error deleting invoice, removing locally:', error.message);
    }

    const updatedInvoices = invoices.filter((inv) => inv.id !== id && inv._id !== id && inv.invoiceNumber !== id);
    setInvoices(updatedInvoices);
    setCustomers((prev) => syncCustomerMetrics(updatedInvoices, prev));
    addToast(`Invoice #${id} deleted.`, 'info');
  };

  // MARK AS PAID Action with API
  const markAsPaid = async (invoiceId, paymentMethod = 'Bank Transfer') => {
    const invoice = invoices.find((inv) => inv.id === invoiceId || inv._id === invoiceId || inv.invoiceNumber === invoiceId);
    if (!invoice) return;

    try {
      const res = await api.invoices.updatePayment(invoice._id || invoice.id || invoice.invoiceNumber, {
        status: 'Paid',
        paymentMethod: paymentMethod || invoice.paymentMethod || 'Bank Transfer'
      });
      if (res?.success && res.data) {
        const updated = { ...res.data, id: res.data.invoiceNumber || res.data._id };
        const updatedInvoices = invoices.map((inv) => (inv.id === invoiceId || inv._id === invoiceId || inv.invoiceNumber === invoiceId ? updated : inv));
        setInvoices(updatedInvoices);
        setCustomers((prev) => syncCustomerMetrics(updatedInvoices, prev));

        triggerConfetti();
        addToast(`Invoice #${updated.invoiceNumber} marked as PAID in MongoDB! (₹${Number(updated.total || 0).toLocaleString('en-IN')})`, 'success');
        return;
      }
    } catch (error) {
      console.warn('API error updating payment status, updating locally:', error.message);
    }

    // Local fallback
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === invoiceId || inv._id === invoiceId || inv.invoiceNumber === invoiceId) {
        return {
          ...inv,
          status: 'Paid',
          paidAmount: inv.total,
          balanceDue: 0,
          paymentMethod: paymentMethod || inv.paymentMethod || 'Bank Transfer',
          paidDate: new Date().toISOString().split('T')[0]
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);
    setCustomers((prev) => syncCustomerMetrics(updatedInvoices, prev));

    triggerConfetti();
    addToast(`Invoice #${invoice.invoiceNumber} marked as PAID! (₹${Number(invoice.total || 0).toLocaleString('en-IN')})`, 'success');
  };

  // Navigation helpers
  const navigateToPreview = (invoiceId) => {
    setPreviewInvoiceId(invoiceId);
    setActiveTab('invoice-preview');
  };

  const navigateToCreateInvoice = (prefillCustomer = null) => {
    if (prefillCustomer) {
      setEditInvoiceData({ customerId: prefillCustomer._id || prefillCustomer.id });
    } else {
      setEditInvoiceData(null);
    }
    setActiveTab('create-invoice');
  };

  // Dynamic live calculations from actual invoices
  const getStats = () => {
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
    
    const paidInvoices = invoices.filter((inv) => inv.status === 'Paid');
    const paidAmount = paidInvoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
    const paidCount = paidInvoices.length;

    const pendingInvoices = invoices.filter((inv) => inv.status === 'Pending');
    const pendingAmount = pendingInvoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
    const pendingCount = pendingInvoices.length;

    const overdueInvoices = invoices.filter((inv) => inv.status === 'Overdue');
    const overdueAmount = overdueInvoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
    const overdueCount = overdueInvoices.length;

    const totalReceivable = pendingAmount + overdueAmount;
    const avgInvoiceValue = totalInvoices > 0 ? Math.round(totalRevenue / totalInvoices) : 0;

    return {
      totalRevenue,
      totalInvoices,
      paidAmount,
      paidCount,
      pendingAmount,
      pendingCount,
      overdueAmount,
      overdueCount,
      totalReceivable,
      avgInvoiceValue,
      revenueGrowth: totalInvoices > 0 ? "+100%" : "0%",
      invoicesGrowth: totalInvoices > 0 ? `+${totalInvoices}` : "0"
    };
  };

  // Clear all data
  const clearAllData = () => {
    setCompany(INITIAL_COMPANY);
    setCustomers([]);
    setProducts([]);
    setInvoices([]);
    localStorage.removeItem('billflow_company');
    localStorage.removeItem('billflow_customers');
    localStorage.removeItem('billflow_products');
    localStorage.removeItem('billflow_invoices');
    addToast('All local cache cleared.', 'info');
  };

  const value = {
    currentUser,
    isAuthenticated,
    token,
    isLoading,
    activeTab,
    setActiveTab,
    previewInvoiceId,
    setPreviewInvoiceId,
    editInvoiceData,
    setEditInvoiceData,
    selectedCustomerId,
    setSelectedCustomerId,
    company,
    setCompany,
    customers,
    products,
    invoices,
    toasts,
    searchQuery,
    setSearchQuery,
    login,
    logout,
    fetchAllData,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addProduct,
    updateProduct,
    deleteProduct,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
    navigateToPreview,
    navigateToCreateInvoice,
    getStats,
    clearAllData,
    addToast,
    removeToast,
    triggerConfetti
  };

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>;
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};
