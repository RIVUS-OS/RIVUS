"use client";
import { useParams } from "next/navigation";
import { useSpvById } from "@/lib/data-client";
export default function SpvDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const id = params.id as string;
  const { data: spv, loading } = useSpvById(id);
  const displayName = spv?.code ? `${spv.code} — ${spv.name}` : loading ? "Učitavanje..." : id.slice(0, 8);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#0B0B0C] tracking-tight">{displayName}</h1>
        {spv && <p className="text-[13px] text-[#6E6E73] mt-0.5">{spv.sectorLabel} | {spv.city} | Faza: {spv.phase}</p>}
      </div>
      {children}
    </div>
  );
}
