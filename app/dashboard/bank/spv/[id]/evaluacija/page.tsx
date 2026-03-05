"use client";

import { useParams } from "next/navigation";
import { useSpvById, useBanks, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { logAudit } from "@/lib/hooks/logAudit";

export default function BankSpvEvaluacijaPage() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const { allowed, loading: permLoading } = usePermission("bank_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "BANK_SPV_SPV_EVALUACIJA_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: banks, loading: banksLoading } = useBanks();

  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);

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

  if (banksLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const bank = banks.find(b => b.id === spv.bankId);
  const isPending = bank?.evaluationPending === id;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Evaluacija</h1><p className="text-[13px] text-black/50 mt-0.5">{spv.name}</p></div>
      <div className={`bg-white rounded-xl border p-6 ${isPending ? "border-amber-200" : "border-gray-200"}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-black">Status evaluacije</h2>
          <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${isPending ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{isPending ? "U TIJEKU" : "ZAVRSENA"}</span>
        </div>
        <div className="grid grid-cols-2 gap-y-3 text-[13px]">
          <div><span className="text-black/40">SPV:</span> <span className="ml-2 font-medium">{spv.id} - {spv.name}</span></div>
          <div><span className="text-black/40">Budzet:</span> <span className="ml-2 font-bold">{formatEur(spv.totalBudget)}</span></div>
          <div><span className="text-black/40">Sektor:</span> <span className="ml-2">{spv.sectorLabel}</span></div>
          <div><span className="text-black/40">Grad:</span> <span className="ml-2">{spv.city}</span></div>
          {bank && <div><span className="text-black/40">Banka:</span> <span className="ml-2">{bank.name}</span></div>}
          {bank && <div><span className="text-black/40">Tip:</span> <span className="ml-2">{bank.relationshipType}</span></div>}
        </div>
      </div>
    </div>
  );
}
