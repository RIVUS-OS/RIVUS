"use client";

import { useParams } from "next/navigation";
import { useSpvById, useIssuedInvoices, useReceivedInvoices, formatEur } from "@/lib/data-client";

const statusColors: Record<string, string> = { "plaćen": "bg-green-100 text-green-700", "čeka": "bg-amber-100 text-amber-700", "kasni": "bg-red-100 text-red-700", "storniran": "bg-gray-100 text-gray-500" };

export default function BankSpvFinancijePage() {
  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: issued } = useIssuedInvoices(id as string);
  const { data: received } = useReceivedInvoices(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const totalIssued = issued.reduce((s, i) => s + i.totalAmount, 0);
  const totalReceived = received.reduce((s, i) => s + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Financije</h1><p className="text-[13px] text-black/50 mt-0.5">{spv.name}</p></div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-lg font-bold text-green-600">{formatEur(totalIssued)}</div><div className="text-[12px] text-black/50">Izdano</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-lg font-bold text-amber-600">{formatEur(totalReceived)}</div><div className="text-[12px] text-black/50">Primljeno</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-lg font-bold text-blue-600">{formatEur(spv.totalBudget)}</div><div className="text-[12px] text-black/50">Budzet</div></div>
      </div>
      {issued.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Izdani ({issued.length})</div>
          <table className="w-full text-[12px]"><tbody>{issued.map(inv => (
            <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2 font-bold">{inv.number}</td>
              <td className="px-3 py-2 text-black/70">{inv.date}</td>
              <td className="px-3 py-2 text-right font-bold">{formatEur(inv.totalAmount)}</td>
              <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[inv.status] || "bg-gray-100"}`}>{inv.status}</span></td>
            </tr>
          ))}</tbody></table>
        </div>
      )}
    </div>
  );
}
