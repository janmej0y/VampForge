import { ExternalLink, FilePenLine, Globe2, Layers3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PortfolioPreviewProps = {
  templateName: string;
  portfolioName: string;
  lastUpdated: string;
  previewUrl: string;
};

export function PortfolioPreview({
  templateName,
  portfolioName,
  lastUpdated,
  previewUrl,
}: PortfolioPreviewProps) {
  return (
    <Card className="overflow-hidden border-sky-200 bg-white/90 shadow-[0_24px_80px_rgba(14,116,144,0.12)]">
      <CardHeader className="border-b border-sky-100 bg-[linear-gradient(135deg,rgba(240,249,255,0.96),rgba(255,255,255,0.9))]">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-slate-950">Preview</CardTitle>
            <CardDescription>
              Review the package target.
            </CardDescription>
          </div>
          <div className="flex min-w-0 flex-wrap gap-2">
            <Button variant="secondary" asChild>
              <a href={previewUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open Target
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/portfolio">
                <FilePenLine className="h-4 w-4" />
                Edit Portfolio
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="relative w-full max-w-full overflow-hidden rounded-[2rem] border border-sky-200 bg-white shadow-[0_25px_80px_rgba(14,116,144,0.16)]">
          <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:42px_42px] opacity-[0.08]" />
          <div className="relative border-b border-sky-100 bg-[linear-gradient(135deg,rgba(20,184,166,0.12),rgba(255,255,255,0.9),rgba(245,158,11,0.08))] px-6 py-8">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <div className="ml-2 min-w-0 truncate rounded-full border border-sky-200 bg-white/80 px-3 py-1 font-mono text-[11px] text-slate-500">
                {previewUrl.replace(/^https?:\/\//, "")}
              </div>
            </div>

            <div className="max-w-2xl space-y-4">
              <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                {templateName}
              </div>
              <div className="break-words text-4xl font-semibold text-slate-950">
                {portfolioName}
              </div>
              <div className="max-w-xl text-sm leading-7 text-slate-600">
                Portfolio source package ready for handoff.
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-1 gap-4 p-5 md:grid-cols-3 md:p-6">
            {[
              "Featured Projects",
              "Technical Stack",
              "Contact + Links",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-sky-100 bg-sky-50/70 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_45px_rgba(14,116,144,0.12)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-100 bg-white">
                    {item === "Featured Projects" ? (
                      <Layers3 className="h-4.5 w-4.5 text-primary" />
                    ) : (
                      <Globe2 className="h-4.5 w-4.5 text-cyan-300" />
                    )}
                  </div>
                  <div className="min-w-0 truncate text-sm font-semibold text-slate-900">{item}</div>
                </div>
                <div className="mt-3 text-sm leading-6 text-muted-foreground">
                  Prepared for handoff.
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Template Name
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              {templateName}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Portfolio Name
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              {portfolioName}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Last Updated
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              {lastUpdated}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
