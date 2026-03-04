"use client";

import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useState } from "react";
import {
  Home, Building2, Euro, FileText, FolderOpen, Bell, Layers,
  BookOpen, ArrowLeft, MessageCircle, User, Search, Receipt,
  ClipboardList,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: any;
  badge?: string;
};

export default function AccountingShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // === DETECT CONTEXT ===
  const spvMatch = pathname.match(/^\/dashboard\/accounting\/spv\/([^/]+)/);
  const isInsideSpv = !!spvMatch;
  const spvId = spvMatch ? spvMatch[1] : null;
  const spvBase = spvId ? `/dashboard/accounting/spv/${spvId}` : "";

  // === SIDEBAR: Stanje A ===
  const dashboardSidebar: { title: string; items: NavItem[] }[] = [
    {
      title: "",
      items: [
        { label: "Nadzorna ploca", href: "/dashboard/accounting", icon: Home },
        { label: "Svi SPV-ovi", href: "/dashboard/accounting/projekti", icon: Building2 },
      ],
    },
    {
      title: "RAD",
      items: [
        { label: "Otvoreni zahtjevi", href: "/dashboard/accounting/zahtjevi", icon: ClipboardList },
      ],
    },
    {
      title: "TOK",
      items: [
        { label: "Moji TOK-ovi", href: "/dashboard/accounting/tok", icon: MessageCircle },
      ],
    },
    {
      title: "SUSTAV",
      items: [
        { label: "Obavijesti", href: "/dashboard/accounting/obavijesti", icon: Bell },
        { label: "Profil", href: "/dashboard/accounting/profil", icon: User },
      ],
    },
  ];

  // === SIDEBAR: Stanje B (Inside SPV) ===
  const spvSidebar: { title: string; items: NavItem[] }[] = [
    {
      title: "",
      items: [
        { label: "Financije", href: `${spvBase}/financije`, icon: Euro },
        { label: "Racuni", href: `${spvBase}/racuni`, icon: Receipt },
        { label: "Dokumenti", href: `${spvBase}/dokumenti`, icon: FolderOpen },
        { label: "Zahtjevi", href: `${spvBase}/zahtjevi`, icon: ClipboardList },
      ],
    },
    {
      title: "EVIDENCIJA",
      items: [
        { label: "TOK", href: `${spvBase}/tok`, icon: MessageCircle },
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
              onClick={() => router.push("/dashboard/accounting/projekti")}
              className="w-full flex items-center gap-2 px-3 py-2 mb-3 rounded-md text-[13px] font-medium text-[#007AFF] hover:bg-[#007AFF]/10 transition-all"
            >
              <ArrowLeft size={16} strokeWidth={2} />
              <span>Natrag na SPV-ove</span>
            </button>
          )}

          {isInsideSpv && (
            <div className="px-3 py-2 mb-3 rounded-md bg-[#AF52DE]/5 border border-[#AF52DE]/10">
              <div className="text-[11px] font-semibold text-[#AF52DE] uppercase">SPV knjige</div>
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
                    (item.href !== "/dashboard/accounting" && item.href !== spvBase && pathname.startsWith(item.href + "/"));
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
          <div className="mt-2 px-3 text-[11px] font-medium text-black/40">v1.2.14</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-[#d1d1d6] bg-white flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard/accounting")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-semibold text-black/80 hover:bg-black/[0.04] transition-all"
            >
              <FileText size={16} />
              <span>Knjigovodstvo</span>
            </button>
            <div className="h-6 w-px bg-[#d1d1d6]" />
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium text-black/50 hover:bg-black/[0.04] transition-all">
              <Search size={14} />
              <span>Pretrazi...</span>
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
                  <div className="text-[13px] font-semibold text-black">Knjigovoda</div>
                  <div className="text-[11px] font-medium text-black/50">Racunovodstvo</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#AF52DE] flex items-center justify-center text-white text-[14px] font-bold">
                  K
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-[#d1d1d6] shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-[#d1d1d6]">
                    <div className="text-[13px] font-bold text-black">Knjigovoda</div>
                    <div className="text-[12px] font-medium text-black/50 mt-0.5">Racunovodstvo</div>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => { router.push("/dashboard/accounting/profil"); setUserMenuOpen(false); }}
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
