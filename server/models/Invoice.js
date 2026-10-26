import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  productId: {
    type: String
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  hsn: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  taxRate: {
    type: Number,
    default: 18,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: true });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, 'Invoice number is required'],
    unique: true,
    trim: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  customerId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true,
    default: () => new Date().toISOString().split('T')[0]
  },
  dueDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue', 'Draft', 'Partial'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    default: 'Bank Transfer'
  },
  paidDate: {
    type: String
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  discountType: {
    type: String,
    enum: ['fixed', 'percent'],
    default: 'fixed'
  },
  discountValue: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  taxableAmount: {
    type: Number,
    default: 0
  },
  taxRate: {
    type: Number,
    default: 18
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  cgst: {
    type: Number,
    default: 0
  },
  sgst: {
    type: Number,
    default: 0
  },
  igst: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  balanceDue: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  isInterstate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
