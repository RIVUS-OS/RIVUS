"use client";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";

export default function LockdownPage() {
  const { loading } = usePlatformMode();

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* RIVUS Logo */}
        <div className="text-[48px] font-black text-red-700 tracking-tighter mb-2">RIVUS</div>
        <div className="text-[14px] font-semibold text-red-600 mb-8">LOCKDOWN MODE</div>

        {/* Red Banner */}
        <div className="bg-red-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="text-[18px] font-bold mb-2">Sustav je u Lockdown modu</div>
          <div className="text-[13px] text-red-100">Sve operacije su zaustavljene. DB trigger blokira svaki INSERT/UPDATE/DELETE. Pristup je ogranicen na CORE administratora.</div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl border border-red-200 p-5 mb-6 text-left">
          <div className="text-[14px] font-bold text-black mb-3">Sto to znaci?</div>
          <div className="space-y-2 text-[12px] text-black/70">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              <span>Svi write operatori su blokirani na razini baze podataka.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              <span>Nijedna stranica osim ove i login ekrana nije dostupna.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              <span>Samo CORE administrator moze deaktivirati Lockdown.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              <span>LOCKDOWN → NORMAL zahtijeva explicit unlock proceduru.</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 text-center">
          <div className="text-[13px] font-semibold text-black mb-1">Kontakt CORE administratora</div>
          <div className="text-[12px] text-black/50">info@rivus.hr | +385 21 123 456</div>
        </div>

        {/* Login Link */}
        <a href="/login" className="inline-block px-6 py-2.5 rounded-xl bg-red-700 text-white text-[13px] font-semibold hover:bg-red-800 transition-colors">CORE Admin Login</a>

        <p className="text-[11px] text-red-400 mt-8">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
      </div>
    </div>
  );
}
