"use client";
export default function CoreUlogePage() {
  const roles = [
    { name: "CORE Admin", desc: "Puni pristup svim SPV-ovima i postavkama", count: 1, color: "bg-black text-white" },
    { name: "Owner", desc: "Vlasnik SPV-a, pristup vlastitim projektima", count: 3, color: "bg-blue-100 text-blue-700" },
    { name: "Accounting", desc: "Knjigovodstveni pristup financijama", count: 2, color: "bg-amber-100 text-amber-700" },
    { name: "Bank", desc: "Evaluacija i pracenje kredita", count: 2, color: "bg-green-100 text-green-700" },
    { name: "Vertical", desc: "Specijalizirani dobavljaci usluga", count: 5, color: "bg-purple-100 text-purple-700" },
    { name: "Holding", desc: "Strateski pregled portfolija", count: 1, color: "bg-gray-800 text-white" },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Uloge i dozvole</h1></div>
      <div className="space-y-2">{roles.map(r => (
        <div key={r.name} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3"><span className={`px-3 py-1 rounded-full text-[11px] font-bold ${r.color}`}>{r.name}</span><span className="text-[12px] text-black/50">{r.desc}</span></div>
          <span className="text-[13px] font-bold text-black">{r.count}</span>
        </div>
      ))}</div>
    </div>
  );
}
