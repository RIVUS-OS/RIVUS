"use client";

import { BANKS, SPVS, getSpvById } from "@/lib/mock-data";

export default function BankeNadzorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Banke - Nadzor</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{BANKS.length} banke u sustavu | {BANKS.filter(b => b.evaluationPending).length} evaluacija u tijeku</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BANKS.map(bank => {
          const bankSpvs = bank.spvs.map(id => getSpvById(id)).filter(Boolean);
          return (
            <div key={bank.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-bold text-black">{bank.name}</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">{bank.status}</span>
              </div>
              <div className="text-[12px] text-black/50 mb-3">{bank.relationshipType}</div>
              <div className="text-[12px] text-black/50 mb-4">Kontakt: {bank.contact}</div>

              {bank.evaluationPending && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="text-[12px] font-semibold text-amber-700">Evaluacija u tijeku</div>
                  <div className="text-[11px] text-amber-600 mt-0.5">SPV: {bank.evaluationPending}</div>
                </div>
              )}

              <div className="text-[12px] font-semibold text-black mb-2">SPV-ovi ({bankSpvs.length})</div>
              <div className="space-y-1.5">
                {bankSpvs.map(spv => spv && (
                  <div key={spv.id} className="flex items-center justify-between text-[12px] p-2 rounded-lg bg-gray-50">
                    <div>
                      <span className="font-bold text-black">{spv.id}</span>
                      <span className="text-black/50 ml-2">{spv.name}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      spv.status === "aktivan" ? "bg-green-100 text-green-700" :
                      spv.status === "blokiran" ? "bg-red-100 text-red-700" :
                      spv.status === "zavrsen" ? "bg-indigo-100 text-indigo-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{spv.statusLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
