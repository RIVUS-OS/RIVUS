"use client";

import { useParams } from "next/navigation";
import { getSpvById, getActivityBySpv } from "@/lib/mock-data";

export default function BankSpvDnevnikPage() {
  const { id } = useParams();
  const spv = getSpvById(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const activity = getActivityBySpv(id as string);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Dnevnik</h1><p className="text-[13px] text-black/50 mt-0.5">{activity.length} zapisa</p></div>
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
        {activity.length > 0 ? activity.map(a => (
          <div key={a.id} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-400 flex-shrink-0" />
            <div><div className="text-[13px] font-semibold text-black">{a.action}</div><div className="text-[11px] text-black/30">{a.actor} | {a.timestamp}</div></div>
          </div>
        )) : <div className="p-8 text-center text-[13px] text-black/40">Nema aktivnosti</div>}
      </div>
    </div>
  );
}
