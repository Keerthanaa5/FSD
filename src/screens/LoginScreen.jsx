import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { 
  Receipt, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle,
  FileCheck, 
  BarChart2 
} from 'lucide-react';

export const LoginScreen = () => {
  const { login } = useBilling();
  const [email, setEmail] = useState('admin@billflow.in');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, password, rememberMe);
      setIsLoading(false);
    }, 400);
  };

  const handleQuickLogin = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
    login(roleEmail, 'password123', true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Feature Column (Modern SaaS split screen) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        {/* Background glow circle */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-2xl text-white tracking-wider">BILLFLOW</span>
            <p className="text-xs text-indigo-300 font-medium tracking-wide">Enterprise Billing Suite</p>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 space-y-8 my-auto max-w-lg">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>GST Ready & Indian Business Compliance</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Streamlined Invoicing & Financial Health in One Place.
            </h2>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              Automate calculations, generate GST-compliant tax invoices, track pending receivables, and stay on top of your cash flow with real-time analytics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <FileCheck className="w-6 h-6 text-indigo-400 mb-2" />
              <h4 className="text-sm font-bold text-white">Instant GST Invoices</h4>
              <p className="text-xs text-slate-400 mt-1">Automatic CGST/SGST, HSN lookup and INR in words.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
              <BarChart2 className="w-6 h-6 text-emerald-400 mb-2" />
              <h4 className="text-sm font-bold text-white">Payment Tracking</h4>
              <p className="text-xs text-slate-400 mt-1">1-Click settlements, overdue alerts and financial reports.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-6">
          <span>© 2026 BILLFLOW Technologies</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-bit Bank Grade Security
          </span>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#F8FAFC]">
        <div className="max-w-md w-full">
          {/* Mobile Brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 tracking-wider">BILLFLOW</span>
              <p className="text-xs text-slate-500">Smart Billing & Invoice Management</p>
            </div>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
            <div className="mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 hidden lg:flex">
                <Receipt className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-sans">
                BILLFLOW
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Smart Billing & Invoice Management
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@billflow.in"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 rounded"
                  />
                  <span className="text-xs text-slate-600 font-medium select-none">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group tracking-wider uppercase disabled:opacity-75"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>LOGIN</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials for Fast Evaluation */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
                Quick Demo Access (1-Click)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@billflow.in')}
                  className="px-3 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-colors text-center"
                >
                  ⚡ Admin Account
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('staff@billflow.in')}
                  className="px-3 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-colors text-center"
                >
                  👤 Billing Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Simple Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
            <p className="text-xs text-slate-500 mt-1">
              For demo prototype mode, use <strong className="text-slate-800">admin@billflow.in</strong> and any password to sign in.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
