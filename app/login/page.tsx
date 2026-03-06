"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";


export default function LoginPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockoutUntil, setLockoutUntil] = useState<string | null>(null);

  const recordAttempt = async (success: boolean) => {
    try {
      await supabaseBrowser.rpc('record_login_attempt', { p_email: email, p_success: success, p_ip: null });
    } catch { /* Don't block on audit failure */ }
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLockoutUntil(null);
    setLoading(true);

    try {
      const { data: lockCheck, error: lockErr } = await supabaseBrowser.rpc('check_login_allowed', { p_email: email });
      if (!lockErr && lockCheck && !lockCheck.allowed) {
        setError(lockCheck.message || 'Račun je privremeno zaključan.');
        setLockoutUntil(lockCheck.locked_until);
        await recordAttempt(false);
        setLoading(false);
        return;
      }

      const { error: authError } = await supabaseBrowser.auth.signInWithPassword({ email, password });
      if (authError) {
        await recordAttempt(false);
        setError(authError.message === 'Invalid login credentials' ? 'Neispravni podaci za prijavu.' : authError.message);
        setLoading(false);
        return;
      }

      await recordAttempt(true);
      window.location.href = "/dashboard";
    } catch {
      setError("Greška pri prijavi. Pokušajte ponovo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col items-center justify-center px-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, system-ui, sans-serif' }}>
      <div className="max-w-[400px] w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-5">
            <rect width="48" height="48" rx="12" fill="#0B0B0C"/>
            <path d="M24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38C31.732 38 38 31.732 38 24C38 16.268 31.732 10 24 10ZM24 14C29.523 14 34 18.477 34 24C34 29.523 29.523 34 24 34C18.477 34 14 29.523 14 24C14 18.477 18.477 14 24 14Z" fill="white" fillOpacity="0.15"/>
            <path d="M24 16C19.582 16 16 19.582 16 24C16 28.418 19.582 32 24 32C28.418 32 32 28.418 32 24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M29 19L32 16M32 16H28M32 16V20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-bold tracking-[-0.5px] text-[#0B0B0C]">RIVUS</span>
            <span className="text-[13px] font-semibold text-[#8E8E93] tracking-wide">OS</span>
          </div>
          <div className="mt-2 text-[11px] font-semibold tracking-[0.2em] text-[#8E8E93] uppercase">
            Governance Engine
          </div>
        </div>

        {/* Platform Status Banners */}
        {!modeLoading && isLockdown && (
          <div className="mb-5 px-5 py-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA]">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[13px] font-semibold text-[#DC2626]">
                Sustav u Lockdown modu. Prijava samo za CORE administratora.
              </span>
            </div>
          </div>
        )}
        {!modeLoading && isSafe && (
          <div className="mb-5 px-5 py-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-[13px] font-semibold text-[#92400E]">
                Safe Mode — samo čitanje nakon prijave.
              </span>
            </div>
          </div>
        )}
        {!modeLoading && isForensic && (
          <div className="mb-5 px-5 py-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[13px] font-semibold text-emerald-700">
                Forenzički mod — sve akcije se bilježe.
              </span>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-[#E8E8EC] p-8">
          <form onSubmit={onLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.06em] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-[#F7F7F8] border border-[#E8E8EC] text-[14px] font-medium text-[#0B0B0C] placeholder-[#C7C7CC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                placeholder="vas@email.hr"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.06em] mb-2">
                Lozinka
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl bg-[#F7F7F8] border border-[#E8E8EC] text-[14px] font-medium text-[#0B0B0C] placeholder-[#C7C7CC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
                <p className="text-[13px] text-[#DC2626] font-semibold">{error}</p>
                {lockoutUntil && (
                  <p className="text-[11px] text-[#DC2626]/60 mt-1">
                    Otključavanje: {new Date(lockoutUntil).toLocaleTimeString('hr-HR')}
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#2563EB] text-white text-[14px] font-semibold hover:bg-[#1D4ED8] active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Prijava...
                </span>
              ) : (
                "Prijavi se"
              )}
            </button>
          </form>
        </div>

        {/* Security notice */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-[#C7C7CC]">
            Zaštićeno — račun se zaključava nakon 5 neuspjelih pokušaja.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center space-y-3">
          <div className="text-[11px] text-[#8E8E93] font-medium">
            RIVUS CORE d.o.o. · rivus.hr
          </div>
          <p className="text-[10px] text-[#C7C7CC] max-w-[340px] mx-auto leading-relaxed">
            RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
            Odgovornost za izvršenje obveza ostaje na odgovornoj strani.
            RIVUS ne pruža pravne, porezne niti financijske savjete.
          </p>
        </div>
      </div>
    </div>
  );
}


