"use client";
import { useTransactions, formatEur } from "@/lib/data-client";
export default function BlagajnaSaldoPage() {
  const { data: transactions, loading: transactionsLoading } = useTransactions();

  if (transactionsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  let running = 0;
  const rows = transactions.map(t => { running += t.credit > 0 ? (t.credit > 0 ? t.credit : t.debit) : -(t.credit > 0 ? t.credit : t.debit); return { ...t, saldo: running }; });
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Blagajna - Saldo</h1></div><div className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="text-[12px] text-black/50">Trenutni saldo</div><div className={`text-3xl font-bold ${running >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(running)}</div></div><div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2 font-semibold">Datum</th><th className="text-left px-3 py-2 font-semibold">Opis</th><th className="text-right px-3 py-2 font-semibold">Iznos</th><th className="text-right px-3 py-2 font-semibold">Saldo</th></tr></thead><tbody>{rows.map(r => (<tr key={r.id} className="border-b border-gray-50"><td className="px-3 py-2 text-black/50">{r.date}</td><td className="px-3 py-2">{r.description}</td><td className={`px-3 py-2 text-right font-bold ${r.credit > 0 ? "text-green-600" : "text-red-600"}`}>{r.credit > 0 ? "+" : "-"}{formatEur(r.balance)}</td><td className="px-3 py-2 text-right font-medium">{formatEur(r.saldo)}</td></tr>))}</tbody></table></div></div>);
}



