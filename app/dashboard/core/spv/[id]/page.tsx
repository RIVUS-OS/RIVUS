"use client";

/**
 * RIVUS OS — P23: SPV Detail (Control Room)
 * PAGE-SPEC v3.0 §3.3 — /dashboard/core/spv/[id]
 *
 * CORE Admin (read + lifecycle), CORE Viewer (read-only)
 * CORE NE SMIJE: mijenjati financije, uploadati dokumente, zatvarati taskove (D-001)
 * Safe Mode: read-only, sve akcije disabled
 * Lockdown: redirect
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { exportSpvZip } from "@/lib/export-spv";
import { LifecycleStepper } from "@/components/LifecycleStepper";
import { LifecycleChanger } from "@/components/enforcement/LifecycleChanger";

import {
  useSpvById, useIssuedInvoices, useReceivedInvoices, useTasks,
  useDocuments, useDecisions, useTokRequests, useActivityLog,
  useAccountantBySpv, useVerticalsBySpv, useMissingDocs, formatEur,
} from "@/lib/data-client";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { useEnforcement } from "@/lib/hooks/useEnforcement";
import { logAudit } from "@/lib/hooks/logAudit";

import { PageHeader, StatusNotice, LoadingSkeleton } from "@/components/ui/rivus";
import SpvTabNavigation from "@/components/core/p23/SpvTabNavigation";

export default function SpvDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed: canRead, loading: permLoading, role } = usePermission("spv_detail_read");

  const writeDisabled = isSafe || isLockdown || isForensic;

  const { data: spv, loading: spvLoading } = useSpvById(id);
  const { data: issued } = useIssuedInvoices(id);
  const { data: received } = useReceivedInvoices(id);
  const { data: tasks } = useTasks(id);
  const { data: docs } = useDocuments(id);
  const { data: decisions } = useDecisions(id);
  const { data: tokRequests } = useTokRequests(id);
  const { data: activity } = useActivityLog(id, 8);
  const { data: accountant } = useAccountantBySpv(id);
  const { data: verticals } = useVerticalsBySpv(id);
  const { data: _raw_missingDocs } = useMissingDocs();
  const missingDocs = _raw_missingDocs.filter(d => d.spvId === id);

  useEffect(() => {
    if (!permLoading && canRead && id) {
      logAudit({
        action: "SPV_DETAIL_VIEW",
        entity_type: "spv",
        entity_id: id,
        spv_id: id,
        details: { context: "control_room" },
      });
    }
  }, [permLoading, canRead, id]);

  // Computed
  const unpaidIssued = issued.filter(i => i.status !== "placen" && i.status !== "storniran");
  const openTasks = tasks.filter(t => t.status !== "zavrsen");
  const pendingDecisions = decisions.filter(d => d.status === "na_cekanju");
  const openTok = tokRequests.filter(t => t.status === "otvoren" || t.status === "u_tijeku" || t.status === "eskaliran");

  const totalRevenue = issued.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const totalExpenses = received.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const netResult = totalRevenue - totalExpenses;

  // Export
  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    setExporting(true);
    try {
      await logAudit({
        action: "SPV_EXPORT",
        entity_type: "spv",
        entity_id: id,
        spv_id: id,
        details: { context: "control_room", export_type: "zip" },
      });
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

  // Guards
  if (!permLoading && !canRead) return <StatusNotice type="denied" message="Nemate dozvolu za pregled ovog SPV-a." />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || spvLoading) return <LoadingSkeleton type="page" />;
  if (!spv) return <StatusNotice type="denied" message="SPV nije pronadjen." />;

  // KPI items
  const kpiItems = [
    { label: "Prihodi", value: formatEur(totalRevenue), tone: "green" as const },
    { label: "Rashodi", value: formatEur(totalExpenses), tone: "red" as const },
    { label: "Neto", value: formatEur(netResult), tone: netResult >= 0 ? "green" as const : "red" as const },
    { label: "Dokumenti", value: String(docs.length), tone: missingDocs.length > 0 ? "amber" as const : "green" as const, sub: missingDocs.length > 0 ? missingDocs.length + " nedostaje" : "kompletno" },
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
      {/* Platform mode banners */}
      {isSafe && <StatusNotice type="safe" />}
      {isForensic && (
        <div className="px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-[12px] text-green-700">
          Forenzicki mod — sve akcije se bilježe.
        </div>
      )}

      {/* Blocked SPV alert */}
      {spv.status === "blokiran" && spv.blockReason && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="text-[14px] font-bold text-red-700">SPV BLOKIRAN</div>
          <div className="text-[13px] text-red-600 mt-1">{spv.blockReason}</div>
        </div>
      )}

      {/* D-001: CORE role separation notice */}
      {role === "Core" && (
        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
          CORE pogled — samo citanje. Financije, dokumenti i zadaci upravljaju se kroz Owner Cockpit.
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-bold text-black">{spv.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[spv.status] || "bg-gray-100"}`}>
              {spv.statusLabel}
            </span>
          </div>
          <p className="text-[13px] text-black/50 mt-0.5">
            {spv.code} | {spv.city} | {spv.phase} | OIB: {spv.oib || "\u2014"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-3 py-2 text-[12px] font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {exporting ? "Exportam..." : "Export ZIP"}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <SpvTabNavigation spvId={id} context="core" />

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiItems.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`text-[20px] font-bold ${k.tone === "green" ? "text-green-600" : k.tone === "red" ? "text-red-600" : k.tone === "amber" ? "text-amber-600" : "text-gray-700"}`}>
              {k.value}
            </div>
            <div className="text-[12px] text-black/70 font-medium mt-1">{k.label}</div>
            {k.sub && <div className="text-[11px] text-black/40 mt-0.5">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Lifecycle */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <LifecycleStepper currentStage={spv.lifecycle_stage || ""} compact className="mb-3" />
            <div className="text-[11px] text-black/40 mb-1">Lifecycle faza</div>
            <div className="text-[14px] font-bold text-black">{spv.lifecycle_stage || "N/A"}</div>
          </div>
          {!writeDisabled ? (
            <LifecycleChanger spvId={id} currentStage={spv.lifecycle_stage || ""} />
          ) : (
            <div className="px-3 py-1.5 rounded-lg bg-gray-100 text-[12px] text-gray-400 cursor-not-allowed">
              Promjena onemogucena
            </div>
          )}
        </div>
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Project details */}
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
                  <div className="font-medium text-black">{val || "\u2014"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vertikale */}
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

          {/* Knjigovodstvo */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[14px] font-bold text-black mb-3">Knjigovodstvo</h3>
            {accountant ? (
              <div className="text-[12px]">
                <div className="font-semibold text-black">{accountant.name}</div>
                <div className="text-black/50 mt-1">{accountant.contact} | {accountant.email}</div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[12px] text-red-700 font-medium">
                Nema dodijeljenog knjigovodje!
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Missing docs */}
          {missingDocs.length > 0 && (
            <div className="bg-white rounded-xl border-2 border-red-200 p-5">
              <h3 className="text-[14px] font-bold text-red-700 mb-2">Nedostajuci dokumenti ({missingDocs.length})</h3>
              {missingDocs.map(d => (
                <div key={d.id} className="text-[12px] p-2 rounded-lg bg-red-50 mb-1 text-red-600">{d.name}</div>
              ))}
            </div>
          )}

          {/* Open tasks */}
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

          {/* TOK */}
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

          {/* Activity */}
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

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
