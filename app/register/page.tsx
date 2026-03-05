import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col items-center justify-center px-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, system-ui, sans-serif' }}>
      <div className="max-w-[400px] w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Image src="/logo-icon.png" alt="RIVUS" width={56} height={56} className="mb-4" priority />
          <Image src="/logo-text.png" alt="RIVUS" width={140} height={32} priority />
          <div className="mt-3 text-[11px] font-semibold tracking-[0.2em] text-[#8E8E93] uppercase">
            Governance Engine
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E8E8EC] p-8 text-center">
          {/* Lock icon */}
          <div className="w-14 h-14 rounded-full bg-[#F7F7F8] border border-[#E8E8EC] flex items-center justify-center mx-auto mb-6">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8E8E93]">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="text-[20px] font-bold text-[#0B0B0C] mb-2">
            Pristup uz pozivnicu
          </h1>
          <p className="text-[14px] text-[#6E6E73] leading-relaxed mb-6">
            RIVUS je zatvorena governance platforma. Korisnički pristup
            dodjeljuje isključivo CORE administrator.
          </p>

          <div className="bg-[#F7F7F8] rounded-xl border border-[#E8E8EC] p-4 mb-6">
            <p className="text-[13px] text-[#8E8E93] leading-relaxed">
              Ako vam je račun dodijeljen, provjerite e-mail i
              dovršite postavljanje lozinke putem pozivnice.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-[#2563EB] text-white text-[14px] font-semibold hover:bg-[#1D4ED8] active:scale-[0.98] transition-all duration-150"
          >
            Prijava
          </Link>
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
