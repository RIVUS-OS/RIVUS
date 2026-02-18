import { ReactNode } from "react";
import CoreShell from "@/components/layouts/CoreShell";

export default function CoreLayout({ children }: { children: ReactNode }) {
  return <CoreShell>{children}</CoreShell>;
}