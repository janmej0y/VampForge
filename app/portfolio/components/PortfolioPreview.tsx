"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  portfolioCompletion,
  projectCaseStudy,
  sectionNavigation,
  templateIdentity,
  templateSectionNavigation,
} from "./intelligence";
import { type PortfolioData } from "./types";
import { AboutSection } from "./sections/about-section";
import { AchievementsSection } from "./sections/achievements-section";
import { ContactSection } from "./sections/contact-section";
import { EducationSection } from "./sections/education-section";
import { ExperienceSection } from "./sections/experience-section";
import { FooterSection } from "./sections/footer-section";
import { HeroSection } from "./sections/hero-section";
import { PortfolioNavbar } from "./sections/portfolio-navbar";
import { ProjectsSection } from "./sections/projects-section";
import { SkillsSection } from "./sections/skills-section";
import { TerminalMatrixCanvas } from "./TerminalMatrixCanvas";

const OrbitThreeScene = dynamic(
  () => import("./OrbitThreeScene").then((module) => module.OrbitThreeScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(103,232,249,0.14),transparent_55%)]" />
    ),
  }
);

type PortfolioPreviewProps = {
  data: PortfolioData;
};

type CursorVariant = "nova" | "orbit" | "terminal";

function CreativeCursor({
  variant,
  children,
  className = "",
}: {
  variant: CursorVariant;
  children: React.ReactNode;
  className?: string;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const cursorClassName =
    variant === "orbit"
      ? "h-16 w-16 rounded-full border border-cyan-200/60 bg-cyan-300/10 shadow-[0_0_42px_rgba(103,232,249,0.34)]"
      : variant === "terminal"
        ? "h-7 w-4 rounded-sm border border-emerald-200/70 bg-emerald-300/25 shadow-[0_0_28px_rgba(110,231,183,0.42)]"
        : "h-12 w-12 rounded-full border border-amber-200/50 bg-cyan-200/10 shadow-[0_0_34px_rgba(34,211,238,0.26)]";

  return (
    <div
      className={`group/cursor relative cursor-none ${className}`}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        setVisible(true);
      }}
      onPointerLeave={() => setVisible(false)}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 z-50 hidden -translate-x-1/2 -translate-y-1/2 mix-blend-screen transition-opacity duration-200 lg:block ${cursorClassName}`}
        animate={{
          x: position.x,
          y: position.y,
          opacity: visible ? 1 : 0,
          scale: visible ? 1 : 0.75,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.6 }}
      >
        {variant === "nova" ? (
          <motion.span
            className="absolute left-1/2 top-1/2 h-px w-24 origin-left bg-[linear-gradient(90deg,rgba(103,232,249,0.8),transparent)]"
            animate={{ rotate: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
        {variant === "orbit" ? (
          <motion.span
            className="absolute inset-[-10px] rounded-full border border-violet-200/30"
            animate={{ rotate: 360, scale: [1, 1.14, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
        {variant === "terminal" ? (
          <motion.span
            className="absolute -bottom-5 left-1/2 h-8 w-px bg-emerald-200/60"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}

function TemplatePreviewShell({
  data,
  title,
  description,
  variant,
  children,
}: {
  data: PortfolioData;
  title: string;
  description: string;
  variant: CursorVariant;
  children: React.ReactNode;
}) {
  const completion = portfolioCompletion(data);

  return (
    <section className="min-w-0 fade-in-up delay-1">
      <div className="mb-3 flex min-w-0 flex-col justify-between gap-3 px-1 lg:flex-row lg:items-end">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{title}</div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          <Badge variant="secondary">{data.template}</Badge>
          <Badge variant="secondary">Cursor FX</Badge>
          <Badge variant="secondary">{completion}% complete</Badge>
        </div>
      </div>
      <CreativeCursor variant={variant}>{children}</CreativeCursor>
    </section>
  );
}

function OrbitPortfolioPreview({ data }: { data: PortfolioData }) {
  const projects = data.projects.filter((project) => project.name || project.description).slice(0, 3);
  const skills = data.skills.slice(0, 12);
  const identity = templateIdentity("orbit");
  const sections = templateSectionNavigation("orbit");
  const initials = (data.name || "VF")
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <TemplatePreviewShell
      data={data}
      variant="orbit"
      title="Live Portfolio Preview"
      description="Orbit Motion template with 3D constellation, floating proof cards, orbital motion, and cinematic case-study visuals."
    >
      <div className="relative max-h-[min(1040px,calc(100vh-7rem))] overflow-auto rounded-2xl bg-[#050713] text-white">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full border border-cyan-300/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="pointer-events-none absolute right-8 top-40 h-52 w-52 rounded-full border border-violet-300/20"
          animate={{ rotate: -360, scale: [1, 1.08, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(103,232,249,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_26%),linear-gradient(180deg,#050713,#090d1f_55%,#050713)]" />
        <motion.div
          className="pointer-events-none absolute left-[18%] top-[20%] h-24 w-24 rounded-full bg-cyan-300/20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -26, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative space-y-12 p-6 sm:p-8">
          <nav className="sticky top-4 z-20 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-3 backdrop-blur-xl">
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-semibold text-slate-200"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <section id="home" className="grid min-h-[520px] items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
            <div>
              <motion.div
                className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100"
                animate={{ boxShadow: ["0 0 0 rgba(103,232,249,0)", "0 0 34px rgba(103,232,249,0.22)", "0 0 0 rgba(103,232,249,0)"] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {identity.concept}
              </motion.div>
              <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">
                {data.name || "Your Name"}
              </h1>
              <p className="mt-4 text-xl text-cyan-100">{data.title || "Developer Portfolio"}</p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">{data.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="rounded-2xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950" href={data.contact.resumeLink || "#"}>Resume</a>
                <a className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white" href={data.socialLinks.github || "#"}>GitHub</a>
              </div>
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035]">
              <OrbitThreeScene skills={skills} />
              <motion.div
                className="absolute inset-6 rounded-full border border-dashed border-cyan-300/25"
                animate={{ rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute left-1/2 top-1/2 flex h-64 w-64 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[3rem] border border-white/10 bg-white/[0.06] text-6xl font-black text-cyan-100 shadow-[0_30px_100px_rgba(34,211,238,0.18)] backdrop-blur-xl"
                animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                {data.profileImage ? (
                  <span
                    aria-hidden="true"
                    className="h-full w-full rounded-[3rem] bg-cover bg-top"
                    style={{
                      backgroundImage: `url(${data.profileImage})`,
                      backgroundPosition: `50% ${data.profileImagePosition}%`,
                    }}
                  />
                ) : (
                  initials
                )}
              </motion.div>
              {["Portfolio", "Resume", "Interview"].map((item, index) => (
                <motion.div
                  key={item}
                  className="absolute rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white backdrop-blur-xl"
                  style={{ left: `${index * 28 + 4}%`, top: `${index % 2 ? 12 : 72}%` }}
                  animate={{ y: [0, index % 2 ? 12 : -12, 0] }}
                  transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </section>

          <section id="projects" className="grid gap-4 md:grid-cols-3">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl"
                whileHover={{ y: -8, rotate: index % 2 ? 1.5 : -1.5 }}
              >
                <div className="relative h-36 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(103,232,249,0.26),rgba(168,85,247,0.18))]">
                  {project.imageUrl ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${project.imageUrl})` }}
                    />
                  ) : null}
                  <motion.div
                    className="absolute inset-y-0 w-16 bg-white/20 blur-xl"
                    animate={{ x: [-90, 360, -90] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{project.name || "Featured Project"}</h3>
                <p className="mt-3 line-clamp-2-safe text-sm leading-6 text-slate-300">{project.description}</p>
                <div className="mt-4 grid gap-2 text-xs text-slate-300">
                  <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                    <span className="text-cyan-200">Problem:</span> {projectCaseStudy(project, index).problem}
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3">
                    <span className="text-amber-200">Impact:</span> {projectCaseStudy(project, index).impact}
                  </div>
                </div>
              </motion.article>
            ))}
          </section>

          <section id="skills" className="flex flex-wrap gap-3 pb-8">
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm text-slate-200"
                animate={{ y: [0, index % 2 ? -5 : 5, 0] }}
                transition={{ duration: 4 + index * 0.15, repeat: Infinity, ease: "easeInOut" }}
              >
                {skill}
              </motion.span>
            ))}
          </section>
        </div>
      </div>
    </TemplatePreviewShell>
  );
}

