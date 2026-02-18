"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react";

type SettingsItem = {
  title: string;
  subtitle?: string;
  href: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
};

export function SettingsSection({
  title,
  items,
}: {
  title: string;
  items: SettingsItem[];
}) {
  const router = useRouter();

  return (
    <div>
      <div className="macos-section-header">{title}</div>
      <div className="macos-section">
        {items.map((item) => (
          <div key={item.href} className="macos-row" onClick={() => router.push(item.href)}>
            <div
              className="macos-icon-container"
              style={{ backgroundColor: item.iconBg || "rgba(0, 0, 0, 0.05)" }}
            >
              <item.icon size={18} strokeWidth={2} style={{ color: item.iconColor || "rgba(0,0,0,0.6)" }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-medium text-black truncate">{item.title}</div>
              {item.subtitle && <div className="text-[13px] text-black/50 mt-0.5 truncate">{item.subtitle}</div>}
            </div>

            <ChevronRight size={18} className="text-black/25 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}