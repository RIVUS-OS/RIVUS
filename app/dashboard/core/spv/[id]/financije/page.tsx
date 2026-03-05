"use client";

/**
 * RIVUS OS — P24: SPV Financije Overview (CORE Read-Only)
 * PAGE-SPEC v3.0 §4.1 — /dashboard/core/spv/[id]/financije
 * CORE Admin (read-only), Owner (CRUD), Accounting (CRUD)
 */

import { useParams, useRouter } from "next/navigation";
import { useSpvById, useIssuedInvoices, useReceivedInvoices, useTransactions, formatEur } from "@/lib/data-client";
import { useEffect } from "react";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
// Period lock: TODO integrate when PeriodLock has spvId

import { PageHeader, StatusNotice, LoadingSkeleton } from "@/components/ui/rivus";

const statusLabels: Record<string, string> = { placen: "Placen", ceka: "Ceka", kasni: "Kasni", storniran: "Storniran" };
const statusColors: Record<string, string> = { placen: "bg-green-100 text-green-700", ceka: "bg-amber-100 text-amber-700", kasni: "bg-red-100 text-red-700", storniran: "bg-gray-100 text-gray-500" };

const finTabs = [
  { label: "Pregled", sub: "" },
  { label: "Rashodi", sub: "/rashodi" },
  { label: "Prihodi", sub: "/prihodi" },
  { label: "Racuni", sub: "/racuni" },
];

export default function SpvFinancijePage() {
  const { id } = useParams();
  const router = useRouter();
  const spvId = id as string;

  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission("finance_read");

  const { data: spv, loading: spvLoading } = useSpvById(spvId);
  const { data: issued } = useIssuedInvoices(spvId);
  const { data: received } = useReceivedInvoices(spvId);
  const { data: transactions } = useTransactions(spvId);
  

  const currentLock = null; // TODO: PeriodLock needs spvId field

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: "SPV_FINANCE_VIEW", entity_type: "finance", spv_id: spvId, details: { context: "control_room", sub: "overview" } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) return <StatusNotice type="denied" message="Nemate dozvolu za pregled financija." />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || spvLoading) return <LoadingSkeleton type="page" />;
  if (!spv) return <StatusNotice type="denied" message="SPV nije pronadjen." />;

  const totalIssued = issued.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const totalReceived = received.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const unpaid = issued.filter(i => i.status !== "placen" && i.status !== "storniran");
  const netResult = totalIssued - totalReceived;

  const basePath = `/dashboard/core/spv/${spvId}/financije`;

  return (
    <div className="space-y-6">
      {isSafe && <StatusNotice type="safe" />}

      {role === "Core" && (
        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
          CORE pogled — samo citanje. Financijski unos dostupan je kroz Owner Cockpit ili Accounting pristup.
        </div>
      )}

      <div className="flex items-start justify-between">
        <PageHeader
          title="Financije"
          subtitle={`${spv.name} | ${issued.length} izdanih | ${received.length} primljenih`}
        />
        {currentLock && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[11px] font-medium text-amber-700">Period zaključan</span>
          </div>
        )}
      </div>

      {/* Finance sub-tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-0 min-w-max">
          {finTabs.map((tab) => {
            const href = basePath + tab.sub;
            const isActive = tab.sub === "";
            return (
              <button key={tab.sub} onClick={() => router.push(href)}
                className={`px-4 py-2.5 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive ? "border-blue-600 text-blue-600" : "border-transparent text-black/50 hover:text-black/70 hover:border-gray-300"
                }`}>{tab.label}</button>
            );
          })}
        </nav>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Izdani racuni", value: formatEur(totalIssued), color: "text-green-600" },
          { label: "Nenaplaceno", value: formatEur(unpaid.reduce((s, i) => s + (i.totalAmount || 0), 0)), color: unpaid.length > 0 ? "text-red-600" : "text-green-600" },
          { label: "Primljeni racuni", value: formatEur(totalReceived), color: "text-amber-600" },
          { label: "Neto rezultat", value: formatEur(netResult), color: netResult >= 0 ? "text-green-600" : "text-red-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`text-[20px] font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Issued invoices table */}
      {issued.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold text-black">Izdani racuni ({issued.length})</div>
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2 font-semibold text-black/70">Broj</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Opis</th>
              <th className="text-right px-3 py-2 font-semibold text-black/70">Iznos</th>
              <th className="text-center px-3 py-2 font-semibold text-black/70">Status</th>
            </tr></thead>
            <tbody>{issued.map(inv => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2 font-bold text-black">{inv.number}</td>
                <td className="px-3 py-2 text-black/70">{inv.date}</td>
                <td className="px-3 py-2 text-black/70 truncate max-w-[200px]">{inv.description}</td>
                <td className="px-3 py-2 text-right font-bold">{formatEur(inv.totalAmount)}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[inv.status] || "bg-gray-100"}`}>{statusLabels[inv.status] || inv.status}</span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* Transactions table */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold text-black">Transakcije ({transactions.length})</div>
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Opis</th>
              <th className="text-right px-3 py-2 font-semibold text-green-700">Uplata</th>
              <th className="text-right px-3 py-2 font-semibold text-red-700">Isplata</th>
            </tr></thead>
            <tbody>{transactions.map(tx => (
              <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2 text-black/70">{tx.date}</td>
                <td className="px-3 py-2 text-black">{tx.description}</td>
                <td className="px-3 py-2 text-right text-green-600 font-medium">{tx.credit > 0 ? formatEur(tx.credit) : ""}</td>
                <td className="px-3 py-2 text-right text-red-600 font-medium">{tx.debit > 0 ? formatEur(tx.debit) : ""}</td>
              </tr>
            ))}</tbody>
          </table>
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
