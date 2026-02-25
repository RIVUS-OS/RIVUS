"use client";
import { useIssuedInvoices, formatEur } from "@/lib/data-client";
export default function DospjeliPoKlijentuPage() {
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();

  if (issuedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const overdue = issuedInvoices.filter(i => (i.status as string) === "kasni");
  const byClient: Record<string, { count: number; total: number }> = {};
  overdue.forEach(i => { byClient[i.client] = byClient[i.client] || { count: 0, total: 0 }; byClient[i.client].count++; byClient[i.client].total += i.totalAmount; });
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Dospjeli - Po klijentu</h1></div><div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">Klijent</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Racuna</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Dug</th></tr></thead><tbody>{Object.entries(byClient).map(([c, d]) => (<tr key={c} className="border-b border-gray-50"><td className="px-3 py-2.5 font-medium">{c}</td><td className="px-3 py-2.5 text-right">{d.count}</td><td className="px-3 py-2.5 text-right font-bold text-red-600">{formatEur(d.total)}</td></tr>))}</tbody></table></div></div>);
}
