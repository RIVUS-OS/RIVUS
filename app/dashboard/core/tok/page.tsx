"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { useGlobalActivityLog } from "@/lib/hooks/block-c";

const typeColors: Record<string, string> = {
  spvs: "bg-blue-500", invoices: "bg-green-500", documents: "bg-purple-500",
  approvals: "bg-amber-500", user_spv_assignments: "bg-teal-500", obligations: "bg-red-500",
  tasks: "bg-indigo-500", mandatory_items: "bg-pink-500",
};

export default function PentagonTokPage() {
  const { isSafe, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("pentagon_tok");
  const { data: activities, loading: dataLoading, error } = useGlobalActivityLog(50);

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "PENTAGON_TOK_VIEW", entity_type: "pentagon", details: {} });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading || dataLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (error) return <div className="flex items-center justify-center h-64"><p className="text-sm text-red-600">Greska: {error}</p></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Globalni TOK</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Aktivnost svih SPV-ova i sustava</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(typeColors).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5 text-[11px] text-black/60">
            <span className={`w-2 h-2 rounded-full ${color}`} />{type}
          </span>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {activities.length === 0 && <div className="px-4 py-8 text-center text-[13px] text-black/40">Nema aktivnosti.</div>}
        {activities.map((a, i) => (
          <div key={a.id} className={`flex items-start gap-3 px-4 py-3 ${i < activities.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50`}>
            <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${typeColors[a.entityType || ""] || "bg-gray-400"}`} />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-black">
                {a.severity === "critical" ? <span className="text-red-600 font-bold mr-1">!!!</span> : null}
                {a.action}
              </div>
              <div className="text-[11px] text-black/40 mt-0.5">{a.spvName || "SYSTEM"} | {a.userName || "---"} | {new Date(a.createdAt).toLocaleString("hr")}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
