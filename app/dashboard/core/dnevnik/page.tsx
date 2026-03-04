"use client";

import { useActivityLog } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const catColors: Record<string, string> = {
  lifecycle: "bg-blue-500", billing: "bg-green-500", document: "bg-purple-500",
  approval: "bg-amber-500", assignment: "bg-teal-500", block: "bg-red-500",
  task: "bg-indigo-500", tok: "bg-orange-500",
};

const catLabels: Record<string, string> = {
  lifecycle: "Lifecycle", billing: "Billing", document: "Dokument",
  approval: "Odobrenje", assignment: "Dodjela", block: "Blokada",
  task: "Zadatak", tok: "TOK",
};

export default function DnevnikPage() {
  const { allowed, loading: permLoading } = usePermission("audit_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "CORE_DNEVNIK_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: activityLog, loading: activityLogLoading } = useActivityLog();

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;

  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;


  if (activityLogLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Dnevnik aktivnosti</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{activityLog.length} zapisa | Kronoloski pregled svih dogadjaja u sustavu</p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {Object.entries(catLabels).map(([key, label]) => {
          const count = activityLog.filter(a => a.category === key).length;
          return (
            <div key={key} className="bg-white rounded-lg border border-gray-200 p-2 text-center">
              <div className="text-[14px] font-bold text-black">{count}</div>
              <div className="text-[10px] text-black/40">{label}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-50">
          {activityLog.map(entry => (
            <div key={entry.id} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
              <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${catColors[entry.category] || "bg-gray-400"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-semibold text-black">{entry.action}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                    entry.category === "block" ? "bg-red-100 text-red-700" :
                    entry.category === "billing" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>{catLabels[entry.category] || entry.category}</span>
                </div>
                <p className="text-[11px] text-black/50">{entry.details}</p>
                <p className="text-[11px] text-black/30 mt-0.5">
                  {entry.actor} | {entry.timestamp}
                  {entry.spvId && <span> | {entry.spvId}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
