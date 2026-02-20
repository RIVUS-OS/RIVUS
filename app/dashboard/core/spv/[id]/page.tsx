"use client";

import { useParams, useRouter } from "next/navigation";
import {
  getSpvById, getIssuedBySpv, getReceivedBySpv, getTasksBySpv,
  getDocsBySpv, getDecisionsBySpv, getTokBySpv, getActivityBySpv,
  getAccountantBySpv, getVerticalsBySpv, getMissingDocs,
  formatEur,
} from "@/lib/mock-data";

export default function SpvCommandPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const spv = getSpvById(id);

  if (!spv) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-[18px] font-bold text-red-600">SPV nije pronadjen: {id}</h1>
        <button onClick={() => router.push("/dashboard/core/spv-pipeline")}
          className="mt-4 text-[13px] text-blue-600 underline">Nazad na pipeline</button>
      </div>
    );
  }

  const issued = getIssuedBySpv(id);
  const received = getReceivedBySpv(id);
  const tasks = getTasksBySpv(id);
  const docs = getDocsBySpv(id);
  const decisions = getDecisionsBySpv(id);
  const tokRequests = getTokBySpv(id);
  const activity = getActivityBySpv(id);
  const accountant = getAccountantBySpv(id);
  const verticals = getVerticalsBySpv(id);
  const missingDocs = getMissingDocs().filter(d => d.spvId === id);

  const unpaidIssued = issued.filter(i => {
    const s = i.status as string;
    return s !== "plaćen" && s !== "placen" && s !== "storniran";
  });
  const openTasks = tasks.filter(t => {
    const s = t.status as string;
    return s !== "zavrsen" && s !== "završen";
  });
  const pendingDecisions = decisions.filter(d => {
    const s = d.status as string;
    return s === "na_čekanju" || s === "na_cekanju";
  });
  const openTok = tokRequests.filter(t => t.status === "otvoren" || t.status === "u_tijeku" || t.status === "eskaliran");

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    aktivan: { bg: "bg-green-100", text: "text-green-700", label: "Aktivan" },
    blokiran: { bg: "bg-red-100", text: "text-red-700", label: "Blokiran" },
    u_izradi: { bg: "bg-blue-100", text: "text-blue-700", label: "U izradi" },
    na_cekanju: { bg: "bg-gray-100", text: "text-gray-600", label: "Na cekanju" },
    zavrsen: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Zavrsen" },
  };
  const st = statusConfig[spv.status] || statusConfig.na_cekanju;

  const base = "/dashboard/core/spv/" + id;
  const tabs = [
    { label: "Pregled", href: base, active: true },
    { label: "Financije", href: base + "/financije" },
    { label: "Dokumenti", href: base + "/dokumenti" },
    { label: "Zadaci", href: base + "/zadaci" },
    { label: "Vertikale", href: base + "/vertikale" },
    { label: "Banka", href: base + "/banka" },
    { label: "Knjigovodstvo", href: base + "/knjigovodstvo" },
    { label: "Odobrenja", href: base + "/odobrenja" },
    { label: "TOK", href: base + "/tok" },
    { label: "Mandatory", href: base + "/mandatory" },
    { label: "RIVUS Billing", href: base + "/rivus-billing" },
    { label: "Dnevnik", href: base + "/dnevnik" },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[22px] font-bold text-black">{spv.id}</h1>
            <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${st.bg} ${st.text}`}>{st.label}</span>
            <span className="text-[12px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{spv.phase}</span>
          </div>
          <h2 className="text-[16px] text-black/70">{spv.name}</h2>
          <p className="text-[13px] text-black/50 mt-0.5">{spv.description}</p>
        </div>
        <div className="text-right text-[12px] text-black/50">
          <div>{spv.sectorLabel} | {spv.city}</div>
          <div>OIB: {spv.oib} | Osnovan: {spv.founded}</div>
          <div>Budzet: {formatEur(spv.totalBudget)} | Proc. profit: {formatEur(spv.estimatedProfit)}</div>
        </div>
      </div>

      {/* BLOCK ALERT */}
      {spv.status === "blokiran" && spv.blockReason && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="text-[14px] font-bold text-red-700">SPV BLOKIRAN</div>
          <div className="text-[13px] text-red-600 mt-1">{spv.blockReason}</div>
        </div>
      )}

      {/* TAB NAV */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-0">
        {tabs.map(tab => (
          <button key={tab.href} onClick={() => router.push(tab.href)}
            className={`px-3 py-2 text-[12px] font-medium rounded-t-lg transition-colors ${
              tab.active ? "bg-white border border-b-white border-gray-200 text-black -mb-px" : "text-black/50 hover:text-black hover:bg-gray-50"
            }`}>{tab.label}</button>
        ))}
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: "Izdani racuni", value: issued.length, sub: formatEur(issued.reduce((s, i) => s + i.totalAmount, 0)), alert: false },
          { label: "Nenaplaceno", value: unpaidIssued.length, sub: formatEur(unpaidIssued.reduce((s, i) => s + i.totalAmount, 0)), alert: unpaidIssued.length > 0 },
          { label: "Zadaci", value: openTasks.length + "/" + tasks.length, sub: "otvorenih", alert: false },
          { label: "Dokumenti", value: docs.length, sub: missingDocs.length > 0 ? missingDocs.length + " nedostaje" : "kompletno", alert: missingDocs.length > 0 },
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

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[14px] font-bold text-black mb-3">Detalji projekta</h3>
            <div className="grid grid-cols-2 gap-y-2 text-[12px]">
              {[
                ["Naziv", spv.name], ["Sektor", spv.sectorLabel], ["Grad", spv.city],
                ["OIB", spv.oib], ["Osnovan", spv.founded], ["Faza", spv.phase],
                ["Budzet", formatEur(spv.totalBudget)], ["Proc. profit", formatEur(spv.estimatedProfit)],
              ].map(([label, val]) => (
                <div key={label as string}>
                  <div className="text-black/40">{label}</div>
                  <div className="font-medium text-black">{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[14px] font-bold text-black mb-3">Vertikale ({verticals.length})</h3>
            {verticals.length > 0 ? (
              <div className="space-y-2">
                {verticals.map(v => (
                  <div key={v.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-[12px]">
                    <div><span className="font-semibold text-black">{v.name}</span><span className="text-black/40 ml-2">{v.type}</span></div>
                    <span className="text-blue-600 font-medium">{v.commission}%</span>
                  </div>
                ))}
              </div>
            ) : <div className="text-[12px] text-black/30">Nema dodijeljenih vertikala</div>}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[14px] font-bold text-black mb-3">Knjigovodstvo</h3>
            {accountant ? (
              <div className="text-[12px]">
                <div className="font-semibold text-black">{accountant.name}</div>
                <div className="text-black/50 mt-1">{accountant.contact} | {accountant.email}</div>
                <div className="text-black/50">{formatEur(accountant.pricePerMonth)} / mjesec</div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[12px] text-red-700 font-medium">
                Nema dodijeljenog knjigovodje!
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          {missingDocs.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-red-200 p-5">
              <h3 className="text-[14px] font-bold text-red-700 mb-2">Nedostajuci dokumenti ({missingDocs.length})</h3>
              {missingDocs.map(d => (
                <div key={d.id} className="text-[12px] p-2 rounded-lg bg-red-50 mb-1 text-red-600">{d.name}</div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[14px] font-bold text-black mb-3">Otvoreni zadaci ({openTasks.length})</h3>
            {openTasks.length > 0 ? (
              <div className="space-y-1.5">
                {openTasks.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-[12px]">
                    <span className="text-black font-medium truncate flex-1">{t.title}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      t.status === "blokiran" || t.status === "eskaliran" ? "bg-red-100 text-red-700" :
                      t.priority === "critical" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    }`}>{t.status}</span>
                  </div>
                ))}
                {openTasks.length > 5 && <div className="text-[11px] text-black/30 text-center">+ {openTasks.length - 5} vise</div>}
              </div>
            ) : <div className="text-[12px] text-green-600">Svi zadaci zavrseni</div>}
          </div>

          {openTok.length > 0 && (
            <div className="bg-white rounded-xl border border-amber-200 p-5">
              <h3 className="text-[14px] font-bold text-amber-700 mb-3">Otvoreni TOK zahtjevi ({openTok.length})</h3>
              {openTok.map(t => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-50 mb-1 text-[12px]">
                  <span className="text-black font-medium truncate flex-1">{t.title}</span>
                  <div className="flex items-center gap-2 ml-2">
                    {t.slaBreached && <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-100 text-red-700 font-semibold">SLA</span>}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      t.status === "eskaliran" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[14px] font-bold text-black mb-3">Zadnje aktivnosti</h3>
            {activity.length > 0 ? (
              <div className="space-y-2">
                {activity.slice(0, 6).map(a => (
                  <div key={a.id} className="flex items-start gap-2 text-[12px]">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-400 flex-shrink-0" />
                    <div>
                      <div className="text-black font-medium">{a.action}</div>
                      <div className="text-black/40 text-[11px]">{a.actor} | {a.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="text-[12px] text-black/30">Nema aktivnosti</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
