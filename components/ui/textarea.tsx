import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "field-surface flex min-h-[120px] w-full rounded-2xl px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/55 focus:bg-white/[0.06] focus:ring-2 focus:ring-primary/15",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
