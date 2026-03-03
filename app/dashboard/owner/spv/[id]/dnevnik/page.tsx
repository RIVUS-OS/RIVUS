"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSpvById, useActivityLog } from "@/lib/data-client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const catColors: Record<string, string> = { lifecycle: "bg-blue-500", billing: "bg-green-500", document: "bg-purple-500", approval: "bg-amber-500", assignment: "bg-teal-500", block: "bg-red-500", task: "bg-indigo-500", tok: "bg-orange-500" };

export default function OwnerSpvDnevnikPage() {
  const { id } = useParams();
  const spvId = id as string;
  const { isSafe, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("audit_read");
  const { data: spv } = useSpvById(spvId);
  const { data: activity } = useActivityLog(spvId);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: "OWNER_SPV_AUDIT_LOG_VIEW", entity_type: "audit_log", spv_id: spvId, details: { context: "owner_workspace_tab" } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — samo citanje aktivno.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — export dozvoljen, chain-of-custody log aktivan.</div>}

      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Dnevnik</h1><p className="text-[13px] text-black/50 mt-0.5">{activity.length} zapisa</p></div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">Audit log immutable — 11 godina cuvanje (ZoR cl. 12). Owner vidi zapise vlastitog SPV-a, bez PII cross-tenant (A10-K3).</div>

      <div className="bg-white rounded-xl border border-gray-200">
        {activity.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {activity.map(a => (
              <div key={a.id} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50">
                <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${catColors[a.category] || "bg-gray-400"}`} />
                <div><div className="text-[13px] font-semibold text-black">{a.action}</div><div className="text-[11px] text-black/50">{a.details}</div><div className="text-[11px] text-black/30 mt-0.5">{a.actor} | {a.timestamp}</div></div>
              </div>
            ))}
          </div>
        ) : <div className="p-8 text-center text-[13px] text-black/40">Nema aktivnosti</div>}
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
