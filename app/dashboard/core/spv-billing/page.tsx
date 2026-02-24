"use client";
import { useSpvs, useContracts, formatEur } from "@/lib/data-client";
export default function CoreSpvBillingPage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: contracts, loading: contractsLoading } = useContracts();

  if (spvsLoading || contractsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const billing = spvs.map(p => { const contract = contracts.find(c => c.type === "CORE-SPV" && c.partyBId === p.id); return { id: p.id, name: p.name, fee: contract?.monthlyFee || 0, status: contract?.status || "nema" }; });
  const totalMonthly = billing.reduce((s, b) => s + b.fee, 0);
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">SPV naplata</h1><p className="text-[13px] text-black/50 mt-0.5">Mjesecni prihod: {formatEur(totalMonthly)}</p></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold">SPV</th><th className="text-right px-3 py-2.5 font-semibold">Mjesecni fee</th><th className="text-center px-3 py-2.5 font-semibold">Status</th></tr></thead><tbody>{billing.map(b => (<tr key={b.id} className="border-b border-gray-50"><td className="px-3 py-2.5 font-bold">{b.id} <span className="text-black/50 font-normal">{b.name}</span></td><td className="px-3 py-2.5 text-right font-bold text-blue-600">{b.fee > 0 ? formatEur(b.fee) : "-"}</td><td className="px-3 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100">{b.status}</span></td></tr>))}</tbody></table></div>
    </div>
  );
}
