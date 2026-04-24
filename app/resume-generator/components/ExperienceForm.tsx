"use client";

import { BriefcaseBusiness, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ExperienceItem } from "./types";

type ExperienceFormProps = {
  item: ExperienceItem;
  index: number;
  onRemove: () => void;
  onChange: (
    field: "companyName" | "role" | "duration" | "description",
    value: string
  ) => void;
};

export function ExperienceForm({
  item,
  index,
  onRemove,
  onChange,
}: ExperienceFormProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <BriefcaseBusiness className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Experience {index + 1}
            </div>
            <div className="text-xs text-muted-foreground">
              Add 3-5 bullets using action verb + task + tech + result.
            </div>
          </div>
        </div>

        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">
            Company Name
          </label>
          <Input
            value={item.companyName}
            placeholder="Forge Labs"
            onChange={(event) => onChange("companyName", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Role</label>
          <Input
            value={item.role}
            placeholder="Senior Frontend Engineer"
            onChange={(event) => onChange("role", event.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">Duration</label>
          <Input
            value={item.duration}
            placeholder="2023 - Present"
            onChange={(event) => onChange("duration", event.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">
            Description
          </label>
          <Textarea
            value={item.description}
            placeholder={
              "Developed reusable UI components using React, reducing development time by 30%\nOptimized dashboard performance using lazy loading and code splitting, improving load speed by 40%\nLed cross-functional feature delivery using Next.js and TypeScript, streamlining onboarding workflows"
            }
            className="min-h-[120px] resize-none"
            onChange={(event) => onChange("description", event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
