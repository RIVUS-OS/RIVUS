"use client";

import { useParams } from "next/navigation";
import { useSpvById, useAccountantBySpv, useVerticalsBySpv, useBanks } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function SpvKorisniciPage() {
  const { id } = useParams();
  const spvId = id as string;

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('user_manage');
  const writeDisabled = isSafe || isLockdown || isForensic;

  const { data: banks, loading: banksLoading } = useBanks();
  const { data: spv } = useSpvById(spvId);
  const { data: acc } = useAccountantBySpv(spvId);
  const { data: verticals } = useVerticalsBySpv(spvId);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: 'SPV_USERS_VIEW', entity_type: 'user_assignment', spv_id: spvId, details: { context: 'control_room' } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) {
    return (<div className="flex items-center justify-center h-64"><div className="text-center">
      <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
      <p className="text-sm text-gray-500 mt-1">Nemate dozvolu za upravljanje korisnicima.</p>
    </div></div>);
  }

  if (modeLoading || permLoading || banksLoading) {
    return (<div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>);
  }

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  const bank = banks.find(b => b.id === spv.bankId);

  const users = [
    { role: "CORE Admin", name: "Jurke Maricic", email: "core@rivus.hr", access: "Puni pristup", ndaStatus: "N/A", dpaStatus: "N/A" },
    ...(acc ? [{ role: "Knjigovodja", name: acc.name, email: acc.email, access: "Financije, dokumenti", ndaStatus: "Provjeri", dpaStatus: "Provjeri" }] : []),
    ...(bank ? [{ role: "Banka", name: bank.name, email: bank.contact, access: "Evaluacija, dokumenti", ndaStatus: "Provjeri", dpaStatus: "N/A" }] : []),
    ...verticals.map(v => ({ role: "Vertikala", name: v.name, email: v.contact, access: "Zadaci, dokumenti", ndaStatus: v.ndaSigned ? "Potpisan" : "Nedostaje", dpaStatus: "Provjeri" })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">Korisnici</h1>
          <p className="text-[13px] text-black/50 mt-0.5">{users.length} korisnika s pristupom</p>
        </div>
        <button
          disabled={writeDisabled}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${writeDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'apple-blue-btn'}`}
        >
          + Dodijeli korisnika
        </button>
      </div>

      {/* P19: NDA/DPA gate notice */}
      <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700">
        Assignment bez NDA/DPA = HARD BLOCK (A10-K4). Offboarding: pristup prestaje odmah. Quarterly review obavezan.
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-4 py-3 font-semibold text-black/70">Uloga</th>
            <th className="text-left px-4 py-3 font-semibold text-black/70">Naziv</th>
            <th className="text-left px-4 py-3 font-semibold text-black/70">Kontakt</th>
            <th className="text-left px-4 py-3 font-semibold text-black/70">Pristup</th>
            <th className="text-center px-4 py-3 font-semibold text-black/70">NDA</th>
            <th className="text-center px-4 py-3 font-semibold text-black/70">DPA</th>
          </tr></thead>
          <tbody>{users.map((u, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">{u.role}</span></td>
              <td className="px-4 py-3 font-medium text-black">{u.name}</td>
              <td className="px-4 py-3 text-black/50">{u.email}</td>
              <td className="px-4 py-3 text-black/40">{u.access}</td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  u.ndaStatus === "Potpisan" ? "bg-green-100 text-green-700" :
                  u.ndaStatus === "Nedostaje" ? "bg-red-100 text-red-700" :
                  u.ndaStatus === "N/A" ? "bg-gray-100 text-gray-500" :
                  "bg-amber-100 text-amber-700"
                }`}>{u.ndaStatus}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  u.dpaStatus === "N/A" ? "bg-gray-100 text-gray-500" : "bg-amber-100 text-amber-700"
                }`}>{u.dpaStatus}</span>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
