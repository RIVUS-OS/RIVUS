"use client";
import { useVerticals, useAccountants, useBanks } from "@/lib/data-client";;
export default function CoreKorisniciPage() {
  const { data: verticals, loading: verticalsLoading } = useVerticals();
  const { data: accountants, loading: accountantsLoading } = useAccountants();
  const { data: banks, loading: banksLoading } = useBanks();

  if (verticalsLoading || accountantsLoading || banksLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const users = [
    ...verticals.map(v => ({ name: v.name, role: "Vertikala", type: v.type })),
    ...accountants.map(a => ({ name: a.name, role: "Knjigovodja", type: a.status })),
    ...banks.map(b => ({ name: b.name, role: "Banka", type: b.relationshipType })),
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Korisnici platforme</h1><p className="text-[13px] text-black/50 mt-0.5">{users.length} korisnika</p></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">Ime</th><th className="text-left px-3 py-2.5 font-semibold text-black/70">Uloga</th><th className="text-left px-3 py-2.5 font-semibold text-black/70">Tip</th></tr></thead><tbody>{users.map((u, i) => (<tr key={i} className="border-b border-gray-50"><td className="px-3 py-2.5 font-medium">{u.name}</td><td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">{u.role}</span></td><td className="px-3 py-2.5 text-black/50">{u.type}</td></tr>))}</tbody></table></div>
    </div>
  );
}
