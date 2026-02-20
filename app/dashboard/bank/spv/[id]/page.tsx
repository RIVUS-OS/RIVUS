"use client";

import { useParams } from "next/navigation";
import { getSpvById, getDocsBySpv, getActivityBySpv, BANKS, formatEur } from "@/lib/mock-data";

export default function BankSpvPage() {
  const { id } = useParams();
  const spv = getSpvById(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const bank = BANKS.find(b => b.id === spv.bankId);
  const docs = getDocsBySpv(id as string);
  const activity = getActivityBySpv(id as string).slice(0, 5);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Pregled</h1><p className="text-[13px] text-black/50 mt-0.5">{spv.name} | {spv.phase}</p></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Status", value: spv.status, color: spv.status === "aktivan" ? "text-green-600" : spv.status === "blokiran" ? "text-red-600" : "text-blue-600" },
          { label: "Faza", value: spv.phase, color: "text-blue-600" },
          { label: "Budzet", value: formatEur(spv.totalBudget), color: "text-black" },
          { label: "Dokumenti", value: docs.length, color: "text-blue-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>
      {bank && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[14px] font-bold text-black mb-2">Banka</h3>
          <div className="text-[13px]"><span className="font-semibold">{bank.name}</span> | {bank.contact} | {bank.relationshipType}</div>
          {bank.evaluationPending === id && <div className="mt-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700 font-medium">Evaluacija u tijeku</div>}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-[14px] font-bold text-black mb-3">Zadnje aktivnosti</h3>
        {activity.length > 0 ? activity.map(a => (
          <div key={a.id} className="flex items-start gap-2 text-[12px] mb-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-blue-400 flex-shrink-0" />
            <div><div className="text-black">{a.action}</div><div className="text-black/40 text-[11px]">{a.actor} | {a.timestamp}</div></div>
          </div>
        )) : <div className="text-[12px] text-black/30">Nema aktivnosti</div>}
      </div>
    </div>
  );
}
