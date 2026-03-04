"use client";

import { useParams } from "next/navigation";
import { useSpvById, useTokRequests } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function AccSpvZahtjeviPage() {
  const { allowed, loading: permLoading } = usePermission("accounting_access");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "ACCOUNTING_SPV_SPV_ZAHTJEVI_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: _raw_open } = useTokRequests(id as string);
  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const open = _raw_open.filter(t => t.status === "otvoren" || t.status === "u_tijeku" || t.status === "eskaliran");

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Zahtjevi</h1><p className="text-[13px] text-black/50 mt-0.5">{open.length} otvorenih</p></div>
      <div className="space-y-2">
        {open.map(t => (
          <div key={t.id} className={`bg-white rounded-xl border p-4 ${t.slaBreached ? "border-red-200" : "border-gray-200"}`}>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-black">{t.id}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.priority === "critical" ? "bg-red-100 text-red-700" : t.priority === "high" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{t.priority}</span>
            </div>
            <div className="text-[13px] text-black mt-1">{t.title}</div>
            <div className="text-[11px] text-black/40 mt-0.5">{t.assignedTo} | {t.dueDate}</div>
          </div>
        ))}
        {open.length === 0 && <div className="bg-white rounded-xl border border-green-200 p-8 text-center text-green-600 font-semibold">Nema otvorenih zahtjeva</div>}
      </div>
    </div>
  );
}
