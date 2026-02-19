"use client";

import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useState } from "react";
import {
  Home, Building2, FolderOpen, CheckSquare, Bell, Layers,
  BookOpen, ArrowLeft, MessageCircle, User, Search,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: any;
  badge?: string;
};

export default function VerticalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // === DETECT CONTEXT ===
  const spvMatch = pathname.match(/^\/dashboard\/vertical\/spv\/([^/]+)/);
  const isInsideSpv = !!spvMatch;
  const spvId = spvMatch ? spvMatch[1] : null;
  const spvBase = spvId ? `/dashboard/vertical/spv/${spvId}` : "";

  // === SIDEBAR: Stanje A ===
  const dashboardSidebar: { title: string; items: NavItem[] }[] = [
    {
      title: "",
      items: [
        { label: "Nadzorna ploča", href: "/dashboard/vertical", icon: Home },
        { label: "Dodijeljeni projekti", href: "/dashboard/vertical/projekti", icon: Building2 },
      ],
    },
    {
      title: "RAD",
      items: [
        { label: "Moji zadaci", href: "/dashboard/vertical/zadaci", icon: CheckSquare },
        { label: "Moji dokumenti", href: "/dashboard/vertical/dokumenti", icon: FolderOpen },
      ],
    },
    {
      title: "TOK",
      items: [
        { label: "Moji TOK-ovi", href: "/dashboard/vertical/tok", icon: MessageCircle },
      ],
    },
    {
      title: "SUSTAV",
      items: [
        { label: "Obavijesti", href: "/dashboard/vertical/obavijesti", icon: Bell },
        { label: "Profil", href: "/dashboard/vertical/profil", icon: User },
      ],
    },
  ];

  // === SIDEBAR: Stanje B (Inside SPV) ===
  const spvSidebar: { title: string; items: NavItem[] }[] = [
    {
      title: "",
      items: [
        { label: "Pregled", href: `${spvBase}`, icon: Home, badge: "RO" },
        { label: "Moji zadaci", href: `${spvBase}/zadaci`, icon: CheckSquare },
        { label: "Dokumenti", href: `${spvBase}/dokumenti`, icon: FolderOpen },
      ],
    },
    {
      title: "EVIDENCIJA",
      items: [
        { label: "TOK", href: `${spvBase}/tok`, icon: MessageCircle },
        { label: "Obavijesti", href: `${spvBase}/obavijesti`, icon: Bell },
        { label: "Dnevnik", href: `${spvBase}/dnevnik`, icon: BookOpen, badge: "RO" },
      ],
    },
  ];

  const activeSidebar = isInsideSpv ? spvSidebar : dashboardSidebar;

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
          {isInsideSpv && (
            <button
              onClick={() => router.push("/dashboard/vertical/projekti")}
              className="w-full flex items-center gap-2 px-3 py-2 mb-3 rounded-md text-[13px] font-medium text-[#007AFF] hover:bg-[#007AFF]/10 transition-all"
            >
              <ArrowLeft size={16} strokeWidth={2} />
              <span>Natrag na projekte</span>
            </button>
          )}

          {isInsideSpv && (
            <div className="px-3 py-2 mb-3 rounded-md bg-[#FF9500]/5 border border-[#FF9500]/10">
              <div className="text-[11px] font-semibold text-[#FF9500] uppercase">SPV projekt</div>
              <div className="text-[14px] font-bold text-black mt-0.5">{spvId}</div>
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
                  const isActive = pathname === item.href ||
                    (item.href !== "/dashboard/vertical" && item.href !== spvBase && pathname.startsWith(item.href + "/"));
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all
                        ${isActive
                          ? "bg-[#007AFF] text-white shadow-sm"
                          : "text-black hover:bg-black/[0.05]"
                        }
                      `}
                    >
                      <Icon
                        size={16}
                        strokeWidth={2}
                        className={isActive ? "text-white" : "text-[#8E8E93]"}
                      />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          isActive ? "bg-white/20 text-white" : "bg-black/10 text-black/40"
                        }`}>
                          {item.badge}
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
          <div className="mt-2 px-3 text-[11px] font-medium text-black/40">v1.0.0</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-[#d1d1d6] bg-white flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard/vertical")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-semibold text-black/80 hover:bg-black/[0.04] transition-all"
            >
              <Home size={16} />
              <span>Početna</span>
            </button>
            <div className="h-6 w-px bg-[#d1d1d6]" />
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium text-black/50 hover:bg-black/[0.04] transition-all">
              <Search size={14} />
              <span>Pretraži...</span>
            </button>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="relative p-2 hover:bg-black/[0.04] rounded-lg transition-colors">
              <Bell size={18} className="text-black/70" />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-black/[0.04] transition-all"
              >
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-black">Vertikala</div>
                  <div className="text-[11px] font-medium text-black/50">Izvršitelj</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#FF9500] flex items-center justify-center text-white text-[14px] font-bold">
                  V
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-[#d1d1d6] shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-[#d1d1d6]">
                    <div className="text-[13px] font-bold text-black">Vertikala</div>
                    <div className="text-[12px] font-medium text-black/50 mt-0.5">Izvršitelj</div>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => { router.push("/dashboard/vertical/profil"); setUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium text-black/70 hover:bg-black/[0.04]"
                    >
                      Profil
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

        <div className="flex-1 overflow-auto bg-[#f5f5f7] p-6">{children}</div>
      </main>
    </div>
  );
}
