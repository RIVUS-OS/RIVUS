"use client";

import { useSpvs, formatEur } from "@/lib/data-client";

export default function HoldingPortfolioPage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const bySector: Record<string, typeof spvs> = {};
  spvs.forEach(p => { bySector[p.sectorLabel] = bySector[p.sectorLabel] || []; bySector[p.sectorLabel].push(p); });

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Portfelj</h1><p className="text-[13px] text-black/50 mt-0.5">{spvs.length} SPV-ova u {Object.keys(bySector).length} sektora</p></div>
      {Object.entries(bySector).map(([sector, spvs]) => (
        <div key={sector}>
          <h3 className="text-[14px] font-bold text-black mb-2">{sector} ({spvs.length})</h3>
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50/50">
                
                <th className="text-left px-3 py-2 font-semibold text-black/70">Naziv</th>
                <th className="text-left px-3 py-2 font-semibold text-black/70">Grad</th>
                <th className="text-left px-3 py-2 font-semibold text-black/70">Faza</th>
                <th className="text-center px-3 py-2 font-semibold text-black/70">Status</th>
                <th className="text-right px-3 py-2 font-semibold text-black/70">Budzet</th>
                <th className="text-right px-3 py-2 font-semibold text-black/70">Profit</th>
              </tr></thead>
              <tbody>{spvs.map(p => (
                <tr key={p.id} className="border-b border-gray-50">
                  
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2 text-black/50">{p.city}</td>
                  <td className="px-3 py-2 text-black/50">{p.phase}</td>
                  <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.status === "aktivan" ? "bg-green-100 text-green-700" : p.status === "blokiran" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</span></td>
                  <td className="px-3 py-2 text-right">{formatEur(p.totalBudget)}</td>
                  <td className="px-3 py-2 text-right font-bold text-green-600">{formatEur(p.estimatedProfit)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
