"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useSpvs } from "@/lib/data-client";
import { Building2, Plus, Search } from "lucide-react";

// ============================================================================
// RIVUS OS — SPV projekti
// Registry Screen — popis svih SPV-ova
// MASTER UI SPEC v1.0
// ============================================================================

const PHASE_COLORS: Record<string, string> = {
  Kreirano: "bg-gray-100 text-gray-700 border-gray-200",
  Strukturiranje: "bg-blue-50 text-blue-700 border-blue-200",
  Financiranje: "bg-violet-50 text-violet-700 border-violet-200",
  Vertikale: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Gradnja: "bg-amber-50 text-amber-700 border-amber-200",
  Prodaja: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Zatvaranje: "bg-gray-50 text-gray-600 border-gray-200",
};

export default function SpvListaPage() {
  const router = useRouter();
  const { mode } = usePlatformMode();
  const { data: spvs, loading } = useSpvs();
  const [search, setSearch] = useState("");

  const isSafe = mode === "SAFE" || mode === "LOCKDOWN";
  const activeCount = spvs.filter(s => !s.isBlocked).length;
  const blockedCount = spvs.filter(s => s.isBlocked).length;

  const filtered = search
    ? spvs.filter(s => s.projectName.toLowerCase().includes(search.toLowerCase()) || s.code?.toLowerCase().includes(search.toLowerCase()) || s.city?.toLowerCase().includes(search.toLowerCase()))
    : spvs;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Building2 size={24} strokeWidth={2} className="text-[#2563EB]" />
            <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">SPV projekti</h1>
          </div>
          <p className="text-[14px] text-[#6E6E73]">{spvs.length} ukupno · {activeCount} aktivnih{blockedCount > 0 ? ` · ${blockedCount} blokiranih` : ""}</p>
        </div>
        {!isSafe && (
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1d4ed8] transition-colors shadow-sm">
            <Plus size={15} /> Novi SPV
          </button>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C7C7CC]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Pretraži po nazivu, kodu ili gradu..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E8EC] bg-white text-[13px] text-[#0B0B0C] placeholder-[#C7C7CC] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 transition-all" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E8EC]">
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">SPV</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Faza</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Lifecycle</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Obveze</th>
              <th className="text-right px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {loading && <tr><td colSpan={6} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Učitavanje...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema SPV-ova</td></tr>}
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-[#FAFAFA] transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/core/spv/${s.id}`)}>
                <td className="px-5 py-3.5">
                  <div className="text-[13px] font-semibold text-[#0B0B0C]">{s.projectName}</div>
                  <div className="text-[11px] text-[#8E8E93]">{s.code} · {s.city || "—"}</div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${PHASE_COLORS[s.phase] || PHASE_COLORS.Kreirano}`}>{s.phase || "—"}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${s.isBlocked ? "bg-red-500" : "bg-emerald-500"}`} />
                    <span className="text-[12px] text-[#3C3C43]">{s.isBlocked ? "Blokiran" : "Aktivan"}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden max-w-[80px]">
                      <div className={`h-full rounded-full ${s.completionPct >= 80 ? "bg-emerald-500" : s.completionPct >= 40 ? "bg-amber-500" : "bg-[#C7C7CC]"}`}
                        style={{ width: `${s.completionPct || 0}%` }} />
                    </div>
                    <span className="text-[11px] text-[#8E8E93]">{s.completionPct || 0}%</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[12px] text-[#6E6E73]">—</td>
                <td className="px-5 py-3.5 text-right">
                  <button className="px-3 py-1 rounded-lg text-[11px] font-semibold text-[#2563EB] hover:bg-[#2563EB]/5 transition-colors">Pregled →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-[11px] text-[#C7C7CC] leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.
      </div>
    </div>
  );
}
