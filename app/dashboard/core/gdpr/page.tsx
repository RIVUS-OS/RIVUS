"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { useGdprIncidents, useGdprDsars, useGdprConsents } from "@/lib/hooks/block-c";

export default function GdprPage() {
  const { isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("gdpr_manage");
  const { data: incidents, loading: iL } = useGdprIncidents();
  const { data: dsars, loading: dL } = useGdprDsars();
  const { data: consents, loading: cL } = useGdprConsents();

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "GDPR_VIEW", entity_type: "gdpr", details: {} });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading || iL || dL || cL) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const stats = [
    { label: "Incidenti", value: incidents.length, color: "text-red-600" },
    { label: "Otvoreni", value: incidents.filter(i => i.status === "OPEN" || i.status === "INVESTIGATING").length, color: "text-amber-600" },
    { label: "DSAR", value: dsars.length, color: "text-blue-600" },
    { label: "Pristanci", value: consents.filter(c => c.status === "GRANTED").length, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod aktivan.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black">GDPR</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Incidenti, DSAR zahtjevi, pristanci</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[12px] text-black/50">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Incidenti ({incidents.length})</div>
        {incidents.length === 0 && <div className="px-4 py-6 text-center text-[13px] text-black/40">Nema incidenata.</div>}
        {incidents.map(inc => (
          <div key={inc.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-black">{inc.title}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${inc.severity === "HIGH" || inc.severity === "CRITICAL" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{inc.severity}</span>
            </div>
            <div className="text-[11px] text-black/40 mt-0.5">{inc.status} | {inc.detectedAt ? new Date(inc.detectedAt).toLocaleDateString("hr") : "---"} | DPA: {inc.dpaNotified ? "Da" : "Ne"}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">DSAR ({dsars.length})</div>
        {dsars.length === 0 && <div className="px-4 py-6 text-center text-[13px] text-black/40">Nema DSAR zahtjeva.</div>}
        {dsars.map(d => (
          <div key={d.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-black">{d.requestType} - {d.dataSubjectRef}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${d.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{d.status}</span>
            </div>
            <div className="text-[11px] text-black/40 mt-0.5">Rok: {d.responseDeadline ? new Date(d.responseDeadline).toLocaleDateString("hr") : "---"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
