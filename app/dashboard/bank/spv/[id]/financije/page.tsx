"use client";

import { useParams } from "next/navigation";
import { useSpvById, useIssuedInvoices, useReceivedInvoices, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { logAudit } from "@/lib/hooks/logAudit";

const statusColors: Record<string, string> = { "placen": "bg-green-100 text-green-700", "ceka": "bg-amber-100 text-amber-700", "kasni": "bg-red-100 text-red-700", "storniran": "bg-gray-100 text-gray-500" };

export default function BankSpvFinancijePage() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const { allowed, loading: permLoading } = usePermission("bank_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "BANK_SPV_SPV_FINANCIJE_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: issued } = useIssuedInvoices(id as string);
  const { data: received } = useReceivedInvoices(id as string);

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

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const totalIssued = issued.reduce((s, i) => s + i.totalAmount, 0);
  const totalReceived = received.reduce((s, i) => s + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Financije</h1><p className="text-[13px] text-black/50 mt-0.5">{spv.name}</p></div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-lg font-bold text-green-600">{formatEur(totalIssued)}</div><div className="text-[12px] text-black/50">Izdano</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-lg font-bold text-amber-600">{formatEur(totalReceived)}</div><div className="text-[12px] text-black/50">Primljeno</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-lg font-bold text-blue-600">{formatEur(spv.totalBudget)}</div><div className="text-[12px] text-black/50">Budzet</div></div>
      </div>
      {issued.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Izdani ({issued.length})</div>
          <table className="w-full text-[12px]"><tbody>{issued.map(inv => (
            <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2 font-bold">{inv.number}</td>
              <td className="px-3 py-2 text-black/70">{inv.date}</td>
              <td className="px-3 py-2 text-right font-bold">{formatEur(inv.totalAmount)}</td>
              <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[inv.status] || "bg-gray-100"}`}>{inv.status}</span></td>
            </tr>
          ))}</tbody></table>
        </div>
      )}
    </div>
  );
}
