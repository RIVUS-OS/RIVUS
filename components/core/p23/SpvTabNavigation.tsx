"use client";

/**
 * RIVUS OS — P23: SPV Tab Navigation
 * Links to all SPV sub-pages within Control Room context.
 */

import { usePathname } from "next/navigation";
import Link from "next/link";

interface SpvTabNavigationProps {
  spvId: string;
  context?: "core" | "owner";
}

const coreTabs = [
  { label: "Pregled", path: "" },
  { label: "Financije", path: "/financije" },
  { label: "Dokumenti", path: "/dokumenti" },
  { label: "Zadaci", path: "/zadaci" },
  { label: "Vertikale", path: "/vertikale" },
  { label: "Banka", path: "/banka" },
  { label: "Knjigovodstvo", path: "/knjigovodstvo" },
  { label: "Korisnici", path: "/korisnici" },
  { label: "Mandatory", path: "/mandatory" },
  { label: "Odobrenja", path: "/odobrenja" },
  { label: "TOK", path: "/tok" },
  { label: "Dnevnik", path: "/dnevnik" },
  { label: "Billing", path: "/rivus-billing" },
  { label: "Postavke", path: "/postavke" },
];

export default function SpvTabNavigation({ spvId, context = "core" }: SpvTabNavigationProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/${context}/spv/${spvId}`;

  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <nav className="flex gap-0 min-w-max">
        {coreTabs.map((tab) => {
          const href = basePath + tab.path;
          const isActive = tab.path === ""
            ? pathname === basePath
            : pathname.startsWith(href);

          return (
            <Link
              key={tab.path}
              href={href}
              className={`px-4 py-2.5 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-black/50 hover:text-black/70 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
