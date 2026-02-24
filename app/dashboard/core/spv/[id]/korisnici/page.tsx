"use client";

import { useParams } from "next/navigation";
import { useSpvById, useAccountantBySpv, useVerticalsBySpv, useBanks } from "@/lib/data-client";

export default function SpvKorisniciPage() {
  const { data: banks, loading: banksLoading } = useBanks();

  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: acc } = useAccountantBySpv(id as string);
  const { data: verticals } = useVerticalsBySpv(id as string);
  if (banksLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const bank = banks.find(b => b.id === spv.bankId);

  const users = [
    { role: "CORE Admin", name: "Jurke Maricic", email: "core@rivus.hr", access: "Puni pristup" },
    ...(acc ? [{ role: "Knjigovodja", name: acc.name, email: acc.email, access: "Financije, dokumenti" }] : []),
    ...(bank ? [{ role: "Banka", name: bank.name, email: bank.contact, access: "Evaluacija, dokumenti" }] : []),
    ...verticals.map(v => ({ role: "Vertikala", name: v.name, email: v.contact, access: "Zadaci, dokumenti" })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Korisnici</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{users.length} korisnika s pristupom</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-4 py-3 font-semibold text-black/70">Uloga</th>
            <th className="text-left px-4 py-3 font-semibold text-black/70">Naziv</th>
            <th className="text-left px-4 py-3 font-semibold text-black/70">Kontakt</th>
            <th className="text-left px-4 py-3 font-semibold text-black/70">Pristup</th>
          </tr></thead>
          <tbody>{users.map((u, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">{u.role}</span></td>
              <td className="px-4 py-3 font-medium text-black">{u.name}</td>
              <td className="px-4 py-3 text-black/50">{u.email}</td>
              <td className="px-4 py-3 text-black/40">{u.access}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
