"use client";

import { useMemo, useReducer, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Download,
  Eye,
  FileSignature,
  Layers3,
  Printer,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { openGeneratedDocument } from "@/lib/export-utils";
import { ResumeForm } from "./components/ResumeForm";
import { ResumeInsightsPanel } from "./components/ResumeInsightsPanel";
import { ResumePreview } from "./components/ResumePreview";
import { TemplateSelector } from "./components/TemplateSelector";
import { createResumeDocument } from "./components/document";
import {
  calculateResumeInsights,
  enhanceExperienceItems,
  enhanceProjectItems,
  generateSmartSummary,
  prepareResumeForOutput,
} from "./components/intelligence";
import {
  exportResumeDocx,
  exportResumePdf,
  printResumeDocument,
} from "./components/export";
import {
  createEducationItem,
  createExperienceItem,
  createProjectItem,
  type EducationItem,
  type ExperienceItem,
  type ResumeBackgroundIntensity,
  type ResumeBackgroundTheme,
  type ResumePageCount,
  type ResumeData,
  type ResumeTemplate,
  type UploadStatus,
} from "./components/types";

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "Janmejoy Mahato",
    title: "Web Developer",
    email: "janmejoymahato529@gmail.com",
    phone: "+91 7477661933",
    location: "Kolkata, India",
    website: "https://janmejoy.is-a.dev",
    linkedin: "https://linkedin.com/in/janmejoy",
    github: "https://github.com/janmej0y",
  },
  summary:
    "Final-year B.Tech CSE student with hands-on full-stack web development experience.\nSkilled in React, Next.js, Node.js, Express, Supabase, MongoDB, Python, Redis, and secure authentication.\nQuick learner focused on clean UI, scalable products, and agile team contribution.",
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
    "Firebase Studio",
  ],
  experience: [
    {
      ...createExperienceItem(),
      companyName: "Personal and Academic Projects",
      role: "Full Stack Web Developer",
      duration: "2023 - Present",
      description:
        "Built full-stack applications with authentication, databases, dashboards, and deployment-ready frontend flows\nImplemented projects using React, Next.js, Node.js, Express, Supabase, MongoDB, and Firebase-ready architecture\nPracticed secure coding, clean UI structure, Git workflow, and responsive design",
    },
    {
      ...createExperienceItem(),
      companyName: "Self-Learning and Technical Training",
      role: "Web Development Trainee",
      duration: "2022 - Present",
      description:
        "Completed training across full-stack development, cybersecurity, ethical hacking, and cloud foundations\nStrengthened core CS concepts including data structures, backend APIs, authentication, and database integration",
    },
  ],
  education: [
    {
      ...createEducationItem(),
      institutionName: "Greater Kolkata College of Engineering & Management",
      degree: "Bachelor of Technology in Computer Science and Engineering",
      year: "2022 - 2026",
      description:
        "CGPA: 7.20/10. Focused on software engineering, data structures, web development, and practical product building.",
    },
    {
      ...createEducationItem(),
      institutionName: "R.B.B. High (H.S) School",
      degree: "Higher Secondary - WBCHSE",
      year: "2021 - 2022",
      description: "Percentage: 85.60%",
    },
    {
      ...createEducationItem(),
      institutionName: "R.B.B. High (H.S) School",
      degree: "Secondary - WBBSE",
      year: "2019 - 2020",
      description: "Percentage: 69.70%",
    },
  ],
  projects: [
    {
      ...createProjectItem(),
      projectName: "Online Voting System",
      description:
        "Developed a full-stack voting application with secure authentication, single-vote validation, and real-time result flow.\nBuilt backend APIs and frontend screens for a simple, reliable voting experience.",
      techStack: ["Node.js", "Express", "SQLite", "JWT", "bcrypt", "Tailwind CSS"],
      githubLink: "https://github.com/janmej0y/Online-Voting-System",
      liveLink: "https://online-voting-system-henna.vercel.app",
    },
    {
      ...createProjectItem(),
      projectName: "RentHub",
      description:
        "Built a rental platform with authentication, storage, and listing management using Supabase.\nDesigned responsive product pages and clean data flows for renters and property listings.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
      githubLink: "https://github.com/janmej0y/RentHub",
      liveLink: "https://rent-hub-two.vercel.app",
    },
    {
      ...createProjectItem(),
      projectName: "Kurmi Chatbot",
      description:
        "Created an AI chatbot using Gemini API with authentication, Markdown support, and MongoDB storage.\nFocused on a smooth chat interface, secure login, and practical AI response flow.",
      techStack: ["Next.js", "MongoDB", "NextAuth", "Gemini API", "Markdown"],
      githubLink: "https://github.com/janmej0y/Baklol-Chatbot",
      liveLink: "https://baklol-chatbot.vercel.app",
    },
  ],
  certifications: [
    "Cybersecurity Virtual Internship",
    "Full Stack BCT Training",
    "Ethical Hacking Internship",
    "Cloud Security",
    "Java Full Stack",
    "Cloud Foundation",
  ],
  achievements: ["Languages: English, Hindi, Bengali"],
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

