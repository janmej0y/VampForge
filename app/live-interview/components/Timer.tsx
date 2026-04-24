"use client";

import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

type TimerProps = {
  timeRemaining: number;
  totalTime: number;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.max(0, totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function Timer({ timeRemaining, totalTime }: TimerProps) {
  const progress = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
  const warning = timeRemaining <= 10;

  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.88),rgba(10,18,35,0.72))] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="section-label">Timer</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
            {formatTime(timeRemaining)}
          </p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl border bg-white/5",
            warning
              ? "border-amber-300/30 text-amber-200"
              : "border-primary/20 text-primary"
          )}
        >
          <Clock3 className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={cn(
            "h-full rounded-full",
            warning
              ? "bg-[linear-gradient(90deg,rgba(251,191,36,0.95),rgba(248,113,113,0.92))]"
              : "bg-[linear-gradient(90deg,rgba(34,211,238,0.95),rgba(125,211,252,0.9),rgba(251,191,36,0.82))]"
          )}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div
        className={cn(
          "mt-3 text-sm",
          warning ? "text-amber-200" : "text-slate-400"
        )}
      >
        {warning
          ? "Final 10 seconds. Your answer will auto-submit."
          : "Time pressure is active to mimic a real interview round."}
      </div>
    </div>
  );
}
