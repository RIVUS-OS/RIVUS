"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import Image from "next/image";

export default function LoginPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockoutUntil, setLockoutUntil] = useState<string | null>(null);

  const recordAttempt = async (success: boolean) => {
    try {
      await supabaseBrowser.rpc('record_login_attempt', {
        p_email: email,
        p_success: success,
        p_ip: null,
      });
    } catch {
      // Don't block on audit failure
    }
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLockoutUntil(null);
    setLoading(true);

    try {
      const { data: lockCheck, error: lockErr } = await supabaseBrowser.rpc(
        'check_login_allowed',
        { p_email: email }
      );

      if (!lockErr && lockCheck && !lockCheck.allowed) {
        setError(lockCheck.message || 'Račun je privremeno zaključan.');
        setLockoutUntil(lockCheck.locked_until);
        await recordAttempt(false);
        setLoading(false);
        return;
      }

      const { error: authError } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        await recordAttempt(false);
        setError(authError.message === 'Invalid login credentials' 
          ? 'Neispravni podaci za prijavu.' 
          : authError.message);
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
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle gradient orb background */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-black/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-black/[0.015] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[380px] w-full relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/logo-icon.png"
            alt="RIVUS"
            width={56}
            height={56}
            className="mb-4"
            priority
          />
          <Image
            src="/logo-text.png"
            alt="RIVUS"
            width={140}
            height={32}
            className="opacity-90"
            priority
          />
          <div className="mt-2 text-[11px] font-medium tracking-[0.2em] text-black/30 uppercase">
            Governance Engine
          </div>
        </div>

        {/* Platform Status Banners */}
        {!modeLoading && isLockdown && (
          <div className="mb-5 px-4 py-3 rounded-2xl bg-red-500/5 border border-red-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[12px] font-medium text-red-600/80">
                Sustav u Lockdown modu. Prijava samo za CORE administratora.
              </span>
            </div>
          </div>
        )}
        {!modeLoading && isSafe && (
          <div className="mb-5 px-4 py-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[12px] font-medium text-amber-600/80">
                Safe Mode — samo čitanje nakon prijave.
              </span>
            </div>
          </div>
        )}
        {!modeLoading && isForensic && (
          <div className="mb-5 px-4 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[12px] font-medium text-emerald-600/80">
                Forenzički mod — sve akcije se bilježe.
              </span>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-black/[0.06] shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-7">
          <form onSubmit={onLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-black/40 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-black/[0.03] border border-black/[0.06] text-[14px] text-black placeholder-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-transparent transition-all duration-200"
                placeholder="vas@email.hr"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-black/40 uppercase tracking-wider mb-1.5">
                Lozinka
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl bg-black/[0.03] border border-black/[0.06] text-[14px] text-black placeholder-black/20 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <p className="text-[13px] text-red-600/80 font-medium">{error}</p>
                {lockoutUntil && (
                  <p className="text-[11px] text-red-400/60 mt-1">
                    Otključavanje: {new Date(lockoutUntil).toLocaleTimeString('hr-HR')}
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-black text-white text-[14px] font-semibold hover:bg-black/85 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
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
          <p className="text-[11px] text-black/20">
            Zaštićeno — račun se zaključava nakon 5 neuspjelih pokušaja.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center space-y-3">
          <div className="text-[11px] text-black/25 font-medium">
            RIVUS CORE d.o.o. · rivus.hr
          </div>
          <p className="text-[10px] text-black/15 max-w-[320px] mx-auto leading-relaxed">
            RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
            Odgovornost za izvršenje obveza ostaje na odgovornoj strani.
            RIVUS ne pruža pravne, porezne niti financijske savjete.
          </p>
        </div>
      </div>
    </div>
  );
}
