"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Blocks,
  BrainCircuit,
  FileBarChart2,
  FolderKanban,
  Rocket,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    title: "Portfolio Builder",
    description: "Compose polished case studies, skill systems, project grids, social links, and a deploy-ready developer profile.",
    href: "/portfolio",
    accent: "from-cyan-300 to-blue-500",
  },
  {
    icon: Blocks,
    title: "Resume Generator",
    description: "Generate clean ATS resumes with live A4 previews, content structure, and PDF, DOCX, or print export.",
    href: "/resume-generator",
    accent: "from-violet-300 to-fuchsia-500",
  },
  {
    icon: FileBarChart2,
    title: "Resume Analyzer",
    description: "Score your fit, find missing keywords, tighten bullets, and understand how recruiters read your resume.",
    href: "/resume-analyzer",
    accent: "from-emerald-300 to-cyan-400",
  },
  {
    icon: BrainCircuit,
    title: "Live Interview",
    description: "Practice role-specific interviews with timers, scoring, feedback, voice flow, and confident follow-up loops.",
    href: "/live-interview",
    accent: "from-blue-300 to-violet-500",
  },
  {
    icon: Rocket,
    title: "Deploy Portfolio",
    description: "Move from draft to public presence with production-style deployment states, URLs, and launch history.",
    href: "/deploy",
    accent: "from-amber-200 to-cyan-400",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const card = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <section id="features" className="relative px-4 py-16 sm:px-6 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-20 h-[420px] bg-[linear-gradient(90deg,transparent,rgba(59,130,246,0.08),rgba(168,85,247,0.08),transparent)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="mb-12 max-w-3xl"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            <ShieldCheck className="h-4 w-4" />
            Product System
          </div>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            A premium career operating system for developers who ship.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            Every module is designed to make your work easier to understand, your resume sharper, and your interview presence more credible.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-5"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div key={feature.title} variants={card}>
                <Link
                  href={feature.href}
                  className="group relative block h-full overflow-hidden rounded-[1.7rem] p-px transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_100px_rgba(34,211,238,0.12)]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-20 transition duration-300 group-hover:opacity-70`} />
                  <div className="relative h-full rounded-[calc(1.7rem-1px)] border border-white/10 bg-[#0A0F1C]/85 p-5 backdrop-blur-2xl">
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                      <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.65),transparent)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_38%)]" />
                    </div>

                    <motion.div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} shadow-[0_18px_45px_rgba(34,211,238,0.18)]`}
                      whileHover={{ rotate: -4, scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 320, damping: 18 }}
                    >
                      <Icon className="h-6 w-6 text-slate-950" />
                    </motion.div>

                    <div className="relative mt-7">
                      <div className="text-lg font-semibold tracking-[-0.02em] text-[#f8fafc]">
                        {feature.title}
                      </div>
                      <p className="mt-3 min-h-[112px] text-sm leading-7 text-[#94a3b8]">
                        {feature.description}
                      </p>
                    </div>

                    <div className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#a5f3fc]">
                      Explore feature
                      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
