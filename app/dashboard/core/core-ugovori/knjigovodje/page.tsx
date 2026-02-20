"use client";
import { ACCOUNTANTS, formatEur } from "@/lib/mock-data";
export default function CoreUgovoriKnjigovodjePage() {
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Ugovori - Knjigovodje</h1><p className="text-[13px] text-black/50 mt-0.5">{ACCOUNTANTS.length} knjigovodja</p></div><div className="space-y-2">{ACCOUNTANTS.map(a => (<div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between"><div><div className="text-[14px] font-bold">{a.name}</div><div className="text-[12px] text-black/50">{a.contact} | {a.coversSpvs.length} SPV-ova</div></div><span className="font-bold text-blue-600">{formatEur(a.pricePerMonth)}/mj</span></div>))}</div></div>);
}


