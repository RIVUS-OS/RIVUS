"use client";
import { useAccountants, useSpvs } from "@/lib/data-client";
export default function CoreAccountingControlPage() {
  const { data: accountants, loading: accountantsLoading } = useAccountants();
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (accountantsLoading || spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const coverage = spvs.map(p => ({ id: p.id, name: p.name, covered: accountants.some(a => a.coversSpvs.includes(p.id)) }));
  const uncovered = coverage.filter(c => !c.covered);
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Kontrola racunovodstva</h1></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-green-200 p-4 text-center"><div className="text-xl font-bold text-green-600">{coverage.filter(c => c.covered).length}</div><div className="text-[12px] text-black/50">Pokriveni SPV</div></div>
        <div className={`bg-white rounded-xl border p-4 text-center ${uncovered.length > 0 ? "border-red-200" : "border-green-200"}`}><div className={`text-xl font-bold ${uncovered.length > 0 ? "text-red-600" : "text-green-600"}`}>{uncovered.length}</div><div className="text-[12px] text-black/50">Nepokriveni SPV</div></div>
      </div>
      {uncovered.length > 0 && <div className="bg-red-50 rounded-xl border border-red-200 p-4"><div className="text-[13px] font-bold text-red-700 mb-2">SPV bez knjigovodje:</div>{uncovered.map(u => <div key={u.id} className="text-[12px] text-red-600">{u.id} - {u.name}</div>)}</div>}
    </div>
  );
}
