import BankShell from "@/components/layouts/BankShell";

export default function BankLayout({ children }: { children: React.ReactNode }) {
  return <BankShell>{children}</BankShell>;
}