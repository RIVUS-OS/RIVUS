"use client";
import { useSpvs, useTasks, useTokRequests, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
export default function HoldingRizikPage() {
  const { allowed, loading: permLoading } = usePermission("holding_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "HOLDING_RIZIK_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: spvs, loading } = useSpvs();
  const { data: tasks } = useTasks();
  const { data: tok } = useTokRequests();
  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;
  const data = spvs.map(p => {
    const blocked = tasks.filter(t => t.spvId === p.id && t.status === "blokiran").length;
    const sla = tok.filter(t => t.spvId === p.id && t.status === "eskaliran").length;
    const risk = blocked + sla > 2 ? "Visok" : blocked + sla > 0 ? "Srednji" : "Nizak";
    return { id: p.id, name: p.name, status: p.status, blocked, sla, risk };
  });
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Holding - Rizik pregled</h1></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold">SPV</th><th className="text-center px-3 py-2.5 font-semibold">Status</th><th className="text-right px-3 py-2.5 font-semibold">Blokirani</th><th className="text-right px-3 py-2.5 font-semibold">Eskalacije</th><th className="text-center px-3 py-2.5 font-semibold">Rizik</th></tr></thead><tbody>{data.map(d => (<tr key={d.id} className="border-b border-gray-50"><td className="px-3 py-2.5 font-bold">{d.name}</td><td className="px-3 py-2.5 text-center">{d.status}</td><td className="px-3 py-2.5 text-right">{d.blocked}</td><td className="px-3 py-2.5 text-right">{d.sla}</td><td className={`px-3 py-2.5 text-center font-semibold ${d.risk === "Visok" ? "text-red-600" : d.risk === "Srednji" ? "text-amber-600" : "text-green-600"}`}>{d.risk}</td></tr>))}</tbody></table></div>
    </div>
  );
}