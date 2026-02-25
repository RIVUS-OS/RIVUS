// RIVUS v1.0 — Common UI
'use client';
import React from 'react';

export function EmptyState({ icon = '📭', title, description, action }: {
  icon?: string; title: string; description?: string; action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>}
      {action && <button onClick={action.onClick} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">{action.label}</button>}
    </div>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return <div className="flex items-center justify-center py-8"><div className={`${s} border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin`} /></div>;
}

export function Card({ children, title, className = '', action }: {
  children: React.ReactNode; title?: string; className?: string; action?: React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
      {title && <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-800">{title}</h3>{action}</div>}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Potvrdi', cancelLabel = 'Odustani', variant = 'default', onConfirm, onCancel }: {
  open: boolean; title: string; message: string; confirmLabel?: string; cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default'; onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  const btn = { danger: 'bg-red-500 hover:bg-red-600', warning: 'bg-amber-500 hover:bg-amber-600', default: 'bg-blue-500 hover:bg-blue-600' }[variant];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">{cancelLabel}</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${btn}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
