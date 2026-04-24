"use client";

import { ArrowRight, Download, Mail, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { type PortfolioData } from "../types";
import { portfolioStats } from "../intelligence";

type HeroSectionProps = {
  data: PortfolioData;
  theme: "dark" | "light";
  onNavigate: (id: string) => void;
};

export function HeroSection({ data, theme, onNavigate }: HeroSectionProps) {
  const stats = portfolioStats(data).slice(0, 4);
  const topSkills = data.skills.slice(0, 5);
  const quickSignals = [
    data.contact.location || "Remote-ready",
    data.contact.website ? "Public portfolio linked" : "Portfolio link pending",
    data.contact.resumeLink ? "Resume available" : "Resume link pending",
  ];
  const initials = (data.name || "VF")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section id="home" className="relative scroll-mt-32 px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
      <div
        className={`relative overflow-hidden rounded-[2.35rem] border px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 ${
          theme === "dark"
            ? "border-white/10 bg-[linear-gradient(140deg,rgba(6,11,23,0.98),rgba(15,23,42,0.94),rgba(8,47,73,0.82),rgba(120,53,15,0.34))] shadow-[0_30px_90px_rgba(2,6,23,0.35)]"
            : "border-slate-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.97),rgba(224,242,254,0.86))] shadow-[0_24px_64px_rgba(148,163,184,0.18)]"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.18),transparent_26%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.58),transparent)]" />
        <motion.div
          aria-hidden="true"
          animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="pointer-events-none absolute left-0 top-10 h-44 w-44 -translate-x-1/3 rounded-full bg-cyan-400/12 blur-3xl"
        />
        <motion.div
          aria-hidden="true"
          animate={{ x: [0, -20, 0], y: [0, 14, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="pointer-events-none absolute right-0 top-24 h-52 w-52 rounded-full bg-amber-300/14 blur-3xl"
        />

        <div className="relative grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${
                theme === "dark"
                  ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                  : "border-cyan-600/10 bg-cyan-100 text-cyan-800"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Personal portfolio
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >
              <div className="mb-4 flex flex-wrap gap-2">
                {quickSignals.map((signal) => (
                  <span
                    key={signal}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                      theme === "dark"
                        ? "border border-white/10 bg-white/[0.06] text-slate-200"
                        : "border border-slate-200 bg-white/80 text-slate-700"
                    }`}
                  >
                    {signal}
                  </span>
                ))}
              </div>

              <h1
                className={`max-w-4xl text-4xl font-semibold tracking-[-0.06em] sm:text-5xl xl:text-[4.5rem] xl:leading-[0.94] ${
                  theme === "dark"
                    ? "bg-[linear-gradient(120deg,#f8fbff_0%,#b9f3ff_34%,#fcd889_100%)] bg-clip-text text-transparent"
                    : "text-slate-950"
                }`}
              >
                {data.name || "Your Name"}
              </h1>
              <p
                className={`mt-5 max-w-3xl text-xl ${
                  theme === "dark" ? "text-cyan-100/90" : "text-slate-700"
                }`}
              >
                {data.title || "Full Stack Developer"}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className={`max-w-2xl text-sm leading-8 sm:text-base ${
                theme === "dark" ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {data.summary || data.about}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="flex flex-wrap gap-3"
            >
              <button
                type="button"
                onClick={() => onNavigate("projects")}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  theme === "dark"
                    ? "bg-[linear-gradient(120deg,#f8fbff,#b9f3ff,#fcd889)] text-slate-950 shadow-[0_18px_40px_rgba(34,211,238,0.18)] hover:brightness-105"
                    : "bg-slate-950 text-white hover:bg-slate-800"
                }`}
              >
                View Projects
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={data.contact.resumeLink || "#"}
                target={data.contact.resumeLink ? "_blank" : undefined}
                rel={data.contact.resumeLink ? "noreferrer" : undefined}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  theme === "dark"
                    ? "border border-white/10 bg-white/10 text-white hover:bg-white/15"
                    : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
              <button
                type="button"
                onClick={() => onNavigate("contact")}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  theme === "dark"
                    ? "border border-cyan-300/20 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15"
                    : "border border-cyan-200 bg-cyan-50 text-cyan-900 hover:bg-cyan-100"
                }`}
              >
                <Mail className="h-4 w-4" />
                Contact Me
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="grid gap-3 sm:grid-cols-3"
            >
              {[
                ["Premium UI", "Feels closer to a startup landing page than a basic portfolio."],
                ["Fast Scan", "Hiring teams can understand the strongest signals quickly."],
                ["Trust Signals", "Projects, links, and contact actions stay easy to reach."],
              ].map(([label, copy]) => (
                <div
                  key={label}
                  className={`rounded-[1.5rem] border px-4 py-4 ${
                    theme === "dark"
                      ? "border-white/10 bg-white/[0.05]"
                      : "border-slate-200 bg-white/90"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs uppercase tracking-[0.22em] ${
                      theme === "dark" ? "text-cyan-200/70" : "text-slate-500"
                    }`}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {label}
                  </div>
                  <p
                    className={`mt-3 text-sm leading-7 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {copy}
                  </p>
                </div>
              ))}
            </motion.div>

            {topSkills.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.28 }}
                className={`rounded-[1.7rem] border px-5 py-5 ${
                  theme === "dark"
                    ? "border-white/10 bg-white/[0.05]"
                    : "border-slate-200 bg-white/90"
                }`}
              >
                <div
                  className={`text-xs uppercase tracking-[0.24em] ${
                    theme === "dark" ? "text-cyan-200/70" : "text-slate-500"
                  }`}
                >
                  Trusted Stack
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {topSkills.map((skill) => (
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
              </motion.div>
            ) : null}
          </div>

          <div className="relative">
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 0.3, 0] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className={`rounded-[2rem] border p-5 ${
                theme === "dark"
                  ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))]"
                  : "border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))]"
              }`}
            >
              <div className="grid gap-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div
                      className={`text-xs uppercase tracking-[0.28em] ${
                        theme === "dark" ? "text-cyan-200/70" : "text-slate-500"
                      }`}
                    >
                      Signature Snapshot
                    </div>
                    <div
                      className={`mt-2 text-2xl font-semibold ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Product-minded builder
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                      theme === "dark"
                        ? "border border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                        : "border border-cyan-200 bg-cyan-50 text-cyan-900"
                    }`}
                  >
                    {data.contact.resumeLink ? "Resume ready" : "Portfolio first"}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className={`absolute inset-[-10px] rounded-[2rem] border border-dashed ${
                        theme === "dark" ? "border-cyan-300/25" : "border-cyan-300/35"
                      }`}
                    />
                    {data.profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={data.profileImage}
                        alt={data.name || "Profile"}
                        className="relative h-32 w-28 rounded-[1.8rem] object-cover shadow-[0_22px_50px_rgba(2,6,23,0.28)]"
                        style={{ objectPosition: `50% ${data.profileImagePosition}%` }}
                      />
                    ) : (
                      <div className="relative flex h-32 w-28 items-center justify-center rounded-[1.8rem] bg-gradient-to-br from-cyan-300 to-amber-300 text-3xl font-semibold text-slate-950 shadow-[0_22px_50px_rgba(2,6,23,0.18)]">
                        {initials}
                      </div>
                    )}
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      className={`absolute right-0 top-3 translate-x-1 rounded-full border px-3 py-1 text-[11px] font-medium ${
                        theme === "dark"
                          ? "border-white/10 bg-slate-950/80 text-slate-200"
                          : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      Available
                    </motion.div>
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-sm uppercase tracking-[0.28em] ${
                        theme === "dark" ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      First impression
                    </div>
                    <div
                      className={`mt-2 text-xl font-semibold ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Selected highlights
                    </div>
                    <div
                      className={`mt-2 text-sm leading-7 ${
                        theme === "dark" ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      Clear product thinking, polished frontend craft, and recruiter-ready presentation.
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className={`rounded-[1.3rem] border px-4 py-4 ${
                        theme === "dark"
                          ? "border-white/10 bg-slate-950/40"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div
                        className={`text-xs uppercase tracking-[0.2em] ${
                          theme === "dark" ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {stat.label}
                      </div>
                      <div
                        className={`mt-2 text-2xl font-semibold ${
                          theme === "dark" ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {stat.value}
                      </div>
                      <div
                        className={`mt-1 text-xs ${
                          theme === "dark" ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Stronger proof point for quick portfolio scanning.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className={`relative mt-4 rounded-[1.4rem] border px-4 py-4 shadow-[0_20px_50px_rgba(2,6,23,0.18)] lg:absolute lg:bottom-4 lg:left-4 lg:mt-0 ${
                theme === "dark"
                  ? "border-white/10 bg-slate-950/75"
                  : "border-slate-200 bg-white/95"
              }`}
            >
              <div
                className={`text-xs uppercase tracking-[0.24em] ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Core Skills
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.skills.slice(0, 6).map((skill) => (
                  <span
                    key={skill}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      theme === "dark"
                        ? "bg-cyan-300/10 text-cyan-100"
                        : "bg-cyan-50 text-cyan-900"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
