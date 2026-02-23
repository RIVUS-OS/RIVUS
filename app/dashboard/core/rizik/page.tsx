"use client";
import { useRouter } from "next/navigation";
import { useSpvs, useOverdueInvoices, useMissingDocs, useBlockedTasks, useSlaBreached } from "@/lib/data-client";

const riskColors: Record<string, string> = {
  "Visok": "bg-red-100 text-red-700 border-red-200",
  "Srednji": "bg-amber-100 text-amber-700 border-amber-200",
  "Nizak": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Bez rizika": "bg-green-50 text-green-700 border-green-200",
};

export default function RizikPage() {
  const router = useRouter();
  const { data: spvs, loading } = useSpvs();
  const { data: overdue } = useOverdueInvoices();
  const { data: missing } = useMissingDocs();
  const { data: blockedT } = useBlockedTasks();
  const { data: sla } = useSlaBreached();
  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  function computeRisk(spv: typeof spvs[0]) {
    const issues: string[] = [];
    let score = 0;
    if (spv.status === "blokiran") { score += 5; issues.push("SPV blokiran"); }
    const spvOverdue = overdue.filter(i => i.spvId === spv.id);
    if (spvOverdue.length > 0) { score += spvOverdue.length * 2; issues.push(spvOverdue.length + " dospjelih racuna"); }
    const spvMissing = missing.filter(d => d.spvId === spv.id);
    if (spvMissing.length > 0) { score += spvMissing.length * 3; issues.push(spvMissing.length + " mandatory dok. nedostaje"); }
    const spvBlocked = blockedT.filter(t => t.spvId === spv.id);
    if (spvBlocked.length > 0) { score += spvBlocked.length * 2; issues.push(spvBlocked.length + " blokiranih zadataka"); }
    const spvSla = sla.filter(t => t.spvId === spv.id);
    if (spvSla.length > 0) { score += spvSla.length * 2; issues.push(spvSla.length + " SLA probijenih"); }
    if (!spv.accountantId) { score += 1; issues.push("Nema knjigovodju"); }
    return { score, issues, level: score >= 5 ? "Visok" : score >= 3 ? "Srednji" : score > 0 ? "Nizak" : "Bez rizika" };
  }

  const scored = spvs.map(spv => ({ ...spv, risk: computeRisk(spv) })).sort((a, b) => b.risk.score - a.risk.score);
  const high = scored.filter(s => s.risk.level === "Visok").length;
  const med = scored.filter(s => s.risk.level === "Srednji").length;
  const low = scored.filter(s => s.risk.level === "Nizak").length;
  const none = scored.filter(s => s.risk.level === "Bez rizika").length;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Rizik - Nadzor</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{spvs.length} SPV-ova | {high} visok | {med} srednji | {low} nizak | {none} bez rizika</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-red-600">{high}</div><div className="text-[11px] text-red-600/70">Visok</div></div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-amber-600">{med}</div><div className="text-[11px] text-amber-600/70">Srednji</div></div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-yellow-600">{low}</div><div className="text-[11px] text-yellow-600/70">Nizak</div></div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-green-600">{none}</div><div className="text-[11px] text-green-600/70">Bez rizika</div></div>
      </div>
      <div className="space-y-3">
        {scored.map(spv => (
          <div key={spv.id} onClick={() => router.push("/dashboard/core/spv/" + spv.id)}
            className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-shadow ${spv.risk.level === "Visok" ? "border-red-200" : spv.risk.level === "Srednji" ? "border-amber-200" : "border-gray-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-[14px] font-bold text-black">{spv.name}</h2>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${riskColors[spv.risk.level]}`}>{spv.risk.level} ({spv.risk.score})</span>
              </div>
              <span className="text-[12px] text-black/40">{spv.city}</span>
            </div>
            {spv.risk.issues.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {spv.risk.issues.map((issue, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-black/60">{issue}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}