"use client";

import { useSpvs, useIssuedInvoices, formatEur } from "@/lib/data-client";;

export default function IzdaniPoSpvPage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const data = spvs.map(p => {
    const { data: inv } = useIssuedInvoices(p.id);
    const total = inv.reduce((s, i) => s + i.totalAmount, 0);
    const unpaid = inv.filter(i => { const st = i.status as string; return st !== "plaćen" && st !== "storniran"; }).reduce((s, i) => s + i.totalAmount, 0);
    return { id: p.id, name: p.name, count: inv.length, total, unpaid };
  }).filter(d => d.count > 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Izdani racuni - Po SPV</h1><p className="text-[13px] text-black/50 mt-0.5">{data.length} SPV-ova s racunima</p></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Racuna</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Ukupno</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Nenaplaceno</th>
          </tr></thead>
          <tbody>{data.map(d => (
            <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5"><span className="font-bold">{d.id}</span> <span className="text-black/50">{d.name}</span></td>
              <td className="px-3 py-2.5 text-right">{d.count}</td>
              <td className="px-3 py-2.5 text-right font-bold">{formatEur(d.total)}</td>
              <td className="px-3 py-2.5 text-right">{d.unpaid > 0 ? <span className="text-red-600 font-bold">{formatEur(d.unpaid)}</span> : <span className="text-green-600">0</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
