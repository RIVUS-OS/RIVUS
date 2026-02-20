"use client";

import { useRouter } from "next/navigation";
import { KpiCard, KpiGrid } from "@/components/KpiCard";
import { LifecycleFunnelPanel } from "@/components/core/LifecycleFunnelPanel";
import {
  Shield, AlertTriangle, Clock, FileText, CheckCircle,
  Lock, Bell, BarChart3, Search, Zap,
} from "lucide-react";

// === MOCK DATA ===
const MOCK_STAGES = [
  { stage: "Kreirano", count: 0, color: "#8E8E93", description: "SPV kreiran, inicijalni setup" },
  { stage: "CORE pregled", count: 0, color: "#5AC8FA", description: "CORE pregled i validacija" },
  { stage: "Vertikale aktivne", count: 2, color: "#AF52DE", description: "Vertikale dodijeljene i aktivne" },
  { stage: "Strukturirano", count: 0, color: "#007AFF", description: "Pravna struktura, ugovori" },
  { stage: "Financiranje", count: 0, color: "#FF9500", description: "Financiranje, capital raising" },
  { stage: "Aktivna gradnja", count: 0, color: "#34C759", description: "Izvođenje radova, gradnja" },
  { stage: "Završeno", count: 0, color: "#5856D6", description: "Projekt završen, zatvaranje SPV-a" },
];

const MOCK_RISKY_SPVS = [
  { code: "SAN-01", name: "Sandora Petőfia 1", riskScore: 2, status: "Vertikale aktivne", issue: "Kasni zadatak: geodetski elaborat" },
  { code: "SAN-02", name: "Sandora Petőfia 2", riskScore: 0, status: "Vertikale aktivne", issue: "Nema otvorenih rizika" },
];

const MOCK_ACTIVITIES = [
  { id: 1, action: "SPV SAN-01 kreiran", user: "core@rivus.hr", time: "Danas, 09:15", type: "create" },
  { id: 2, action: "SPV SAN-02 kreiran", user: "core@rivus.hr", time: "Danas, 09:20", type: "create" },
  { id: 3, action: "Lifecycle SAN-01 → Vertikale aktivne", user: "sustav", time: "Danas, 09:45", type: "transition" },
  { id: 4, action: "Lifecycle SAN-02 → Vertikale aktivne", user: "sustav", time: "Danas, 09:46", type: "transition" },
  { id: 5, action: "Korisnik core@rivus.hr prijavljen", user: "sustav", time: "Danas, 10:00", type: "auth" },
];

export default function PentagonPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">Pentagon</h1>
          <p className="text-[13px] text-black/50 mt-0.5">Središnja nadzorna ploča sustava — pregled u 10 sekundi</p>
        </div>
      </div>

      {/* A) SYSTEM STATUS */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">
            <Shield size={28} className="text-green-600" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200">
                <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[15px] font-bold text-green-700">SUSTAV STABILAN</span>
              </span>
            </div>
            <p className="text-[13px] text-black/50 mt-1">Svi servisi operativni • Nema kritičnih upozorenja • Zadnja provjera: upravo sad</p>
          </div>
        </div>
      </div>

      {/* B) KPI KARTICE */}
      <KpiGrid>
        <KpiCard
          title="Aktivni SPV-ovi"
          value={2}
          icon="🏗️"
          color="blue"
          subtitle="U sustavu"
          onClick={() => router.push("/dashboard/core/spv-pipeline")}
        />
        <KpiCard
          title="Blokirani"
          value={0}
          icon="🔒"
          color="green"
          subtitle="Nema blokada"
          onClick={() => router.push("/dashboard/core/blokade")}
        />
        <KpiCard
          title="Visok rizik"
          value={0}
          icon="⚠️"
          color="green"
          subtitle="Nema visokog rizika"
          onClick={() => router.push("/dashboard/core/rizik")}
        />
        <KpiCard
          title="Prekoračeni zadaci"
          value={0}
          icon="⏰"
          color="green"
          subtitle="Sve u roku"
          onClick={() => router.push("/dashboard/core/compliance")}
        />
        <KpiCard
          title="Čekaju odobrenje"
          value={0}
          icon="✅"
          color="green"
          subtitle="Nema čekanja"
          onClick={() => router.push("/dashboard/core/odobrenja")}
        />
        <KpiCard
          title="Nenaplaćeno"
          value="0 €"
          icon="💶"
          color="green"
          subtitle="Sve naplaćeno"
          onClick={() => router.push("/dashboard/core/nenaplaceno")}
        />
        <KpiCard
          title="Dospjeli računi"
          value={0}
          icon="📄"
          color="green"
          subtitle="Nema dospjelih"
          onClick={() => router.push("/dashboard/core/financije-nadzor")}
        />
      </KpiGrid>

      {/* C) LIFECYCLE FUNNEL */}
      <LifecycleFunnelPanel stages={MOCK_STAGES} totalSPVs={2} />

      {/* D) TOP 5 RIZIČNIH SPV-ova + E) ZADNJE AKTIVNOSTI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* D) TOP RIZIČNI */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-100 px-5 py-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <span className="text-[14px] font-semibold text-black">Rizični SPV-ovi</span>
          </div>
          <div className="divide-y divide-gray-50">
            {MOCK_RISKY_SPVS.map((spv) => (
              <button
                key={spv.code}
                onClick={() => router.push(`/dashboard/core/spv/${spv.code}`)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-black">{spv.code}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      spv.riskScore > 1 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                    }`}>
                      Rizik: {spv.riskScore}
                    </span>
                  </div>
                  <p className="text-[12px] text-black/50 mt-0.5">{spv.issue}</p>
                </div>
                <span className="text-[11px] px-2 py-1 rounded-md bg-purple-50 text-purple-700 font-medium whitespace-nowrap">
                  {spv.status}
                </span>
              </button>
            ))}
            {MOCK_RISKY_SPVS.length === 0 && (
              <div className="px-5 py-8 text-center text-[13px] text-black/40">
                Nema rizičnih SPV-ova
              </div>
            )}
          </div>
        </div>

        {/* E) ZADNJE AKTIVNOSTI */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-100 px-5 py-3 flex items-center gap-2">
            <Zap size={16} className="text-[#007AFF]" />
            <span className="text-[14px] font-semibold text-black">Zadnje aktivnosti</span>
          </div>
          <div className="divide-y divide-gray-50">
            {MOCK_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="px-5 py-3 flex items-start gap-3">
                <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                  activity.type === "create" ? "bg-green-500" :
                  activity.type === "transition" ? "bg-blue-500" :
                  "bg-gray-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-black font-medium truncate">{activity.action}</p>
                  <p className="text-[11px] text-black/40 mt-0.5">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* F) BRZE AKCIJE */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="text-[14px] font-semibold text-black mb-3">Brze akcije</div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Blokiraj SPV", icon: Lock, href: "/dashboard/core/blokade" },
            { label: "Označi rizik", icon: AlertTriangle, href: "/dashboard/core/rizik" },
            { label: "Pošalji obavijest", icon: Bell, href: "/dashboard/core/obavijesti" },
            { label: "Pokreni reviziju", icon: BarChart3, href: "/dashboard/core/izvjestaji" },
            { label: "Pretraži", icon: Search, href: "#" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => action.href !== "#" ? router.push(action.href) : alert("U izradi")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-[13px] font-medium text-black/70 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Icon size={15} className="text-[#8E8E93]" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
