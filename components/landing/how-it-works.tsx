"use client";

import { motion } from "framer-motion";
import { ArrowRight, FilePenLine, FileSignature, Rocket, Share2 } from "lucide-react";

const steps = [
  {
    icon: FilePenLine,
    title: "Capture Your Signal",
    description: "Add projects, roles, achievements, links, and skills once.",
  },
  {
    icon: FileSignature,
    title: "Generate Career Assets",
    description: "Turn one profile into portfolio pages, resumes, and interview context.",
  },
  {
    icon: Rocket,
    title: "Launch With Polish",
    description: "Deploy your public profile and keep every artifact consistent.",
  },
  {
    icon: Share2,
    title: "Share With Confidence",
    description: "Send recruiters a sharp identity that feels current and complete.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-14 max-w-3xl text-center"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200">
            How It Works
          </div>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            From scattered career notes to one polished identity flow.
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 right-8 top-16 hidden h-px bg-white/10 lg:block" />
          <motion.div
            className="absolute left-8 top-16 hidden h-px bg-[linear-gradient(90deg,#38bdf8,#8b5cf6,#22d3ee)] lg:block"
            initial={false}
            whileInView={{ width: "calc(100% - 4rem)" }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          <div className="grid auto-rows-[minmax(220px,auto)] gap-5 lg:grid-cols-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.title}
                  className={`group relative rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_80px_rgba(2,8,23,0.32)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-300/30 hover:bg-white/[0.065] ${
                    index === 0 || index === 3 ? "lg:col-span-3" : "lg:col-span-3 xl:col-span-2"
                  }`}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <motion.div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 shadow-[0_0_50px_rgba(34,211,238,0.12)]"
                      whileHover={{ scale: 1.08, rotate: 3 }}
                    >
                      <Icon className="h-7 w-7 text-cyan-100" />
                    </motion.div>
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      0{index + 1}
                    </div>
                  </div>

                  {index < steps.length - 1 ? (
                    <motion.div
                      className="absolute -right-4 top-12 z-20 hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0A0F1C] text-cyan-200 lg:flex"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  ) : null}

                  <div className="relative z-10 mt-7 text-xl font-semibold tracking-[-0.03em] text-white">
                    {step.title}
                  </div>
                  <p className="relative z-10 mt-3 text-sm leading-7 text-slate-400">
                    {step.description}
                  </p>

                  <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] opacity-0 transition duration-300 group-hover:opacity-100">
                    <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(125,211,252,0.7),transparent)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_40%)]" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
