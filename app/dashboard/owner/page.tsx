"use client";

import { useRouter } from "next/navigation";
import { SPVS, getTasksBySpv, getMissingDocs, getTokBySpv, formatEur } from "@/lib/mock-data";

export default function OwnerDashboardPage() {
  const router = useRouter();
  const mySpvs = SPVS;

  const totalProfit = mySpvs.reduce((s, p) => s + p.estimatedProfit, 0);
  const blocked = mySpvs.filter(p => p.status === "blokiran");
  const active = mySpvs.filter(p => p.status === "aktivan");
  const allMissing = getMissingDocs();
  const allOpenTasks = mySpvs.flatMap(p => getTasksBySpv(p.id).filter(t => (t.status as string) !== "završen"));
  const allOpenTok = mySpvs.flatMap(p => getTokBySpv(p.id).filter(t => t.status === "otvoren" || t.status === "u_tijeku" || t.status === "eskaliran"));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Moji projekti</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{mySpvs.length} SPV-ova | Pregled portfelja</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Ukupno SPV", value: mySpvs.length, color: "text-blue-600" },
          { label: "Aktivni", value: active.length, color: "text-green-600" },
          { label: "Blokirani", value: blocked.length, color: blocked.length > 0 ? "text-red-600" : "text-green-600" },
          { label: "Proc. profit", value: formatEur(totalProfit), color: "text-blue-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>

      {blocked.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="text-[14px] font-bold text-red-700 mb-2">Blokirani projekti ({blocked.length})</div>
          {blocked.map(p => (
            <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-red-100/50 mb-1 text-[12px]">
              <span className="font-bold text-red-700">{p.id} - {p.name}</span>
              <span className="text-red-600">{p.blockReason}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Otvoreni zadaci", value: allOpenTasks.length, color: allOpenTasks.length > 0 ? "text-amber-600" : "text-green-600" },
          { label: "Nedostaje dok.", value: allMissing.length, color: allMissing.length > 0 ? "text-red-600" : "text-green-600" },
          { label: "TOK zahtjevi", value: allOpenTok.length, color: allOpenTok.length > 0 ? "text-amber-600" : "text-green-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100 text-[14px] font-bold text-black">Svi projekti</div>
        <div className="divide-y divide-gray-50">
          {mySpvs.map(p => {
            const openT = getTasksBySpv(p.id).filter(t => (t.status as string) !== "završen").length;
            const missing = getMissingDocs().filter(d => d.spvId === p.id).length;
            return (
              <div key={p.id} onClick={() => router.push("/dashboard/owner/spv/" + p.id)}
                className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-black">{p.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.status === "aktivan" ? "bg-green-100 text-green-700" :
                      p.status === "blokiran" ? "bg-red-100 text-red-700" :
                      p.status === "u_izradi" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    }`}>{p.status}</span>
                  </div>
                  <div className="text-[12px] text-black/50 mt-0.5">{p.name} | {p.sectorLabel} | {p.city}</div>
                </div>
                <div className="flex items-center gap-6 text-[12px]">
                  <div className="text-right"><div className="text-black/40">Faza</div><div className="font-medium">{p.phase}</div></div>
                  <div className="text-right"><div className="text-black/40">Zadaci</div><div className={openT > 0 ? "text-amber-600 font-medium" : "text-green-600"}>{openT} otv.</div></div>
                  <div className="text-right"><div className="text-black/40">Dok.</div><div className={missing > 0 ? "text-red-600 font-medium" : "text-green-600"}>{missing > 0 ? missing + " ned." : "OK"}</div></div>
                  <div className="text-right"><div className="text-black/40">Budzet</div><div className="font-bold">{formatEur(p.totalBudget)}</div></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
