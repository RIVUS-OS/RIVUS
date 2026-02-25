"use client";
import { useSpvs, useIssuedInvoices, formatEur } from "@/lib/data-client";
export default function IzdaniPoSpvPage() {
  const { data: spvs, loading } = useSpvs();
  const { data: issued } = useIssuedInvoices();
  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;
  const data = spvs.map(p => ({ id: p.id, name: p.name, count: issued.filter(i => i.spvId === p.id).length, total: issued.filter(i => i.spvId === p.id).reduce((s,i) => s + i.totalAmount, 0) }));
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Izdani racuni - po SPV</h1></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold">SPV</th><th className="text-right px-3 py-2.5 font-semibold">Broj racuna</th><th className="text-right px-3 py-2.5 font-semibold">Ukupno</th></tr></thead><tbody>{data.map(d => (<tr key={d.id} className="border-b border-gray-50"><td className="px-3 py-2.5 font-bold">{d.name}</td><td className="px-3 py-2.5 text-right">{d.count}</td><td className="px-3 py-2.5 text-right font-semibold">{formatEur(d.total)}</td></tr>))}</tbody></table></div>
    </div>
  );
}