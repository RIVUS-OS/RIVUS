"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center space-y-4 p-8 max-w-md">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <span className="text-red-500 text-[20px]">!</span>
        </div>
        <h2 className="text-[18px] font-bold text-black">Greska na stranici</h2>
        <p className="text-[13px] text-black/50">
          Doslo je do greske pri ucitavanju. Pokusajte ponovno ili se vratite na pocetnu.
        </p>
        {error.digest && (
          <p className="text-[11px] text-black/30 font-mono">REF: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-black text-white text-[13px] font-semibold rounded-lg hover:bg-black/80 transition-colors"
          >
            Pokusaj ponovno
          </button>
          <a
            href="/dashboard"
            className="px-4 py-2 bg-gray-100 text-black text-[13px] font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Pocetna
          </a>
        </div>
      </div>
    </div>
  );
}
