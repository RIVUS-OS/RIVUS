import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="text-[48px] font-black text-black tracking-tighter mb-1">
          RIVUS
        </div>
        <div className="text-[11px] font-semibold tracking-[0.2em] text-red-600 mb-10">
          PRISTUP ODBIJEN
        </div>
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="text-[15px] font-bold text-black mb-2">
            Nemate ovlasti za ovu stranicu
          </div>
          <div className="text-[13px] text-black/50 leading-relaxed">
            Vasa rola ne dopusta pristup ovom dijelu sustava.
            Kontaktirajte CORE administratora ako mislite da je ovo greska.
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link
            href="/login"
            className="px-5 py-2.5 bg-black text-white text-[13px] font-medium rounded-lg hover:bg-black/80 transition-colors"
          >
            Prijava
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-gray-100 text-black text-[13px] font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
