import Image from "next/image";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-black/[0.015] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[380px] w-full relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo-icon.png" alt="RIVUS" width={48} height={48} className="mb-3 opacity-60" priority />
          <div className="text-[11px] font-bold tracking-[0.25em] text-red-500/60 uppercase">Pristup odbijen</div>
        </div>

        {/* Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-black/[0.06] shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-7 text-center">
          {/* Lock icon */}
          <div className="w-12 h-12 rounded-full bg-red-500/[0.06] flex items-center justify-center mx-auto mb-5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="text-[18px] font-bold text-black/85 mb-2">Nemate ovlasti</h1>
          <p className="text-[13px] text-black/40 leading-relaxed mb-6">
            Vaša rola ne dopušta pristup ovom dijelu sustava.
            Kontaktirajte CORE administratora ako mislite da je ovo greška.
          </p>

          <div className="flex gap-3 justify-center">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-black text-white text-[13px] font-semibold hover:bg-black/85 active:scale-[0.98] transition-all duration-150"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-black/[0.04] text-black/60 text-[13px] font-semibold hover:bg-black/[0.08] active:scale-[0.98] transition-all duration-150"
            >
              Prijava
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <div className="text-[11px] text-black/25 font-medium">RIVUS CORE d.o.o. · rivus.hr</div>
        </div>
      </div>
    </div>
  );
}
