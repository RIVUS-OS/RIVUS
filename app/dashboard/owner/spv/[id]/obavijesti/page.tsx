"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSpvById, useTokRequests, useMissingDocs, useTasks } from "@/lib/data-client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function OwnerSpvObavijesti() {
  const { id } = useParams();
  const spvId = id as string;
  const { isSafe, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("notifications_read");
  const { data: spv } = useSpvById(spvId);
  const { data: _raw_slaBreached } = useTokRequests(spvId);
  const { data: _raw_missing } = useMissingDocs();
  const { data: _raw_blocked } = useTasks(spvId);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: "OWNER_SPV_NOTIFICATIONS_VIEW", entity_type: "notification", spv_id: spvId, details: { context: "owner_workspace_tab" } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  const slaBreached = _raw_slaBreached.filter(t => t.slaBreached);
  const missing = _raw_missing.filter(d => d.spvId === id);
  const blocked = _raw_blocked.filter(t => t.status === "blokiran");
  const notifications = [
    ...slaBreached.map(t => ({ type: "SLA", text: `SLA probijen: ${t.title}`, severity: "red" as const })),
    ...missing.map(d => ({ type: "Dokument", text: `Nedostaje: ${d.name}`, severity: "red" as const })),
    ...blocked.map(t => ({ type: "Blokada", text: `Blokiran zadatak: ${t.title}`, severity: "amber" as const })),
    ...(spv.status === "blokiran" ? [{ type: "SPV", text: `Projekt blokiran: ${spv.blockReason}`, severity: "red" as const }] : []),
  ];

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — samo citanje aktivno.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Obavijesti</h1><p className="text-[13px] text-black/50 mt-0.5">{notifications.length} obavijesti</p></div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">Obavijesti se generiraju kroz obligation escalation engine. CRITICAL/HARD_GATE = immediate, ostalo = digest (A5).</div>

      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${n.severity === "red" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
              <div className={`h-3 w-3 rounded-full flex-shrink-0 ${n.severity === "red" ? "bg-red-500" : "bg-amber-500"}`} />
              <div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mr-2 ${n.severity === "red" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{n.type}</span>
                <span className="text-[13px] text-black">{n.text}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-green-200 p-8 text-center">
          <div className="text-[15px] font-semibold text-green-600">Nema obavijesti - sve u redu!</div>
        </div>
      )}

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
