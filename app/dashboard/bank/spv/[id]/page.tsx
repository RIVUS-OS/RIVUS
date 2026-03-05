"use client";

import { useParams } from "next/navigation";
import { useSpvById, useDocuments, useActivityLog, useBanks, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { logAudit } from "@/lib/hooks/logAudit";

export default function BankSpvPage() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const { allowed, loading: permLoading } = usePermission("bank_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "BANK_SPV_[ID]_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: banks, loading: banksLoading } = useBanks();

  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: docs } = useDocuments(id as string);
  const { data: _raw2_activity } = useActivityLog(id as string);

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
  const activity = _raw2_activity.slice(0, 5);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Pregled</h1><p className="text-[13px] text-black/50 mt-0.5">{spv.name} | {spv.phase}</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Status", value: spv.status, color: spv.status === "aktivan" ? "text-green-600" : spv.status === "blokiran" ? "text-red-600" : "text-blue-600" },
          { label: "Faza", value: spv.phase, color: "text-blue-600" },
          { label: "Budzet", value: formatEur(spv.totalBudget), color: "text-black" },
          { label: "Dokumenti", value: docs.length, color: "text-blue-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>
      {bank && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[14px] font-bold text-black mb-2">Banka</h3>
          <div className="text-[13px]"><span className="font-semibold">{bank.name}</span> | {bank.contact} | {bank.relationshipType}</div>
          {bank.evaluationPending === id && <div className="mt-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700 font-medium">Evaluacija u tijeku</div>}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-[14px] font-bold text-black mb-3">Zadnje aktivnosti</h3>
        {activity.length > 0 ? activity.map(a => (
          <div key={a.id} className="flex items-start gap-2 text-[12px] mb-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-blue-400 flex-shrink-0" />
            <div><div className="text-black">{a.action}</div><div className="text-black/40 text-[11px]">{a.actor} | {a.timestamp}</div></div>
          </div>
        )) : <div className="text-[12px] text-black/30">Nema aktivnosti</div>}
      </div>
    </div>
  );
}
