"use client";

import { motion } from "framer-motion";
import { type PortfolioData } from "../types";
import { InteractiveTiltCard } from "./interactive-tilt-card";
import { SectionHeading } from "./section-heading";

type AchievementsSectionProps = {
  data: PortfolioData;
  theme: "dark" | "light";
};

export function AchievementsSection({ data, theme }: AchievementsSectionProps) {
  const items = data.achievements.filter((item) => item.title || item.description);

  return (
    <section id="achievements" className="scroll-mt-32 px-4 py-8 sm:px-6">
      <SectionHeading
        eyebrow="Achievements"
        title="Certifications, awards, and proof points in premium cards"
        description="Highlight external validation and standout wins without making the portfolio feel heavy or generic."
        theme={theme}
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {items.map((item, index) => (
          <InteractiveTiltCard
            key={item.id}
            className={`relative overflow-hidden rounded-[1.7rem] border p-5 ${
              theme === "dark"
                ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]"
                : "border-slate-200 bg-white/95"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <div className={`text-xs uppercase tracking-[0.22em] ${theme === "dark" ? "text-amber-200/70" : "text-slate-500"}`}>
                {item.category || "Achievement"}
              </div>
              <h3 className={`mt-3 text-xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                {item.title || "Achievement Title"}
              </h3>
              <p className={`mt-3 text-sm leading-7 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                {item.description || "Add a short line that explains why this proof point matters."}
              </p>
            </motion.div>
          </InteractiveTiltCard>
        ))}
      </div>
    </section>
  );
}
