"use client";

import { useRouter } from "next/navigation";
import { KpiCard, KpiGrid } from "@/components/KpiCard";
import {
  Building2, ArrowRight, Eye, AlertTriangle, Euro,
} from "lucide-react";

const MOCK_PORTFOLIO = [
  { code: "SAN-01", name: "Sandora Petőfia 1", status: "Vertikale aktivne", expenses: 4500, risk: "Nizak" },
  { code: "SAN-02", name: "Sandora Petőfia 2", status: "Vertikale aktivne", expenses: 2200, risk: "Nizak" },
];

export default function HoldingDashboard() {
  const router = useRouter();

  const totalExpenses = MOCK_PORTFOLIO.reduce((s, x) => s + x.expenses, 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-bold text-black">Nadzorna ploča</h1>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-red-50 text-red-600 font-semibold flex items-center gap-1">
            <Eye size={10} />
            Samo čitanje
          </span>
        </div>
        <p className="text-[13px] text-black/50 mt-0.5">RIVUS Holding d.o.o. — strateški pregled portfolija</p>
      </div>

      <KpiGrid>
        <KpiCard
          title="SPV-ovi u portfoliju"
          value={MOCK_PORTFOLIO.length}
          icon="🏗️"
          color="blue"
          subtitle="Aktivni projekti"
          onClick={() => router.push("/dashboard/holding/portfolio")}
        />
        <KpiCard
          title="Ukupni rashodi"
          value={`${totalExpenses.toLocaleString("hr-HR")} €`}
          icon="💶"
          color="amber"
          subtitle="Svi SPV-ovi"
          onClick={() => router.push("/dashboard/holding/financije")}
        />
        <KpiCard
          title="Rizični projekti"
          value={0}
          icon="⚠️"
          color="green"
          subtitle="Nema visokog rizika"
          onClick={() => router.push("/dashboard/holding/rizik")}
        />
        <KpiCard
          title="Izvještaji"
          value={0}
          icon="📊"
          color="blue"
          subtitle="Generirani"
          onClick={() => router.push("/dashboard/holding/izvjestaji")}
        />
      </KpiGrid>

      {/* PORTFOLIO */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-[#FF3B30]" />
            <span className="text-[14px] font-semibold text-black">Portfolio</span>
          </div>
          <button
            onClick={() => router.push("/dashboard/holding/portfolio")}
            className="text-[12px] text-[#007AFF] font-medium hover:underline flex items-center gap-1"
          >
            Cijeli portfolio <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_PORTFOLIO.map((spv) => (
            <div
              key={spv.code}
              className="flex items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#FF3B30]/10 flex items-center justify-center">
                  <Building2 size={18} className="text-[#FF3B30]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-black">{spv.code}</span>
                    <span className="text-[12px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">
                      {spv.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-black/50 mt-0.5">{spv.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-black">{spv.expenses.toLocaleString("hr-HR")} €</div>
                  <div className="text-[11px] text-black/40">Rashodi</div>
                </div>
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                  spv.risk === "Nizak" ? "bg-green-100 text-green-700" :
                  spv.risk === "Srednji" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {spv.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INFO BANNER */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Eye size={18} className="text-black/40 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-black/70">Holding ima isključivo pravo čitanja</p>
            <p className="text-[12px] text-black/40 mt-0.5">
              Svi podaci su agregirani iz SPV-ova. Za izmjene kontaktirajte CORE administratora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
