"use client";

import { useParams, useRouter } from "next/navigation";
import { KpiCard, KpiGrid } from "@/components/KpiCard";
import {
  CheckSquare, FolderOpen, Euro, AlertTriangle, Clock,
  Users, FileText, ArrowRight, MessageCircle,
} from "lucide-react";

// === MOCK DATA PER SPV ===
const MOCK_SPV_DATA: Record<string, {
  name: string;
  status: string;
  director: string;
  oib: string;
  created: string;
  lifecycleStage: number;
  tasks: { total: number; completed: number; overdue: number };
  documents: { total: number; pending: number };
  finance: { income: number; expenses: number; profit: number };
  recentTasks: { title: string; status: string; assignee: string; due: string }[];
  recentDocs: { name: string; type: string; date: string }[];
}> = {
  "SAN-01": {
    name: "Sandora Petőfia 1",
    status: "Verticals Active",
    director: "Jurke Maričić",
    oib: "12345678901",
    created: "15.01.2026.",
    lifecycleStage: 2,
    tasks: { total: 8, completed: 3, overdue: 1 },
    documents: { total: 12, pending: 2 },
    finance: { income: 0, expenses: 4500, profit: -4500 },
    recentTasks: [
      { title: "Geodetski elaborat", status: "Kasni", assignee: "Geodet d.o.o.", due: "10.02.2026." },
      { title: "Idejni projekt", status: "U tijeku", assignee: "Arhitekt d.o.o.", due: "28.02.2026." },
      { title: "Procjena tržišne vrijednosti", status: "Završeno", assignee: "CORE", due: "01.02.2026." },
      { title: "Pripremni radovi — ponude", status: "Čeka", assignee: "Jurke Maričić", due: "15.03.2026." },
    ],
    recentDocs: [
      { name: "Vlasnički list — k.č. 1234", type: "PDF", date: "15.01.2026." },
      { name: "Ugovor o kupoprodaji zemljišta", type: "PDF", date: "20.01.2026." },
      { name: "Geodetska podloga", type: "DWG", date: "05.02.2026." },
    ],
  },
  "SAN-02": {
    name: "Sandora Petőfia 2",
    status: "Verticals Active",
    director: "Jurke Maričić",
    oib: "12345678901",
    created: "15.01.2026.",
    lifecycleStage: 2,
    tasks: { total: 5, completed: 2, overdue: 0 },
    documents: { total: 8, pending: 0 },
    finance: { income: 0, expenses: 2200, profit: -2200 },
    recentTasks: [
      { title: "Provjera katastra", status: "U tijeku", assignee: "Geodet d.o.o.", due: "20.02.2026." },
      { title: "Analiza lokacije", status: "Završeno", assignee: "CORE", due: "25.01.2026." },
      { title: "Idejno rješenje", status: "Čeka", assignee: "Arhitekt d.o.o.", due: "10.03.2026." },
    ],
    recentDocs: [
      { name: "Vlasnički list — k.č. 5678", type: "PDF", date: "15.01.2026." },
      { name: "Lokacijska dozvola — zahtjev", type: "PDF", date: "01.02.2026." },
    ],
  },
};

const LIFECYCLE_STAGES = [
  "Created",
  "CORE Review",
  "Verticals Active",
  "Structured",
  "Financing",
  "Active Construction",
  "Completed",
];

const STAGE_COLORS = [
  "#8E8E93", "#5AC8FA", "#AF52DE", "#007AFF", "#FF9500", "#34C759", "#5856D6",
];

