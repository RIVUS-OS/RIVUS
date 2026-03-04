"use client";

import { useRouter } from "next/navigation";
import { useSpvs, useVerticals, useTasks, useTokRequests, useSlaBreached, useEscalatedTok, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function VerticalDashboardPage() {
  const { allowed, loading: permLoading } = usePermission("vertical_detail");
  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();

  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "VERTICAL_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: _tasksAll } = useTasks();
  const { data: _tokAll } = useTokRequests();
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: verticals, loading: verticalsLoading } = useVerticals();
  const { data: slaBreached } = useSlaBreached();
  const { data: escalated } = useEscalatedTok();

  const router = useRouter();

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading || modeLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  if (isLockdown) {
    return (<div className="flex items-center justify-center h-64"><div className="text-center">
      <p className="text-lg font-semibold text-red-700">Sustav u Lockdown modu</p>
      <p className="text-sm text-gray-500 mt-1">Kontaktirajte CORE administratora.</p>
    </div></div>);
  }

  if (spvsLoading || verticalsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const allOpenTasks = spvs.flatMap(p => _tasksAll.filter(x => x.spvId === p.id).filter(t => (t.status as string) !== "zavrsen"));
  const allOpenTok = spvs.flatMap(p => _tokAll.filter(t => t.spvId === p.id).filter(t => t.status === "otvoren" || t.status === "u_tijeku"));
  const overdueTasks = allOpenTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date());

  // V2.5-3: Provizije (estimated from vertical commission rates)
  const totalProvizija = verticals.reduce((s, v) => s + (v.commission || 0), 0);
  const avgProvizija = verticals.length > 0 ? (totalProvizija / verticals.length).toFixed(1) : "0";
  const activeVerticals = verticals.filter(v => v.active);

  const kpis = [
    { label: "SPV-ova", value: String(spvs.length), sub: "dodijeljeno", color: "text-blue-600" },
    { label: "Aktivne vertikale", value: String(activeVerticals.length), sub: verticals.length + " ukupno", color: "text-blue-600" },
    { label: "Otvoreni zadaci", value: String(allOpenTasks.length), sub: overdueTasks.length > 0 ? overdueTasks.length + " prekoracenih" : "sve u roku", color: allOpenTasks.length > 0 ? "text-amber-600" : "text-green-600" },
    { label: "TOK zahtjevi", value: String(allOpenTok.length), sub: escalated.length > 0 ? escalated.length + " eskaliranih" : "nema eskalacija", color: allOpenTok.length > 0 ? "text-amber-600" : "text-green-600" },
  ];

  const slaKpis = [
    { label: "SLA krsenja", value: String(slaBreached.length), color: slaBreached.length > 0 ? "text-red-600" : "text-green-600", bg: slaBreached.length > 0 ? "bg-red-50" : "bg-green-50" },
    { label: "Prosjecna provizija", value: avgProvizija + "%", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Eskalirani zahtjevi", value: String(escalated.length), color: escalated.length > 0 ? "text-red-600" : "text-green-600", bg: escalated.length > 0 ? "bg-red-50" : "bg-green-50" },
    { label: "Zakasnjeli zadaci", value: String(overdueTasks.length), color: overdueTasks.length > 0 ? "text-amber-600" : "text-green-600", bg: overdueTasks.length > 0 ? "bg-amber-50" : "bg-green-50" },
  ];

  const statusColors: Record<string, string> = {
    aktivan: "bg-green-100 text-green-700",
    blokiran: "bg-red-100 text-red-700",
    u_izradi: "bg-blue-100 text-blue-700",
    na_cekanju: "bg-gray-100 text-gray-600",
    zavrsen: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Vertikala - Nadzorna ploca</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{activeVerticals.length} aktivnih vertikala | {spvs.length} SPV-ova</p>
      </div>

      {isSafe && (
        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700">
          Sustav u Safe Mode — samo citanje aktivno. Kontaktirajte CORE.
        </div>
      )}

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/70 font-medium mt-1">{k.label}</div>
            <div className="text-[11px] text-black/40 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* V2.5-3: SLA + Provizije panel */}
      <div>
        <h2 className="text-[16px] font-bold text-black mb-3">SLA i performanse</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {slaKpis.map(k => (
            <div key={k.label} className={`rounded-xl border border-gray-200 p-4 ${k.bg}`}>
              <div className={`text-[20px] font-bold ${k.color}`}>{k.value}</div>
              <div className="text-[12px] text-black/50 mt-1">{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vertikale lista */}
      {verticals.length > 0 && (
        <div>
          <h2 className="text-[16px] font-bold text-black mb-3">Vertikale</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
                <th className="text-left px-3 py-2.5 font-semibold text-black/70">Tip</th>
                <th className="text-center px-3 py-2.5 font-semibold text-black/70">Provizija</th>
                <th className="text-center px-3 py-2.5 font-semibold text-black/70">SPV-ovi</th>
                <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
              </tr></thead>
              <tbody>
                {verticals.map(v => (
                  <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-black">{v.name}</td>
                    <td className="px-3 py-2.5 text-black/50">{v.type}</td>
                    <td className="px-3 py-2.5 text-center font-medium text-blue-600">{v.commission}%</td>
                    <td className="px-3 py-2.5 text-center">{v.assignedSpvs?.length || 0}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${v.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {v.active ? "Aktivan" : "Neaktivan"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Projekti */}
      <div>
        <h2 className="text-[16px] font-bold text-black mb-3">Projekti</h2>
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="divide-y divide-gray-50">
            {spvs.map(p => {
              const spvTasks = allOpenTasks.filter(t => t.spvId === p.id);
              const spvTok = allOpenTok.filter(t => t.spvId === p.id);
              return (
                <div key={p.id} onClick={() => router.push("/dashboard/vertical/spv/" + p.id)} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <div>
                    <span className="text-[14px] font-bold text-black">{p.name}</span>
                    <span className="text-[12px] text-black/50 ml-2">{p.phase}</span>
                    {(spvTasks.length > 0 || spvTok.length > 0) && (
                      <span className="text-[11px] text-amber-600 ml-3">{spvTasks.length} zadataka | {spvTok.length} zahtjeva</span>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[p.status] || "bg-gray-100 text-gray-600"}`}>{p.statusLabel}</span>
                </div>
              );
            })}
            {spvs.length === 0 && <div className="px-5 py-8 text-center text-black/40">Nema dodijeljenih projekata</div>}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
