"use client";

import { useRouter } from "next/navigation";
import {
  SPVS, getOverdueIssued, getMissingDocs, getBlockedTasks, getSlaBreached,
  type Spv,
} from "@/lib/mock-data";

function computeRisk(spv: Spv) {
  const issues: string[] = [];
  let score = 0;
  if (spv.status === "blokiran") { score += 5; issues.push("SPV blokiran"); }
  const overdue = getOverdueIssued().filter(i => i.spvId === spv.id);
  if (overdue.length > 0) { score += overdue.length * 2; issues.push(overdue.length + " dospjelih racuna"); }
  const missing = getMissingDocs().filter(d => d.spvId === spv.id);
  if (missing.length > 0) { score += missing.length * 3; issues.push(missing.length + " mandatory dok. nedostaje"); }
  const blockedT = getBlockedTasks().filter(t => t.spvId === spv.id);
  if (blockedT.length > 0) { score += blockedT.length * 2; issues.push(blockedT.length + " blokiranih zadataka"); }
  const sla = getSlaBreached().filter(t => t.spvId === spv.id);
  if (sla.length > 0) { score += sla.length * 2; issues.push(sla.length + " SLA probijenih"); }
  if (!spv.accountantId) { score += 1; issues.push("Nema knjigovodju"); }
  return { score, issues, level: score >= 5 ? "Visok" : score >= 3 ? "Srednji" : score > 0 ? "Nizak" : "Bez rizika" };
}

const riskColors: Record<string, string> = {
  "Visok": "bg-red-100 text-red-700 border-red-200",
  "Srednji": "bg-amber-100 text-amber-700 border-amber-200",
  "Nizak": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Bez rizika": "bg-green-50 text-green-700 border-green-200",
};

export default function RizikPage() {
  const router = useRouter();
  const scored = SPVS.map(spv => ({ ...spv, risk: computeRisk(spv) })).sort((a, b) => b.risk.score - a.risk.score);
  const high = scored.filter(s => s.risk.level === "Visok").length;
  const medium = scored.filter(s => s.risk.level === "Srednji").length;
  const low = scored.filter(s => s.risk.level === "Nizak").length;
  const none = scored.filter(s => s.risk.level === "Bez rizika").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Rizik - Nadzor</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Proceduralni/operativni rizik | {SPVS.length} SPV-ova analizirano</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Visok rizik", value: high, color: "text-red-600" },
          { label: "Srednji", value: medium, color: "text-amber-600" },
          { label: "Nizak", value: low, color: "text-yellow-600" },
          { label: "Bez rizika", value: none, color: "text-green-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {scored.map(spv => (
          <div key={spv.id} className={`bg-white rounded-xl border p-4 ${spv.risk.score > 0 ? "border-gray-200" : "border-gray-100"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <button onClick={() => router.push("/dashboard/core/spv/" + spv.id)}
                  className="text-[14px] font-bold text-black hover:text-blue-600">{spv.id}</button>
                <span className="text-[13px] text-black/50">{spv.name}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${riskColors[spv.risk.level]}`}>
                  {spv.risk.level} ({spv.risk.score})
                </span>
              </div>
              <span className="text-[12px] text-black/40">{spv.sectorLabel}</span>
            </div>
            {spv.risk.issues.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {spv.risk.issues.map((issue, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-black/60">{issue}</span>
                ))}
              </div>
            ) : (
              <div className="text-[12px] text-green-600 mt-1">Nema otvorenih rizika</div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-black/40">
        NAPOMENA: Ovo je proceduralni/operativni risk scoring temeljen na blokadama, dospjelim racunima, nedostajucim dokumentima, SLA probijenim i statusima zadataka. Ovo NIJE investicijski rizik niti financijska procjena.
      </div>
    </div>
  );
}
