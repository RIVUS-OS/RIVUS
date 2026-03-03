"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const categoryColors: Record<string, string> = {
  osnivanje: "bg-blue-100 text-blue-700",
  pravni: "bg-purple-100 text-purple-700",
  financijski: "bg-green-100 text-green-700",
  interni: "bg-gray-100 text-gray-600",
  compliance: "bg-red-100 text-red-700",
};

export default function CoreCompanyDokumentiPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_docs_manage");
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "CORE_COMPANY_DOCS_VIEW", entity_type: "core_document", details: { context: "core_doo_dokumenti" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const dokumenti = [
    { id: "DOC-001", naziv: "Izjava o osnivanju RIVUS CORE d.o.o.", category: "osnivanje", datum: "2025-06-15", tip: "PDF" },
    { id: "DOC-002", naziv: "Izvod iz sudskog registra", category: "osnivanje", datum: "2025-06-20", tip: "PDF" },
    { id: "DOC-003", naziv: "OIB potvrda", category: "osnivanje", datum: "2025-06-20", tip: "PDF" },
    { id: "DOC-004", naziv: "Opci NDA template", category: "pravni", datum: "2025-08-01", tip: "DOCX" },
    { id: "DOC-005", naziv: "DPA template (GDPR cl. 28)", category: "compliance", datum: "2025-08-15", tip: "DOCX" },
    { id: "DOC-006", naziv: "Interni pravilnik o zastiti podataka", category: "compliance", datum: "2025-09-01", tip: "PDF" },
    { id: "DOC-007", naziv: "Ugovor s MIT Knjigovodstvo", category: "financijski", datum: "2025-07-01", tip: "PDF" },
    { id: "DOC-008", naziv: "Politika informacijske sigurnosti", category: "interni", datum: "2025-10-01", tip: "PDF" },
  ];

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — upload onemogucen.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">CORE d.o.o. — Dokumenti</h1>
          <p className="text-[13px] text-black/50 mt-0.5">{dokumenti.length} dokumenata</p>
        </div>
        <button disabled={writeDisabled} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>+ Upload</button>
      </div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">Soft delete (deleted_at). CORE D.O.O. dokumenti odvojeni od SPV dokumenata (A1).</div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Kategorija</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Tip</th>
          </tr></thead>
          <tbody>{dokumenti.map(d => (
            <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 text-black font-medium">{d.naziv}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${categoryColors[d.category] || "bg-gray-100"}`}>{d.category}</span></td>
              <td className="px-3 py-2.5 text-black/70">{d.datum}</td>
              <td className="px-3 py-2.5 text-center text-black/50">{d.tip}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
