"use client";

import { TRANSACTIONS, getCurrentBalance, formatEur } from "@/lib/mock-data";

export default function BlagajnaPage() {
  const balance = getCurrentBalance();
  const totalCredit = TRANSACTIONS.reduce((s, t) => s + t.credit, 0);
  const totalDebit = TRANSACTIONS.reduce((s, t) => s + t.debit, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Blagajna</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{TRANSACTIONS.length} transakcija | Saldo: {formatEur(balance)}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{formatEur(balance)}</div>
          <div className="text-[12px] text-black/50">Trenutni saldo</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{formatEur(totalCredit)}</div>
          <div className="text-[12px] text-black/50">Ukupne uplate</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{formatEur(totalDebit)}</div>
          <div className="text-[12px] text-black/50">Ukupne isplate</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Opis</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Ref.</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
              <th className="text-right px-3 py-2.5 font-semibold text-green-700">Uplata</th>
              <th className="text-right px-3 py-2.5 font-semibold text-red-700">Isplata</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map(tx => (
              <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2.5 text-black/70">{tx.date}</td>
                <td className="px-3 py-2.5 text-black">{tx.description}</td>
                <td className="px-3 py-2.5 text-black/40 text-[11px]">{tx.invoiceRef || "-"}</td>
                <td className="px-3 py-2.5 text-black/50">{tx.spvId || "CORE"}</td>
                <td className="px-3 py-2.5 text-right font-medium text-green-600">
                  {tx.credit > 0 ? formatEur(tx.credit) : ""}
                </td>
                <td className="px-3 py-2.5 text-right font-medium text-red-600">
                  {tx.debit > 0 ? formatEur(tx.debit) : ""}
                </td>
                <td className={`px-3 py-2.5 text-right font-bold ${tx.balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                  {formatEur(tx.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
