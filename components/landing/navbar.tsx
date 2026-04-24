"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandLockup } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Preview", href: "#preview" },
  { label: "How It Works", href: "#how-it-works" },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={cn(
          "mx-auto max-w-7xl rounded-[1.5rem] border px-4 py-3 transition duration-300 sm:px-5",
          scrolled
            ? "border-white/10 bg-[#0A0F1C]/78 shadow-[0_18px_70px_rgba(2,8,23,0.42)] backdrop-blur-2xl"
            : "border-white/10 bg-white/[0.035] backdrop-blur-xl"
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="min-w-0">
            <BrandLockup
              subtitle="Developer identity workspace"
              markClassName="shadow-[0_0_38px_rgba(34,211,238,0.24)]"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button asChild variant="secondary">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/live-interview">Live Interview</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {mobileOpen ? (
          <div className="mt-4 space-y-3 border-t border-white/10 pt-4 lg:hidden">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
              >
                {item.label}
              </a>
            ))}
            <Button asChild className="w-full">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/dashboard">
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : null}
      </motion.div>
    </header>
  );
}
