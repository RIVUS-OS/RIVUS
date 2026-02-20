"use client";
export default function CoreERacuniPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">eRacuni</h1><p className="text-[13px] text-black/50 mt-0.5">Integracija s FINA eRacun sustavom</p></div>
      <div className="bg-white rounded-xl border border-amber-200 p-6 text-center">
        <div className="text-[48px]">🔗</div>
        <div className="text-[16px] font-bold text-amber-600 mt-2">U pripremi</div>
        <div className="text-[12px] text-black/50 mt-1">eRacun integracija bit ce dostupna nakon registracije kod FINA</div>
        <div className="mt-4 space-y-1 text-[11px] text-black/40">
          <div>Preduvjeti: OIB registracija, FINA pristupni podaci, SSL certifikat</div>
          <div>Planirana aktivacija: Phase 2 (2027+)</div>
        </div>
      </div>
    </div>
  );
}
