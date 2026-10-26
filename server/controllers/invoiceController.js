import Invoice from '../models/Invoice.js';
import Customer from '../models/Customer.js';

// Helper to recalculate customer metrics
const updateCustomerMetrics = async (customerId, customerName) => {
  try {
    const query = [];
    if (customerId) query.push({ customerId: customerId });
    if (customerName) query.push({ customerName: customerName });

    const invoices = await Invoice.find({ $or: query });
    const totalBilled = invoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
    const totalPaid = invoices.filter((inv) => inv.status === 'Paid').reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
    const outstanding = Math.max(0, totalBilled - totalPaid);

    let customer = null;
    if (customerId && customerId.match(/^[0-9a-fA-F]{24}$/)) {
      customer = await Customer.findById(customerId);
    }
    if (!customer && customerName) {
      customer = await Customer.findOne({ name: customerName });
    }

    if (customer) {
      customer.totalBilled = totalBilled;
      customer.totalPaid = totalPaid;
      customer.outstanding = outstanding;
      customer.invoicesCount = invoices.length;
      await customer.save();
    }
  } catch (err) {
    console.error('Error updating customer metrics:', err.message);
  }
};

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Public / Private
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single invoice by ID (or invoiceNumber)
// @route   GET /api/invoices/:id
// @access  Public / Private
export const getInvoiceById = async (req, res) => {
  try {
    let invoice = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      invoice = await Invoice.findById(req.params.id);
    }
    if (!invoice) {
      invoice = await Invoice.findOne({ invoiceNumber: req.params.id });
    }

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Public / Private
export const createInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      customerId,
      customerName,
      date,
      dueDate,
      status,
      paymentMethod,
      items,
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      taxableAmount,
      taxRate,
      taxAmount,
      cgst,
      sgst,
      igst,
      total,
      paidAmount,
      balanceDue,
      notes,
      isInterstate
    } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer name and line items are required' });
    }

    // Auto-generate invoice number if not provided
    let finalInvNum = invoiceNumber;
    if (!finalInvNum) {
      const count = await Invoice.countDocuments();
      finalInvNum = `INV-${String(count + 1).padStart(4, '0')}`;
    }

    const newInvoice = await Invoice.create({
      invoiceNumber: finalInvNum,
      customerId: customerId || '',
      customerName,
      date: date || new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: status || 'Pending',
      paymentMethod: paymentMethod || 'Bank Transfer',
      items,
      subtotal: Number(subtotal) || 0,
      discountType: discountType || 'fixed',
      discountValue: Number(discountValue) || 0,
      discountAmount: Number(discountAmount) || 0,
      taxableAmount: Number(taxableAmount) || 0,
      taxRate: Number(taxRate) || 18,
      taxAmount: Number(taxAmount) || 0,
      cgst: Number(cgst) || 0,
      sgst: Number(sgst) || 0,
      igst: Number(igst) || 0,
      total: Number(total) || 0,
      paidAmount: status === 'Paid' ? Number(total) : Number(paidAmount) || 0,
      balanceDue: status === 'Paid' ? 0 : Number(balanceDue || total) || 0,
      notes: notes || '',
      isInterstate: Boolean(isInterstate),
      paidDate: status === 'Paid' ? new Date().toISOString().split('T')[0] : null
    });

    // Update customer statistics in MongoDB
    await updateCustomerMetrics(customerId, customerName);

    res.status(201).json({ success: true, data: newInvoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an invoice
// @route   PUT /api/invoices/:id
// @access  Public / Private
export const updateInvoice = async (req, res) => {
  try {
    let invoice = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      invoice = await Invoice.findById(req.params.id);
    }
    if (!invoice) {
      invoice = await Invoice.findOne({ invoiceNumber: req.params.id });
    }

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoice._id,
      req.body,
      { new: true, runValidators: true }
    );

    await updateCustomerMetrics(updatedInvoice.customerId, updatedInvoice.customerName);

    res.json({ success: true, data: updatedInvoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Public / Private
export const deleteInvoice = async (req, res) => {
  try {
    let invoice = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      invoice = await Invoice.findById(req.params.id);
    }
    if (!invoice) {
      invoice = await Invoice.findOne({ invoiceNumber: req.params.id });
    }

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const { customerId, customerName } = invoice;
    await invoice.deleteOne();
    await updateCustomerMetrics(customerId, customerName);

    res.json({ success: true, message: 'Invoice removed successfully', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update payment status (MARK AS PAID)
// @route   PATCH /api/invoices/:id/payment
// @access  Public / Private
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status, paymentMethod, paidAmount } = req.body;

    let invoice = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      invoice = await Invoice.findById(req.params.id);
    }
    if (!invoice) {
      invoice = await Invoice.findOne({ invoiceNumber: req.params.id });
    }

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const newStatus = status || 'Paid';
    invoice.status = newStatus;
    if (paymentMethod) invoice.paymentMethod = paymentMethod;

    if (newStatus === 'Paid') {
      invoice.paidAmount = invoice.total;
      invoice.balanceDue = 0;
      invoice.paidDate = new Date().toISOString().split('T')[0];
    } else if (newStatus === 'Pending') {
      invoice.paidAmount = 0;
      invoice.balanceDue = invoice.total;
      invoice.paidDate = null;
    } else if (paidAmount !== undefined) {
      invoice.paidAmount = Number(paidAmount);
      invoice.balanceDue = Math.max(0, invoice.total - Number(paidAmount));
    }

    await invoice.save();
    await updateCustomerMetrics(invoice.customerId, invoice.customerName);

    res.json({ success: true, message: 'Payment status updated', data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
