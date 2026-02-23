"use client";
import { useSpvs, usePnlMonths, useIssuedInvoices, useReceivedInvoices, useTokRequests, formatEur } from "@/lib/data-client";;
export default function CoreCoreDashboardPage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();
  const { data: receivedInvoices, loading: receivedInvoicesLoading } = useReceivedInvoices();
  const { data: tokRequests, loading: tokRequestsLoading } = useTokRequests();

  if (spvsLoading || pnlMonthsLoading || issuedInvoicesLoading || receivedInvoicesLoading || tokRequestsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const totalRev = pnlMonths.reduce((s, m) => s + m.revenue, 0);
  const totalExp = pnlMonths.reduce((s, m) => s + m.expenses, 0);
  const openTok = tokRequests.filter(t => (t.status as string) === "otvoren").length;
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">CORE Dashboard</h1></div>
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-blue-600">{spvs.length}</div><div className="text-[12px] text-black/50">SPV-ova</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-green-600">{formatEur(totalRev)}</div><div className="text-[12px] text-black/50">Prihodi</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-red-600">{formatEur(totalExp)}</div><div className="text-[12px] text-black/50">Rashodi</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-amber-600">{openTok}</div><div className="text-[12px] text-black/50">Otvoreni TOK</div></div>
      </div>
    </div>
  );
}
