"use client";

interface KpiItem {
  label: string;
  value: string | number;
  sub?: string;
  tone: "green" | "amber" | "red" | "blue" | "gray";
  onClick?: () => void;
}

const toneConfig: Record<string, { dot: string; value: string }> = {
  green: { dot: "bg-emerald-500", value: "text-emerald-700" },
  amber: { dot: "bg-amber-500", value: "text-amber-700" },
  red: { dot: "bg-red-500", value: "text-red-700" },
  blue: { dot: "bg-black", value: "text-black" },
  gray: { dot: "bg-black/20", value: "text-black/50" },
};

export default function KpiGrid({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {items.map((k) => {
        const cfg = toneConfig[k.tone] || toneConfig.gray;
        return (
          <div
            key={k.label}
            onClick={k.onClick}
            className={`
              bg-white/70 backdrop-blur-sm rounded-2xl border border-black/[0.06]
              shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4
              ${k.onClick ? "cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:border-black/[0.1] transition-all duration-200" : ""}
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              <div className="text-[11px] font-medium text-black/40 truncate">{k.label}</div>
            </div>
            <div className={`text-[22px] font-bold ${cfg.value} tracking-tight`}>{k.value}</div>
            {k.sub && <div className="text-[11px] text-black/30 mt-0.5">{k.sub}</div>}
          </div>
        );
      })}
    </div>
  );
}
