"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function CoreCompanyRashodiPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_finance_write");
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "CORE_COMPANY_EXPENSE_VIEW", entity_type: "core_finance", details: { context: "core_doo_rashodi" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const rashodi = [
    { id: "R-001", date: "2026-03-01", opis: "Vercel hosting — mjesecni", category: "OPEX", vendor: "Vercel Inc.", iznos: "€ 20,00", status: "knjizen" },
    { id: "R-002", date: "2026-02-28", opis: "Supabase Pro — mjesecni", category: "OPEX", vendor: "Supabase Inc.", iznos: "€ 25,00", status: "knjizen" },
    { id: "R-003", date: "2026-02-27", opis: "MIT Knjigovodstvo — veljaca", category: "OPEX", vendor: "MIT Knjigovodstvo", iznos: "€ 300,00", status: "knjizen" },
    { id: "R-004", date: "2026-02-15", opis: "Cursor IDE — godisnja licenca", category: "CAPEX", vendor: "Anysphere Inc.", iznos: "€ 192,00", status: "knjizen" },
    { id: "R-005", date: "2026-02-10", opis: "Domena rivus.hr — godisnja", category: "OPEX", vendor: "CARNet", iznos: "€ 15,00", status: "knjizen" },
    { id: "R-006", date: "2026-02-01", opis: "Pravni savjet — NDA template", category: "OPEX", vendor: "Odvjetnik", iznos: "€ 500,00", status: "draft" },
  ];

  const total = 1052;

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — unosi onemoguceni.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">CORE d.o.o. — Rashodi</h1>
          <p className="text-[13px] text-black/50 mt-0.5">{rashodi.length} stavki | Ukupno: € {total.toLocaleString("hr-HR", { minimumFractionDigits: 2 })}</p>
        </div>
        <button disabled={writeDisabled} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>+ Novi rashod</button>
      </div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">Append-only: storno umjesto brisanja (A10-K1). Period Lock gate. CORE D.O.O. rashodi odvojeni od SPV rashoda (A1).</div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dobavljac</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Opis</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Tip</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Iznos</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{rashodi.map(r => (
            <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 text-black/70">{r.date}</td>
              <td className="px-3 py-2.5 text-black/70">{r.vendor}</td>
              <td className="px-3 py-2.5 text-black">{r.opis}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.category === "CAPEX" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{r.category}</span></td>
              <td className="px-3 py-2.5 text-right font-bold text-red-600">{r.iznos}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.status === "knjizen" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{r.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
