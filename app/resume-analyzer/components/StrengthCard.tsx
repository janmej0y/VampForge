import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StrengthCardProps = {
  strengths: string[];
};

export function StrengthCard({ strengths }: StrengthCardProps) {
  return (
    <Card className="bg-white/[0.045] transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <CheckCircle2 className="h-5 w-5 text-emerald-300" />
          Strengths
        </CardTitle>
        <CardDescription>
          Areas where your resume already reads strongly to recruiters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {strengths.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100"
          >
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
