"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function CoreCompanyPdvPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_tax_manage");
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "CORE_COMPANY_PDV_VIEW", entity_type: "core_tax", details: { context: "core_doo_pdv" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const periods = [
    { period: "Sijecanj 2026", ulazni: "€ 75,00", izlazni: "€ 1.125,00", obveza: "€ 1.050,00", status: "prijavljeno" },
    { period: "Veljaca 2026", ulazni: "€ 200,00", izlazni: "€ 2.375,00", obveza: "€ 2.175,00", status: "pripremljeno" },
    { period: "Ozujak 2026", ulazni: "€ 75,00", izlazni: "€ 375,00", obveza: "€ 300,00", status: "u_pripremi" },
  ];

  const statusColors: Record<string, string> = {
    prijavljeno: "bg-green-100 text-green-700",
    pripremljeno: "bg-blue-100 text-blue-700",
    u_pripremi: "bg-amber-100 text-amber-700",
    kasni: "bg-red-100 text-red-700",
  };

  const totalUlazni = 350;
  const totalIzlazni = 3875;
  const totalObveza = 3525;

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — unosi onemoguceni.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">CORE d.o.o. — PDV</h1>
          <p className="text-[13px] text-black/50 mt-0.5">Porezna priprema za RIVUS CORE d.o.o.</p>
        </div>
        <button disabled={writeDisabled} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>Export za prijavu</button>
      </div>

      <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[12px] text-amber-800 font-medium">PDV priprema informativna — RIVUS ne pruza porezne savjete. Accounting profesionalni subjekt odgovoran za prijavu (A1). PDV rokovi: mjesecni/tromjesecni s ALERT + escalation (A2).</div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Ulazni PDV (YTD)", value: `€ ${totalUlazni.toLocaleString("hr-HR", { minimumFractionDigits: 2 })}`, color: "text-blue-600" },
          { label: "Izlazni PDV (YTD)", value: `€ ${totalIzlazni.toLocaleString("hr-HR", { minimumFractionDigits: 2 })}`, color: "text-amber-600" },
          { label: "Obveza (YTD)", value: `€ ${totalObveza.toLocaleString("hr-HR", { minimumFractionDigits: 2 })}`, color: "text-red-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Period Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">PDV po periodima</div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Period</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Ulazni PDV</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Izlazni PDV</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Obveza</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{periods.map(p => (
            <tr key={p.period} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-medium text-black">{p.period}</td>
              <td className="px-3 py-2.5 text-right text-blue-600">{p.ulazni}</td>
              <td className="px-3 py-2.5 text-right text-amber-600">{p.izlazni}</td>
              <td className="px-3 py-2.5 text-right font-bold text-red-600">{p.obveza}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[p.status] || "bg-gray-100"}`}>{p.status.replace("_", " ")}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
