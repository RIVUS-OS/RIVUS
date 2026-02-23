const fs = require('fs');
const code = `"use client";
import { useAccountants, useSpvs, useSpvsWithoutAccountant, formatEur } from "@/lib/data-client";
export default function KnjigovodjeNadzorPage() {
  const { data: accountants, loading: accountantsLoading } = useAccountants();
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: spvsWithout } = useSpvsWithoutAccountant();
  if (accountantsLoading || spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;
  const totalMonthlyCost = accountants.reduce((sum, a) => sum + a.pricePerMonth, 0);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Knjigovodje - Nadzor</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{accountants.length} knjigovodje | {formatEur(totalMonthlyCost)}/mj ukupni trosak | {spvsWithout.length} SPV bez knjigovodje</p>
      </div>
      {spvsWithout.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="text-[14px] font-bold text-red-700 mb-2">SPV-ovi bez knjigovodje ({spvsWithout.length})</div>
          <div className="flex flex-wrap gap-2">
            {spvsWithout.map(spv => (
              <span key={spv.id} className="text-[12px] px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-700 font-medium">
                {spv.id} - {spv.name}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accountants.map(acc => (
          <div key={acc.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[15px] font-bold text-black">{acc.name}</h2>
              <span className={\`text-[11px] px-2 py-0.5 rounded-full font-semibold \${
                acc.status === "aktivan" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }\`}>{acc.status === "aktivan" ? "Aktivan" : "Ugovor u pripremi"}</span>
            </div>
            <div className="text-[13px] font-semibold text-blue-600 mb-3">{formatEur(acc.pricePerMonth)} / mjesec</div>
            <div className="text-[12px] text-black/50 mb-1">Kontakt: {acc.contact} | {acc.email}</div>
            {acc.contractDate && <div className="text-[12px] text-black/50 mb-3">Ugovor od: {acc.contractDate}</div>}
            {acc.coversEntities.length > 0 && (
              <div className="mb-2">
                <div className="text-[11px] text-black/40 mb-1">Pokriva entitete:</div>
                <div className="flex flex-wrap gap-1">
                  {acc.coversEntities.map(e => (
                    <span key={e} className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">{e}</span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="text-[11px] text-black/40 mb-1">Pokriva SPV-ove ({acc.coversSpvs.length}):</div>
              {acc.coversSpvs.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {acc.coversSpvs.map(id => (
                    <span key={id} className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">{id}</span>
                  ))}
                </div>
              ) : (
                <span className="text-[11px] text-black/30">Nema dodijeljenih SPV-ova</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`;
fs.writeFileSync('app/dashboard/core/knjigovodje-nadzor/page.tsx', code);
console.log('FIXED - full file rewritten');