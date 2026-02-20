"use client";
import { DOCUMENTS } from "@/lib/mock-data";
export default function CoreCoreDokumentiPage() {
  const byStatus: Record<string, number> = {};
  DOCUMENTS.forEach(d => { const s = d.status as string; byStatus[s] = (byStatus[s] || 0) + 1; });
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Dokumenti - Pregled</h1><p className="text-[13px] text-black/50 mt-0.5">{DOCUMENTS.length} dokumenata</p></div>
      <div className="grid grid-cols-4 gap-3">{Object.entries(byStatus).map(([s, c]) => (<div key={s} className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-black">{c}</div><div className="text-[12px] text-black/50">{s}</div></div>))}</div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2 font-semibold">Naziv</th><th className="text-left px-3 py-2 font-semibold">Tip</th><th className="text-left px-3 py-2 font-semibold">SPV</th><th className="text-center px-3 py-2 font-semibold">Status</th></tr></thead><tbody>{DOCUMENTS.slice(0, 15).map(d => (<tr key={d.id} className="border-b border-gray-50"><td className="px-3 py-2 font-medium">{d.name}</td><td className="px-3 py-2 text-black/50">{d.type}</td><td className="px-3 py-2 text-black/50">{d.spvId}</td><td className="px-3 py-2 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100">{d.status}</span></td></tr>))}</tbody></table></div>
    </div>
  );
}
