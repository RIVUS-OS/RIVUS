"use client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useSpvs, usePnlMonths } from "@/lib/data-client";
import { Building2, Euro, AlertTriangle, BarChart3 } from "lucide-react";

export default function HoldingDashboard() {
  const { mode } = usePlatformMode();
  const { data: spvs } = useSpvs();
  const { data: pnl } = usePnlMonths();

  const activeSpvs = spvs.filter(s => !s.isBlocked);
  const totalRevenue = pnl.reduce((s, p) => s + (p.totalRevenue || 0), 0);
  const avgCompletion = spvs.length > 0 ? Math.round(spvs.reduce((s, v) => s + (v.completionPct || 0), 0) / spvs.length) : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">RIVUS Holding d.o.o.</h1>
        <p className="text-[14px] text-[#6E6E73]">Portfolio nadzor — sve READ-ONLY</p>
      </div>

      <div className="flex items-center gap-2 mb-5 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200">
        <span className="text-[11px] font-semibold text-blue-700">Holding ima isključivo READ-ONLY pristup. Nema edit, approve, create operacija.</span>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3.5">
          <Building2 size={16} className="text-blue-600" />
          <div className="text-[22px] font-bold text-[#0B0B0C] mt-1">{spvs.length}</div>
          <div className="text-[11px] text-[#8E8E93]">SPV-ova u portfoliju</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3.5">
          <Euro size={16} className="text-emerald-600" />
          <div className="text-[22px] font-bold text-emerald-600 mt-1">{totalRevenue.toLocaleString("hr")} €</div>
          <div className="text-[11px] text-[#8E8E93]">Ukupni prihodi</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3.5">
          <BarChart3 size={16} className="text-blue-600" />
          <div className="text-[22px] font-bold text-[#0B0B0C] mt-1">{avgCompletion}%</div>
          <div className="text-[11px] text-[#8E8E93]">Prosječni lifecycle</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3.5">
          <AlertTriangle size={16} className="text-amber-600" />
          <div className="text-[22px] font-bold text-amber-600 mt-1">{spvs.filter(s => s.isBlocked).length}</div>
          <div className="text-[11px] text-[#8E8E93]">Blokirani SPV-ovi</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E8EC]">
        <div className="px-5 py-3.5 border-b border-[#E8E8EC]"><span className="text-[13px] font-bold text-[#0B0B0C]">Portfolio SPV-ova</span></div>
        <div className="divide-y divide-[#F5F5F7]">
          {spvs.map(s => (
            <div key={s.id} className="px-5 py-3 flex items-center gap-4">
              <div className={`h-2.5 w-2.5 rounded-full ${s.isBlocked ? "bg-red-500" : "bg-emerald-500"}`} />
              <div className="flex-1"><div className="text-[13px] font-semibold text-[#0B0B0C]">{s.projectName}</div><div className="text-[11px] text-[#8E8E93]">{s.code} · {s.city} · {s.phase}</div></div>
              <div className="flex items-center gap-2"><div className="w-[60px] h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden"><div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${s.completionPct || 0}%` }} /></div><span className="text-[11px] text-[#8E8E93]">{s.completionPct || 0}%</span></div>
            </div>
          ))}
          {spvs.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema SPV-ova</div>}
        </div>
      </div>

      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
