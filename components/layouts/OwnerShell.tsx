"use client";
import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useSpvById } from "@/lib/data-client";
import { useState } from "react";
import { PlatformStatusBanner } from '@/components/ui/PlatformStatusBanner';
import Image from "next/image";
import {
  Home, Building2, CheckSquare, FolderOpen, Bell, User, LogOut,
  Search, ArrowLeft,
} from "lucide-react";

// Owner globalni sidebar — 5 modula
const ownerNav = [
  { label: "Pregled",       href: "/dashboard/owner",          icon: Home },
  { label: "SPV projekti",  href: "/dashboard/owner/projekti", icon: Building2 },
  { label: "Zadaci",        href: "/dashboard/owner/zadaci",   icon: CheckSquare },
  { label: "Dokumenti",     href: "/dashboard/owner/dokumenti", icon: FolderOpen },
  { label: "Profil",        href: "/dashboard/owner/profil",   icon: User },
];

export default function OwnerShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const spvMatch = pathname.match(/^\/dashboard\/owner\/spv\/([^/]+)/);
  const isInsideSpv = !!spvMatch;
  const spvId = spvMatch ? spvMatch[1] : null;
  const { data: spvData } = useSpvById(spvId || "");

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push("/login");
  }

  function renderSidebar() {
    // SPV kontekst — navigacija je u owner/spv/[id]/layout.tsx
    if (isInsideSpv) {
      return (
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <button
            onClick={() => router.push("/dashboard/owner/projekti")}
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

    // Owner globalni sidebar
    return (
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {ownerNav.map((item) => {
            const exact = item.href === "/dashboard/owner";
            const isActive = exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <button key={item.href} onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-[14px] font-medium transition-all ${
                  isActive ? "bg-[#2563EB] text-white shadow-sm" : "text-[#3C3C43] hover:bg-[#F5F5F7]"
                }`}>
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.6} className={isActive ? "text-white" : "text-[#8E8E93]"} />
                <span className="flex-1 text-left">{item.label}</span>
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
      <aside className="w-[240px] border-r border-[#E8E8EC] bg-white flex flex-col flex-shrink-0">
        <div className="h-[56px] border-b border-[#E8E8EC] flex items-center px-5 gap-2.5">
          <Image src="/logo-icon.png" alt="RIVUS" width={24} height={24} />
          <div>
            <span className="text-[15px] font-bold text-[#0B0B0C] tracking-tight">RIVUS</span>
            <span className="text-[9px] font-bold text-[#8E8E93] bg-[#F5F5F7] px-2 py-0.5 rounded ml-2">OWNER</span>
          </div>
        </div>

        {renderSidebar()}

        <div className="border-t border-[#E8E8EC] px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">O</div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-[#0B0B0C] truncate">SPV Owner</div>
              <div className="text-[11px] text-[#8E8E93]">Owner</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#8E8E93] hover:text-[#3C3C43] hover:bg-[#F5F5F7] transition-all">
            <LogOut size={14} strokeWidth={1.6} /><span>Odjava</span>
          </button>
          <div className="mt-2 px-3 text-[10px] font-medium text-[#8E8E93]/50">v1.7.1</div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[56px] border-b border-[#E8E8EC] bg-white flex items-center justify-between px-6 flex-shrink-0">
          <div className="text-[14px] font-semibold text-[#3C3C43]">
            {isInsideSpv ? (spvData?.code ?? "SPV") : "Moji projekti"}
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
                className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[12px] font-bold">O</button>
              {userMenuOpen && (<>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-[#E8E8EC] shadow-lg overflow-hidden z-50">
                  <div className="p-1">
                    <button onClick={() => { router.push("/dashboard/owner/profil"); setUserMenuOpen(false); }}
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
