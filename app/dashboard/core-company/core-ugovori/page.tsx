"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const tipColors: Record<string, string> = {
  nda: "bg-red-100 text-red-700",
  dpa: "bg-purple-100 text-purple-700",
  usluga: "bg-blue-100 text-blue-700",
  licenca: "bg-green-100 text-green-700",
  najam: "bg-amber-100 text-amber-700",
};

const statusColors: Record<string, string> = {
  aktivan: "bg-green-100 text-green-700",
  istice: "bg-amber-100 text-amber-700",
  istekao: "bg-red-100 text-red-700",
  raskinut: "bg-gray-100 text-gray-500",
};

export default function CoreCompanyUgovoriPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_contracts_manage");
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "CORE_COMPANY_CONTRACTS_VIEW", entity_type: "core_contract", details: { context: "core_doo_ugovori" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const ugovori = [
    { id: "UG-001", naziv: "NDA — MIT Knjigovodstvo", strana: "MIT Knjigovodstvo", tip: "nda", datum: "2025-07-01", expiry: "2026-07-01", status: "aktivan" },
    { id: "UG-002", naziv: "DPA — MIT Knjigovodstvo (GDPR cl. 28)", strana: "MIT Knjigovodstvo", tip: "dpa", datum: "2025-07-01", expiry: "2026-07-01", status: "aktivan" },
    { id: "UG-003", naziv: "Ugovor o uslugama — MIT Knjigovodstvo", strana: "MIT Knjigovodstvo", tip: "usluga", datum: "2025-07-01", expiry: "2026-07-01", status: "aktivan" },
    { id: "UG-004", naziv: "NDA — Elektro Dalmacija (vertikala)", strana: "Elektro Dalmacija", tip: "nda", datum: "2025-09-15", expiry: "2026-03-15", status: "istice" },
    { id: "UG-005", naziv: "DPA — Elektro Dalmacija", strana: "Elektro Dalmacija", tip: "dpa", datum: "2025-09-15", expiry: "2026-03-15", status: "istice" },
    { id: "UG-006", naziv: "Hosting ugovor — Vercel", strana: "Vercel Inc.", tip: "usluga", datum: "2025-06-01", expiry: "2026-06-01", status: "aktivan" },
    { id: "UG-007", naziv: "Licenca Cursor IDE", strana: "Anysphere Inc.", tip: "licenca", datum: "2025-08-01", expiry: "2026-08-01", status: "aktivan" },
  ];

  const expiringCount = ugovori.filter(u => u.status === "istice").length;

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — izmjene onemogucene.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">CORE d.o.o. — Ugovori</h1>
          <p className="text-[13px] text-black/50 mt-0.5">{ugovori.length} ugovora</p>
        </div>
        <button disabled={writeDisabled} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>+ Novi ugovor</button>
      </div>

      {expiringCount > 0 && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-[12px] text-red-700 font-medium">{expiringCount} ugovor(a) istice uskoro. NDA/DPA expiry auto-check obligation generira alert prije isteka (A2).</div>
      )}

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">NDA/DPA tracking aktivan. Expiry auto-check obligation (A2). Soft delete.</div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Strana</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Tip</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Istice</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{ugovori.map(u => (
            <tr key={u.id} className={`border-b border-gray-50 hover:bg-gray-50 ${u.status === "istice" ? "bg-amber-50/30" : ""}`}>
              <td className="px-3 py-2.5 text-black font-medium">{u.naziv}</td>
              <td className="px-3 py-2.5 text-black/70">{u.strana}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tipColors[u.tip] || "bg-gray-100"}`}>{u.tip.toUpperCase()}</span></td>
              <td className="px-3 py-2.5 text-black/70">{u.datum}</td>
              <td className="px-3 py-2.5 text-black/70">{u.expiry}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[u.status] || "bg-gray-100"}`}>{u.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
