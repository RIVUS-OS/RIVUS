"use client";

import { useSpvs, useBanks, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function BankEvaluacijePage() {
  const { allowed, loading: permLoading } = usePermission("bank_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "BANK_EVALUACIJE_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: banks, loading: banksLoading } = useBanks();

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;

  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;


  if (spvsLoading || banksLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const evalPending = spvs.filter(p => banks.some(b => b.evaluationPending === p.id));
  const completed = spvs.filter(p => !banks.some(b => b.evaluationPending === p.id));

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Evaluacije</h1><p className="text-[13px] text-black/50 mt-0.5">{evalPending.length} u tijeku | {completed.length} zavrsenih</p></div>
      {evalPending.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[14px] font-bold text-amber-700">U tijeku</h3>
          {evalPending.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-amber-200 p-4">
              <div className="flex items-center justify-between"><span className="text-[14px] font-bold">{p.id} - {p.name}</span><span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700 font-semibold">U TIJEKU</span></div>
              <div className="text-[12px] text-black/50 mt-1">{p.sectorLabel} | {p.city} | Budzet: {formatEur(p.totalBudget)}</div>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-[14px] font-bold text-green-700">Zavrsene</h3>
        {completed.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between"><span className="text-[14px] font-bold">{p.id} - {p.name}</span><span className="px-2 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700 font-semibold">ZAVRSENA</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
