"use client";

/**
 * RIVUS OS — P23: QuickActionBar (Control Room)
 * Brze akcije: Novi SPV, Pregled obveza, Assignments.
 * Write disabled u Safe/Lockdown/Forensic modu.
 */

import { useRouter } from "next/navigation";
import { Plus, ClipboardList, Users } from "lucide-react";

interface QuickActionBarProps {
  writeDisabled: boolean;
  onCreateSpv?: () => void;
}

export default function QuickActionBar({ writeDisabled, onCreateSpv }: QuickActionBarProps) {
  const router = useRouter();

  const actions = [
    {
      label: "Novi SPV",
      icon: <Plus className="w-4 h-4" />,
      onClick: onCreateSpv || (() => router.push("/dashboard/core/spv-lista")),
      requiresWrite: true,
    },
    {
      label: "Obveze",
      icon: <ClipboardList className="w-4 h-4" />,
      onClick: () => router.push("/dashboard/core/obligations"),
      requiresWrite: false,
    },
    {
      label: "Assignments",
      icon: <Users className="w-4 h-4" />,
      onClick: () => router.push("/dashboard/core/assignments"),
      requiresWrite: false,
    },
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
              disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : a.requiresWrite
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white border border-gray-200 text-black/70 hover:bg-gray-50"
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
