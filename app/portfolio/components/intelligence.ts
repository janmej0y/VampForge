import {
  BriefcaseBusiness,
  Database,
  Layers3,
  type LucideIcon,
  MonitorSmartphone,
  Wrench,
} from "lucide-react";
import { type PortfolioData, type Project } from "./types";

export type SkillCategory = {
  title: "Frontend" | "Backend" | "Database" | "Tools";
  icon: LucideIcon;
  skills: string[];
  progress: number;
};

const skillBuckets: Array<{
  title: SkillCategory["title"];
  icon: LucideIcon;
  matchers: RegExp[];
}> = [
  {
    title: "Frontend",
    icon: MonitorSmartphone,
    matchers: [/react/i, /next/i, /tailwind/i, /css/i, /html/i, /ui/i, /frontend/i, /typescript/i, /javascript/i],
  },
  {
    title: "Backend",
    icon: BriefcaseBusiness,
    matchers: [/node/i, /express/i, /api/i, /graphql/i, /auth/i, /backend/i, /server/i, /openai/i],
  },
  {
    title: "Database",
    icon: Database,
    matchers: [/postgres/i, /mysql/i, /mongodb/i, /redis/i, /prisma/i, /database/i, /sql/i, /supabase/i],
  },
  {
    title: "Tools",
    icon: Wrench,
    matchers: [/git/i, /docker/i, /vercel/i, /aws/i, /figma/i, /framer/i, /jest/i, /playwright/i],
  },
];

function trimLine(value: string) {
  return value.replace(/^[\s\u2022\-–—]+/, "").replace(/\s+/g, " ").trim();
}

export function splitPortfolioLines(value: string) {
  return value.split(/\n+/).map(trimLine).filter(Boolean);
}

export function categorizePortfolioSkills(skills: string[]): SkillCategory[] {
  const mapped = skillBuckets.map((bucket) => ({
    title: bucket.title,
    icon: bucket.icon,
    skills: skills.filter((skill) =>
      bucket.matchers.some((matcher) => matcher.test(skill))
    ),
  }));

  const used = new Set(mapped.flatMap((bucket) => bucket.skills));
  const toolBucket = mapped.find((bucket) => bucket.title === "Tools");
  if (toolBucket) {
    toolBucket.skills = [...toolBucket.skills, ...skills.filter((skill) => !used.has(skill))];
  }

  return mapped
    .map((bucket) => ({
      ...bucket,
      progress: Math.min(98, Math.max(42, bucket.skills.length * 18 + 28)),
    }))
    .filter((bucket) => bucket.skills.length > 0);
}

export function generatePortfolioSummary(data: PortfolioData) {
  const categories = categorizePortfolioSkills(data.skills)
    .slice(0, 2)
    .map((bucket) => bucket.title.toLowerCase());
  const projects = data.projects.filter((project) => project.name || project.description).length;
  const stack = data.skills.slice(0, 5).join(", ");

  return [
    `${data.title || "Full Stack Developer"} crafting polished digital products with a strong focus on ${categories.join(" and ") || "modern product engineering"}.`,
    stack
      ? `Builds high-trust interfaces and launch-ready systems using ${stack}, with an eye for performance, product clarity, and polished user experience.`
      : "Builds high-trust interfaces and launch-ready systems with an eye for performance, product clarity, and polished user experience.",
    projects > 0
      ? `Known for translating complex workflows into memorable experiences across ${projects} featured product builds and collaborative delivery environments.`
      : "Known for translating complex workflows into memorable experiences and clean, premium presentations.",
  ].join(" ");
}

export function enhanceProjectDescription(project: Project) {
  const lines = splitPortfolioLines(project.description);

  if (lines.length === 0) {
    return "Designed and shipped a polished digital product experience focused on usability, delivery quality, and technical clarity.";
  }

  return lines
    .map((line) => {
      const lower = line.toLowerCase();
      if (/\b(improved|increased|reduced|optimized|launched|delivered|built|designed)\b/.test(lower)) {
        return line.charAt(0).toUpperCase() + line.slice(1);
      }

      if (/dashboard|analytics|workflow/.test(lower)) {
        return `Built ${line} with a focus on product clarity, faster decision-making, and launch-ready user experience.`;
      }

      if (/portfolio|resume|website|landing/.test(lower)) {
        return `Designed ${line} to strengthen brand presence, improve credibility, and create a premium first impression.`;
      }

      return `Developed ${line} with polished UX, scalable implementation, and clear product storytelling.`;
    })
    .join("\n");
}

