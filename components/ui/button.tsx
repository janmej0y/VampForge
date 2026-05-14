import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "border border-primary/20 bg-primary text-primary-foreground shadow-[0_12px_28px_hsl(var(--primary)/0.18),inset_0_1px_0_rgba(255,255,255,0.18)] hover:-translate-y-0.5 hover:brightness-[1.03]",
        secondary:
          "border border-border bg-card/75 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_22px_rgba(2,6,23,0.1)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card hover:text-foreground",
        ghost:
          "text-muted-foreground hover:-translate-y-0.5 hover:bg-white/[0.07] hover:text-foreground",
        outline:
          "border border-border bg-background/35 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card/70 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)]",
        accent:
          "border border-primary/20 bg-secondary text-secondary-foreground shadow-[0_10px_24px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,0.22)] hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card",
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
