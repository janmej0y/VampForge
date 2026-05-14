"use client";

import { Award, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type AchievementItem } from "./types";

type AchievementFormProps = {
  item: AchievementItem;
  index: number;
  onRemove: () => void;
  onChange: (
    field: keyof Omit<AchievementItem, "id">,
    value: string
  ) => void;
};

export function AchievementForm({
  item,
  index,
  onRemove,
  onChange,
}: AchievementFormProps) {
  return (
    <div className="section-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10">
            <Award className="h-5 w-5 text-amber-200" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Achievement {index + 1}
            </div>
            <div className="text-xs text-muted-foreground">
              Certifications, hackathons, awards, or proof points.
            </div>
          </div>
        </div>

        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">Title</label>
          <Input
            value={item.title}
            placeholder="Cybersecurity Virtual Internship"
            onChange={(event) => onChange("title", event.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">Category</label>
          <Input
            value={item.category}
            placeholder="Certification / Award / Hackathon"
            onChange={(event) => onChange("category", event.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">Description</label>
          <Textarea
            value={item.description}
            placeholder="Add a short line about why this achievement matters."
            className="min-h-[110px] resize-none"
            onChange={(event) => onChange("description", event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
