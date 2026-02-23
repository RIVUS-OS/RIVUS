"use client";
import { useSpvs, useContracts, useIssuedInvoices, formatEur } from "@/lib/data-client";
export default function CoreServiceDashboardPage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: contracts, loading: contractsLoading } = useContracts();
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();

  if (spvsLoading || contractsLoading || issuedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const activeContracts = contracts.filter(c => (c.status as string) === "aktivan").length;
  const totalRevenue = issuedInvoices.reduce((s, i) => s + i.totalAmount, 0);
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Service Dashboard</h1></div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-blue-600">{activeContracts}</div><div className="text-[12px] text-black/50">Aktivni ugovori</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-green-600">{formatEur(totalRevenue)}</div><div className="text-[12px] text-black/50">Ukupni prihod</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-black">{spvs.length}</div><div className="text-[12px] text-black/50">Aktivni klijenti</div></div>
      </div>
    </div>
  );
}
