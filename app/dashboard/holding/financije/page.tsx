"use client";

import { useSpvs, useIssuedInvoices, useReceivedInvoices, usePnlMonths, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function HoldingFinancijePage() {
  const { allowed, loading: permLoading } = usePermission("holding_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "HOLDING_FINANCIJE_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: _issAll } = useIssuedInvoices();
  const { data: _recvAll } = useReceivedInvoices();
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;

  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;


  if (spvsLoading || pnlMonthsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const totalBudget = spvs.reduce((s, p) => s + p.totalBudget, 0);
  const totalProfit = spvs.reduce((s, p) => s + p.estimatedProfit, 0);
  const totalIssued = spvs.reduce((s, p) => s + _issAll.filter(x=>x.spvId===p.id).reduce((ss, i) => ss + i.totalAmount, 0), 0);
  const totalReceived = spvs.reduce((s, p) => s + _recvAll.filter(x=>x.spvId===p.id).reduce((ss, i) => ss + i.totalAmount, 0), 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Financije</h1><p className="text-[13px] text-black/50 mt-0.5">Holding pregled</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Ukupni budzet", value: formatEur(totalBudget), color: "text-black" },
          { label: "Proc. profit", value: formatEur(totalProfit), color: "text-green-600" },
          { label: "Izdano", value: formatEur(totalIssued), color: "text-blue-600" },
          { label: "Primljeno", value: formatEur(totalReceived), color: "text-amber-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-[14px] font-bold text-black mb-3">Mjesecni P&L (CORE)</h3>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100">
            <th className="text-left py-2 font-semibold text-black/70">Mjesec</th>
            <th className="text-right py-2 font-semibold text-green-700">Prihodi</th>
            <th className="text-right py-2 font-semibold text-red-700">Rashodi</th>
            <th className="text-right py-2 font-semibold text-black/70">Neto</th>
          </tr></thead>
          <tbody>{pnlMonths.map(m => (
            <tr key={m.month} className="border-b border-gray-50">
              <td className="py-2 text-black">{m.month}</td>
              <td className="py-2 text-right text-green-600">{formatEur(m.revenue)}</td>
              <td className="py-2 text-right text-red-600">{formatEur(m.expenses)}</td>
              <td className={`py-2 text-right font-bold ${m.net >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(m.net)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
