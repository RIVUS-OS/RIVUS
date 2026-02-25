"use client";

import { useParams } from "next/navigation";
import { useSpvById, useIssuedInvoices, useReceivedInvoices, useDocuments, useActivityLog, formatEur } from "@/lib/data-client";

export default function AccountingSpvPage() {
  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: issued } = useIssuedInvoices(id as string);
  const { data: received } = useReceivedInvoices(id as string);
  const { data: docs } = useDocuments(id as string);
  const { data: _raw_activity } = useActivityLog(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const activity = _raw_activity.filter(a => a.category === "billing" || a.category === "document");
  const unpaid = issued.filter(i => { const s = i.status as string; return s !== "placen" && s !== "storniran"; });

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Pregled</h1><p className="text-[13px] text-black/50 mt-0.5">{spv.name} | {spv.phase}</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Izdani racuni", value: issued.length, color: "text-blue-600" },
          { label: "Nenaplaceno", value: formatEur(unpaid.reduce((s, i) => s + i.totalAmount, 0)), color: unpaid.length > 0 ? "text-red-600" : "text-green-600" },
          { label: "Primljeni", value: received.length, color: "text-amber-600" },
          { label: "Dokumenti", value: docs.length, color: "text-blue-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-[14px] font-bold text-black mb-3">Zadnje financijske aktivnosti</h3>
        {activity.length > 0 ? activity.slice(0, 8).map(a => (
          <div key={a.id} className="flex items-start gap-2 text-[12px] mb-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-green-400 flex-shrink-0" />
            <div><div className="text-black font-medium">{a.action}</div><div className="text-black/40 text-[11px]">{a.actor} | {a.timestamp}</div></div>
          </div>
        )) : <div className="text-[12px] text-black/30">Nema aktivnosti</div>}
      </div>
    </div>
  );
}
