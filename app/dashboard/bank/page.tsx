"use client";

import { useRouter } from "next/navigation";
import { useSpvs, useBanks, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function BankDashboardPage() {
  const { allowed, loading: permLoading } = usePermission("bank_read");
  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "BANK_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: banks, loading: banksLoading } = useBanks();

  const router = useRouter();
  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading || modeLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  if (isLockdown) {
    return (<div className="flex items-center justify-center h-64"><div className="text-center">
      <p className="text-lg font-semibold text-red-700">Sustav u Lockdown modu</p>
      <p className="text-sm text-gray-500 mt-1">Kontaktirajte CORE administratora.</p>
    </div></div>);
  }

  if (spvsLoading || banksLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const evalPending = spvs.filter(p => banks.some(b => b.evaluationPending === p.id));
  const totalApproved = banks.reduce((s, b) => s + (b.approved || 0), 0);
  const totalPending = banks.reduce((s, b) => s + (b.pending || 0), 0);
  const totalRejected = banks.reduce((s, b) => s + (b.rejected || 0), 0);
  const totalEvals = banks.reduce((s, b) => s + (b.totalEvaluations || 0), 0);

  const kpis = [
    { label: "SPV-ova", value: String(spvs.length), sub: "u sustavu", color: "text-blue-600" },
    { label: "Banke", value: String(banks.length), sub: totalEvals + " evaluacija", color: "text-blue-600" },
    { label: "Odobreno", value: String(totalApproved), sub: totalEvals > 0 ? Math.round(totalApproved / totalEvals * 100) + "% approval rate" : "", color: "text-green-600" },
    { label: "Na cekanju", value: String(totalPending), sub: totalRejected > 0 ? totalRejected + " odbijenih" : "nema odbijenih", color: totalPending > 0 ? "text-amber-600" : "text-green-600" },
  ];

  const statusColors: Record<string, string> = {
    aktivan: "bg-green-100 text-green-700",
    blokiran: "bg-red-100 text-red-700",
    u_izradi: "bg-blue-100 text-blue-700",
    na_cekanju: "bg-gray-100 text-gray-600",
    zavrsen: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Banka - Evaluacijski pregled</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{banks.length} banaka | {spvs.length} SPV-ova | {totalEvals} evaluacija</p>
      </div>

      {isSafe && (
        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700">
          Sustav u Safe Mode — samo citanje aktivno.
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/70 font-medium mt-1">{k.label}</div>
            <div className="text-[11px] text-black/40 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Pending evaluations alert */}
      {evalPending.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="text-[13px] font-semibold text-amber-800 mb-2">Evaluacije u tijeku ({evalPending.length})</div>
          {evalPending.map(p => (
            <div key={p.id} onClick={() => router.push("/dashboard/bank/spv/" + p.id + "/evaluacija")}
              className="text-[12px] text-amber-700 py-1.5 px-2 rounded hover:bg-amber-100 cursor-pointer flex justify-between">
              <span className="font-medium">{p.name}</span>
              <span className="text-amber-500">{p.city} | {p.phase}</span>
            </div>
          ))}
        </div>
      )}

      {/* V2.5-4: Banks table */}
      {banks.length > 0 && (
        <div>
          <h2 className="text-[16px] font-bold text-black mb-3">Banke</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
                <th className="text-left px-3 py-2.5 font-semibold text-black/70">Kontakt</th>
                <th className="text-center px-3 py-2.5 font-semibold text-black/70">SPV-ovi</th>
                <th className="text-center px-3 py-2.5 font-semibold text-black/70">Odobreno</th>
                <th className="text-center px-3 py-2.5 font-semibold text-black/70">Na cekanju</th>
                <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
              </tr></thead>
              <tbody>
                {banks.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-black">{b.name}</td>
                    <td className="px-3 py-2.5 text-black/50">{b.contact || b.contactPerson || "-"}</td>
                    <td className="px-3 py-2.5 text-center">{b.spvs?.length || 0}</td>
                    <td className="px-3 py-2.5 text-center text-green-600 font-medium">{b.approved || 0}</td>
                    <td className="px-3 py-2.5 text-center text-amber-600 font-medium">{b.pending || 0}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.status === "aktivan" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {b.status || "nepoznat"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SPV projects */}
      <div>
        <h2 className="text-[16px] font-bold text-black mb-3">Projekti</h2>
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="divide-y divide-gray-50">
            {spvs.map(p => (
              <div key={p.id} onClick={() => router.push("/dashboard/bank/spv/" + p.id)} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div>
                  <span className="text-[14px] font-bold text-black">{p.name}</span>
                  <span className="text-[12px] text-black/50 ml-2">{p.city} | {p.phase}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-black/40">{formatEur(p.totalBudget)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[p.status] || "bg-gray-100 text-gray-600"}`}>{p.statusLabel}</span>
                </div>
              </div>
            ))}
            {spvs.length === 0 && <div className="px-5 py-8 text-center text-black/40">Nema projekata</div>}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
