"use client";
export default function CoreIzvozPage() {
  const formats = [
    { name: "CSV Export", desc: "Tablicni podaci za Excel", icon: "📊" },
    { name: "PDF Timeline", desc: "Vizualni pregled projekta", icon: "📄" },
    { name: "JSON API", desc: "Strojno citljivi podaci", icon: "🔗" },
    { name: "Excel Report", desc: "Formatirani izvjestaj", icon: "📈" },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Izvoz podataka</h1></div>
      <div className="grid grid-cols-2 gap-3">{formats.map(f => (<div key={f.name} className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="text-[36px]">{f.icon}</div><div className="text-[14px] font-bold mt-2">{f.name}</div><div className="text-[12px] text-black/50">{f.desc}</div><button className="mt-3 px-4 py-2 bg-gray-100 rounded-lg text-[12px] font-semibold opacity-50 cursor-not-allowed">Izvezi</button></div>))}</div>
    </div>
  );
}
