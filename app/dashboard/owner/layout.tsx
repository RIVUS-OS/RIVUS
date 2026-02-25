import OwnerShell from "@/components/layouts/OwnerShell";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <OwnerShell>{children}</OwnerShell>;
}