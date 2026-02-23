"use client";
import { useVerticals, useAccountants, useBanks } from "@/lib/data-client";
export default function CoreUgovoriNdaPage() {
  const { data: verticals, loading: verticalsLoading } = useVerticals();
  const { data: accountants, loading: accountantsLoading } = useAccountants();
  const { data: banks, loading: banksLoading } = useBanks();

  if (verticalsLoading || accountantsLoading || banksLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const ndaParties = [...verticals.map(v => ({name: v.name, type: "Vertikala", signed: true})), ...accountants.map(a => ({name: a.name, type: "Knjigovodja", signed: true})), ...banks.map(b => ({name: b.name, type: "Banka", signed: false}))];
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">NDA ugovori</h1><p className="text-[13px] text-black/50 mt-0.5">{ndaParties.length} stranaka</p></div><div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">Stranka</th><th className="text-left px-3 py-2.5 font-semibold text-black/70">Tip</th><th className="text-center px-3 py-2.5 font-semibold text-black/70">NDA</th></tr></thead><tbody>{ndaParties.map(p => (<tr key={p.name} className="border-b border-gray-50"><td className="px-3 py-2.5 font-medium">{p.name}</td><td className="px-3 py-2.5 text-black/50">{p.type}</td><td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.signed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{p.signed ? "Potpisan" : "Nedostaje"}</span></td></tr>))}</tbody></table></div></div>);
}

