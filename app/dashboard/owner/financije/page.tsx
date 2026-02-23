"use client";
import { useSpvs, useIssuedInvoices, useReceivedInvoices, formatEur } from "@/lib/data-client";
export default function OwnerFinancijePage() {
  const { data: spvs, loading } = useSpvs();
  const { data: issued } = useIssuedInvoices();
  const { data: received } = useReceivedInvoices();
  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;
  const data = spvs.map(p => {
    const rev = issued.filter(i => i.spvId === p.id).reduce((s,i) => s + i.totalAmount, 0);
    const exp = received.filter(i => i.spvId === p.id).reduce((s,i) => s + i.totalAmount, 0);
    return { id: p.id, name: p.name, rev, exp, net: rev - exp };
  });
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Financije</h1></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold">SPV</th><th className="text-right px-3 py-2.5 font-semibold text-green-700">Prihod</th><th className="text-right px-3 py-2.5 font-semibold text-red-700">Rashod</th><th className="text-right px-3 py-2.5 font-semibold">Neto</th></tr></thead><tbody>{data.map(d => (<tr key={d.id} className="border-b border-gray-50"><td className="px-3 py-2.5 font-bold">{d.name}</td><td className="px-3 py-2.5 text-right text-green-600">{formatEur(d.rev)}</td><td className="px-3 py-2.5 text-right text-red-600">{formatEur(d.exp)}</td><td className={`px-3 py-2.5 text-right font-bold ${d.net >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(d.net)}</td></tr>))}</tbody></table></div>
    </div>
  );
}