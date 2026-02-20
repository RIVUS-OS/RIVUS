"use client";
export default function CorePorezneStopePage() {
  const taxes = [
    { name: "PDV - standardna", rate: "25%", desc: "Standardna stopa" },
    { name: "PDV - snizena", rate: "13%", desc: "Ugostiteljstvo, turizam" },
    { name: "PDV - najniza", rate: "5%", desc: "Knjige, lijekovi, kruh" },
    { name: "Porez na dobit", rate: "10/18%", desc: "10% do 1M EUR, 18% iznad" },
    { name: "Prirez Zagreb", rate: "18%", desc: "Prirez na porez na dohodak" },
    { name: "Transfer pricing", rate: "2.65%", desc: "Kamatna stopa (NN 150/25)" },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Porezne stope</h1><p className="text-[13px] text-black/50 mt-0.5">Vazece stope za RH</p></div>
      <div className="space-y-2">{taxes.map(t => (<div key={t.name} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center"><div><div className="text-[14px] font-bold">{t.name}</div><div className="text-[12px] text-black/50">{t.desc}</div></div><span className="text-[18px] font-bold text-blue-600">{t.rate}</span></div>))}</div>
    </div>
  );
}
