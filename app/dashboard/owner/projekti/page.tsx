"use client";

import { useRouter } from "next/navigation";
import { useSpvs, formatEur } from "@/lib/data-client";

export default function OwnerProjektiPage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();

  const router = useRouter();
  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const statusColors: Record<string, string> = {
    aktivan: "bg-green-100 text-green-700", blokiran: "bg-red-100 text-red-700",
    u_izradi: "bg-blue-100 text-blue-700", na_cekanju: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Projekti</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{spvs.length} SPV-ova u portfelju</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">ID</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Sektor</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Grad</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Faza</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Budzet</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Proc. profit</th>
          </tr></thead>
          <tbody>{spvs.map(p => (
            <tr key={p.id} onClick={() => router.push("/dashboard/owner/spv/" + p.id)}
              className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
              <td className="px-3 py-2.5 font-bold text-black">{p.id}</td>
              <td className="px-3 py-2.5 text-black">{p.name}</td>
              <td className="px-3 py-2.5 text-black/50">{p.sectorLabel}</td>
              <td className="px-3 py-2.5 text-black/50">{p.city}</td>
              <td className="px-3 py-2.5 text-black/70">{p.phase}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[p.status] || "bg-gray-100"}`}>{p.status}</span></td>
              <td className="px-3 py-2.5 text-right font-medium">{formatEur(p.totalBudget)}</td>
              <td className="px-3 py-2.5 text-right font-bold text-green-600">{formatEur(p.estimatedProfit)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
