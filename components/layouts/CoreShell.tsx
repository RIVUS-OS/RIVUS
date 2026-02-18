"use client";

import { useRouter, usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useState } from "react";
import {
  Home,
  Shield,
  Building2,
  BarChart3,
  Landmark,
  Euro,
  FileText,
  FolderOpen,
  CheckSquare,
  Download,
  TrendingUp,
  Users,
  Bell,
  Settings,
  PlusCircle,
  Eye,
  Layers,
  Zap,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Briefcase,
  UserCog,
  FileStack,
  Plus,
  GitBranch,
  AlertCircle as AlertCircleIcon,
  ShieldCheck,
  Upload,
  DollarSign,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: any;
  actionHref?: string; // Optional "+" action
  actionLabel?: string; // Tooltip for "+" button
  disabled?: boolean; // For "later" features
  disabledTooltip?: string;
};

export default function CoreShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const headerNav = [
    // GRUPA 1: OPERATIVNI NADZOR
    { label: "Pentagon", href: "/dashboard/core/pentagon", icon: Shield },
    { label: "SPV", href: "/dashboard/core/spv-control", icon: Building2 },
    { label: "Vertikale", href: "/dashboard/core/vertical-control", icon: Users },
    { label: "Financije", href: "/dashboard/core/accounting-control", icon: Euro },
    { label: "Banka", href: "/dashboard/core/bank", icon: Landmark },
    
    // SEPARATOR
    { label: "separator", href: "", icon: null },
    
    // GRUPA 2: RIZIK I KONTROLA
    { label: "Rizik", href: "/dashboard/core/risk", icon: AlertTriangle },
    { label: "Odobrenja", href: "/dashboard/core/approvals", icon: CheckCircle },
    { label: "Dijagnostika", href: "/dashboard/core/diagnostics", icon: Eye },
    
    // SEPARATOR
    { label: "separator", href: "", icon: null },
    
    // GRUPA 3: ANALITIKA I IZVJEŠTAJI
    { label: "Dnevnik", href: "/dashboard/core/event-log", icon: BookOpen },
    { label: "Aktivnosti", href: "/dashboard/core/activities", icon: Zap },
    { label: "Statistika", href: "/dashboard/core/statistics", icon: BarChart3 },
    { label: "Izvještaji", href: "/dashboard/core/reports", icon: FileStack },
  ];

  const navSections = [
    {
      title: "",
      items: [
        { label: "Nadzorna ploča", href: "/dashboard/core", icon: Home },
      ],
    },
    {
      title: "PROJEKTI (SPV)",
      items: [
        { 
          label: "SPV lista", 
          href: "/dashboard/core/spvs", 
          icon: Building2,
          actionHref: "/dashboard/core/add-spv",
          actionLabel: "Dodaj novi SPV"
        },
        { 
          label: "Zadaci", 
          href: "/dashboard/core/tasks", 
          icon: CheckSquare,
          actionHref: "/dashboard/core/add-task",
          actionLabel: "Novi zadatak"
        },
        { 
          label: "Dokumenti projekata", 
          href: "/dashboard/core/project-documents", 
          icon: FolderOpen,
          actionHref: "/dashboard/core/upload-document",
          actionLabel: "Upload dokument"
        },
        { 
          label: "Lifecycle", 
          href: "/dashboard/core/lifecycle", 
          icon: GitBranch,
          disabled: true,
          disabledTooltip: "Uskoro - workflow u izradi"
        },
        { 
          label: "Mandatory", 
          href: "/dashboard/core/mandatory", 
          icon: AlertCircleIcon,
          disabled: true,
          disabledTooltip: "Uskoro - mandatory task sustav"
        },
      ] as NavItem[],
    },
    {
      title: "IZVRŠITELJI",
      items: [
        { 
          label: "Vertikale", 
          href: "/dashboard/core/verticals", 
          icon: Briefcase,
          actionHref: "/dashboard/core/add-vertical",
          actionLabel: "Dodaj vertikalu"
        },
        { 
          label: "Knjigovođe", 
          href: "/dashboard/core/accountants", 
          icon: UserCog,
          actionHref: "/dashboard/core/add-accountant",
          actionLabel: "Dodaj knjigovođu"
        },
        { 
          label: "Banke", 
          href: "/dashboard/core/banks", 
          icon: Landmark,
          actionHref: "/dashboard/core/add-bank",
          actionLabel: "Dodaj banku"
        },
      ] as NavItem[],
    },
    {
      title: "CORE D.O.O.",
      items: [
        { label: "CORE Dashboard", href: "/dashboard/core-company", icon: Home },
        { 
          label: "Računi (prihodi)", 
          href: "/dashboard/core/invoices", 
          icon: Euro,
          actionHref: "/dashboard/core/add-invoice",
          actionLabel: "Novi račun"
        },
        { 
          label: "Obveze", 
          href: "/dashboard/core/expenses", 
          icon: DollarSign,
          actionHref: "/dashboard/core/add-expense",
          actionLabel: "Nova obveza"
        },
        { 
          label: "Knjigovodstvo", 
          href: "/dashboard/core/accounting", 
          icon: FileText,
          actionHref: "/dashboard/core/accounting-request",
          actionLabel: "Novi zahtjev"
        },
        { 
          label: "CORE Dokumenti", 
          href: "/dashboard/core/core-documents", 
          icon: FolderOpen,
          actionHref: "/dashboard/core/upload-core-document",
          actionLabel: "Upload dokument"
        },
        { 
          label: "CORE Ugovori", 
          href: "/dashboard/core/contracts", 
          icon: FileStack,
          disabled: true,
          disabledTooltip: "Uskoro - contract management"
        },
        { label: "Izvoz", href: "/dashboard/core/export", icon: Download },
      ] as NavItem[],
    },
    {
      title: "SUSTAV",
      items: [
        { 
          label: "Korisnici", 
          href: "/dashboard/core/users", 
          icon: Users,
          actionHref: "/dashboard/core/add-user",
          actionLabel: "Dodaj korisnika"
        },
        { 
          label: "Uloge i dozvole", 
          href: "/dashboard/core/roles", 
          icon: ShieldCheck
        },
        { label: "Obavijesti", href: "/dashboard/core/notifications", icon: Bell },
        { label: "Postavke", href: "/dashboard/core/settings", icon: Settings },
      ] as NavItem[],
    },
  ];

  async function handleLogout() {
    const supabase = supabaseBrowser;
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <div className="flex h-screen macos-app-bg">
      <aside className="w-[240px] border-r border-[#d1d1d6] macos-sidebar-bg flex flex-col">
        <div className="h-14 border-b border-[#d1d1d6] flex items-center px-4 gap-2">
          <Layers size={18} className="text-[#007AFF]" />
          <div className="text-[15px] font-bold text-black tracking-tight">RIVUS OS</div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navSections.map((section, idx) => (
            <div key={idx} className="mb-5">
              {section.title && (
                <div className="px-2 mb-2 text-[11px] font-semibold tracking-wide text-black/50 uppercase">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  const isDisabled = item.disabled || false;
                  
                  return (
                    <div key={item.href} className="relative group">
                      <button
                        onClick={() => !isDisabled && router.push(item.href)}
                        disabled={isDisabled}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all
                          ${isActive 
                            ? 'bg-[#007AFF] text-white shadow-sm' 
                            : isDisabled
                              ? 'text-black/30 cursor-not-allowed'
                              : 'text-black hover:bg-black/[0.05]'
                          }
                        `}
                        title={isDisabled ? item.disabledTooltip : undefined}
                      >
                        <Icon size={16} strokeWidth={2} className={isActive ? "text-white" : isDisabled ? "text-black/30" : "text-[#8E8E93]"} />
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        
                        {/* DISABLED BADGE */}
                        {isDisabled && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/10 text-black/40 font-bold uppercase">
                            Soon
                          </span>
                        )}
                      </button>

                      {/* PLUS BUTTON (on hover, only if actionHref exists and not disabled) */}
                      {item.actionHref && !isDisabled && (
                        <button
                          onClick={() => router.push(item.actionHref!)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded"
                          title={item.actionLabel}
                        >
                          <Plus size={14} className="text-[#007AFF]" strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
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
            <span>⎋</span>
            <span>Logout</span>
          </button>
          <div className="mt-2 px-3 text-[11px] font-medium text-black/40">v1.0.0</div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-[#d1d1d6] bg-white flex items-center justify-between px-6">
          <div className="flex items-center gap-3 overflow-x-auto">
            {headerNav.map((item, idx) => {
              // SEPARATOR
              if (item.label === "separator") {
                return (
                  <div key={`sep-${idx}`} className="h-6 w-px bg-[#d1d1d6] flex-shrink-0" />
                );
              }

              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
                    isActive 
                      ? "text-[#007AFF] bg-[#007AFF]/10" 
                      : "text-black/70 hover:text-black hover:bg-black/[0.04]"
                  }`}
                >
                  {Icon && <Icon size={16} strokeWidth={2} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="relative p-2 hover:bg-black/[0.04] rounded-lg transition-colors">
              <Bell size={20} className="text-black/70" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-black/[0.04] transition-all"
              >
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-black">Jurke Maričić</div>
                  <div className="text-[11px] font-medium text-black/50">jurke@rivus.hr</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#007AFF] flex items-center justify-center text-white text-[14px] font-bold">
                  J
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-[#d1d1d6] shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-[#d1d1d6]">
                    <div className="text-[13px] font-bold text-black">Jurke Maričić</div>
                    <div className="text-[12px] font-medium text-black/50 mt-0.5">CORE Administrator</div>
                  </div>
                  <div className="p-1.5">
                    <button className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium text-black/70 hover:bg-black/[0.04] transition-all">
                      ⚙️ Postavke
                    </button>
                    <button className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium text-black/70 hover:bg-black/[0.04] transition-all">
                      👤 Profil
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-all"
                    >
                      ⎋ Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto macos-app-bg p-6">
          {children}
        </div>
      </main>
    </div>
  );
}