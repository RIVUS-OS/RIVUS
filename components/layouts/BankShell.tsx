"use client";
import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useState } from "react";
import { PlatformStatusBanner } from '@/components/ui/PlatformStatusBanner';
import Image from "next/image";
import { Home, FolderOpen, Euro, Bell, BookOpen, ArrowLeft, MessageCircle, User, Archive, ClipboardCheck, LogOut } from "lucide-react";

type NavItem = { label: string; href: string; icon: React.ComponentType<any>; badge?: string };

export default function BankShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const spvMatch = pathname.match(/^\/dashboard\/bank\/spv\/([^/]+)/);
  const isInsideSpv = !!spvMatch;
  const spvId = spvMatch ? spvMatch[1] : null;
  const spvBase = spvId ? `/dashboard/bank/spv/${spvId}` : "";

  const dashboardSidebar: { title: string; items: NavItem[] }[] = [
    { title: "", items: [{ label: "Nadzorna ploča", href: "/dashboard/bank", icon: Home }]},
    { title: "EVALUACIJE", items: [{ label: "SPV-ovi za evaluaciju", href: "/dashboard/bank/evaluacije", icon: ClipboardCheck }, { label: "Arhiva", href: "/dashboard/bank/arhiva", icon: Archive }]},
    { title: "TOK", items: [{ label: "Moji TOK-ovi", href: "/dashboard/bank/tok", icon: MessageCircle }]},
    { title: "SUSTAV", items: [{ label: "Obavijesti", href: "/dashboard/bank/obavijesti", icon: Bell }, { label: "Profil", href: "/dashboard/bank/profil", icon: User }]},
  ];
  const spvSidebar: { title: string; items: NavItem[] }[] = [
    { title: "", items: [{ label: "Pregled", href: spvBase, icon: Home, badge: "RO" }, { label: "Dokumenti", href: `${spvBase}/dokumenti`, icon: FolderOpen, badge: "RO" }, { label: "Financije", href: `${spvBase}/financije`, icon: Euro, badge: "RO" }, { label: "Evaluacija", href: `${spvBase}/evaluacija`, icon: ClipboardCheck }]},
    { title: "EVIDENCIJA", items: [{ label: "TOK", href: `${spvBase}/tok`, icon: MessageCircle }, { label: "Dnevnik", href: `${spvBase}/dnevnik`, icon: BookOpen, badge: "RO" }]},
  ];
  const activeSidebar = isInsideSpv ? spvSidebar : dashboardSidebar;
  async function handleLogout() { await supabaseBrowser.auth.signOut(); router.push("/login"); }

  return (
    <div className="flex h-screen bg-[#F7F7F8]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, system-ui, sans-serif' }}>
      <aside className="w-[240px] border-r border-[#E8E8EC] bg-white flex flex-col">
        <div className="h-[56px] border-b border-[#E8E8EC] flex items-center px-5 gap-2.5">
          <Image src="/logo-icon.png" alt="RIVUS" width={24} height={24} />
          <span className="text-[15px] font-bold text-[#0B0B0C] tracking-tight">RIVUS</span>
          <span className="text-[9px] font-bold text-[#8E8E93] bg-[#F5F5F7] px-2 py-0.5 rounded ml-1">BANKA</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {isInsideSpv && (<button onClick={() => router.push("/dashboard/bank")} className="w-full flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-[13px] font-semibold text-[#2563EB] hover:bg-[#2563EB]/5 transition-all"><ArrowLeft size={15} strokeWidth={2.5} /><span>Natrag</span></button>)}
          {activeSidebar.map((section, idx) => (<div key={idx} className="mb-5">{section.title && <div className="px-3 mb-2 text-[11px] font-semibold tracking-[0.08em] text-[#6E6E73]/60 uppercase">{section.title}</div>}<div className="space-y-0.5">{section.items.map((item) => { const needsExact = item.href === "/dashboard/bank" || (isInsideSpv && item.href === spvBase); const isActive = pathname === item.href || (!needsExact && pathname.startsWith(item.href + "/")); const Icon = item.icon; return (<button key={item.href} onClick={() => router.push(item.href)} className={`w-full flex items-center gap-2.5 px-3 py-[8px] rounded-lg text-[14px] font-medium transition-all ${isActive ? "bg-[#2563EB] text-white shadow-sm" : "text-[#3C3C43] hover:bg-[#F5F5F7]"}`}><Icon size={16} strokeWidth={isActive ? 2.2 : 1.6} className={isActive ? "text-white" : "text-[#8E8E93]"} /><span className="flex-1 text-left truncate">{item.label}</span>{item.badge && <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isActive ? "bg-white/25 text-white" : "bg-[#F5F5F7] text-[#8E8E93]"}`}>{item.badge}</span>}</button>); })}</div></div>))}
        </nav>
        <div className="border-t border-[#E8E8EC] px-4 py-3">
          <div className="flex items-center gap-3 mb-3"><div className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[13px] font-bold">B</div><div><div className="text-[13px] font-semibold text-[#0B0B0C]">Banka</div><div className="text-[11px] text-[#8E8E93]">Bank</div></div></div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#8E8E93] hover:text-[#3C3C43] hover:bg-[#F5F5F7] transition-all"><LogOut size={14} strokeWidth={1.6} /><span>Odjava</span></button>
          <div className="mt-2 px-3 text-[10px] font-medium text-[#8E8E93]/50">v1.7.1</div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[56px] border-b border-[#E8E8EC] bg-white flex items-center justify-between px-6"><div className="text-[15px] font-bold text-[#0B0B0C]">{isInsideSpv ? "SPV Evaluacija" : "Banka"}</div><div className="flex items-center gap-3"><button onClick={() => router.push("/dashboard/notifications")} className="relative p-2 hover:bg-[#F5F5F7] rounded-lg transition-colors"><Bell size={18} strokeWidth={1.6} className="text-[#3C3C43]" /></button><div className="relative"><button onClick={() => setUserMenuOpen(!userMenuOpen)} className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[12px] font-bold">B</button>{userMenuOpen && (<><div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} /><div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-[#E8E8EC] shadow-lg overflow-hidden z-50"><div className="p-3 border-b border-[#E8E8EC]"><div className="text-[13px] font-bold text-[#0B0B0C]">Banka</div></div><div className="p-1"><button onClick={handleLogout} className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50">Odjava</button></div></div></>)}</div></div></header>
        <div className="flex-1 overflow-auto bg-[#F7F7F8]"><PlatformStatusBanner /><div className="p-8 max-w-[1200px]">{children}</div></div>
      </main>
    </div>
  );
}
