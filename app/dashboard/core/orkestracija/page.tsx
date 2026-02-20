"use client";
import { SPVS, VERTICALS, ACCOUNTANTS, BANKS } from "@/lib/mock-data";
export default function CoreOrkestacijaPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Orkestracija</h1><p className="text-[13px] text-black/50 mt-0.5">RIVUS kao dirigent sustava</p></div>
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-blue-600">{SPVS.length}</div><div className="text-[12px] text-black/50">SPV projekti</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-purple-600">{VERTICALS.length}</div><div className="text-[12px] text-black/50">Vertikale</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-amber-600">{ACCOUNTANTS.length}</div><div className="text-[12px] text-black/50">Knjigovodje</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-green-600">{BANKS.length}</div><div className="text-[12px] text-black/50">Banke</div></div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-[12px] text-black/50">CORE ne izvodi posao — CORE postavlja pravila, kontrolira kvalitetu, integrira vertikale kao clanove orkestra. Svaki SPV je partitura, svaka vertikala instrument.</div>
    </div>
  );
}
