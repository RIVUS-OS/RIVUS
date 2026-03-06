"use client";
import { useParams } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useMandatoryItems } from "@/lib/hooks/block-c";
import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

const TABS = ["Lifecycle", "Dokumenti", "Ugovori", "Blokade"] as const;

export default function SpvMandatoryPage() {
  const params = useParams();
  const spvId = params?.id as string;
  const { mode } = usePlatformMode();
  const { data: items, loading } = useMandatoryItems(spvId);
  const [tab, setTab] = useState<string>("Lifecycle");

  const completed = items.filter(i => i.status === "COMPLETED" || i.status === "WAIVED");
  const pending = items.filter(i => i.status !== "COMPLETED" && i.status !== "WAIVED");
  const blocking = items.filter(i => i.blocksTransition && i.status !== "COMPLETED" && i.status !== "WAIVED");

  const filtered = tab === "Lifecycle" ? items
    : tab === "Blokade" ? blocking
    : tab === "Dokumenti" ? items.filter(i => i.itemType === "DOCUMENT")
    : tab === "Ugovori" ? items.filter(i => i.itemType === "TASK")
    : items;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <AlertCircle size={24} strokeWidth={2} className="text-[#2563EB]" />
          <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Obvezni uvjeti</h1>
        </div>
        <p className="text-[14px] text-[#6E6E73]">{completed.length}/{items.length} ispunjeno{blocking.length > 0 ? ` · ${blocking.length} blokira prijelaz` : ""}</p>
      </div>

      {blocking.length > 0 && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <span className="text-[12px] font-semibold text-red-700">⚠ {blocking.length} obaveznih uvjeta blokira lifecycle prijelaz. Bez ispunjenja — HARD BLOCK.</span>
        </div>
      )}

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-[#E8E8EC] px-5 py-3 mb-5 flex items-center gap-4">
        <span className="text-[13px] font-semibold text-[#0B0B0C]">Napredak</span>
        <div className="flex-1 h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
          <div className="h-full bg-[#2563EB] rounded-full" style={{ width: items.length > 0 ? `${Math.round(completed.length / items.length * 100)}%` : "0%" }} />
        </div>
        <span className="text-[13px] font-bold text-[#2563EB]">{items.length > 0 ? Math.round(completed.length / items.length * 100) : 0}%</span>
      </div>

      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">
        {TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}{t === "Blokade" && blocking.length > 0 ? ` (${blocking.length})` : ""}</button>)}
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
        {loading && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Učitavanje...</div>}
        {!loading && filtered.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema stavki</div>}
        {filtered.map(m => (
          <div key={m.id} className="px-5 py-3.5 flex items-center gap-4">
            {m.status === "COMPLETED" || m.status === "WAIVED" ? <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" /> : <div className={`h-3 w-3 rounded-full flex-shrink-0 ${m.blocksTransition ? "bg-red-500" : "bg-amber-500"}`} />}
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#0B0B0C]">{m.title}</div>
              <div className="text-[11px] text-[#8E8E93]">{m.itemType || "—"}{m.dueDate ? ` · Rok: ${new Date(m.dueDate).toLocaleDateString("hr")}` : ""}</div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${m.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" : m.status === "WAIVED" ? "bg-gray-100 text-gray-600" : m.blocksTransition ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{m.status === "COMPLETED" ? "ISPUNJENO" : m.status === "WAIVED" ? "IZUZETO" : m.blocksTransition ? "BLOKIRA" : "PENDING"}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}

