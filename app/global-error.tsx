"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("[RIVUS GLOBAL ERROR]", {
    message: error.message,
    digest: error.digest,
    timestamp: new Date().toISOString(),
  });

  return (
    <html lang="hr">
      <body className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4 p-8">
          <div className="text-[48px]">&#x26A0;&#xFE0F;</div>
          <h1 className="text-[20px] font-bold text-black">Sistemska greska</h1>
          <p className="text-[13px] text-black/50 max-w-md">
            Doslo je do neocekivane greske. Ako se problem ponavlja, kontaktirajte administratora.
          </p>
          {error.digest && (
            <p className="text-[11px] text-black/30 font-mono">REF: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="px-4 py-2 bg-black text-white text-[13px] rounded-lg hover:bg-black/80 transition-colors"
          >
            Pokusaj ponovo
          </button>
        </div>
      </body>
    </html>
  );
}
