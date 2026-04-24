"use client";

import { useEffect, useState } from "react";
import { AppThemeProvider } from "@/components/app-theme";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
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
        <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:76px_76px] opacity-[0.04]" />
        <div className="pointer-events-none absolute left-0 top-8 h-72 w-72 -translate-x-1/3 rounded-full bg-sky-300/24 blur-3xl orbital-drift" />
        <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 translate-x-1/3 rounded-full bg-blue-300/18 blur-3xl orbital-drift delay-2" />
        <div className="pointer-events-none absolute bottom-[-7rem] left-1/3 h-80 w-80 rounded-full bg-cyan-300/18 blur-3xl pulse-soft" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(14,165,233,0.12),transparent)]" />

        <Sidebar
          collapsed={false}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggleCollapse={() => undefined}
        />

        <div className="relative min-w-0 min-h-screen w-full transition-all duration-300 lg:pl-72">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-4 md:px-6 md:py-6 lg:px-8">
            <Navbar
              theme={theme}
              onToggleTheme={toggleTheme}
              onOpenSidebar={() => setMobileOpen(true)}
            />
            <main className="min-w-0 pb-8">{children}</main>
          </div>
        </div>
      </div>
    </AppThemeProvider>
  );
}