const idleUploadStatus: UploadStatus = {
  state: "idle",
  progress: 0,
};

type ResumeAction =
  | {
      type: "updatePersonalInfo";
      field: keyof ResumeData["personalInfo"];
      value: string;
    }
  | { type: "updateSummary"; value: string }
  | {
      type: "updateSkills" | "updateCertifications" | "updateAchievements";
      value: string[];
    }
  | { type: "setTemplate"; value: ResumeTemplate }
  | { type: "setPageCount"; value: ResumePageCount }
  | { type: "setPhoto"; value: string | null }
  | { type: "setPhotoPosition"; value: number }
  | { type: "setIncludePhoto"; value: boolean }
  | { type: "setBackgroundEnabled"; value: boolean }
  | { type: "setBackgroundTheme"; value: ResumeBackgroundTheme }
  | { type: "setBackgroundIntensity"; value: ResumeBackgroundIntensity }
  | { type: "setAtsMode"; value: boolean }
  | { type: "addExperience" | "addEducation" | "addProject" }
  | { type: "removeExperience" | "removeEducation" | "removeProject"; id: string }
  | {
      type: "updateExperience";
      id: string;
      field: keyof Omit<ExperienceItem, "id">;
      value: string;
    }
  | {
      type: "updateEducation";
      id: string;
      field: keyof Omit<EducationItem, "id">;
      value: string;
    }
  | {
      type: "updateProject";
      id: string;
      field: "projectName" | "description" | "githubLink" | "liveLink";
      value: string;
    }
  | { type: "updateProjectTechStack"; id: string; value: string[] }
  | { type: "enhanceSummary" }
  | { type: "enhanceExperience" }
  | { type: "enhanceProjects" };

