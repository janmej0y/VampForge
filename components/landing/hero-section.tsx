"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  FolderKanban,
  PlayCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

const tools = [
  { label: "Portfolio", value: "Live", icon: FolderKanban, tone: "from-cyan-400 to-blue-500" },
  { label: "Resume", value: "96 ATS", icon: FileText, tone: "from-violet-400 to-fuchsia-500" },
  { label: "Interview", value: "Ready", icon: BrainCircuit, tone: "from-emerald-300 to-cyan-400" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-92px)] overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(56,189,248,0.24),transparent_30%),radial-gradient(circle_at_72%_18%,rgba(168,85,247,0.18),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-10 h-px bg-[linear-gradient(90deg,transparent,rgba(125,211,252,0.45),transparent)]" />

      <motion.div
        className="absolute right-6 top-24 hidden h-[68vh] max-h-[600px] w-[42vw] max-w-[700px] lg:block xl:right-[max(2rem,calc((100vw-1400px)/2+2rem))]"
        initial={false}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-0 rounded-[3rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.58),rgba(30,41,59,0.28))] shadow-[0_40px_160px_rgba(2,8,23,0.7)] backdrop-blur-2xl"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-[1px] rounded-[calc(3rem-1px)] bg-[linear-gradient(135deg,rgba(59,130,246,0.13),rgba(168,85,247,0.08),rgba(34,211,238,0.1))]" />
          <div className="relative grid h-full grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] gap-5 p-6">
            <div className="min-w-0 rounded-[2rem] border border-white/10 bg-black/20 p-4">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </div>
              <div className="space-y-3">
                {["Overview", "Builder", "Resume", "Interview", "Deploy"].map((item, index) => (
                  <motion.div
                    key={item}
                    className={`rounded-2xl px-4 py-3 text-sm ${
                      index === 1
                        ? "border border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                        : "border border-white/10 bg-white/[0.045] text-slate-300"
                    }`}
                    animate={{ opacity: index === 1 ? [0.75, 1, 0.75] : 1 }}
                    transition={{ duration: 2.8, repeat: Infinity, delay: index * 0.15 }}
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="min-w-0 space-y-5 rounded-[2rem] border border-white/10 bg-slate-950/35 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">
                    Identity Score
                  </div>
                  <div className="mt-2 text-5xl font-semibold tracking-[-0.05em] text-white">
                    94
                  </div>
                </div>
                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Interview Ready
                </div>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8,#8b5cf6,#22d3ee)]"
                  initial={{ width: "18%" }}
                  animate={{ width: "94%" }}
                  transition={{ duration: 1.4, delay: 0.55, ease: "easeOut" }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {tools.map((tool, index) => {
                  const Icon = tool.icon;

                  return (
                    <motion.div
                      key={tool.label}
                      className="rounded-[1.4rem] border border-white/10 bg-white/[0.055] p-4"
                      animate={{ y: [0, index % 2 ? 8 : -8, 0] }}
                      transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tool.tone}`}>
                        <Icon className="h-5 w-5 text-slate-950" />
                      </div>
                      <div className="text-xs text-slate-400">{tool.label}</div>
                      <div className="mt-1 text-lg font-semibold text-white">{tool.value}</div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <Sparkles className="h-4 w-4 text-cyan-200" />
                    Recruiter signal
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-white/20" />
                    <div className="h-2 w-10/12 rounded-full bg-white/15" />
                    <div className="h-2 w-7/12 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="rounded-[1.6rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
                  <CheckCircle2 className="h-5 w-5 text-cyan-100" />
                  <div className="mt-6 text-sm text-cyan-100">Launch URL</div>
                  <div className="mt-1 truncate font-mono text-xs text-cyan-200/80">
                    vamp.dev/live
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative mx-auto flex min-h-[650px] max-w-7xl items-center"
        initial={false}
        animate="visible"
        transition={{ staggerChildren: 0.12 }}
      >
        <div className="max-w-3xl py-14 lg:max-w-[680px] lg:py-24 xl:max-w-[720px]">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-xl"
          >
            <Zap className="h-4 w-4" />
            One workspace for career-grade developer presence
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-8 max-w-full text-balance text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.75rem] lg:leading-[1.02] xl:text-[5.25rem] xl:leading-[0.98]"
          >
            Forge a{" "}
            <span className="kinetic-gradient-text typography-glow">
              Developer Identity
            </span>{" "}
            that makes you{" "}
            <span className="kinetic-gradient-text typography-glow typography-delay">
              Interview Ready
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl"
          >
            Build a magnetic portfolio, generate ATS-ready resumes, practice interviews, and deploy your career surface from one cinematic product workspace.
          </motion.p>

          <motion.div variants={fadeUp} className="action-cluster mt-9 sm:justify-start">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#preview">
                <PlayCircle className="h-4 w-4" />
                View Live Demo
              </a>
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["1000+", "developers trusted VampForge"],
              ["3x", "faster profile iteration"],
              ["Live", "resume, portfolio, interview previews"],
            ].map(([value, label]) => (
              <div
                key={value}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.07]"
              >
                <div className="text-2xl font-semibold text-white">{value}</div>
                <div className="mt-1 text-sm leading-6 text-slate-400">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
