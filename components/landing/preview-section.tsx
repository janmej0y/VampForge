"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BrainCircuit,
  CheckCircle2,
  FileText,
  FolderKanban,
  Mic,
  Play,
  Sparkles,
} from "lucide-react";

const previews = [
  {
    id: "resume",
    label: "Resume",
    icon: FileText,
    eyebrow: "ATS Score",
    score: "96",
    title: "Senior Frontend Engineer",
    description: "Clean single-column resume with keyword matching, export controls, and recruiter-safe hierarchy.",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: FolderKanban,
    eyebrow: "Portfolio Signal",
    score: "Live",
    title: "Case Study Workspace",
    description: "Project cards, skill systems, proof links, and a public profile that feels designed, not assembled.",
  },
  {
    id: "interview",
    label: "Interview",
    icon: BrainCircuit,
    eyebrow: "Mock Round",
    score: "8.7",
    title: "System Design Practice",
    description: "Timed prompts, active response state, scoring, and feedback built for confident interview reps.",
  },
] as const;

type PreviewId = (typeof previews)[number]["id"];

function ResumeDemo() {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-5">
        <div className="text-sm font-semibold text-white">Live resume controls</div>
        <div className="mt-5 space-y-4">
          {["Summary strength", "ATS keywords", "One-page fit"].map((item, index) => (
            <div key={item}>
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>{item}</span>
                <span>{92 - index * 4}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8,#8b5cf6,#22d3ee)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${92 - index * 4}%` }}
                  transition={{ duration: 0.7, delay: index * 0.08 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.6rem] bg-white p-6 text-slate-950 shadow-[0_30px_90px_rgba(2,8,23,0.35)]">
        <div className="border-b border-slate-200 pb-4">
          <div className="text-2xl font-bold tracking-[-0.04em]">Janmejoy Mahato</div>
          <div className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Frontend Developer
          </div>
        </div>
        <div className="space-y-5 pt-5">
          {["Professional Summary", "Core Skills", "Experience"].map((title, index) => (
            <div key={title}>
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-900">
                {title}
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2 rounded-full bg-slate-200" />
                <div className="h-2 w-11/12 rounded-full bg-slate-200" />
                <div className={`h-2 rounded-full ${index === 2 ? "w-8/12 bg-slate-900" : "w-7/12 bg-slate-200"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioDemo() {
  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#071120]">
      <div className="bg-[radial-gradient(circle_at_22%_0%,rgba(34,211,238,0.26),transparent_34%),linear-gradient(135deg,rgba(59,130,246,0.24),rgba(168,85,247,0.16),rgba(15,23,42,0.1))] px-6 py-8">
        <div className="inline-flex rounded-full border border-cyan-200/25 bg-cyan-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
          Portfolio Preview
        </div>
        <div className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white">
          Developer work, framed with proof.
        </div>
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-3">
        {["Project Impact", "Tech Stack", "Launch Links"].map((item, index) => (
          <motion.div
            key={item}
            className="rounded-[1.4rem] border border-white/10 bg-white/[0.055] p-4"
            animate={{ y: [0, index % 2 ? -6 : 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <CheckCircle2 className="h-5 w-5 text-cyan-200" />
            </div>
            <div className="font-semibold text-white">{item}</div>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Structured blocks that make recruiter scanning faster.
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function InterviewDemo() {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.055] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">
              Active Prompt
            </div>
            <div className="mt-2 text-xl font-semibold text-white">
              Explain how you would scale a real-time dashboard.
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10">
            <Mic className="h-5 w-5 text-emerald-200" />
          </div>
        </div>
        <div className="flex h-28 items-center gap-2 rounded-[1.4rem] border border-white/10 bg-black/20 px-5">
          {[28, 48, 36, 66, 42, 74, 38, 58, 32, 50, 70, 40].map((height, index) => (
            <motion.div
              key={index}
              className="w-full rounded-full bg-[linear-gradient(180deg,#67e8f9,#8b5cf6)]"
              animate={{ height: [`${height * 0.45}%`, `${height}%`, `${height * 0.55}%`] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: index * 0.06 }}
            />
          ))}
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.055] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10">
            <Play className="h-4 w-4 text-cyan-100" />
          </div>
          <div className="font-semibold text-white">Feedback stream</div>
        </div>
        <div className="space-y-3">
          {["Clear architecture tradeoffs", "Good latency reasoning", "Add metrics in answer"].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PreviewSection() {
  const [active, setActive] = useState<PreviewId>("resume");
  const current = previews.find((preview) => preview.id === active) ?? previews[0];
  const Icon = current.icon;

  return (
    <section id="preview" className="relative px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Live Preview
            </div>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Switch between the exact product surfaces your career depends on.
            </h2>
          </div>

          <div className="flex rounded-2xl border border-white/10 bg-white/[0.045] p-1 backdrop-blur-xl">
            {previews.map((preview) => {
              const TabIcon = preview.icon;
              const selected = preview.id === active;

              return (
                <button
                  key={preview.id}
                  type="button"
                  onClick={() => setActive(preview.id)}
                  className={`relative flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                    selected ? "text-slate-950" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {selected ? (
                    <motion.span
                      layoutId="preview-tab"
                      className="absolute inset-0 rounded-xl bg-[linear-gradient(135deg,#e0f2fe,#a78bfa,#67e8f9)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <TabIcon className="relative h-4 w-4" />
                  <span className="relative">{preview.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="relative overflow-hidden rounded-[2rem] p-px">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.65),rgba(168,85,247,0.55),rgba(16,185,129,0.35))]" />
          <div className="relative rounded-[calc(2rem-1px)] border border-white/10 bg-[#0A0F1C]/88 p-4 shadow-[0_35px_120px_rgba(2,8,23,0.55)] backdrop-blur-2xl sm:p-6">
            <div className="mb-6 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#38bdf8,#8b5cf6,#22d3ee)]">
                  <Icon className="h-5 w-5 text-slate-950" />
                </div>
                <div className="mt-6 text-xs uppercase tracking-[0.28em] text-cyan-200">
                  {current.eyebrow}
                </div>
                <div className="mt-2 text-5xl font-semibold tracking-[-0.06em] text-white">
                  {current.score}
                </div>
                <div className="mt-5 text-lg font-semibold text-white">{current.title}</div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{current.description}</p>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={false}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                  transition={{ duration: 0.32 }}
                >
                  {active === "resume" ? <ResumeDemo /> : null}
                  {active === "portfolio" ? <PortfolioDemo /> : null}
                  {active === "interview" ? <InterviewDemo /> : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
