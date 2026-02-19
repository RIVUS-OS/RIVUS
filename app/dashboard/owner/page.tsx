"use client";

import { useRouter } from "next/navigation";
import { KpiCard, KpiGrid } from "@/components/KpiCard";
import {
  Building2, CheckSquare, ArrowRight, Clock, AlertTriangle,
} from "lucide-react";

// === MOCK DATA ===
const MOCK_SPVS = [
  {
    code: "SAN-01",
    name: "Sandora Petőfia 1",
    status: "Verticals Active",
    tasks: { total: 8, completed: 3, overdue: 1 },
    finance: { expenses: 4500 },
    created: "15.01.2026.",
  },
  {
    code: "SAN-02",
    name: "Sandora Petőfia 2",
    status: "Verticals Active",
    tasks: { total: 5, completed: 2, overdue: 0 },
    finance: { expenses: 2200 },
    created: "15.01.2026.",
  },
];

const MOCK_RECENT_TASKS = [
  { title: "Geodetski elaborat", spv: "SAN-01", status: "Kasni", due: "10.02.2026." },
  { title: "Idejni projekt", spv: "SAN-01", status: "U tijeku", due: "28.02.2026." },
  { title: "Provjera katastra", spv: "SAN-02", status: "U tijeku", due: "20.02.2026." },
  { title: "Idejno rješenje", spv: "SAN-02", status: "Čeka", due: "10.03.2026." },
  { title: "Pripremni radovi — ponude", spv: "SAN-01", status: "Čeka", due: "15.03.2026." },
];

export default function OwnerDashboard() {
  const router = useRouter();

  const totalTasks = MOCK_SPVS.reduce((sum, s) => sum + s.tasks.total, 0);
  const completedTasks = MOCK_SPVS.reduce((sum, s) => sum + s.tasks.completed, 0);
  const overdueTasks = MOCK_SPVS.reduce((sum, s) => sum + s.tasks.overdue, 0);
  const totalExpenses = MOCK_SPVS.reduce((sum, s) => sum + s.finance.expenses, 0);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-[22px] font-bold text-black">Nadzorna ploča</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Pregled mojih projekata</p>
      </div>

      {/* KPI */}
      <KpiGrid>
        <KpiCard
          title="Moji SPV-ovi"
          value={MOCK_SPVS.length}
          icon="🏗️"
          color="blue"
          subtitle="Aktivni projekti"
          onClick={() => router.push("/dashboard/owner/projekti")}
        />
        <KpiCard
          title="Ukupno zadataka"
          value={`${completedTasks}/${totalTasks}`}
          icon="✅"
          color={overdueTasks > 0 ? "red" : "green"}
          subtitle={overdueTasks > 0 ? `${overdueTasks} kasni` : "Sve u roku"}
          onClick={() => router.push("/dashboard/owner/zadaci")}
        />
        <KpiCard
          title="Ukupni rashodi"
          value={`${totalExpenses.toLocaleString("hr-HR")} €`}
          icon="💶"
          color="amber"
          subtitle="Svi projekti"
          onClick={() => router.push("/dashboard/owner/financije")}
        />
        <KpiCard
          title="Prekoračeni zadaci"
          value={overdueTasks}
          icon="⏰"
          color={overdueTasks > 0 ? "red" : "green"}
          subtitle={overdueTasks > 0 ? "Potrebna pažnja" : "Nema kašnjenja"}
        />
      </KpiGrid>

      {/* MOJI SPV-ovi */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-[#34C759]" />
            <span className="text-[14px] font-semibold text-black">Moji projekti</span>
          </div>
          <button
            onClick={() => router.push("/dashboard/owner/projekti")}
            className="text-[12px] text-[#007AFF] font-medium hover:underline flex items-center gap-1"
          >
            Svi projekti <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_SPVS.map((spv) => (
            <button
              key={spv.code}
              onClick={() => router.push(`/dashboard/owner/spv/${spv.code}`)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#34C759]/10 flex items-center justify-center">
                  <Building2 size={18} className="text-[#34C759]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-black">{spv.code}</span>
                    <span className="text-[12px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">
                      {spv.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-black/50 mt-0.5">{spv.name} • Kreiran: {spv.created}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-black">{spv.tasks.completed}/{spv.tasks.total}</div>
                  <div className="text-[11px] text-black/40">Zadaci</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-black">{spv.finance.expenses.toLocaleString("hr-HR")} €</div>
                  <div className="text-[11px] text-black/40">Rashodi</div>
                </div>
                <ArrowRight size={16} className="text-black/30" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ZADNJE ZADACI CROSS-SPV */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-[#007AFF]" />
            <span className="text-[14px] font-semibold text-black">Zadnje aktivni zadaci</span>
          </div>
          <button
            onClick={() => router.push("/dashboard/owner/zadaci")}
            className="text-[12px] text-[#007AFF] font-medium hover:underline flex items-center gap-1"
          >
            Svi zadaci <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_RECENT_TASKS.map((task, idx) => (
            <div key={idx} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-black">{task.title}</p>
                <p className="text-[11px] text-black/40 mt-0.5">{task.spv} • Rok: {task.due}</p>
              </div>
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${
                task.status === "Kasni" ? "bg-red-100 text-red-700" :
                task.status === "U tijeku" ? "bg-blue-100 text-blue-700" :
                task.status === "Završeno" ? "bg-green-100 text-green-700" :
                "bg-gray-100 text-gray-600"
              }`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
