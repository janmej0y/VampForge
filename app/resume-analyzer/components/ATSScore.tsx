import { BarChart3, ScanLine, SearchCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ATSScoreProps = {
  atsScore: number;
  keywordMatch: number;
};

export function ATSScore({ atsScore, keywordMatch }: ATSScoreProps) {
  return (
    <Card className="bg-white/[0.045] transition duration-300 hover:-translate-y-1 hover:border-violet-400/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <ScanLine className="h-5 w-5 text-violet-300" />
          ATS Compatibility
        </CardTitle>
        <CardDescription>
          Simulated parsing health and keyword alignment for applicant tracking systems.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5" />
              ATS Score
            </div>
            <div className="mt-3 text-3xl font-semibold text-white">
              {atsScore}%
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <SearchCheck className="h-3.5 w-3.5" />
              Keyword Match
            </div>
            <div className="mt-3 text-3xl font-semibold text-white">
              {keywordMatch}%
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="mb-2 flex min-w-0 flex-wrap items-center justify-between gap-2 text-sm text-slate-300">
              <span>ATS parsing compatibility</span>
              <span>{atsScore}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                style={{ width: `${atsScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex min-w-0 flex-wrap items-center justify-between gap-2 text-sm text-slate-300">
              <span>Keyword match percentage</span>
              <span>{keywordMatch}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                style={{ width: `${keywordMatch}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
