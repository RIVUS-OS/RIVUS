"use client";

import { useRouter } from "next/navigation";
import { KpiCard, KpiGrid } from "@/components/KpiCard";
import {
  Building2, ArrowRight, ClipboardList, FileText,
} from "lucide-react";

const MOCK_SPVS = [
  { code: "SAN-01", name: "Sandora Petőfia 1", openRequests: 1, lastEntry: "15.02.2026." },
  { code: "SAN-02", name: "Sandora Petőfia 2", openRequests: 0, lastEntry: "10.02.2026." },
];

const MOCK_REQUESTS = [
  { title: "Knjiženje URA — veljača", spv: "SAN-01", status: "Otvoren", date: "15.02.2026." },
  { title: "PDV prijava — Q1", spv: "SAN-01", status: "Čeka dokument", date: "20.03.2026." },
];

export default function AccountingDashboard() {
  const router = useRouter();

  const totalOpen = MOCK_REQUESTS.filter(r => r.status !== "Završeno").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Nadzorna ploča</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Pregled knjigovodstvenih aktivnosti</p>
      </div>

      <KpiGrid>
        <KpiCard
          title="SPV-ovi u sustavu"
          value={MOCK_SPVS.length}
          icon="🏗️"
          color="blue"
          subtitle="Aktivne knjige"
          onClick={() => router.push("/dashboard/accounting/projekti")}
        />
        <KpiCard
          title="Otvoreni zahtjevi"
          value={totalOpen}
          icon="📋"
          color={totalOpen > 0 ? "amber" : "green"}
          subtitle={totalOpen > 0 ? "Čekaju obradu" : "Sve obrađeno"}
          onClick={() => router.push("/dashboard/accounting/zahtjevi")}
        />
        <KpiCard
          title="Zadnji unos"
          value="15.02."
          icon="📝"
          color="blue"
          subtitle="Zadnje knjiženje"
        />
        <KpiCard
          title="Sljedeći rok"
          value="20.03."
          icon="📅"
          color="amber"
          subtitle="PDV prijava Q1"
        />
      </KpiGrid>

      {/* SPV-OVI */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-[#AF52DE]" />
            <span className="text-[14px] font-semibold text-black">SPV-ovi</span>
          </div>
          <button
            onClick={() => router.push("/dashboard/accounting/projekti")}
            className="text-[12px] text-[#007AFF] font-medium hover:underline flex items-center gap-1"
          >
            Svi SPV-ovi <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_SPVS.map((spv) => (
            <button
              key={spv.code}
              onClick={() => router.push(`/dashboard/accounting/spv/${spv.code}`)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#AF52DE]/10 flex items-center justify-center">
                  <FileText size={18} className="text-[#AF52DE]" />
                </div>
                <div>
                  <span className="text-[14px] font-bold text-black">{spv.code}</span>
                  <p className="text-[12px] text-black/50 mt-0.5">{spv.name} • Zadnji unos: {spv.lastEntry}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {spv.openRequests > 0 && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">
                    {spv.openRequests} zahtjev
                  </span>
                )}
                <ArrowRight size={16} className="text-black/30" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ZAHTJEVI */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList size={16} className="text-[#007AFF]" />
            <span className="text-[14px] font-semibold text-black">Otvoreni zahtjevi</span>
          </div>
          <button
            onClick={() => router.push("/dashboard/accounting/zahtjevi")}
            className="text-[12px] text-[#007AFF] font-medium hover:underline flex items-center gap-1"
          >
            Svi zahtjevi <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_REQUESTS.map((req, idx) => (
            <div key={idx} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-black">{req.title}</p>
                <p className="text-[11px] text-black/40 mt-0.5">{req.spv} • {req.date}</p>
              </div>
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${
                req.status === "Otvoren" ? "bg-blue-100 text-blue-700" :
                req.status === "Čeka dokument" ? "bg-amber-100 text-amber-700" :
                "bg-gray-100 text-gray-600"
              }`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
