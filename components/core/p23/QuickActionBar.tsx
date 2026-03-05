"use client";

import { useRouter } from "next/navigation";
import { Plus, ClipboardList, Users } from "lucide-react";

interface QuickActionBarProps {
  writeDisabled: boolean;
  onCreateSpv?: () => void;
}

export default function QuickActionBar({ writeDisabled, onCreateSpv }: QuickActionBarProps) {
  const router = useRouter();

  const actions = [
    { label: "Novi SPV", icon: <Plus className="w-3.5 h-3.5" />, onClick: onCreateSpv || (() => router.push("/dashboard/core/spv-lista")), requiresWrite: true },
    { label: "Obveze", icon: <ClipboardList className="w-3.5 h-3.5" />, onClick: () => router.push("/dashboard/core/obligations"), requiresWrite: false },
    { label: "Assignments", icon: <Users className="w-3.5 h-3.5" />, onClick: () => router.push("/dashboard/core/assignments"), requiresWrite: false },
  ];

  return (
    <div className="flex items-center gap-2">
      {actions.map((a) => {
        const disabled = a.requiresWrite && writeDisabled;
        return (
          <button
            key={a.label}
            onClick={() => !disabled && a.onClick()}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all duration-150 ${
              disabled
                ? "bg-black/[0.04] text-black/25 cursor-not-allowed"
                : a.requiresWrite
                  ? "bg-black text-white hover:bg-black/85 active:scale-[0.97]"
                  : "bg-white/70 backdrop-blur-sm border border-black/[0.08] text-black/60 hover:text-black hover:border-black/[0.15]"
            }`}
            title={disabled ? "Write operacije blokirane u trenutnom modu" : undefined}
          >
            {a.icon}
            {a.label}
          </button>
        );
      })}
    </div>
  );
}
