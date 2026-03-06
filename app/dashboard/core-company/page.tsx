"use client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePnlMonths, useIssuedInvoices, useUnpaidInvoices } from "@/lib/data-client";
import { useBillingRecords } from "@/lib/hooks/block-c";
import { Euro, FileText, TrendingUp, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CoreCompanyDashboard() {
  const { mode } = usePlatformMode();
  const router = useRouter();
  const { data: pnl } = usePnlMonths();
  const { data: invoices } = useIssuedInvoices();
  const { data: unpaid } = useUnpaidInvoices();
  const { data: billing } = useBillingRecords();

  const totalRevenue = pnl.reduce((s, p) => s + (p.totalRevenue || 0), 0);
  const totalExpenses = pnl.reduce((s, p) => s + (p.totalExpenses || 0), 0);
  const net = totalRevenue - totalExpenses;
  const pendingBilling = billing.filter(b => b.status === "PENDING" || b.status === "OVERDUE").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">RIVUS CORE d.o.o.</h1>
        <p className="text-[14px] text-[#6E6E73]">Revenue Engine — financije firme, naplata, fakturiranje</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <KpiCard icon={Euro} label="Prihodi" value={`${totalRevenue.toLocaleString("hr")} €`} color="emerald" onClick={() => router.push("/dashboard/core-company/prihodi")} />
        <KpiCard icon={Euro} label="Rashodi" value={`${totalExpenses.toLocaleString("hr")} €`} color="red" onClick={() => router.push("/dashboard/core-company/rashodi")} />
        <KpiCard icon={TrendingUp} label="Neto" value={`${net.toLocaleString("hr")} €`} color={net >= 0 ? "emerald" : "red"} onClick={() => {}} />
        <KpiCard icon={AlertTriangle} label="Pending naplata" value={pendingBilling.toString()} color={pendingBilling > 0 ? "amber" : "emerald"} onClick={() => router.push("/dashboard/core-company/billing")} />
      </div>

      {/* Unpaid invoices */}
      <div className="bg-white rounded-2xl border border-[#E8E8EC] mb-4">
        <div className="px-5 py-3.5 border-b border-[#E8E8EC]"><span className="text-[13px] font-bold text-[#0B0B0C]">Neplaćeni računi ({unpaid.length})</span></div>
        <div className="divide-y divide-[#F5F5F7]">
          {unpaid.length === 0 && <div className="px-5 py-6 text-center text-[13px] text-[#C7C7CC]">Svi računi plaćeni ✓</div>}
          {unpaid.slice(0, 5).map(i => (
            <div key={i.id} className="px-5 py-3 flex items-center gap-4">
              <FileText size={14} className="text-[#8E8E93]" />
              <div className="flex-1"><div className="text-[13px] font-semibold text-[#0B0B0C]">{i.number || "—"}</div><div className="text-[11px] text-[#8E8E93]">{i.client} · {i.dueDate ? new Date(i.dueDate).toLocaleDateString("hr") : "—"}</div></div>
              <span className="text-[13px] font-bold text-red-600">{(i.totalAmount || i.amount || 0).toLocaleString("hr")} €</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje komercijalne događaje i prijedloge fakturiranja kao operativni alat. Porezna, računovodstvena i fiskalna ispravnost verificira se prema važećem hrvatskom pravu. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color, onClick }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string; color: string; onClick: () => void }) {
  const c: Record<string, string> = { emerald: "text-emerald-600", red: "text-red-600", amber: "text-amber-600" };
  return (
    <button onClick={onClick} className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3.5 text-left hover:border-[#2563EB]/30 transition-all">
      <Icon size={16} className={c[color] || "text-[#8E8E93]"} />
      <div className={`text-[22px] font-bold mt-1 ${c[color] || "text-[#0B0B0C]"}`}>{value}</div>
      <div className="text-[11px] text-[#8E8E93]">{label}</div>
    </button>
  );
}
