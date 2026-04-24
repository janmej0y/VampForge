"use client";

import {
  BriefcaseBusiness,
  Code2,
  FileDown,
  Menu,
  MoonStar,
  SunMedium,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { type SocialLinkKey } from "../types";

type NavItem = {
  id: string;
  label: string;
};

type PortfolioNavbarProps = {
  items: readonly NavItem[];
  activeSection: string;
  theme: "dark" | "light";
  mobileOpen: boolean;
  scrolled: boolean;
  navbarVisible: boolean;
  socialLinks: Record<SocialLinkKey, string>;
  resumeLink: string;
  brandName: string;
  brandTitle: string;
  onToggleTheme: () => void;
  onToggleMobile: () => void;
  onNavigate: (id: string) => void;
};

function SocialIconLink({
  href,
  label,
  icon: Icon,
  theme,
}: {
  href: string;
  label: string;
  icon: typeof Code2;
  theme: "dark" | "light";
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
        theme === "dark"
          ? "border-white/10 bg-white/10 text-white hover:border-cyan-300/30 hover:bg-white/15"
          : "border-slate-200 bg-white/90 text-slate-800 hover:border-cyan-300/40 hover:bg-cyan-50"
      }`}
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

export function PortfolioNavbar({
  items,
  activeSection,
  theme,
  mobileOpen,
  scrolled,
  navbarVisible,
  socialLinks,
  resumeLink,
  brandName,
  brandTitle,
  onToggleTheme,
  onToggleMobile,
  onNavigate,
}: PortfolioNavbarProps) {
  const initials = (brandName || "YN")
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navSurface =
    theme === "dark"
      ? scrolled
        ? "border-white/10 bg-slate-950/78 shadow-[0_18px_60px_rgba(2,6,23,0.3)]"
        : "border-white/10 bg-white/[0.08] shadow-[0_12px_40px_rgba(2,6,23,0.18)]"
      : scrolled
        ? "border-slate-200 bg-white/90 shadow-[0_18px_40px_rgba(148,163,184,0.18)]"
        : "border-slate-200/80 bg-white/80 shadow-[0_12px_30px_rgba(148,163,184,0.14)]";

  const textTone = theme === "dark" ? "text-slate-300" : "text-slate-600";

  return (
    <div className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        animate={{
          opacity: navbarVisible ? 1 : 0,
          y: navbarVisible ? 0 : -110,
        }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className={`overflow-hidden rounded-[1.8rem] border backdrop-blur-xl transition ${navSurface}`}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className={`flex min-w-0 items-center gap-3 text-left ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            <BrandMark initials={initials} className="h-12 w-12 rounded-[1.15rem]" />
            <span className="min-w-0">
              <span
                className={`block text-[10px] font-semibold uppercase tracking-[0.3em] ${
                  theme === "dark" ? "text-cyan-200/60" : "text-cyan-700/70"
                }`}
              >
                Portfolio Preview
              </span>
              <span className="mt-1 block truncate text-lg font-semibold tracking-tight">
                {brandName || "Your Name"}
              </span>
              <span
                className={`mt-0.5 block truncate text-xs ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {brandTitle || "Developer Portfolio"}
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="secondary" size="icon" onClick={onToggleTheme}>
              {theme === "dark" ? (
                <SunMedium className="h-4 w-4" />
              ) : (
                <MoonStar className="h-4 w-4" />
              )}
            </Button>
            {resumeLink ? (
              <a
                href={resumeLink}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                  theme === "dark"
                    ? "bg-[linear-gradient(135deg,#f8fbff,#b9f3ff,#fcd889)] text-slate-950 hover:brightness-105"
                    : "bg-slate-950 text-white hover:bg-slate-800"
                }`}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Resume
              </a>
            ) : null}
            <SocialIconLink href={socialLinks.github} label="GitHub" icon={Code2} theme={theme} />
            <SocialIconLink
              href={socialLinks.linkedin}
              label="LinkedIn"
              icon={BriefcaseBusiness}
              theme={theme}
            />
          </div>

          <Button variant="secondary" size="icon" className="md:hidden" onClick={onToggleMobile}>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        <div className="hidden border-t border-white/10 md:block">
          <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hidden sm:px-5">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition ${
                  activeSection === item.id
                    ? theme === "dark"
                      ? "bg-[linear-gradient(135deg,rgba(34,211,238,0.2),rgba(255,255,255,0.08),rgba(251,191,36,0.16))] text-white shadow-[0_10px_24px_rgba(2,6,23,0.16)]"
                      : "bg-slate-900 text-white"
                    : `${textTone} hover:bg-white/10 hover:text-white`
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10 md:hidden"
            >
              <div className="grid gap-2 px-4 py-4">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`rounded-xl px-3 py-3 text-left text-sm font-medium ${
                      activeSection === item.id
                        ? theme === "dark"
                          ? "bg-[linear-gradient(135deg,rgba(34,211,238,0.2),rgba(255,255,255,0.08),rgba(251,191,36,0.16))] text-white"
                          : "bg-slate-900 text-white"
                        : `${textTone} hover:bg-white/10`
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={onToggleTheme}>
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </Button>
                  {resumeLink ? (
                    <a
                      href={resumeLink}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold ${
                        theme === "dark" ? "bg-white text-slate-950" : "bg-slate-950 text-white"
                      }`}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Resume
                    </a>
                  ) : null}
                  <SocialIconLink href={socialLinks.github} label="GitHub" icon={Code2} theme={theme} />
                  <SocialIconLink
                    href={socialLinks.linkedin}
                    label="LinkedIn"
                    icon={BriefcaseBusiness}
                    theme={theme}
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
