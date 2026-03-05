"use client";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import Image from "next/image";

export default function LockdownPage() {
  const { loading } = usePlatformMode();

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-red-500/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[420px] w-full relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo-icon.png" alt="RIVUS" width={48} height={48} className="mb-3 opacity-60" priority />
          <div className="text-[11px] font-bold tracking-[0.25em] text-red-500/70 uppercase">Lockdown Mode</div>
        </div>

        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-red-500/[0.15] shadow-[0_2px_20px_rgba(239,68,68,0.06)] p-7">
          {/* Status indicator */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <div className="text-[18px] font-bold text-black">Sustav je zaključan</div>
          </div>

          <p className="text-[13px] text-black/50 leading-relaxed mb-6">
            Sve operacije su zaustavljene. DB trigger blokira svaki INSERT/UPDATE/DELETE.
            Pristup je ograničen na CORE administratora.
          </p>

          <div className="space-y-2 mb-6">
            {[
              "Svi write operatori blokirani na razini baze",
              "Samo login i ova stranica su dostupne",
              "CORE administrator može deaktivirati Lockdown",
              "LOCKDOWN → NORMAL zahtijeva explicit unlock",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <span className="text-[12px] text-black/40">{text}</span>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="bg-black/[0.03] rounded-xl p-4 mb-5">
            <div className="text-[12px] font-semibold text-black/60 mb-1">Kontakt CORE administratora</div>
            <div className="text-[11px] text-black/30">info@rivus.hr</div>
          </div>

          <a
            href="/login"
            className="flex items-center justify-center w-full py-3 rounded-xl bg-black text-white text-[13px] font-semibold hover:bg-black/85 active:scale-[0.98] transition-all duration-150"
          >
            CORE Admin prijava
          </a>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-[10px] text-black/15 max-w-[320px] mx-auto leading-relaxed">
            RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
            Odgovornost za izvršenje obveza ostaje na odgovornoj strani.
          </p>
        </div>
      </div>
    </div>
  );
}
