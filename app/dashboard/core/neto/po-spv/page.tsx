"use client";
import { useSpvs, useIssuedInvoices, useReceivedInvoices, formatEur } from "@/lib/data-client";;
export default function NetoPoSpvPage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const data = spvs.map(p => { const { data: _raw2_rev } = useIssuedInvoices(p.id);
  const rev = _raw2_rev.reduce((s,i)=>s+i.totalAmount,0); const { data: _r3_exp } = useReceivedInvoices(p.id); const exp = _r3_exp.reduce((s,i)=>s+i.totalAmount,0); return {id:p.id,name:p.name,rev,exp,net:rev-exp}; }).sort((a,b) => b.net - a.net);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Neto - Po SPV</h1></div><div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th><th className="text-right px-3 py-2.5 font-semibold text-green-700">Prihod</th><th className="text-right px-3 py-2.5 font-semibold text-red-700">Rashod</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Neto</th></tr></thead><tbody>{data.map(d => (<tr key={d.id} className="border-b border-gray-50"><td className="px-3 py-2.5 font-bold">{d.id} <span className="text-black/50 font-normal">{d.name}</span></td><td className="px-3 py-2.5 text-right text-green-600">{formatEur(d.rev)}</td><td className="px-3 py-2.5 text-right text-red-600">{formatEur(d.exp)}</td><td className={`px-3 py-2.5 text-right font-bold ${d.net >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(d.net)}</td></tr>))}</tbody></table></div></div>);
}
