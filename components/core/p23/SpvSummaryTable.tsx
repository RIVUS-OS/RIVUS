"use client";

/**
 * RIVUS OS — P23: SPV Summary Table (Control Room)
 * Sortable, filterable. Click to navigate to SPV detail.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatEur } from "@/lib/data-client";
import type { Spv } from "@/lib/data-client";

type SortField = "name" | "city" | "phase" | "status" | "totalBudget";
type SortDir = "asc" | "desc";

interface SpvSummaryTableProps {
  spvs: Spv[];
  loading?: boolean;
}

const statusColors: Record<string, string> = {
  aktivan: "bg-green-100 text-green-700",
  blokiran: "bg-red-100 text-red-700",
  u_izradi: "bg-blue-100 text-blue-700",
  na_cekanju: "bg-gray-100 text-gray-600",
  zavrsen: "bg-purple-100 text-purple-700",
};

export default function SpvSummaryTable({ spvs, loading }: SpvSummaryTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filter, setFilter] = useState("");

  const filtered = spvs.filter((s) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.oib.includes(q) ||
      (s.code || "").toLowerCase().includes(q)
    );
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
      <th
        onClick={() => toggleSort(field)}
        className="text-left px-3 py-2.5 font-semibold text-black/70 cursor-pointer hover:text-black select-none"
      >
        {label} {active ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""}
      </th>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-gray-200 rounded w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Pretrazi po nazivu, gradu, OIB-u..."
          className="w-full max-w-sm px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <SortHeader field="name" label="Naziv" />
              <SortHeader field="city" label="Grad" />
              <SortHeader field="phase" label="Faza" />
              <SortHeader field="status" label="Status" />
              <SortHeader field="totalBudget" label="Budzet" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr
                key={s.id}
                onClick={() => router.push("/dashboard/core/spv/" + s.id)}
                className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-3 py-2.5 font-medium text-black">{s.name}</td>
                <td className="px-3 py-2.5 text-black/50">{s.city || "\u2014"}</td>
                <td className="px-3 py-2.5 text-black/70">{s.phase}</td>
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[s.status] || "bg-gray-100 text-gray-600"}`}>
                    {s.statusLabel}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right font-medium">{formatEur(s.totalBudget)}</td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-black/40">
                  {filter ? "Nema rezultata pretrage" : "Nema projekata"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-black/30 mt-2 text-right">
        {sorted.length} / {spvs.length} projekata
      </div>
    </div>
  );
}
