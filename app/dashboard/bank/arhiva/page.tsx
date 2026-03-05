"use client";

import { useSpvs, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { logAudit } from "@/lib/hooks/logAudit";

export default function BankArhivaPage() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const { allowed, loading: permLoading } = usePermission("bank_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "BANK_ARHIVA_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: spvs, loading: spvsLoading } = useSpvs();

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


  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const archived = spvs.filter(p => (p.status as string) === "zatvoren" || (p.status as string) === "zavrsen");
  const active = spvs.filter(p => (p.status as string) !== "zatvoren");

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Arhiva</h1><p className="text-[13px] text-black/50 mt-0.5">{archived.length} arhiviranih | {active.length} aktivnih</p></div>
      {archived.length > 0 ? (
        <div className="space-y-2">{archived.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <span className="text-[14px] font-bold">{p.id} - {p.name}</span>
            <span className="text-[12px] text-black/50 ml-2">{formatEur(p.totalBudget)}</span>
          </div>
        ))}</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-[13px] text-black/40">Nema arhiviranih projekata - svi su aktivni</div>
      )}
    </div>
  );
}

