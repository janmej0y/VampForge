"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardItem } from "./DashboardLayout";

type StatusCardProps = {
  title: string;
  description: string;
  metric: string;
  label: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  progress: number;
  accent: string;
};

export function StatusCard({
  title,
  description,
  metric,
  label,
  href,
  cta,
  icon: Icon,
  progress,
  accent,
}: StatusCardProps) {
  return (
    <motion.article
      variants={dashboardItem}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.96),rgba(10,18,35,0.9))] p-5 shadow-[0_24px_70px_rgba(2,6,23,0.22)] transition duration-300 sm:p-6"
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className={`pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-3xl transition duration-300 group-hover:opacity-30`} />
      <div className="relative">
          <div className="flex min-w-0 items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-100">
                {label}
              </div>
              <h2 className="mt-3 truncate text-xl font-semibold tracking-[-0.03em] text-white drop-shadow-sm">
                {title}
              </h2>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <Icon className="h-5 w-5 text-cyan-100 transition duration-300 group-hover:scale-110" />
            </div>
          </div>

          <p className="mt-4 min-h-12 break-words text-sm leading-6 text-slate-300">
            {description}
          </p>

          <div className="mt-6 flex min-w-0 flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="text-3xl font-semibold tracking-[-0.05em] text-white drop-shadow-sm">
                {metric}
              </div>
              <div className="mt-1 text-sm text-slate-300">Current status</div>
            </div>
            <Button asChild variant="secondary" className="max-w-full shrink-0">
              <Link href={href}>
                <span className="truncate">{cta}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </Link>
            </Button>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8,#8b5cf6,#22d3ee)]"
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
      </div>
    </motion.article>
  );
}
