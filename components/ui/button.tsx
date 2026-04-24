import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-[0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "border border-teal-300/25 bg-[linear-gradient(135deg,#5eead4_0%,#38bdf8_46%,#4f46e5_100%)] text-slate-950 shadow-[0_14px_34px_rgba(20,184,166,0.2),inset_0_1px_0_rgba(255,255,255,0.42)] hover:-translate-y-0.5 hover:brightness-[1.04] hover:shadow-[0_18px_44px_rgba(20,184,166,0.24)]",
        secondary:
          "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.035))] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_28px_rgba(2,6,23,0.18)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-teal-300/25 hover:bg-white/[0.075] hover:text-white hover:shadow-[0_14px_36px_rgba(15,23,42,0.18)]",
        ghost:
          "text-muted-foreground hover:-translate-y-0.5 hover:bg-white/[0.07] hover:text-foreground",
        outline:
          "border border-white/[0.12] bg-slate-950/20 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-teal-300/25 hover:bg-white/[0.055] hover:shadow-[0_14px_34px_rgba(15,23,42,0.16)]",
        accent:
          "border border-amber-200/30 bg-[linear-gradient(135deg,#f8fafc_0%,#facc15_58%,#14b8a6_130%)] text-slate-950 shadow-[0_14px_34px_rgba(245,158,11,0.18),inset_0_1px_0_rgba(255,255,255,0.55)] hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_18px_44px_rgba(245,158,11,0.22)]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
