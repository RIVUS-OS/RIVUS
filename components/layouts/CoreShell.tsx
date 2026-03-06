"use client";

import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useSpvById } from "@/lib/data-client";
import { useState } from "react";
import { PlatformStatusBanner } from '@/components/ui/PlatformStatusBanner';
import Image from "next/image";
import {
  Home, Shield, Building2, BarChart3, Landmark, Euro, FileText,
  FolderOpen, CheckSquare, Users, Bell, Settings, Eye,
  Layers, Zap, AlertTriangle, CheckCircle, BookOpen, Briefcase,
  UserCog, FileStack, GitBranch, AlertCircle, ShieldCheck, DollarSign,
  ArrowLeft, Lock, ClipboardList, Receipt, MessageCircle, LogOut,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
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
  const isInsideCoreDoo = pathname.startsWith("/dashboard/core-company");

  // === HEADER NAV ===
  const headerNav = [
    { label: "Control Room", href: "/dashboard/core", icon: Shield },
    { label: "CORE D.O.O.", href: "/dashboard/core-company", icon: Building2 },
    { label: "SPV", href: "/dashboard/core/spv-lista", icon: Briefcase },
    { label: "Banke", href: "/dashboard/core/banke-nadzor", icon: Landmark },
    { label: "Vertikale", href: "/dashboard/core/vertikale-nadzor", icon: GitBranch },
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

  // === SIDEBAR: CORE D.O.O. ===
  const coreDooSidebar: { title: string; items: NavItem[] }[] = [
    {
      title: "",
      items: [
        { label: "Nadzorna ploča", href: "/dashboard/core-company", icon: Home },
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
        { label: "Izdani računi", href: "/dashboard/core-company/izdani-racuni", icon: FileText },
        { label: "Primljeni računi", href: "/dashboard/core-company/primljeni-racuni", icon: FileText },
        { label: "eRačuni", href: "/dashboard/core-company/eracuni", icon: FileText },
      ],
    },
    {
      title: "POREZNO & IZVJEŠTAJI",
      items: [
        { label: "PDV pregled", href: "/dashboard/core-company/pdv", icon: FileText },
        { label: "Bilanca", href: "/dashboard/core-company/bilanca", icon: BarChart3 },
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

  // === SIDEBAR: CONTROL ROOM ===
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
        { label: "Knjigovođe", href: "/dashboard/core/knjigovodje-nadzor", icon: UserCog },
        { label: "Banke", href: "/dashboard/core/banke-nadzor", icon: Landmark },
        { label: "Financije", href: "/dashboard/core/financije-nadzor", icon: Euro },
      ],
    },
    {
      title: "EVIDENCIJA",
      items: [
        { label: "Dnevnik", href: "/dashboard/core/dnevnik", icon: BookOpen },
        { label: "Aktivnosti", href: "/dashboard/core/aktivnosti", icon: Zap },
        { label: "Izvještaji", href: "/dashboard/core/izvjestaji", icon: FileStack },
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
  ];

  const activeSidebar = isInsideSpv ? spvSidebar : isInsideCoreDoo ? coreDooSidebar : controlRoomSidebar;
  const showBackButton = isInsideSpv || isInsideCoreDoo;

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      {/* SIDEBAR */}
      <aside className="w-[232px] border-r border-black/[0.08] bg-white/60 backdrop-blur-xl flex flex-col">
        {/* Logo header */}
        <div className="h-[52px] border-b border-black/[0.06] flex items-center px-4 gap-2.5">
          <Image src="/logo-icon.png" alt="RIVUS" width={22} height={22} />
          <span className="text-[14px] font-bold text-black tracking-tight">RIVUS</span>
          <span className="text-[10px] font-medium text-black/30 tracking-wider">OS</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-3 scrollbar-thin">
          {/* Back button */}
          {showBackButton && (
            <button
              onClick={() => router.push("/dashboard/core")}
              className="w-full flex items-center gap-2 px-3 py-2 mb-2.5 rounded-lg text-[12px] font-semibold text-black/50 hover:text-black hover:bg-black/[0.04] transition-all"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>Natrag</span>
            </button>
          )}

          {/* SPV context header */}
          {isInsideSpv && (
            <div className="px-3 py-2.5 mb-3 rounded-xl bg-black/[0.03] border border-black/[0.05]">
              <div className="text-[10px] font-bold text-black/30 uppercase tracking-wider">SPV</div>
              <div className="text-[13px] font-bold text-black mt-0.5">{spvData?.code || "..."}</div>
              <div className="text-[11px] text-black/40 truncate">{spvData?.name || ""}</div>
            </div>
          )}

          {/* CORE D.O.O. context header */}
          {isInsideCoreDoo && (
            <div className="px-3 py-2.5 mb-3 rounded-xl bg-black/[0.03] border border-black/[0.05]">
              <div className="text-[10px] font-bold text-black/30 uppercase tracking-wider">Firma</div>
              <div className="text-[13px] font-bold text-black mt-0.5">RIVUS CORE d.o.o.</div>
            </div>
          )}

          {/* Nav sections */}
          {activeSidebar.map((section, idx) => (
            <div key={idx} className="mb-4">
              {section.title && (
                <div className="px-3 mb-1.5 text-[10px] font-bold tracking-widest text-black/25 uppercase">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const needsExact = item.href === "/dashboard/core" || item.href === "/dashboard/core-company" || (isInsideSpv && item.href === spvBase);
                  const isActive = pathname === item.href || (!needsExact && pathname.startsWith(item.href + "/"));
                  const Icon = item.icon;
                  const isDisabled = item.disabled || false;

                  return (
                    <button
                      key={item.href}
                      onClick={() => !isDisabled && router.push(item.href)}
                      disabled={isDisabled}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[12px] font-medium transition-all
                        ${isActive
                          ? "bg-black text-white"
                          : isDisabled
                            ? "text-black/20 cursor-not-allowed"
                            : "text-black/60 hover:text-black hover:bg-black/[0.04]"
                        }
                      `}
                      title={isDisabled ? item.disabledTooltip : undefined}
                    >
                      <Icon
                        size={15}
                        strokeWidth={isActive ? 2.5 : 1.8}
                        className={isActive ? "text-white" : isDisabled ? "text-black/20" : "text-black/35"}
                      />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-black/[0.06] px-3 py-2.5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium text-black/40 hover:text-black/70 hover:bg-black/[0.04] transition-all"
          >
            <LogOut size={14} strokeWidth={1.8} />
            <span>Odjava</span>
          </button>
          <div className="mt-1.5 px-3 text-[10px] font-medium text-black/20">v1.7.1</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-[52px] border-b border-black/[0.06] bg-white/80 backdrop-blur-xl flex items-center justify-between px-5">
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {headerNav.map((item, idx) => {
              const isActive = item.href === "/dashboard/core"
                ? pathname === "/dashboard/core" || (pathname.startsWith("/dashboard/core/") && !pathname.startsWith("/dashboard/core-company"))
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <button
                  key={item.href + idx}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "text-black bg-black/[0.06]"
                      : "text-black/35 hover:text-black/60 hover:bg-black/[0.03]"
                  }`}
                >
                  <Icon size={13} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => router.push("/dashboard/notifications")}
              className="relative p-2 hover:bg-black/[0.04] rounded-lg transition-colors"
            >
              <Bell size={16} strokeWidth={1.8} className="text-black/40" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white text-[12px] font-bold hover:bg-black/80 transition-colors"
              >
                J
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white/90 backdrop-blur-xl rounded-xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50">
                    <div className="p-3 border-b border-black/[0.06]">
                      <div className="text-[12px] font-bold text-black">Jurke Maricic</div>
                      <div className="text-[11px] text-black/35 mt-0.5">CORE Administrator</div>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => { router.push("/dashboard/core/postavke"); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-[12px] font-medium text-black/60 hover:bg-black/[0.04]"
                      >
                        Postavke
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-[12px] font-medium text-red-500/80 hover:bg-red-50"
                      >
                        Odjava
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[#f5f5f7]">
          <PlatformStatusBanner />
          <div className="p-6 max-w-[1200px]">{children}</div>
        </div>
      </main>
    </div>
  );
}
