"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const typeColors: Record<string, string> = {
  lifecycle: "bg-blue-500", finance: "bg-green-500", document: "bg-purple-500",
  approval: "bg-amber-500", assignment: "bg-teal-500", obligation: "bg-red-500",
  task: "bg-indigo-500", system: "bg-gray-500",
};

export default function PentagonTokPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("pentagon_tok");

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "PENTAGON_TOK_VIEW", entity_type: "pentagon", details: { context: "global_activity" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const activities = [
    { id: "A-001", time: "Danas, 14:32", spv: "SPV Zelena Punta", type: "finance", desc: "Novi rashod: € 1.200,00 — Elektro materijal", user: "Owner" },
    { id: "A-002", time: "Danas, 13:15", spv: "SPV Marina Bay", type: "lifecycle", desc: "Lifecycle prijelaz: Priprema → Gradnja", user: "CORE Admin" },
    { id: "A-003", time: "Danas, 11:47", spv: "SPV Adriatic View", type: "document", desc: "Upload: Gradevinska dozvola.pdf", user: "Owner" },
    { id: "A-004", time: "Danas, 10:20", spv: "SPV Zelena Punta", type: "obligation", desc: "ALERT: NDA istice za 15 dana — Elektro Dalmacija", user: "System" },
    { id: "A-005", time: "Jucer, 18:00", spv: "SPV Marina Bay", type: "approval", desc: "Period lock odobren — Veljaca 2026", user: "Owner + CORE" },
    { id: "A-006", time: "Jucer, 16:30", spv: "SPV Adriatic View", type: "assignment", desc: "Nova vertikala: Vodoinstalater d.o.o.", user: "CORE Admin" },
    { id: "A-007", time: "Jucer, 14:00", spv: "SPV Zelena Punta", type: "task", desc: "Zadatak zavrsen: Prijava gradilista", user: "Owner" },
    { id: "A-008", time: "Jucer, 09:15", spv: "CORE D.O.O.", type: "system", desc: "Dead Man's Switch: check-in potvrden", user: "CORE Admin" },
  ];

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — samo citanje aktivno.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black">Pentagon — Globalni TOK</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Aktivnost svih SPV-ova i sustava — agregirani prikaz</p>
      </div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">Cross-tenant activity aggregation za CORE. Data minimization: detalji bez PII (A10-K3). CORE vidi summary, ne sadrzaj.</div>

      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(typeColors).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5 text-[11px] text-black/60">
            <span className={`w-2 h-2 rounded-full ${color}`} />{type}
          </span>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {activities.map((a, i) => (
          <div key={a.id} className={`flex items-start gap-3 px-4 py-3 ${i < activities.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50`}>
            <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${typeColors[a.type] || "bg-gray-400"}`} />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-black">{a.desc}</div>
              <div className="text-[11px] text-black/40 mt-0.5">{a.spv} • {a.user} • {a.time}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
