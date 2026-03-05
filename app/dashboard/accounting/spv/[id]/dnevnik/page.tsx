"use client";

import { useParams } from "next/navigation";
import { useSpvById, useActivityLog } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { logAudit } from "@/lib/hooks/logAudit";

const catColors: Record<string, string> = { lifecycle: "bg-blue-500", billing: "bg-green-500", document: "bg-purple-500", approval: "bg-amber-500", assignment: "bg-teal-500", block: "bg-red-500", task: "bg-indigo-500", tok: "bg-orange-500" };

export default function AccSpvDnevnikPage() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const { allowed, loading: permLoading } = usePermission("accounting_access");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "ACCOUNTING_SPV_SPV_DNEVNIK_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: activity } = useActivityLog(id as string);

  // V2.5-7: Lockdown redirect
  if (isLockdown) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-700">Sustav u Lockdown modu</p>
          <p className="text-sm text-gray-500 mt-1">Kontaktirajte CORE administratora.</p>
        </div>
      </div>
    );
  }

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Dnevnik</h1><p className="text-[13px] text-black/50 mt-0.5">{activity.length} zapisa</p></div>
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
    </div>
  );
}
