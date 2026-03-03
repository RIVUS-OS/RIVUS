"use client";

import { useParams, useRouter } from "next/navigation";
import { useSpvById, useIssuedInvoices, useReceivedInvoices, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// P19 Hooks
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function SpvRacuniPage() {
  const { id } = useParams();
  const router = useRouter();
  const spvId = id as string;

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('invoice_write');
  const writeDisabled = isSafe || isLockdown || isForensic || role === 'Core';

  const { data: spv } = useSpvById(spvId);
  const { data: issued } = useIssuedInvoices(spvId);
  const { data: received } = useReceivedInvoices(spvId);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({
        action: 'SPV_INVOICES_VIEW',
        entity_type: 'invoice',
        spv_id: spvId,
        details: { context: 'control_room', sub: 'racuni' },
      });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
          <p className="text-sm text-gray-500 mt-1">Nemate dozvolu za pregled racuna.</p>
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

  const statusLabels: Record<string, string> = {
    draft: "Nacrt", sent: "Poslan", placen: "Placen", overdue: "Dospjeo", storniran: "Storniran",
    ceka: "Ceka", kasni: "Kasni",
  };
  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    sent: "bg-blue-100 text-blue-700",
    placen: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    storniran: "bg-gray-100 text-gray-500",
    ceka: "bg-amber-100 text-amber-700",
    kasni: "bg-red-100 text-red-700",
  };

  const tabs = [
    { label: "Pregled", href: `/dashboard/core/spv/${spvId}/financije` },
    { label: "Rashodi", href: `/dashboard/core/spv/${spvId}/financije/rashodi` },
    { label: "Prihodi", href: `/dashboard/core/spv/${spvId}/financije/prihodi` },
    { label: "Racuni", href: `/dashboard/core/spv/${spvId}/financije/racuni`, active: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Racuni</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{spv?.name} | {issued.length} izdanih | {received.length} primljenih</p>
      </div>

      {role === 'Core' && (
        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
          CORE pogled — samo citanje. Izdavanje racuna dostupno je kroz Owner Cockpit ili Accounting pristup.
        </div>
      )}

      <div className="flex gap-1 border-b border-gray-200 pb-0">
        {tabs.map(tab => (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={`px-3 py-2 text-[13px] font-medium border-b-2 transition-colors ${
              tab.active
                ? "border-[#007AFF] text-[#007AFF]"
                : "border-transparent text-black/50 hover:text-black hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Izdani */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold text-black">
          Izdani racuni ({issued.length})
        </div>
        {issued.length > 0 ? (
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
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[inv.status] || "bg-gray-100"}`}>
                    {statusLabels[inv.status] || inv.status}
                  </span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-black/30 text-[13px]">Nema izdanih racuna.</div>
        )}
      </div>

      {/* Primljeni */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold text-black">
          Primljeni racuni ({received.length})
        </div>
        {received.length > 0 ? (
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2 font-semibold text-black/70">Broj</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Dobavljac</th>
              <th className="text-right px-3 py-2 font-semibold text-black/70">Iznos</th>
              <th className="text-center px-3 py-2 font-semibold text-black/70">Status</th>
            </tr></thead>
            <tbody>{received.map(inv => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2 font-bold text-black">{inv.number}</td>
                <td className="px-3 py-2 text-black/70">{inv.date}</td>
                <td className="px-3 py-2 text-black/70">{(inv as any).vendor || inv.description}</td>
                <td className="px-3 py-2 text-right font-bold">{formatEur(inv.totalAmount)}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[inv.status] || "bg-gray-100"}`}>
                    {statusLabels[inv.status] || inv.status}
                  </span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-black/30 text-[13px]">Nema primljenih racuna.</div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}

