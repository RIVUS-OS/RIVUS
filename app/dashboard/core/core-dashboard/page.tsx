"use client";
import { useRouter } from "next/navigation";
import { useSpvs, usePnlMonths, useIssuedInvoices, useReceivedInvoices, useTokRequests, useDecisions, usePendingDecisions, useOverdueInvoices, useMissingDocs, useBlockedSpvs, useActivityLog, useUnpaidInvoices, formatEur } from "@/lib/data-client";

export default function CoreDashboardPage() {
  const router = useRouter();
  const { data: spvs, loading } = useSpvs();
  const { data: pnl } = usePnlMonths();
  const { data: issued } = useIssuedInvoices();
  const { data: received } = useReceivedInvoices();
  const { data: tok } = useTokRequests();
  const { data: decisions } = useDecisions();
  const { data: pending } = usePendingDecisions();
  const { data: overdue } = useOverdueInvoices();
  const { data: missing } = useMissingDocs();
  const { data: blocked } = useBlockedSpvs();
  const { data: activity } = useActivityLog();
  const { data: unpaid } = useUnpaidInvoices();
  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const totalRev = pnl.reduce((s, m) => s + m.revenue, 0);
  const totalExp = pnl.reduce((s, m) => s + m.expenses, 0);
  const neto = totalRev - totalExp;
  const openTok = tok.filter(t => t.status === "otvoren" || t.status === "u_tijeku").length;
  const escalated = tok.filter(t => t.status === "eskaliran").length;
  const unpaidTotal = unpaid.reduce((s, i) => s + i.totalAmount, 0);
  const overdueTotal = overdue.reduce((s, i) => s + i.totalAmount, 0);
  const activeSpvs = spvs.filter(s => s.status === "aktivan").length;
  const recentActivity = activity.slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">RIVUS Operater — Pregled</h1>
          <p className="text-[13px] text-black/50 mt-0.5">Pregled svih SPV-ova i operativnog stanja sustava</p>
        </div>
        <div className="text-right text-[12px] text-black/40">
          <div>RIVUS CORE d.o.o.</div>
          <div>{new Date().toLocaleDateString("hr-HR")}</div>
        </div>
      </div>

      {/* ALERT BANNER */}
      {(blocked.length > 0 || escalated > 0 || overdue.length > 0) && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="text-[13px] font-bold text-red-700 mb-1">Potrebna pažnja</div>
          <div className="flex flex-wrap gap-4 text-[12px] text-red-600">
            {blocked.length > 0 && <span className="font-semibold">{blocked.length} blokiran SPV</span>}
            {escalated > 0 && <span className="font-semibold">{escalated} eskaliranih TOK</span>}
            {overdue.length > 0 && <span className="font-semibold">{overdue.length} dospjelih računa ({formatEur(overdueTotal)})</span>}
            {missing.length > 0 && <span className="font-semibold">{missing.length} mandatory dok. nedostaje</span>}
          </div>
        </div>
      )}

      {/* KPI ROW 1 - SPV STATUS */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/dashboard/core/spv-pipeline")}>
          <div className="text-2xl font-bold text-blue-600">{spvs.length}</div>
          <div className="text-[11px] text-black/50">Ukupno SPV</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{activeSpvs}</div>
          <div className="text-[11px] text-black/50">Aktivnih</div>
        </div>
        <div className={`rounded-xl border p-4 text-center ${blocked.length > 0 ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
          <div className={`text-2xl font-bold ${blocked.length > 0 ? "text-red-600" : "text-black/30"}`}>{blocked.length}</div>
          <div className="text-[11px] text-black/50">Blokiranih</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/dashboard/core/odobrenja")}>
          <div className={`text-2xl font-bold ${pending.length > 0 ? "text-amber-600" : "text-black/30"}`}>{pending.length}</div>
          <div className="text-[11px] text-black/50">Čeka odobrenje</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/dashboard/core/tok")}>
          <div className={`text-2xl font-bold ${openTok > 0 ? "text-amber-600" : "text-black/30"}`}>{openTok}</div>
          <div className="text-[11px] text-black/50">Otvoreni TOK</div>
        </div>
      </div>

      {/* KPI ROW 2 - FINANCIJE */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/dashboard/core/prihodi")}>
          <div className="text-xl font-bold text-green-600">{formatEur(totalRev)}</div>
          <div className="text-[11px] text-black/50">Prihodi</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/dashboard/core/rashodi")}>
          <div className="text-xl font-bold text-red-600">{formatEur(totalExp)}</div>
          <div className="text-[11px] text-black/50">Rashodi</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className={`text-xl font-bold ${neto >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(neto)}</div>
          <div className="text-[11px] text-black/50">Neto rezultat</div>
        </div>
        <div className={`rounded-xl border p-4 text-center cursor-pointer hover:shadow-md transition-shadow ${unpaid.length > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"}`} onClick={() => router.push("/dashboard/core/nenaplaceno")}>
          <div className={`text-xl font-bold ${unpaidTotal > 0 ? "text-amber-600" : "text-black/30"}`}>{formatEur(unpaidTotal)}</div>
          <div className="text-[11px] text-black/50">Nenaplaćeno</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* SPV LISTA */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-black">SPV projekti</h2>
            <button onClick={() => router.push("/dashboard/core/spv-pipeline")} className="text-[11px] text-blue-600 font-semibold hover:underline">Svi →</button>
          </div>
          <div className="space-y-2">
            {spvs.slice(0, 6).map(spv => {
              const spvOverdue = overdue.filter(i => i.spvId === spv.id).length;
              const spvMissing = missing.filter(d => d.spvId === spv.id).length;
              return (
                <div key={spv.id} onClick={() => router.push("/dashboard/core/spv/" + spv.id)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${spv.status === "aktivan" ? "bg-green-500" : spv.status === "blokiran" ? "bg-red-500" : "bg-gray-400"}`} />
                    <div>
                      <div className="text-[13px] font-semibold text-black">{spv.name}</div>
                      <div className="text-[11px] text-black/40">{spv.city} | {spv.phase}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {spvOverdue > 0 && <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-600 font-semibold">{spvOverdue} dospjelo</span>}
                    {spvMissing > 0 && <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-600 font-semibold">{spvMissing} doc fali</span>}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${spv.status === "aktivan" ? "bg-green-100 text-green-700" : spv.status === "blokiran" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                      {spv.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ZADNJA AKTIVNOST */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-black">Zadnje aktivnosti</h2>
            <button onClick={() => router.push("/dashboard/core/dnevnik")} className="text-[11px] text-blue-600 font-semibold hover:underline">Sve →</button>
          </div>
          {recentActivity.length === 0 ? (
            <div className="text-[12px] text-black/30 text-center py-4">Nema aktivnosti</div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="border-b border-gray-50 pb-2 last:border-0">
                  <div className="text-[12px] text-black">{a.action}</div>
                  <div className="text-[10px] text-black/30 mt-0.5">{a.spvId} | {a.timestamp ? new Date(a.timestamp).toLocaleDateString("hr-HR") : ""}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* COMPLIANCE FOOTER */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between text-[11px] text-black/40">
          <span>RIVUS OS v1.0 | {spvs.length} SPV | {decisions.length} odluka | {issued.length + received.length} računa | {activity.length} audit zapisa</span>
          <span>Svi podaci su informativnog karaktera. Mjerodavno je službeno knjigovodstvo.</span>
        </div>
      </div>
    </div>
  );
}