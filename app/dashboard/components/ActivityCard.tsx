"use client";

import { motion } from "framer-motion";
import { Clock3, type LucideIcon } from "lucide-react";
import { dashboardItem } from "./DashboardLayout";

type ActivityItem = {
  title: string;
  description: string;
  time: string;
};

type ActivityCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  items: ActivityItem[];
};

export function ActivityCard({
  title,
  description,
  icon: Icon,
  items,
}: ActivityCardProps) {
  return (
    <motion.article
      variants={dashboardItem}
      className="w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5 shadow-[0_24px_70px_rgba(2,6,23,0.24)] backdrop-blur-2xl sm:p-6"
    >
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <Icon className="h-5 w-5 shrink-0 text-cyan-100" />
            <h2 className="truncate text-xl font-semibold tracking-[-0.03em] text-white">
              {title}
            </h2>
          </div>
          <p className="mt-2 break-words text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>
        <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
          <Clock3 className="h-3.5 w-3.5" />
          Synced
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((activity, index) => (
          <motion.div
            key={activity.title}
            className="flex min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-4 transition hover:border-cyan-300/25 hover:bg-white/[0.045] sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
          >
            <div className="min-w-0">
              <div className="truncate font-medium text-white">{activity.title}</div>
              <div className="mt-1 break-words text-sm leading-6 text-slate-400">
                {activity.description}
              </div>
            </div>
            <div className="shrink-0 text-sm text-cyan-200">{activity.time}</div>
          </motion.div>
        ))}
      </div>
    </motion.article>
  );
}
