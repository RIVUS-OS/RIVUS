"use client";
import { useSpvs, useIssuedInvoices, formatEur } from "@/lib/data-client";
export default function CorePlatformFeesPage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();

  if (spvsLoading || issuedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const fees = issuedInvoices.filter(i => i.category === "platform_fee");
  const total = fees.reduce((s, i) => s + i.totalAmount, 0);
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Platformske naknade</h1><p className="text-[13px] text-black/50 mt-0.5">{fees.length} racuna, {formatEur(total)} ukupno</p></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold">Broj</th><th className="text-left px-3 py-2.5 font-semibold">SPV</th><th className="text-left px-3 py-2.5 font-semibold">Datum</th><th className="text-right px-3 py-2.5 font-semibold">Iznos</th><th className="text-center px-3 py-2.5 font-semibold">Status</th></tr></thead><tbody>{fees.map(f => (<tr key={f.id} className="border-b border-gray-50"><td className="px-3 py-2.5 font-bold">{f.number}</td><td className="px-3 py-2.5 text-black/50">{f.spvId}</td><td className="px-3 py-2.5 text-black/50">{f.date}</td><td className="px-3 py-2.5 text-right font-bold">{formatEur(f.totalAmount)}</td><td className="px-3 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100">{f.status}</span></td></tr>))}</tbody></table></div>
    </div>
  );
}
