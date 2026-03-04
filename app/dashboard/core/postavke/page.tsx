"use client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
export default function CorePostavkePage() {
  const { allowed, loading: permLoading } = usePermission("core_settings");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "CORE_POSTAVKE_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const settings = [
    { group: "Platforma", items: ["Naziv platforme", "Logo", "Domena", "Jezik", "Valuta"] },
    { group: "Notifikacije", items: ["Email obavijesti", "SLA upozorenja", "Eskalacije", "Tjedni izvjestaj"] },
    { group: "Sigurnost", items: ["2FA", "Session timeout", "IP whitelist", "Audit log"] },
    { group: "Integracije", items: ["eRacun", "KPD", "FINA", "Supabase"] },
  ];
  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Postavke platforme</h1></div>
      {settings.map(s => (
        <div key={s.group} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[14px] font-bold text-black mb-3">{s.group}</div>
          <div className="space-y-2">{s.items.map(item => (
            <div key={item} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-[12px] text-black/70">{item}</span>
              <div className="h-8 w-48 bg-gray-50 rounded-lg border border-gray-200" />
            </div>
          ))}</div>
        </div>
      ))}
      <div className="text-[11px] text-black/30 italic">Postavke aktivne nakon Phase B (auth + RLS)</div>
    </div>
  );
}
