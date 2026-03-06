"use client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
export default function Page() {
  const { mode } = usePlatformMode();
  return (
    <div>
      <div className="mb-6"><h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Verzije</h1><p className="text-[14px] text-[#6E6E73]">Povijest promjena modula</p></div>
      <div className="bg-white rounded-2xl border border-[#E8E8EC] p-8 text-center"><div className="text-[48px] mb-3">📄</div><p className="text-[13px] text-[#8E8E93]">Podaci se ucitavaju iz Supabase baze.</p></div>
      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
