"use client";
export default function CoreCorePostavkePage() {
  const configs = [
    { name: "RIVUS CORE d.o.o.", oib: "XXXXXXXX", nkd: "62.10.9, 70.22.0", status: "aktivan" },
    { name: "RIVUS Holding d.o.o.", oib: "XXXXXXXX", nkd: "70.10.0", status: "aktivan" },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">CORE postavke</h1></div>
      {configs.map(c => (
        <div key={c.name} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex justify-between items-start">
            <div><div className="text-[14px] font-bold">{c.name}</div><div className="text-[12px] text-black/50">OIB: {c.oib} | NKD: {c.nkd}</div></div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">{c.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
