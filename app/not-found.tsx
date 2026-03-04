import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4 p-8">
        <div className="text-[64px] font-bold text-black/10">404</div>
        <h1 className="text-[20px] font-bold text-black">Stranica nije pronadena</h1>
        <p className="text-[13px] text-black/50 max-w-md">
          Trazena stranica ne postoji ili je premjestena.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-2.5 bg-black text-white text-[13px] font-semibold rounded-lg hover:bg-black/80 transition-colors"
        >
          Povratak na Dashboard
        </Link>
      </div>
    </div>
  );
}
