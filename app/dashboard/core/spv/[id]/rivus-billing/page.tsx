"use client";

import { useParams } from "next/navigation";
import { useSpvById, useIssuedInvoices, useActiveContracts, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function SpvRivusBillingPage() {
  const { id } = useParams();
  const spvId = id as string;

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('billing_manage');
  const writeDisabled = isSafe || isLockdown || isForensic || role !== 'Core';

  const { data: spv } = useSpvById(spvId);
  const { data: issued } = useIssuedInvoices(spvId);
  const { data: _raw_contracts } = useActiveContracts();

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: 'SPV_BILLING_VIEW', entity_type: 'billing', spv_id: spvId, details: { context: 'control_room' } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) {
    return (<div className="flex items-center justify-center h-64"><div className="text-center">
      <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
    </div></div>);
  }

  if (modeLoading || permLoading) {
    return (<div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>);
  }

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  const contracts = _raw_contracts.filter(c => c.partyBId === id);
  const totalBilled = issued.reduce((s, i) => s + i.totalAmount, 0);
  const totalPaid = issued.filter(i => (i.status as string) === "placen").reduce((s, i) => s + i.totalAmount, 0);

  const categoryLabels: Record<string, string> = {
    platform_fee: "Platform fee", brand_licence: "Brand licenca",
    pm_service: "PM usluga", success_fee: "Success fee", vertical_commission: "Provizija",
  };

  const byCategory: Record<string, number> = {};
  issued.forEach(inv => { byCategory[inv.category] = (byCategory[inv.category] || 0) + inv.totalAmount; });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">RIVUS Billing</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Fakturiranje CORE usluga za {spv.name}</p>
      </div>

      {/* P19: CORE D.O.O. separation notice */}
      <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
        CORE D.O.O. izdaje racun, ne CORE platforma. Billing je CORE funkcija — Owner ne moze mijenjati. (A1)
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-xl font-bold text-blue-600">{formatEur(totalBilled)}</div>
          <div className="text-[12px] text-black/50">Ukupno fakturirano</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-xl font-bold text-green-600">{formatEur(totalPaid)}</div>
          <div className="text-[12px] text-black/50">Naplaceno</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className={`text-xl font-bold ${totalBilled - totalPaid > 0 ? "text-red-600" : "text-green-600"}`}>{formatEur(totalBilled - totalPaid)}</div>
          <div className="text-[12px] text-black/50">Otvoreno</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-[14px] font-bold text-black mb-3">Po tipu usluge</h3>
        {Object.entries(byCategory).map(([cat, amount]) => (
          <div key={cat} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-[13px]">
            <span className="text-black/70">{categoryLabels[cat] || cat}</span>
            <span className="font-bold text-black">{formatEur(amount)}</span>
          </div>
        ))}
        {Object.keys(byCategory).length === 0 && <div className="text-[12px] text-black/30">Nema fakturiranja</div>}
      </div>

      {contracts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[14px] font-bold text-black mb-3">Aktivni ugovori ({contracts.length})</h3>
          {contracts.map(c => (
            <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 mb-1 text-[12px]">
              <span className="font-medium text-black">{c.number} - {c.services}</span>
              <span className="text-black/40">{c.startDate} - {c.endDate || "neograniceno"}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
