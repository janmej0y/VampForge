"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type VoiceWaveformProps = {
  active: boolean;
  tone?: "cyan" | "amber" | "emerald";
  bars?: number;
  className?: string;
};

export function VoiceWaveform({
  active,
  tone = "cyan",
  bars = 18,
  className,
}: VoiceWaveformProps) {
  const colorClass =
    tone === "amber"
      ? "bg-amber-200"
      : tone === "emerald"
        ? "bg-emerald-300"
        : "bg-cyan-200";

  return (
    <div className={cn("flex h-12 items-center justify-center gap-1.5", className)}>
      {Array.from({ length: bars }).map((_, index) => (
        <motion.div
          key={index}
          className={cn("w-1 rounded-full", colorClass)}
          initial={{ height: 8, opacity: 0.45 }}
          animate={
            active
              ? {
                  height: [10, 28 + ((index * 7) % 18), 12],
                  opacity: [0.45, 1, 0.55],
                }
              : { height: 8 + ((index * 5) % 12), opacity: 0.35 }
          }
          transition={{
            duration: 0.75 + (index % 5) * 0.08,
            repeat: active ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
