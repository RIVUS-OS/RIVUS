"use client";
import { ACTIVITY_LOG } from "@/lib/mock-data";
export default function CoreAktivnostiPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Aktivnosti</h1><p className="text-[13px] text-black/50 mt-0.5">{ACTIVITY_LOG.length} zapisa</p></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th><th className="text-left px-3 py-2.5 font-semibold text-black/70">Akcija</th><th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th><th className="text-left px-3 py-2.5 font-semibold text-black/70">Korisnik</th></tr></thead><tbody>{ACTIVITY_LOG.slice(0, 20).map(a => (<tr key={a.id} className="border-b border-gray-50"><td className="px-3 py-2.5 text-black/50">{a.timestamp}</td><td className="px-3 py-2.5">{a.action}</td><td className="px-3 py-2.5 text-black/50">{a.spvId}</td><td className="px-3 py-2.5 text-black/50">{a.actor}</td></tr>))}</tbody></table></div>
    </div>
  );
}

