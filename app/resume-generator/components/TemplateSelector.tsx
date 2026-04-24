"use client";

import { Check, LayoutTemplate, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type ResumeTemplate } from "./types";

type TemplateSelectorProps = {
  selectedTemplate: ResumeTemplate;
  onSelect: (template: ResumeTemplate) => void;
};

const templates: Array<{
  id: ResumeTemplate;
  name: string;
  description: string;
  accent: string;
}> = [
  {
    id: "modern",
    name: "Modern ATS",
    description:
      "High-contrast ATS resume with stronger section markers, cleaner alignment, and sharper bullet rhythm.",
    accent: "from-slate-900 via-slate-700 to-slate-300",
  },
  {
    id: "minimal",
    name: "Minimal ATS",
    description:
      "Editorial single-column resume with a centered header, tighter rhythm, and restrained divider lines.",
    accent: "from-slate-500 via-slate-300 to-white",
  },
  {
    id: "professional",
    name: "Professional ATS",
    description:
      "Classic recruiter-first resume with restrained typography, clear section underlines, and conservative alignment.",
    accent: "from-slate-950 via-slate-700 to-slate-400",
  },
  {
    id: "executive",
    name: "Executive ATS",
    description:
      "Refined executive ATS resume with a stronger masthead, formal company-first hierarchy, and leadership-style spacing.",
    accent: "from-black via-slate-700 to-slate-300",
  },
];

