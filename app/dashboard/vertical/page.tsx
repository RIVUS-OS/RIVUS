"use client";

import { useRouter } from "next/navigation";
import { KpiCard, KpiGrid } from "@/components/KpiCard";
import {
  Building2, CheckSquare, ArrowRight, FolderOpen,
} from "lucide-react";

const MOCK_ASSIGNED_SPVS = [
  { code: "SAN-01", name: "Sandora Petőfia 1", role: "Arhitekt", tasks: 3, completed: 1, overdue: 0 },
  { code: "SAN-02", name: "Sandora Petőfia 2", role: "Arhitekt", tasks: 2, completed: 0, overdue: 0 },
];

const MOCK_MY_TASKS = [
  { title: "Idejni projekt", spv: "SAN-01", status: "U tijeku", due: "28.02.2026." },
  { title: "Idejno rješenje", spv: "SAN-02", status: "Čeka", due: "10.03.2026." },
  { title: "Glavni projekt — faza 1", spv: "SAN-01", status: "Čeka", due: "30.03.2026." },
];

export default function VerticalDashboard() {
  const router = useRouter();

  const totalTasks = MOCK_ASSIGNED_SPVS.reduce((s, x) => s + x.tasks, 0);
  const completedTasks = MOCK_ASSIGNED_SPVS.reduce((s, x) => s + x.completed, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Nadzorna ploča</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Pregled dodijeljenih projekata i zadataka</p>
      </div>

      <KpiGrid>
        <KpiCard
          title="Dodijeljeni projekti"
          value={MOCK_ASSIGNED_SPVS.length}
          icon="🏗️"
          color="blue"
          subtitle="Aktivni SPV-ovi"
          onClick={() => router.push("/dashboard/vertical/projekti")}
        />
        <KpiCard
          title="Moji zadaci"
          value={`${completedTasks}/${totalTasks}`}
          icon="✅"
          color="blue"
          subtitle={`${Math.round((completedTasks / totalTasks) * 100)}% završeno`}
          onClick={() => router.push("/dashboard/vertical/zadaci")}
        />
        <KpiCard
          title="Čekaju izvršenje"
          value={totalTasks - completedTasks}
          icon="⏳"
          color="amber"
          subtitle="Otvoreni zadaci"
        />
        <KpiCard
          title="Dokumenti"
          value={4}
          icon="📁"
          color="blue"
          subtitle="Učitano ukupno"
          onClick={() => router.push("/dashboard/vertical/dokumenti")}
        />
      </KpiGrid>

      {/* DODIJELJENI PROJEKTI */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-[#FF9500]" />
            <span className="text-[14px] font-semibold text-black">Dodijeljeni projekti</span>
          </div>
          <button
            onClick={() => router.push("/dashboard/vertical/projekti")}
            className="text-[12px] text-[#007AFF] font-medium hover:underline flex items-center gap-1"
          >
            Svi projekti <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_ASSIGNED_SPVS.map((spv) => (
            <button
              key={spv.code}
              onClick={() => router.push(`/dashboard/vertical/spv/${spv.code}`)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#FF9500]/10 flex items-center justify-center">
                  <Building2 size={18} className="text-[#FF9500]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-black">{spv.code}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">
                      {spv.role}
                    </span>
                  </div>
                  <p className="text-[12px] text-black/50 mt-0.5">{spv.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-black">{spv.completed}/{spv.tasks}</div>
                  <div className="text-[11px] text-black/40">Zadaci</div>
                </div>
                <ArrowRight size={16} className="text-black/30" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MOJI ZADACI */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-[#007AFF]" />
            <span className="text-[14px] font-semibold text-black">Moji zadaci</span>
          </div>
          <button
            onClick={() => router.push("/dashboard/vertical/zadaci")}
            className="text-[12px] text-[#007AFF] font-medium hover:underline flex items-center gap-1"
          >
            Svi zadaci <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_MY_TASKS.map((task, idx) => (
            <div key={idx} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-black">{task.title}</p>
                <p className="text-[11px] text-black/40 mt-0.5">{task.spv} • Rok: {task.due}</p>
              </div>
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${
                task.status === "U tijeku" ? "bg-blue-100 text-blue-700" :
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
