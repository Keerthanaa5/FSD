import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public / Private
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public / Private
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public / Private
export const createProduct = async (req, res) => {
  try {
    const { name, category, hsn, price, taxRate, unit, description, status } = req.body;

    if (!name || price === undefined || price === null) {
      return res.status(400).json({ success: false, message: 'Product Name and Price are required' });
    }

    const product = await Product.create({
      name,
      category: category || 'General',
      hsn: hsn || '',
      price: Number(price) || 0,
      taxRate: Number(taxRate) !== undefined ? Number(taxRate) : 18,
      unit: unit || 'Unit',
      description: description || '',
      status: status || 'Active'
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public / Private
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public / Private
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product removed successfully', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
