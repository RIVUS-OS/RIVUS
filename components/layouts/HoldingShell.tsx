"use client";
import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useState } from "react";
import { PlatformStatusBanner } from '@/components/ui/PlatformStatusBanner';
import Image from "next/image";
import { Home, Building2, Euro, Bell, BookOpen, AlertTriangle, MessageCircle, User, FileStack, Eye, LogOut } from "lucide-react";

type NavItem = { label: string; href: string; icon: React.ComponentType<any>; badge?: string };

export default function HoldingShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const sidebar: { title: string; items: NavItem[] }[] = [
    { title: "", items: [{ label: "Nadzorna ploča", href: "/dashboard/holding", icon: Home }]},
    { title: "PREGLED", items: [{ label: "Portfolio", href: "/dashboard/holding/portfolio", icon: Building2, badge: "RO" }, { label: "Financije", href: "/dashboard/holding/financije", icon: Euro, badge: "RO" }, { label: "Rizik", href: "/dashboard/holding/rizik", icon: AlertTriangle, badge: "RO" }, { label: "Izvještaji", href: "/dashboard/holding/izvjestaji", icon: FileStack, badge: "RO" }]},
    { title: "TOK", items: [{ label: "Eskalacije", href: "/dashboard/holding/tok", icon: MessageCircle, badge: "RO" }]},
    { title: "SUSTAV", items: [{ label: "Obavijesti", href: "/dashboard/holding/obavijesti", icon: Bell }, { label: "Profil", href: "/dashboard/holding/profil", icon: User }]},
  ];
  async function handleLogout() { await supabaseBrowser.auth.signOut(); router.push("/login"); }

  return (
    <div className="flex h-screen bg-[#f5f5f7]">
      <aside className="w-[232px] border-r border-black/[0.08] bg-white/60 backdrop-blur-xl flex flex-col">
        <div className="h-[52px] border-b border-black/[0.06] flex items-center px-4 gap-2.5">
          <Image src="/logo-icon.png" alt="RIVUS" width={22} height={22} />
          <span className="text-[14px] font-bold text-black tracking-tight">RIVUS</span>
          <span className="text-[9px] font-semibold text-black/25 bg-black/[0.04] px-1.5 py-0.5 rounded">HOLD.</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-2.5 py-3">
          {sidebar.map((section, idx) => (<div key={idx} className="mb-4">{section.title && <div className="px-3 mb-1.5 text-[10px] font-bold tracking-widest text-black/25 uppercase">{section.title}</div>}<div className="space-y-0.5">{section.items.map((item) => { const isActive = pathname === item.href || (item.href !== "/dashboard/holding" && pathname.startsWith(item.href + "/")); const Icon = item.icon; return (<button key={item.href} onClick={() => router.push(item.href)} className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[12px] font-medium transition-all ${isActive ? "bg-black text-white" : "text-black/60 hover:text-black hover:bg-black/[0.04]"}`}><Icon size={15} strokeWidth={isActive ? 2.5 : 1.8} className={isActive ? "text-white" : "text-black/35"} /><span className="flex-1 text-left truncate">{item.label}</span>{item.badge && <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isActive ? "bg-white/20 text-white/70" : "bg-black/[0.05] text-black/30"}`}>{item.badge}</span>}</button>); })}</div></div>))}
        </nav>
        <div className="border-t border-black/[0.06] px-3 py-2.5"><button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium text-black/40 hover:text-black/70 hover:bg-black/[0.04] transition-all"><LogOut size={14} strokeWidth={1.8} /><span>Odjava</span></button><div className="mt-1.5 px-3 text-[10px] font-medium text-black/20">v1.7.1</div></div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[52px] border-b border-black/[0.06] bg-white/80 backdrop-blur-xl flex items-center justify-between px-5"><div className="text-[13px] font-bold text-black">Holding</div><div className="flex items-center gap-2"><button onClick={() => router.push("/dashboard/notifications")} className="relative p-2 hover:bg-black/[0.04] rounded-lg transition-colors"><Bell size={16} strokeWidth={1.8} className="text-black/40" /></button><div className="relative"><button onClick={() => setUserMenuOpen(!userMenuOpen)} className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white text-[12px] font-bold hover:bg-black/80 transition-colors">H</button>{userMenuOpen && (<><div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} /><div className="absolute right-0 top-full mt-2 w-52 bg-white/90 backdrop-blur-xl rounded-xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50"><div className="p-3 border-b border-black/[0.06]"><div className="text-[12px] font-bold text-black">Holding</div></div><div className="p-1"><button onClick={handleLogout} className="w-full text-left px-3 py-1.5 rounded-lg text-[12px] font-medium text-red-500/80 hover:bg-red-50">Odjava</button></div></div></>)}</div></div></header>
        <div className="flex-1 overflow-auto bg-[#f5f5f7]"><PlatformStatusBanner /><div className="p-6 max-w-[1200px]">{children}</div></div>
      </main>
    </div>
  );
}