export default function SpvCommandCenter() {
  const params = useParams();
  const router = useRouter();
  const spvId = params.id as string;
  const spv = MOCK_SPV_DATA[spvId];

  // Fallback za nepoznati SPV
  if (!spv) {
    return (
      <div className="space-y-6">
        <h1 className="text-[22px] font-bold text-black">SPV: {spvId}</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-[15px] text-black/50">Nema podataka za ovaj SPV. Demo podaci dostupni za SAN-01 i SAN-02.</p>
        </div>
      </div>
    );
  }

  const taskCompletion = spv.tasks.total > 0
    ? Math.round((spv.tasks.completed / spv.tasks.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-bold text-black">{spvId}</h1>
            <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-purple-100 text-purple-700">
              {spv.status}
            </span>
          </div>
          <p className="text-[13px] text-black/50 mt-0.5">{spv.name} • Direktor: {spv.director} • Kreiran: {spv.created}</p>
        </div>
      </div>

      {/* LIFECYCLE STEPPER */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="text-[13px] font-semibold text-black/50 uppercase mb-4">Životni ciklus projekta</div>
        <div className="flex items-center gap-1">
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const isActive = idx === spv.lifecycleStage;
            const isCompleted = idx < spv.lifecycleStage;
            const color = STAGE_COLORS[idx];

            return (
              <div key={stage} className="flex-1 flex flex-col items-center">
                <div className="w-full flex items-center">
                  <div
                    className={`h-2 flex-1 rounded-full transition-all ${
                      isCompleted ? "" : isActive ? "animate-pulse" : "bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: isCompleted || isActive ? color : undefined,
                      opacity: isActive ? 0.7 : 1,
                    }}
                  />
                </div>
                <div className={`mt-2 text-[10px] font-semibold text-center leading-tight ${
                  isActive ? "text-black" : isCompleted ? "text-black/60" : "text-black/30"
                }`}>
                  {stage}
                </div>
                {isActive && (
                  <div className="mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI KARTICE */}
      <KpiGrid>
        <KpiCard
          title="Zadaci"
          value={`${spv.tasks.completed}/${spv.tasks.total}`}
          icon="✅"
          color={spv.tasks.overdue > 0 ? "red" : "green"}
          subtitle={spv.tasks.overdue > 0 ? `${spv.tasks.overdue} kasni` : `${taskCompletion}% završeno`}
          onClick={() => router.push(`/dashboard/core/spv/${spvId}/zadaci`)}
        />
        <KpiCard
          title="Dokumenti"
          value={spv.documents.total}
          icon="📁"
          color={spv.documents.pending > 0 ? "amber" : "blue"}
          subtitle={spv.documents.pending > 0 ? `${spv.documents.pending} čeka pregled` : "Sve pregledano"}
          onClick={() => router.push(`/dashboard/core/spv/${spvId}/dokumenti`)}
        />
        <KpiCard
          title="Prihodi"
          value={`${spv.finance.income.toLocaleString("hr-HR")} €`}
          icon="📈"
          color="blue"
          subtitle="Ukupno evidentirano"
          onClick={() => router.push(`/dashboard/core/spv/${spvId}/financije`)}
        />
        <KpiCard
          title="Rashodi"
          value={`${spv.finance.expenses.toLocaleString("hr-HR")} €`}
          icon="📉"
          color={spv.finance.profit < 0 ? "red" : "green"}
          subtitle={`Rezultat: ${spv.finance.profit.toLocaleString("hr-HR")} €`}
          onClick={() => router.push(`/dashboard/core/spv/${spvId}/financije`)}
        />
      </KpiGrid>

      {/* ZADACI + DOKUMENTI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ZADNJE ZADACI */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare size={16} className="text-[#007AFF]" />
              <span className="text-[14px] font-semibold text-black">Zadaci</span>
            </div>
            <button
              onClick={() => router.push(`/dashboard/core/spv/${spvId}/zadaci`)}
              className="text-[12px] text-[#007AFF] font-medium hover:underline flex items-center gap-1"
            >
              Svi zadaci <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {spv.recentTasks.map((task, idx) => (
              <div key={idx} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-black">{task.title}</p>
                  <p className="text-[11px] text-black/40 mt-0.5">{task.assignee} • Rok: {task.due}</p>
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

        {/* ZADNJI DOKUMENTI */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen size={16} className="text-[#007AFF]" />
              <span className="text-[14px] font-semibold text-black">Dokumenti</span>
            </div>
            <button
              onClick={() => router.push(`/dashboard/core/spv/${spvId}/dokumenti`)}
              className="text-[12px] text-[#007AFF] font-medium hover:underline flex items-center gap-1"
            >
              Svi dokumenti <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {spv.recentDocs.map((doc, idx) => (
              <div key={idx} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-black">{doc.name}</p>
                    <p className="text-[11px] text-black/40 mt-0.5">{doc.date}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-semibold">
                  {doc.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BRZE AKCIJE SPV */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="text-[14px] font-semibold text-black mb-3">Brze akcije</div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Dodaj zadatak", icon: CheckSquare, href: `/dashboard/core/spv/${spvId}/zadaci` },
            { label: "Učitaj dokument", icon: FolderOpen, href: `/dashboard/core/spv/${spvId}/dokumenti` },
            { label: "Evidentiraj trošak", icon: Euro, href: `/dashboard/core/spv/${spvId}/financije` },
            { label: "Otvori TOK", icon: MessageCircle, href: `/dashboard/core/spv/${spvId}/tok` },
            { label: "Pregled korisnika", icon: Users, href: `/dashboard/core/spv/${spvId}/korisnici` },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => router.push(action.href)}
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
