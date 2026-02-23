"use client";

import { useParams } from "next/navigation";
import { useSpvById, useActivityLog } from "@/lib/data-client";

const catColors: Record<string, string> = { lifecycle: "bg-blue-500", billing: "bg-green-500", document: "bg-purple-500", approval: "bg-amber-500", assignment: "bg-teal-500", block: "bg-red-500", task: "bg-indigo-500", tok: "bg-orange-500" };

export default function OwnerSpvDnevnikPage() {
  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: activity } = useActivityLog(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Dnevnik</h1><p className="text-[13px] text-black/50 mt-0.5">{activity.length} zapisa</p></div>
      <div className="bg-white rounded-xl border border-gray-200">
        {activity.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {activity.map(a => (
              <div key={a.id} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50">
                <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${catColors[a.category] || "bg-gray-400"}`} />
                <div><div className="text-[13px] font-semibold text-black">{a.action}</div><div className="text-[11px] text-black/50">{a.details}</div><div className="text-[11px] text-black/30 mt-0.5">{a.actor} | {a.timestamp}</div></div>
              </div>
            ))}
          </div>
        ) : <div className="p-8 text-center text-[13px] text-black/40">Nema aktivnosti</div>}
      </div>
    </div>
  );
}
