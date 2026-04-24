import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ResumeInsights } from "./intelligence";

type ResumeInsightsPanelProps = {
  insights: ResumeInsights;
};

function MiniStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accent}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

function ListBlock({
  icon: Icon,
  title,
  items,
  empty,
  iconClassName,
}: {
  icon: typeof TrendingUp;
  title: string;
  items: string[];
  empty: string;
  iconClassName: string;
}) {
  return (
    <div className="section-card p-5">
      <div className="mb-3 flex items-center gap-2 text-white">
        <Icon className={`h-4.5 w-4.5 ${iconClassName}`} />
        <div className="font-semibold">{title}</div>
      </div>
      <div className="space-y-3 text-sm leading-6 text-slate-300">
        {items.length > 0 ? (
          items.map((item) => <div key={item}>- {item}</div>)
        ) : (
          <div>- {empty}</div>
        )}
      </div>
    </div>
  );
}

export function ResumeInsightsPanel({ insights }: ResumeInsightsPanelProps) {
  return (
    <Card className="bg-white/[0.045] fade-in-up delay-2">
      <CardHeader className="border-b border-white/10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-white">Resume Intelligence</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Quality gate for ATS-safe structure, recruiter scanning, and stronger bullet execution before export.
            </p>
          </div>
          <Badge variant={insights.isReady ? "success" : "secondary"} className="gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            {insights.isReady ? "Ready to Export" : insights.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-4 md:grid-cols-4">
          <MiniStat
            icon={TrendingUp}
            label="Resume Score"
            value={`${insights.score}/100`}
            accent="border border-primary/20 bg-primary/10 text-primary"
          />
          <MiniStat
            icon={ScanSearch}
            label="ATS Score"
            value={`${insights.atsScore}/100`}
            accent="border border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
          />
          <MiniStat
            icon={AlertTriangle}
            label="Weak Bullets"
            value={insights.weakBulletCount}
            accent="border border-amber-300/20 bg-amber-300/10 text-amber-200"
          />
          <MiniStat
            icon={ShieldCheck}
            label="Quality Checks"
            value={`${insights.qualityChecks.filter((item) => item.passed).length}/${insights.qualityChecks.length}`}
            accent="border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
          />
        </div>

        <div className="section-card p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-300" />
            <div className="font-semibold">Export Quality Gate</div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {insights.qualityChecks.map((check) => (
              <div
                key={check.label}
                className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  {check.passed ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-300" />
                  ) : (
                    <AlertTriangle className="h-4.5 w-4.5 text-amber-200" />
                  )}
                  {check.label}
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-300">
                  {check.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ListBlock
            icon={AlertTriangle}
            title="Blocking Issues"
            items={insights.blockingIssues}
            empty="No blocking quality issues. Export is unlocked."
            iconClassName="text-amber-200"
          />
          <ListBlock
            icon={CheckCircle2}
            title="Strong Signals"
            items={insights.strengths}
            empty="Complete more sections to surface stronger resume signals."
            iconClassName="text-emerald-300"
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="section-card p-5">
            <div className="mb-3 flex items-center gap-2 text-white">
              <KeyRound className="h-4.5 w-4.5 text-cyan-200" />
              <div className="font-semibold">ATS Keyword Suggestions</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {insights.keywordSuggestions.length > 0 ? (
                insights.keywordSuggestions.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <div className="text-sm leading-6 text-slate-300">
                  The resume already covers the strongest role-relevant keyword set.
                </div>
              )}
            </div>
          </div>

          <ListBlock
            icon={Sparkles}
            title="Improvement Suggestions"
            items={insights.improvementSuggestions}
            empty="No major improvement suggestions right now."
            iconClassName="text-primary"
          />
        </div>
      </CardContent>
    </Card>
  );
}
