// RIVUS v1.0 — KpiCard
'use client';
import React from 'react';

const COLORS = {
  green: { text: 'text-green-700', icon: 'bg-green-100' },
  red: { text: 'text-red-700', icon: 'bg-red-100' },
  blue: { text: 'text-blue-700', icon: 'bg-blue-100' },
  amber: { text: 'text-amber-700', icon: 'bg-amber-100' },
  purple: { text: 'text-purple-700', icon: 'bg-purple-100' },
  gray: { text: 'text-gray-700', icon: 'bg-gray-100' },
} as const;

export function KpiCard({ title, value, subtitle, icon, color = 'blue', trend, loading, onClick }: {
  title: string; value: string | number; subtitle?: string; icon?: string;
  color?: keyof typeof COLORS; loading?: boolean; onClick?: () => void;
  trend?: { value: number; direction: 'up' | 'down' | 'neutral' };
}) {
  const c = COLORS[color];
  if (loading) return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
      <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-16" />
    </div>
  );
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 transition-all hover:shadow-md ${onClick ? 'cursor-pointer hover:border-gray-300' : ''}`} onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{title}</span>
        {icon && <span className={`text-lg ${c.icon} rounded-lg w-9 h-9 flex items-center justify-center`}>{icon}</span>}
      </div>
      <div className={`text-2xl font-bold ${c.text} mb-1`}>{value}</div>
      <div className="flex items-center gap-2">
        {trend && <span className={`text-xs font-medium ${trend.direction === 'up' ? 'text-green-600' : trend.direction === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
          {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {Math.abs(trend.value)}%
        </span>}
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
    </div>
  );
}

export function KpiGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{children}</div>;
}
