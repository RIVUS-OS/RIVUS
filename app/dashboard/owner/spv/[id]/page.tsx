"use client";

import { useParams, useRouter } from "next/navigation";
import { getSpvById, getIssuedBySpv, getTasksBySpv, getDocsBySpv, getDecisionsBySpv, getTokBySpv, getActivityBySpv, getAccountantBySpv, getVerticalsBySpv, getMissingDocs, formatEur } from "@/lib/mock-data";

export default function OwnerSpvPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const spv = getSpvById(id);
  if (!spv) return <div className="p-8 text-center"><h1 className="text-[18px] font-bold text-red-600">SPV nije pronadjen: {id}</h1></div>;
  const issued = getIssuedBySpv(id);
  const tasks = getTasksBySpv(id);
  const docs = getDocsBySpv(id);
  const decisions = getDecisionsBySpv(id);
  const tokRequests = getTokBySpv(id);
  const activity = getActivityBySpv(id);
  const accountant = getAccountantBySpv(id);
  const verticals = getVerticalsBySpv(id);
  const missingDocs = getMissingDocs().filter(d => d.spvId === id);
  const unpaidIssued = issued.filter(i => { const s = i.status as string; return s !== "placen" && s !== "storniran"; });
  const openTasks = tasks.filter(t => (t.status as string) !== "zavrsen");
  const pendingDecisions = decisions.filter(d => (d.status as string) === "na_cekanju");
  const openTok = tokRequests.filter(t => t.status === "otvoren" || t.status === "u_tijeku" || t.status === "eskaliran");
  const st: Record<string, { bg: string; text: string; label: string }> = {
    aktivan: { bg: "bg-green-100", text: "text-green-700", label: "Aktivan" },
    blokiran: { bg: "bg-red-100", text: "text-red-700", label: "Blokiran" },
    u_izradi: { bg: "bg-blue-100", text: "text-blue-700", label: "U izradi" },
  };
  const s = st[spv.status] || { bg: "bg-gray-100", text: "text-gray-600", label: spv.status };
  const base = "/dashboard/owner/spv/" + id;
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[22px] font-bold text-black">{spv.id}</h1>
            <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${s.bg} ${s.text}`}>{s.label}</span>
            <span className="text-[12px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{spv.phase}</span>
          </div>
          <h2 className="text-[16px] text-black/70">{spv.name}</h2>
          <p className="text-[13px] text-black/50 mt-0.5">{spv.description}</p>
        </div>
        <div className="text-right text-[12px] text-black/50">
          <div>{spv.sectorLabel} | {spv.city}</div>
          <div>Budzet: {formatEur(spv.totalBudget)} | Profit: {formatEur(spv.estimatedProfit)}</div>
        </div>
      </div>
      {spv.status === "blokiran" && spv.blockReason && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="text-[14px] font-bold text-red-700">PROJEKT BLOKIRAN</div>
          <div className="text-[13px] text-red-600 mt-1">{spv.blockReason}</div>
        </div>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: "Racuni", value: issued.length, sub: formatEur(issued.reduce((s, i) => s + i.totalAmount, 0)), alert: false },
          { label: "Nenaplaceno", value: unpaidIssued.length, sub: formatEur(unpaidIssued.reduce((s, i) => s + i.totalAmount, 0)), alert: unpaidIssued.length > 0 },
          { label: "Zadaci", value: openTasks.length + "/" + tasks.length, sub: "otvorenih", alert: false },
          { label: "Dokumenti", value: docs.length, sub: missingDocs.length > 0 ? missingDocs.length + " nedostaje" : "OK", alert: missingDocs.length > 0 },
          { label: "Odluke", value: pendingDecisions.length, sub: "na cekanju", alert: false },
          { label: "TOK", value: openTok.length, sub: "otvorenih", alert: openTok.some(t => t.slaBreached) },
        ].map(k => (
          <div key={k.label} className={`bg-white rounded-xl border p-3 text-center ${k.alert ? "border-red-200" : "border-gray-200"}`}>
            <div className={`text-lg font-bold ${k.alert ? "text-red-600" : "text-black"}`}>{k.value}</div>
            <div className="text-[11px] text-black/50">{k.label}</div>
            <div className={`text-[10px] mt-0.5 ${k.alert ? "text-red-500" : "text-black/30"}`}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {missingDocs.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-red-200 p-5">
              <h3 className="text-[14px] font-bold text-red-700 mb-2">Nedostajuci dokumenti ({missingDocs.length})</h3>
              {missingDocs.map(d => <div key={d.id} className="text-[12px] p-2 rounded-lg bg-red-50 mb-1 text-red-600">{d.name}</div>)}
            </div>
          )}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[14px] font-bold text-black mb-3">Vertikale ({verticals.length})</h3>
            {verticals.length > 0 ? verticals.map(v => (
              <div key={v.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 mb-1 text-[12px]">
                <span className="font-semibold text-black">{v.name} <span className="text-black/40">{v.type}</span></span>
                <span className="text-blue-600 font-medium">{v.commission}%</span>
              </div>
            )) : <div className="text-[12px] text-black/30">Nema vertikala</div>}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[14px] font-bold text-black mb-3">Otvoreni zadaci ({openTasks.length})</h3>
            {openTasks.length > 0 ? openTasks.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 mb-1 text-[12px]">
                <span className="text-black font-medium truncate flex-1">{t.title}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.status === "blokiran" || t.status === "eskaliran" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{t.status}</span>
              </div>
            )) : <div className="text-[12px] text-green-600">Sve zavrseno</div>}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[14px] font-bold text-black mb-3">Zadnje aktivnosti</h3>
            {activity.length > 0 ? activity.slice(0, 6).map(a => (
              <div key={a.id} className="flex items-start gap-2 text-[12px] mb-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-400 flex-shrink-0" />
                <div><div className="text-black font-medium">{a.action}</div><div className="text-black/40 text-[11px]">{a.actor} | {a.timestamp}</div></div>
              </div>
            )) : <div className="text-[12px] text-black/30">Nema aktivnosti</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
