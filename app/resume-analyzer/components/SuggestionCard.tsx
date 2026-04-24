import { ArrowUpRight, Lightbulb } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SuggestionCardProps = {
  suggestions: string[];
};

export function SuggestionCard({ suggestions }: SuggestionCardProps) {
  return (
    <Card className="bg-white/[0.045] transition duration-300 hover:-translate-y-1 hover:border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Lightbulb className="h-5 w-5 text-primary" />
          Suggestions
        </CardTitle>
        <CardDescription>
          Practical improvements to strengthen impact, clarity, and conversion.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((item, index) => (
          <div
            key={item}
            className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200 transition hover:bg-white/10"
          >
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {index + 1}
              </div>
              <div className="leading-6">{item}</div>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
