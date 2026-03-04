import CoreShell from "@/components/layouts/CoreShell";

export default function CoreLayout({ children }: { children: React.ReactNode }) {
  return <CoreShell>{children}</CoreShell>;
}
