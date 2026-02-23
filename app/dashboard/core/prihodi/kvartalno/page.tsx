"use client";
import { usePnlMonths, formatEur } from "@/lib/data-client";;
export default function PrihodiKvartalnoPage() {
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();

  if (pnlMonthsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const quarters: {q: string; rev: number}[] = [];
  for (let i = 0; i < pnlMonths.length; i += 3) {
    const chunk = pnlMonths.slice(i, i + 3);
    quarters.push({ q: `Q${Math.floor(i/3)+1}`, rev: chunk.reduce((s, m) => s + m.revenue, 0) });
  }
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Prihodi - Kvartalno</h1></div><div className="grid grid-cols-4 gap-3">{quarters.map(q => (<div key={q.q} className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-[14px] font-bold text-black/50">{q.q}</div><div className="text-xl font-bold text-green-600">{formatEur(q.rev)}</div></div>))}</div></div>);
}
