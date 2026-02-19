// RIVUS v1.0 — StatusBadge
'use client';
import React from 'react';

const COLORS: Record<string, string> = {
  // lifecycle_stage
  'Created': 'bg-gray-100 text-gray-700', 'CORE Review': 'bg-blue-100 text-blue-700',
  'Verticals Active': 'bg-indigo-100 text-indigo-700', 'Structured': 'bg-purple-100 text-purple-700',
  'Financing': 'bg-orange-100 text-orange-700', 'Active Construction': 'bg-green-100 text-green-700',
  'Completed': 'bg-emerald-100 text-emerald-800',
  // tasks
  'Otvoren': 'bg-blue-100 text-blue-700', 'U tijeku': 'bg-indigo-100 text-indigo-700',
  'Na čekanju': 'bg-yellow-100 text-yellow-800', 'Završen': 'bg-green-100 text-green-700',
  // documents
  'UPLOADED': 'bg-gray-100 text-gray-700', 'DELIVERED': 'bg-yellow-100 text-yellow-800',
  'ACCEPTED': 'bg-green-100 text-green-700', 'REJECTED': 'bg-red-100 text-red-700',
  // invoices
  'Zaprimljen': 'bg-gray-100 text-gray-700', 'Odobren': 'bg-blue-100 text-blue-700',
  'Plaćen': 'bg-green-100 text-green-700', 'Djelomično plaćen': 'bg-yellow-100 text-yellow-800',
  'Kašnjenje': 'bg-red-100 text-red-700', 'Storniran': 'bg-red-100 text-red-700',
  // phases
  'Nije započeta': 'bg-gray-100 text-gray-600', 'Završena': 'bg-green-100 text-green-700',
  // finance
  'PLANNED': 'bg-gray-100 text-gray-600', 'ISSUED': 'bg-blue-100 text-blue-700',
  'PAID': 'bg-green-100 text-green-700', 'CANCELLED': 'bg-red-100 text-red-700',
  // verticals
  'Aktivan': 'bg-green-100 text-green-700', 'Otkazan': 'bg-red-100 text-red-700',
  // bank
  'U razmatranju': 'bg-yellow-100 text-yellow-800', 'Odobreno': 'bg-green-100 text-green-700',
  'Odbijeno': 'bg-red-100 text-red-700', 'Potrebne izmjene': 'bg-orange-100 text-orange-700',
  // accounting
  'Riješen': 'bg-green-100 text-green-700',
  // roles
  'Core': 'bg-purple-100 text-purple-700', 'SPV_Owner': 'bg-blue-100 text-blue-700',
  'Vertical': 'bg-teal-100 text-teal-700', 'Bank': 'bg-amber-100 text-amber-700',
  'Knjigovodja': 'bg-cyan-100 text-cyan-700', 'Holding': 'bg-gray-100 text-gray-700',
  // severity
  'info': 'bg-blue-100 text-blue-700', 'warning': 'bg-yellow-100 text-yellow-800',
  'critical': 'bg-red-200 text-red-800',
  // direction
  'ulazni': 'bg-red-100 text-red-700', 'izlazni': 'bg-green-100 text-green-700',
};

const SIZES = { sm: 'text-xs px-2 py-0.5', md: 'text-xs px-2.5 py-1', lg: 'text-sm px-3 py-1' };

export function StatusBadge({ value, size = 'md', className = '', dot = false }: {
  value: string | null | undefined; size?: 'sm' | 'md' | 'lg'; className?: string; dot?: boolean;
}) {
  if (!value) return null;
  const color = COLORS[value] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${color} ${SIZES[size]} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />}
      {value}
    </span>
  );
}

export function BooleanBadge({ value, trueLabel = 'Da', falseLabel = 'Ne', size = 'md' }: {
  value: boolean | null | undefined; trueLabel?: string; falseLabel?: string; size?: 'sm' | 'md' | 'lg';
}) {
  return <StatusBadge value={value ? trueLabel : falseLabel} size={size} dot />;
}
