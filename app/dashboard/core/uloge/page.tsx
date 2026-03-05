"use client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { logAudit } from "@/lib/hooks/logAudit";
export default function CoreUlogePage() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const { allowed, loading: permLoading } = usePermission("user_manage");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "CORE_ULOGE_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

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


  const roles = [
    { name: "CORE Admin", desc: "Puni pristup svim SPV-ovima i postavkama", count: 1, color: "bg-black text-white" },
    { name: "Owner", desc: "Vlasnik SPV-a, pristup vlastitim projektima", count: 3, color: "bg-blue-100 text-blue-700" },
    { name: "Accounting", desc: "Knjigovodstveni pristup financijama", count: 2, color: "bg-amber-100 text-amber-700" },
    { name: "Bank", desc: "Evaluacija i pracenje kredita", count: 2, color: "bg-green-100 text-green-700" },
    { name: "Vertical", desc: "Specijalizirani dobavljaci usluga", count: 5, color: "bg-purple-100 text-purple-700" },
    { name: "Holding", desc: "Strateski pregled portfolija", count: 1, color: "bg-gray-800 text-white" },
  ];
  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Uloge i dozvole</h1></div>
      <div className="space-y-2">{roles.map(r => (
        <div key={r.name} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3"><span className={`px-3 py-1 rounded-full text-[11px] font-bold ${r.color}`}>{r.name}</span><span className="text-[12px] text-black/50">{r.desc}</span></div>
          <span className="text-[13px] font-bold text-black">{r.count}</span>
        </div>
      ))}</div>
    </div>
  );
}
