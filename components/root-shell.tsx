"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PageMotion } from "@/components/page-motion";
import { SpiderLoader } from "@/components/spider-loader";

type RootShellProps = {
  children: React.ReactNode;
};

export function RootShell({ children }: RootShellProps) {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login") {
    return (
      <>
        <PageMotion>{children}</PageMotion>
        <SpiderLoader />
      </>
    );
  }

  return (
    <>
      <AppShell>{children}</AppShell>
      <SpiderLoader />
    </>
  );
}
