"use client";
import { ISSUED_INVOICES, formatEur } from "@/lib/mock-data";
export default function StaranjeOpomenePage() {
  const overdue = ISSUED_INVOICES.filter(i => (i.status as string) === "kasni");
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Opomene</h1><p className="text-[13px] text-black/50 mt-0.5">{overdue.length} za slanje opomene</p></div>{overdue.map(i => (<div key={i.id} className="bg-white rounded-xl border-2 border-red-200 p-4"><div className="flex justify-between mb-2"><span className="font-bold text-red-700">{i.number} - {i.client}</span><span className="font-bold text-red-600">{formatEur(i.totalAmount)}</span></div><div className="flex gap-2"><button className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-[11px] font-semibold opacity-50 cursor-not-allowed">1. opomena</button><button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-[11px] font-semibold opacity-50 cursor-not-allowed">Pravna akcija</button></div></div>))}</div>);
}
