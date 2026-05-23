"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  Download,
  Eye,
  FileSignature,
  FileText,
  Gauge,
  History,
  ImageUp,
  KeyRound,
  Layers3,
  ListChecks,
  Loader2,
  Printer,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  WandSparkles,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { TagInput } from "@/components/tag-input";
import { showToast } from "@/components/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { openGeneratedDocument } from "@/lib/export-utils";
import { readStoredUserProfile, storeUserProfile } from "@/lib/user-profile";
import { createResumeDocument } from "../components/document";
import {
  exportResumeDocx,
  exportResumePdf,
  printResumeDocument,
} from "../components/export";
import {
  calculateResumeInsights,
  enhanceExperienceItems,
  enhanceProjectItems,
  prepareResumeForOutput,
} from "../components/intelligence";
import { ResumePreview } from "../components/ResumePreview";
import {
  createEducationItem,
  createExperienceItem,
  createProjectItem,
  type EducationItem,
  type ExperienceItem,
  type ProjectItem,
  type ResumeBackgroundIntensity,
  type ResumeBackgroundTheme,
  type ResumeData,
  type ResumePageCount,
  type ResumeTemplate,
  type UploadStatus,
} from "../components/types";

type AiResumeForm = {
  apiKey: string;
  model: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  targetRole: string;
  targetCompany: string;
  targetIndustry: string;
  tone: string;
  experienceLevel: string;
  jobDescription: string;
  background: string;
  skills: string[];
  education: string;
  projects: string;
  certifications: string[];
  template: ResumeTemplate;
  pageCount: ResumePageCount;
  strictOnePage: boolean;
  photo: string | null;
  photoPosition: number;
  includePhoto: boolean;
  backgroundEnabled: boolean;
  backgroundTheme: ResumeBackgroundTheme;
  backgroundIntensity: ResumeBackgroundIntensity;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

type GeneratedResumePayload = {
  personalInfo?: Partial<ResumeData["personalInfo"]>;
  summary?: string;
  skills?: string[];
  experience?: Array<Partial<Omit<ExperienceItem, "id">>>;
  education?: Array<Partial<Omit<EducationItem, "id">>>;
  projects?: Array<Partial<Omit<ProjectItem, "id">>>;
  certifications?: string[];
};

const emptyResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  achievements: [],
  template: "modern",
  pageCount: 1,
  photo: null,
  photoPosition: 18,
  includePhoto: false,
  backgroundEnabled: true,
  backgroundTheme: "blue",
  backgroundIntensity: "low",
  atsMode: true,
};

const initialForm: AiResumeForm = {
  apiKey: "",
  model: "gemini-2.5-flash",
  fullName: "Janmejoy Mahato",
  title: "Web Developer",
  email: "janmejoymahato529@gmail.com",
  phone: "+91 7477661933",
  location: "Kolkata, India",
  website: "https://janmejoy.is-a.dev",
  linkedin: "https://linkedin.com/in/janmejoy",
  github: "https://github.com/janmej0y",
  targetRole: "Full Stack Web Developer",
  targetCompany: "",
  targetIndustry: "Web Development",
  tone: "Professional",
  experienceLevel: "Entry-level",
  jobDescription: "",
  background:
    "Final-year B.Tech CSE student with hands-on experience in full-stack web development, authentication, databases, dashboards, AI integrations, and deployment-ready web applications.",
  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Express.js",
    "MongoDB",
    "MySQL",
    "Supabase",
    "Python",
    "Redis",
    "Git",
  ],
  education:
    "B.Tech in Computer Science and Engineering, Greater Kolkata College of Engineering & Management, 2022-2026, CGPA 7.20/10. Higher Secondary - WBCHSE, 85.60%. Secondary - WBBSE, 69.70%.",
  projects:
    "Online Voting System: full-stack voting app with Node.js, Express, SQLite, JWT, bcrypt, Tailwind CSS, single-vote validation, and real-time results. RentHub: rental platform using Next.js, TypeScript, Tailwind CSS, and Supabase for auth, storage, and listing management. Kurmi Chatbot: AI chatbot with Next.js, NextAuth, MongoDB, Markdown, and Gemini API.",
  certifications: [
    "Cybersecurity Virtual Internship",
    "Full Stack BCT Training",
    "Ethical Hacking Internship",
    "Cloud Security",
    "Java Full Stack",
    "Cloud Foundation",
  ],
  template: "professional",
  pageCount: 1,
  strictOnePage: true,
  photo: null,
  photoPosition: 18,
  includePhoto: false,
  backgroundEnabled: true,
  backgroundTheme: "blue",
  backgroundIntensity: "low",
};

const idleUploadStatus: UploadStatus = {
  state: "idle",
  progress: 0,
};

const AI_RESUME_AUTOSAVE_KEY = "vampforge-ai-resume-form-draft";

type WizardStepId = "profile" | "target" | "experience" | "sections" | "review";
type PreviewMode = "form" | "preview" | "score";

const wizardSteps: Array<{
  id: WizardStepId;
  label: string;
  description: string;
  icon: typeof FileText;
}> = [
  {
    id: "profile",
    label: "Profile",
    description: "Gemini key and header identity",
    icon: KeyRound,
  },
  {
    id: "target",
    label: "Target",
    description: "Role, company, tone, and template",
    icon: Target,
  },
  {
    id: "experience",
    label: "Experience",
    description: "Background, job post, and skills",
    icon: Bot,
  },
  {
    id: "sections",
    label: "Sections",
    description: "Education, projects, certifications",
    icon: Layers3,
  },
  {
    id: "review",
    label: "Review",
    description: "Score, checks, and export readiness",
    icon: ListChecks,
  },
];

const toneOptions = ["Professional", "Confident", "Concise", "Senior", "Startup"];
const industryOptions = [
  "Software",
  "SaaS",
  "Fintech",
  "E-commerce",
  "AI/ML",
  "Healthtech",
  "Edtech",
];

