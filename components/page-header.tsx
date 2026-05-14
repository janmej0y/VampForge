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
        "mesh-card relative isolate w-full max-w-full overflow-hidden rounded-2xl border border-white/10 p-5 shadow-[0_22px_70px_rgba(2,6,23,0.18)] fade-in-up md:p-6 lg:flex lg:items-end lg:justify-between lg:gap-8",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.56),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(135deg,rgba(45,212,191,0.12),transparent_46%,rgba(245,158,11,0.08))]" />
      <div className="relative min-w-0 space-y-3">
        {badge ? (
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            {badge}
          </div>
        ) : null}
        <div className="space-y-2">
          <h1 className="max-w-3xl break-words text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.55rem] lg:leading-[1.04]">
            {title}
          </h1>
          <p className="max-w-xl break-words text-sm leading-6 text-muted-foreground">
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
