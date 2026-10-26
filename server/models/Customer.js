import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  contactPerson: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true,
    default: 'Tamil Nadu'
  },
  pincode: {
    type: String,
    trim: true
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true
  },
  totalBilled: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  outstanding: {
    type: Number,
    default: 0
  },
  invoicesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
