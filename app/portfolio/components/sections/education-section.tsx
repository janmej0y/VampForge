"use client";

import { motion } from "framer-motion";
import { type PortfolioData } from "../types";
import { InteractiveTiltCard } from "./interactive-tilt-card";
import { SectionHeading } from "./section-heading";

type EducationSectionProps = {
  data: PortfolioData;
  theme: "dark" | "light";
};

export function EducationSection({ data, theme }: EducationSectionProps) {
  const items = data.education.filter((item) => item.degree || item.institution);

  return (
    <section id="education" className="scroll-mt-32 px-4 py-8 sm:px-6">
      <SectionHeading
        eyebrow="Education"
        title="Education cards with cleaner spacing and hierarchy"
        description="Present academic background as structured cards so it still feels premium without becoming visually noisy."
        theme={theme}
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {items.map((item, index) => (
          <InteractiveTiltCard
            key={item.id}
            className={`relative overflow-hidden rounded-[1.7rem] border p-5 ${
              theme === "dark"
                ? "border-white/10 bg-white/[0.05]"
                : "border-slate-200 bg-white/95"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                    {item.degree || "Degree"}
                  </h3>
                  <p className={`mt-1 text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                    {item.institution || "Institution"}
                  </p>
                </div>
                <div className={`text-xs uppercase tracking-[0.22em] ${theme === "dark" ? "text-cyan-200/70" : "text-slate-500"}`}>
                  {item.year || "Year"}
                </div>
              </div>
              <div className={`mt-4 rounded-[1.2rem] px-4 py-3 text-sm ${
                theme === "dark" ? "bg-slate-950/50 text-slate-300" : "bg-slate-100 text-slate-600"
              }`}>
                {item.grade || "Add a grade, rank, or academic distinction."}
              </div>
            </motion.div>
          </InteractiveTiltCard>
        ))}
      </div>
    </section>
  );
}
