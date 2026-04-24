import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WeaknessCardProps = {
  weaknesses: string[];
};

export function WeaknessCard({ weaknesses }: WeaknessCardProps) {
  return (
    <Card className="bg-white/[0.045] transition duration-300 hover:-translate-y-1 hover:border-amber-400/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <AlertTriangle className="h-5 w-5 text-amber-300" />
          Weaknesses
        </CardTitle>
        <CardDescription>
          Gaps that are lowering recruiter confidence or ATS performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {weaknesses.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100"
          >
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
