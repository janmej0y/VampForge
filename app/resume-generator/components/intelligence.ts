import {
  type ExperienceItem,
  type ProjectItem,
  type ResumeData,
} from "./types";

export type SkillCategory = {
  title: "Frontend" | "Backend" | "Database" | "Tools";
  skills: string[];
};

export type ResumeQualityCheck = {
  label: string;
  passed: boolean;
  detail: string;
};

export type ResumeInsights = {
  score: number;
  atsScore: number;
  label: "Needs Work" | "Competitive" | "Strong" | "Excellent";
  strengths: string[];
  keywordSuggestions: string[];
  missingSections: string[];
  improvementSuggestions: string[];
  weakBulletCount: number;
  categorizedSkills: SkillCategory[];
  qualityChecks: ResumeQualityCheck[];
  blockingIssues: string[];
  isReady: boolean;
};

const categoryMatchers: Array<{
  title: SkillCategory["title"];
  matchers: RegExp[];
}> = [
  {
    title: "Frontend",
    matchers: [
      /react/i,
      /next/i,
      /typescript/i,
      /javascript/i,
      /tailwind/i,
      /html/i,
      /css/i,
      /redux/i,
      /frontend/i,
      /responsive/i,
      /accessibility/i,
    ],
  },
  {
    title: "Backend",
    matchers: [
      /node/i,
      /express/i,
      /nestjs/i,
      /rest/i,
      /graphql/i,
      /api/i,
      /backend/i,
      /auth/i,
      /server/i,
      /openai/i,
    ],
  },
  {
    title: "Database",
    matchers: [
      /postgres/i,
      /mongodb/i,
      /mysql/i,
      /redis/i,
      /sql/i,
      /supabase/i,
      /prisma/i,
      /database/i,
    ],
  },
  {
    title: "Tools",
    matchers: [
      /git/i,
      /docker/i,
      /aws/i,
      /vercel/i,
      /figma/i,
      /jira/i,
      /postman/i,
      /linux/i,
      /github actions/i,
      /playwright/i,
      /jest/i,
      /ci\/cd/i,
      /testing/i,
    ],
  },
];

const strongVerbs = [
  "developed",
  "built",
  "designed",
  "optimized",
  "implemented",
  "led",
  "launched",
  "engineered",
  "improved",
  "delivered",
  "created",
  "streamlined",
];

