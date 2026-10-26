import React from 'react';
import { useBilling } from '../../context/BillingContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useBilling();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
        let bgClass = "bg-white border-slate-200 text-slate-800 shadow-xl";

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-indigo-500 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border ${bgClass} shadow-lg transition-all duration-300 animate-fade-in`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 ml-3 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
