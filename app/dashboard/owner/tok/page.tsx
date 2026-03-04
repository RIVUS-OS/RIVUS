"use client";

import { useSpvs, useTokRequests } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const statusColors: Record<string, string> = {
  otvoren: "bg-blue-100 text-blue-700",
  u_tijeku: "bg-amber-100 text-amber-700",
  rijesen: "bg-green-100 text-green-700",
  eskaliran: "bg-red-100 text-red-700",
  zatvoren: "bg-gray-100 text-gray-600",
};

export default function OwnerTokPage() {
  const { allowed, loading: permLoading } = usePermission("activity_read");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "OWNER_TOK_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: _tokAll } = useTokRequests();
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;

  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;


  if (spvsLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[14px] text-black/40">Ucitavanje...</div>
      </div>
    );

  const spvMap = new Map(spvs.map((s) => [s.id, s.name]));
  const allTok = spvs.flatMap((p) =>
    _tokAll.filter((t) => t.spvId === p.id)
  );
  const open = allTok.filter(
    (t) =>
      t.status === "otvoren" ||
      t.status === "u_tijeku" ||
      t.status === "eskaliran"
  );
  const slaBreached = allTok.filter((t) => t.slaBreached);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">TOK zahtjevi</h1>
        <p className="text-[13px] text-black/50 mt-0.5">
          {allTok.length} ukupno | {open.length} otvorenih |{" "}
          {slaBreached.length} SLA probijenih
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Otvoreni", value: open.length, color: "text-blue-600" },
          {
            label: "SLA probijeni",
            value: slaBreached.length,
            color:
              slaBreached.length > 0 ? "text-red-600" : "text-green-600",
          },
          { label: "Ukupno", value: allTok.length, color: "text-black" },
        ].map((k) => (
          <div
            key={k.label}
            className="bg-white rounded-xl border border-gray-200 p-4 text-center"
          >
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">
                Naslov
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">
                SPV
              </th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">
                Prioritet
              </th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">
                Status
              </th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">
                SLA
              </th>
            </tr>
          </thead>
          <tbody>
            {allTok.map((t) => (
              <tr
                key={t.id}
                className={`border-b border-gray-50 hover:bg-gray-50 ${
                  t.slaBreached ? "bg-red-50/30" : ""
                }`}
              >
                <td className="px-3 py-2.5 text-black">{t.title}</td>
                <td className="px-3 py-2.5 text-black/70">
                  {spvMap.get(t.spvId) || t.spvId}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      t.priority === "critical"
                        ? "bg-red-100 text-red-700"
                        : t.priority === "high"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      statusColors[t.status] || "bg-gray-100"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center">
                  {t.slaBreached ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700 font-semibold">
                      PROBIJEN
                    </span>
                  ) : (
                    <span className="text-green-600 text-[11px]">
                      {t.slaHours}h
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {allTok.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-black/40"
                >
                  Nema zahtjeva
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
