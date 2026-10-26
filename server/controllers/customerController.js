import Customer from '../models/Customer.js';
import Invoice from '../models/Invoice.js';

// @desc    Get all customers
// @route   GET /api/customers
// @access  Public / Private
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single customer by ID
// @route   GET /api/customers/:id
// @access  Public / Private
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Also fetch their invoices
    const customerInvoices = await Invoice.find({
      $or: [{ customer: customer._id }, { customerId: customer._id.toString() }, { customerName: customer.name }]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...customer.toObject(),
        invoices: customerInvoices
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Public / Private
export const createCustomer = async (req, res) => {
  try {
    const { name, contactPerson, email, phone, address, city, state, pincode, gstin } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Customer Name and Phone are required' });
    }

    const customer = await Customer.create({
      name,
      contactPerson: contactPerson || '',
      email: email || '',
      phone,
      address: address || '',
      city: city || '',
      state: state || 'Tamil Nadu',
      pincode: pincode || '',
      gstin: gstin ? gstin.toUpperCase() : '',
      totalBilled: 0,
      totalPaid: 0,
      outstanding: 0,
      invoicesCount: 0
    });

    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Public / Private
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedCustomer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Public / Private
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await customer.deleteOne();
    res.json({ success: true, message: 'Customer removed successfully', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
