"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Moon, Sparkles, Sun, TrendingUp } from "lucide-react";
import { useAppTheme } from "@/components/app-theme";
import { Button } from "@/components/ui/button";
import { dashboardItem } from "./DashboardLayout";

export function ScoreCard() {
  const { theme, toggleTheme } = useAppTheme();

  return (
    <motion.section
      variants={dashboardItem}
      className="group w-full max-w-full overflow-hidden rounded-2xl p-px transition duration-300 hover:shadow-[0_28px_90px_rgba(34,211,238,0.14)]"
    >
      <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(34,211,238,0.48),rgba(139,92,246,0.36),rgba(255,255,255,0.08))] p-px">
        <div className="w-full max-w-full rounded-[calc(1rem-1px)] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.03))] p-5 backdrop-blur-2xl sm:p-6">
          <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Identity Score</span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  className="rounded-full px-4"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4" />
                      Light mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      Dark mode
                    </>
                  )}
                </Button>
              </div>
              <div className="mt-5 flex flex-wrap items-end gap-4">
                <div className="text-6xl font-semibold tracking-[-0.07em] text-white sm:text-7xl">
                  94
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                    <TrendingUp className="h-4 w-4" />
                    +12 this week
                  </div>
                  <p className="mt-1 max-w-xl break-words text-sm leading-6 text-slate-400">
                    Your portfolio, resume, recruiter signal, and interview readiness are aligned for active applications.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:w-full lg:max-w-xl">
              {["Portfolio live", "Resume ATS-ready", "Interview warm"].map((item) => (
                <div
                  key={item}
                  className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-3 text-sm text-slate-200"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-200" />
                  <span className="min-w-0 truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8,#8b5cf6,#22d3ee)]"
              initial={{ width: "0%" }}
              animate={{ width: "94%" }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
