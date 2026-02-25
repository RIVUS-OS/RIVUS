"use client";
import { useSpvs, useVerticals, useAccountants, useBanks } from "@/lib/data-client";
export default function CoreOrkestacijaPage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: verticals, loading: verticalsLoading } = useVerticals();
  const { data: accountants, loading: accountantsLoading } = useAccountants();
  const { data: banks, loading: banksLoading } = useBanks();

  if (spvsLoading || verticalsLoading || accountantsLoading || banksLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Orkestracija</h1><p className="text-[13px] text-black/50 mt-0.5">RIVUS kao dirigent sustava</p></div>
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-blue-600">{spvs.length}</div><div className="text-[12px] text-black/50">SPV projekti</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-purple-600">{verticals.length}</div><div className="text-[12px] text-black/50">Vertikale</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-amber-600">{accountants.length}</div><div className="text-[12px] text-black/50">Knjigovodje</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-green-600">{banks.length}</div><div className="text-[12px] text-black/50">Banke</div></div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-[12px] text-black/50">CORE ne izvodi posao — CORE postavlja pravila, kontrolira kvalitetu, integrira vertikale kao clanove orkestra. Svaki SPV je partitura, svaka vertikala instrument.</div>
    </div>
  );
}
