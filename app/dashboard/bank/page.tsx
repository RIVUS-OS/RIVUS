"use client";

import { useRouter } from "next/navigation";
import { useSpvs, useBanks } from "@/lib/data-client";;

export default function BankDashboardPage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: banks, loading: banksLoading } = useBanks();

  if (spvsLoading || banksLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const router = useRouter();
  const evalPending = spvs.filter(p => banks.some(b => b.evaluationPending === p.id));

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Banka - Nadzorna ploca</h1><p className="text-[13px] text-black/50 mt-0.5">{banks.length} banaka | {spvs.length} SPV-ova</p></div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "SPV-ova", value: spvs.length, color: "text-blue-600" },
          { label: "Evaluacije", value: evalPending.length, color: evalPending.length > 0 ? "text-amber-600" : "text-green-600" },
          { label: "Banke", value: banks.length, color: "text-blue-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>
      {evalPending.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="text-[14px] font-bold text-amber-700 mb-2">Evaluacije u tijeku ({evalPending.length})</div>
          {evalPending.map(p => (
            <div key={p.id} className="text-[12px] text-amber-600 py-1">{p.id} - {p.name}</div>
          ))}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100 text-[14px] font-bold">Projekti</div>
        <div className="divide-y divide-gray-50">
          {spvs.map(p => (
            <div key={p.id} onClick={() => router.push("/dashboard/bank/spv/" + p.id)} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
              <div><span className="text-[14px] font-bold">{p.id}</span><span className="text-[12px] text-black/50 ml-2">{p.name}</span></div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.status === "aktivan" ? "bg-green-100 text-green-700" : p.status === "blokiran" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
