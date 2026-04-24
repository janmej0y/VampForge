"use client";

import { FolderGit2, Trash2 } from "lucide-react";
import { TagInput } from "@/components/tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ProjectItem } from "./types";

type ProjectFormProps = {
  item: ProjectItem;
  index: number;
  onRemove: () => void;
  onChange: (
    field: "projectName" | "description" | "githubLink" | "liveLink",
    value: string
  ) => void;
  onTechStackChange: (value: string[]) => void;
};

export function ProjectForm({
  item,
  index,
  onRemove,
  onChange,
  onTechStackChange,
}: ProjectFormProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <FolderGit2 className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Project {index + 1}
            </div>
            <div className="text-xs text-muted-foreground">
              Include product context, stack, GitHub or live links, and clear results.
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
            Project Name
          </label>
          <Input
            value={item.projectName}
            placeholder="VampForge"
            onChange={(event) => onChange("projectName", event.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">
            Description
          </label>
          <Textarea
            value={item.description}
            placeholder={
              "Built a developer platform using Next.js, Node.js, and PostgreSQL, improving end-to-end workflow efficiency\nImplemented resume and portfolio generation features with real-time preview, reducing iteration time for users\nDesigned scalable architecture supporting multiple templates and export formats"
            }
            className="min-h-[110px] resize-none"
            onChange={(event) => onChange("description", event.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <TagInput
            label="Tech Stack"
            placeholder="Add a technology and press Enter"
            value={item.techStack}
            onChange={onTechStackChange}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">
            GitHub Link
          </label>
          <Input
            value={item.githubLink}
            placeholder="https://github.com/username/project"
            onChange={(event) => onChange("githubLink", event.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">
            Live Project Link
          </label>
          <Input
            value={item.liveLink ?? ""}
            placeholder="https://project-demo.com"
            onChange={(event) => onChange("liveLink", event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
