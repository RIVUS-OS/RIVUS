"use client";

import { useParams, useRouter } from "next/navigation";
import { useSpvById, useIssuedInvoices, useReceivedInvoices, useTransactions, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// P19 Hooks
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function SpvFinancijePage() {
  const { id } = useParams();
  const router = useRouter();
  const spvId = id as string;

  // P19: Platform mode + permission
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('finance_read');

  const { data: spv } = useSpvById(spvId);
  const { data: issued } = useIssuedInvoices(spvId);
  const { data: received } = useReceivedInvoices(spvId);
  const { data: transactions } = useTransactions(spvId);

  // P19: Audit log
  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({
        action: 'SPV_FINANCE_VIEW',
        entity_type: 'finance',
        spv_id: spvId,
        details: { context: 'control_room', sub: 'overview' },
      });
    }
  }, [permLoading, allowed, spvId]);

  // P19: Permission denied
  if (!permLoading && !allowed) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
          <p className="text-sm text-gray-500 mt-1">Nemate dozvolu za pregled financija.</p>
        </div>
      </div>
    );
  }

  if (modeLoading || permLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  const totalIssued = issued.reduce((s, i) => s + i.totalAmount, 0);
  const totalReceived = received.reduce((s, i) => s + i.totalAmount, 0);
  const unpaid = issued.filter(i => i.status !== "placen" && i.status !== "storniran");

  const statusLabels: Record<string, string> = { "placen": "Placen", "ceka": "Ceka", "kasni": "Kasni", "storniran": "Storniran" };
  const statusColors: Record<string, string> = { "placen": "bg-green-100 text-green-700", "ceka": "bg-amber-100 text-amber-700", "kasni": "bg-red-100 text-red-700", "storniran": "bg-gray-100 text-gray-500" };

  // Sub-navigation tabs
  const tabs = [
    { label: "Pregled", href: `/dashboard/core/spv/${spvId}/financije`, exact: true },
    { label: "Rashodi", href: `/dashboard/core/spv/${spvId}/financije/rashodi` },
    { label: "Prihodi", href: `/dashboard/core/spv/${spvId}/financije/prihodi` },
    { label: "Racuni", href: `/dashboard/core/spv/${spvId}/financije/racuni` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Financije</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{spv.name} | {issued.length} izdanih | {received.length} primljenih | {transactions.length} transakcija</p>
      </div>

      {/* P19: CORE read-only notice */}
      {role === 'Core' && (
        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
          CORE pogled — samo citanje. Financijski unos dostupan je kroz Owner Cockpit ili Accounting pristup.
        </div>
      )}

      {/* Sub-navigation */}
      <div className="flex gap-1 border-b border-gray-200 pb-0">
        {tabs.map(tab => {
          const isActive = tab.exact
            ? typeof window !== 'undefined' && window.location.pathname === tab.href
            : false;
          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className={`px-3 py-2 text-[13px] font-medium border-b-2 transition-colors ${
                tab.exact
                  ? "border-[#007AFF] text-[#007AFF]"
                  : "border-transparent text-black/50 hover:text-black hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Izdani racuni", value: formatEur(totalIssued), color: "text-green-600" },
          { label: "Nenaplaceno", value: formatEur(unpaid.reduce((s, i) => s + i.totalAmount, 0)), color: unpaid.length > 0 ? "text-red-600" : "text-green-600" },
          { label: "Primljeni racuni", value: formatEur(totalReceived), color: "text-amber-600" },
          { label: "Transakcije", value: transactions.length, color: "text-blue-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Issued invoices */}
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

      {/* Transactions */}
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

      {/* P19: Disclaimer */}
      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
