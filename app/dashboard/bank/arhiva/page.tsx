"use client";

import { useSpvs, formatEur } from "@/lib/data-client";

export default function BankArhivaPage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const archived = spvs.filter(p => (p.status as string) === "zatvoren" || (p.status as string) === "zavrsen");
  const active = spvs.filter(p => (p.status as string) !== "zatvoren");

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Arhiva</h1><p className="text-[13px] text-black/50 mt-0.5">{archived.length} arhiviranih | {active.length} aktivnih</p></div>
      {archived.length > 0 ? (
        <div className="space-y-2">{archived.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <span className="text-[14px] font-bold">{p.id} - {p.name}</span>
            <span className="text-[12px] text-black/50 ml-2">{formatEur(p.totalBudget)}</span>
          </div>
        ))}</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-[13px] text-black/40">Nema arhiviranih projekata - svi su aktivni</div>
      )}
    </div>
  );
}

