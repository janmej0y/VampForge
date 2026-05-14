"use client";

import { useMemo, useState } from "react";
import { Bell, Menu, Moon, Search, Sparkles, Sun } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { navigation } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

type NavbarProps = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onOpenSidebar: () => void;
};

export function Navbar({ theme, onToggleTheme, onOpenSidebar }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = navigation.find((item) => item.href === pathname);
  const [query, setQuery] = useState("");
  const [searchFeedback, setSearchFeedback] = useState("");
  const [alertsOpen, setAlertsOpen] = useState(false);

  const searchIndex = useMemo(
    () =>
      navigation.map((item) => ({
        ...item,
        keywords: [item.title, item.description, item.href].join(" ").toLowerCase(),
      })),
    []
  );

  const handleSearch = () => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      setSearchFeedback("Try portfolio, resume, interview, deploy, or settings.");
      return;
    }

    const match = searchIndex.find((item) => item.keywords.includes(normalized));
    if (!match) {
      setSearchFeedback(`No workspace match for "${query.trim()}".`);
      return;
    }

    setSearchFeedback(`Opening ${match.title}.`);
    router.push(match.href);
  };

  return (
    <header className="sticky top-0 z-50 mb-6 w-full max-w-full">
      <div className="glass-panel mesh-card flex w-full max-w-full flex-col gap-4 rounded-2xl px-4 py-4 shadow-[0_20px_64px_rgba(2,6,23,0.18)] sm:px-5">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="secondary"
              size="icon"
              className="lg:hidden"
              onClick={onOpenSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.24em] text-primary/80">
                Workspace
              </div>
              <div className="mt-1 truncate text-2xl font-semibold tracking-[-0.04em] text-white">
                {currentPage?.title ?? "Workspace"}
              </div>
              <div className="mt-1 hidden max-w-lg break-words text-sm text-muted-foreground md:block">
                {currentPage?.description ??
                  "Build, refine, and export."}
              </div>
            </div>
          </div>

          <div className="flex min-w-0 w-full max-w-3xl flex-col gap-3 xl:shrink">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start xl:items-center">
              <div className="min-w-0 flex-1">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      if (searchFeedback) {
                        setSearchFeedback("");
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSearch();
                      }
                    }}
                    placeholder="Search workspace..."
                    className="field-surface h-12 w-full rounded-2xl pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/55 focus:bg-white/[0.06] focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                {searchFeedback ? (
                  <div className="mt-2 text-xs text-muted-foreground">{searchFeedback}</div>
                ) : null}
              </div>
              <div className="action-cluster sm:w-auto">
                <Button variant="secondary" onClick={handleSearch} className="shrink-0">
                  <Search className="h-4 w-4" />
                  Go
                </Button>
                <div className="app-readable-chip hidden rounded-full border border-white/10 bg-slate-950/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.26em] text-slate-400 sm:block">
                  Quick
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <div className="relative">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setAlertsOpen((value) => !value)}
                  aria-label="Toggle notifications"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="secondary"
                size="icon"
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="shrink-0"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <div className="app-readable-chip hidden rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-2 text-sm text-slate-300 xl:flex xl:items-center xl:gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Premium mode
              </div>
              <div className="app-profile-pill flex min-w-0 items-center gap-3 rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.82),rgba(10,18,35,0.7))] px-3 py-2.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#5eead4,#a5b4fc)] text-sm font-semibold text-slate-950 shadow-[0_14px_34px_rgba(20,184,166,0.16)]">
                  JM
                </div>
                <div className="hidden min-w-0 sm:block">
                  <div className="truncate text-sm font-semibold text-white">Janmejoy</div>
                  <div className="truncate text-xs text-muted-foreground">
                    Web Developer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {alertsOpen ? (
        <div className="absolute right-4 top-[calc(100%+0.5rem)] z-[70] w-[min(20rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-[1.3rem] border border-white/10 bg-slate-950/95 p-4 shadow-[0_22px_60px_rgba(2,6,23,0.42)] backdrop-blur-xl sm:right-6 lg:right-8">
          <div className="text-sm font-semibold text-white">Workspace alerts</div>
          <div className="mt-3 space-y-3 text-sm text-slate-300">
            <div className="break-words rounded-xl border border-white/10 bg-white/5 px-3 py-3">
              Portfolio preview is ready to export.
            </div>
            <div className="break-words rounded-xl border border-white/10 bg-white/5 px-3 py-3">
              Resume analyzer has new ATS suggestions.
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
