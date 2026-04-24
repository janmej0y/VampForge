"use client";

import { GraduationCap, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type EducationItem } from "./types";

type EducationFormProps = {
  item: EducationItem;
  index: number;
  onRemove: () => void;
  onChange: (
    field: "institutionName" | "degree" | "year" | "description",
    value: string
  ) => void;
};

export function EducationForm({
  item,
  index,
  onRemove,
  onChange,
}: EducationFormProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
            <GraduationCap className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Education {index + 1}
            </div>
            <div className="text-xs text-muted-foreground">
              Add degree, institution, year, and optional details like CGPA or honors.
            </div>
          </div>
        </div>

        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">
            Institution Name
          </label>
          <Input
            value={item.institutionName}
            placeholder="Indian Institute of Technology"
            onChange={(event) =>
              onChange("institutionName", event.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Degree</label>
          <Input
            value={item.degree}
            placeholder="B.Tech in Computer Science"
            onChange={(event) => onChange("degree", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Year</label>
          <Input
            value={item.year}
            placeholder="2024"
            onChange={(event) => onChange("year", event.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">
            Description
          </label>
          <Textarea
            value={item.description}
            placeholder={
              "CGPA: 8.7/10\nRelevant coursework: Data Structures, Algorithms, Database Systems"
            }
            className="min-h-[110px] resize-none"
            onChange={(event) => onChange("description", event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