function TerminalPortfolioPreview({ data }: { data: PortfolioData }) {
  const projects = data.projects.filter((project) => project.name || project.description).slice(0, 4);
  const sections = templateSectionNavigation("terminal");
  const identity = templateIdentity("terminal");
  const initials = (data.name || "VF")
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const commands = [
    `whoami -> ${data.name || "developer"}`,
    `role -> ${data.title || "full-stack engineer"}`,
    `skills -> ${data.skills.slice(0, 5).join(", ") || "next.js, typescript"}`,
  ];

  return (
    <TemplatePreviewShell
      data={data}
      variant="terminal"
      title="Live Portfolio Preview"
      description="Terminal Neon template with boot sequence, command-line text, scanlines, glow cursor, and matrix ambience."
    >
      <div className="relative max-h-[min(1040px,calc(100vh-7rem))] overflow-auto rounded-2xl bg-[#02070a] font-mono text-emerald-100">
        <TerminalMatrixCanvas />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:100%_4px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_8%,rgba(16,185,129,0.2),transparent_30%),radial-gradient(circle_at_80%_14%,rgba(34,211,238,0.16),transparent_26%)]" />
        <motion.div
          className="pointer-events-none absolute left-8 top-8 h-4 w-4 rounded-full bg-emerald-300 shadow-[0_0_40px_rgba(110,231,183,0.9)]"
          animate={{ x: [0, 220, 80, 360, 0], y: [0, 80, 260, 420, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative space-y-8 p-5 sm:p-8">
          <div className="rounded-2xl border border-emerald-300/20 bg-black/40 p-4">
            <div className="flex flex-wrap gap-2">
              {sections.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-100"
                >
                  /{item.label}
                </a>
              ))}
            </div>
          </div>
          <section id="home" className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/[0.035] p-5 shadow-[0_0_80px_rgba(16,185,129,0.1)]">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-300" />
            </div>
            <div className="mt-8 space-y-3">
              {commands.map((command, index) => (
                <motion.div
                  key={command}
                  className="text-sm text-emerald-200"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.16 }}
                >
                  <span className="text-cyan-200">$</span> {command}
                </motion.div>
              ))}
            </div>
            <div className="mt-6 grid gap-2 text-xs text-emerald-100/80 sm:grid-cols-3">
              {["boot portfolio.kernel", `load ${identity.concept}`, "status online"].map((line, index) => (
                <motion.div
                  key={line}
                  className="rounded-xl border border-emerald-300/15 bg-black/35 px-3 py-2"
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 2.4, delay: index * 0.24, repeat: Infinity }}
                >
                  {line}
                </motion.div>
              ))}
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.42fr)] lg:items-center">
              <div>
                <h1 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">
                  {data.name || "Your Name"}<motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }}>_</motion.span>
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-emerald-100/75">{data.summary}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a className="rounded-xl border border-emerald-300/30 bg-emerald-300/15 px-5 py-3 text-sm font-bold text-emerald-100 shadow-[0_0_28px_rgba(16,185,129,0.16)]" href={data.contact.resumeLink || "#"}>./download-resume</a>
                  <a className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100" href={data.socialLinks.github || "#"}>git remote</a>
                </div>
              </div>
              <motion.div
                className="relative min-h-[300px] overflow-hidden rounded-[1.6rem] border border-emerald-300/20 bg-emerald-300/[0.045] shadow-[0_0_70px_rgba(16,185,129,0.14)]"
                animate={{ boxShadow: ["0 0 40px rgba(16,185,129,0.08)", "0 0 90px rgba(16,185,129,0.2)", "0 0 40px rgba(16,185,129,0.08)"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute left-0 right-0 top-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(110,231,183,0.18),transparent)]"
                  animate={{ y: [-90, 320, -90] }}
                  transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
                />
                {data.profileImage ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-8 rounded-2xl border border-white/10 bg-cover bg-top"
                    style={{
                      backgroundImage: `url(${data.profileImage})`,
                      backgroundPosition: `50% ${data.profileImagePosition}%`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-8 grid place-items-center rounded-2xl border border-white/10 bg-black/40 text-5xl font-black text-cyan-200">
                    {initials}
                  </div>
                )}
              </motion.div>
            </div>
          </section>

          <section id="projects" className="grid gap-4 md:grid-cols-2">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                className="rounded-[1.6rem] border border-emerald-300/16 bg-black/35 p-5"
                whileHover={{ x: 6, borderColor: "rgba(110,231,183,0.45)" }}
              >
                <div className="text-xs uppercase tracking-[0.24em] text-cyan-200">repo 0{index + 1}</div>
                <h3 className="mt-3 text-xl font-bold text-white">{project.name || "Project"}</h3>
                <p className="mt-3 line-clamp-2-safe text-sm leading-6 text-emerald-100/70">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span key={tech} className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-xs">{tech}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </section>
        </div>
      </div>
    </TemplatePreviewShell>
  );
}

