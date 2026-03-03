"use client";

import { useState } from "react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";

export default function LoginPage() {
  const { isSafe, isLockdown, isForensic, loading } = usePlatformMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full">
        {/* RIVUS Logo */}
        <div className="text-center mb-8">
          <div className="text-[40px] font-black text-black tracking-tighter">RIVUS</div>
          <div className="text-[12px] text-black/40 font-medium tracking-widest">GOVERNANCE ENGINE</div>
        </div>

        {/* Platform Status */}
        {!loading && isLockdown && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-300 text-[12px] text-red-700 text-center font-medium">Sustav je u Lockdown modu. Prijava dozvoljena samo za CORE administratora.</div>
        )}
        {!loading && isSafe && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-300 text-[12px] text-amber-700 text-center font-medium">Sustav je u Safe Mode — samo citanje aktivno nakon prijave.</div>
        )}
        {!loading && isForensic && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[12px] text-emerald-700 text-center font-medium">Forenzicki mod aktivan — sve akcije se bilježe.</div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="text-[16px] font-bold text-black mb-4">Prijava</div>

          <div className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium text-black/60 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] text-black bg-gray-50 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                placeholder="vas@email.hr"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-black/60 mb-1">Lozinka</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] text-black bg-gray-50 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button className="w-full py-2.5 rounded-xl bg-black text-white text-[13px] font-semibold hover:bg-gray-800 transition-colors mt-2">Prijavi se</button>
          </div>

          <div className="text-[11px] text-black/30 mt-4 text-center">Auth through proxy.ts. Rate limiting aktivan (A10 §6.3).</div>
        </div>

        {/* Legal Footer */}
        <div className="text-center mt-6 space-y-2">
          <div className="text-[11px] text-black/30">RIVUS CORE d.o.o. | rivus.hr</div>
          <p className="text-[10px] text-black/20 max-w-xs mx-auto">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
        </div>
      </div>
    </div>
  );
}
