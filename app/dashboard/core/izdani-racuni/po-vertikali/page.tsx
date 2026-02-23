"use client";

import { useIssuedInvoices, useVerticals, formatEur } from "@/lib/data-client";;

export default function IzdaniPoVertikaliPage() {
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();
  const { data: verticals, loading: verticalsLoading } = useVerticals();

  if (issuedInvoicesLoading || verticalsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const byVert: Record<string, { name: string; count: number; total: number; commission: number }> = {};
  issuedInvoices.filter(i => i.category === "vertical_commission").forEach(i => {
    byVert[i.spvId] = byVert[i.spvId] || { name: i.spvId, count: 0, total: 0, commission: 0 };
    byVert[i.spvId].count++; byVert[i.spvId].total += i.totalAmount;
  });

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Izdani racuni - Po vertikali</h1><p className="text-[13px] text-black/50 mt-0.5">{verticals.length} vertikala</p></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Vertikala</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Tip</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Provizija</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Sektori</th>
          </tr></thead>
          <tbody>{verticals.map(v => (
            <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-bold text-black">{v.name}</td>
              <td className="px-3 py-2.5 text-black/50">{v.type}</td>
              <td className="px-3 py-2.5 text-center font-bold text-blue-600">{v.commission}%</td>
              <td className="px-3 py-2.5"><div className="flex flex-wrap gap-1">{v.sectors.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100">{s}</span>)}</div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
