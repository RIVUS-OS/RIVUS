"use client";
export default function CjenikPosebniPage() {
  const items = [
    { name: "Ekspresna evaluacija", desc: "Hitna analiza projekta", price: "1.500 EUR" },
    { name: "Due diligence paket", desc: "Kompletna provjera", price: "3.000 EUR" },
    { name: "Restrukturiranje SPV", desc: "Reorganizacija postojeceg projekta", price: "2.000 EUR" },
    { name: "Konzultacije (po satu)", desc: "Ad-hoc savjetovanje", price: "100 EUR/h" },
  ];
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Cjenik - Posebne usluge</h1></div><div className="space-y-2">{items.map(i => (<div key={i.name} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center"><div><div className="text-[14px] font-bold">{i.name}</div><div className="text-[12px] text-black/50">{i.desc}</div></div><span className="text-[16px] font-bold text-blue-600">{i.price}</span></div>))}</div></div>);
}
