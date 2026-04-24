"use client";

import { motion } from "framer-motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  theme: "dark" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  theme,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl"
    >
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] ${
          theme === "dark" ? "text-cyan-200/70" : "text-slate-500"
        } ${
          theme === "dark"
            ? "border-cyan-300/18 bg-cyan-300/10"
            : "border-cyan-200 bg-cyan-50"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            theme === "dark" ? "bg-cyan-300" : "bg-cyan-600"
          }`}
        />
        {eyebrow}
      </div>
      <h2
        className={`mt-4 max-w-4xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[2.85rem] ${
          theme === "dark" ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 120, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        className={`mt-5 h-1 rounded-full ${
          theme === "dark"
            ? "bg-[linear-gradient(90deg,rgba(34,211,238,0.9),rgba(251,191,36,0.85))]"
            : "bg-[linear-gradient(90deg,rgba(14,165,233,0.9),rgba(245,158,11,0.85))]"
        }`}
      />
      <p
        className={`mt-4 max-w-3xl text-sm leading-7 sm:text-base ${
          theme === "dark" ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
}
