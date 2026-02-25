"use client";
export default function CjenikPmPage() {
  const tiers = [
    { name: "Basic PM", hours: "do 10h/mj", price: "500 EUR/mj" },
    { name: "Standard PM", hours: "do 25h/mj", price: "800 EUR/mj" },
    { name: "Full PM", hours: "neograniceno", price: "1.200 EUR/mj" },
  ];
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Cjenik - PM usluge</h1></div><div className="space-y-2">{tiers.map(t => (<div key={t.name} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center"><div><div className="text-[14px] font-bold">{t.name}</div><div className="text-[12px] text-black/50">{t.hours}</div></div><span className="text-[16px] font-bold text-blue-600">{t.price}</span></div>))}</div></div>);
}
