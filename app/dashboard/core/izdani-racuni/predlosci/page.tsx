"use client";

export default function IzdaniPredlosciPage() {
  const templates = [
    { name: "Platform fee - mjesecni", desc: "Standardni mjesecni platform fee za SPV", amount: "500 EUR" },
    { name: "Brand licenca", desc: "RIVUS brand licenca", amount: "200 EUR" },
    { name: "PM usluga", desc: "Project management mjesecni", amount: "800 EUR" },
    { name: "Success fee", desc: "Success fee po prodaji", amount: "% od prodaje" },
    { name: "Vertikala provizija", desc: "Provizija za vertikalu", amount: "8-12%" },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Predlosci racuna</h1><p className="text-[13px] text-black/50 mt-0.5">{templates.length} predlozaka</p></div>
      <div className="space-y-2">{templates.map(t => (
        <div key={t.name} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
          <div><div className="text-[14px] font-bold text-black">{t.name}</div><div className="text-[12px] text-black/50">{t.desc}</div></div>
          <span className="text-[13px] font-bold text-blue-600">{t.amount}</span>
        </div>
      ))}</div>
    </div>
  );
}
