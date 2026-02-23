"use client";
import { useTransactions, formatEur } from "@/lib/data-client";
export default function BlagajnaIzvodiPage() {
  const { data: transactions, loading: transactionsLoading } = useTransactions();

  if (transactionsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const months = Array.from(new Set(transactions.map(t => t.date.substring(0, 7))));
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Blagajna - Izvodi</h1><p className="text-[13px] text-black/50 mt-0.5">{months.length} mjeseci</p></div><div className="space-y-2">{months.map(m => { const txs = transactions.filter(t => t.date.startsWith(m)); const upl = txs.filter(t => t.credit > 0).reduce((s,t)=>s+(t.credit > 0 ? t.credit : t.debit),0); const isp = txs.filter(t => t.debit > 0).reduce((s,t)=>s+(t.credit > 0 ? t.credit : t.debit),0); return (<div key={m} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"><div><div className="text-[14px] font-bold">{m}</div><div className="text-[11px] text-black/40">{txs.length} transakcija</div></div><div className="flex gap-4 text-[13px]"><span className="text-green-600 font-bold">+{formatEur(upl)}</span><span className="text-red-600 font-bold">-{formatEur(isp)}</span></div></div>); })}</div></div>);
}




