"use client";
import { useSpvs, useDocuments } from "@/lib/data-client";;
export default function CoreMandatoryPage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: documents, loading: documentsLoading } = useDocuments();

  if (spvsLoading || documentsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const required = ["Izvadak iz sudskog registra", "Rjesenje o osnivanju", "OIB potvrda", "Ugovor o poslovnom racunu", "Polica osiguranja"];
  const coverage = spvs.map(p => { const docs = documents.filter(d => d.spvId === p.id); return { id: p.id, name: p.name, has: docs.length, missing: Math.max(0, required.length - docs.length) }; });
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Obvezna dokumentacija</h1><p className="text-[13px] text-black/50 mt-0.5">{required.length} obveznih dokumenata po SPV</p></div>
      <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="text-[13px] font-semibold mb-2">Obvezni dokumenti:</div>{required.map(r => <div key={r} className="text-[12px] text-black/50 py-0.5">• {r}</div>)}</div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold">SPV</th><th className="text-right px-3 py-2.5 font-semibold">Ima</th><th className="text-right px-3 py-2.5 font-semibold">Nedostaje</th></tr></thead><tbody>{coverage.map(c => (<tr key={c.id} className="border-b border-gray-50"><td className="px-3 py-2.5 font-bold">{c.id}</td><td className="px-3 py-2.5 text-right text-green-600">{c.has}</td><td className={`px-3 py-2.5 text-right font-bold ${c.missing > 0 ? "text-red-600" : "text-green-600"}`}>{c.missing}</td></tr>))}</tbody></table></div>
    </div>
  );
}