export function portfolioCompletion(data: PortfolioData) {
  const checkpoints = [
    data.name,
    data.title,
    data.summary,
    data.about,
    data.skills.length > 0 ? "skills" : "",
    data.projects.some((project) => project.name || project.description) ? "projects" : "",
    data.experience.some((item) => item.company || item.role || item.description) ? "experience" : "",
    data.education.some((item) => item.degree || item.institution) ? "education" : "",
    data.contact.email,
    data.contact.resumeLink,
    data.socialLinks.github,
    data.socialLinks.linkedin,
  ];

  return Math.round((checkpoints.filter(Boolean).length / checkpoints.length) * 100);
}

export function portfolioStats(data: PortfolioData) {
  const projectCount = data.projects.filter((project) => project.name || project.description).length;
  const experienceCount = data.experience.filter((item) => item.company || item.role).length;
  const achievementCount = data.achievements.filter((item) => item.title || item.description).length;

  return [
    { label: "Projects", value: String(projectCount).padStart(2, "0") },
    { label: "Experience", value: experienceCount > 0 ? `${experienceCount}+` : "00" },
    { label: "Technologies", value: `${data.skills.length}+` },
    { label: "Clients", value: data.clientCount || "08" },
    { label: "Achievements", value: achievementCount > 0 ? `${achievementCount}+` : "00" },
    { label: "Profiles", value: `${Object.values(data.socialLinks).filter(Boolean).length}` },
  ];
}

export function sectionNavigation() {
  return [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "achievements", label: "Achievements" },
    { id: "contact", label: "Contact" },
  ] as const;
}

export function templateSectionNavigation(template: PortfolioData["template"]) {
  if (template === "orbit") {
    return [
      { id: "home", label: "Launch" },
      { id: "skills", label: "Constellation" },
      { id: "projects", label: "Galaxy" },
      { id: "about", label: "Mission" },
      { id: "experience", label: "Orbit Log" },
      { id: "contact", label: "Portal" },
    ] as const;
  }

  if (template === "terminal") {
    return [
      { id: "home", label: "Boot" },
      { id: "about", label: "cat profile" },
      { id: "projects", label: "git log" },
      { id: "skills", label: "ls skills" },
      { id: "experience", label: "history" },
      { id: "contact", label: "ssh" },
    ] as const;
  }

  return sectionNavigation();
}

export function projectCaseStudy(project: Project, index: number) {
  const lines = splitPortfolioLines(project.description);
  const firstLine = lines[0] || "A polished product build focused on clarity and execution.";
  const secondLine = lines[1] || "Designed for stronger user trust, cleaner workflows, and faster delivery.";
  const primaryTech = project.techStack[0] || "Product UI";

  return {
    problem: firstLine,
    solution: secondLine,
    result: project.liveLink
      ? "Live product proof with deployable recruiter-facing credibility."
      : "Portfolio-ready case study with clear technical storytelling.",
    impact: `${Math.max(24, project.techStack.length * 11 + 32 + index * 7)}%`,
    primaryTech,
  };
}

export function templateIdentity(template: PortfolioData["template"]) {
  if (template === "orbit") {
    return {
      label: "Orbit Motion",
      concept: "cinematic 3D personal brand",
      motion: "orbital rings, floating nodes, constellation skills",
    };
  }

  if (template === "terminal") {
    return {
      label: "Terminal Neon",
      concept: "developer console portfolio",
      motion: "boot sequence, scanlines, typed commands",
    };
  }

  return {
    label: "Nova SaaS",
    concept: "premium startup landing page",
    motion: "dashboard metrics, glass cards, case-study sweeps",
  };
}

export const portfolioSectionIcon = Layers3;