export function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const sections = useMemo(() => sectionNavigation(), []);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTopRef = useRef(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;
      const nearTop = currentScrollTop < 36;
      const movingUp = currentScrollTop < lastScrollTopRef.current;

      setScrolled(currentScrollTop > 24);
      setNavbarVisible(nearTop || movingUp);
      lastScrollTopRef.current = currentScrollTop;
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sectionElements = sections
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        root: container,
        threshold: [0.2, 0.35, 0.6],
      }
    );

    sectionElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  const navigateToSection = (id: string) => {
    setMobileOpen(false);
    setNavbarVisible(true);
    const element = document.getElementById(id);
    const container = containerRef.current;

    if (!element || !container) return;

    const offsetTop = Math.max(0, element.offsetTop - 116);
    container.scrollTo({ top: offsetTop, behavior: "smooth" });
  };

  const surface =
    theme === "dark"
      ? "bg-[linear-gradient(180deg,#050b15,#091120,#071322)] text-white"
      : "bg-[linear-gradient(180deg,#f5f9ff,#f8fafc,#eef6ff)] text-slate-900";

  if (data.template === "orbit") {
    return <OrbitPortfolioPreview data={data} />;
  }

  if (data.template === "terminal") {
    return <TerminalPortfolioPreview data={data} />;
  }

  return (
    <TemplatePreviewShell
      data={data}
      variant="nova"
      title="Live Portfolio Preview"
      description="Nova SaaS keeps the open product-page structure, richer animated sections, and a sliding cyan/amber cursor trail."
    >
        <div
          ref={containerRef}
          className={`relative max-h-[min(1040px,calc(100vh-7rem))] w-full max-w-full overflow-auto rounded-2xl transition-colors duration-500 ${surface}`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_24%)]" />
          <div className="pointer-events-none absolute inset-0 bg-grid bg-[size:72px_72px] opacity-[0.06]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent)]" />
          <motion.div
            aria-hidden="true"
            animate={{ x: [0, 18, 0], y: [0, -14, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="pointer-events-none absolute left-0 top-16 h-56 w-56 -translate-x-1/3 rounded-full bg-cyan-400/14 blur-3xl"
          />
          <motion.div
            aria-hidden="true"
            animate={{ x: [0, -20, 0], y: [0, 16, 0], scale: [1.02, 0.96, 1.02] }}
            transition={{ duration: 17, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="pointer-events-none absolute right-0 top-40 h-64 w-64 translate-x-1/3 rounded-full bg-amber-300/12 blur-3xl"
          />
          <motion.div
            aria-hidden="true"
            animate={{ y: [0, -12, 0], x: [0, 10, 0] }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="pointer-events-none absolute bottom-8 left-1/3 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl"
          />

          <div className="relative mx-auto w-full max-w-[1260px] pb-12">
            <PortfolioNavbar
              items={sections}
              activeSection={activeSection}
              theme={theme}
              mobileOpen={mobileOpen}
              scrolled={scrolled}
              navbarVisible={navbarVisible}
              socialLinks={data.socialLinks}
              resumeLink={data.contact.resumeLink}
              brandName={data.name || "Your Name"}
              brandTitle={data.title || "Developer Portfolio"}
              onToggleTheme={() =>
                setTheme((current) => (current === "dark" ? "light" : "dark"))
              }
              onToggleMobile={() => setMobileOpen((value) => !value)}
              onNavigate={navigateToSection}
            />

            <HeroSection data={data} theme={theme} onNavigate={navigateToSection} />
            <AboutSection data={data} theme={theme} />
            <SkillsSection data={data} theme={theme} />
            <ProjectsSection data={data} theme={theme} />
            <ExperienceSection data={data} theme={theme} />
            <EducationSection data={data} theme={theme} />
            <AchievementsSection data={data} theme={theme} />
            <ContactSection data={data} theme={theme} />
            <FooterSection data={data} theme={theme} onNavigate={navigateToSection} />
          </div>
        </div>
    </TemplatePreviewShell>
  );
}
