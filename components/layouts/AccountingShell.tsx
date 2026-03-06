"use client";
import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useSpvById } from "@/lib/data-client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useState } from "react";
import { PlatformStatusBanner } from '@/components/ui/PlatformStatusBanner';
import Image from "next/image";
import {
  Home, Euro, FileText, Bell, LogOut, ArrowLeft, Search,
  MessageCircle, BookOpen, ClipboardList,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
};

const accountingNav: NavItem[] = [
  { label: "Pregled",          href: "/dashboard/accounting",          icon: Home },
  { label: "Dodijeljeni SPV",  href: "/dashboard/accounting/projekti", icon: ClipboardList },
  { label: "Zahtjevi",         href: "/dashboard/accounting/zahtjevi", icon: FileText },
];

export default function AccountingShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { mode } = usePlatformMode();

  const spvMatch = pathname.match(/^\/dashboard\/accounting\/spv\/([^/]+)/);
  const isInsideSpv = !!spvMatch;
  const spvId = spvMatch ? spvMatch[1] : null;
  const spvBase = spvId ? `/dashboard/accounting/spv/${spvId}` : "";
  const { data: spvData } = useSpvById(spvId || "");

  // SPV sidebar — role-scoped pages only
  const spvSidebar: { title: string; items: NavItem[] }[] = [
    { title: "RAD", items: [
      { label: "Pregled", href: spvBase, icon: Home },
      { label: "Financije", href: `${spvBase}/financije`, icon: Euro },
      { label: "Računi", href: `${spvBase}/racuni`, icon: FileText },
      { label: "Dokumenti", href: `${spvBase}/dokumenti`, icon: FileText },
    ]},
    { title: "KONTROLA", items: [
      { label: "TOK", href: `${spvBase}/tok`, icon: MessageCircle },
      { label: "Dnevnik", href: `${spvBase}/dnevnik`, icon: BookOpen },
      { label: "Zahtjevi", href: `${spvBase}/zahtjevi`, icon: ClipboardList },
    ]},
  ];

  function handleLogout() { supabaseBrowser.auth.signOut().catch(() => {}); window.location.href = "/login"; }

  function isActive(href: string) {
    if (href === spvBase || href === "/dashboard/accounting") return pathname === href;
    return pathname.startsWith(href);
  }

  function renderSidebar() {
    if (isInsideSpv) {
      return (
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <button onClick={() => router.push("/dashboard/accounting/projekti")}
            className="w-full flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-[13px] font-semibold text-[#2563EB] hover:bg-[#2563EB]/5 transition-all">
            <ArrowLeft size={15} strokeWidth={2.5} />
            <span>Moji SPV-ovi</span>
          </button>
          {spvData && (
            <div className="px-3 py-3 rounded-xl bg-[#2563EB]/5 border border-[#2563EB]/10 mb-4">
              <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mb-1">SPV</div>
              <div className="text-[15px] font-bold text-[#0B0B0C]">{spvData.code}</div>
              <div className="text-[12px] text-[#6E6E73] truncate mt-0.5">{spvData.name}</div>
              {spvData.phase && (
                <div className="mt-2 inline-flex px-2 py-0.5 rounded-full bg-white border border-[#E8E8EC] text-[10px] font-semibold text-[#6E6E73]">
                  {spvData.phase}
                </div>
              )}
            </div>
          )}
          {spvSidebar.map(section => (
            <div key={section.title} className="mb-4">
              <div className="px-3 mb-1.5 text-[10px] font-bold text-[#8E8E93] uppercase tracking-[0.08em]">{section.title}</div>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <button key={item.href} onClick={() => router.push(item.href)}
                      className={`w-full flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-[14px] font-medium transition-all ${
                        active ? "bg-[#2563EB] text-white shadow-sm" : "text-[#3C3C43] hover:bg-[#F5F5F7]"
                      }`}>
                      <Icon size={16} strokeWidth={active ? 2.2 : 1.6} className={active ? "text-white" : "text-[#8E8E93]"} />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      );
    }

    return (
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {accountingNav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <button key={item.href} onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-[14px] font-medium transition-all ${
                  active ? "bg-[#2563EB] text-white shadow-sm" : "text-[#3C3C43] hover:bg-[#F5F5F7]"
                }`}>
                <Icon size={16} strokeWidth={active ? 2.2 : 1.6} className={active ? "text-white" : "text-[#8E8E93]"} />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  const modeColor = mode === "NORMAL" ? "bg-emerald-500" : mode === "SAFE" ? "bg-amber-500" : mode === "LOCKDOWN" ? "bg-red-500" : "bg-blue-500";

  return (
    <div className="flex h-screen bg-[#F7F7F8]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif' }}>
      <aside className="w-[240px] border-r border-[#E8E8EC] bg-white flex flex-col flex-shrink-0">
        <div className="h-[56px] border-b border-[#E8E8EC] flex items-center px-5 gap-2.5">
          <Image src="/logo-icon.png" alt="RIVUS" width={24} height={24} />
          <div>
            <span className="text-[15px] font-bold text-[#0B0B0C] tracking-tight">RIVUS</span>
            <span className="text-[9px] font-bold text-[#8E8E93] bg-[#F5F5F7] px-2 py-0.5 rounded ml-2">KNJIG.</span>
          </div>
        </div>

        {renderSidebar()}

        <div className="border-t border-[#E8E8EC] px-4 py-3">
          <div className="flex items-center gap-2 px-3 py-1.5 mb-3">
            <div className={`h-2 w-2 rounded-full ${modeColor}`} />
            <span className="text-[11px] font-semibold text-[#8E8E93]">{mode}</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">K</div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-[#0B0B0C] truncate">Knjigovodstvo</div>
              <div className="text-[11px] text-[#8E8E93]">Accounting</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#8E8E93] hover:text-[#3C3C43] hover:bg-[#F5F5F7] transition-all">
            <LogOut size={14} strokeWidth={1.6} /><span>Odjava</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[56px] border-b border-[#E8E8EC] bg-white flex items-center justify-between px-6 flex-shrink-0">
          <div className="text-[14px] font-semibold text-[#3C3C43]">
            {isInsideSpv ? (spvData?.code ?? "SPV") : "Knjigovodstvo"}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F5F7] text-[12px] text-[#8E8E93] cursor-pointer hover:bg-[#EBEBEF] transition-colors">
              <Search size={13} /><span>Pretraži...</span>
            </div>
            <button onClick={() => router.push("/dashboard/notifications")}
              className="relative p-2 hover:bg-[#F5F5F7] rounded-lg transition-colors">
              <Bell size={18} strokeWidth={1.6} className="text-[#3C3C43]" />
            </button>
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[12px] font-bold">K</button>
              {userMenuOpen && (<>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-[#E8E8EC] shadow-lg overflow-hidden z-50">
                  <div className="p-1">
                    <button onClick={() => { router.push("/dashboard/accounting/profil"); setUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#3C3C43] hover:bg-[#F5F5F7]">Profil</button>
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
