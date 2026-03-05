"use client";

import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useSpvById } from "@/lib/data-client";
import { useState } from "react";
import { PlatformStatusBanner } from '@/components/ui/PlatformStatusBanner';
import Image from "next/image";
import {
  Home, Shield, Building2, BarChart3, Euro, FileText, FolderOpen,
  Users, Bell, Settings, CheckCircle, AlertTriangle, DollarSign,
  ArrowLeft, FileStack, LogOut, Search, Lock, Landmark,
  Activity, MessageSquare,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  badge?: number;
};

// ─── NADZORNA PLOČA — 9 modula ───────────────────────────────────────────────
const nadzornaPlocaNav: NavItem[] = [
  { label: "Pregled",      href: "/dashboard/core",               icon: Home },
  { label: "SPV projekti", href: "/dashboard/core/spv-lista",     icon: Building2 },
  { label: "Pentagon",     href: "/dashboard/core/pentagon",      icon: Shield },
  { label: "Tok",          href: "/dashboard/core/tok",           icon: Activity },
  { label: "Odobrenja",    href: "/dashboard/core/odobrenja",     icon: CheckCircle, badge: 3 },
  { label: "Obveze",       href: "/dashboard/core/obligations",   icon: FileText },
  { label: "Rizik",        href: "/dashboard/core/rizik",         icon: AlertTriangle },
  { label: "Korisnici",    href: "/dashboard/core/korisnici",     icon: Users },
  { label: "Platforma",    href: "/dashboard/core/platform-mode", icon: Lock },
];

// ─── RAČUNOVODSTVO — odvojen workspace ───────────────────────────────────────
const racunovodstvoNav: { title: string; items: NavItem[] }[] = [
  { title: "", items: [
    { label: "Pregled",            href: "/dashboard/core-company",                  icon: Home },
  ]},
  { title: "PRIHODI & RASHODI", items: [
    { label: "Prihodi",            href: "/dashboard/core-company/prihodi",           icon: Euro },
    { label: "Rashodi",            href: "/dashboard/core-company/rashodi",           icon: DollarSign },
  ]},
  { title: "FAKTURIRANJE", items: [
    { label: "Izdani računi",      href: "/dashboard/core-company/izdani-racuni",     icon: FileText },
    { label: "Primljeni računi",   href: "/dashboard/core-company/primljeni-racuni",  icon: FileText },
    { label: "eRačuni",            href: "/dashboard/core-company/eracuni",           icon: FileText },
  ]},
  { title: "POREZNO", items: [
    { label: "PDV",                href: "/dashboard/core-company/pdv",               icon: FileText },
    { label: "Bilanca",            href: "/dashboard/core-company/bilanca",           icon: BarChart3 },
    { label: "Blagajna",           href: "/dashboard/core-company/blagajna",          icon: Landmark },
  ]},
  { title: "DOKUMENTI", items: [
    { label: "Dokumenti",          href: "/dashboard/core-company/core-dokumenti",    icon: FolderOpen },
    { label: "Ugovori",            href: "/dashboard/core-company/core-ugovori",      icon: FileStack },
  ]},
  { title: "POSTAVKE", items: [
    { label: "Postavke firme",     href: "/dashboard/core-company/core-postavke",     icon: Settings },
  ]},
];

// ─── HEADER scopevi ───────────────────────────────────────────────────────────
const headerScopes = [
  { label: "Nadzorna ploča", href: "/dashboard/core",         matchFn: (p: string, spv: boolean, doo: boolean) => !doo && !spv },
  { label: "Računovodstvo",  href: "/dashboard/core-company", matchFn: (_p: string, _spv: boolean, doo: boolean) => doo },
];

