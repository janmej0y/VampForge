"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SkillTagInputProps = {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  helperText?: string;
};

export function SkillTagInput({
  label,
  tags,
  onChange,
  placeholder = "Press Enter to add a tag",
  helperText,
}: SkillTagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const nextTag = inputValue.trim();

    if (
      !nextTag ||
      tags.some((tag) => tag.toLowerCase() === nextTag.toLowerCase())
    ) {
      setInputValue("");
      return;
    }

    onChange([...tags, nextTag]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-200">{label}</label>
        {helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-3 shadow-[0_18px_40px_rgba(3,7,18,0.22)] transition focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full text-primary/80 transition hover:text-primary"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}

          {tags.length === 0 ? (
            <div className="text-xs text-muted-foreground">
              No tags yet. Add a few to make the preview shine.
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTag();
              }
            }}
            placeholder={placeholder}
            className={cn(
              "h-11 flex-1 rounded-xl border border-white/10 bg-slate-950/50 px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            )}
          />
          <Button type="button" variant="secondary" onClick={addTag}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
