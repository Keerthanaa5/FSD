import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  hsn: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Price must be non-negative']
  },
  taxRate: {
    type: Number,
    default: 18,
    min: [0, 'Tax rate must be non-negative']
  },
  unit: {
    type: String,
    default: 'Unit',
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
