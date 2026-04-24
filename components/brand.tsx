import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  initials?: string;
};

type BrandLockupProps = {
  className?: string;
  contentClassName?: string;
  markClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  eyebrowClassName?: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  initials?: string;
  compact?: boolean;
};

export function BrandMark({
  className,
  initials = "VF",
}: BrandMarkProps) {
  const label = initials.slice(0, 2).toUpperCase();

  return (
    <span
      className={cn(
        "relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.95),rgba(125,211,252,0.88),rgba(251,191,36,0.85))] text-sm font-black tracking-[-0.06em] text-slate-950 shadow-[0_16px_40px_rgba(34,211,238,0.22)]",
        className
      )}
      aria-hidden="true"
    >
      <span className="pointer-events-none absolute inset-[2px] rounded-[0.9rem] border border-white/20 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent_48%)]" />
      <span className="relative">{label}</span>
    </span>
  );
}

export function BrandLockup({
  className,
  contentClassName,
  markClassName,
  titleClassName,
  subtitleClassName,
  eyebrowClassName,
  title = "VampForge",
  subtitle = "Developer identity workspace",
  eyebrow,
  initials = "VF",
  compact = false,
}: BrandLockupProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <BrandMark initials={initials} className={markClassName} />
      {!compact ? (
        <div className={cn("min-w-0", contentClassName)}>
          {eyebrow ? (
            <div
              className={cn(
                "mb-1 inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-muted-foreground",
                eyebrowClassName
              )}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            className={cn(
              "truncate text-base font-semibold tracking-[-0.03em] text-white",
              titleClassName
            )}
          >
            {title}
          </div>
          <div
            className={cn(
              "truncate text-xs leading-5 text-muted-foreground",
              subtitleClassName
            )}
          >
            {subtitle}
          </div>
        </div>
      ) : null}
    </div>
  );
}
