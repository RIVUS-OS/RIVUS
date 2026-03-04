"use client";

import { useSpvs, useVerticals, useBanks, useAccountants, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function HoldingDashboardPage() {
  const { allowed, loading: permLoading } = usePermission("holding_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "HOLDING_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: verticals, loading: verticalsLoading } = useVerticals();
  const { data: banks, loading: banksLoading } = useBanks();
  const { data: accountants, loading: accountantsLoading } = useAccountants();

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;

  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;


  if (spvsLoading || verticalsLoading || banksLoading || accountantsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const totalBudget = spvs.reduce((s, p) => s + p.totalBudget, 0);
  const totalProfit = spvs.reduce((s, p) => s + p.estimatedProfit, 0);
  const blocked = spvs.filter(p => p.status === "blokiran");

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">RIVUS Holding - Nadzorna ploca</h1><p className="text-[13px] text-black/50 mt-0.5">Stratesko upravljanje portfeljem</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "SPV-ova", value: spvs.length, color: "text-blue-600" },
          { label: "Ukupni budzet", value: formatEur(totalBudget), color: "text-black" },
          { label: "Proc. profit", value: formatEur(totalProfit), color: "text-green-600" },
          { label: "Blokirani", value: blocked.length, color: blocked.length > 0 ? "text-red-600" : "text-green-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-blue-600">{verticals.length}</div><div className="text-[12px] text-black/50">Vertikale</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-blue-600">{banks.length}</div><div className="text-[12px] text-black/50">Banke</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-blue-600">{accountants.length}</div><div className="text-[12px] text-black/50">Knjigovodje</div></div>
      </div>
      {blocked.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="text-[14px] font-bold text-red-700 mb-2">Blokirani SPV-ovi</div>
          {blocked.map(p => <div key={p.id} className="text-[12px] text-red-600 py-1">{p.id} - {p.name}: {p.blockReason}</div>)}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-[11px] text-black/40 italic">RIVUS Holding d.o.o. - brand guardian i IP holder. Ovo je management evidencija, a ne knjigovodstveni sustav.</div>
    </div>
  );
}
