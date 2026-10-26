import React, { useState, useEffect } from 'react';
import { useBilling } from '../context/BillingContext';
import { 
  Plus, 
  Trash2, 
  User, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Percent, 
  IndianRupee, 
  ArrowLeft, 
  Save, 
  Eye, 
  Building, 
  Hash, 
  MapPin, 
  AlertCircle,
  Package,
  Users
} from 'lucide-react';
import { formatCurrency, numberToWordsINR } from '../utils/formatters';
import { AddCustomerModal } from '../components/customers/AddCustomerModal';

export const CreateInvoiceScreen = () => {
  const { 
    customers, 
    products, 
    invoices, 
    createInvoice, 
    setActiveTab, 
    company, 
    editInvoiceData 
  } = useBilling();

  // Next invoice number calculation
  const nextInvoiceNumber = `INV-${String(invoices.length + 1).padStart(4, '0')}`;

  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // State
  const [invoiceNumber, setInvoiceNumber] = useState(nextInvoiceNumber);
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [dueDate, setDueDate] = useState(nextWeek);
  const [selectedCustomerId, setSelectedCustomerId] = useState(editInvoiceData?.customerId || (customers.length > 0 ? customers[0].id : ''));
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [discountType, setDiscountType] = useState('fixed');
  const [discountValue, setDiscountValue] = useState(0);
  const [notes, setNotes] = useState('Payment is due within 7 days of invoice date. Thank you for your business!');
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);

  // Line items start empty
  const [items, setItems] = useState([]);

  // Selected customer details
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || null;

  // Check if Interstate (IGST) or Intrastate (CGST + SGST)
  const isInterstate = selectedCustomer?.state && company?.state && selectedCustomer.state.trim().toLowerCase() !== company.state.trim().toLowerCase();

  // Subtotal calculation
  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return sum + (qty * price);
  }, 0);

  // Discount calculation
  const discountAmount = discountType === 'percent'
    ? Math.round((subtotal * (Number(discountValue) || 0)) / 100)
    : Math.min(subtotal, Number(discountValue) || 0);

  // Taxable amount
  const taxableAmount = Math.max(0, subtotal - discountAmount);

  // Tax calculation
  const totalTaxAmount = items.reduce((sum, item) => {
    const itemSub = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    if (subtotal === 0) return 0;
    const itemDiscounted = itemSub - (itemSub / subtotal) * discountAmount;
    const tax = (itemDiscounted * (Number(item.taxRate) || 0)) / 100;
    return sum + tax;
  }, 0);

  const roundedTaxAmount = Math.round(totalTaxAmount);
  const cgstAmount = isInterstate ? 0 : Math.round(roundedTaxAmount / 2);
  const sgstAmount = isInterstate ? 0 : Math.round(roundedTaxAmount / 2);
  const igstAmount = isInterstate ? roundedTaxAmount : 0;

  const grandTotal = taxableAmount + roundedTaxAmount;

  // Handlers for Line Items
  const handleAddItem = () => {
    const newItem = {
      id: Date.now() + Math.random(),
      productId: 'CUSTOM',
      name: '',
      hsn: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: company.defaultTaxRate || 18,
      amount: 0
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleProductSelect = (index, prodId) => {
    const selectedProd = products.find((p) => p.id === prodId);
    const updated = [...items];

    if (selectedProd) {
      updated[index] = {
        ...updated[index],
        productId: selectedProd.id,
        name: selectedProd.name,
        hsn: selectedProd.hsn || '',
        unitPrice: selectedProd.price || 0,
        taxRate: selectedProd.taxRate !== undefined ? selectedProd.taxRate : 18,
        amount: (Number(updated[index].quantity) || 1) * (Number(selectedProd.price) || 0)
      };
    } else {
      updated[index] = {
        ...updated[index],
        productId: 'CUSTOM',
        name: '',
        unitPrice: 0,
        amount: 0
      };
    }
    setItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };

    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(value) : Number(item.quantity);
      const p = field === 'unitPrice' ? Number(value) : Number(item.unitPrice);
      item.amount = (q || 0) * (p || 0);
    }

    updated[index] = item;
    setItems(updated);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Submit & Generate Invoice
  const handleGenerateInvoice = (statusOverride = null) => {
    if (!selectedCustomer) {
      alert("Please select or add a customer first.");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one line item.");
      return;
    }

    // Check if items have names
    const hasEmptyName = items.some(it => !it.name.trim());
    if (hasEmptyName) {
      alert("Please enter a description/name for all line items.");
      return;
    }

    const newInvoiceData = {
      invoiceNumber: invoiceNumber.trim() || nextInvoiceNumber,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      date: invoiceDate,
      dueDate: dueDate,
      status: statusOverride || paymentStatus,
      paymentMethod: paymentMethod,
      items: items.map((it) => ({
        ...it,
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        taxRate: Number(it.taxRate) || 0,
        taxAmount: Math.round(((Number(it.quantity) * Number(it.unitPrice)) * (Number(it.taxRate) || 0)) / 100),
        amount: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0)
      })),
      subtotal,
      discountType,
      discountValue: Number(discountValue) || 0,
      discountAmount,
      taxableAmount,
      taxRate: 18,
      taxAmount: roundedTaxAmount,
      cgst: cgstAmount,
      sgst: sgstAmount,
      igst: igstAmount,
      total: grandTotal,
      paidAmount: (statusOverride || paymentStatus) === 'Paid' ? grandTotal : 0,
      balanceDue: (statusOverride || paymentStatus) === 'Paid' ? 0 : grandTotal,
      notes,
      isInterstate
    };

    createInvoice(newInvoiceData);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-12">
      {/* Top Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('invoices')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Create New Invoice
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Tax invoice with dynamic GST computation and instant preview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleGenerateInvoice('Draft')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleGenerateInvoice()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02]"
          >
            <Eye className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Invoice Info, Customer & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Invoice Meta Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
              Invoice Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Invoice Number *
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Invoice Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Due Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Customer Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Customer / Bill To
              </h3>
              <button
                type="button"
                onClick={() => setIsNewCustomerModalOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Customer</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Customer *
              </label>
              {customers.length > 0 ? (
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="">-- Choose a Customer --</option>
                  {customers.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.name} {cust.phone ? `(${cust.phone})` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  <p>No customers added yet.</p>
                  <button
                    type="button"
                    onClick={() => setIsNewCustomerModalOpen(true)}
                    className="mt-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold"
                  >
                    + Add Your First Customer
                  </button>
                </div>
              )}
            </div>

            {/* Display Selected Customer Details */}
            {selectedCustomer && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-fade-in">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Billing Address</span>
                  <p className="font-semibold text-slate-900 mt-1">{selectedCustomer.name}</p>
                  <p className="text-slate-600 leading-relaxed mt-0.5">
                    {selectedCustomer.address || 'Address not specified'}
                    {selectedCustomer.city ? `, ${selectedCustomer.city}` : ''}
                    {selectedCustomer.state ? ` ${selectedCustomer.state}` : ''}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Contact & Tax Info</span>
                  <p className="text-slate-700 mt-1">Phone: <span className="font-semibold text-slate-900">{selectedCustomer.phone}</span></p>
                  <p className="text-slate-700">Email: <span className="font-medium text-slate-900">{selectedCustomer.email || '—'}</span></p>
                  {selectedCustomer.gstin && (
                    <p className="text-slate-700 mt-1">
                      GSTIN: <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">{selectedCustomer.gstin}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Invoice Items Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Invoice Items
                </h3>
                <p className="text-xs text-slate-500 font-medium">Add products or custom items</p>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3">
                <Package className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  No line items added to this invoice yet.
                </p>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  + Add First Line Item
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[550px]">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="py-2.5 px-3 w-5/12">Product / Description</th>
                      <th className="py-2.5 px-3 w-2/12 text-center">Quantity</th>
                      <th className="py-2.5 px-3 w-2/12 text-right">Unit Price (₹)</th>
                      <th className="py-2.5 px-3 w-1/12 text-center">Tax %</th>
                      <th className="py-2.5 px-3 w-2/12 text-right">Amount (₹)</th>
                      <th className="py-2.5 px-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/50">
                        {/* Product Selector / Name */}
                        <td className="py-3 px-3">
                          {products.length > 0 && (
                            <select
                              value={item.productId}
                              onChange={(e) => handleProductSelect(idx, e.target.value)}
                              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-1"
                            >
                              <option value="CUSTOM">-- Custom Item / Enter Manually --</option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} (₹{p.price.toLocaleString('en-IN')})
                                </option>
                              ))}
                            </select>
                          )}
                          <input
                            type="text"
                            required
                            placeholder="Item name / description"
                            value={item.name}
                            onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-700"
                          />
                        </td>

                        {/* Quantity */}
                        <td className="py-3 px-3 text-center align-top">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>

                        {/* Unit Price */}
                        <td className="py-3 px-3 text-right align-top">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-24 px-2 py-1.5 text-right bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>

                        {/* Tax Rate */}
                        <td className="py-3 px-3 text-center align-top">
                          <select
                            value={item.taxRate}
                            onChange={(e) => handleItemChange(idx, 'taxRate', Number(e.target.value))}
                            className="w-16 px-1.5 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                          >
                            <option value={0}>0%</option>
                            <option value={5}>5%</option>
                            <option value={12}>12%</option>
                            <option value={18}>18%</option>
                            <option value={28}>28%</option>
                          </select>
                        </td>

                        {/* Line Total */}
                        <td className="py-3 px-3 text-right font-bold text-slate-900 align-top pt-4">
                          {formatCurrency(item.amount)}
                        </td>

                        {/* Delete */}
                        <td className="py-3 px-2 text-center align-top pt-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {items.length > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-xl text-xs font-bold text-indigo-600 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Line Item</span>
                </button>
              </div>
            )}
          </div>

          {/* Card 4: Notes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
              Notes & Terms
            </h3>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Terms of payment, delivery notes, or special instructions..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none"
            />
          </div>
        </div>

        {/* Right 1 Column: Summary, Discount, GST & Payment Status */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-5 sticky top-20">
            <h3 className="text-base font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Invoice Summary</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                INR (₹)
              </span>
            </h3>

            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>

            {/* Discount Control */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Discount</span>
                <span className="font-bold text-rose-600">- {formatCurrency(discountAmount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                  />
                </div>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setDiscountType('fixed')}
                    className={`px-2 py-1 rounded text-xs font-bold ${discountType === 'fixed' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600'}`}
                  >
                    ₹ Flat
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('percent')}
                    className={`px-2 py-1 rounded text-xs font-bold ${discountType === 'percent' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600'}`}
                  >
                    %
                  </button>
                </div>
              </div>
            </div>

            {/* Taxable Amount */}
            <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
              <span className="text-slate-700 font-semibold">Taxable Amount</span>
              <span className="font-bold text-slate-900">{formatCurrency(taxableAmount)}</span>
            </div>

            {/* GST Breakdown */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 font-medium">
                <span>GST Tax</span>
                <span className="font-bold text-slate-800">{formatCurrency(roundedTaxAmount)}</span>
              </div>

              {!isInterstate ? (
                <>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>CGST</span>
                    <span>{formatCurrency(cgstAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>SGST</span>
                    <span>{formatCurrency(sgstAmount)}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>IGST (Interstate)</span>
                  <span>{formatCurrency(igstAmount)}</span>
                </div>
              )}
            </div>

            {/* Final TOTAL */}
            <div className="p-4 rounded-2xl bg-indigo-900 text-white space-y-1 shadow-lg shadow-indigo-900/20">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-200">TOTAL AMOUNT</span>
                <span className="text-2xl font-black text-white">{formatCurrency(grandTotal)}</span>
              </div>
              <p className="text-[10px] text-indigo-300 font-medium italic pt-1">
                {numberToWordsINR(grandTotal)}
              </p>
            </div>

            {/* Payment Status Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Initial Payment Status *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Pending', 'Paid', 'Partial'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setPaymentStatus(status)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      paymentStatus === status
                        ? status === 'Paid'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : status === 'Pending'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
              >
                <option value="Bank Transfer">Bank Transfer (NEFT / RTGS)</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="Credit Card">Credit / Debit Card</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3">
              <button
                type="button"
                onClick={() => handleGenerateInvoice()}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Generate Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateInvoice('Draft')}
                className="w-full py-2.5 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Add Customer Modal */}
      <AddCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        onCustomerAdded={(newCust) => setSelectedCustomerId(newCust.id)}
      />
    </div>
  );
};
