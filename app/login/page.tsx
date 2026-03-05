"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";

// P40: Brute force protection + session management
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
      // P40-C: Check brute force lockout BEFORE attempting login
      const { data: lockCheck, error: lockErr } = await supabaseBrowser.rpc(
        'check_login_allowed',
        { p_email: email }
      );

      if (!lockErr && lockCheck && !lockCheck.allowed) {
        setError(lockCheck.message || 'Racun je privremeno zakljucan.');
        setLockoutUntil(lockCheck.locked_until);
        await recordAttempt(false);
        setLoading(false);
        return;
      }

      // Attempt login
      const { error: authError } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        await recordAttempt(false);
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Record successful login
      await recordAttempt(true);
      window.location.href = "/dashboard";
    } catch {
      setError("Greska pri prijavi. Pokusajte ponovo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full">
        {/* RIVUS Logo */}
        <div className="text-center mb-8">
          <div className="text-[40px] font-black text-black tracking-tighter">RIVUS</div>
          <div className="text-[12px] text-black/40 font-medium tracking-widest">GOVERNANCE ENGINE</div>
        </div>

        {/* Platform Status */}
        {!modeLoading && isLockdown && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-300 text-[12px] text-red-700 text-center font-medium">Sustav je u Lockdown modu. Prijava dozvoljena samo za CORE administratora.</div>
        )}
        {!modeLoading && isSafe && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-300 text-[12px] text-amber-700 text-center font-medium">Sustav je u Safe Mode — samo citanje aktivno nakon prijave.</div>
        )}
        {!modeLoading && isForensic && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[12px] text-emerald-700 text-center font-medium">Forenzicki mod aktivan — sve akcije se bilježe.</div>
        )}

        {/* Login Form */}
        <form onSubmit={onLogin} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="text-[16px] font-bold text-black mb-4">Prijava</div>

          <div className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium text-black/60 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
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
                required
                minLength={12}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[13px] text-black bg-gray-50 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
                <p className="text-[12px] text-red-600 font-medium">{error}</p>
                {lockoutUntil && (
                  <p className="text-[11px] text-red-400 mt-1">
                    Otkljucavanje u: {new Date(lockoutUntil).toLocaleTimeString('hr-HR')}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-black text-white text-[13px] font-semibold hover:bg-gray-800 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Prijava..." : "Prijavi se"}
            </button>
          </div>

          <div className="text-[11px] text-black/30 mt-4 text-center">
            Brute force zaštita aktivna. Račun se zaključava nakon 5 neuspjelih pokušaja (30 min).
          </div>
        </form>

        {/* Legal Footer */}
        <div className="text-center mt-6 space-y-2">
          <div className="text-[11px] text-black/30">RIVUS CORE d.o.o. | rivus.hr</div>
          <p className="text-[10px] text-black/20 max-w-xs mx-auto">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
        </div>
      </div>
    </div>
  );
}
