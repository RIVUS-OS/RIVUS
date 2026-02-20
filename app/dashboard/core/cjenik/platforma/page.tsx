"use client";
export default function CjenikPlatformaPage() {
  const items = [
    { name: "Osnovni pristup", desc: "Dashboard, dokumenti, dnevnik", price: "200 EUR/mj" },
    { name: "Napredni pristup", desc: "+ financije, TOK, vertikale", price: "500 EUR/mj" },
    { name: "Enterprise", desc: "Sve + API + prilagodbe", price: "Po dogovoru" },
  ];
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Cjenik - Platforma</h1></div><div className="space-y-2">{items.map(i => (<div key={i.name} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center"><div><div className="text-[14px] font-bold">{i.name}</div><div className="text-[12px] text-black/50">{i.desc}</div></div><span className="text-[16px] font-bold text-blue-600">{i.price}</span></div>))}</div></div>);
}
