"use client";

import { motion } from "framer-motion";
import { categorizePortfolioSkills } from "../intelligence";
import { type PortfolioData } from "../types";
import { InteractiveTiltCard } from "./interactive-tilt-card";
import { SectionHeading } from "./section-heading";

type SkillsSectionProps = {
  data: PortfolioData;
  theme: "dark" | "light";
};

export function SkillsSection({ data, theme }: SkillsSectionProps) {
  const categories = categorizePortfolioSkills(data.skills);
  const categoryNotes: Record<string, string> = {
    Frontend: "Design systems, interaction polish, and UI execution.",
    Backend: "APIs, workflows, and product logic behind the scenes.",
    Database: "Storage design, queries, and production data flows.",
    Tools: "Shipping tools, collaboration, and delivery acceleration.",
  };

  return (
    <section id="skills" className="scroll-mt-32 px-4 py-8 sm:px-6">
      <SectionHeading
        eyebrow="Skills"
        title="Category-based skills with stronger visual hierarchy"
        description="Frontend, backend, database, and tools are grouped into recruiter-friendly cards with progress indicators and lightweight motion."
        theme={theme}
      />
      <div
        className={`mt-8 rounded-[1.8rem] border p-6 ${
          theme === "dark"
            ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]"
            : "border-slate-200 bg-white/92"
        }`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className={`text-xs uppercase tracking-[0.24em] ${theme === "dark" ? "text-cyan-200/70" : "text-slate-500"}`}>
              Stack Overview
            </div>
            <div className={`mt-3 text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              {data.skills.length} skills organized for fast recruiter scanning
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.slice(0, 8).map((skill) => (
              <span
                key={skill}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  theme === "dark"
                    ? "bg-slate-950/55 text-slate-100"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {categories.map((category, index) => {
          const Icon = category.icon;

          return (
            <InteractiveTiltCard
              key={category.title}
              className={`relative overflow-hidden rounded-[1.7rem] border p-5 ${
                theme === "dark"
                  ? "border-white/10 bg-white/[0.05]"
                  : "border-slate-200 bg-white/90"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    theme === "dark"
                      ? "border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                      : "border border-cyan-200 bg-cyan-50 text-cyan-800"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                      {category.title}
                    </div>
                    <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      {category.skills.length} skills in this category
                    </div>
                  </div>
                </div>

                <p className={`mt-4 text-sm leading-7 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                  {categoryNotes[category.title] ?? "Strong category coverage."}
                </p>

                <div className={`mt-5 h-2 overflow-hidden rounded-full ${theme === "dark" ? "bg-white/10" : "bg-slate-200"}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${category.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1 + index * 0.05 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300"
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        theme === "dark"
                          ? "bg-slate-950/50 text-slate-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </InteractiveTiltCard>
          );
        })}
      </div>
    </section>
  );
}
