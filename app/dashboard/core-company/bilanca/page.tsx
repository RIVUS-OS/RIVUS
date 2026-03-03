"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function CoreCompanyBilancaPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_report_read");

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "CORE_COMPANY_BILANCA_VIEW", entity_type: "core_report", details: { context: "core_doo_bilanca" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const aktiva = [
    { stavka: "Dugotrajana imovina", iznos: "€ 2.500,00" },
    { stavka: "Kratkotrajna imovina", iznos: "€ 45.200,00" },
    { stavka: "Potraživanja od kupaca", iznos: "€ 8.125,00" },
    { stavka: "Novac na racunu", iznos: "€ 35.000,00" },
    { stavka: "Ostala kratkotrajna imovina", iznos: "€ 2.075,00" },
  ];

  const pasiva = [
    { stavka: "Kapital i rezerve", iznos: "€ 40.000,00" },
    { stavka: "Zadržana dobit", iznos: "€ 4.175,00" },
    { stavka: "Kratkorocne obveze", iznos: "€ 3.525,00" },
    { stavka: "PDV obveza", iznos: "€ 3.525,00" },
    { stavka: "Ostale obveze", iznos: "€ 0,00" },
  ];

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — samo citanje aktivno.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">CORE d.o.o. — Bilanca</h1>
          <p className="text-[13px] text-black/50 mt-0.5">Stanje na dan: 03.03.2026.</p>
        </div>
        <button className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-black text-white hover:bg-gray-800">Export PDF</button>
      </div>

      <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[12px] text-amber-800 font-medium">Informativni prikaz, ne sluzbeni financijski izvjestaj. Za sluzbenu bilancu obratite se racunovodstvenom servisu. Export + audit (A10-K7).</div>

      <div className="grid grid-cols-2 gap-4">
        {/* Aktiva */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-blue-50/50">
            <div className="text-[14px] font-bold text-blue-800">AKTIVA</div>
          </div>
          <table className="w-full text-[12px]">
            <tbody>{aktiva.map((a, i) => (
              <tr key={i} className={`border-b border-gray-50 ${i === 0 ? "font-semibold" : ""}`}>
                <td className="px-4 py-2.5 text-black">{a.stavka}</td>
                <td className="px-4 py-2.5 text-right font-bold text-blue-600">{a.iznos}</td>
              </tr>
            ))}</tbody>
            <tfoot><tr className="bg-blue-50/30 border-t border-blue-200">
              <td className="px-4 py-2.5 font-bold text-black">UKUPNO AKTIVA</td>
              <td className="px-4 py-2.5 text-right font-bold text-blue-700">€ 47.700,00</td>
            </tr></tfoot>
          </table>
        </div>

        {/* Pasiva */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-green-50/50">
            <div className="text-[14px] font-bold text-green-800">PASIVA</div>
          </div>
          <table className="w-full text-[12px]">
            <tbody>{pasiva.map((p, i) => (
              <tr key={i} className={`border-b border-gray-50 ${i === 0 ? "font-semibold" : ""}`}>
                <td className="px-4 py-2.5 text-black">{p.stavka}</td>
                <td className="px-4 py-2.5 text-right font-bold text-green-600">{p.iznos}</td>
              </tr>
            ))}</tbody>
            <tfoot><tr className="bg-green-50/30 border-t border-green-200">
              <td className="px-4 py-2.5 font-bold text-black">UKUPNO PASIVA</td>
              <td className="px-4 py-2.5 text-right font-bold text-green-700">€ 47.700,00</td>
            </tr></tfoot>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
