"use client";

import { useParams } from "next/navigation";
import { useSpvById, useIssuedInvoices, useReceivedInvoices, formatEur } from "@/lib/data-client";

const statusLabels: Record<string, string> = { "plaćen": "Placen", "čeka": "Ceka", "kasni": "Kasni", "storniran": "Storniran" };
const statusColors: Record<string, string> = { "plaćen": "bg-green-100 text-green-700", "čeka": "bg-amber-100 text-amber-700", "kasni": "bg-red-100 text-red-700", "storniran": "bg-gray-100 text-gray-500" };

export default function OwnerSpvRacuniPage() {
  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: issued } = useIssuedInvoices(id as string);
  const { data: received } = useReceivedInvoices(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Racuni</h1><p className="text-[13px] text-black/50 mt-0.5">{issued.length} izdanih | {received.length} primljenih</p></div>
      {issued.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Izdani ({issued.length})</div>
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
                <td className="px-3 py-2 font-bold">{inv.number}</td>
                <td className="px-3 py-2 text-black/70">{inv.date}</td>
                <td className="px-3 py-2 text-black/70 truncate max-w-[200px]">{inv.description}</td>
                <td className="px-3 py-2 text-right font-bold">{formatEur(inv.totalAmount)}</td>
                <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[inv.status] || "bg-gray-100"}`}>{statusLabels[inv.status] || inv.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {received.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Primljeni ({received.length})</div>
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2 font-semibold text-black/70">Broj</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Dobavljac</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Opis</th>
              <th className="text-right px-3 py-2 font-semibold text-black/70">Iznos</th>
              <th className="text-center px-3 py-2 font-semibold text-black/70">Status</th>
            </tr></thead>
            <tbody>{received.map(inv => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2 font-bold">{inv.number}</td>
                <td className="px-3 py-2 text-black/70">{inv.client}</td>
                <td className="px-3 py-2 text-black/70 truncate max-w-[200px]">{inv.description}</td>
                <td className="px-3 py-2 text-right font-bold">{formatEur(inv.totalAmount)}</td>
                <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[inv.status] || "bg-gray-100"}`}>{statusLabels[inv.status] || inv.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
