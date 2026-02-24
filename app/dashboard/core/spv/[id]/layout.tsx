"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useSpvById } from "@/lib/data-client";

export default function SpvDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = params.id as string;
  const { data: spv, loading } = useSpvById(id);

  const base = `/dashboard/core/spv/${id}`;

  const tabs = [
    { label: "Pregled", href: base },
    { label: "Financije", href: `${base}/financije` },
    { label: "Dokumenti", href: `${base}/dokumenti` },
    { label: "Zadaci", href: `${base}/zadaci` },
    { label: "Vertikale", href: `${base}/vertikale` },
    { label: "Banka", href: `${base}/banka` },
    { label: "Knjigovodstvo", href: `${base}/knjigovodstvo` },
    { label: "Odobrenja", href: `${base}/odobrenja` },
    { label: "TOK", href: `${base}/tok` },
    { label: "Mandatory", href: `${base}/mandatory` },
    { label: "RIVUS Billing", href: `${base}/rivus-billing` },
    { label: "Dnevnik", href: `${base}/dnevnik` },
    { label: "Korisnici", href: `${base}/korisnici` },
    { label: "Postavke", href: `${base}/postavke` },
  ];

  const isActive = (href: string) => {
    if (href === base) return pathname === base;
    return pathname.startsWith(href);
  };

  const displayName = spv?.code
    ? `${spv.code} — ${spv.name}`
    : loading
      ? "Ucitavanje..."
      : id.slice(0, 8);

  return (
    <div className="space-y-0">
      <div className="mb-4">
        <h1 className="text-[22px] font-bold text-black">{displayName}</h1>
        {spv && (
          <p className="text-[13px] text-black/50 mt-0.5">
            {spv.sectorLabel} | {spv.city} | Faza: {spv.phase}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-0 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={`px-3 py-2 text-[12px] font-medium rounded-t-lg transition-colors ${
              isActive(tab.href)
                ? "bg-white border border-b-white border-gray-200 text-black -mb-px"
                : "text-black/50 hover:text-black hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {children}
    </div>
  );
}
