import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Tag, 
  Layers, 
  CheckCircle2, 
  SlidersHorizontal,
  PlusCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { StatusBadge } from '../components/common/StatusBadge';
import { AddProductModal } from '../components/products/AddProductModal';

export const ProductsScreen = () => {
  const { products, deleteProduct, navigateToCreateInvoice } = useBilling();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = ['All', 'Electronics', 'Accessories', 'Services', 'Hardware'];

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      (prod.hsn && prod.hsn.includes(search)) ||
      (prod.description && prod.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || prod.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Products & Services
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage your items catalog, prices, and GST rates
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search & Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product, SKU or HSN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="py-3.5 px-6">Product / Service</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6 text-right">Unit Price</th>
                <th className="py-3.5 px-6 text-center">Tax Rate</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {product.hsn ? `HSN: ${product.hsn}` : `ID: ${product.id}`} {product.unit ? `• per ${product.unit}` : ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs">
                      {product.category}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right font-extrabold text-slate-900">
                    {formatCurrency(product.price)}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                      {product.taxRate}% GST
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <StatusBadge status={product.status || 'Active'} size="sm" />
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete product "${product.name}"?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingProduct}
      />
    </div>
  );
};
