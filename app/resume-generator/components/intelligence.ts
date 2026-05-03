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
  "architected",
  "owned",
  "scaled",
  "automated",
  "improved",
  "reduced",
  "increased",
  "modernized",
  "integrated",
  "collaborated",
];

const weakOpeners =
  /^(worked on|responsible for|helped with|helped|assisted with|involved in|tasked with)\s+/i;
const impactSignals =
  /improv|reduc|increas|streamlin|accelerat|boost|grow|save|cut|raise|scale|support|enable|deliver|launch|ship|moderniz|stabiliz|simplif|automat/i;
const commonTechPattern =
  /\b(react|next\.?js|typescript|javascript|node\.?js|tailwind|postgres(?:ql)?|mongodb|mysql|redis|graphql|rest|api|aws|docker|firebase|vercel|figma|playwright|jest|ci\/cd|python|java)\b/i;

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

function ensurePeriod(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function uniqueItems(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function containsMetric(value: string) {
  return /\b\d+([.,]\d+)?\s?(%|x|k|m|ms|s|hrs?|hours?|days?|users?|customers?|clients?|projects?|features?)\b/i.test(
    value
  );
}

function hasImpactEvidence(value: string) {
  return containsMetric(value) || impactSignals.test(value);
}

function hasTechEvidence(value: string, skillPool: string[]) {
  return detectMentionedTechnologies(value, skillPool).length > 0 || commonTechPattern.test(value);
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
    return "to improve load speed and user experience";
  }
  if (/component|design system|ui/.test(lower)) {
    return "to improve consistency and reduce development time";
  }
  if (/dashboard|analytics|report/.test(lower)) {
    return "to enable faster decisions and clearer reporting";
  }
  if (/api|backend|integration|auth/.test(lower)) {
    return "to improve reliability and delivery efficiency";
  }
  if (/onboard|workflow|automation/.test(lower)) {
    return "to streamline user workflows and reduce friction";
  }
  if (/deploy|release|ci|cd/.test(lower)) {
    return "to accelerate delivery and production readiness";
  }
  return "to improve usability and product delivery quality";
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
    cleaned.length >= 45 &&
    (hasTechEvidence(cleaned, skillPool) || hasImpactEvidence(cleaned))
  ) {
    return ensurePeriod(sentenceCase(cleaned));
  }

  const techClause = techs ? ` with ${techs}` : "";

  return `${verb} ${task}${techClause} ${result}.`
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
    cleaned.length < 42 ||
    weakOpeners.test(cleaned) ||
    !strongVerbs.some((verb) => cleaned.startsWith(verb)) ||
    (!hasImpactEvidence(cleaned) && !commonTechPattern.test(cleaned))
  );
}

function normalizeSummary(summary: string) {
  return splitLines(summary)
    .map((line) => ensurePeriod(sentenceCase(line.replace(/\s+/g, " ").trim())))
    .slice(0, 3)
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

    const bullets = splitLines(item.description).map((line) => {
      if (!isWeakBullet(line)) {
        return ensurePeriod(sentenceCase(trimBullet(line)));
      }

      return enhanceBullet(line, {
        role: item.role,
        company: item.companyName,
        resumeSkills: skillPool,
      });
    });

    return {
      ...item,
      description: ensureExperienceBulletCount(bullets, item, skillPool)
        .slice(0, 4)
        .join("\n"),
    };
  });
}

