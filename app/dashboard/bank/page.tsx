"use client";

import { useRouter } from "next/navigation";
import { KpiCard, KpiGrid } from "@/components/KpiCard";
import {
  Building2, ArrowRight, ClipboardCheck, Archive,
} from "lucide-react";

const MOCK_EVALUATIONS = [
  { code: "SAN-01", name: "Sandora Petőfia 1", status: "Čeka evaluaciju", submitted: "01.02.2026.", riskScore: "—" },
  { code: "SAN-02", name: "Sandora Petőfia 2", status: "Čeka evaluaciju", submitted: "05.02.2026.", riskScore: "—" },
];

const MOCK_ARCHIVE: { code: string; name: string; result: string; date: string }[] = [];

export default function BankDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Nadzorna ploča</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Evaluacija SPV projekata</p>
      </div>

      <KpiGrid>
        <KpiCard
          title="Čekaju evaluaciju"
          value={MOCK_EVALUATIONS.length}
          icon="📋"
          color="amber"
          subtitle="Novi zahtjevi"
          onClick={() => router.push("/dashboard/bank/evaluacije")}
        />
        <KpiCard
          title="Završene evaluacije"
          value={MOCK_ARCHIVE.length}
          icon="✅"
          color="green"
          subtitle="U arhivi"
          onClick={() => router.push("/dashboard/bank/arhiva")}
        />
        <KpiCard
          title="Prosječno vrijeme"
          value="— dana"
          icon="⏱️"
          color="blue"
          subtitle="Od zahtjeva do odluke"
        />
        <KpiCard
          title="Odobreno"
          value="—"
          icon="🏦"
          color="blue"
          subtitle="Ukupni iznos"
        />
      </KpiGrid>

      {/* SPV-OVI ZA EVALUACIJU */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={16} className="text-[#5856D6]" />
            <span className="text-[14px] font-semibold text-black">SPV-ovi za evaluaciju</span>
          </div>
          <button
            onClick={() => router.push("/dashboard/bank/evaluacije")}
            className="text-[12px] text-[#007AFF] font-medium hover:underline flex items-center gap-1"
          >
            Sve evaluacije <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_EVALUATIONS.map((spv) => (
            <button
              key={spv.code}
              onClick={() => router.push(`/dashboard/bank/spv/${spv.code}`)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#5856D6]/10 flex items-center justify-center">
                  <Building2 size={18} className="text-[#5856D6]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-black">{spv.code}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                      {spv.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-black/50 mt-0.5">{spv.name} • Predano: {spv.submitted}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-black/30" />
            </button>
          ))}
        </div>
      </div>

      {/* ARHIVA */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-100 px-5 py-3 flex items-center gap-2">
          <Archive size={16} className="text-black/40" />
          <span className="text-[14px] font-semibold text-black">Arhiva evaluacija</span>
        </div>
        <div className="px-5 py-8 text-center text-[13px] text-black/40">
          Nema završenih evaluacija
        </div>
      </div>
    </div>
  );
}
