"use client";
import { useIssuedInvoices, formatEur } from "@/lib/data-client";
export default function PrihodiTipUslugePage() {
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();

  if (issuedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const byCat: Record<string, number> = {};
  issuedInvoices.forEach(i => { byCat[i.category] = (byCat[i.category] || 0) + i.totalAmount; });
  const catLabels: Record<string, string> = { platform_fee: "Platform fee", brand_license: "Brand licenca", pm_service: "PM usluga", success_fee: "Success fee", vertical_commission: "Vertikala provizija" };
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Prihodi - Po tipu usluge</h1></div><div className="space-y-2">{Object.entries(byCat).sort((a,b) => b[1] - a[1]).map(([cat, amt]) => (<div key={cat} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"><span className="text-[14px] font-bold text-black">{catLabels[cat] || cat}</span><span className="text-[16px] font-bold text-green-600">{formatEur(amt)}</span></div>))}</div></div>);
}
