import { cn } from "@/lib/utils";

type PageHeaderProps = {
  badge?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  badge,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mesh-card relative isolate w-full max-w-full overflow-hidden rounded-2xl border border-white/10 p-5 shadow-[0_30px_90px_rgba(2,6,23,0.28)] fade-in-up md:p-6 lg:flex lg:items-end lg:justify-between lg:gap-10",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.56),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.1),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 aurora-sweep opacity-45 [background-image:linear-gradient(135deg,rgba(34,211,238,0.05),transparent_34%,rgba(251,191,36,0.04)_68%,transparent)]" />
      <div className="relative min-w-0 space-y-4">
        {badge ? (
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
            {badge}
          </div>
        ) : null}
        <div className="space-y-3">
          <h1 className="max-w-4xl break-words text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl lg:text-[2.85rem] lg:leading-[1.02]">
            {title}
          </h1>
          <p className="max-w-2xl break-words text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </div>
      {action ? (
        <div className="relative mt-6 flex min-w-0 w-full justify-start lg:mt-0 lg:w-auto lg:shrink-0 lg:justify-end">
          {action}
        </div>
      ) : null}
    </div>
  );
}
