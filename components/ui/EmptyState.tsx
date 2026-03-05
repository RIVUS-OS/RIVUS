"use client";

/**
 * RIVUS OS — Empty State
 * V2.5-6: Consistent empty state across all pages.
 * Usage: <EmptyState title="Nema projekata" subtitle="Kreirajte novi SPV." />
 */

import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({
  title = "Nema podataka",
  subtitle,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icon || <Inbox className="w-6 h-6 text-gray-400" />}
      </div>
      <p className="text-[14px] font-medium text-black/60">{title}</p>
      {subtitle && <p className="text-[12px] text-black/40 mt-1">{subtitle}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 text-[12px] font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
