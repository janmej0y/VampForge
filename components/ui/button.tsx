import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "border border-blue-300/30 bg-[linear-gradient(135deg,#3b82f6,#60a5fa_52%,#b91c1c)] text-white shadow-[0_18px_42px_rgba(59,130,246,0.28),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-12px_28px_rgba(15,23,42,0.18)] before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-white/70 before:content-[''] hover:-translate-y-1 hover:shadow-[0_24px_68px_rgba(59,130,246,0.34),0_0_32px_rgba(96,165,250,0.16)]",
        secondary:
          "border border-white/10 bg-white/[0.055] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_34px_rgba(2,6,23,0.18)] backdrop-blur-xl hover:-translate-y-1 hover:border-blue-300/25 hover:bg-white/[0.09] hover:text-foreground hover:shadow-[0_20px_54px_rgba(59,130,246,0.14)]",
        ghost:
          "text-muted-foreground hover:-translate-y-0.5 hover:bg-white/[0.07] hover:text-foreground hover:shadow-[0_16px_36px_rgba(2,6,23,0.16)]",
        outline:
          "border border-white/12 bg-zinc-950/35 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl hover:-translate-y-1 hover:border-blue-300/30 hover:bg-white/[0.06] hover:shadow-[0_18px_48px_rgba(59,130,246,0.16)]",
        accent:
          "border border-red-300/25 bg-[linear-gradient(135deg,#7f1d1d,#dc2626_48%,#60a5fa)] text-white shadow-[0_18px_48px_rgba(185,28,28,0.24),inset_0_1px_0_rgba(255,255,255,0.22)] hover:-translate-y-1 hover:border-red-200/40 hover:shadow-[0_24px_70px_rgba(185,28,28,0.28)]",
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
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, disabled, isLoading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        <span className="relative inline-flex items-center gap-2">{children}</span>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
