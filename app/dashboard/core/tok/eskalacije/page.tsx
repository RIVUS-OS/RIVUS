"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle, ArrowLeft, Clock, User, Building2, ArrowRight,
} from "lucide-react";

const MOCK_ESCALATIONS = [
  {
    id: "TOK-002",
    title: "Geodetski elaborat kasni — potrebna intervencija",
    spv: "SAN-01",
    createdBy: "Arhitekt d.o.o.",
    assignedTo: "CORE",
    escalatedTo: "Jurke Maričić",
    priority: "Kritičan",
    category: "Projektiranje",
    created: "15.02.2026.",
    deadline: "17.02.2026.",
    escalatedAt: "16.02.2026.",
    reason: "Geodet nije odgovorio na zahtjev 48 sati. Blokira izradu idejnog projekta.",
    slaBreached: true,
  },
];

export default function TokEskalacijePage() {
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
          <AlertTriangle size={20} className="text-red-500" />
          <h1 className="text-[22px] font-bold text-black">Eskalacije</h1>
          <span className="text-[13px] px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
            {MOCK_ESCALATIONS.length}
          </span>
        </div>
        <p className="text-[13px] text-black/50 mt-0.5">TOK zahtjevi eskalirani na CORE — potrebna hitna intervencija</p>
      </div>

      {MOCK_ESCALATIONS.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <CheckCircle size={32} className="text-green-500 mx-auto mb-3" />
          <p className="text-[15px] font-semibold text-black">Nema eskalacija</p>
          <p className="text-[13px] text-black/50 mt-1">Svi TOK zahtjevi se rješavaju u roku</p>
        </div>
      ) : (
        <div className="space-y-4">
          {MOCK_ESCALATIONS.map((tok) => (
            <div key={tok.id} className="bg-white rounded-xl border border-red-200 overflow-hidden">
              <div className="bg-red-50 px-5 py-3 flex items-center justify-between border-b border-red-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={16} className="text-red-600" />
                  <span className="text-[13px] font-bold text-red-800">{tok.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-200 text-red-800 font-semibold">
                    {tok.priority}
                  </span>
                  {tok.slaBreached && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-semibold flex items-center gap-1">
                      <Clock size={9} /> SLA probijen
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-red-600">Eskalirano: {tok.escalatedAt}</span>
              </div>

              <div className="p-5">
                <h3 className="text-[15px] font-semibold text-black mb-2">{tok.title}</h3>

                <div className="bg-red-50 rounded-lg p-3 mb-4">
                  <p className="text-[12px] font-semibold text-red-800 mb-1">Razlog eskalacije:</p>
                  <p className="text-[13px] text-red-700">{tok.reason}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[12px]">
                  <div>
                    <span className="text-black/40">SPV:</span>
                    <span className="ml-2 font-medium text-black">{tok.spv}</span>
                  </div>
                  <div>
                    <span className="text-black/40">Kategorija:</span>
                    <span className="ml-2 font-medium text-black">{tok.category}</span>
                  </div>
                  <div>
                    <span className="text-black/40">Kreirao:</span>
                    <span className="ml-2 font-medium text-black">{tok.createdBy}</span>
                  </div>
                  <div>
                    <span className="text-black/40">Eskalirano na:</span>
                    <span className="ml-2 font-medium text-black">{tok.escalatedTo}</span>
                  </div>
                  <div>
                    <span className="text-black/40">Kreirano:</span>
                    <span className="ml-2 font-medium text-black">{tok.created}</span>
                  </div>
                  <div>
                    <span className="text-black/40">Rok:</span>
                    <span className="ml-2 font-semibold text-red-600">{tok.deadline}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 rounded-lg bg-[#007AFF] text-white text-[13px] font-semibold hover:bg-[#0066DD] transition-colors">
                    Preuzmi i riješi
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-black/70 hover:bg-gray-50 transition-colors">
                    Preraspodijeli
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/core/spv/${tok.spv}`)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-black/70 hover:bg-gray-50 transition-colors"
                  >
                    Otvori SPV
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CheckCircle({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
