"use client";
import { PNL_MONTHS, formatEur } from "@/lib/mock-data";
export default function RashodiKvartalnoPage() {
  const quarters: {q:string;exp:number}[] = [];
  for (let i = 0; i < PNL_MONTHS.length; i += 3) { const chunk = PNL_MONTHS.slice(i, i+3); quarters.push({q:`Q${Math.floor(i/3)+1}`, exp: chunk.reduce((s,m)=>s+m.expenses,0)}); }
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Rashodi - Kvartalno</h1></div><div className="grid grid-cols-4 gap-3">{quarters.map(q => (<div key={q.q} className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-[14px] font-bold text-black/50">{q.q}</div><div className="text-xl font-bold text-red-600">{formatEur(q.exp)}</div></div>))}</div></div>);
}
