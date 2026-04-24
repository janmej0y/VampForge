"use client";

import { motion } from "framer-motion";
import { splitPortfolioLines } from "../intelligence";
import { type PortfolioData } from "../types";
import { SectionHeading } from "./section-heading";

type ExperienceSectionProps = {
  data: PortfolioData;
  theme: "dark" | "light";
};

export function ExperienceSection({ data, theme }: ExperienceSectionProps) {
  const items = data.experience.filter((item) => item.company || item.role);

  return (
    <section id="experience" className="scroll-mt-32 px-4 py-8 sm:px-6">
      <SectionHeading
        eyebrow="Experience"
        title="Timeline-style experience built for quick recruiter scanning"
        description="A cleaner vertical timeline helps hiring teams scan your progression, scope, and product outcomes faster."
        theme={theme}
      />
      <div className="relative mt-8 pl-4 sm:pl-8">
        <div className={`absolute bottom-0 left-[10px] top-2 w-px sm:left-[18px] ${theme === "dark" ? "bg-white/10" : "bg-slate-200"}`} />
        <div className="space-y-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="relative pl-8 sm:pl-12"
            >
              <div className="absolute left-0 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-amber-300 shadow-[0_0_0_6px_rgba(34,211,238,0.08)]" />
              <div
                className={`rounded-[1.7rem] border p-5 ${
                  theme === "dark"
                    ? "border-white/10 bg-white/[0.05]"
                    : "border-slate-200 bg-white/95"
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                      {item.role || "Role"}
                    </h3>
                    <p className={`mt-1 text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                      {item.company || "Company"}
                    </p>
                  </div>
                  <div className={`text-xs uppercase tracking-[0.22em] ${theme === "dark" ? "text-cyan-200/70" : "text-slate-500"}`}>
                    {item.duration || "Duration"}
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {splitPortfolioLines(item.description).map((line) => (
                    <p
                      key={line}
                      className={`text-sm leading-7 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                    >
                      {"\u2022"} {line}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
