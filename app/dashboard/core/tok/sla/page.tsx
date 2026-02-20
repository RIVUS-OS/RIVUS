"use client";

import { useRouter } from "next/navigation";
import {
  Clock, ArrowLeft, AlertTriangle, Building2, User, ArrowRight,
} from "lucide-react";

const MOCK_SLA_BREACHES = [
  {
    id: "TOK-002",
    title: "Geodetski elaborat kasni — potrebna intervencija",
    spv: "SAN-01",
    assignedTo: "CORE",
    category: "Projektiranje",
    deadline: "17.02.2026.",
    breachedAt: "17.02.2026. 18:00",
    hoursOverdue: 72,
    status: "Eskaliran",
  },
];

export default function TokSlaPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard/core/tok")}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#007AFF] hover:bg-[#007AFF]/10 px-3 py-1.5 rounded-lg transition-all"
        >
          <ArrowLeft size={14} />
          TOK kontrola
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-red-500" />
          <h1 className="text-[22px] font-bold text-black">SLA prekoračenja</h1>
          <span className="text-[13px] px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
            {MOCK_SLA_BREACHES.length}
          </span>
        </div>
        <p className="text-[13px] text-black/50 mt-0.5">TOK zahtjevi koji su prekoračili definirani rok rješavanja</p>
      </div>

      {/* SLA SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[12px] text-black/50 font-medium">Ukupno probijenih</div>
          <div className="text-[24px] font-bold text-red-600 mt-1">{MOCK_SLA_BREACHES.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[12px] text-black/50 font-medium">Prosječno kašnjenje</div>
          <div className="text-[24px] font-bold text-amber-600 mt-1">
            {MOCK_SLA_BREACHES.length > 0
              ? `${Math.round(MOCK_SLA_BREACHES.reduce((s, x) => s + x.hoursOverdue, 0) / MOCK_SLA_BREACHES.length)}h`
              : "—"
            }
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[12px] text-black/50 font-medium">SLA uspješnost</div>
          <div className="text-[24px] font-bold text-green-600 mt-1">80%</div>
          <div className="text-[11px] text-black/40">4/5 riješeno u roku</div>
        </div>
      </div>

      {/* LISTA */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-100 px-5 py-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500" />
          <span className="text-[14px] font-semibold text-black">Aktivna prekoračenja</span>
        </div>
        {MOCK_SLA_BREACHES.length === 0 ? (
          <div className="px-5 py-8 text-center text-[13px] text-black/40">
            Nema SLA prekoračenja — svi zahtjevi su riješeni u roku
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {MOCK_SLA_BREACHES.map((tok) => (
              <div
                key={tok.id}
                className="px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => alert(`TOK detail za ${tok.id} — U izradi`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] font-bold text-black/40">{tok.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white font-semibold flex items-center gap-1">
                        <Clock size={9} /> {tok.hoursOverdue}h prekoračeno
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                        {tok.status}
                      </span>
                    </div>
                    <p className="text-[14px] font-semibold text-black">{tok.title}</p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-[11px] text-black/40 flex items-center gap-1">
                        <Building2 size={10} /> {tok.spv}
                      </span>
                      <span className="text-[11px] text-black/40">→ {tok.assignedTo}</span>
                      <span className="text-[11px] text-black/40">{tok.category}</span>
                      <span className="text-[11px] text-red-500 font-medium">Rok bio: {tok.deadline}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-black/20 flex-shrink-0 mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
