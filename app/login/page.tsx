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
    try { await supabaseBrowser.rpc("record_login_attempt", { p_email: email, p_success: success, p_ip: null }); } catch {}
  };
  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLockoutUntil(null); setLoading(true);
    try {
      const { data: lockCheck, error: lockErr } = await supabaseBrowser.rpc("check_login_allowed", { p_email: email });
      if (!lockErr && lockCheck && !lockCheck.allowed) { setError(lockCheck.message || "Racun zakljucan."); setLockoutUntil(lockCheck.locked_until); await recordAttempt(false); setLoading(false); return; }
      const { error: authError } = await supabaseBrowser.auth.signInWithPassword({ email, password });
      if (authError) { await recordAttempt(false); setError(authError.message === "Invalid login credentials" ? "Neispravni podaci za prijavu." : authError.message); setLoading(false); return; }
      await recordAttempt(true); window.location.href = "/dashboard";
    } catch { setError("Greska pri prijavi."); setLoading(false); }
  };
  const modeColor = isLockdown ? "bg-red-500" : isSafe ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, system-ui, sans-serif' }}>
      <div className="max-w-[440px] w-full" style={{ marginTop: "4vh" }}>
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-4 mb-4">
            <Image src="/rivus-icon.png" alt="" width={96} height={96} style={{ width: 96, height: "auto" }} priority />
            <span className="text-[40px] font-bold tracking-[-0.5px] text-[#0B0B0C]">RIVUS</span>
          </div>
        </div>
        {!modeLoading && isLockdown && (<div className="mb-5 px-5 py-3 rounded-2xl bg-red-50 border border-red-200"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-[13px] font-semibold text-red-600">Lockdown — samo CORE administrator.</span></div></div>)}
        {!modeLoading && isSafe && (<div className="mb-5 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[13px] font-semibold text-amber-700">Safe Mode — samo citanje.</span></div></div>)}
        <div className="bg-white rounded-2xl border border-[#E8E8EC] px-10 py-10 shadow-sm">
          <form onSubmit={onLogin} className="space-y-6">
            <div><label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-2">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" autoFocus className="w-full px-4 py-3.5 rounded-xl bg-[#FAFAFA] border border-[#D1D1D6] text-[15px] font-medium text-[#0B0B0C] placeholder-[#C7C7CC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" placeholder="vas@email.hr" /></div>
            <div><label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-2">Lozinka</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="current-password" className="w-full px-4 py-3.5 rounded-xl bg-[#FAFAFA] border border-[#D1D1D6] text-[15px] font-medium text-[#0B0B0C] placeholder-[#C7C7CC] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" placeholder="••••••••" /></div>
            {error && (<div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200"><p className="text-[13px] text-red-600 font-semibold">{error}</p>{lockoutUntil && <p className="text-[11px] text-red-400 mt-1">Otkljucavanje: {new Date(lockoutUntil).toLocaleTimeString("hr-HR")}</p>}</div>)}
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-[#2563EB] text-white text-[15px] font-semibold hover:bg-[#1D4ED8] active:scale-[0.98] transition-all duration-150 disabled:opacity-40">{loading ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Prijava...</span> : "Prijavi se"}</button>
          </form>
        </div>
        {!modeLoading && (<div className="mt-6 flex justify-center"><div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8E8EC]"><div className={`h-1.5 w-1.5 rounded-full ${modeColor}`} /><span className="text-[11px] font-medium text-[#8E8E93]">{isLockdown ? "LOCKDOWN" : isSafe ? "SAFE MODE" : "System online"}</span></div></div>)}
        <div className="mt-8 text-center space-y-3">
          <p className="text-[11px] text-[#C7C7CC]">Racun se zakljucava nakon 5 neuspjelih pokusaja.</p>
          <div className="text-[11px] text-[#8E8E93] font-medium">RIVUS CORE d.o.o. · rivus.hr</div>
          <p className="text-[10px] text-[#C7C7CC] max-w-[360px] mx-auto leading-relaxed">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
        </div>
      </div>
    </div>
  );
}




