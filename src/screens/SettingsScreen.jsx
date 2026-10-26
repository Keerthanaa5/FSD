import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Hash, 
  CreditCard, 
  QrCode, 
  Save, 
  RotateCcw, 
  CheckCircle2,
  FileText,
  ShieldCheck,
  Percent
} from 'lucide-react';

export const SettingsScreen = () => {
  const { company, setCompany, clearAllData, addToast } = useBilling();
  const [formData, setFormData] = useState({ ...company });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setCompany(formData);
    addToast('Company and billing configuration saved!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Settings & Business Profile
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Customize company tax information, banking details, and invoice preferences
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearAllData}
            className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Identity & GST */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Company Identity & GST Registration</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Business / Company Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                GSTIN Number *
              </label>
              <input
                type="text"
                name="gstin"
                required
                maxLength={15}
                value={formData.gstin}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                PAN Number
              </label>
              <input
                type="text"
                name="pan"
                maxLength={10}
                value={formData.pan || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Billing Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Phone Number *
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Office Address *
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                State & Pincode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                />
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Banking and UPI Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Banking & Settlement Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Number
              </label>
              <input
                type="text"
                name="accountNo"
                value={formData.accountNo}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                IFSC Code
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                UPI ID / VPA
              </label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-indigo-700"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Invoicing Terms */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Default Terms & Conditions</h3>
          </div>

          <textarea
            rows={4}
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 leading-relaxed"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
