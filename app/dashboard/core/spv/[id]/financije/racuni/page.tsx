"use client";

/**
 * RIVUS OS — P24: SPV Racuni (CORE Read-Only)
 * PAGE-SPEC v3.0 §4.4 — /dashboard/core/spv/[id]/financije/racuni
 * Storno only (D-006). Period Lock gate. eRacun status tracking (A10-K6).
 * Export + audit (A10-K7).
 */

import { useParams, useRouter } from "next/navigation";
import { useSpvById, useIssuedInvoices, useReceivedInvoices, formatEur } from "@/lib/data-client";
import { useEffect, useState } from "react";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

import { PageHeader, StatusNotice, LoadingSkeleton } from "@/components/ui/rivus";

const statusLabels: Record<string, string> = { placen: "Placen", ceka: "Ceka", kasni: "Kasni", storniran: "Storniran" };
const statusColors: Record<string, string> = { placen: "bg-green-100 text-green-700", ceka: "bg-amber-100 text-amber-700", kasni: "bg-red-100 text-red-700", storniran: "bg-gray-100 text-gray-500" };

const finTabs = [
  { label: "Pregled", sub: "" },
  { label: "Rashodi", sub: "/rashodi" },
  { label: "Prihodi", sub: "/prihodi" },
  { label: "Racuni", sub: "/racuni" },
];

export default function SpvRacuniPage() {
  const { id } = useParams();
  const router = useRouter();
  const spvId = id as string;

  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission("invoice_write");

  const { data: spv, loading: spvLoading } = useSpvById(spvId);
  const { data: issued, loading: issuedLoading } = useIssuedInvoices(spvId);
  const { data: received, loading: receivedLoading } = useReceivedInvoices(spvId);

  const [activeTab, setActiveTab] = useState<"izdani" | "primljeni">("izdani");

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: "SPV_INVOICES_VIEW", entity_type: "invoice", spv_id: spvId, details: { context: "control_room", sub: "racuni" } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) return <StatusNotice type="denied" message="Nemate dozvolu za pregled racuna." />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || spvLoading || issuedLoading || receivedLoading) return <LoadingSkeleton type="page" />;
  if (!spv) return <StatusNotice type="denied" message="SPV nije pronadjen." />;

  const totalIssued = issued.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const totalReceived = received.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const overdueIssued = issued.filter(i => i.status === "kasni");
  const stornoIssued = issued.filter(i => i.status === "storniran");
  const basePath = `/dashboard/core/spv/${spvId}/financije`;
  const activeInvoices = activeTab === "izdani" ? issued : received;

  return (
    <div className="space-y-6">
      {isSafe && <StatusNotice type="safe" />}
      {role === "Core" && (
        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
          CORE pogled — samo citanje. Izdavanje racuna dostupno je kroz Owner Cockpit ili Accounting pristup.
        </div>
      )}

      <PageHeader
        title="Racuni"
        subtitle={`${spv.name} | ${issued.length} izdanih | ${received.length} primljenih`}
      />

      {/* Finance sub-tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-0 min-w-max">
          {finTabs.map((tab) => (
            <button key={tab.sub} onClick={() => router.push(basePath + tab.sub)}
              className={`px-4 py-2.5 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab.sub === "/racuni" ? "border-blue-600 text-blue-600" : "border-transparent text-black/50 hover:text-black/70 hover:border-gray-300"
              }`}>{tab.label}</button>
          ))}
        </nav>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Izdani racuni", value: formatEur(totalIssued), sub: issued.length + " racuna", color: "text-green-600" },
          { label: "Primljeni racuni", value: formatEur(totalReceived), sub: received.length + " racuna", color: "text-amber-600" },
          { label: "Prekoraceni", value: String(overdueIssued.length), sub: overdueIssued.length > 0 ? "zahtijeva paznju" : "sve u roku", color: overdueIssued.length > 0 ? "text-red-600" : "text-green-600" },
          { label: "Stornirani", value: String(stornoIssued.length), sub: "D-006 storno only", color: "text-gray-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`text-[20px] font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50 mt-1">{k.label}</div>
            <div className="text-[11px] text-black/30 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Izdani / Primljeni toggle */}
      <div className="flex items-center gap-2">
        <button onClick={() => setActiveTab("izdani")}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${activeTab === "izdani" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-black/60 hover:bg-gray-50"}`}>
          Izdani ({issued.length})
        </button>
        <button onClick={() => setActiveTab("primljeni")}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${activeTab === "primljeni" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-black/60 hover:bg-gray-50"}`}>
          Primljeni ({received.length})
        </button>
      </div>

      {/* Invoice table */}
      {activeInvoices.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Broj</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">{activeTab === "izdani" ? "Primatelj" : "Izdavac"}</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Opis</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Neto</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">PDV</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Bruto</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            </tr></thead>
            <tbody>{activeInvoices.map(inv => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2.5 font-bold text-black">{inv.number}</td>
                <td className="px-3 py-2.5 text-black/70">{inv.date}</td>
                <td className="px-3 py-2.5 text-black font-medium">{inv.client || "-"}</td>
                <td className="px-3 py-2.5 text-black/70 truncate max-w-[150px]">{inv.description || "-"}</td>
                <td className="px-3 py-2.5 text-right">{formatEur(inv.netAmount || 0)}</td>
                <td className="px-3 py-2.5 text-right text-black/50">{formatEur(inv.vatAmount || 0)}</td>
                <td className="px-3 py-2.5 text-right font-bold">{formatEur(inv.totalAmount || 0)}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[inv.status] || "bg-gray-100"}`}>
                    {statusLabels[inv.status] || inv.status}
                  </span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-[14px] text-black/40">Nema {activeTab === "izdani" ? "izdanih" : "primljenih"} racuna.</p>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
