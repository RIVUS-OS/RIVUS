"use client";

import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useSpvById } from "@/lib/data-client";
import { useState, useEffect, useRef } from "react";
import { PlatformStatusBanner } from '@/components/ui/PlatformStatusBanner';
import Image from "next/image";
import {
  Home, Shield, Building2, Landmark, Euro, FileText,
  FolderOpen, CheckSquare, Users, Bell, Settings, Eye,
  AlertTriangle, CheckCircle, BookOpen, Briefcase,
  UserCog, AlertCircle, ShieldCheck, BarChart3,
  ArrowLeft, Lock, ClipboardList, Receipt, MessageCircle, LogOut, Search,
  Command, Layers,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  badge?: number;
};

// ============================================================================
// RIVUS OS — CoreShell v5
// Architecture: 5 root domains, 4 sidebar sections (SIGNAL/GOVERNANCE/EVIDENCIJA/UPRAVLJANJE)
// MASTER UI SPEC v1.0: 10 stavki, Command Palette, platform status footer
// ============================================================================

export default function CoreShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const cmdRef = useRef<HTMLInputElement>(null);

  // === CONTEXT DETECTION ===
  const spvMatch = pathname.match(/^\/dashboard\/core\/spv\/([^/]+)/);
  const isInsideSpv = !!spvMatch;
  const spvId = spvMatch ? spvMatch[1] : null;
  const spvBase = spvId ? `/dashboard/core/spv/${spvId}` : "";
  const { data: spvData } = useSpvById(spvId || "");
  const isInsideCoreDoo = pathname.startsWith("/dashboard/core-company");
  const isInsideModules = pathname.startsWith("/dashboard/modules");
  const isInsideHolding = pathname.startsWith("/dashboard/holding");

  // === ⌘K COMMAND PALETTE ===
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(o => !o); setCmdQuery(""); }
      if (e.key === "Escape") setCmdOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { if (cmdOpen && cmdRef.current) cmdRef.current.focus(); }, [cmdOpen]);

  // === HEADER — 5 root domains ===
  const headerDomains = [
    { label: "Control Room", href: "/dashboard/core" },
    { label: "CORE D.O.O.", href: "/dashboard/core-company" },
    { label: "SPV", href: "/dashboard/core/spv-lista" },
    { label: "Holding", href: "/dashboard/holding" },
    { label: "Moduli", href: "/dashboard/modules" },
  ];

  // === SIDEBAR: CONTROL ROOM — 10 items, 4 sections (MASTER UI SPEC v1.0) ===
  const controlRoomSidebar: { title: string; items: NavItem[] }[] = [
    { title: "SIGNAL", items: [
      { label: "Pregled", href: "/dashboard/core", icon: Home },
      { label: "SPV projekti", href: "/dashboard/core/spv-lista", icon: Building2 },
    ]},
    { title: "GOVERNANCE", items: [
      { label: "Pentagon", href: "/dashboard/core/pentagon", icon: Shield },
      { label: "TOK", href: "/dashboard/core/tok", icon: MessageCircle },
      { label: "Odobrenja", href: "/dashboard/core/odobrenja", icon: CheckCircle, badge: 3 },
      { label: "Obveze", href: "/dashboard/core/obligations", icon: ClipboardList, badge: 4 },
    ]},
    { title: "EVIDENCIJA", items: [
      { label: "Izvještaji", href: "/dashboard/core/izvjestaji", icon: BarChart3 },
      { label: "GDPR", href: "/dashboard/core/gdpr", icon: ShieldCheck },
    ]},
    { title: "UPRAVLJANJE", items: [
      { label: "Korisnici", href: "/dashboard/core/korisnici", icon: Users },
      { label: "Platforma", href: "/dashboard/core/platform-mode", icon: Settings },
    ]},
  ];

  // === SIDEBAR: SPV DETAIL — 12 items, 3 sections (RAD/MREZA/KONTROLA) ===
  const spvSidebar: { title: string; items: NavItem[] }[] = [
    { title: "RAD", items: [
      { label: "Pregled", href: spvBase, icon: Home },
      { label: "Zadaci", href: `${spvBase}/zadaci`, icon: CheckSquare },
      { label: "Dokumenti", href: `${spvBase}/dokumenti`, icon: FolderOpen },
      { label: "Financije", href: `${spvBase}/financije`, icon: Euro },
    ]},
    { title: "MREŽA", items: [
      { label: "Vertikale", href: `${spvBase}/vertikale`, icon: Briefcase },
      { label: "Banka", href: `${spvBase}/banka`, icon: Landmark },
      { label: "Knjigovodstvo", href: `${spvBase}/knjigovodstvo`, icon: FileText },
      { label: "Korisnici", href: `${spvBase}/korisnici`, icon: Users },
    ]},
    { title: "KONTROLA", items: [
      { label: "Obvezni uvjeti", href: `${spvBase}/mandatory`, icon: AlertCircle },
      { label: "Odobrenja", href: `${spvBase}/odobrenja`, icon: CheckCircle },
      { label: "Dnevnik", href: `${spvBase}/dnevnik`, icon: BookOpen },
      { label: "Postavke", href: `${spvBase}/postavke`, icon: Settings },
    ]},
  ];

  // === SIDEBAR: CORE D.O.O. — 4 sections (PRIHOD/TROSAK/POREZNO/DOKAZI) ===
  const coreDooSidebar: { title: string; items: NavItem[] }[] = [
    { title: "PRIHOD", items: [
      { label: "Nadzorna ploča", href: "/dashboard/core-company", icon: Home },
      { label: "Naplata", href: "/dashboard/core-company/billing", icon: Euro },
      { label: "Prihodi", href: "/dashboard/core-company/prihodi", icon: Euro },
      { label: "Izdani računi", href: "/dashboard/core-company/izdani-racuni", icon: FileText },
    ]},
    { title: "TROŠAK", items: [
      { label: "Rashodi", href: "/dashboard/core-company/rashodi", icon: Euro },
      { label: "Primljeni računi", href: "/dashboard/core-company/primljeni-racuni", icon: FileText },
    ]},
    { title: "POREZNO", items: [
      { label: "eRačuni", href: "/dashboard/core-company/eracuni", icon: FileText },
      { label: "PDV", href: "/dashboard/core-company/pdv", icon: FileText },
      { label: "Bilanca", href: "/dashboard/core-company/bilanca", icon: FileText },
      { label: "Blagajna", href: "/dashboard/core-company/blagajna", icon: Landmark },
    ]},
    { title: "DOKAZI", items: [
      { label: "Dokumenti", href: "/dashboard/core-company/core-dokumenti", icon: FolderOpen },
      { label: "Ugovori", href: "/dashboard/core-company/core-ugovori", icon: FileText },
      { label: "Postavke", href: "/dashboard/core-company/core-postavke", icon: Settings },
    ]},
  ];

  // === SIDEBAR: HOLDING ===
  const holdingSidebar: { title: string; items: NavItem[] }[] = [
    { title: "", items: [
      { label: "Nadzorna ploča", href: "/dashboard/holding", icon: Home },
      { label: "Portfolio", href: "/dashboard/holding/portfolio", icon: Building2 },
      { label: "Financije", href: "/dashboard/holding/financije", icon: Euro },
      { label: "Rizik", href: "/dashboard/holding/rizik", icon: AlertTriangle },
      { label: "Izvještaji", href: "/dashboard/holding/izvjestaji", icon: BarChart3 },
    ]},
  ];

  // === SIDEBAR: MODULI ===
  const modulesSidebar: { title: string; items: NavItem[] }[] = [
    { title: "", items: [
      { label: "Pregled", href: "/dashboard/modules", icon: Layers },
      { label: "Aktivni", href: "/dashboard/modules/active", icon: CheckCircle },
      { label: "Katalog", href: "/dashboard/modules/catalog", icon: FolderOpen },
      { label: "Razvoj", href: "/dashboard/modules/development", icon: Settings },
      { label: "Partner moduli", href: "/dashboard/modules/partners", icon: Users },
      { label: "Integracije", href: "/dashboard/modules/integrations", icon: Briefcase },
      { label: "Verzije", href: "/dashboard/modules/changelog", icon: BookOpen },
      { label: "Postavke", href: "/dashboard/modules/settings", icon: Settings },
    ]},
  ];

  // === DETERMINE ACTIVE SIDEBAR ===
  const activeSidebar = isInsideSpv ? spvSidebar
    : isInsideCoreDoo ? coreDooSidebar
    : isInsideHolding ? holdingSidebar
    : isInsideModules ? modulesSidebar
    : controlRoomSidebar;

  const showBackButton = isInsideSpv || isInsideCoreDoo || isInsideHolding || isInsideModules;
  const backTarget = isInsideSpv ? "/dashboard/core/spv-lista"
    : isInsideCoreDoo ? "/dashboard/core"
    : isInsideHolding ? "/dashboard/core"
    : "/dashboard/core";

  // === CONTEXT LABELS ===
  const contextCard = isInsideSpv
    ? { tag: "SPV", title: spvData?.code || "...", subtitle: spvData?.name || "" }
    : isInsideCoreDoo
    ? { tag: "Firma", title: "RIVUS CORE d.o.o.", subtitle: "Revenue Engine" }
    : isInsideHolding
    ? { tag: "Holding", title: "RIVUS Holding d.o.o.", subtitle: "Portfolio nadzor" }
    : isInsideModules
    ? { tag: "Platforma", title: "Moduli", subtitle: "Capability Layer" }
    : null;

  async function handleLogout() { await supabaseBrowser.auth.signOut(); window.location.href = "/login"; }

  // === COMMAND PALETTE ITEMS ===
  const cmdItems = [
    { label: "Pregled", desc: "Control Room dashboard", href: "/dashboard/core" },
    { label: "Pentagon", desc: "Governance control tower", href: "/dashboard/core/pentagon" },
    { label: "SPV projekti", desc: "Lista svih SPV-ova", href: "/dashboard/core/spv-lista" },
    { label: "Odobrenja", desc: "Pending odluke", href: "/dashboard/core/odobrenja" },
    { label: "Obveze", desc: "Sve obveze", href: "/dashboard/core/obligations" },
    { label: "TOK", desc: "Real-time događaji", href: "/dashboard/core/tok" },
    { label: "Izvještaji", desc: "Formalni izlazi sustava", href: "/dashboard/core/izvjestaji" },
    { label: "Korisnici", desc: "User management", href: "/dashboard/core/korisnici" },
    { label: "GDPR", desc: "Privacy compliance", href: "/dashboard/core/gdpr" },
    { label: "Platforma", desc: "Platform mode control", href: "/dashboard/core/platform-mode" },
    { label: "CORE D.O.O.", desc: "Revenue Engine", href: "/dashboard/core-company" },
    { label: "Naplata", desc: "Billing engine", href: "/dashboard/core-company/billing" },
    { label: "Moduli", desc: "Capability layer", href: "/dashboard/modules" },
    { label: "Holding", desc: "Portfolio nadzor", href: "/dashboard/holding" },
    { label: "Novi SPV", desc: "Kreiraj novi SPV", href: "/dashboard/core/spv-lista" },
  ];
  const filteredCmd = cmdQuery.length > 0
    ? cmdItems.filter(i => i.label.toLowerCase().includes(cmdQuery.toLowerCase()) || i.desc.toLowerCase().includes(cmdQuery.toLowerCase()))
    : cmdItems;

  return (
    <div className="flex h-screen bg-[#F7F7F8]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif' }}>

      {/* === COMMAND PALETTE OVERLAY === */}
      {cmdOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setCmdOpen(false)} />
          <div className="relative w-[520px] bg-white rounded-2xl border border-[#E8E8EC] shadow-2xl overflow-hidden z-10">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E8E8EC]">
              <Search size={18} className="text-[#8E8E93]" />
              <input ref={cmdRef} value={cmdQuery} onChange={e => setCmdQuery(e.target.value)} placeholder="Pretraži RIVUS OS..." className="flex-1 text-[15px] text-[#0B0B0C] placeholder-[#C7C7CC] outline-none bg-transparent" />
              <kbd className="text-[10px] bg-[#F5F5F7] border border-[#E8E8EC] rounded px-1.5 py-0.5 font-mono text-[#8E8E93]">ESC</kbd>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {filteredCmd.map((item, i) => (
                <button key={item.href + i} onClick={() => { router.push(item.href); setCmdOpen(false); }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#F5F5F7] transition-colors text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F5F7] flex items-center justify-center"><Command size={14} className="text-[#8E8E93]" /></div>
                  <div><div className="text-[13px] font-semibold text-[#0B0B0C]">{item.label}</div><div className="text-[11px] text-[#8E8E93]">{item.desc}</div></div>
                </button>
              ))}
              {filteredCmd.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema rezultata</div>}
            </div>
          </div>
        </div>
      )}

      {/* === SIDEBAR === */}
      <aside className="w-[240px] border-r border-[#E8E8EC] bg-white flex flex-col flex-shrink-0">
        {/* Logo — 42x42 + RIVUS 22px — Jurke potvrdio */}
        <div className="h-[56px] border-b border-[#E8E8EC] flex items-center px-4 gap-2.5 flex-shrink-0">
          <Image src="/logo-icon.png" alt="RIVUS" width={42} height={42} />
          <span className="text-[22px] font-bold text-[#0B0B0C] tracking-tight">RIVUS</span>
          <span className="text-[10px] font-medium text-[#8E8E93] tracking-wider">OS</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Back button */}
          {showBackButton && (
            <button onClick={() => router.push(backTarget)} className="w-full flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-[13px] font-semibold text-[#2563EB] hover:bg-[#2563EB]/5 transition-all">
              <ArrowLeft size={15} strokeWidth={2.5} /><span>Natrag</span>
            </button>
          )}

          {/* Context card */}
          {contextCard && (
            <div className="px-3 py-2.5 mb-4 rounded-xl bg-[#2563EB]/5 border border-[#2563EB]/10">
              <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">{contextCard.tag}</div>
              <div className="text-[14px] font-bold text-[#0B0B0C] mt-0.5">{contextCard.title}</div>
              {contextCard.subtitle && <div className="text-[12px] text-[#6E6E73] truncate">{contextCard.subtitle}</div>}
            </div>
          )}

          {/* Nav sections */}
          {activeSidebar.map((section, idx) => (
            <div key={idx} className="mb-5">
              {section.title && (
                <div className="px-3 mb-2 text-[11px] font-semibold tracking-[0.08em] text-[#8E8E93] uppercase">{section.title}</div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const exactPaths = ["/dashboard/core", "/dashboard/core-company", "/dashboard/modules", "/dashboard/holding", spvBase];
                  const needsExact = exactPaths.includes(item.href);
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

        {/* Platform status + user profile + logout */}
        <div className="border-t border-[#E8E8EC] px-4 py-3 flex-shrink-0">
          {/* Platform status rail */}
          <div className="flex items-center gap-2 px-2 py-1.5 mb-3 rounded-lg bg-[#F7F7F8]">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold text-[#3C3C43]">NORMAL</span>
            <span className="text-[10px] text-[#8E8E93] ml-auto">1 GATE · 4 obveze</span>
          </div>
          {/* User */}
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
        </div>
      </aside>

      {/* === MAIN === */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header — 5 root domains + search + bell + avatar */}
        <header className="h-[56px] border-b border-[#E8E8EC] bg-white flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-1">
            {headerDomains.map((d) => {
              const isActive = d.href === "/dashboard/core"
                ? (pathname === "/dashboard/core" || (pathname.startsWith("/dashboard/core/") && !pathname.startsWith("/dashboard/core-company")))
                : pathname.startsWith(d.href);
              return (
                <button key={d.href} onClick={() => router.push(d.href)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                    isActive ? "text-[#0B0B0C] bg-[#F5F5F7]" : "text-[#8E8E93] hover:text-[#3C3C43] hover:bg-[#F5F5F7]/50"
                  }`}>
                  {d.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setCmdOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F5F7] text-[12px] text-[#8E8E93] hover:bg-[#EDEDF0] transition-colors">
              <Search size={13} /> <span>Pretraži...</span> <kbd className="text-[10px] bg-white border border-[#E8E8EC] rounded px-1.5 py-0.5 font-mono">&#x2318;K</kbd>
            </button>
            <button onClick={() => router.push("/dashboard/notifications")} className="relative p-2 hover:bg-[#F5F5F7] rounded-lg transition-colors">
              <Bell size={18} strokeWidth={1.6} className="text-[#3C3C43]" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[12px] font-bold">J</button>
              {userMenuOpen && (<>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-[#E8E8EC] shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-[#E8E8EC]">
                    <div className="text-[13px] font-bold text-[#0B0B0C]">Jurke Maricic</div>
                    <div className="text-[11px] text-[#8E8E93] mt-0.5">CORE Administrator</div>
                  </div>
                  <div className="p-1">
                    <button onClick={() => { router.push("/dashboard/core/platform-mode"); setUserMenuOpen(false); }} className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#3C3C43] hover:bg-[#F5F5F7]">Postavke</button>
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

