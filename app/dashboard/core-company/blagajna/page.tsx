"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function CoreCompanyBlagajnaPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_cashflow_manage");
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "CORE_COMPANY_CASHFLOW_VIEW", entity_type: "core_cashflow", details: { context: "core_doo_blagajna" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const accounts = [
    { naziv: "Žiro racun (EUR)", banka: "PBZ d.d.", iban: "HR12 2340 0091 1234 5678 9", stanje: "€ 35.000,00", tip: "ziro" },
    { naziv: "Devizni racun (USD)", banka: "PBZ d.d.", iban: "HR12 2340 0091 1234 5679 0", stanje: "$ 2.500,00", tip: "devizni" },
  ];

  const transactions = [
    { id: "CF-001", date: "2026-03-01", opis: "Platform fee — SPV Zelena Punta", tip: "uplata", iznos: "+ € 1.875,00", saldo: "€ 35.000,00" },
    { id: "CF-002", date: "2026-02-28", opis: "MIT Knjigovodstvo — veljaca", tip: "isplata", iznos: "- € 375,00", saldo: "€ 33.125,00" },
    { id: "CF-003", date: "2026-02-28", opis: "Brand licence — SPV Marina Bay", tip: "uplata", iznos: "+ € 1.250,00", saldo: "€ 33.500,00" },
    { id: "CF-004", date: "2026-02-27", opis: "Vercel hosting", tip: "isplata", iznos: "- € 20,00", saldo: "€ 32.250,00" },
    { id: "CF-005", date: "2026-02-25", opis: "PM service — SPV Adriatic View", tip: "uplata", iznos: "+ € 2.500,00", saldo: "€ 32.270,00" },
  ];

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — unosi onemoguceni.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black">CORE d.o.o. — Blagajna</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Novcani tok i stanje racuna</p>
      </div>

      <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-[12px] text-violet-700">CORE NE SMIJE upravljati bankovnim racunima SPV-ova. Potpuno odvojeni novcani tokovi (A1).</div>

      {/* Bank Accounts */}
      <div className="grid grid-cols-2 gap-3">
        {accounts.map(a => (
          <div key={a.iban} className={`bg-white rounded-xl border p-4 ${a.tip === "ziro" ? "border-blue-200" : "border-amber-200"}`}>
            <div className="text-[12px] text-black/50">{a.naziv}</div>
            <div className="text-xl font-bold text-black mt-1">{a.stanje}</div>
            <div className="text-[11px] text-black/40 mt-1">{a.banka} | {a.iban}</div>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Nedavne transakcije</div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Opis</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Tip</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Iznos</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Saldo</th>
          </tr></thead>
          <tbody>{transactions.map(t => (
            <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 text-black/70">{t.date}</td>
              <td className="px-3 py-2.5 text-black">{t.opis}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.tip === "uplata" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{t.tip}</span></td>
              <td className={`px-3 py-2.5 text-right font-bold ${t.tip === "uplata" ? "text-green-600" : "text-red-600"}`}>{t.iznos}</td>
              <td className="px-3 py-2.5 text-right text-black/70">{t.saldo}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
