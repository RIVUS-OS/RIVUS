"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatEur } from "@/lib/data-client";
import type { Spv } from "@/lib/data-client";
import { Search } from "lucide-react";

type SortField = "name" | "city" | "phase" | "status" | "totalBudget";
type SortDir = "asc" | "desc";

const statusStyles: Record<string, string> = {
  aktivan: "bg-emerald-500/10 text-emerald-700",
  blokiran: "bg-red-500/10 text-red-700",
  u_izradi: "bg-black/[0.06] text-black/60",
  na_cekanju: "bg-amber-500/10 text-amber-700",
  zavrsen: "bg-black/[0.04] text-black/40",
};

export default function SpvSummaryTable({ spvs, loading }: { spvs: Spv[]; loading?: boolean }) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filter, setFilter] = useState("");

  const filtered = spvs.filter((s) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.oib.includes(q) || (s.code || "").toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case "name": cmp = a.name.localeCompare(b.name); break;
      case "city": cmp = a.city.localeCompare(b.city); break;
      case "phase": cmp = a.phase.localeCompare(b.phase); break;
      case "status": cmp = a.status.localeCompare(b.status); break;
      case "totalBudget": cmp = (a.totalBudget || 0) - (b.totalBudget || 0); break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  }

  function SortHeader({ field, label }: { field: SortField; label: string }) {
    const active = sortField === field;
    return (
      <th onClick={() => toggleSort(field)} className="text-left px-4 py-3 text-[11px] font-semibold text-black/40 uppercase tracking-wider cursor-pointer hover:text-black/60 select-none">
        {label} {active ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""}
      </th>
    );
  }

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-black/[0.06] p-8">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-black/[0.04] rounded w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Pretraži po nazivu, gradu, OIB-u..."
            className="w-full pl-9 pr-3 py-2.5 text-[12px] bg-black/[0.03] border border-black/[0.06] rounded-xl focus:outline-none focus:ring-2 focus:ring-black/[0.08] focus:border-transparent placeholder-black/25"
          />
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-black/[0.06] overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-black/[0.04]">
              <SortHeader field="name" label="Naziv" />
              <SortHeader field="city" label="Grad" />
              <SortHeader field="phase" label="Faza" />
              <SortHeader field="status" label="Status" />
              <SortHeader field="totalBudget" label="Budžet" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.id} onClick={() => router.push("/dashboard/core/spv/" + s.id)} className="border-b border-black/[0.03] hover:bg-black/[0.02] cursor-pointer transition-colors">
                <td className="px-4 py-3 font-semibold text-black">{s.name}</td>
                <td className="px-4 py-3 text-black/40">{s.city || "\u2014"}</td>
                <td className="px-4 py-3 text-black/60">{s.phase}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyles[s.status] || "bg-black/[0.04] text-black/40"}`}>
                    {s.statusLabel}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-black/70">{formatEur(s.totalBudget)}</td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-black/25 text-[13px]">{filter ? "Nema rezultata pretrage" : "Nema projekata"}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="text-[10px] text-black/20 mt-2 text-right">{sorted.length} / {spvs.length} projekata</div>
    </div>
  );
}
