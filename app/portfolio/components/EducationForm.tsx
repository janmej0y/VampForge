"use client";

import { GraduationCap, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type EducationItem } from "./types";

type EducationFormProps = {
  item: EducationItem;
  index: number;
  onRemove: () => void;
  onChange: (
    field: keyof Omit<EducationItem, "id">,
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
    <div className="section-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
            <GraduationCap className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Education {index + 1}
            </div>
            <div className="text-xs text-muted-foreground">
              Add academic background and credibility signals.
            </div>
          </div>
        </div>

        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">Institution</label>
          <Input
            value={item.institution}
            placeholder="Tech University"
            onChange={(event) => onChange("institution", event.target.value)}
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
            placeholder="2021"
            onChange={(event) => onChange("year", event.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">Grade</label>
          <Input
            value={item.grade}
            placeholder="8.9 CGPA / First Class"
            onChange={(event) => onChange("grade", event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
