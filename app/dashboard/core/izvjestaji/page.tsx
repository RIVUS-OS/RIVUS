"use client";
import { useSpvs, usePnlMonths, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { logAudit } from "@/lib/hooks/logAudit";
export default function CoreIzvjestajiPage() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const { allowed, loading: permLoading } = usePermission("core_report_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "CORE_IZVJESTAJI_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();

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


  if (spvsLoading || pnlMonthsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const reports = [
    { name: "Mjesecni P&L", period: pnlMonths[pnlMonths.length-1]?.month || "-", type: "Financijski" },
    { name: "PDV rekapitulacija", period: "Q4 2025", type: "Porezni" },
    { name: "SPV portfolio status", period: "Trenutni", type: "Operativni" },
    { name: "Vertikale performanse", period: "YTD", type: "Poslovni" },
    { name: "Audit trail", period: "Kontinuirano", type: "Compliance" },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Izvjestaji</h1></div>
      <div className="space-y-2">{reports.map(r => (<div key={r.name} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center"><div><div className="text-[14px] font-bold">{r.name}</div><div className="text-[12px] text-black/50">{r.type} | {r.period}</div></div><button className="px-3 py-1.5 bg-gray-100 text-black rounded-lg text-[11px] font-semibold opacity-50 cursor-not-allowed">Generiraj PDF</button></div>))}</div>
      <div className="text-[11px] text-black/30 italic">PDF generiranje aktivno nakon Phase D</div>
    </div>
  );
}
