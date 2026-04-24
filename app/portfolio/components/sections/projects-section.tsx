"use client";

import { useState } from "react";
import { ArrowUpRight, Code2, Maximize2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { projectCaseStudy, splitPortfolioLines } from "../intelligence";
import { type PortfolioData } from "../types";
import { InteractiveTiltCard } from "./interactive-tilt-card";
import { SectionHeading } from "./section-heading";

type ProjectsSectionProps = {
  data: PortfolioData;
  theme: "dark" | "light";
};

export function ProjectsSection({ data, theme }: ProjectsSectionProps) {
  const projects = data.projects.filter((project) => project.name || project.description);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const activeProject = projects.find((project) => project.id === activeProjectId);

  return (
    <section id="projects" className="scroll-mt-32 px-4 py-8 sm:px-6">
      <SectionHeading
        eyebrow="Projects"
        title="Premium project cards with visual polish and motion"
        description="These cards feel closer to modern SaaS case studies than a basic portfolio grid, with image support, tilt behavior, and stronger link presentation."
        theme={theme}
      />
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        {projects.map((project, index) => {
          const caseStudy = projectCaseStudy(project, index);

          return (
          <InteractiveTiltCard
            key={project.id}
            className={`relative overflow-hidden rounded-[1.8rem] border ${
              theme === "dark"
                ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))]"
                : "border-slate-200 bg-white/95"
            } ${index === 0 ? "xl:col-span-2" : ""}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <div className="group relative overflow-hidden">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.imageUrl}
                    alt={project.name || "Project image"}
                    className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                      index === 0 ? "h-72" : "h-56"
                    }`}
                  />
                ) : (
                  <div
                    className={`w-full bg-[linear-gradient(135deg,rgba(34,211,238,0.35),rgba(251,191,36,0.2),rgba(15,23,42,0.4))] ${
                      index === 0 ? "h-72" : "h-56"
                    }`}
                  />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.16))]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] translate-x-[-120%] group-hover:translate-x-[120%] transition duration-1000" />
                <div className="absolute left-5 top-5 rounded-full bg-slate-950/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur">
                  Project {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className={`text-xs uppercase tracking-[0.24em] ${theme === "dark" ? "text-cyan-200/70" : "text-slate-500"}`}>
                      {index === 0 ? "Flagship Build" : "Featured Build"}
                    </div>
                    <h3 className={`mt-2 text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                      {project.name || "Untitled Project"}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.githubLink ? (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium ${
                          theme === "dark"
                            ? "border border-white/10 bg-slate-950/60 text-slate-200"
                            : "border border-slate-200 bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Code2 className="h-3.5 w-3.5" />
                        GitHub
                      </a>
                    ) : null}
                    {project.liveLink ? (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium ${
                          theme === "dark"
                            ? "border border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                            : "border border-cyan-200 bg-cyan-50 text-cyan-900"
                        }`}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Live Demo
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {splitPortfolioLines(project.description).map((line) => (
                    <p
                      key={line}
                      className={`text-sm leading-7 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      theme === "dark"
                        ? "bg-white/8 text-slate-200"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {project.techStack.length} tech signals
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      theme === "dark"
                        ? "bg-white/8 text-slate-200"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {project.liveLink ? "Live experience available" : "Concept preview"}
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      theme === "dark"
                        ? "bg-cyan-300/10 text-cyan-100"
                        : "bg-cyan-50 text-cyan-900"
                    }`}
                  >
                    {caseStudy.impact} impact signal
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <motion.span
                      key={`${project.id}-${tech}`}
                      whileHover={{ y: -2 }}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        theme === "dark"
                          ? "bg-white/10 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveProjectId(project.id)}
                  className={`mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    theme === "dark"
                      ? "border border-white/10 bg-white/10 text-white hover:bg-white/15"
                      : "border border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  <Maximize2 className="h-4 w-4" />
                  Open Case Study
                </button>
              </div>
            </motion.div>
          </InteractiveTiltCard>
          );
        })}
      </div>

      <AnimatePresence>
        {activeProject ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/78 px-4 py-6 backdrop-blur-md sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProjectId(null)}
          >
            <motion.div
              className={`relative my-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border shadow-[0_34px_110px_rgba(2,6,23,0.45)] ${
                theme === "dark"
                  ? "border-white/10 bg-[linear-gradient(180deg,#07111f,#0b1220)] text-white"
                  : "border-slate-200 bg-white text-slate-950"
              }`}
              initial={{ y: 30, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close case study"
                onClick={() => setActiveProjectId(null)}
                className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-slate-950/60 p-2 text-white backdrop-blur transition hover:bg-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="relative min-h-[300px] overflow-hidden bg-slate-950">
                  {activeProject.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activeProject.imageUrl}
                      alt={activeProject.name || "Project image"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.35),rgba(251,191,36,0.22),rgba(15,23,42,0.6))]" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.74))]" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
                      Case Study
                    </div>
                    <h3 className="mt-2 text-3xl font-semibold text-white">
                      {activeProject.name || "Untitled Project"}
                    </h3>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  {[
                    ["Problem", projectCaseStudy(activeProject, 0).problem],
                    ["Solution", projectCaseStudy(activeProject, 0).solution],
                    ["Result", projectCaseStudy(activeProject, 0).result],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-white/10 py-5 first:pt-0">
                      <div className={`text-xs font-semibold uppercase tracking-[0.24em] ${theme === "dark" ? "text-cyan-200" : "text-cyan-700"}`}>
                        {label}
                      </div>
                      <p className={`mt-2 text-sm leading-7 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                        {value}
                      </p>
                    </div>
                  ))}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {activeProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          theme === "dark"
                            ? "bg-white/10 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
