import {
  ArrowUpRight,
  Bird,
  BriefcaseBusiness,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type PortfolioData } from "./types";

type SocialLinksProps = {
  links: PortfolioData["socialLinks"];
};

const socialItems = [
  {
    key: "github",
    label: "GitHub",
    icon: Code2,
    accent: "from-slate-300/15 to-slate-300/5",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: BriefcaseBusiness,
    accent: "from-cyan-400/20 to-blue-400/10",
  },
  {
    key: "twitter",
    label: "Twitter",
    icon: Bird,
    accent: "from-sky-400/20 to-cyan-300/10",
  },
] as const;

export function SocialLinks({ links }: SocialLinksProps) {
  const availableLinks = socialItems.filter((item) => links[item.key]);

  if (availableLinks.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-muted-foreground">
        Add social links in the form to show profile destinations here.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {availableLinks.map((item) => {
        const Icon = item.icon;

        return (
          <a
            key={item.key}
            href={links[item.key]}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "group relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 transition hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/[0.07]",
              "shadow-[0_18px_45px_rgba(3,7,18,0.22)]"
            )}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent} opacity-80`}
            />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70">
                  <Icon className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {item.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Visit profile
                  </div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
            </div>
          </a>
        );
      })}
    </div>
  );
}