const weakOpeners =
  /^(worked on|responsible for|helped with|helped|assisted with|involved in|tasked with)\s+/i;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function trimBullet(value: string) {
  return value
    .replace(/^[\s\u2022\-\u2013\u2014]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitLines(value: string) {
  return value
    .split(/\n+/)
    .map(trimBullet)
    .filter(Boolean);
}

function sentenceCase(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function uniqueItems(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function containsMetric(value: string) {
  return /\b\d+([.,]\d+)?\s?(%|x|k|m|ms|s|hrs?|hours?|days?|users?|customers?|clients?|projects?|features?)\b/i.test(
    value
  );
}

function detectMentionedTechnologies(value: string, skillPool: string[]) {
  const lower = value.toLowerCase();
  return skillPool.filter((skill) => lower.includes(skill.toLowerCase()));
}

function selectTechPhrase(value: string, skillPool: string[]) {
  const matches = uniqueItems(detectMentionedTechnologies(value, skillPool));

  if (matches.length > 0) {
    return matches.slice(0, 3).join(", ");
  }

  return uniqueItems(skillPool).slice(0, 3).join(", ");
}

function inferActionVerb(lower: string) {
  if (/optimi|speed|performance|load|bundle|lazy|cache/.test(lower)) {
    return "Optimized";
  }
  if (/design|ui|ux|layout|responsive|accessibility/.test(lower)) {
    return "Designed";
  }
  if (/lead|owned|mentored|managed/.test(lower)) {
    return "Led";
  }
  if (/implement|integrat|auth|api|service/.test(lower)) {
    return "Implemented";
  }
  if (/launch|ship|deliver|release/.test(lower)) {
    return "Launched";
  }
  if (/build|create/.test(lower)) {
    return "Built";
  }
  return "Developed";
}

function inferTask(lower: string, fallback: string) {
  if (/component|design system|ui/.test(lower)) {
    return "reusable interface systems";
  }
  if (/dashboard|analytics|report/.test(lower)) {
    return "data-heavy dashboard workflows";
  }
  if (/portfolio|resume|builder/.test(lower)) {
    return "developer-facing product workflows";
  }
  if (/api|backend|integration|auth/.test(lower)) {
    return "backend features and service integrations";
  }
  if (/performance|load|speed/.test(lower)) {
    return "performance-critical application flows";
  }
  if (/deploy|release|ci|cd/.test(lower)) {
    return "deployment and release workflows";
  }
  return fallback || "scalable product features";
}

function inferResult(lower: string) {
  if (/performance|load|speed|lazy|cache/.test(lower)) {
    return "improving load speed and user experience";
  }
  if (/component|design system|ui/.test(lower)) {
    return "improving consistency and reducing development time";
  }
  if (/dashboard|analytics|report/.test(lower)) {
    return "enabling faster decisions and clearer reporting";
  }
  if (/api|backend|integration|auth/.test(lower)) {
    return "improving reliability and delivery efficiency";
  }
  if (/onboard|workflow|automation/.test(lower)) {
    return "streamlining user workflows and reducing friction";
  }
  if (/deploy|release|ci|cd/.test(lower)) {
    return "accelerating delivery and production readiness";
  }
  return "improving usability and product delivery quality";
}

function buildStrongBullet(value: string, skillPool: string[], fallbackTask: string) {
  const cleaned = trimBullet(value).replace(weakOpeners, "").replace(/[.;]+$/, "");
  const lower = cleaned.toLowerCase();
  const verb = inferActionVerb(lower);
  const task = inferTask(lower, cleaned || fallbackTask);
  const techs = selectTechPhrase(cleaned, skillPool);
  const result = inferResult(lower);

  if (
    strongVerbs.some((item) => lower.startsWith(item)) &&
    /using\s+/i.test(cleaned) &&
    (containsMetric(cleaned) || /improv|reduc|increas|streamlin|accelerat|support|enabl/.test(lower))
  ) {
    return sentenceCase(cleaned.endsWith(".") ? cleaned : `${cleaned}.`);
  }

  return `${verb} ${task} using ${techs || "modern web technologies"}, ${result}.`
    .replace(/\s+/g, " ")
    .replace(/\s,\s/g, ", ")
    .trim();
}

function ensureExperienceBulletCount(
  bullets: string[],
  item: ExperienceItem,
  resumeSkills: string[]
) {
  const fallbackPool = uniqueItems([
    ...resumeSkills,
    ...detectMentionedTechnologies(item.role, resumeSkills),
  ]);
  const nextBullets = [...bullets];

  const fallbackBullets = [
    buildStrongBullet(
      `${item.role || "developer"} features for ${item.companyName || "product platform"}`,
      fallbackPool,
      "core product features"
    ),
    buildStrongBullet(
      `performance and release quality improvements across ${item.companyName || "the platform"}`,
      fallbackPool,
      "application performance improvements"
    ),
    buildStrongBullet(
      `cross-functional delivery for ${item.role || "engineering"} initiatives`,
      fallbackPool,
      "cross-functional product initiatives"
    ),
  ];

  while (nextBullets.length < 3) {
    const candidate =
      fallbackBullets[nextBullets.length - bullets.length] ?? fallbackBullets[0];
    if (!nextBullets.includes(candidate)) {
      nextBullets.push(candidate);
    } else {
      break;
    }
  }

  return nextBullets.slice(0, 5);
}

function ensureProjectBulletCount(
  bullets: string[],
  item: ProjectItem,
  resumeSkills: string[]
) {
  const skillPool = uniqueItems([...item.techStack, ...resumeSkills]);
  const nextBullets = [...bullets];
  const fallbackBullets = [
    buildStrongBullet(
      `${item.projectName || "project"} platform architecture`,
      skillPool,
      "scalable product architecture"
    ),
    buildStrongBullet(
      `${item.projectName || "project"} user workflows and live features`,
      skillPool,
      "user-facing workflows"
    ),
    buildStrongBullet(
      `${item.projectName || "project"} deployment and production readiness`,
      skillPool,
      "deployment workflows"
    ),
  ];

  while (nextBullets.length < 2) {
    const candidate =
      fallbackBullets[nextBullets.length - bullets.length] ?? fallbackBullets[0];
    if (!nextBullets.includes(candidate)) {
      nextBullets.push(candidate);
    } else {
      break;
    }
  }

  return nextBullets.slice(0, 3);
}

function isWeakBullet(value: string) {
  const cleaned = trimBullet(value).toLowerCase();

  return (
    cleaned.length < 55 ||
    weakOpeners.test(cleaned) ||
    !strongVerbs.some((verb) => cleaned.startsWith(verb)) ||
    !/using\s+/i.test(cleaned) ||
    !/improv|reduc|increas|streamlin|accelerat|support|enabl|optimiz|deliver|launch/.test(
      cleaned
    )
  );
}

function normalizeSummary(summary: string) {
  return splitLines(summary)
    .slice(0, 4)
    .join("\n");
}

export function categorizeSkills(skills: string[]): SkillCategory[] {
  const buckets = new Map<SkillCategory["title"], string[]>(
    categoryMatchers.map((item) => [item.title, []])
  );
  const toolsBucket = buckets.get("Tools") ?? [];

  skills.forEach((skill) => {
    const category = categoryMatchers.find((item) =>
      item.matchers.some((matcher) => matcher.test(skill))
    )?.title;

    if (category) {
      buckets.set(category, [...(buckets.get(category) ?? []), skill]);
      return;
    }

    toolsBucket.push(skill);
  });

  buckets.set("Tools", toolsBucket);

  return Array.from(buckets.entries())
    .map(([title, values]) => ({
      title,
      skills: uniqueItems(values),
    }))
    .filter((item) => item.skills.length > 0);
}

export function enhanceBullet(
  input: string,
  context?: {
    role?: string;
    company?: string;
    project?: string;
    techStack?: string[];
    resumeSkills?: string[];
  }
) {
  const skillPool = uniqueItems([
    ...(context?.techStack ?? []),
    ...(context?.resumeSkills ?? []),
  ]);
  const fallbackTask =
    context?.project ||
    context?.role ||
    context?.company ||
    "core product features";

  return buildStrongBullet(input, skillPool, fallbackTask);
}

export function enhanceExperienceItems(
  items: ExperienceItem[],
  resumeSkills: string[] = []
) {
  return items.map((item) => {
    const skillPool = uniqueItems([
      ...resumeSkills,
      ...detectMentionedTechnologies(item.description, resumeSkills),
    ]);

    const bullets = splitLines(item.description).map((line) =>
      enhanceBullet(line, {
        role: item.role,
        company: item.companyName,
        resumeSkills: skillPool,
      })
    );

    return {
      ...item,
      description: ensureExperienceBulletCount(bullets, item, skillPool).join("\n"),
    };
  });
}

export function enhanceProjectItems(
  items: ProjectItem[],
  resumeSkills: string[] = []
) {
  return items.map((item) => {
    const skillPool = uniqueItems([...item.techStack, ...resumeSkills]);
    const bullets = splitLines(item.description).map((line) =>
      enhanceBullet(line, {
        project: item.projectName,
        techStack: skillPool,
        resumeSkills: skillPool,
      })
    );

    return {
      ...item,
      description: ensureProjectBulletCount(bullets, item, skillPool).join("\n"),
    };
  });
}

function inferRoleLabel(title: string) {
  return title.trim() || "Frontend Developer";
}

export function generateSmartSummary(data: ResumeData) {
  const categories = categorizeSkills(data.skills);
  const role = inferRoleLabel(data.personalInfo.title);
  const frontend = categories.find((item) => item.title === "Frontend")?.skills ?? [];
  const backend = categories.find((item) => item.title === "Backend")?.skills ?? [];
  const database = categories.find((item) => item.title === "Database")?.skills ?? [];

  const frontendPhrase = frontend.slice(0, 3).join(", ") || "React, Next.js, and TypeScript";
  const systemsPhrase = uniqueItems([
    ...backend.slice(0, 2),
    ...database.slice(0, 2),
    "responsive design",
    "performance optimization",
    "modern UI systems",
  ]).join(", ");

  return normalizeSummary(
    [
      `${role} with experience building scalable web applications using ${frontendPhrase}.`,
      `Skilled in ${systemsPhrase}.`,
      "Focused on delivering fast, user-centric applications with clean architecture and measurable product impact.",
    ].join("\n")
  );
}

export function prepareResumeForOutput(data: ResumeData): ResumeData {
  const normalizedSummary = normalizeSummary(data.summary);

  return {
    ...data,
    summary: normalizedSummary || generateSmartSummary(data),
    experience: enhanceExperienceItems(data.experience, data.skills),
    projects: enhanceProjectItems(data.projects, data.skills),
    includePhoto: data.template === "executive",
    atsMode: true,
  };
}

export function calculateResumeInsights(data: ResumeData): ResumeInsights {
  const categorizedSkills = categorizeSkills(data.skills);
  const experienceItems = data.experience.filter(
    (item) => item.role || item.companyName || item.description
  );
  const projectItems = data.projects.filter(
    (item) => item.projectName || item.description || item.techStack.length > 0
  );
  const educationItems = data.education.filter(
    (item) => item.institutionName || item.degree || item.description
  );

  const allBullets = [
    ...experienceItems.flatMap((item) => splitLines(item.description)),
    ...projectItems.flatMap((item) => splitLines(item.description)),
  ];

  const weakBulletCount = allBullets.filter((bullet) => isWeakBullet(bullet)).length;
  const missingSections = [
    !data.personalInfo.fullName ? "Header: full name" : "",
    !data.personalInfo.title ? "Header: target role" : "",
    !data.personalInfo.email ? "Header: email" : "",
    !data.personalInfo.phone ? "Header: phone" : "",
    !data.personalInfo.github ? "Header: GitHub" : "",
    !data.personalInfo.linkedin ? "Header: LinkedIn" : "",
    !data.personalInfo.website ? "Header: portfolio" : "",
    !normalizeSummary(data.summary) ? "Professional Summary" : "",
    categorizedSkills.length < 1 ? "Skills" : "",
    experienceItems.length === 0 ? "Work Experience" : "",
    projectItems.length === 0 ? "Projects" : "",
    educationItems.length === 0 ? "Education" : "",
  ].filter(Boolean);

  const resumeText = `${normalizeSummary(data.summary)} ${allBullets.join(" ")}`.toLowerCase();
  const keywordSuggestions = uniqueItems([
    !resumeText.includes("performance") ? "performance optimization" : "",
    !resumeText.includes("responsive") ? "responsive design" : "",
    !resumeText.includes("typescript") ? "TypeScript" : "",
    !resumeText.includes("react") ? "React" : "",
    !resumeText.includes("next.js") ? "Next.js" : "",
  ]);

  const qualityChecks: ResumeQualityCheck[] = [
    {
      label: "No weak wording",
      passed:
        !allBullets.some((bullet) =>
          /worked on|responsible for|helped with|helped|assisted with/i.test(bullet)
        ),
      detail: "Replace weak wording with action-based bullets that show ownership.",
    },
    {
      label: "No empty sections",
      passed: missingSections.length === 0,
      detail:
        "Header, summary, skills, experience, projects, and education all need complete content.",
    },
    {
      label: "At least 2 projects",
      passed: projectItems.length >= 2,
      detail: "Add at least two strong projects with GitHub or live links where possible.",
    },
    {
      label: "At least 3 skill categories",
      passed: categorizedSkills.length >= 3,
      detail: "Show at least three skill categories such as frontend, backend, database, and tools.",
    },
    {
      label: "Strong bullets in each experience section",
      passed:
        experienceItems.length > 0 &&
        experienceItems.every((item) => {
          const bullets = splitLines(item.description);
          return bullets.length >= 3 && bullets.length <= 5 && bullets.every((bullet) => !isWeakBullet(bullet));
        }),
      detail: "Each role needs 3-5 bullets that start with a strong verb, include tech, and show impact.",
    },
  ];

  const blockingIssues = qualityChecks
    .filter((item) => !item.passed)
    .map((item) => item.detail);

  const strengths = [
    categorizedSkills.length >= 3 ? "Skills are grouped into ATS-friendly categories." : "",
    projectItems.length >= 2 ? "Project coverage is strong enough for a fast recruiter scan." : "",
    experienceItems.length > 0 &&
    experienceItems.every((item) => splitLines(item.description).length >= 3)
      ? "Each experience entry has enough bullet depth for credibility."
      : "",
    weakBulletCount === 0 ? "Bullets use stronger action verbs, technology, and impact." : "",
  ].filter(Boolean);

  const improvementSuggestions = [
    qualityChecks.find((item) => item.label === "No weak wording")?.passed
      ? ""
      : "Rewrite weak bullets so each one starts with a strong action verb and shows result.",
    projectItems.length < 2
      ? "Add at least one more project with 2-3 impact-focused bullets."
      : "",
    categorizedSkills.length < 3
      ? "Expand your skills so at least three categories are represented."
      : "",
    weakBulletCount > 0
      ? `Strengthen ${weakBulletCount} bullet${weakBulletCount > 1 ? "s" : ""} with tech context and outcomes.`
      : "",
    !data.personalInfo.github || !data.personalInfo.linkedin || !data.personalInfo.website
      ? "Complete the header with GitHub, LinkedIn, and portfolio links."
      : "",
  ].filter(Boolean);

  const score = clamp(
    60 +
      qualityChecks.filter((item) => item.passed).length * 8 +
      (categorizedSkills.length >= 3 ? 6 : 0) +
      (projectItems.length >= 2 ? 6 : 0) -
      weakBulletCount * 4,
    0,
    100
  );

  const atsScore = clamp(
    68 +
      (categorizedSkills.length >= 3 ? 6 : 0) +
      (projectItems.length >= 2 ? 6 : 0) +
      (weakBulletCount === 0 ? 8 : -8) -
      missingSections.length * 5,
    0,
    100
  );

  return {
    score,
    atsScore,
    label:
      score >= 90
        ? "Excellent"
        : score >= 80
          ? "Strong"
          : score >= 68
            ? "Competitive"
            : "Needs Work",
    strengths,
    keywordSuggestions,
    missingSections,
    improvementSuggestions,
    weakBulletCount,
    categorizedSkills,
    qualityChecks,
    blockingIssues,
    isReady: blockingIssues.length === 0,
  };
}
