"use client";
import { SPVS, getIssuedBySpv, formatEur } from "@/lib/mock-data";
export default function PrihodiSpvPage() {
  const data = SPVS.map(p => ({ id: p.id, name: p.name, rev: getIssuedBySpv(p.id).reduce((s, i) => s + i.totalAmount, 0) })).sort((a, b) => b.rev - a.rev);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Prihodi - Po SPV</h1></div><div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Prihod</th></tr></thead><tbody>{data.map(d => (<tr key={d.id} className="border-b border-gray-50"><td className="px-3 py-2.5"><span className="font-bold">{d.id}</span> <span className="text-black/50">{d.name}</span></td><td className="px-3 py-2.5 text-right font-bold text-green-600">{formatEur(d.rev)}</td></tr>))}</tbody></table></div></div>);
}
