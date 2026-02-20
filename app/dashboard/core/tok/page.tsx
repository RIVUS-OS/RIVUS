"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  MessageCircle, AlertTriangle, Clock, CheckCircle, Filter,
  ArrowRight, User, Building2,
} from "lucide-react";
import { KpiCard, KpiGrid } from "@/components/KpiCard";

type TokRequest = {
  id: string;
  title: string;
  spv: string;
  createdBy: string;
  assignedTo: string;
  type: string;
  category: string;
  priority: "Nizak" | "Srednji" | "Visok" | "Kritičan";
  status: "Otvoren" | "U tijeku" | "Eskaliran" | "Riješen";
  created: string;
  deadline: string;
  slaBreached: boolean;
};

const MOCK_TOK_REQUESTS: TokRequest[] = [
  {
    id: "TOK-001",
    title: "Trebam odvjetnika za pregled ugovora o kupoprodaji",
    spv: "SAN-01",
    createdBy: "Jurke Maričić",
    assignedTo: "Odvjetnik d.o.o.",
    type: "Zahtjev",
    category: "Pravno",
    priority: "Visok",
    status: "Otvoren",
    created: "18.02.2026.",
    deadline: "21.02.2026.",
    slaBreached: false,
  },
  {
    id: "TOK-002",
    title: "Geodetski elaborat kasni — potrebna intervencija",
    spv: "SAN-01",
    createdBy: "Arhitekt d.o.o.",
    assignedTo: "CORE",
    type: "Eskalacija",
    category: "Projektiranje",
    priority: "Kritičan",
    status: "Eskaliran",
    created: "15.02.2026.",
    deadline: "17.02.2026.",
    slaBreached: true,
  },
  {
    id: "TOK-003",
    title: "Fali dokument za knjiženje URA",
    spv: "SAN-01",
    createdBy: "Knjigovođa",
    assignedTo: "Jurke Maričić",
    type: "Zahtjev",
    category: "Financije",
    priority: "Srednji",
    status: "U tijeku",
    created: "14.02.2026.",
    deadline: "20.02.2026.",
    slaBreached: false,
  },
  {
    id: "TOK-004",
    title: "Provjera katastra — tko je zadužen?",
    spv: "SAN-02",
    createdBy: "Jurke Maričić",
    assignedTo: "Geodet d.o.o.",
    type: "Pitanje",
    category: "Projektiranje",
    priority: "Nizak",
    status: "Riješen",
    created: "10.02.2026.",
    deadline: "12.02.2026.",
    slaBreached: false,
  },
  {
    id: "TOK-005",
    title: "Banka traži dodatnu dokumentaciju za SAN-01",
    spv: "SAN-01",
    createdBy: "Banka evaluator",
    assignedTo: "CORE",
    type: "Zahtjev",
    category: "Banka",
    priority: "Visok",
    status: "Otvoren",
    created: "19.02.2026.",
    deadline: "22.02.2026.",
    slaBreached: false,
  },
];

const PRIORITY_STYLES = {
  Nizak: "bg-gray-100 text-gray-600",
  Srednji: "bg-blue-100 text-blue-700",
  Visok: "bg-amber-100 text-amber-700",
  Kritičan: "bg-red-100 text-red-700",
};

const STATUS_STYLES = {
  Otvoren: "bg-blue-100 text-blue-700",
  "U tijeku": "bg-amber-100 text-amber-700",
  Eskaliran: "bg-red-100 text-red-700",
  Riješen: "bg-green-100 text-green-700",
};

export default function CoreTokPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<string>("Svi");

  const filtered = filterStatus === "Svi"
    ? MOCK_TOK_REQUESTS
    : MOCK_TOK_REQUESTS.filter(t => t.status === filterStatus);

  const open = MOCK_TOK_REQUESTS.filter(t => t.status === "Otvoren").length;
  const inProgress = MOCK_TOK_REQUESTS.filter(t => t.status === "U tijeku").length;
  const escalated = MOCK_TOK_REQUESTS.filter(t => t.status === "Eskaliran").length;
  const resolved = MOCK_TOK_REQUESTS.filter(t => t.status === "Riješen").length;
  const slaBreached = MOCK_TOK_REQUESTS.filter(t => t.slaBreached).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">TOK kontrola</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Svi TOK zahtjevi u sustavu — upravljanje, routing, eskalacije</p>
      </div>

      <KpiGrid>
        <KpiCard title="Otvoreni" value={open} icon="📨" color="blue" subtitle="Čekaju obradu" />
        <KpiCard title="U tijeku" value={inProgress} icon="⏳" color="amber" subtitle="Aktivno se rješava" />
        <KpiCard
          title="Eskalirani"
          value={escalated}
          icon="🔴"
          color="red"
          subtitle="Potrebna intervencija"
          onClick={() => router.push("/dashboard/core/tok/eskalacije")}
        />
        <KpiCard
          title="SLA probijeni"
          value={slaBreached}
          icon="⏰"
          color={slaBreached > 0 ? "red" : "green"}
          subtitle={slaBreached > 0 ? "Prekoračen rok" : "Sve u roku"}
          onClick={() => router.push("/dashboard/core/tok/sla")}
        />
      </KpiGrid>

      {/* FILTER */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-black/40" />
        <span className="text-[12px] text-black/50 font-medium">Filtar:</span>
        {["Svi", "Otvoren", "U tijeku", "Eskaliran", "Riješen"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
              filterStatus === s
                ? "bg-[#007AFF] text-white"
                : "bg-gray-100 text-black/60 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* TOK LISTA */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-50">
          {filtered.map((tok) => (
            <div
              key={tok.id}
              className="px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => alert(`TOK detail za ${tok.id} — U izradi`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-bold text-black/40">{tok.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${PRIORITY_STYLES[tok.priority]}`}>
                      {tok.priority}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLES[tok.status]}`}>
                      {tok.status}
                    </span>
                    {tok.slaBreached && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-500 text-white flex items-center gap-1">
                        <Clock size={9} /> SLA
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] font-semibold text-black truncate">{tok.title}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-[11px] text-black/40 flex items-center gap-1">
                      <Building2 size={10} /> {tok.spv}
                    </span>
                    <span className="text-[11px] text-black/40 flex items-center gap-1">
                      <User size={10} /> {tok.createdBy}
                    </span>
                    <span className="text-[11px] text-black/40">→ {tok.assignedTo}</span>
                    <span className="text-[11px] text-black/40">{tok.category}</span>
                    <span className="text-[11px] text-black/40">Rok: {tok.deadline}</span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-black/20 flex-shrink-0 mt-2" />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-[13px] text-black/40">
              Nema TOK zahtjeva s ovim filterom
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
