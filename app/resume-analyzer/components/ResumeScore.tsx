import { ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type AnalysisData } from "./types";

type ResumeScoreProps = {
  data: AnalysisData;
};

export function ResumeScore({ data }: ResumeScoreProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (data.score / 100) * circumference;

  return (
    <Card className="bg-white/[0.045] transition duration-300 hover:-translate-y-1 hover:border-primary/20">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-white">Resume Score Card</CardTitle>
            <CardDescription>
              Simulated AI scoring for clarity, impact, readability, and recruiter fit.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            AI Insight
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center">
          <div className="flex justify-center">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <svg className="h-40 w-40 -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="url(#resume-score-gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                />
                <defs>
                  <linearGradient
                    id="resume-score-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="55%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-semibold text-white">{data.score}</div>
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  out of 100
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-semibold text-white">{data.scoreLabel}</div>
                <div className="break-words text-sm text-muted-foreground">{data.scoreSummary}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Structure
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  Strong
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Relevance
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {data.score >= 80 ? "High" : "Improving"}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Readability
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  Clean
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