function resumeReducer(state: ResumeData, action: ResumeAction): ResumeData {
  switch (action.type) {
    case "updatePersonalInfo":
      return {
        ...state,
        personalInfo: {
          ...state.personalInfo,
          [action.field]: action.value,
        },
      };
    case "updateSummary":
      return { ...state, summary: action.value };
    case "updateSkills":
      return { ...state, skills: action.value };
    case "updateCertifications":
      return { ...state, certifications: action.value };
    case "updateAchievements":
      return { ...state, achievements: action.value };
    case "setTemplate":
      return {
        ...state,
        template: action.value,
        includePhoto: action.value === "executive",
      };
    case "setPageCount":
      return { ...state, pageCount: action.value };
    case "setPhoto":
      return { ...state, photo: action.value };
    case "setPhotoPosition":
      return { ...state, photoPosition: action.value };
    case "setIncludePhoto":
      return { ...state, includePhoto: action.value };
    case "setBackgroundEnabled":
      return { ...state, backgroundEnabled: action.value };
    case "setBackgroundTheme":
      return { ...state, backgroundTheme: action.value };
    case "setBackgroundIntensity":
      return { ...state, backgroundIntensity: action.value };
    case "setAtsMode":
      return {
        ...state,
        atsMode: action.value,
      };
    case "addExperience":
      return { ...state, experience: [...state.experience, createExperienceItem()] };
    case "removeExperience":
      return {
        ...state,
        experience: state.experience.filter((item) => item.id !== action.id),
      };
    case "updateExperience":
      return {
        ...state,
        experience: state.experience.map((item) =>
          item.id === action.id ? { ...item, [action.field]: action.value } : item
        ),
      };
    case "addEducation":
      return { ...state, education: [...state.education, createEducationItem()] };
    case "removeEducation":
      return {
        ...state,
        education: state.education.filter((item) => item.id !== action.id),
      };
    case "updateEducation":
      return {
        ...state,
        education: state.education.map((item) =>
          item.id === action.id ? { ...item, [action.field]: action.value } : item
        ),
      };
    case "addProject":
      return { ...state, projects: [...state.projects, createProjectItem()] };
    case "removeProject":
      return {
        ...state,
        projects: state.projects.filter((item) => item.id !== action.id),
      };
    case "updateProject":
      return {
        ...state,
        projects: state.projects.map((item) =>
          item.id === action.id ? { ...item, [action.field]: action.value } : item
        ),
      };
    case "updateProjectTechStack":
      return {
        ...state,
        projects: state.projects.map((item) =>
          item.id === action.id ? { ...item, techStack: action.value } : item
        ),
      };
    case "enhanceSummary":
      return { ...state, summary: generateSmartSummary(state) };
    case "enhanceExperience":
      return {
        ...state,
        experience: enhanceExperienceItems(state.experience, state.skills),
      };
    case "enhanceProjects":
      return {
        ...state,
        projects: enhanceProjectItems(state.projects, state.skills),
      };
    default:
      return state;
  }
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

export default function ResumeGeneratorPage() {
  const [resumeData, dispatch] = useReducer(resumeReducer, initialResumeData);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(null);
  const [isExporting, setIsExporting] = useState<"pdf" | "docx" | null>(null);
  const [photoUpload, setPhotoUpload] = useState<UploadStatus>(idleUploadStatus);

  const preparedResumeData = useMemo(
    () => prepareResumeForOutput(resumeData),
    [resumeData]
  );
  const insights = useMemo(
    () => calculateResumeInsights(preparedResumeData),
    [preparedResumeData]
  );

  const completion = useMemo(() => {
    const checkpoints = [
      resumeData.personalInfo.fullName,
      resumeData.personalInfo.title,
      resumeData.personalInfo.email,
      resumeData.summary,
      resumeData.skills.length > 0 ? "skills" : "",
      resumeData.experience.some(
        (item) => item.companyName || item.role || item.description
      )
        ? "experience"
        : "",
      resumeData.education.some(
        (item) => item.institutionName || item.degree || item.description
      )
        ? "education"
        : "",
      resumeData.projects.some(
        (item) => item.projectName || item.description || item.techStack.length > 0
      )
        ? "projects"
        : "",
      resumeData.personalInfo.website ||
      resumeData.personalInfo.linkedin ||
      resumeData.personalInfo.github,
    ];

    return Math.round(
      (checkpoints.filter(Boolean).length / checkpoints.length) * 100
    );
  }, [resumeData]);

  const visibleSections = useMemo(() => {
    return [
      resumeData.summary,
      resumeData.skills.length,
      resumeData.experience.length,
      resumeData.education.length,
      resumeData.projects.length,
      resumeData.certifications.length,
    ].filter(Boolean).length;
  }, [resumeData]);

  const selectedTemplateLabel = useMemo(() => {
    if (resumeData.template === "modern") return "Modern Template";
    if (resumeData.template === "minimal") return "Minimal Template";
    if (resumeData.template === "professional") return "Professional Template";
    return "Executive Template";
  }, [resumeData.template]);

  const generationLabel = useMemo(() => {
    if (!insights.isReady) {
      return `${insights.blockingIssues.length} quality check${
        insights.blockingIssues.length > 1 ? "s" : ""
      } blocking export`;
    }

    if (!lastGeneratedAt) {
      return "Ready to generate";
    }

    return `Generated at ${new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(lastGeneratedAt)}`;
  }, [insights.blockingIssues.length, insights.isReady, lastGeneratedAt]);

  const handlePhotoChange = async (file: File | null) => {
    if (!file) {
      dispatch({ type: "setPhoto", value: null });
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
      dispatch({ type: "setPhoto", value: normalizedPhoto });
      setPhotoUpload({
        state: "complete",
        progress: 100,
        fileName: file.name,
        message: "Photo upload complete.",
      });
      window.setTimeout(() => setPhotoUpload(idleUploadStatus), 1800);
    } catch {
      dispatch({ type: "setPhoto", value: null });
      setPhotoUpload({
        state: "error",
        progress: 0,
        fileName: file.name,
        message: "Photo upload failed. Try a smaller PNG or JPG.",
      });
    }
  };

  const handleGenerate = () => {
    if (!insights.isReady) return;
    openGeneratedDocument(createResumeDocument(preparedResumeData));
    setLastGeneratedAt(new Date());
  };

  const handlePrint = () => {
    if (!insights.isReady) return;
    printResumeDocument(preparedResumeData);
    setLastGeneratedAt(new Date());
  };

  const handleExportPdf = async () => {
    if (!insights.isReady) return;
    setIsExporting("pdf");
    try {
      await exportResumePdf(preparedResumeData);
      setLastGeneratedAt(new Date());
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportDocx = async () => {
    if (!insights.isReady) return;
    setIsExporting("docx");
    try {
      await exportResumeDocx(preparedResumeData);
      setLastGeneratedAt(new Date());
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden">
      <PageHeader
        badge="Resume Generator"
        title="Create a clean ATS resume"
        description="Edit, preview, and export a recruiter-ready resume."
        action={
          <div className="flex min-w-0 flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success" className="gap-2">
                <Eye className="h-3.5 w-3.5" />
                Live Preview
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                {selectedTemplateLabel}
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <Layers3 className="h-3.5 w-3.5" />
                Max {resumeData.pageCount} page{resumeData.pageCount > 1 ? "s" : ""}
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <WandSparkles className="h-3.5 w-3.5" />
                {generationLabel}
              </Badge>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/resume-generator/ai">
                <Bot className="h-4 w-4" />
                AI Resume
              </Link>
            </Button>
          </div>
        }
      />

      <section className="grid w-full max-w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="bg-white/[0.045] fade-in-up">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Resume Score</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {insights.score}/100
              </p>
              <p className="mt-1 break-words text-sm text-slate-400">{insights.label}</p>
            </div>
            <div className="shrink-0 rounded-2xl border border-primary/20 bg-primary/10 p-4">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045] fade-in-up delay-1">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">ATS Readiness</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {insights.atsScore}/100
              </p>
              <p className="mt-1 break-words text-sm text-slate-400">
                ATS-safe single-column layout.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <Layers3 className="h-5 w-5 text-cyan-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045] fade-in-up delay-2">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Completion</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {completion}%
              </p>
              <p className="mt-1 break-words text-sm text-slate-400">
                {visibleSections} active sections.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <FileSignature className="h-5 w-5 text-emerald-300" />
            </div>
          </CardContent>
        </Card>
      </section>

      <TemplateSelector
        selectedTemplate={resumeData.template}
        onSelect={(template) => dispatch({ type: "setTemplate", value: template })}
      />

      <section className="grid w-full max-w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.72fr)]">
        <div className="min-w-0">
          <ResumeForm
          data={resumeData}
          categorizedSkills={insights.categorizedSkills}
          onPersonalInfoChange={(field, value) =>
            dispatch({ type: "updatePersonalInfo", field, value })
          }
          onSummaryChange={(value) => dispatch({ type: "updateSummary", value })}
          onSkillsChange={(value) => dispatch({ type: "updateSkills", value })}
          onCertificationsChange={(value) =>
            dispatch({ type: "updateCertifications", value })
          }
          onAchievementsChange={(value) =>
            dispatch({ type: "updateAchievements", value })
          }
          onPageCountChange={(value) =>
            dispatch({ type: "setPageCount", value })
          }
          onAddExperience={() => dispatch({ type: "addExperience" })}
          onRemoveExperience={(id) => dispatch({ type: "removeExperience", id })}
          onExperienceChange={(id, field, value) =>
            dispatch({ type: "updateExperience", id, field, value })
          }
          onAddEducation={() => dispatch({ type: "addEducation" })}
          onRemoveEducation={(id) => dispatch({ type: "removeEducation", id })}
          onEducationChange={(id, field, value) =>
            dispatch({ type: "updateEducation", id, field, value })
          }
          onAddProject={() => dispatch({ type: "addProject" })}
          onRemoveProject={(id) => dispatch({ type: "removeProject", id })}
          onProjectChange={(id, field, value) =>
            dispatch({ type: "updateProject", id, field, value })
          }
          onProjectTechStackChange={(id, value) =>
            dispatch({ type: "updateProjectTechStack", id, value })
          }
          onPhotoChange={handlePhotoChange}
          photoUpload={photoUpload}
          onPhotoPositionChange={(value) =>
            dispatch({ type: "setPhotoPosition", value })
          }
          onToggleIncludePhoto={(value) =>
            dispatch({ type: "setIncludePhoto", value })
          }
          onToggleBackground={(value) =>
            dispatch({ type: "setBackgroundEnabled", value })
          }
          onBackgroundThemeChange={(value) =>
            dispatch({ type: "setBackgroundTheme", value })
          }
          onBackgroundIntensityChange={(value) =>
            dispatch({ type: "setBackgroundIntensity", value })
          }
          onToggleAtsMode={(value) => dispatch({ type: "setAtsMode", value })}
          onGenerateSummary={() => dispatch({ type: "enhanceSummary" })}
          onEnhanceExperience={() => dispatch({ type: "enhanceExperience" })}
          onEnhanceProjects={() => dispatch({ type: "enhanceProjects" })}
          />
        </div>

        <div className="min-w-0 xl:sticky xl:top-24 xl:h-fit">
          <ResumePreview
            data={preparedResumeData}
            actions={
              <>
                <Button onClick={handleGenerate} disabled={!insights.isReady}>
                  <WandSparkles className="h-4 w-4" />
                  Generate Resume
                </Button>
                <Button variant="secondary" onClick={handlePrint} disabled={!insights.isReady}>
                  <Printer className="h-4 w-4" />
                  Print Resume
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleExportPdf}
                  disabled={!insights.isReady || isExporting !== null}
                >
                  <Download className="h-4 w-4" />
                  {isExporting === "pdf" ? "Exporting PDF..." : "Download PDF"}
                </Button>
                <Button
                  variant="accent"
                  onClick={handleExportDocx}
                  disabled={!insights.isReady || isExporting !== null}
                >
                  <FileSignature className="h-4 w-4" />
                  {isExporting === "docx" ? "Exporting DOCX..." : "Download DOCX"}
                </Button>
              </>
            }
          />
        </div>
      </section>

      <ResumeInsightsPanel insights={insights} />
    </div>
  );
}
