"use client";

/**
 * RIVUS OS — Page Header
 * V2.5-6: Consistent page header with title, subtitle, optional actions.
 * Usage: <PageHeader title="Owner Cockpit" subtitle="3 SPV-ova" />
 */

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-[22px] font-bold text-black">{title}</h1>
        {subtitle && <p className="text-[13px] text-black/50 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
