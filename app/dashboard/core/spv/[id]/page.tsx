"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { exportSpvZip } from "@/lib/export-spv";
import { LifecycleStepper } from "@/components/LifecycleStepper";
import { LifecycleChanger } from "@/components/enforcement/LifecycleChanger";
import { useSpvById, useIssuedInvoices, useReceivedInvoices, useTasks, useDocuments, useDecisions, useTokRequests, useActivityLog, useAccountantBySpv, useVerticalsBySpv, useMissingDocs, formatEur } from "@/lib/data-client";

export default function SpvCommandPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: spv } = useSpvById(id);

  const { data: issued } = useIssuedInvoices(id);
  const { data: received } = useReceivedInvoices(id);
  const { data: tasks } = useTasks(id);
  const { data: docs } = useDocuments(id);
  const { data: decisions } = useDecisions(id);
  const { data: tokRequests } = useTokRequests(id);
  const { data: activity } = useActivityLog(id);
  const { data: accountant } = useAccountantBySpv(id);
  const { data: verticals } = useVerticalsBySpv(id);
  const { data: _raw_missingDocs } = useMissingDocs();
  const missingDocs = _raw_missingDocs.filter(d => d.spvId === id);

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

  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    setExporting(true);
    try {
      await exportSpvZip({
        spv: spv as unknown as Record<string, unknown>,
        issued: issued as unknown as Record<string, unknown>[],
        received: received as unknown as Record<string, unknown>[],
        tasks: tasks as unknown as Record<string, unknown>[],
        documents: docs as unknown as Record<string, unknown>[],
        decisions: decisions as unknown as Record<string, unknown>[],
        tokRequests: tokRequests as unknown as Record<string, unknown>[],
        activity: activity as unknown as Record<string, unknown>[],
        verticals: verticals as unknown as Record<string, unknown>[],
        accountant: accountant as unknown as Record<string, unknown> | null,
        missingDocs: missingDocs as unknown as Record<string, unknown>[],
      });
    } catch (e) { console.error("Export failed", e); }
    setExporting(false);
  };

  if (!spv) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[14px] text-black/40">Ucitavanje SPV...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {spv.status === "blokiran" && spv.blockReason && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="text-[14px] font-bold text-red-700">SPV BLOKIRAN</div>
          <div className="text-[13px] text-red-600 mt-1">{spv.blockReason}</div>
        </div>
      )}

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

      {/* LIFECYCLE CONTROL */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <LifecycleStepper currentStage={spv.lifecycle_stage || ""} compact className="mb-3" />
            <div className="text-[11px] text-black/40 mb-1">Lifecycle faza</div>
            <div className="text-[14px] font-bold text-black">{spv.lifecycle_stage || "N/A"}</div>
          </div>
          <LifecycleChanger spvId={id} currentStage={spv.lifecycle_stage || ""} />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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