export default function CoreShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const spvMatch = pathname.match(/^\/dashboard\/core\/spv\/([^/]+)/);
  const isInsideSpv = !!spvMatch;
  const spvId = spvMatch ? spvMatch[1] : null;
  const { data: spvData } = useSpvById(spvId || "");
  const isInsideCoreDoo = pathname.startsWith("/dashboard/core-company");

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push("/login");
  }

  // ─── Sidebar rendering ────────────────────────────────────────────────────

  function renderSidebar() {
    // SPV kontekst — sidebar pokazuje kontekst SPV-a, navigacija je u SPV layoutu
    if (isInsideSpv) {
      return (
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <button
            onClick={() => router.push("/dashboard/core/spv-lista")}
            className="w-full flex items-center gap-2 px-3 py-2 mb-4 rounded-lg text-[13px] font-semibold text-[#2563EB] hover:bg-[#2563EB]/5 transition-all"
          >
            <ArrowLeft size={15} strokeWidth={2.5} />
            <span>SPV projekti</span>
          </button>

          {spvData && (
            <div className="px-3 py-3 rounded-xl bg-[#2563EB]/5 border border-[#2563EB]/10">
              <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mb-1">Aktivni SPV</div>
              <div className="text-[15px] font-bold text-[#0B0B0C]">{spvData.code}</div>
              <div className="text-[12px] text-[#6E6E73] truncate mt-0.5">{spvData.name}</div>
              {spvData.phase && (
                <div className="mt-2 inline-flex px-2 py-0.5 rounded-full bg-white border border-[#E8E8EC] text-[10px] font-semibold text-[#6E6E73]">
                  {spvData.phase}
                </div>
              )}
            </div>
          )}
        </nav>
      );
    }

    // Računovodstvo workspace
    if (isInsideCoreDoo) {
      return (
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="px-3 py-2.5 mb-4 rounded-xl bg-[#2563EB]/5 border border-[#2563EB]/10">
            <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Firma</div>
            <div className="text-[14px] font-bold text-[#0B0B0C] mt-0.5">RIVUS CORE d.o.o.</div>
          </div>
          {racunovodstvoNav.map((section, idx) => (
            <div key={idx} className="mb-5">
              {section.title && (
                <div className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.08em] text-[#8E8E93] uppercase">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const exact = item.href === "/dashboard/core-company";
                  const isActive = exact ? pathname === item.href : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <button key={item.href} onClick={() => router.push(item.href)}
                      className={`w-full flex items-center gap-2.5 px-3 py-[8px] rounded-lg text-[14px] font-medium transition-all ${
                        isActive ? "bg-[#2563EB] text-white shadow-sm" : "text-[#3C3C43] hover:bg-[#F5F5F7]"
                      }`}>
                      <Icon size={16} strokeWidth={isActive ? 2.2 : 1.6} className={isActive ? "text-white" : "text-[#8E8E93]"} />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      );
    }

    // Nadzorna ploča — 9 modula, flat lista
    return (
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {nadzornaPlocaNav.map((item) => {
            const exact = item.href === "/dashboard/core";
            const isActive = exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <button key={item.href} onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-[14px] font-medium transition-all ${
                  isActive ? "bg-[#2563EB] text-white shadow-sm" : "text-[#3C3C43] hover:bg-[#F5F5F7]"
                }`}>
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.6} className={isActive ? "text-white" : "text-[#8E8E93]"} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className={`min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white/25 text-white" : "bg-red-500 text-white"
                  }`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <div className="flex h-screen bg-[#F7F7F8]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif' }}>

      {/* SIDEBAR */}
      <aside className="w-[240px] border-r border-[#E8E8EC] bg-white flex flex-col flex-shrink-0">
        <div className="h-[56px] border-b border-[#E8E8EC] flex items-center px-5 gap-2.5">
          <Image src="/logo-icon.png" alt="RIVUS" width={24} height={24} />
          <div>
            <span className="text-[15px] font-bold text-[#0B0B0C] tracking-tight">RIVUS</span>
            <span className="text-[10px] font-semibold text-[#0B0B0C]/30 ml-1.5 tracking-wider">OS</span>
          </div>
        </div>

        {renderSidebar()}

        <div className="border-t border-[#E8E8EC] px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">J</div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-[#0B0B0C] truncate">Jurke Maricic</div>
              <div className="text-[11px] text-[#8E8E93]">CORE Admin</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#8E8E93] hover:text-[#3C3C43] hover:bg-[#F5F5F7] transition-all">
            <LogOut size={14} strokeWidth={1.6} />
            <span>Odjava</span>
          </button>
          <div className="mt-2 px-3 text-[10px] font-medium text-[#8E8E93]/50">v1.7.1</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[56px] border-b border-[#E8E8EC] bg-white flex items-center justify-between px-6 flex-shrink-0">
          {/* Scope pills */}
          <div className="flex items-center gap-1">
            {headerScopes.map((scope) => {
              const active = scope.matchFn(pathname, isInsideSpv, isInsideCoreDoo);
              return (
                <button key={scope.href} onClick={() => router.push(scope.href)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                    active ? "text-[#0B0B0C] bg-[#F5F5F7]" : "text-[#8E8E93] hover:text-[#3C3C43] hover:bg-[#F5F5F7]/50"
                  }`}>
                  {scope.label}
                </button>
              );
            })}
          </div>

          {/* Search + bell + avatar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F5F7] text-[12px] text-[#8E8E93] cursor-pointer hover:bg-[#EBEBEF] transition-colors">
              <Search size={13} />
              <span>Pretraži...</span>
              <kbd className="text-[10px] bg-white border border-[#E8E8EC] rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
            </div>
            <button onClick={() => router.push("/dashboard/notifications")}
              className="relative p-2 hover:bg-[#F5F5F7] rounded-lg transition-colors">
              <Bell size={18} strokeWidth={1.6} className="text-[#3C3C43]" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[12px] font-bold">J</button>
              {userMenuOpen && (<>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-[#E8E8EC] shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-[#E8E8EC]">
                    <div className="text-[13px] font-bold text-[#0B0B0C]">Jurke Maricic</div>
                    <div className="text-[11px] text-[#8E8E93] mt-0.5">CORE Administrator</div>
                  </div>
                  <div className="p-1">
                    <button onClick={() => { router.push("/dashboard/core/platform-mode"); setUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#3C3C43] hover:bg-[#F5F5F7]">Platforma</button>
                    <button onClick={handleLogout}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50">Odjava</button>
                  </div>
                </div>
              </>)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[#F7F7F8]">
          <PlatformStatusBanner />
          <div className="p-8 max-w-[1280px]">{children}</div>
        </div>
      </main>
    </div>
  );
}
