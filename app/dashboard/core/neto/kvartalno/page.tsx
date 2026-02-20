"use client";
import { PNL_MONTHS, formatEur } from "@/lib/mock-data";
export default function NetoKvartalnoPage() {
  const quarters: {q:string;rev:number;exp:number;net:number}[] = [];
  for (let i = 0; i < PNL_MONTHS.length; i += 3) { const c = PNL_MONTHS.slice(i,i+3); const rev = c.reduce((s,m)=>s+m.revenue,0); const exp = c.reduce((s,m)=>s+m.expenses,0); quarters.push({q:`Q${Math.floor(i/3)+1}`,rev,exp,net:rev-exp}); }
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Neto - Kvartalno</h1></div><div className="grid grid-cols-4 gap-3">{quarters.map(q => (<div key={q.q} className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-[14px] font-bold text-black/50">{q.q}</div><div className={`text-xl font-bold ${q.net >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(q.net)}</div><div className="text-[10px] text-black/40">{formatEur(q.rev)} - {formatEur(q.exp)}</div></div>))}</div></div>);
}
