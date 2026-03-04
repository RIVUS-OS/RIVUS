"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  useSpvs,
  useOpenTasks,
  useUnpaidInvoices,
  useOverdueInvoices,
  usePendingDecisions,
  useOpenTokRequests,
  useActivityLog,
  useMissingDocs,
  useTransactions,
  useInvoices,
  formatEur,
} from "@/lib/data-client";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function OwnerDashboardPage() {
  const router = useRouter();

  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission('owner_dashboard');

  const { data: spvs, loading } = useSpvs();
  const { data: openTasks } = useOpenTasks();
  const { data: unpaid } = useUnpaidInvoices();
  const { data: overdue } = useOverdueInvoices();
  const { data: pending } = usePendingDecisions();
  const { data: openTok } = useOpenTokRequests();
  const { data: activity } = useActivityLog(undefined, 8);
  const { data: missingDocs } = useMissingDocs();
  const { data: transactions } = useTransactions();
  const { data: allInvoices } = useInvoices();

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: 'OWNER_DASHBOARD_VIEW', entity_type: 'owner_dashboard', details: { context: 'owner_cockpit' } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) {
    return (<div className="flex items-center justify-center h-64"><div className="text-center">
      <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
      <p className="text-sm text-gray-500 mt-1">Nemate Owner pristup.</p>
    </div></div>);
  }

  if (modeLoading || permLoading || loading) {
    return (<div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>);
  }

  if (isLockdown) {
    return (<div className="flex items-center justify-center h-64"><div className="text-center">
      <p className="text-lg font-semibold text-red-700">Sustav u Lockdown modu</p>
      <p className="text-sm text-gray-500 mt-1">Kontaktirajte CORE administratora.</p>
    </div></div>);
  }

  // V2.5-3: Enriched financials
  const totalBudget = spvs.reduce((s, p) => s + (p.totalBudget || 0), 0);
  const totalProfit = spvs.reduce((s, p) => s + (p.estimatedProfit || 0), 0);
  const totalRevenue = transactions.reduce((s, t) => s + (t.credit || 0), 0);
  const totalExpenses = transactions.reduce((s, t) => s + (t.debit || 0), 0);
  const netResult = totalRevenue - totalExpenses;
  const paidInvoices = allInvoices.filter(i => i.status === "placen");
  const totalPaid = paidInvoices.reduce((s, i) => s + (i.totalAmount || 0), 0);

  const kpis = [
    { label: "SPV-ovi", value: String(spvs.length), sub: "u portfelju", color: "bg-blue-50 text-blue-700" },
    { label: "Otvoreni zadaci", value: String(openTasks.length), sub: overdue.length > 0 ? overdue.length + " dospjelih" : "sve u roku", color: openTasks.length > 0 ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700" },
    { label: "Neplaceni racuni", value: String(unpaid.length), sub: overdue.length > 0 ? overdue.length + " prekoracenih" : "nema prekoracenih", color: unpaid.length > 0 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700" },
    { label: "Ukupni budzet", value: formatEur(totalBudget), sub: formatEur(totalProfit) + " procijenjeni profit", color: "bg-gray-50 text-gray-700" },
  ];

  const finKpis = [
    { label: "Prihodi", value: formatEur(totalRevenue), color: "text-green-600" },
    { label: "Rashodi", value: formatEur(totalExpenses), color: "text-red-600" },
    { label: "Neto rezultat", value: formatEur(netResult), color: netResult >= 0 ? "text-green-700" : "text-red-700" },
    { label: "Naplaceno", value: formatEur(totalPaid), color: "text-blue-600" },
  ];

  const statusColors: Record<string, string> = {
    aktivan: "bg-green-100 text-green-700",
    blokiran: "bg-red-100 text-red-700",
    u_izradi: "bg-blue-100 text-blue-700",
    na_cekanju: "bg-gray-100 text-gray-600",
    zavrsen: "bg-purple-100 text-purple-700",
  };

  const alerts: { label: string; count: number; path: string; color: string }[] = [];
  if (missingDocs.length > 0) alerts.push({ label: "Nedostajuci dokumenti", count: missingDocs.length, path: "/dashboard/owner/dokumenti", color: "text-red-600" });
  if (pending.length > 0) alerts.push({ label: "Odluke na cekanju", count: pending.length, path: "/dashboard/owner/tok", color: "text-amber-600" });
  if (openTok.length > 0) alerts.push({ label: "Otvoreni zahtjevi", count: openTok.length, path: "/dashboard/owner/tok", color: "text-blue-600" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Owner Cockpit</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Pregled svih projekata i operativnog stanja</p>
      </div>

      {isSafe && (
        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700">
          Sustav u Safe Mode — samo citanje aktivno. Kontaktirajte CORE.
        </div>
      )}

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className={`rounded-xl border border-gray-200 p-4 ${k.color.split(" ")[0]}`}>
            <div className={`text-[22px] font-bold ${k.color.split(" ")[1]}`}>{k.value}</div>
            <div className="text-[13px] font-medium text-black/70 mt-1">{k.label}</div>
            <div className="text-[11px] text-black/40 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* V2.5-3: Financial summary */}
      <div>
        <h2 className="text-[16px] font-bold text-black mb-3">Financijski pregled</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {finKpis.map((k) => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`text-[20px] font-bold ${k.color}`}>{k.value}</div>
              <div className="text-[12px] text-black/50 mt-1">{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
          <div className="text-[13px] font-semibold text-amber-800">Zahtijeva paznju</div>
          {alerts.map((a) => (
            <div key={a.label} onClick={() => router.push(a.path)} className="flex items-center justify-between text-[12px] cursor-pointer hover:bg-amber-100/50 rounded px-2 py-1">
              <span className={`font-medium ${a.color}`}>{a.label}</span>
              <span className="font-bold text-black/70">{a.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* SPV lista */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-black">Projekti</h2>
          <button onClick={() => router.push("/dashboard/owner/projekti")} className="text-[12px] text-blue-600 hover:text-blue-700 font-medium">Svi projekti &rarr;</button>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Grad</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Faza</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Budzet</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Profit</th>
            </tr></thead>
            <tbody>
              {spvs.map((p) => (
                <tr key={p.id} onClick={() => router.push("/dashboard/owner/spv/" + p.id)} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <td className="px-3 py-2.5 font-medium text-black">{p.name}</td>
                  <td className="px-3 py-2.5 text-black/50">{p.city}</td>
                  <td className="px-3 py-2.5 text-black/70">{p.phase}</td>
                  <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[p.status] || "bg-gray-100"}`}>{p.statusLabel}</span></td>
                  <td className="px-3 py-2.5 text-right font-medium">{formatEur(p.totalBudget)}</td>
                  <td className={`px-3 py-2.5 text-right font-medium ${(p.estimatedProfit || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(p.estimatedProfit)}</td>
                </tr>
              ))}
              {spvs.length === 0 && (<tr><td colSpan={6} className="px-3 py-8 text-center text-black/40">Nema projekata</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aktivnost */}
      {activity.length > 0 && (
        <div>
          <h2 className="text-[16px] font-bold text-black mb-3">Nedavna aktivnost</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
            {activity.map((a) => (
              <div key={a.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-[12px] font-medium text-black">{a.action}</span>
                  <span className="text-[11px] text-black/40 ml-2">{a.entityType}</span>
                </div>
                <span className="text-[11px] text-black/40">{a.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
