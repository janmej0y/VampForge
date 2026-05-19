import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
        <input
          type={type}
          className={cn(
            "field-surface flex h-12 w-full rounded-none border-x-0 border-t-0 border-b-white/15 bg-transparent px-1 py-2 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-b-blue-300/80 focus:bg-transparent focus:shadow-[0_10px_34px_rgba(59,130,246,0.12),0_1px_0_rgba(96,165,250,0.9)] focus:ring-0",
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
