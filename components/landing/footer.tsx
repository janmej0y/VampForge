import Link from "next/link";
import { BriefcaseBusiness, Code2, Mail, Send } from "lucide-react";
import { BrandLockup } from "@/components/brand";

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
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <BrandLockup
            subtitle="Premium developer identity workspace"
            markClassName="shadow-[0_0_38px_rgba(34,211,238,0.22)]"
          />
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
            Build the portfolio, resume, interview prep, and launch flow that turns your work into a memorable developer presence.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[Code2, BriefcaseBusiness, Send, Mail].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-slate-400 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:text-white"
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

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
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
    </footer>
  );
}
