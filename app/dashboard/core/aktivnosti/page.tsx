"use client";
import { useActivityLog } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
export default function CoreAktivnostiPage() {
  const { allowed, loading: permLoading } = usePermission("activity_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "CORE_AKTIVNOSTI_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: activityLog, loading: activityLogLoading } = useActivityLog();

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;

  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;


  if (activityLogLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Aktivnosti</h1><p className="text-[13px] text-black/50 mt-0.5">{activityLog.length} zapisa</p></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th><th className="text-left px-3 py-2.5 font-semibold text-black/70">Akcija</th><th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th><th className="text-left px-3 py-2.5 font-semibold text-black/70">Korisnik</th></tr></thead><tbody>{activityLog.slice(0, 20).map(a => (<tr key={a.id} className="border-b border-gray-50"><td className="px-3 py-2.5 text-black/50">{a.timestamp}</td><td className="px-3 py-2.5">{a.action}</td><td className="px-3 py-2.5 text-black/50">{a.spvId}</td><td className="px-3 py-2.5 text-black/50">{a.actor}</td></tr>))}</tbody></table></div>
    </div>
  );
}

