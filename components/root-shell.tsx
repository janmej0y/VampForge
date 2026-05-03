"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PageMotion } from "@/components/page-motion";

type RootShellProps = {
  children: React.ReactNode;
};

export function RootShell({ children }: RootShellProps) {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login") {
    return <PageMotion>{children}</PageMotion>;
  }

  return <AppShell>{children}</AppShell>;
}
