"use client";

import { useOverdueInvoices, formatEur } from "@/lib/data-client";;

export default function DospjeliPage() {
  const { data: overdue } = useOverdueInvoices();
  const total = overdue.reduce((s, i) => s + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Dospjeli racuni</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{overdue.length} racuna kasni | {formatEur(total)} ukupno dospjelo</p>
      </div>

      {overdue.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-[15px] font-semibold text-green-600">Nema dospjelih racuna</div>
        </div>
      ) : (
        <>
          <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{formatEur(total)}</div>
            <div className="text-[13px] text-red-500 mt-1">{overdue.length} racuna kasni</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-3 py-2.5 font-semibold text-black/70">Broj</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-black/70">Klijent</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-black/70">Opis</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dospijece</th>
                  <th className="text-right px-3 py-2.5 font-semibold text-black/70">Iznos</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-black/70">Kategorija</th>
                </tr>
              </thead>
              <tbody>
                {overdue.map(inv => (
                  <tr key={inv.id} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-red-700">{inv.number}</td>
                    <td className="px-3 py-2.5 text-black">{inv.client}</td>
                    <td className="px-3 py-2.5 text-black/50">{inv.spvId || "-"}</td>
                    <td className="px-3 py-2.5 text-black/70 max-w-[200px] truncate">{inv.description}</td>
                    <td className="px-3 py-2.5 text-red-600 font-medium">{inv.dueDate}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-red-700">{formatEur(inv.totalAmount)}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{inv.category}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
