"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  storno: "bg-gray-100 text-gray-500",
};

export default function CoreCompanyIzdaniRacuniPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_invoice_write");
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "CORE_COMPANY_ISSUED_INVOICES_VIEW", entity_type: "core_invoice", details: { context: "core_doo_izdani" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const racuni = [
    { id: "IR-2026-001", date: "2026-01-15", klijent: "SPV Zelena Punta d.o.o.", opis: "Platform fee — sijecanj 2026", iznos: "€ 1.500,00", pdv: "€ 375,00", ukupno: "€ 1.875,00", status: "paid" },
    { id: "IR-2026-002", date: "2026-01-15", klijent: "SPV Marina Bay d.o.o.", opis: "Brand licence — sijecanj 2026", iznos: "€ 1.000,00", pdv: "€ 250,00", ukupno: "€ 1.250,00", status: "paid" },
    { id: "IR-2026-003", date: "2026-01-20", klijent: "SPV Adriatic View d.o.o.", opis: "PM service — sijecanj 2026", iznos: "€ 2.000,00", pdv: "€ 500,00", ukupno: "€ 2.500,00", status: "paid" },
    { id: "IR-2026-004", date: "2026-02-01", klijent: "SPV Zelena Punta d.o.o.", opis: "Success fee — faza 1 zavrsetak", iznos: "€ 5.000,00", pdv: "€ 1.250,00", ukupno: "€ 6.250,00", status: "sent" },
    { id: "IR-2026-005", date: "2026-02-15", klijent: "SPV Zelena Punta d.o.o.", opis: "Platform fee — veljaca 2026", iznos: "€ 1.500,00", pdv: "€ 375,00", ukupno: "€ 1.875,00", status: "overdue" },
    { id: "IR-2026-006", date: "2026-03-01", klijent: "SPV Marina Bay d.o.o.", opis: "Platform fee — ozujak 2026", iznos: "€ 1.500,00", pdv: "€ 375,00", ukupno: "€ 1.875,00", status: "draft" },
  ];

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — izdavanje racuna onemoguceno.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">CORE d.o.o. — Izdani racuni</h1>
          <p className="text-[13px] text-black/50 mt-0.5">{racuni.length} racuna | RIVUS CORE d.o.o. izdaje racune SPV-ovima za platformu</p>
        </div>
        <button disabled={writeDisabled} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>+ Novi racun</button>
      </div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">Storno umjesto brisanja (A10-K1). Export za posrednika zahtijeva audit zapis (A10-K7). eRacun obveza od 01.01.2026. RIVUS CORE d.o.o. izdaje racun, ne CORE platforma (A1).</div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Broj</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Klijent</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Opis</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Neto</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">PDV</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Ukupno</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{racuni.map(r => (
            <tr key={r.id} className={`border-b border-gray-50 hover:bg-gray-50 ${r.status === "overdue" ? "bg-red-50/30" : ""}`}>
              <td className="px-3 py-2.5 font-bold">{r.id}</td>
              <td className="px-3 py-2.5 text-black/70">{r.date}</td>
              <td className="px-3 py-2.5 text-black/70">{r.klijent}</td>
              <td className="px-3 py-2.5 text-black truncate max-w-[180px]">{r.opis}</td>
              <td className="px-3 py-2.5 text-right">{r.iznos}</td>
              <td className="px-3 py-2.5 text-right text-black/50">{r.pdv}</td>
              <td className="px-3 py-2.5 text-right font-bold">{r.ukupno}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[r.status] || "bg-gray-100"}`}>{r.status.toUpperCase()}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
