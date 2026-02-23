"use client";
import { useIssuedInvoices, formatEur } from "@/lib/data-client";;
export default function PrihodiPlatformaPage() {
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();

  if (issuedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const platform = issuedInvoices.filter(i => i.category === "platform_fee");
  const total = platform.reduce((s, i) => s + i.totalAmount, 0);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Prihodi - Platforma</h1><p className="text-[13px] text-black/50 mt-0.5">{platform.length} platform fee racuna</p></div><div className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="text-3xl font-bold text-green-600">{formatEur(total)}</div><div className="text-[12px] text-black/50 mt-1">Ukupni platform fee prihod</div></div></div>);
}
