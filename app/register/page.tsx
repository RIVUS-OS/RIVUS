import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-black/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />

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

        {/* Info Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-black/[0.06] shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-7 text-center">
          {/* Lock icon */}
          <div className="w-12 h-12 rounded-full bg-black/[0.04] flex items-center justify-center mx-auto mb-5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/40">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="text-[18px] font-bold text-black/85 mb-2">
            Pristup uz pozivnicu
          </h1>
          <p className="text-[13px] text-black/40 leading-relaxed mb-6">
            RIVUS je zatvorena governance platforma. Korisnički pristup
            dodjeljuje isključivo CORE administrator.
          </p>

          <div className="bg-black/[0.02] rounded-xl p-4 mb-6">
            <p className="text-[12px] text-black/35 leading-relaxed">
              Ako vam je račun dodijeljen, provjerite e-mail i
              dovršite postavljanje lozinke putem pozivnice.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-black text-white text-[14px] font-semibold hover:bg-black/85 active:scale-[0.98] transition-all duration-150"
          >
            Prijava
          </Link>
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