const backgroundThemeOptions: Array<{
  value: ResumeBackgroundTheme;
  label: string;
}> = [
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "neutral", label: "Neutral" },
];

const backgroundIntensityOptions: Array<{
  value: ResumeBackgroundIntensity;
  label: string;
}> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
];

const stopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "you",
  "your",
  "are",
  "that",
  "this",
  "from",
  "will",
  "have",
  "has",
  "our",
  "to",
  "in",
  "of",
  "a",
  "an",
  "on",
  "as",
  "is",
  "be",
  "or",
  "we",
  "by",
]);

const personalFields: Array<{
  key: keyof Pick<
    AiResumeForm,
    "fullName" | "title" | "email" | "phone" | "location" | "website" | "linkedin" | "github"
  >;
  label: string;
  placeholder: string;
}> = [
  { key: "fullName", label: "Full Name", placeholder: "Janmejoy Mahato" },
  { key: "title", label: "Current Title", placeholder: "Frontend Developer" },
  { key: "email", label: "Email", placeholder: "janmejoy@email.com" },
  { key: "phone", label: "Phone", placeholder: "+91 7477661933" },
  { key: "location", label: "Location", placeholder: "Kolkata, India" },
  { key: "website", label: "Portfolio / Website", placeholder: "https://janmejoy.is-a.dev" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/janmejoy" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/janmej0y" },
];

function FormSection({
  icon: Icon,
  step,
  title,
  description,
  children,
}: {
  icon: typeof FileText;
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section-card p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="section-label">{step}</div>
          <div className="mt-2 text-lg font-semibold text-white">{title}</div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ToggleCard({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.07]">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-7 w-12 shrink-0 items-center rounded-full border p-1 transition ${
          checked
            ? "border-cyan-300/40 bg-cyan-300/20"
            : "border-white/10 bg-slate-950/65"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full transition ${
            checked
              ? "translate-x-5 bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.55)]"
              : "translate-x-0 bg-slate-500"
          }`}
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
          {label}
          <span className="rounded-full border border-white/10 bg-white/[0.055] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {checked ? "On" : "Off"}
          </span>
        </div>
        <div className="mt-1 text-xs leading-6 text-muted-foreground">
          {description}
        </div>
      </div>
    </label>
  );
}

function UploadMeter({ status }: { status: UploadStatus }) {
  if (status.state === "idle") {
    return null;
  }

  const isComplete = status.state === "complete";
  const isError = status.state === "error";
  const icon = isComplete ? (
    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
  ) : isError ? (
    <AlertCircle className="h-4 w-4 text-rose-300" />
  ) : (
    <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />
  );

  return (
    <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/35 p-3">
      <div className="flex min-w-0 items-center justify-between gap-3 text-xs">
        <div className="flex min-w-0 items-center gap-2 text-slate-200">
          {icon}
          <span className="truncate">{status.message ?? "Uploading..."}</span>
        </div>
        <span className={isError ? "text-rose-200" : "text-cyan-100"}>
          {isError ? "Retry" : `${status.progress}%`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-slate-950/70">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isError
              ? "bg-rose-400"
              : "bg-[linear-gradient(90deg,#22d3ee,#a7f3d0,#facc15)]"
          }`}
          style={{ width: `${Math.max(4, status.progress)}%` }}
        />
      </div>
      {status.fileName ? (
        <div className="truncate text-[11px] text-slate-500">{status.fileName}</div>
      ) : null}
    </div>
  );
}

function FieldIssue({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;

  return <p className="text-xs leading-5 text-amber-200">{children}</p>;
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => asString(item)).filter(Boolean)
    : [];
}

