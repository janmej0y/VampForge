"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";

type RootShellProps = {
  children: React.ReactNode;
};

export function RootShell({ children }: RootShellProps) {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login") {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
