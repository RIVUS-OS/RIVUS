"use client";

export default function AccountingProfilPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Profil - Knjigovodstvo</h1></div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {["Ime i prezime", "Email", "Telefon", "Tvrtka", "OIB", "Uloga"].map(label => (
            <div key={label}><label className="text-[12px] text-black/50 block mb-1">{label}</label><div className="h-10 bg-gray-50 rounded-lg border border-gray-200 px-3 flex items-center text-[13px] text-black/30">--</div></div>
          ))}
        </div>
        <div className="pt-4 border-t border-gray-100 flex gap-3">
          <button className="px-4 py-2 bg-black text-white rounded-lg text-[13px] font-semibold opacity-50 cursor-not-allowed">Spremi promjene</button>
          <button className="px-4 py-2 bg-gray-100 text-black rounded-lg text-[13px] font-semibold opacity-50 cursor-not-allowed">Promijeni lozinku</button>
        </div>
        <div className="text-[11px] text-black/30 italic">Profil ce biti aktivan nakon Supabase Auth integracije (Phase B)</div>
      </div>
    </div>
  );
}
