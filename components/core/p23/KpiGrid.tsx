"use client";

/**
 * RIVUS OS — P23: KPI Grid (Control Room)
 * 6 KPI kartica: Aktivni SPV, Obveze, Rizici, Pending odobrenja, Revenue MTD, System Health
 */

interface KpiItem {
  label: string;
  value: string | number;
  sub?: string;
  tone: "green" | "amber" | "red" | "blue" | "gray";
  onClick?: () => void;
}

const toneStyles: Record<string, { bg: string; text: string }> = {
  green: { bg: "bg-emerald-50", text: "text-emerald-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-700" },
  red: { bg: "bg-red-50", text: "text-red-700" },
  blue: { bg: "bg-blue-50", text: "text-blue-700" },
  gray: { bg: "bg-gray-50", text: "text-gray-700" },
};

export default function KpiGrid({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {items.map((k) => {
        const style = toneStyles[k.tone] || toneStyles.gray;
        return (
          <div
            key={k.label}
            onClick={k.onClick}
            className={`rounded-xl border border-gray-200 p-4 ${style.bg} ${k.onClick ? "cursor-pointer hover:shadow-sm transition-shadow" : ""}`}
          >
            <div className={`text-[22px] font-bold ${style.text}`}>{k.value}</div>
            <div className="text-[12px] font-medium text-black/70 mt-1">{k.label}</div>
            {k.sub && <div className="text-[11px] text-black/40 mt-0.5">{k.sub}</div>}
          </div>
        );
      })}
    </div>
  );
}
