"use client";
import { TRANSACTIONS, formatEur } from "@/lib/mock-data";
export default function BlagajnaPrometPage() {
  const uplate = TRANSACTIONS.filter(t => t.credit > 0).reduce((s,t) => s + (t.credit > 0 ? t.credit : t.debit), 0);
  const isplate = TRANSACTIONS.filter(t => t.debit > 0).reduce((s,t) => s + (t.credit > 0 ? t.credit : t.debit), 0);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Blagajna - Promet</h1></div><div className="grid grid-cols-3 gap-3"><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-green-600">{formatEur(uplate)}</div><div className="text-[12px] text-black/50">Uplate</div></div><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-red-600">{formatEur(isplate)}</div><div className="text-[12px] text-black/50">Isplate</div></div><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className={`text-xl font-bold ${uplate - isplate >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(uplate - isplate)}</div><div className="text-[12px] text-black/50">Neto</div></div></div></div>);
}



