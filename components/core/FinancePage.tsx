"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Search, ArrowUpDown } from "lucide-react";

type Column = { key: string; label: string; align?: "left" | "right" | "center" };
type Tab = { label: string; href: string };
type FinancePageProps = {
  title: string;
  subtitle: string;
  tabs?: Tab[];
  columns: Column[];
  data: Record<string, any>[];
  summary?: { label: string; value: string; color?: string }[];
};

export default function FinancePage({ title, subtitle, tabs, columns, data, summary }: FinancePageProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = data.filter((row) =>
    columns.some((col) => String(row[col.key] ?? "").toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const va = a[sortKey] ?? "";
        const vb = b[sortKey] ?? "";
        if (typeof va === "number" && typeof vb === "number") return sortAsc ? va - vb : vb - va;
        return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
      })
    : filtered;

  function handleSort(key: string) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold text-black">{title}</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{subtitle}</p>
      </div>

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {summary.map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-[12px] text-black/50 font-medium">{s.label}</div>
              <div className={`text-[20px] font-bold mt-1 ${s.color || "text-black"}`}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {tabs && tabs.length > 0 && (
        <div className="flex gap-1 overflow-x-auto border-b border-gray-200 pb-0">
          {tabs.map((tab) => (
            <button key={tab.href} onClick={() => router.push(tab.href)}
              className="px-4 py-2.5 text-[13px] font-medium text-black/60 hover:text-black hover:bg-gray-50 rounded-t-lg transition-colors whitespace-nowrap">
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
          <input type="text" placeholder="Pretraži..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]" />
        </div>
        <button onClick={() => alert("Export u izradi")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-black/70 hover:bg-gray-50 transition-colors">
          <Download size={14} /> Export
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {columns.map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)}
                    className={`px-4 py-3 font-semibold text-black/60 cursor-pointer hover:text-black transition-colors ${col.align === "right" ? "text-right" : "text-left"}`}>
                    <span className="flex items-center gap-1">{col.label} <ArrowUpDown size={12} className="text-black/20" /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${col.align === "right" ? "text-right" : "text-left"}`}>{row[col.key]}</td>
                  ))}
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-black/40">Nema podataka</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-[12px] text-black/50">
          <span>{sorted.length} zapisa</span>
          <span>Stranica 1 od 1</span>
        </div>
      </div>
    </div>
  );
}
