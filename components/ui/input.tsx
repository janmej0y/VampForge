import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
        <input
          type={type}
          className={cn(
            "field-surface flex h-12 w-full rounded-2xl px-4 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/55 focus:bg-white/[0.06] focus:ring-2 focus:ring-primary/15",
            className
          )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
