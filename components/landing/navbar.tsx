"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Menu, ShieldCheck, Sparkles, X } from "lucide-react";
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
          "mx-auto max-w-7xl rounded-[1.7rem] border px-4 py-3 transition duration-300 sm:px-5",
          scrolled
            ? "border-white/12 bg-[#080d18]/82 shadow-[0_22px_80px_rgba(2,8,23,0.46)] backdrop-blur-2xl"
            : "border-white/10 bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
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
                className="rounded-full border border-transparent px-4 py-2 text-sm text-slate-300 transition hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-2 rounded-full border border-teal-300/15 bg-teal-300/10 px-3 py-2 text-xs font-semibold text-teal-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Firebase-ready
            </div>
            <Button asChild variant="secondary">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                Launch App
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
                Launch App
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center justify-center gap-2 rounded-xl border border-teal-300/15 bg-teal-300/10 px-4 py-3 text-xs font-semibold text-teal-100">
              <Sparkles className="h-3.5 w-3.5" />
              Premium workspace
            </div>
          </div>
        ) : null}
      </motion.div>
    </header>
  );
}
