"use client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { logAudit } from "@/lib/hooks/logAudit";

export default function HoldingProfilPage() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const { allowed, loading: permLoading } = usePermission("holding_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "HOLDING_PROFIL_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

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


  const fields = [
    ["Naziv", "RIVUS Holding d.o.o."],
    ["OIB", "12345678901"],
    ["Sjediste", "Zagreb, Hrvatska"],
    ["Osnovan", "12.12.2025"],
    ["Uloga", "Brand guardian i IP holder"],
    ["Direktor", "Marijo Jurke"],
    ["Status", "Aktivan"],
    ["NKD", "64.20 - Djelatnost holding drustava"],
  ];

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;

  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;


  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Profil</h1><p className="text-[13px] text-black/50 mt-0.5">RIVUS Holding d.o.o.</p></div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-3">
          {fields.map(([label, val]) => (
            <div key={label} className="flex items-start gap-4 py-2 border-b border-gray-50 last:border-0">
              <span className="text-[12px] text-black/40 w-28 flex-shrink-0">{label}</span>
              <span className="text-[13px] font-medium text-black">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
