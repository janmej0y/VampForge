"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import { BrandLockup } from "@/components/brand";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
};

type SidebarContentProps = {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
};

function SidebarContent({
  collapsed,
  onToggleCollapse,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();
  const activeItem = navigation.find((item) => item.href === pathname);

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <div
        className={cn(
          "mesh-card relative shrink-0 rounded-[1.7rem] border border-white/10 px-4 py-4",
          collapsed && "flex justify-center px-3 py-3"
        )}
      >
        {!collapsed ? (
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]" />
        ) : null}
        <BrandLockup
          compact={collapsed}
          eyebrow={collapsed ? undefined : "Workspace Suite"}
          className={cn("relative z-[1]", !collapsed && "items-start")}
          contentClassName="space-y-0.5"
          markClassName={cn(
            "h-12 w-12 rounded-[1.1rem] shadow-[0_18px_44px_rgba(34,211,238,0.18)]",
            collapsed && "h-10 w-10"
          )}
          titleClassName="font-heading text-[1.08rem] font-semibold leading-none tracking-[-0.05em]"
          subtitleClassName="text-[11px] leading-4 text-slate-300/80"
          eyebrowClassName="border-primary/20 bg-primary/10 text-cyan-100/90"
        />
      </div>

      {!collapsed ? (
        <div className="sidebar-status-card shrink-0 rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.82),rgba(10,18,35,0.68))] p-4">
          <div className="section-label">Now Editing</div>
          <div className="mt-3 text-sm font-semibold text-white">
            {activeItem?.title ?? "Workspace"}
          </div>
          <div className="mt-1 break-words text-xs leading-5 text-muted-foreground">
            {activeItem?.description ?? "Pick a builder and keep momentum moving."}
          </div>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {!collapsed ? (
          <div className="px-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Workspace
          </div>
        ) : null}
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex min-w-0 items-start gap-3 rounded-[1.3rem] px-3 py-3.5 text-sm font-medium transition-all duration-300",
                isActive
                  ? "border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(255,255,255,0.08),rgba(251,191,36,0.1))] text-white shadow-[0_18px_40px_rgba(2,6,23,0.22)]"
                  : "text-muted-foreground hover:bg-white/[0.05] hover:text-white",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 h-5 w-5 shrink-0 transition-transform duration-300",
                  isActive ? "text-primary" : "group-hover:scale-110"
                )}
              />
              {!collapsed ? (
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="leading-5">{item.title}</div>
                  <div className="mt-1 break-words text-[11px] leading-4 text-slate-400/85">
                    {item.description}
                  </div>
                </div>
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto shrink-0 space-y-4">
        <div
          className={cn(
            "sidebar-momentum-card rounded-[1.6rem] border border-primary/18 bg-[linear-gradient(145deg,rgba(34,211,238,0.12),rgba(255,255,255,0.04),rgba(251,191,36,0.08))] p-4",
            collapsed && "p-3"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            {!collapsed ? (
              <div>
                <div className="text-sm font-semibold text-white">Builder Momentum</div>
                <div className="text-xs text-muted-foreground">
                  Clean layouts, exports, and previews
                </div>
              </div>
            ) : null}
          </div>
          {!collapsed ? (
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="shimmer-line h-full w-[86%] rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.9),rgba(125,211,252,0.9),rgba(251,191,36,0.85))]" />
            </div>
          ) : null}
        </div>

        {onToggleCollapse ? (
          <Button
            variant="secondary"
            className={cn("hidden w-full lg:flex", collapsed && "px-0")}
            onClick={onToggleCollapse}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                Collapse
              </>
            )}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      <aside
        className="glass-panel fixed inset-y-4 left-4 z-40 hidden w-64 max-w-[calc(100vw-2rem)] rounded-[2rem] border-white/10 p-4 shadow-[0_30px_90px_rgba(2,6,23,0.42)] transition-all duration-300 lg:flex"
      >
        <SidebarContent
          collapsed={false}
        />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm transition lg:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={onCloseMobile}
      />
      <aside
        className={cn(
          "glass-panel fixed inset-y-4 left-4 z-[60] w-[min(18rem,calc(100vw-2rem))] max-w-full rounded-[2rem] border-white/10 p-4 transition duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-[120%]"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Navigation
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:bg-white/5 hover:text-white"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <SidebarContent collapsed={false} onNavigate={onCloseMobile} />
      </aside>
    </>
  );
}
