"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  csv_exported: "bg-blue-100 text-blue-700",
  sent_to_intermediary: "bg-indigo-100 text-indigo-700",
  confirmed: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  pending: "Na cekanju",
  csv_exported: "CSV exportiran",
  sent_to_intermediary: "Poslan posredniku",
  confirmed: "Potvrdjen",
  error: "Greska",
};

export default function CoreCompanyEracuniPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_eracun_manage");
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "CORE_COMPANY_ERACUN_VIEW", entity_type: "core_eracun", details: { context: "core_doo_eracuni" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const eracuni = [
    { id: "ER-001", racun: "IR-2026-001", klijent: "SPV Zelena Punta d.o.o.", datum: "2026-01-15", status: "confirmed", exportDate: "2026-01-15", sentDate: "2026-01-15", confirmDate: "2026-01-16" },
    { id: "ER-002", racun: "IR-2026-002", klijent: "SPV Marina Bay d.o.o.", datum: "2026-01-15", status: "confirmed", exportDate: "2026-01-15", sentDate: "2026-01-15", confirmDate: "2026-01-16" },
    { id: "ER-003", racun: "IR-2026-003", klijent: "SPV Adriatic View d.o.o.", datum: "2026-01-20", status: "sent_to_intermediary", exportDate: "2026-01-20", sentDate: "2026-01-20", confirmDate: null },
    { id: "ER-004", racun: "IR-2026-004", klijent: "SPV Zelena Punta d.o.o.", datum: "2026-02-01", status: "csv_exported", exportDate: "2026-02-01", sentDate: null, confirmDate: null },
    { id: "ER-005", racun: "IR-2026-005", klijent: "SPV Zelena Punta d.o.o.", datum: "2026-02-15", status: "pending", exportDate: null, sentDate: null, confirmDate: null },
    { id: "ER-006", racun: "IR-2026-006", klijent: "SPV Marina Bay d.o.o.", datum: "2026-03-01", status: "pending", exportDate: null, sentDate: null, confirmDate: null },
  ];

  const stats = {
    pending: eracuni.filter(e => e.status === "pending").length,
    exported: eracuni.filter(e => e.status === "csv_exported").length,
    sent: eracuni.filter(e => e.status === "sent_to_intermediary").length,
    confirmed: eracuni.filter(e => e.status === "confirmed").length,
  };

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — export onemogucen.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black">CORE d.o.o. — eRacuni</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Status eRacuna za certificiranog posrednika</p>
      </div>

      <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-[12px] text-violet-700">RIVUS NE gradi UBL 2.1 — koristi certificiranog posrednika. CSV format za posrednika. Export valjan samo uz audit zapis (A10-K7). eRacun delivery status dozvoljen i pod period lockom (A10-K6).</div>

      {/* Status KPI */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Na cekanju", value: stats.pending, color: "text-amber-600", bg: "border-amber-200" },
          { label: "Exportirano", value: stats.exported, color: "text-blue-600", bg: "border-blue-200" },
          { label: "Poslano", value: stats.sent, color: "text-indigo-600", bg: "border-indigo-200" },
          { label: "Potvrdjeno", value: stats.confirmed, color: "text-green-600", bg: "border-green-200" },
        ].map(s => (
          <div key={s.label} className={`bg-white rounded-xl border ${s.bg} p-4 text-center`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[12px] text-black/50">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Export Queue Button */}
      <div className="flex gap-3">
        <button disabled={writeDisabled || stats.pending === 0} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled || stats.pending === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>Export CSV ({stats.pending})</button>
        <button disabled={writeDisabled || stats.exported === 0} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled || stats.exported === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}>Posalji posredniku ({stats.exported})</button>
      </div>

      {/* eRacun Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">ID</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Racun</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Klijent</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Export</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Poslano</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Potvrda</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{eracuni.map(e => (
            <tr key={e.id} className={`border-b border-gray-50 hover:bg-gray-50 ${e.status === "error" ? "bg-red-50/30" : ""}`}>
              <td className="px-3 py-2.5 font-bold">{e.id}</td>
              <td className="px-3 py-2.5 text-blue-600">{e.racun}</td>
              <td className="px-3 py-2.5 text-black/70">{e.klijent}</td>
              <td className="px-3 py-2.5 text-black/70">{e.datum}</td>
              <td className="px-3 py-2.5 text-center text-black/50">{e.exportDate || "—"}</td>
              <td className="px-3 py-2.5 text-center text-black/50">{e.sentDate || "—"}</td>
              <td className="px-3 py-2.5 text-center text-black/50">{e.confirmDate || "—"}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[e.status] || "bg-gray-100"}`}>{statusLabels[e.status] || e.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
