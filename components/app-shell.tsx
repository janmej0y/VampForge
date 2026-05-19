"use client";

import { useEffect, useState } from "react";
import { AppThemeProvider } from "@/components/app-theme";
import { Navbar } from "@/components/navbar";
import { PageMotion } from "@/components/page-motion";
import { Sidebar } from "@/components/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("vampforge-theme");

      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
      }
    } catch {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === "dark" ? "light" : "dark";

      try {
        localStorage.setItem("vampforge-theme", nextTheme);
      } catch {
        // Ignore storage failures and still update the in-memory theme.
      }

      return nextTheme;
    });
  };

  return (
    <AppThemeProvider value={{ theme, toggleTheme }}>
      <div className={`page-shell relative min-h-screen overflow-x-hidden ${theme === "light" ? "app-light" : "app-dark"}`}>
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:96px_96px] opacity-[0.035]" />
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-56 ${
            theme === "light" ? "bg-[linear-gradient(180deg,rgba(59,130,246,0.12),transparent)]" : "bg-[linear-gradient(180deg,rgba(59,130,246,0.14),transparent)]"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-1/3 ${
            theme === "light" ? "bg-[linear-gradient(270deg,rgba(185,28,28,0.08),transparent)]" : "bg-[linear-gradient(270deg,rgba(185,28,28,0.1),transparent)]"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-1/4 ${
            theme === "light" ? "bg-[linear-gradient(90deg,rgba(15,23,42,0.035),transparent)]" : "bg-[linear-gradient(90deg,rgba(255,255,255,0.045),transparent)]"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-48 ${
            theme === "light"
              ? "bg-[linear-gradient(180deg,rgba(59,130,246,0.12),transparent)]"
              : "bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]"
          }`}
        />

        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggleCollapse={() => setCollapsed((value) => !value)}
        />

        <div className={`relative min-h-screen w-full min-w-0 transition-all duration-300 ${collapsed ? "lg:pl-28" : "lg:pl-72"}`}>
          <div className="mx-auto w-full max-w-[1400px] px-4 py-4 md:px-6 md:py-6 lg:px-8">
            <Navbar
              theme={theme}
              onToggleTheme={toggleTheme}
              onOpenSidebar={() => setMobileOpen(true)}
            />
            <main className="min-w-0 pb-8">
              <PageMotion>{children}</PageMotion>
            </main>
          </div>
        </div>
      </div>
    </AppThemeProvider>
  );
}
