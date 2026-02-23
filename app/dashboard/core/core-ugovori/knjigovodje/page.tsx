"use client";
import { useAccountants, formatEur } from "@/lib/data-client";;
export default function CoreUgovoriKnjigovodjePage() {
  const { data: accountants, loading: accountantsLoading } = useAccountants();

  if (accountantsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Ugovori - Knjigovodje</h1><p className="text-[13px] text-black/50 mt-0.5">{accountants.length} knjigovodja</p></div><div className="space-y-2">{accountants.map(a => (<div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between"><div><div className="text-[14px] font-bold">{a.name}</div><div className="text-[12px] text-black/50">{a.contact} | {a.coversSpvs.length} SPV-ova</div></div><span className="font-bold text-blue-600">{formatEur(a.pricePerMonth)}/mj</span></div>))}</div></div>);
}