export function enhanceProjectItems(
  items: ProjectItem[],
  resumeSkills: string[] = []
) {
  return items.map((item) => {
    const skillPool = uniqueItems([...item.techStack, ...resumeSkills]);
    const bullets = splitLines(item.description).map((line) => {
      if (!isWeakBullet(line)) {
        return ensurePeriod(sentenceCase(trimBullet(line)));
      }

      return enhanceBullet(line, {
        project: item.projectName,
        techStack: skillPool,
        resumeSkills: skillPool,
      });
    });

    return {
      ...item,
      description: ensureProjectBulletCount(bullets, item, skillPool)
        .slice(0, 3)
        .join("\n"),
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
      `${role} with experience building scalable web applications with ${frontendPhrase}.`,
      `Skilled in ${systemsPhrase}.`,
      "Focused on shipping reliable user experiences, maintainable systems, and measurable product outcomes.",
    ].join("\n")
  );
}

export function prepareResumeForOutput(data: ResumeData): ResumeData {
  const normalizedSummary = normalizeSummary(data.summary);

  return {
    ...data,
    skills: uniqueItems(data.skills).slice(0, 16),
    certifications: uniqueItems(data.certifications),
    summary: normalizedSummary || generateSmartSummary(data),
    experience: enhanceExperienceItems(data.experience, data.skills),
    projects: enhanceProjectItems(data.projects, data.skills),
    includePhoto: Boolean(data.includePhoto && data.photo),
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
    !data.personalInfo.location ? "Header: location" : "",
    !data.personalInfo.github ? "Header: GitHub" : "",
    !data.personalInfo.linkedin ? "Header: LinkedIn" : "",
    !normalizeSummary(data.summary) ? "Professional Summary" : "",
    data.skills.length < 5 ? "Skills" : "",
    experienceItems.length === 0 ? "Work Experience" : "",
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
      label: "Complete recruiter header",
      passed:
        Boolean(data.personalInfo.fullName) &&
        Boolean(data.personalInfo.title) &&
        Boolean(data.personalInfo.email) &&
        Boolean(data.personalInfo.phone) &&
        Boolean(data.personalInfo.location),
      detail: "Include full name, role, email, phone, and location in the header.",
    },
    {
      label: "Professional summary is focused",
      passed: (() => {
        const lines = splitLines(data.summary);
        const length = normalizeSummary(data.summary).length;
        return lines.length >= 2 && lines.length <= 3 && length >= 120 && length <= 420;
      })(),
      detail: "Keep the summary to 2-3 concise lines with role fit, strengths, and business value.",
    },
    {
      label: "Skills are ATS searchable",
      passed: data.skills.length >= 8 && categorizedSkills.length >= 2,
      detail: "Show at least 8 relevant skills across 2 or more categories.",
    },
    {
      label: "Experience bullets are outcome-driven",
      passed:
        experienceItems.length > 0 &&
        experienceItems.every((item) => {
          const bullets = splitLines(item.description);
          return (
            bullets.length >= 2 &&
            bullets.length <= 4 &&
            bullets.every((bullet) => !isWeakBullet(bullet)) &&
            bullets.some((bullet) => hasImpactEvidence(bullet))
          );
        }),
      detail: "Each role should have 2-4 clear bullets with strong verbs and impact evidence.",
    },
    {
      label: "Projects show proof of work",
      passed:
        projectItems.length >= 1 &&
        projectItems.every((item) => {
          const bullets = splitLines(item.description);
          return bullets.length >= 2 && bullets.length <= 3;
        }),
      detail: "Include at least one solid project with 2-3 bullets and links when available.",
    },
    {
      label: "Links support credibility",
      passed:
        Boolean(data.personalInfo.linkedin) &&
        (Boolean(data.personalInfo.github) || Boolean(data.personalInfo.website)),
      detail: "LinkedIn plus GitHub or portfolio makes the resume more credible for recruiters.",
    },
  ];

  const blockingIssues = [
    !data.personalInfo.fullName || !data.personalInfo.email || !data.personalInfo.phone
      ? "Complete the top header with your name, email, and phone."
      : "",
    !normalizeSummary(data.summary)
      ? "Add a short professional summary before exporting."
      : "",
    data.skills.length < 5
      ? "Add more relevant skills so the resume is ATS searchable."
      : "",
    experienceItems.length === 0
      ? "Add at least one work experience entry."
      : "",
    experienceItems.length > 0 &&
    experienceItems.every((item) => splitLines(item.description).every((bullet) => isWeakBullet(bullet)))
      ? "Rewrite experience bullets to show ownership and outcomes."
      : "",
  ].filter(Boolean);

  const strengths = [
    categorizedSkills.length >= 2 ? "Skills are grouped into ATS-friendly categories." : "",
    projectItems.length >= 1 ? "Project coverage supports a faster recruiter scan." : "",
    experienceItems.length > 0 &&
    experienceItems.every((item) => splitLines(item.description).length >= 2)
      ? "Experience entries have enough bullet depth for credibility."
      : "",
    weakBulletCount === 0 ? "Bullets are action-oriented and easier for HR to scan." : "",
  ].filter(Boolean);

  const improvementSuggestions = [
    qualityChecks.find((item) => item.label === "Experience bullets are outcome-driven")?.passed
      ? ""
      : "Rewrite weak bullets so each one shows ownership, context, and outcome.",
    projectItems.length < 1
      ? "Add at least one project with strong impact bullets and links."
      : "",
    categorizedSkills.length < 2
      ? "Expand the skills section so it covers multiple ATS-searchable categories."
      : "",
    weakBulletCount > 0
      ? `Strengthen ${weakBulletCount} bullet${weakBulletCount > 1 ? "s" : ""} with clearer outcomes and stronger detail.`
      : "",
    !data.personalInfo.linkedin || (!data.personalInfo.github && !data.personalInfo.website)
      ? "Complete the header with LinkedIn plus GitHub or portfolio links."
      : "",
    educationItems.length === 0
      ? "Add education details so the resume feels complete for HR review."
      : "",
  ].filter(Boolean);

  const score = clamp(
    58 +
      qualityChecks.filter((item) => item.passed).length * 7 +
      (categorizedSkills.length >= 2 ? 6 : 0) +
      (projectItems.length >= 1 ? 5 : 0) +
      (weakBulletCount === 0 ? 6 : 0) -
      weakBulletCount * 3,
    0,
    100
  );

  const atsScore = clamp(
    64 +
      (categorizedSkills.length >= 2 ? 8 : 0) +
      (Boolean(data.personalInfo.email) && Boolean(data.personalInfo.phone) ? 6 : 0) +
      (normalizeSummary(data.summary) ? 6 : 0) +
      (weakBulletCount === 0 ? 8 : -6) -
      missingSections.length * 4,
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
