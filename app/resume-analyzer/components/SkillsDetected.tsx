import { Radar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SkillsDetectedProps = {
  skills: string[];
};

export function SkillsDetected({ skills }: SkillsDetectedProps) {
  return (
    <Card className="bg-white/[0.045] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Radar className="h-5 w-5 text-cyan-300" />
          Skills Detected
        </CardTitle>
        <CardDescription>
          Mock keywords and technologies surfaced from your uploaded resume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-100"
            >
              {skill}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
