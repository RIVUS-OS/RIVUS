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
  ArrowLeft, Lock, ClipboardList, Receipt, MessageCircle, LogOut, Search,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  badge?: number;
  disabled?: boolean;
};

export default function CoreShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const spvMatch = pathname.match(/^\/dashboard\/core\/spv\/([^/]+)/);
  const isInsideSpv = !!spvMatch;
  const spvId = spvMatch ? spvMatch[1] : null;
  const spvBase = spvId ? `/dashboard/core/spv/${spvId}` : "";
  const { data: spvData } = useSpvById(spvId || "");
  const isInsideCoreDoo = pathname.startsWith("/dashboard/core-company");

  const headerNav = [
    { label: "Control Room", href: "/dashboard/core" },
    { label: "CORE D.O.O.", href: "/dashboard/core-company" },
    { label: "SPV", href: "/dashboard/core/spv-lista" },
    { label: "Banke", href: "/dashboard/core/banke-nadzor" },
    { label: "Vertikale", href: "/dashboard/core/vertikale-nadzor" },
    { label: "Holding", href: "/dashboard/holding" },
  ];

  const spvSidebar: { title: string; items: NavItem[] }[] = [
    { title: "", items: [
      { label: "Pregled", href: spvBase, icon: Home },
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
    ]},
    { title: "EVIDENCIJA", items: [
      { label: "TOK", href: `${spvBase}/tok`, icon: MessageCircle },
      { label: "Dnevnik", href: `${spvBase}/dnevnik`, icon: BookOpen },
      { label: "Postavke", href: `${spvBase}/postavke`, icon: Settings },
    ]},
  ];

  const coreDooSidebar: { title: string; items: NavItem[] }[] = [
    { title: "", items: [{ label: "Nadzorna ploca", href: "/dashboard/core-company", icon: Home }]},
    { title: "PRIHODI & RASHODI", items: [
      { label: "Prihodi", href: "/dashboard/core-company/prihodi", icon: Euro },
      { label: "Rashodi", href: "/dashboard/core-company/rashodi", icon: DollarSign },
    ]},
    { title: "FAKTURIRANJE", items: [
      { label: "Izdani racuni", href: "/dashboard/core-company/izdani-racuni", icon: FileText },
      { label: "Primljeni racuni", href: "/dashboard/core-company/primljeni-racuni", icon: FileText },
      { label: "eRacuni", href: "/dashboard/core-company/eracuni", icon: FileText },
    ]},
    { title: "POREZNO & IZVJESTAJI", items: [
      { label: "PDV pregled", href: "/dashboard/core-company/pdv", icon: FileText },
      { label: "Bilanca", href: "/dashboard/core-company/bilanca", icon: BarChart3 },
      { label: "Blagajna", href: "/dashboard/core-company/blagajna", icon: Landmark },
    ]},
    { title: "DOKUMENTI", items: [
      { label: "Dokumenti", href: "/dashboard/core-company/core-dokumenti", icon: FolderOpen },
      { label: "Ugovori", href: "/dashboard/core-company/core-ugovori", icon: FileStack },
    ]},
    { title: "POSTAVKE", items: [
      { label: "Postavke firme", href: "/dashboard/core-company/core-postavke", icon: Settings },
    ]},
  ];

  const controlRoomSidebar: { title: string; items: NavItem[] }[] = [
    { title: "", items: [{ label: "Pregled", href: "/dashboard/core", icon: Home }]},
    { title: "PENTAGON", items: [
      { label: "Pentagon", href: "/dashboard/core/pentagon", icon: Shield },
      { label: "TOK kontrola", href: "/dashboard/core/tok", icon: MessageCircle },
      { label: "Rizik", href: "/dashboard/core/rizik", icon: AlertTriangle },
      { label: "Odobrenja", href: "/dashboard/core/odobrenja", icon: CheckCircle, badge: 3 },
      { label: "Dijagnostika", href: "/dashboard/core/compliance", icon: Eye },
      { label: "Blokade", href: "/dashboard/core/blokade", icon: Lock, badge: 1 },
      { label: "Mandatory", href: "/dashboard/core/mandatory", icon: AlertCircle },
    ]},
    { title: "UPRAVLJANJE", items: [
      { label: "Assignmenti", href: "/dashboard/core/assignments", icon: UserCog },
      { label: "Obveze", href: "/dashboard/core/obligations", icon: ClipboardList },
      { label: "GDPR", href: "/dashboard/core/gdpr", icon: ShieldCheck },
    ]},
    { title: "NADZOR", items: [
      { label: "SPV Projekti", href: "/dashboard/core/projekti", icon: Building2 },
      { label: "Vertikale", href: "/dashboard/core/vertikale-nadzor", icon: Briefcase },
      { label: "Knjigovodje", href: "/dashboard/core/knjigovodje-nadzor", icon: UserCog },
      { label: "Banke", href: "/dashboard/core/banke-nadzor", icon: Landmark },
      { label: "Financije", href: "/dashboard/core/financije-nadzor", icon: Euro },
    ]},
    { title: "EVIDENCIJA", items: [
      { label: "Dnevnik", href: "/dashboard/core/dnevnik", icon: BookOpen },
      { label: "Aktivnosti", href: "/dashboard/core/aktivnosti", icon: Zap },
      { label: "Izvjestaji", href: "/dashboard/core/izvjestaji", icon: FileStack },
    ]},
    { title: "SUSTAV", items: [
      { label: "Platform Mode", href: "/dashboard/core/platform-mode", icon: Shield },
      { label: "Korisnici", href: "/dashboard/core/korisnici", icon: Users },
      { label: "Uloge", href: "/dashboard/core/uloge", icon: ShieldCheck },
      { label: "Obavijesti", href: "/dashboard/core/obavijesti", icon: Bell },
      { label: "Postavke", href: "/dashboard/core/postavke", icon: Settings },
    ]},
  ];

  const activeSidebar = isInsideSpv ? spvSidebar : isInsideCoreDoo ? coreDooSidebar : controlRoomSidebar;
  const showBackButton = isInsideSpv || isInsideCoreDoo;

  async function handleLogout() { await supabaseBrowser.auth.signOut(); router.push("/login"); }

  return (
    <div className="flex h-screen bg-[#F7F7F8]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif' }}>
      {/* SIDEBAR */}
      <aside className="w-[240px] border-r border-[#E8E8EC] bg-white flex flex-col">
        {/* Logo — NE DIRATI, Jurke potvrdio */}
        <div className="h-[56px] border-b border-[#E8E8EC] flex items-center px-4 gap-2.5">
          <Image src="/logo-icon.png" alt="RIVUS" width={42} height={42} />
          <span className="text-[22px] font-bold text-[#0B0B0C] tracking-tight">RIVUS</span>
          <span className="text-[10px] font-medium text-[#8E8E93] tracking-wider">OS</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {showBackButton && (
            <button onClick={() => router.push("/dashboard/core")} className="w-full flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-[13px] font-semibold text-[#2563EB] hover:bg-[#2563EB]/5 transition-all">
              <ArrowLeft size={15} strokeWidth={2.5} /><span>Natrag</span>
            </button>
          )}
          {isInsideSpv && (
            <div className="px-3 py-2.5 mb-4 rounded-xl bg-[#2563EB]/5 border border-[#2563EB]/10">
              <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">SPV</div>
              <div className="text-[14px] font-bold text-[#0B0B0C] mt-0.5">{spvData?.code || "..."}</div>
              <div className="text-[12px] text-[#6E6E73] truncate">{spvData?.name || ""}</div>
            </div>
          )}
          {isInsideCoreDoo && (
            <div className="px-3 py-2.5 mb-4 rounded-xl bg-[#2563EB]/5 border border-[#2563EB]/10">
              <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Firma</div>
              <div className="text-[14px] font-bold text-[#0B0B0C] mt-0.5">RIVUS CORE d.o.o.</div>
            </div>
          )}
          {activeSidebar.map((section, idx) => (
            <div key={idx} className="mb-5">
              {section.title && (
                <div className="px-3 mb-2 text-[11px] font-semibold tracking-[0.08em] text-[#8E8E93] uppercase">{section.title}</div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const needsExact = item.href === "/dashboard/core" || item.href === "/dashboard/core-company" || (isInsideSpv && item.href === spvBase);
                  const isActive = pathname === item.href || (!needsExact && pathname.startsWith(item.href + "/"));
                  const Icon = item.icon;
                  return (
                    <button key={item.href} onClick={() => router.push(item.href)}
                      className={`w-full flex items-center gap-2.5 px-3 py-[8px] rounded-lg text-[14px] font-medium transition-all ${
                        isActive ? "bg-[#2563EB] text-white shadow-sm" : "text-[#3C3C43] hover:bg-[#F5F5F7]"
                      }`}>
                      <Icon size={16} strokeWidth={isActive ? 2.2 : 1.6} className={isActive ? "text-white" : "text-[#8E8E93]"} />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className={`min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-[10px] font-bold ${
                          isActive ? "bg-white/25 text-white" : "bg-red-500 text-white"
                        }`}>{item.badge}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User profile + logout */}
        <div className="border-t border-[#E8E8EC] px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[13px] font-bold">J</div>
            <div>
              <div className="text-[13px] font-semibold text-[#0B0B0C]">Jurke Maricic</div>
              <div className="text-[11px] text-[#8E8E93]">CORE Admin</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#8E8E93] hover:text-[#3C3C43] hover:bg-[#F5F5F7] transition-all">
            <LogOut size={14} strokeWidth={1.6} /><span>Odjava</span>
          </button>
          <div className="mt-2 px-3 text-[10px] font-medium text-[#C7C7CC]">v1.7.1</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[56px] border-b border-[#E8E8EC] bg-white flex items-center justify-between px-6">
          <div className="flex items-center gap-1">
            {headerNav.map((item) => {
              const isActive = item.href === "/dashboard/core"
                ? pathname === "/dashboard/core" || (pathname.startsWith("/dashboard/core/") && !pathname.startsWith("/dashboard/core-company"))
                : pathname.startsWith(item.href);
              return (
                <button key={item.href} onClick={() => router.push(item.href)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                    isActive ? "text-[#0B0B0C] bg-[#F5F5F7]" : "text-[#8E8E93] hover:text-[#3C3C43] hover:bg-[#F5F5F7]/50"
                  }`}>
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F5F7] text-[12px] text-[#8E8E93] cursor-pointer hover:bg-[#EDEDF0] transition-colors">
              <Search size={13} /> <span>Pretrazi...</span> <kbd className="text-[10px] bg-white border border-[#E8E8EC] rounded px-1.5 py-0.5 font-mono">&#x2318;K</kbd>
            </div>
            <button onClick={() => router.push("/dashboard/notifications")} className="relative p-2 hover:bg-[#F5F5F7] rounded-lg transition-colors">
              <Bell size={18} strokeWidth={1.6} className="text-[#3C3C43]" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[12px] font-bold">J</button>
              {userMenuOpen && (<>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-[#E8E8EC] shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-[#E8E8EC]"><div className="text-[13px] font-bold text-[#0B0B0C]">Jurke Maricic</div><div className="text-[11px] text-[#8E8E93] mt-0.5">CORE Administrator</div></div>
                  <div className="p-1">
                    <button onClick={() => { router.push("/dashboard/core/postavke"); setUserMenuOpen(false); }} className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#3C3C43] hover:bg-[#F5F5F7]">Postavke</button>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50">Odjava</button>
                  </div>
                </div>
              </>)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[#F7F7F8]">
          <PlatformStatusBanner />
          <div className="p-8 max-w-[1200px]">{children}</div>
        </div>
      </main>
    </div>
  );
}
