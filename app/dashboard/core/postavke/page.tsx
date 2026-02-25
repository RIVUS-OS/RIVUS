"use client";
export default function CorePostavkePage() {
  const settings = [
    { group: "Platforma", items: ["Naziv platforme", "Logo", "Domena", "Jezik", "Valuta"] },
    { group: "Notifikacije", items: ["Email obavijesti", "SLA upozorenja", "Eskalacije", "Tjedni izvjestaj"] },
    { group: "Sigurnost", items: ["2FA", "Session timeout", "IP whitelist", "Audit log"] },
    { group: "Integracije", items: ["eRacun", "KPD", "FINA", "Supabase"] },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Postavke platforme</h1></div>
      {settings.map(s => (
        <div key={s.group} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[14px] font-bold text-black mb-3">{s.group}</div>
          <div className="space-y-2">{s.items.map(item => (
            <div key={item} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-[12px] text-black/70">{item}</span>
              <div className="h-8 w-48 bg-gray-50 rounded-lg border border-gray-200" />
            </div>
          ))}</div>
        </div>
      ))}
      <div className="text-[11px] text-black/30 italic">Postavke aktivne nakon Phase B (auth + RLS)</div>
    </div>
  );
}
