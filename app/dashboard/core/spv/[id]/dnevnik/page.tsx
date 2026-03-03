"use client";

import { useParams } from "next/navigation";
import { useSpvById, useActivityLog } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const catColors: Record<string, string> = {
  lifecycle: "bg-blue-500", billing: "bg-green-500", document: "bg-purple-500",
  approval: "bg-amber-500", assignment: "bg-teal-500", block: "bg-red-500",
  task: "bg-indigo-500", tok: "bg-orange-500",
};

export default function SpvDnevnikPage() {
  const { id } = useParams();
  const spvId = id as string;

  const { isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('audit_read');

  const { data: spv } = useSpvById(spvId);
  const { data: activity } = useActivityLog(spvId);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: 'SPV_AUDIT_LOG_VIEW', entity_type: 'audit_log', spv_id: spvId, details: { context: 'control_room' } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) {
    return (<div className="flex items-center justify-center h-64"><div className="text-center">
      <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
    </div></div>);
  }

  if (modeLoading || permLoading) {
    return (<div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>);
  }

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">Dnevnik</h1>
          <p className="text-[13px] text-black/50 mt-0.5">{activity.length} zapisa aktivnosti</p>
        </div>
        {/* P19: Export u forensic modu */}
        {isForensic && (
          <button className="px-4 py-2 rounded-lg text-[13px] font-medium bg-green-100 text-green-700 hover:bg-green-200">
            Export CSV (Forensic)
          </button>
        )}
      </div>

      {/* P19: Audit integrity notice */}
      <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-[12px] text-black/50">
        Audit log immutable — 11 godina cuvanje (ZoR cl. 12). SHA-256 hash integritet. Details JSONB data minimization (A10-K3).
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {activity.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {activity.map(a => (
              <div key={a.id} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50">
                <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${catColors[a.category] || "bg-gray-400"}`} />
                <div>
                  <div className="text-[13px] font-semibold text-black">{a.action}</div>
                  <div className="text-[11px] text-black/50">{a.details}</div>
                  <div className="text-[11px] text-black/30 mt-0.5">{a.actor} | {a.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        ) : <div className="p-8 text-center text-[13px] text-black/40">Nema aktivnosti za ovaj SPV</div>}
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
