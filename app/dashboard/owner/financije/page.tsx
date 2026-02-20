"use client";

import { SPVS, getIssuedBySpv, getReceivedBySpv, formatEur } from "@/lib/mock-data";

export default function OwnerFinancijePage() {
  const data = SPVS.map(p => {
    const issued = getIssuedBySpv(p.id);
    const received = getReceivedBySpv(p.id);
    const totalIssued = issued.reduce((s, i) => s + i.totalAmount, 0);
    const unpaid = issued.filter(i => { const s = i.status as string; return s !== "plaćen" && s !== "storniran"; }).reduce((s, i) => s + i.totalAmount, 0);
    const totalReceived = received.reduce((s, i) => s + i.totalAmount, 0);
    return { ...p, totalIssued, unpaid, totalReceived, invoiceCount: issued.length };
  });
  const grandIssued = data.reduce((s, d) => s + d.totalIssued, 0);
  const grandUnpaid = data.reduce((s, d) => s + d.unpaid, 0);
  const grandReceived = data.reduce((s, d) => s + d.totalReceived, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Financije</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Pregled financija svih SPV-ova</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Ukupno izdano", value: formatEur(grandIssued), color: "text-blue-600" },
          { label: "Nenaplaceno", value: formatEur(grandUnpaid), color: grandUnpaid > 0 ? "text-red-600" : "text-green-600" },
          { label: "Primljeni racuni", value: formatEur(grandReceived), color: "text-amber-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Budzet</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Izdano</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Nenaplaceno</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Primljeno</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Proc. profit</th>
          </tr></thead>
          <tbody>{data.map(d => (
            <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-bold text-black">{d.id}</td>
              <td className="px-3 py-2.5 text-black/70">{d.name}</td>
              <td className="px-3 py-2.5 text-right">{formatEur(d.totalBudget)}</td>
              <td className="px-3 py-2.5 text-right text-green-600">{formatEur(d.totalIssued)}</td>
              <td className="px-3 py-2.5 text-right text-red-600">{d.unpaid > 0 ? formatEur(d.unpaid) : "-"}</td>
              <td className="px-3 py-2.5 text-right text-amber-600">{formatEur(d.totalReceived)}</td>
              <td className="px-3 py-2.5 text-right font-bold text-blue-600">{formatEur(d.estimatedProfit)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
