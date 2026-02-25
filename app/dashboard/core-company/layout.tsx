import CoreShell from "@/components/layouts/CoreShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CoreShell>{children}</CoreShell>;
}
