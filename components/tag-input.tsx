"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type TagInputProps = {
  label: string;
  placeholder?: string;
  value: string[];
  onChange: (tags: string[]) => void;
};

export function TagInput({
  label,
  placeholder = "Add a skill and press Enter",
  value,
  onChange,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const nextTag = input.trim();

    if (!nextTag || value.includes(nextTag)) {
      setInput("");
      return;
    }

    onChange([...value, nextTag]);
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((item) => item !== tag));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-200">{label}</label>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 transition focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/20">
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((tag) => (
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
        </div>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder={placeholder}
          className={cn(
            "w-full border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          )}
        />
      </div>
    </div>
  );
}
