"use client";

import { useRouter } from "next/navigation";
import { useSpvs, useAccountants, useIssuedInvoices, useReceivedInvoices, useTokRequests, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function AccountingDashboardPage() {
  const { allowed, loading: permLoading } = usePermission("accounting_access");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "ACCOUNTING_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: _recvAll } = useReceivedInvoices();
  const { data: _tokAll } = useTokRequests();
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: accountants, loading: accountantsLoading } = useAccountants();

  const router = useRouter();
  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  if (spvsLoading || accountantsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const mySpvs = spvs; // In production filtered by accountant auth

  const allTok = mySpvs.flatMap(p => _tokAll.filter(t=>t.spvId===p.id).filter(t => t.status === "otvoren" || t.status === "u_tijeku"));
  const totalReceived = mySpvs.reduce((s, p) => s + _recvAll.filter(x=>x.spvId===p.id).reduce((ss, i) => ss + i.totalAmount, 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Knjigovodstvo - Nadzorna ploca</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{accountants.length} knjigovodja | {mySpvs.length} SPV-ova u sustavu</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "SPV-ova", value: mySpvs.length, color: "text-blue-600" },
          { label: "Knjigovodja", value: accountants.length, color: "text-blue-600" },
          { label: "Primljeni racuni", value: formatEur(totalReceived), color: "text-amber-600" },
          { label: "Otvoreni TOK", value: allTok.length, color: allTok.length > 0 ? "text-amber-600" : "text-green-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100 text-[14px] font-bold text-black">Projekti</div>
        <div className="divide-y divide-gray-50">
          {mySpvs.map(p => (
            <div key={p.id} onClick={() => router.push("/dashboard/accounting/spv/" + p.id)}
              className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
              <div>
                <span className="text-[14px] font-bold text-black">{p.id}</span>
                <span className="text-[12px] text-black/50 ml-2">{p.name} | {p.phase}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                p.status === "aktivan" ? "bg-green-100 text-green-700" :
                p.status === "blokiran" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
              }`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
