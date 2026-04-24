"use client";

import { motion } from "framer-motion";
import { portfolioStats } from "../intelligence";
import { type PortfolioData } from "../types";
import { InteractiveTiltCard } from "./interactive-tilt-card";
import { SectionHeading } from "./section-heading";

type AboutSectionProps = {
  data: PortfolioData;
  theme: "dark" | "light";
};

export function AboutSection({ data, theme }: AboutSectionProps) {
  const stats = portfolioStats(data).slice(0, 4);
  const storyCards = [
    ["Experience Summary", data.experienceSummary],
    ["Career Goals", data.careerGoals],
    ["Tech Focus", data.techFocus],
  ];
  const statDescriptions: Record<string, string> = {
    Projects: "Featured builds with stronger case-study potential.",
    Experience: "Roles that signal product and engineering depth.",
    Technologies: "Active tools that shape delivery quality.",
    Clients: "Collaborations or proof of production exposure.",
  };

  return (
    <section id="about" className="scroll-mt-32 px-4 py-8 sm:px-6">
      <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="About"
            title="Built to feel like a premium startup profile"
            description="This section helps recruiters understand your story quickly through a stronger bio, sharper positioning, and a clean product-minded presentation."
            theme={theme}
          />
          <div className="mt-8 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className={`rounded-[1.8rem] border p-6 ${
                theme === "dark"
                  ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]"
                  : "border-slate-200 bg-white/92"
              }`}
            >
              <div className={`text-xs uppercase tracking-[0.22em] ${theme === "dark" ? "text-cyan-200/70" : "text-slate-500"}`}>
                Short Bio
              </div>
              <p className={`mt-4 text-base leading-8 ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>
                {data.about || "Add content in the builder to strengthen this section."}
              </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-3">
              {storyCards.map(([label, value], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className={`rounded-[1.5rem] border px-5 py-5 ${
                    theme === "dark"
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-slate-200 bg-white/80"
                  }`}
                >
                  <div className={`text-xs uppercase tracking-[0.22em] ${theme === "dark" ? "text-cyan-200/70" : "text-slate-500"}`}>
                    {label}
                  </div>
                  <p className={`mt-3 text-sm leading-7 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                    {value || "Add content in the builder to strengthen this section."}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45 }}
            className={`rounded-[1.8rem] border p-6 ${
              theme === "dark"
                ? "border-white/10 bg-[linear-gradient(180deg,rgba(12,19,36,0.92),rgba(15,23,42,0.72))]"
                : "border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,245,249,0.9))]"
            }`}
          >
            <div className={`text-xs uppercase tracking-[0.24em] ${theme === "dark" ? "text-cyan-200/70" : "text-slate-500"}`}>
              Positioning Snapshot
            </div>
            <div className={`mt-3 text-2xl font-semibold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              Product quality meets recruiter clarity
            </div>
            <p className={`mt-4 text-sm leading-7 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              This preview is designed to feel like a launch-ready product page while still surfacing the proof points hiring teams care about first.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat, index) => (
              <InteractiveTiltCard
                key={stat.label}
                className={`relative overflow-hidden rounded-[1.7rem] border p-5 ${
                  theme === "dark"
                    ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]"
                    : "border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.9))]"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                >
                  <div className={`text-xs uppercase tracking-[0.22em] ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    {stat.label}
                  </div>
                  <div className={`mt-4 text-4xl font-semibold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                    {stat.value}
                  </div>
                  <div className={`mt-2 text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                    {statDescriptions[stat.label] ?? "Premium landing-page stat card with hover tilt."}
                  </div>
                </motion.div>
              </InteractiveTiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
