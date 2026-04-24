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
    field: keyof Omit<ExperienceItem, "id">,
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
    <div className="section-card p-5">
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
              Add recruiter-friendly role details and measurable context.
            </div>
          </div>
        </div>

        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Company</label>
          <Input
            value={item.company}
            placeholder="Forge Labs"
            onChange={(event) => onChange("company", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Role</label>
          <Input
            value={item.role}
            placeholder="Senior Full Stack Developer"
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
          <label className="text-sm font-medium text-slate-200">Description</label>
          <Textarea
            value={item.description}
            placeholder="Write 1-3 strong lines about impact, scope, and outcomes."
            className="min-h-[120px] resize-none"
            onChange={(event) => onChange("description", event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