function extractJson(value: string) {
  const trimmed = value.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function readFileAsDataUrl(
  file: File,
  onProgress?: (progress: number) => void
) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (!onProgress) return;

      if (!event.lengthComputable) {
        onProgress(45);
        return;
      }

      onProgress(Math.min(78, Math.round((event.loaded / event.total) * 78)));
    };

    reader.onload = () => {
      if (typeof reader.result === "string") {
        onProgress?.(82);
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read image file."));
    };

    reader.onerror = () => reject(reader.error ?? new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

async function normalizePhotoDataUrl(source: string) {
  return new Promise<string>((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => {
      const maxDimension = 1600;
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Unable to prepare uploaded image."));
        return;
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", 0.86));
    };

    image.onerror = () => reject(new Error("Unable to load uploaded image."));
    image.src = source;
  });
}

function normalizeGeneratedResume(
  payload: GeneratedResumePayload,
  form: AiResumeForm
): ResumeData {
  return {
    ...emptyResumeData,
    personalInfo: {
      fullName: asString(payload.personalInfo?.fullName) || form.fullName,
      title:
        asString(payload.personalInfo?.title) ||
        form.targetRole ||
        form.title,
      email: asString(payload.personalInfo?.email) || form.email,
      phone: asString(payload.personalInfo?.phone) || form.phone,
      location: asString(payload.personalInfo?.location) || form.location,
      website: asString(payload.personalInfo?.website) || form.website,
      linkedin: asString(payload.personalInfo?.linkedin) || form.linkedin,
      github: asString(payload.personalInfo?.github) || form.github,
    },
    summary: asString(payload.summary),
    skills: asStringArray(payload.skills).length ? asStringArray(payload.skills) : form.skills,
    experience: Array.isArray(payload.experience)
      ? payload.experience.map((item) => ({
          ...createExperienceItem(),
          companyName: asString(item.companyName),
          role: asString(item.role),
          duration: asString(item.duration),
          description: asString(item.description),
        }))
      : [],
    education: Array.isArray(payload.education)
      ? payload.education.map((item) => ({
          ...createEducationItem(),
          institutionName: asString(item.institutionName),
          degree: asString(item.degree),
          year: asString(item.year),
          description: asString(item.description),
        }))
      : [],
    projects: Array.isArray(payload.projects)
      ? payload.projects.map((item) => ({
          ...createProjectItem(),
          projectName: asString(item.projectName),
          description: asString(item.description),
          techStack: asStringArray(item.techStack),
          githubLink: asString(item.githubLink),
          liveLink: asString(item.liveLink),
        }))
      : [],
    certifications: asStringArray(payload.certifications).length
      ? asStringArray(payload.certifications)
      : form.certifications,
    template: form.template,
    pageCount: form.pageCount,
    photo: form.photo,
    photoPosition: form.photoPosition,
    includePhoto: form.includePhoto,
    backgroundEnabled: form.backgroundEnabled,
    backgroundTheme: form.backgroundTheme,
    backgroundIntensity: form.backgroundIntensity,
  };
}

function splitTextLines(value: string) {
  return value
    .split(/\n+/)
    .map((line) => line.replace(/^[\s\u2022\-\u2013\u2014]+/, "").trim())
    .filter(Boolean);
}

function getResumeText(data: ResumeData) {
  return [
    data.personalInfo.fullName,
    data.personalInfo.title,
    data.summary,
    data.skills.join(" "),
    ...data.experience.flatMap((item) => [
      item.role,
      item.companyName,
      item.description,
    ]),
    ...data.projects.flatMap((item) => [
      item.projectName,
      item.description,
      item.techStack.join(" "),
    ]),
    ...data.education.flatMap((item) => [
      item.degree,
      item.institutionName,
      item.description,
    ]),
    data.certifications.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function extractKeywords(value: string) {
  const counts = new Map<string, number>();

  value
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !stopWords.has(token))
    .forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([keyword]) => keyword)
    .slice(0, 16);
}

function calculateKeywordFit(jobDescription: string, data: ResumeData) {
  const keywords = extractKeywords(jobDescription);
  const resumeText = getResumeText(data);
  const matched = keywords.filter((keyword) => resumeText.includes(keyword));
  const missing = keywords.filter((keyword) => !resumeText.includes(keyword));
  const score = keywords.length
    ? Math.round((matched.length / keywords.length) * 100)
    : data.skills.length
      ? 72
      : 0;

  return { keywords, matched, missing, score };
}

function compressBullets(value: string, maxWords = 22) {
  return splitTextLines(value)
    .map((line) => {
      const words = line.split(/\s+/);
      return words.length > maxWords ? `${words.slice(0, maxWords).join(" ")}.` : line;
    })
    .join("\n");
}

function addMetricHint(value: string) {
  return splitTextLines(value)
    .map((line) =>
      /\d/.test(line)
        ? line
        : `${line.replace(/[.]+$/, "")}, improving delivery quality and measurable user impact.`
    )
    .join("\n");
}

function applyLocalResumeUpgrade(data: ResumeData, mode: "stronger" | "shorter" | "metrics" | "ats") {
  if (mode === "stronger" || mode === "ats") {
    return {
      ...data,
      summary:
        data.summary ||
        `${data.personalInfo.title || "Developer"} focused on shipping reliable product experiences.\nStrong in modern web development, collaboration, and delivery quality.\nKnown for clean execution, maintainable systems, and recruiter-friendly communication.`,
      experience: enhanceExperienceItems(data.experience, data.skills),
      projects: enhanceProjectItems(data.projects, data.skills),
      atsMode: true,
      pageCount: mode === "ats" ? 1 : data.pageCount,
      template: mode === "ats" ? "professional" : data.template,
    };
  }

  if (mode === "shorter") {
    return {
      ...data,
      summary: compressBullets(data.summary, 18),
      experience: data.experience.map((item) => ({
        ...item,
        description: compressBullets(item.description, 20),
      })),
      projects: data.projects.map((item) => ({
        ...item,
        description: compressBullets(item.description, 18),
      })),
    };
  }

  return {
    ...data,
    experience: data.experience.map((item) => ({
      ...item,
      description: addMetricHint(item.description),
    })),
    projects: data.projects.map((item) => ({
      ...item,
      description: addMetricHint(item.description),
    })),
  };
}

function buildResumePrompt(form: AiResumeForm) {
  return `Create a professional, ATS-friendly software resume as strict JSON.

Target role: ${form.targetRole || form.title}
Target company: ${form.targetCompany || "Not specified"}
Target industry: ${form.targetIndustry || "Not specified"}
Experience level: ${form.experienceLevel}
Writing tone: ${form.tone}
Preferred template: ${form.template}
Maximum pages: ${form.strictOnePage ? 1 : form.pageCount}
Strict one-page mode: ${form.strictOnePage ? "Yes, prioritize concise content that fits one page." : "No, use the selected page limit."}

Output rules:
- Keep the resume concise, readable, and recruiter-friendly.
- Use plain English and standard ATS-safe headings.
- Do not use tables, columns, emojis, icons, ratings, or decorative language.
- Summary must be 2-3 concise lines, not first person, not generic fluff.
- Experience bullets must be 2-4 bullets per role.
- Project bullets must be 2-3 bullets per project.
- Start bullets with strong action verbs.
- Mention technologies only when relevant.
- Include metrics only when the provided information supports them.
- Do not repeat the same wording across bullets.
- Do not invent company names, degrees, dates, certifications, links, or metrics.

Personal info:
Name: ${form.fullName}
Current title: ${form.title}
Email: ${form.email}
Phone: ${form.phone}
Location: ${form.location}
Website: ${form.website}
LinkedIn: ${form.linkedin}
GitHub: ${form.github}

Job description or target posting:
${form.jobDescription || "No job description provided."}

Candidate background:
${form.background}

Known skills: ${form.skills.join(", ") || "Infer from background."}

Education notes:
${form.education || "Use only if provided in the background."}

Project notes:
${form.projects || "Use only if provided in the background."}

Certifications: ${form.certifications.join(", ") || "None provided."}

Return only JSON with this shape:
{
  "personalInfo": {
    "fullName": "string",
    "title": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "linkedin": "string",
    "github": "string"
  },
  "summary": "2-3 newline-separated professional summary lines",
  "skills": ["8-16 ATS keywords drawn only from the candidate profile and target job"],
  "experience": [
    {
      "companyName": "string",
      "role": "string",
      "duration": "string",
      "description": "2-4 newline-separated impact bullets"
    }
  ],
  "projects": [
    {
      "projectName": "string",
      "description": "2-3 newline-separated impact bullets",
      "techStack": ["string"],
      "githubLink": "string",
      "liveLink": "string"
    }
  ],
  "education": [
    {
      "institutionName": "string",
      "degree": "string",
      "year": "string",
      "description": "short optional bullet"
    }
  ],
  "certifications": ["string"]
}

Keep the content honest to the candidate details. Do not invent company names, degrees, dates, certifications, links, or metrics unless the user gave enough evidence.`;
}

export default function AiResumeGeneratorPage() {
  const [form, setForm] = useState<AiResumeForm>(initialForm);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [previousResumeData, setPreviousResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState<"pdf" | "docx" | null>(null);
  const [photoUpload, setPhotoUpload] = useState<UploadStatus>(idleUploadStatus);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(null);
  const [activeStep, setActiveStep] = useState<WizardStepId>("profile");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("form");
  const [versionHistory, setVersionHistory] = useState<Array<{ label: string; data: ResumeData }>>([]);
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false);

  const previewData = useMemo(
    () =>
      prepareResumeForOutput(
        resumeData ?? {
          ...emptyResumeData,
          template: form.template,
          pageCount: form.pageCount,
          photo: form.photo,
          photoPosition: form.photoPosition,
          includePhoto: form.includePhoto,
          backgroundEnabled: form.backgroundEnabled,
          backgroundTheme: form.backgroundTheme,
          backgroundIntensity: form.backgroundIntensity,
        }
      ),
    [
      form.backgroundEnabled,
      form.backgroundIntensity,
      form.backgroundTheme,
      form.includePhoto,
      form.pageCount,
      form.photo,
      form.photoPosition,
      form.template,
      resumeData,
    ]
  );
  const insights = useMemo(
    () => calculateResumeInsights(previewData),
    [previewData]
  );
  const canExport = Boolean(resumeData) && insights.isReady;
  const keywordFit = useMemo(
    () => calculateKeywordFit(form.jobDescription, previewData),
    [form.jobDescription, previewData]
  );
  const formCompletion = useMemo(() => {
    const required = [
      form.apiKey,
      form.fullName,
      form.targetRole,
      form.background,
      form.skills.length ? "skills" : "",
    ];

    return Math.round((required.filter(Boolean).length / required.length) * 100);
  }, [form]);
  const formMissingItems = useMemo(() => {
    const missing: string[] = [];

    if (!form.apiKey.trim()) missing.push("Gemini API key");
    if (!form.fullName.trim()) missing.push("Full name");
    if (!form.targetRole.trim()) missing.push("Target role");
    if (!form.background.trim()) missing.push("Background details");
    if (!form.skills.length) missing.push("Skills");

    return missing;
  }, [form]);
  const isFormReady = formMissingItems.length === 0;

  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(AI_RESUME_AUTOSAVE_KEY);
      const storedProfile = readStoredUserProfile();

      if (savedDraft) {
        setForm(JSON.parse(savedDraft) as AiResumeForm);
        showToast({
          title: "AI resume draft restored",
          description: "Your last saved AI resume form was loaded.",
          variant: "info",
        });
      } else if (storedProfile) {
        setForm((current) => ({
          ...current,
          fullName: storedProfile.fullName || current.fullName,
          title: storedProfile.title || current.title,
          email: storedProfile.email || current.email,
          phone: storedProfile.phone || current.phone,
          location: storedProfile.location || current.location,
          website: storedProfile.website || current.website,
          linkedin: storedProfile.linkedin || current.linkedin,
          github: storedProfile.github || current.github,
        }));
      }
    } catch {
      showToast({
        title: "Could not restore AI draft",
        description: "The saved draft was invalid, so the sample form stayed loaded.",
        variant: "error",
      });
    } finally {
      setHasHydratedDraft(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedDraft) return;

    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(AI_RESUME_AUTOSAVE_KEY, JSON.stringify(form));
      } catch {
        // Ignore storage failures; the editor state remains available in memory.
      }
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [form, hasHydratedDraft]);

  useEffect(() => {
    if (!hasHydratedDraft) return;

    storeUserProfile({
      fullName: form.fullName,
      title: form.title,
      email: form.email,
      phone: form.phone,
      location: form.location,
      website: form.website,
      linkedin: form.linkedin,
      github: form.github,
    });
  }, [form, hasHydratedDraft]);

  const updateForm = <Key extends keyof AiResumeForm>(
    key: Key,
    value: AiResumeForm[Key]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleResetForm = () => {
    window.localStorage.removeItem(AI_RESUME_AUTOSAVE_KEY);
    setForm(initialForm);
    setResumeData(null);
    setPreviousResumeData(null);
    setError("");
    setPreviewMode("form");
    showToast({
      title: "AI resume form reset",
      description: "The default sample prompt form has been restored.",
      variant: "success",
    });
  };

  const handleLoadSample = () => {
    setForm(initialForm);
    showToast({
      title: "Sample AI form loaded",
      description: "Edit the sample and it will autosave.",
      variant: "success",
    });
  };

  const handlePhotoChange = async (file: File | null) => {
    if (!file) {
      updateForm("photo", null);
      updateForm("includePhoto", false);
      setPhotoUpload(idleUploadStatus);
      return;
    }

    setPhotoUpload({
      state: "uploading",
      progress: 2,
      fileName: file.name,
      message: "Uploading resume photo...",
    });

    try {
      const source = await readFileAsDataUrl(file, (progress) => {
        setPhotoUpload({
          state: "uploading",
          progress,
          fileName: file.name,
          message: "Uploading resume photo...",
        });
      });

      setPhotoUpload({
        state: "processing",
        progress: 88,
        fileName: file.name,
        message: "Optimizing photo for export...",
      });

      const normalizedPhoto = await normalizePhotoDataUrl(source);
      updateForm("photo", normalizedPhoto);
      updateForm("includePhoto", true);
      setPhotoUpload({
        state: "complete",
        progress: 100,
        fileName: file.name,
        message: "Photo upload complete.",
      });
      window.setTimeout(() => setPhotoUpload(idleUploadStatus), 1800);
    } catch {
      updateForm("photo", null);
      updateForm("includePhoto", false);
      setPhotoUpload({
        state: "error",
        progress: 0,
        fileName: file.name,
        message: "Photo upload failed. Try a smaller PNG or JPG.",
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.apiKey.trim()) {
      setError("Add your own Gemini API key before generating the resume.");
      return;
    }

    if (!form.fullName.trim() || !form.targetRole.trim() || !form.background.trim()) {
      setError("Full name, target role, and background details are required.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          form.model.trim() || "gemini-2.5-flash"
        )}:generateContent?key=${encodeURIComponent(form.apiKey.trim())}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: buildResumePrompt(form) }],
              },
            ],
            generationConfig: {
              temperature: 0.35,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      const result = (await response.json()) as GeminiResponse;

      if (!response.ok) {
        throw new Error(result.error?.message || "Gemini could not generate the resume.");
      }

      const text = result.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim();

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      const payload = JSON.parse(extractJson(text)) as GeneratedResumePayload;
      const normalizedResume = normalizeGeneratedResume(payload, {
        ...form,
        pageCount: form.strictOnePage ? 1 : form.pageCount,
      });

      setPreviousResumeData(resumeData);
      setResumeData(normalizedResume);
      setVersionHistory((current) => [
        {
          label: `Generated ${new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}`,
          data: normalizedResume,
        },
        ...current,
      ].slice(0, 5));
      setLastGeneratedAt(new Date());
      setActiveStep("review");
      setPreviewMode("score");
      showToast({
        title: "AI resume generated",
        description: "Review the score panel, then preview or download.",
        variant: "success",
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while generating the resume."
      );
      showToast({
        title: "AI generation failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong while generating the resume.",
        variant: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateDocument = () => {
    if (!canExport) return;
    openGeneratedDocument(createResumeDocument(previewData));
    showToast({
      title: "Resume preview opened",
      description: "Your generated AI resume opened in a new tab.",
      variant: "success",
    });
  };

  const handlePrint = () => {
    if (!canExport) return;
    printResumeDocument(previewData);
    showToast({
      title: "Print preview opened",
      description: "Use your browser dialog to save or print the resume.",
      variant: "success",
    });
  };

  const handleExportPdf = async () => {
    if (!canExport) return;
    setIsExporting("pdf");
    try {
      await exportResumePdf(previewData);
      showToast({
        title: "PDF downloaded",
        description: "Your AI resume PDF export is ready.",
        variant: "success",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportDocx = async () => {
    if (!canExport) return;
    setIsExporting("docx");
    try {
      await exportResumeDocx(previewData);
      showToast({
        title: "DOCX downloaded",
        description: "Your editable AI resume export is ready.",
        variant: "success",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleLocalUpgrade = (mode: "stronger" | "shorter" | "metrics" | "ats") => {
    if (!resumeData) return;

    const upgradedResume = applyLocalResumeUpgrade(resumeData, mode);
    const labels = {
      stronger: "Stronger bullets",
      shorter: "Shorter copy",
      metrics: "Metric prompts",
      ats: "ATS-safe pass",
    };

    setPreviousResumeData(resumeData);
    setResumeData(upgradedResume);
    setVersionHistory((current) => [
      {
        label: `${labels[mode]} ${new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })}`,
        data: upgradedResume,
      },
      ...current,
    ].slice(0, 5));
    setPreviewMode("score");
  };

  const restoreVersion = (data: ResumeData) => {
    setPreviousResumeData(resumeData);
    setResumeData(data);
    setPreviewMode("preview");
  };

  const activeStepIndex = wizardSteps.findIndex((step) => step.id === activeStep);
  const goToNextStep = () => {
    const nextStep = wizardSteps[Math.min(activeStepIndex + 1, wizardSteps.length - 1)];
    setActiveStep(nextStep.id);
  };

  const goToPreviousStep = () => {
    const previousStep = wizardSteps[Math.max(activeStepIndex - 1, 0)];
    setActiveStep(previousStep.id);
  };

  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden">
      <PageHeader
        badge="AI Resume Generator"
        title="AI resume builder"
        description="Draft with Gemini, then preview and export."
        action={
          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-2">
                <KeyRound className="h-3.5 w-3.5" />
                Own Gemini Key
              </Badge>
              <Badge variant="success" className="gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                AI Drafting
              </Badge>
              {lastGeneratedAt ? (
                <Badge variant="secondary" className="gap-2">
                  <WandSparkles className="h-3.5 w-3.5" />
                  Generated {lastGeneratedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </Badge>
              ) : null}
            </div>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/resume-generator">
                <ArrowLeft className="h-4 w-4" />
                Resume Builder
              </Link>
            </Button>
          </div>
        }
      />

      <section data-motion-skip className="grid w-full max-w-full grid-cols-1 gap-6">
        <Card className="min-w-0 bg-white/[0.045] fade-in-up">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-white">AI Resume Template Form</CardTitle>
            <CardDescription>
              Fill the structured template and generate a ready-to-preview resume with Gemini.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-3 lg:grid-cols-5">
                {wizardSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = activeStep === step.id;
                  const isComplete = index < activeStepIndex;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveStep(step.id)}
                      className={`flex min-w-0 items-start gap-3 rounded-2xl border p-4 text-left transition ${
                        isActive
                          ? "border-cyan-300/35 bg-cyan-300/10"
                          : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.055]"
                      }`}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        isActive || isComplete ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-slate-300"
                      }`}>
                        {isComplete ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-white">{step.label}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-400">{step.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Gauge className="h-4 w-4 text-cyan-200" />
                    Form Completion
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#67e8f9,#8b5cf6)]" style={{ width: `${formCompletion}%` }} />
                  </div>
                  <div className="mt-2 text-sm text-slate-300">{formCompletion}% ready</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Target className="h-4 w-4 text-violet-200" />
                    Keyword Fit
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#a78bfa,#22d3ee)]" style={{ width: `${keywordFit.score}%` }} />
                  </div>
                  <div className="mt-2 text-sm text-slate-300">{keywordFit.score}% matched</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <ShieldCheck className="h-4 w-4 text-emerald-200" />
                    Export Gate
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-300">
                    {canExport ? "Ready for PDF, DOCX, and print." : "Generate and pass quality checks to unlock exports."}
                  </div>
                </div>
              </div>

              {activeStep === "profile" ? (
                <FormSection
                  icon={KeyRound}
                  step="Step 01"
                  title="Profile and Gemini Access"
                  description="Add your Gemini key and header details."
                >
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Gemini API Key</label>
                        <Input
                          type="password"
                          value={form.apiKey}
                          placeholder="Paste your Gemini API key"
                          onChange={(event) => updateForm("apiKey", event.target.value)}
                        />
                        <FieldIssue show={!form.apiKey.trim()}>
                          Gemini API key is required for AI generation.
                        </FieldIssue>
                        <p className="text-xs leading-5 text-slate-400">
                          Required only when the user wants Gemini to generate resume content. The normal resume builder does not need this key.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Model</label>
                        <Input
                          value={form.model}
                          placeholder="gemini-2.5-flash"
                          onChange={(event) => updateForm("model", event.target.value)}
                        />
                      </div>
                      {personalFields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <label className="text-sm font-medium text-slate-200">{field.label}</label>
                          <Input
                            value={form[field.key]}
                            placeholder={field.placeholder}
                            onChange={(event) => updateForm(field.key, event.target.value)}
                          />
                          <FieldIssue
                            show={
                              (field.key === "fullName" ||
                                field.key === "email" ||
                                field.key === "title") &&
                              !form[field.key].trim()
                            }
                          >
                            {field.label} is recommended for a complete resume header.
                          </FieldIssue>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                          <ImageUp className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white">Resume Header Photo</div>
                          <p className="mt-1 text-xs leading-6 text-muted-foreground">
                            Upload a professional headshot to place it on the right side of the resume header. Keep it clean and recruiter-appropriate.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_140px] md:items-start">
                        <div className="space-y-3">
                          <Input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(event) => handlePhotoChange(event.target.files?.[0] ?? null)}
                          />
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => handlePhotoChange(null)}
                            >
                              Remove Photo
                            </Button>
                          </div>
                          <ToggleCard
                            checked={form.includePhoto}
                            label="Show photo in header"
                            description="Show photo in preview and exports."
                            onChange={(value) => updateForm("includePhoto", value)}
                          />
                          <UploadMeter status={photoUpload} />
                          {form.photo ? (
                            <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/35 p-3">
                              <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
                                <span>Photo vertical focus</span>
                                <span>{form.photoPosition}%</span>
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={100}
                                value={form.photoPosition}
                                onChange={(event) =>
                                  updateForm("photoPosition", Number(event.target.value))
                                }
                                className="h-2 w-full accent-cyan-300"
                              />
                            </div>
                          ) : null}
                        </div>

                        <div className="flex justify-start md:justify-end">
                          {form.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={form.photo}
                              alt="Resume header preview"
                              className="h-36 w-28 rounded-lg border border-slate-900 bg-white object-cover"
                              style={{ objectPosition: `50% ${form.photoPosition}%` }}
                            />
                          ) : (
                            <div className="flex h-36 w-28 items-center justify-center rounded-lg border-2 border-slate-900 bg-white text-xs font-bold uppercase tracking-[0.28em] text-slate-900">
                              PHOTO
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </FormSection>
              ) : null}

              {activeStep === "target" ? (
                <FormSection
                  icon={Target}
                  step="Step 02"
                  title="Targeting and AI Direction"
                  description="Set role, company, tone, and template."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Target Role</label>
                      <Input
                        value={form.targetRole}
                        placeholder="Frontend Engineer"
                        onChange={(event) => updateForm("targetRole", event.target.value)}
                      />
                      <FieldIssue show={!form.targetRole.trim()}>
                        Target role is required before AI generation.
                      </FieldIssue>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Target Company</label>
                      <Input
                        value={form.targetCompany}
                        placeholder="Vercel, Razorpay, Swiggy, or startup"
                        onChange={(event) => updateForm("targetCompany", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Experience Level</label>
                      <select
                        value={form.experienceLevel}
                        onChange={(event) => updateForm("experienceLevel", event.target.value)}
                        className="resume-select h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-foreground outline-none transition focus:border-primary/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-primary/20"
                      >
                        <option>Fresher</option>
                        <option>Internship</option>
                        <option>Junior</option>
                        <option>Mid-level</option>
                        <option>Senior</option>
                        <option>Lead</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Industry</label>
                      <select
                        value={form.targetIndustry}
                        onChange={(event) => updateForm("targetIndustry", event.target.value)}
                        className="resume-select h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-foreground outline-none transition focus:border-primary/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">Choose industry</option>
                        {industryOptions.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">AI Tone</label>
                      <select
                        value={form.tone}
                        onChange={(event) => updateForm("tone", event.target.value)}
                        className="resume-select h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-foreground outline-none transition focus:border-primary/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-primary/20"
                      >
                        {toneOptions.map((item) => <option key={item}>{item}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Template</label>
                      <select
                        value={form.template}
                        onChange={(event) => updateForm("template", event.target.value as ResumeTemplate)}
                        className="resume-select h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-foreground outline-none transition focus:border-primary/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="modern">Modern</option>
                        <option value="minimal">Minimal</option>
                        <option value="professional">Professional</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <span>
                        <span className="block text-sm font-semibold text-white">Strict one-page mode</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-400">Prioritize concise content and one-page fit.</span>
                      </span>
                      <input
                        type="checkbox"
                        className="h-5 w-5 accent-cyan-300"
                        checked={form.strictOnePage}
                        onChange={(event) => updateForm("strictOnePage", event.target.checked)}
                      />
                    </label>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Maximum Resume Pages</label>
                      <select
                        value={String(form.pageCount)}
                        disabled={form.strictOnePage}
                        onChange={(event) => updateForm("pageCount", Number(event.target.value) as ResumePageCount)}
                        className="resume-select h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-foreground outline-none transition disabled:opacity-50 focus:border-primary/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="1">1 page</option>
                        <option value="2">2 pages</option>
                        <option value="3">3 pages</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <span>
                        <span className="block text-sm font-semibold text-white">Premium backgrounds</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-400">
                          Add subtle ATS-safe paper styling with light structure and clear readability.
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        className="h-5 w-5 accent-cyan-300"
                        checked={form.backgroundEnabled}
                        onChange={(event) => updateForm("backgroundEnabled", event.target.checked)}
                      />
                    </label>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Background Theme</label>
                      <select
                        value={form.backgroundTheme}
                        disabled={!form.backgroundEnabled}
                        onChange={(event) =>
                          updateForm("backgroundTheme", event.target.value as ResumeBackgroundTheme)
                        }
                        className="resume-select h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-foreground outline-none transition disabled:opacity-50 focus:border-primary/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-primary/20"
                      >
                        {backgroundThemeOptions.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Background Intensity</label>
                      <select
                        value={form.backgroundIntensity}
                        disabled={!form.backgroundEnabled}
                        onChange={(event) =>
                          updateForm("backgroundIntensity", event.target.value as ResumeBackgroundIntensity)
                        }
                        className="resume-select h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-foreground outline-none transition disabled:opacity-50 focus:border-primary/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-primary/20"
                      >
                        {backgroundIntensityOptions.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </FormSection>
              ) : null}

              {activeStep === "experience" ? (
                <FormSection
                  icon={Bot}
                  step="Step 03"
                  title="Source Material and Job Match"
                  description="Add background notes and job post."
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Background, Work History, and Achievements</label>
                      <Textarea
                        value={form.background}
                        placeholder="Paste work experience, responsibilities, achievements, internships, measurable outcomes, and project impact."
                        className="min-h-[210px]"
                        onChange={(event) => updateForm("background", event.target.value)}
                      />
                      <FieldIssue show={!form.background.trim()}>
                        Add background details before AI generation.
                      </FieldIssue>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Target Job Description</label>
                      <Textarea
                        value={form.jobDescription}
                        placeholder="Paste the job post so VampForge can show keyword fit and Gemini can tailor the resume."
                        className="min-h-[160px]"
                        onChange={(event) => updateForm("jobDescription", event.target.value)}
                      />
                    </div>
                    <TagInput
                      label="Skills"
                      placeholder="Add a skill and press Enter"
                      value={form.skills}
                      onChange={(value) => updateForm("skills", value)}
                    />
                    <FieldIssue show={!form.skills.length}>
                      Add at least one skill before AI generation.
                    </FieldIssue>
                    <div className="flex flex-wrap gap-2">
                      {keywordFit.missing.slice(0, 8).map((keyword) => (
                        <span key={keyword} className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">
                          Missing: {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </FormSection>
              ) : null}

              {activeStep === "sections" ? (
                <FormSection
                  icon={Layers3}
                  step="Step 04"
                  title="Supporting Resume Sections"
                  description="Add education, projects, and proof."
                >
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Education Notes</label>
                        <Textarea
                          value={form.education}
                          placeholder="Degree, institution, year, CGPA, coursework."
                          onChange={(event) => updateForm("education", event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Project Notes</label>
                        <Textarea
                          value={form.projects}
                          placeholder="Project names, tech stack, links, and outcomes."
                          onChange={(event) => updateForm("projects", event.target.value)}
                        />
                      </div>
                    </div>
                    <TagInput
                      label="Certifications"
                      placeholder="Cybersecurity Virtual Internship"
                      value={form.certifications}
                      onChange={(value) => updateForm("certifications", value)}
                    />
                  </div>
                </FormSection>
              ) : null}

              {activeStep === "review" ? (
                <FormSection
                  icon={ClipboardCheck}
                  step="Step 05"
                  title="Review, Improve, and Export"
                  description="Check ATS fit and export readiness."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-sm font-semibold text-white">Resume Score</div>
                      <div className="mt-3 text-4xl font-semibold text-white">{insights.score}/100</div>
                      <div className="mt-2 text-sm text-slate-400">{insights.label}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-sm font-semibold text-white">ATS Readiness</div>
                      <div className="mt-3 text-4xl font-semibold text-white">{insights.atsScore}/100</div>
                      <div className="mt-2 text-sm text-slate-400">
                        {keywordFit.matched.length} keywords matched, {insights.blockingIssues.length} blocking issue{insights.blockingIssues.length === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {insights.qualityChecks.map((check) => (
                      <div key={check.label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          {check.passed ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <AlertTriangle className="h-4 w-4 text-amber-200" />}
                          {check.label}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{check.detail}</p>
                      </div>
                    ))}
                  </div>
                  {insights.blockingIssues.length ? (
                    <div className="mt-5 space-y-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                      <div className="text-sm font-semibold text-amber-100">What still needs fixing</div>
                      {insights.blockingIssues.map((issue) => (
                        <div key={issue} className="text-sm leading-6 text-amber-50">
                          - {issue}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {insights.strengths.length ? (
                    <div className="mt-5 space-y-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                      <div className="text-sm font-semibold text-emerald-100">What already looks strong</div>
                      {insights.strengths.slice(0, 4).map((item) => (
                        <div key={item} className="text-sm leading-6 text-emerald-50">
                          - {item}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" disabled={!resumeData} onClick={() => handleLocalUpgrade("stronger")}>
                      <Zap className="h-4 w-4" />
                      Make Stronger
                    </Button>
                    <Button type="button" variant="secondary" disabled={!resumeData} onClick={() => handleLocalUpgrade("shorter")}>
                      <SlidersHorizontal className="h-4 w-4" />
                      Make Shorter
                    </Button>
                    <Button type="button" variant="secondary" disabled={!resumeData} onClick={() => handleLocalUpgrade("metrics")}>
                      <Gauge className="h-4 w-4" />
                      Add Metric Prompts
                    </Button>
                    <Button type="button" variant="secondary" disabled={!resumeData} onClick={() => handleLocalUpgrade("ats")}>
                      <ShieldCheck className="h-4 w-4" />
                      Make ATS-Safe
                    </Button>
                  </div>
                  {previousResumeData ? (
                    <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
                      Before/after comparison is active. Your latest version changed from {previousResumeData.experience.length} experience entries and {previousResumeData.projects.length} projects to {previewData.experience.length} experience entries and {previewData.projects.length} projects.
                    </div>
                  ) : null}
                  {versionHistory.length ? (
                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <History className="h-4 w-4 text-cyan-200" />
                        Saved Versions
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {versionHistory.map((version) => (
                          <Button key={version.label} type="button" variant="outline" size="sm" onClick={() => restoreVersion(version.data)}>
                            <RotateCcw className="h-3.5 w-3.5" />
                            {version.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </FormSection>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-100">
                  {error}
                </div>
              ) : null}

              <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.9),rgba(10,18,35,0.72))] p-5 sm:p-6">
                <div className="mb-5">
                  <div className="section-label">Final Step</div>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
                    Generate, Preview, and Download
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Use these actions after completing the AI resume form.
                  </p>
                </div>

                <div
                  className={`mb-4 rounded-2xl border p-4 ${
                    isFormReady && canExport
                      ? "border-emerald-300/20 bg-emerald-300/10"
                      : "border-amber-300/20 bg-amber-300/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isFormReady && canExport ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">
                        {isFormReady && canExport
                          ? "AI resume is ready to preview and download."
                          : resumeData
                            ? "Resolve quality checks before export."
                            : "Complete these fields first."}
                      </div>
                      {!(isFormReady && canExport) ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(isFormReady && resumeData ? insights.blockingIssues : formMissingItems).map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1 text-xs text-amber-100"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="action-bar justify-start sm:justify-start">
                  <Button type="button" variant="secondary" onClick={goToPreviousStep} disabled={activeStepIndex === 0}>
                    Previous
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleLoadSample}>
                    <Sparkles className="h-4 w-4" />
                    Load Sample
                  </Button>
                  <Button type="button" variant="outline" onClick={handleResetForm}>
                    <RotateCcw className="h-4 w-4" />
                    Reset Form
                  </Button>
                  {activeStep !== "review" ? (
                    <Button type="button" variant="secondary" onClick={goToNextStep}>
                      Next Step
                    </Button>
                  ) : null}
                  <Button type="submit" size="lg" disabled={!isFormReady || isGenerating}>
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <WandSparkles className="h-4 w-4" />
                    )}
                    {isGenerating ? "Generating Resume..." : "Generate AI Resume"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleGenerateDocument} disabled={!canExport}>
                    <Eye className="h-4 w-4" />
                    Preview Resume
                  </Button>
                  <Button type="button" variant="secondary" onClick={handlePrint} disabled={!canExport}>
                    <Printer className="h-4 w-4" />
                    Print Resume
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleExportPdf}
                    disabled={!canExport || isExporting !== null}
                  >
                    <Download className="h-4 w-4" />
                    {isExporting === "pdf" ? "Exporting PDF..." : "Download PDF"}
                  </Button>
                  <Button
                    type="button"
                    variant="accent"
                    onClick={handleExportDocx}
                    disabled={!canExport || isExporting !== null}
                  >
                    <FileSignature className="h-4 w-4" />
                    {isExporting === "docx" ? "Exporting DOCX..." : "Download DOCX"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
            {[
              { id: "form" as const, label: "Form", icon: CircleDot },
              { id: "preview" as const, label: "Preview", icon: Eye },
              { id: "score" as const, label: "Score", icon: Gauge },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreviewMode(item.id)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    previewMode === item.id
                      ? "bg-cyan-300 text-slate-950"
                      : "text-slate-300 hover:bg-white/[0.055] hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {previewMode === "score" ? (
            <Card className="bg-white/[0.045]">
              <CardHeader className="border-b border-white/10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Gauge className="h-4 w-4 text-cyan-200" />
                  AI Quality Panel
                </CardTitle>
                <CardDescription>
                  Live checks for ATS fit, missing keywords, bullet strength, and export readiness.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Resume</div>
                    <div className="mt-2 text-3xl font-semibold text-white">{insights.score}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">ATS</div>
                    <div className="mt-2 text-3xl font-semibold text-white">{insights.atsScore}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {insights.improvementSuggestions.slice(0, 4).map((item) => (
                    <div key={item} className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-slate-300">
                      <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-200" />
                      {item}
                    </div>
                  ))}
                  {!insights.improvementSuggestions.length ? (
                    <div className="flex items-start gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm leading-6 text-emerald-100">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
                      No major quality blockers right now.
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywordFit.missing.slice(0, 6).map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-xs text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <ResumePreview data={previewData} />
        </div>
      </section>
    </div>
  );
}
