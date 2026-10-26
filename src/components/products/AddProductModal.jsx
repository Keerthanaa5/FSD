import React, { useState } from 'react';
import { useBilling } from '../../context/BillingContext';
import { X, Package, Tag, IndianRupee, Percent, AlignLeft } from 'lucide-react';

export const AddProductModal = ({ isOpen, onClose, initialData = null }) => {
  const { addProduct, updateProduct } = useBilling();

  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      category: 'Electronics',
      hsn: '8471',
      price: '',
      taxRate: 18,
      unit: 'Unit',
      description: '',
      status: 'Active'
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;

    if (initialData?.id) {
      updateProduct(initialData.id, formData);
    } else {
      addProduct(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {initialData ? 'Edit Item' : 'Add New Product / Service'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Define catalog items for quick invoicing</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Product / Service Name *
            </label>
            <div className="relative">
              <Package className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. 27-inch 4K UHD IPS Monitor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Services">Services</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                HSN / SAC Code
              </label>
              <input
                type="text"
                placeholder="e.g. 84713010"
                value={formData.hsn || ''}
                onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Unit Price (₹) *
              </label>
              <div className="relative">
                <span className="text-slate-400 text-sm font-bold absolute left-3.5 top-1/2 -translate-y-1/2">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  placeholder="50000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                GST Tax Rate (%) *
              </label>
              <select
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value={0}>0% (Exempted)</option>
                <option value={5}>5% GST</option>
                <option value={12}>12% GST</option>
                <option value={18}>18% GST (Standard)</option>
                <option value={28}>28% GST</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              placeholder="Product specifications or service scope..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Unit of Measure
              </label>
              <input
                type="text"
                placeholder="Unit / Pcs / Year"
                value={formData.unit || 'Unit'}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              {initialData ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
