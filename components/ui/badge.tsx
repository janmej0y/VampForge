import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.02em] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors backdrop-blur-xl",
  {
    variants: {
      variant: {
        default: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
        secondary: "border-white/10 bg-white/[0.055] text-slate-300",
        success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
