"use client";

import { useSpvs, useTokRequests } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function AccountingZahtjeviPage() {
  const { allowed, loading: permLoading } = usePermission("accounting_access");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "ACCOUNTING_ZAHTJEVI_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: _tokAll } = useTokRequests();
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;

  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;


  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const allTok = spvs.flatMap(p => _tokAll.filter(t=>t.spvId===p.id)).filter(t => t.status === "otvoren" || t.status === "u_tijeku" || t.status === "eskaliran");
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Otvoreni zahtjevi</h1><p className="text-[13px] text-black/50 mt-0.5">{allTok.length} aktivnih zahtjeva</p></div>
      <div className="space-y-2">
        {allTok.map(t => (
          <div key={t.id} className={`bg-white rounded-xl border p-4 ${t.slaBreached ? "border-red-200" : "border-gray-200"}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[14px] font-bold text-black">{t.id}</span>
                <span className="text-[12px] text-black/50 ml-2">{t.spvId}</span>
              </div>
              <div className="flex items-center gap-2">
                {t.slaBreached && <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700 font-semibold">SLA PROBIJEN</span>}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.priority === "critical" ? "bg-red-100 text-red-700" : t.priority === "high" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{t.priority}</span>
              </div>
            </div>
            <div className="text-[13px] text-black mt-1">{t.title}</div>
            <div className="text-[11px] text-black/40 mt-0.5">Dodijeljen: {t.assignedTo} | Rok: {t.dueDate}</div>
          </div>
        ))}
        {allTok.length === 0 && <div className="bg-white rounded-xl border border-green-200 p-8 text-center text-green-600 text-[14px] font-semibold">Nema otvorenih zahtjeva</div>}
      </div>
    </div>
  );
}
