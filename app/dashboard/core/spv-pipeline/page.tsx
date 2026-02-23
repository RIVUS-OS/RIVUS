"use client";

import { useRouter } from "next/navigation";
import { useSpvs, formatEur } from "@/lib/data-client";
import { SECTORS } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  aktivan: "bg-green-100 text-green-700",
  blokiran: "bg-red-100 text-red-700",
  u_izradi: "bg-blue-100 text-blue-700",
  na_cekanju: "bg-gray-100 text-gray-600",
  zavrsen: "bg-indigo-100 text-indigo-700",
};

const phaseColors: Record<string, string> = {
  "Kreirano": "bg-gray-50 text-gray-700",
  "CORE pregled": "bg-sky-50 text-sky-700",
  "Vertikale aktivne": "bg-purple-50 text-purple-700",
  "Strukturirano": "bg-blue-50 text-blue-700",
  "Financiranje": "bg-amber-50 text-amber-700",
  "Aktivna gradnja": "bg-green-50 text-green-700",
};

export default function SpvPipelinePage() {
  const router = useRouter();
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const active = spvs.filter(s => s.status === "aktivan" || s.status === "blokiran").length;
  const completed = spvs.filter(s => s.status === "zavrsen").length;
  const totalBudget = spvs.reduce((sum, s) => sum + s.totalBudget, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">SPV Pipeline</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Svi SPV-ovi u sustavu | {spvs.length} ukupno | {active} aktivnih | {completed} zavrsenih | {formatEur(totalBudget)} budzet</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Aktivni", value: spvs.filter(s => s.status === "aktivan").length, color: "text-green-600" },
          { label: "Blokirani", value: spvs.filter(s => s.status === "blokiran").length, color: "text-red-600" },
          { label: "U izradi", value: spvs.filter(s => s.status === "u_izradi").length, color: "text-blue-600" },
          { label: "Zavrseni", value: completed, color: "text-indigo-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 font-semibold text-black/70">ID</th>
              <th className="text-left px-4 py-3 font-semibold text-black/70">Naziv</th>
              <th className="text-left px-4 py-3 font-semibold text-black/70">Sektor</th>
              <th className="text-left px-4 py-3 font-semibold text-black/70">Faza</th>
              <th className="text-left px-4 py-3 font-semibold text-black/70">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-black/70">Budzet</th>
              <th className="text-right px-4 py-3 font-semibold text-black/70">Proc. profit</th>
              <th className="text-left px-4 py-3 font-semibold text-black/70">Grad</th>
            </tr>
          </thead>
          <tbody>
            {spvs.map(spv => (
              <tr key={spv.id} onClick={() => router.push("/dashboard/core/spv/" + spv.id)}
                className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-4 py-3 font-bold text-black">{spv.id}</td>
                <td className="px-4 py-3 text-black">{spv.name}</td>
                <td className="px-4 py-3">{spv.sectorLabel}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${phaseColors[spv.phase] || "bg-gray-100 text-gray-700"}`}>
                    {spv.phase}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[spv.status] || "bg-gray-100"}`}>
                    {spv.statusLabel}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatEur(spv.totalBudget)}</td>
                <td className="px-4 py-3 text-right font-medium">{formatEur(spv.estimatedProfit)}</td>
                <td className="px-4 py-3 text-black/50">{spv.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
