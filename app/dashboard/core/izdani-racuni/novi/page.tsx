"use client";

export default function IzdaniNoviPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Novi racun</h1><p className="text-[13px] text-black/50 mt-0.5">Kreiranje novog izdanog racuna</p></div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {["SPV / Klijent", "Tip usluge", "Iznos (EUR)", "PDV stopa", "Rok placanja", "Opis"].map(label => (
            <div key={label}><label className="text-[12px] text-black/50 block mb-1">{label}</label><div className="h-10 bg-gray-50 rounded-lg border border-gray-200" /></div>
          ))}
        </div>
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button className="px-4 py-2 bg-black text-white rounded-lg text-[13px] font-semibold opacity-50 cursor-not-allowed">Izdaj racun</button>
          <button className="px-4 py-2 bg-gray-100 text-black rounded-lg text-[13px] font-semibold opacity-50 cursor-not-allowed">Spremi nacrt</button>
        </div>
        <div className="text-[11px] text-black/30 italic">Forma ce biti aktivna nakon integracije s eRacun sustavom</div>
      </div>
    </div>
  );
}
