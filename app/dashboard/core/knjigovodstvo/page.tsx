"use client";
import { useAccountants, useSpvs, formatEur } from "@/lib/data-client";
export default function CoreKnjigovodstvoPage() {
  const { data: accountants, loading: accountantsLoading } = useAccountants();
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (accountantsLoading || spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Knjigovodstvo - Pregled</h1></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="text-[14px] font-bold mb-2">Knjigovodje</div>{accountants.map(a => (<div key={a.id} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0 text-[12px]"><span>{a.name}</span><span className="font-bold">{formatEur(a.pricePerMonth)}/mj</span></div>))}</div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="text-[14px] font-bold mb-2">Pokrivenost SPV</div>{spvs.slice(0, 5).map(p => (<div key={p.id} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0 text-[12px]"><span>{p.id}</span><span className={accountants.some(a => a.coversSpvs.includes(p.id)) ? "text-green-600" : "text-red-600"}>{accountants.some(a => a.coversSpvs.includes(p.id)) ? "Pokriveno" : "Nedostaje"}</span></div>))}</div>
      </div>
    </div>
  );
}
