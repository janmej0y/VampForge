"use client";

import { FolderGit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SkillTagInput } from "./SkillTagInput";
import { type Project } from "./types";

type ProjectFormProps = {
  index: number;
  project: Project;
  onRemove: () => void;
  onFieldChange: (
    field: "name" | "description" | "githubLink" | "liveLink" | "imageUrl",
    value: string
  ) => void;
  onTechStackChange: (tags: string[]) => void;
};

export function ProjectForm({
  index,
  project,
  onRemove,
  onFieldChange,
  onTechStackChange,
}: ProjectFormProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[0_22px_70px_rgba(2,6,23,0.22)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <FolderGit2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Project {index + 1}
            </div>
            <div className="text-xs text-muted-foreground">
              Add a polished case study with links and stack details.
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
            value={project.name}
            placeholder="SignalStack"
            onChange={(event) => onFieldChange("name", event.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">
            Description
          </label>
          <Textarea
            value={project.description}
            placeholder="Describe the product, impact, and what makes the build interesting."
            className="min-h-[120px] resize-none"
            onChange={(event) =>
              onFieldChange("description", event.target.value)
            }
          />
        </div>

        <div className="md:col-span-2">
          <SkillTagInput
            label="Tech Stack"
            helperText="Use tags so the preview can display a clean project stack."
            tags={project.techStack}
            onChange={onTechStackChange}
            placeholder="Press Enter to add a technology"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">
            GitHub Link
          </label>
          <Input
            value={project.githubLink}
            placeholder="https://github.com/username/project"
            onChange={(event) =>
              onFieldChange("githubLink", event.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Live Link</label>
          <Input
            value={project.liveLink}
            placeholder="https://project.dev"
            onChange={(event) => onFieldChange("liveLink", event.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">
            Project Image URL
          </label>
          <Input
            value={project.imageUrl}
            placeholder="https://images.unsplash.com/..."
            onChange={(event) => onFieldChange("imageUrl", event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
