"use client";
import { useSpvs, useIssuedInvoices, useReceivedInvoices, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { logAudit } from "@/lib/hooks/logAudit";
export default function FinancijeNadzorPage() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const { allowed, loading: permLoading } = usePermission("finance_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "CORE_FINANCIJE-NADZOR_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: spvs, loading } = useSpvs();
  const { data: issued } = useIssuedInvoices();
  const { data: received } = useReceivedInvoices();

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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;
  const data = spvs.map(p => {
    const rev = issued.filter(i => i.spvId === p.id).reduce((s,i) => s + i.totalAmount, 0);
    const exp = received.filter(i => i.spvId === p.id).reduce((s,i) => s + i.totalAmount, 0);
    return { id: p.id, name: p.name, rev, exp, net: rev - exp };
  });
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Financije - Nadzor</h1></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th><th className="text-right px-3 py-2.5 font-semibold text-green-700">Prihod</th><th className="text-right px-3 py-2.5 font-semibold text-red-700">Rashod</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Neto</th></tr></thead><tbody>{data.map(d => (<tr key={d.id} className="border-b border-gray-50"><td className="px-3 py-2.5 font-bold">{d.name}</td><td className="px-3 py-2.5 text-right text-green-600">{formatEur(d.rev)}</td><td className="px-3 py-2.5 text-right text-red-600">{formatEur(d.exp)}</td><td className={`px-3 py-2.5 text-right font-bold ${d.net >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(d.net)}</td></tr>))}</tbody></table></div>
    </div>
  );
}