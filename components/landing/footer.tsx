import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Mail,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BrandLockup } from "@/components/brand";
import { Button } from "@/components/ui/button";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Portfolio Builder", href: "/portfolio" },
      { label: "Resume Generator", href: "/resume-generator" },
      { label: "Live Interview", href: "/live-interview" },
      { label: "Resume Analyzer", href: "/resume-analyzer" },
    ],
  },
  {
    title: "Workspace",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Deploy", href: "/deploy" },
      { label: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Features", href: "#features" },
      { label: "Preview", href: "#preview" },
      { label: "How It Works", href: "#how-it-works" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(20,184,166,0.12),rgba(255,255,255,0.055),rgba(245,158,11,0.08))] p-6 shadow-[0_28px_90px_rgba(2,8,23,0.28)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-semibold text-teal-100">
                <Sparkles className="h-3.5 w-3.5" />
                Premium career workspace
              </div>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Build your portfolio, resume, and interview flow in one place.
              </h2>
            </div>
            <Button asChild>
              <Link href="/dashboard">
                Launch VampForge
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <BrandLockup
              subtitle="Premium developer identity workspace"
              markClassName="shadow-[0_0_38px_rgba(34,211,238,0.22)]"
            />
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              A polished workspace for career assets, interviews, and launch-ready presentation.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-semibold text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-200" />
              Firebase-ready architecture
            </div>
            <div className="mt-6 flex items-center gap-3">
              {[Code2, BriefcaseBusiness, Send, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-slate-400 transition hover:-translate-y-0.5 hover:border-teal-300/30 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <div className="text-sm font-semibold text-white">{group.title}</div>
                <div className="mt-4 grid gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 VampForge. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="transition hover:text-slate-300">
              Privacy
            </a>
            <a href="#" className="transition hover:text-slate-300">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