function Thumbnail({ template }: { template: ResumeTemplate }) {
  const shellClassName =
    "w-full rounded-[1.25rem] border border-slate-200 bg-white p-3 shadow-sm";

  if (template === "modern") {
    return (
      <div className={shellClassName}>
        <div className="border-t-[3px] border-slate-900 pt-2">
          <div className="h-3 w-28 rounded-full bg-slate-900" />
          <div className="mt-2 h-2 w-20 rounded-full bg-slate-500" />
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-2 w-16 rounded-full bg-slate-200" />
            <div className="h-2 w-20 rounded-full bg-slate-200" />
            <div className="h-2 w-14 rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-[2px] w-8 rounded-full bg-slate-900" />
              <div className="h-2 w-20 rounded-full bg-slate-900" />
            </div>
            <div className="mt-2 space-y-2 border-l-2 border-slate-900 pl-3">
              <div className="h-2 w-9/12 rounded-full bg-slate-700" />
              <div className="h-2 rounded-full bg-slate-200" />
              <div className="h-2 w-10/12 rounded-full bg-slate-200" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="h-[2px] w-8 rounded-full bg-slate-900" />
              <div className="h-2 w-24 rounded-full bg-slate-900" />
            </div>
            <div className="mt-2 space-y-2 border-l-2 border-slate-900 pl-3">
              <div className="h-2 w-10/12 rounded-full bg-slate-700" />
              <div className="h-2 rounded-full bg-slate-200" />
              <div className="h-2 w-8/12 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template === "minimal") {
    return (
      <div className={shellClassName}>
        <div className="border-y border-slate-300 py-2 text-center">
          <div className="mx-auto h-3 w-24 rounded-full bg-slate-700" />
          <div className="mx-auto mt-2 h-2 w-16 rounded-full bg-slate-400" />
          <div className="mt-3 flex justify-center gap-2">
            <div className="h-2 w-10 rounded-full bg-slate-200" />
            <div className="h-2 w-12 rounded-full bg-slate-200" />
            <div className="h-2 w-10 rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-300" />
              <div className="h-2 w-14 rounded-full bg-slate-400" />
              <div className="h-px flex-1 bg-slate-300" />
            </div>
            <div className="mt-2 space-y-2">
              <div className="h-2 rounded-full bg-slate-200" />
              <div className="h-2 w-11/12 rounded-full bg-slate-200" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-300" />
              <div className="h-2 w-20 rounded-full bg-slate-400" />
              <div className="h-px flex-1 bg-slate-300" />
            </div>
            <div className="mt-2 space-y-2 border-t border-slate-200 pt-2">
              <div className="h-2 w-9/12 rounded-full bg-slate-700" />
              <div className="h-2 rounded-full bg-slate-200" />
              <div className="h-2 w-10/12 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template === "professional") {
    return (
      <div className={shellClassName}>
        <div>
          <div className="h-3 w-28 rounded-full bg-slate-800" />
          <div className="mt-2 h-2 w-20 rounded-full bg-slate-500" />
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-2 w-14 rounded-full bg-slate-200" />
            <div className="h-2 w-16 rounded-full bg-slate-200" />
            <div className="h-2 w-12 rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <div className="h-px w-full bg-slate-400" />
            <div className="mt-2 h-2 w-20 rounded-full bg-slate-700" />
            <div className="mt-2 space-y-2 border-b border-slate-200 pb-2">
              <div className="h-2 w-9/12 rounded-full bg-slate-800" />
              <div className="h-2 w-6/12 rounded-full bg-slate-300" />
              <div className="h-2 rounded-full bg-slate-200" />
            </div>
          </div>
          <div>
            <div className="h-px w-full bg-slate-400" />
            <div className="mt-2 h-2 w-24 rounded-full bg-slate-700" />
            <div className="mt-2 space-y-2 border-b border-slate-200 pb-2">
              <div className="h-2 w-8/12 rounded-full bg-slate-800" />
              <div className="h-2 w-7/12 rounded-full bg-slate-300" />
              <div className="h-2 w-10/12 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template === "executive") {
    return (
      <div className={shellClassName}>
        <div className="grid grid-cols-[minmax(0,1fr)_4rem] gap-3 border-b-2 border-slate-900 pb-3">
          <div className="min-w-0">
            <div className="h-3 w-24 rounded-full bg-slate-900" />
            <div className="mt-2 h-2 w-16 rounded-full bg-slate-500" />
            <div className="mt-3 space-y-2">
              <div className="h-2 w-11/12 rounded-full bg-slate-200" />
              <div className="h-2 w-10/12 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="border-l border-slate-300 pl-2">
            <div className="h-24 w-full border-2 border-slate-900 bg-white" />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center gap-3 border-t border-slate-900 pt-2">
              <div className="h-2 w-20 rounded-full bg-slate-700" />
              <div className="h-px flex-1 bg-slate-300" />
            </div>
            <div className="mt-2 space-y-2 border-l-2 border-slate-200 pl-3">
              <div className="h-2 rounded-full bg-slate-900" />
              <div className="h-2 w-11/12 rounded-full bg-slate-200" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 border-t border-slate-900 pt-2">
              <div className="h-2 w-24 rounded-full bg-slate-700" />
              <div className="h-px flex-1 bg-slate-300" />
            </div>
            <div className="mt-2 space-y-2 border-b border-slate-200 pb-2">
              <div className="h-2 w-6/12 rounded-full bg-slate-300" />
              <div className="h-2 w-8/12 rounded-full bg-slate-900" />
              <div className="h-2 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const topRule = "bg-slate-700";
  const sectionRule = "bg-slate-400";

  return (
    <div className={shellClassName}>
      <div className={`h-3 w-32 rounded-full ${topRule}`} />
      <div className="mt-2 h-2 w-20 rounded-full bg-slate-400" />
      <div className="mt-3 flex flex-wrap gap-2 text-[9px] text-slate-400">
        <div className="h-2 w-16 rounded-full bg-slate-200" />
        <div className="h-2 w-20 rounded-full bg-slate-200" />
        <div className="h-2 w-14 rounded-full bg-slate-200" />
      </div>
      <div className="mt-4 space-y-3">
        <div>
          <div className={`h-2 w-16 rounded-full ${sectionRule}`} />
          <div className="mt-2 space-y-2">
            <div className="h-2 rounded-full bg-slate-200" />
            <div className="h-2 w-11/12 rounded-full bg-slate-200" />
            <div className="h-2 w-10/12 rounded-full bg-slate-200" />
          </div>
        </div>
        <div>
          <div className={`h-2 w-20 rounded-full ${sectionRule}`} />
          <div className="mt-2 space-y-2">
            <div className="h-2 rounded-full bg-slate-200" />
            <div className="h-2 w-9/12 rounded-full bg-slate-200" />
          </div>
        </div>
        <div>
          <div className={`h-2 w-24 rounded-full ${sectionRule}`} />
          <div className="mt-2 space-y-2">
            <div className="h-2 rounded-full bg-slate-200" />
            <div className="h-2 w-10/12 rounded-full bg-slate-200" />
            <div className="h-2 w-8/12 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplateSelector({
  selectedTemplate,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <Card className="bg-white/[0.045] fade-in-up delay-1">
      <CardHeader className="border-b border-white/10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-white">Template Selection</CardTitle>
            <CardDescription>
              Choose among four ATS-safe single-column styles. Every option keeps the same recruiter-approved structure.
            </CardDescription>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Live template switching
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 pt-6 md:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <div
              key={template.id}
              className={cn(
                "flex h-full flex-col rounded-[1.75rem] border p-4 transition duration-300",
                isSelected
                  ? "border-primary/35 bg-primary/10 shadow-[0_20px_50px_rgba(76,92,255,0.18)]"
                  : "border-white/10 bg-white/5 hover:border-white/15 hover:bg-white/[0.07]"
              )}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl border",
                      isSelected
                        ? "border-primary/20 bg-primary text-primary-foreground"
                        : "border-white/10 bg-white/5 text-muted-foreground"
                    )}
                  >
                    {isSelected ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <LayoutTemplate className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {template.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Single-column live preview
                    </div>
                  </div>
                </div>
                <div className={`h-3 w-14 rounded-full bg-gradient-to-r ${template.accent}`} />
              </div>

              <div className="flex min-h-0 items-start">
                <Thumbnail template={template.id} />
              </div>

              <div className="mt-4 flex flex-1 flex-col">
                <p className="flex-1 text-sm leading-6 text-muted-foreground">
                  {template.description}
                </p>

                <Button
                  type="button"
                  variant={isSelected ? "default" : "secondary"}
                  className="mt-4 w-full"
                  onClick={() => onSelect(template.id)}
                >
                  {isSelected ? "Selected" : "Select Template"}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
