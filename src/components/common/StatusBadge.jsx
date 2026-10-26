import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md', showIcon = true }) => {
  const normalizedStatus = (status || 'pending').toLowerCase();

  const configs = {
    paid: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
      label: 'Paid'
    },
    pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
      dot: 'bg-amber-500',
      icon: Clock,
      label: 'Pending'
    },
    overdue: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
      dot: 'bg-rose-500',
      icon: AlertTriangle,
      label: 'Overdue'
    },
    partial: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
      dot: 'bg-blue-500',
      icon: Clock,
      label: 'Partial'
    },
    draft: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      icon: FileText,
      label: 'Draft'
    },
    active: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
      label: 'Active'
    },
    inactive: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
      icon: Clock,
      label: 'Inactive'
    }
  };

  const config = configs[normalizedStatus] || configs.pending;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size] || sizeClasses.md} transition-all`}
    >
      {showIcon ? (
        <IconComponent className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};
