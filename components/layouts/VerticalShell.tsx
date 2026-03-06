"use client";
import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useSpvById } from "@/lib/data-client";
import { useState } from "react";
import { PlatformStatusBanner } from '@/components/ui/PlatformStatusBanner';
import Image from "next/image";
import { Bell, User, LogOut, ArrowLeft, Search } from "lucide-react";

const verticalNav = [
  { label: "Pregled",              href: "/dashboard/vertical" },
  { label: "Dodijeljeni projekti", href: "/dashboard/vertical/projekti" },
  { label: "Moji zadaci",          href: "/dashboard/vertical/zadaci" },
  { label: "Dokumenti",            href: "/dashboard/vertical/dokumenti" },
  { label: "Profil",               href: "/dashboard/vertical/profil" },
];

export default function VerticalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const spvMatch = pathname.match(/^\/dashboard\/vertical\/spv\/([^/]+)/);
  const isInsideSpv = !!spvMatch;
  const spvId = spvMatch ? spvMatch[1] : null;
  const { data: spvData } = useSpvById(spvId || "");

  function handleLogout() { supabaseBrowser.auth.signOut().catch(() => {}); window.location.href = "/login"; }

  return (
    <div className="flex h-screen bg-[#F7F7F8]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif' }}>
      <aside className="w-[240px] border-r border-[#E8E8EC] bg-white flex flex-col flex-shrink-0">
        <div className="h-[56px] border-b border-[#E8E8EC] flex items-center px-5 gap-2.5">
          <Image src="/logo-icon.png" alt="RIVUS" width={24} height={24} />
          <div>
            <span className="text-[15px] font-bold text-[#0B0B0C] tracking-tight">RIVUS</span>
            <span className="text-[9px] font-bold text-[#8E8E93] bg-[#F5F5F7] px-2 py-0.5 rounded ml-2">VERT.</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {isInsideSpv ? (
            <>
              <button onClick={() => router.push("/dashboard/vertical/projekti")}
                className="w-full flex items-center gap-2 px-3 py-2 mb-4 rounded-lg text-[13px] font-semibold text-[#2563EB] hover:bg-[#2563EB]/5 transition-all">
                <ArrowLeft size={15} strokeWidth={2.5} /><span>Moji projekti</span>
              </button>
              {spvData && (
                <div className="px-3 py-3 rounded-xl bg-[#2563EB]/5 border border-[#2563EB]/10">
                  <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mb-1">Aktivni SPV</div>
                  <div className="text-[15px] font-bold text-[#0B0B0C]">{spvData.code}</div>
                  <div className="text-[12px] text-[#6E6E73] truncate mt-0.5">{spvData.name}</div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-0.5">
              {verticalNav.map((item) => {
                const exact = item.href === "/dashboard/vertical";
                const isActive = exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <button key={item.href} onClick={() => router.push(item.href)}
                    className={`w-full text-left px-3 py-[9px] rounded-lg text-[14px] font-medium transition-all ${
                      isActive ? "bg-[#2563EB] text-white shadow-sm" : "text-[#3C3C43] hover:bg-[#F5F5F7]"
                    }`}>
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </nav>
        <div className="border-t border-[#E8E8EC] px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">V</div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-[#0B0B0C] truncate">Vertikala</div>
              <div className="text-[11px] text-[#8E8E93]">Vertical</div>
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
            {isInsideSpv ? (spvData?.code ?? "SPV") : "Vertikala"}
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
                className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[12px] font-bold">V</button>
              {userMenuOpen && (<>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-[#E8E8EC] shadow-lg overflow-hidden z-50">
                  <div className="p-1">
                    <button onClick={() => { router.push("/dashboard/vertical/profil"); setUserMenuOpen(false); }}
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


