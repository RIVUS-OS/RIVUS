"use client";

import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useSpvById } from "@/lib/data-client";
import { useState } from "react";
import { PlatformStatusBanner } from '@/components/ui/PlatformStatusBanner';
import {
  Home, Shield, Building2, BarChart3, Landmark, Euro, FileText,
  FolderOpen, CheckSquare, Download, Users, Bell, Settings, Eye,
  Layers, Zap, AlertTriangle, CheckCircle, BookOpen, Briefcase,
  UserCog, FileStack, GitBranch, AlertCircle, ShieldCheck, DollarSign,
  ArrowLeft, Lock, ClipboardList, Receipt, MessageCircle, TrendingUp, Clock, RefreshCw, Globe, Search,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: any;
  disabled?: boolean;
  disabledTooltip?: string;
};

export default function CoreShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // === DETECT CONTEXT ===
  const spvMatch = pathname.match(/^\/dashboard\/core\/spv\/([^/]+)/);
  const isInsideSpv = !!spvMatch;
  const spvId = spvMatch ? spvMatch[1] : null;
  const spvBase = spvId ? `/dashboard/core/spv/${spvId}` : "";
  const { data: spvData } = useSpvById(spvId || "");

  // CORE D.O.O. = /dashboard/core-company/*
  const isInsideCoreDoo = pathname.startsWith("/dashboard/core-company");

  // === HEADER NAV (Context Switcher) ===
  const headerNav = [
    { label: "RIVUS OS", href: "/dashboard/core", icon: Shield },
    { label: "CORE D.O.O.", href: "/dashboard/core-company", icon: Building2 },
    { label: "SPV", href: "/dashboard/owner", icon: Briefcase },
    { label: "Banke", href: "/dashboard/bank", icon: Landmark },
    { label: "Vertikale", href: "/dashboard/vertical", icon: GitBranch },
    { label: "Holding", href: "/dashboard/holding", icon: Layers },
  ];

  // === SIDEBAR: SPV DETAIL ===
  const spvSidebar: { title: string; items: NavItem[] }[] = [
    {
      title: "",
      items: [
        { label: "Pregled", href: `${spvBase}`, icon: Home },
        { label: "Zadaci", href: `${spvBase}/zadaci`, icon: CheckSquare },
        { label: "Dokumenti", href: `${spvBase}/dokumenti`, icon: FolderOpen },
        { label: "Financije", href: `${spvBase}/financije`, icon: Euro },
        { label: "Vertikale", href: `${spvBase}/vertikale`, icon: Briefcase },
        { label: "Banka", href: `${spvBase}/banka`, icon: Landmark },
        { label: "Knjigovodstvo", href: `${spvBase}/knjigovodstvo`, icon: FileText },
        { label: "Obvezni uvjeti", href: `${spvBase}/mandatory`, icon: AlertCircle },
        { label: "Odobrenja", href: `${spvBase}/odobrenja`, icon: CheckCircle },
        { label: "RIVUS naplata", href: `${spvBase}/rivus-billing`, icon: Receipt },
        { label: "Korisnici", href: `${spvBase}/korisnici`, icon: Users },
      ],
    },
    {
      title: "EVIDENCIJA",
      items: [
        { label: "TOK", href: `${spvBase}/tok`, icon: MessageCircle },
        { label: "Dnevnik", href: `${spvBase}/dnevnik`, icon: BookOpen },
        { label: "Postavke", href: `${spvBase}/postavke`, icon: Settings },
      ],
    },
  ];

  // === SIDEBAR: CORE D.O.O. (/dashboard/core-company/*) ===
  const coreDooSidebar: { title: string; items: NavItem[] }[] = [
    {
      title: "",
      items: [
        { label: "Nadzorna ploca", href: "/dashboard/core-company", icon: Home },
      ],
    },
    {
      title: "PRIHODI & RASHODI",
      items: [
        { label: "Prihodi", href: "/dashboard/core-company/prihodi", icon: Euro },
        { label: "Rashodi", href: "/dashboard/core-company/rashodi", icon: DollarSign },
      ],
    },
    {
      title: "FAKTURIRANJE",
      items: [
        { label: "Izdani racuni", href: "/dashboard/core-company/izdani-racuni", icon: FileText },
        { label: "Primljeni racuni", href: "/dashboard/core-company/primljeni-racuni", icon: FileText },
        { label: "eRacuni", href: "/dashboard/core-company/eracuni", icon: FileText },
      ],
    },
    {
      title: "POREZNO & IZVJESTAJI",
      items: [
        { label: "PDV pregled", href: "/dashboard/core-company/pdv", icon: FileText },
        { label: "Bilanca (informativna)", href: "/dashboard/core-company/bilanca", icon: BarChart3 },
        { label: "Blagajna", href: "/dashboard/core-company/blagajna", icon: Landmark },
      ],
    },
    {
      title: "DOKUMENTI",
      items: [
        { label: "Dokumenti", href: "/dashboard/core-company/core-dokumenti", icon: FolderOpen },
        { label: "Ugovori", href: "/dashboard/core-company/core-ugovori", icon: FileStack },
      ],
    },
    {
      title: "POSTAVKE",
      items: [
        { label: "Postavke firme", href: "/dashboard/core-company/core-postavke", icon: Settings },
      ],
    },
  ];

  // === SIDEBAR: MONITORING (Control Room) ===
  const controlRoomSidebar: { title: string; items: NavItem[] }[] = [
    {
      title: "",
      items: [
        { label: "Pregled", href: "/dashboard/core", icon: Home },
      ],
    },
    {
      title: "PENTAGON",
      items: [
        { label: "Pentagon", href: "/dashboard/core/pentagon", icon: Shield },
        { label: "TOK kontrola", href: "/dashboard/core/tok", icon: MessageCircle },
        { label: "Rizik", href: "/dashboard/core/rizik", icon: AlertTriangle },
        { label: "Odobrenja", href: "/dashboard/core/odobrenja", icon: CheckCircle },
        { label: "Dijagnostika", href: "/dashboard/core/compliance", icon: Eye },
        { label: "Blokade", href: "/dashboard/core/blokade", icon: Lock },
        { label: "Mandatory", href: "/dashboard/core/mandatory", icon: AlertCircle },
      ],
    },
    {
      title: "UPRAVLJANJE",
      items: [
        { label: "Assignmenti", href: "/dashboard/core/assignments", icon: UserCog },
        { label: "Obveze", href: "/dashboard/core/obligations", icon: ClipboardList },
        { label: "GDPR", href: "/dashboard/core/gdpr", icon: ShieldCheck },
      ],
    },
    {
      title: "NADZOR",
      items: [
        { label: "SPV Projekti", href: "/dashboard/core/projekti", icon: Building2 },
        { label: "Vertikale", href: "/dashboard/core/vertikale-nadzor", icon: Briefcase },
        { label: "Knjigovodje", href: "/dashboard/core/knjigovodje-nadzor", icon: UserCog },
        { label: "Banke", href: "/dashboard/core/banke-nadzor", icon: Landmark },
        { label: "Financije (nadzor)", href: "/dashboard/core/financije-nadzor", icon: Euro },
      ],
    },
    {
      title: "EVIDENCIJA",
      items: [
        { label: "Dnevnik", href: "/dashboard/core/dnevnik", icon: BookOpen },
        { label: "Aktivnosti", href: "/dashboard/core/aktivnosti", icon: Zap },
        { label: "Izvjestaji", href: "/dashboard/core/izvjestaji", icon: FileStack },
      ],
    },
    {
      title: "SUSTAV",
      items: [
        { label: "Platform Mode", href: "/dashboard/core/platform-mode", icon: Shield },
        { label: "Korisnici", href: "/dashboard/core/korisnici", icon: Users },
        { label: "Uloge", href: "/dashboard/core/uloge", icon: ShieldCheck },
        { label: "Obavijesti", href: "/dashboard/core/obavijesti", icon: Bell },
        { label: "Postavke", href: "/dashboard/core/postavke", icon: Settings },
      ],
    },
    {
      title: "",
      items: [
        { label: "CORE D.O.O.", href: "/dashboard/core-company", icon: Building2 },
      ],
    },
  ];

  // === ACTIVE SIDEBAR ===
  const activeSidebar = isInsideSpv ? spvSidebar : isInsideCoreDoo ? coreDooSidebar : controlRoomSidebar;
  const showBackButton = isInsideSpv || isInsideCoreDoo;

  async function handleLogout() {
    const supabase = supabaseBrowser;
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      {/* SIDEBAR */}
      <aside className="w-[240px] border-r border-[#d1d1d6] bg-[#fafafa] flex flex-col">
        <div className="h-14 border-b border-[#d1d1d6] flex items-center px-4 gap-2">
          <Layers size={18} className="text-[#007AFF]" />
          <div className="text-[15px] font-bold text-black tracking-tight">RIVUS OS</div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Back button */}
          {showBackButton && (
            <button
              onClick={() => router.push("/dashboard/core")}
              className="w-full flex items-center gap-2 px-3 py-2 mb-3 rounded-md text-[13px] font-medium text-[#007AFF] hover:bg-[#007AFF]/10 transition-all"
            >
              <ArrowLeft size={16} strokeWidth={2} />
              <span>{isInsideCoreDoo ? "Natrag na Monitoring" : "Natrag na Monitoring"}</span>
            </button>
          )}

          {/* SPV header */}
          {isInsideSpv && (
            <div className="px-3 py-2 mb-3 rounded-md bg-[#007AFF]/5 border border-[#007AFF]/10">
              <div className="text-[11px] font-semibold text-[#007AFF] uppercase">SPV</div>
              <div className="text-[14px] font-bold text-black mt-0.5">{spvData?.code || "..."}</div>
              <div className="text-[12px] text-black/50 truncate">{spvData?.name || ""}</div>
            </div>
          )}

          {/* CORE D.O.O. header */}
          {isInsideCoreDoo && (
            <div className="px-3 py-2 mb-3 rounded-md bg-[#007AFF]/5 border border-[#007AFF]/10">
              <div className="text-[11px] font-semibold text-[#007AFF] uppercase">Interna firma</div>
              <div className="text-[14px] font-bold text-black mt-0.5">RIVUS CORE d.o.o.</div>
            </div>
          )}

          {activeSidebar.map((section, idx) => (
            <div key={idx} className="mb-5">
              {section.title && (
                <div className="px-2 mb-2 text-[11px] font-semibold tracking-wide text-black/50 uppercase">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const needsExactMatch = item.href === "/dashboard/core" || item.href === "/dashboard/core-company" || (isInsideSpv && item.href === spvBase);
                  const isActive = pathname === item.href ||
                    (!needsExactMatch && pathname.startsWith(item.href + "/"));
                  const Icon = item.icon;
                  const isDisabled = item.disabled || false;

                  return (
                    <button
                      key={item.href}
                      onClick={() => !isDisabled && router.push(item.href)}
                      disabled={isDisabled}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all
                        ${isActive
                          ? "bg-[#007AFF] text-white shadow-sm"
                          : isDisabled
                            ? "text-black/30 cursor-not-allowed"
                            : "text-black hover:bg-black/[0.05]"
                        }
                      `}
                      title={isDisabled ? item.disabledTooltip : undefined}
                    >
                      <Icon
                        size={16}
                        strokeWidth={2}
                        className={isActive ? "text-white" : isDisabled ? "text-black/30" : "text-[#8E8E93]"}
                      />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {isDisabled && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/10 text-black/40 font-bold uppercase">
                          Uskoro
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-[#d1d1d6] p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium text-black/70 hover:bg-black/[0.05] transition-all"
          >
            <span>Odjava</span>
          </button>
          <div className="mt-2 px-3 text-[11px] font-medium text-black/40">v1.2.14</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-[#d1d1d6] bg-white flex items-center justify-between px-6">
          <div className="flex items-center gap-1 overflow-x-auto">
            {headerNav.map((item, idx) => {
              const isActive = item.href === "/dashboard/core"
                ? pathname === "/dashboard/core" || (pathname.startsWith("/dashboard/core/") && !pathname.startsWith("/dashboard/core-company"))
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <button
                  key={item.href + idx}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "text-[#007AFF] bg-[#007AFF]/10"
                      : "text-black/60 hover:text-black hover:bg-black/[0.04]"
                  }`}
                >
                  {Icon && <Icon size={14} strokeWidth={2} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => router.push("/dashboard/notifications")}
              className="relative p-2 hover:bg-black/[0.04] rounded-lg transition-colors"
            >
              <Bell size={18} className="text-black/70" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-black/[0.04] transition-all"
              >
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-black">Jurke Maricic</div>
                  <div className="text-[11px] font-medium text-black/50">jurke@rivus.hr</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#007AFF] flex items-center justify-center text-white text-[14px] font-bold">
                  J
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-[#d1d1d6] shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-[#d1d1d6]">
                    <div className="text-[13px] font-bold text-black">Jurke Maricic</div>
                    <div className="text-[12px] font-medium text-black/50 mt-0.5">CORE Administrator</div>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => { router.push("/dashboard/core/postavke"); setUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium text-black/70 hover:bg-black/[0.04]"
                    >
                      Postavke
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-semibold text-red-600 hover:bg-red-50"
                    >
                      Odjava
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[#f5f5f7]">
          <PlatformStatusBanner />
          <div className="p-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
