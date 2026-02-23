"use client";

import { useTokRequests, useOpenTokRequests, useEscalatedTok, useSlaBreached } from "@/lib/data-client";

const statusColors: Record<string, string> = {
  "otvoren": "bg-blue-100 text-blue-700",
  "u_tijeku": "bg-amber-100 text-amber-700",
  "riješen": "bg-green-100 text-green-700",
  "eskaliran": "bg-red-100 text-red-700",
  "zatvoren": "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, string> = {
  "otvoren": "Otvoren",
  "u_tijeku": "U tijeku",
  "riješen": "Rijesen",
  "eskaliran": "Eskaliran",
  "zatvoren": "Zatvoren",
};

const priorityColors: Record<string, string> = {
  "critical": "bg-red-100 text-red-700",
  "high": "bg-amber-100 text-amber-700",
  "medium": "bg-blue-100 text-blue-700",
  "low": "bg-gray-100 text-gray-600",
};

export default function TokPage() {
  const { data: tokRequests, loading: tokRequestsLoading } = useTokRequests();

  const { data: open } = useOpenTokRequests();
  const { data: escalated } = useEscalatedTok();
  const { data: slaBreached } = useSlaBreached();
  if (tokRequestsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const resolved = tokRequests.filter(t => t.status === "riješen" || t.status === "zatvoren");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">TOK - Zahtjevi</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{tokRequests.length} ukupno | {open.length} otvorenih | {escalated.length} eskaliranih | {slaBreached.length} SLA probijenih</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Otvoreni", value: open.length, color: "text-blue-600" },
          { label: "Eskalirani", value: escalated.length, color: "text-red-600" },
          { label: "SLA probijeni", value: slaBreached.length, color: "text-red-600" },
          { label: "Rijeseni", value: resolved.length, color: "text-green-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">ID</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naslov</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dodijeljen</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Prioritet</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">SLA</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Rok</th>
            </tr>
          </thead>
          <tbody>
            {tokRequests.map(tok => (
              <tr key={tok.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${tok.slaBreached ? "bg-red-50/30" : ""}`}>
                <td className="px-3 py-2.5 font-bold text-black">{tok.id}</td>
                <td className="px-3 py-2.5 text-black max-w-[200px] truncate">{tok.title}</td>
                <td className="px-3 py-2.5 text-black/50">{tok.spvId}</td>
                <td className="px-3 py-2.5 text-black/70 text-[11px]">{tok.assignedTo}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityColors[tok.priority]}`}>
                    {tok.priority}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[tok.status] || "bg-gray-100"}`}>
                    {statusLabels[tok.status] || tok.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center">
                  {tok.slaBreached
                    ? <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">PROBIJEN</span>
                    : <span className="text-[11px] text-green-600">{tok.slaHours}h</span>
                  }
                </td>
                <td className="px-3 py-2.5 text-black/70">{tok.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
