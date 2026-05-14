"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import {
  Download,
  Eye,
  Headphones,
  Layers3,
  Mail,
  Phone,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { downloadTextFile, openGeneratedDocument } from "@/lib/export-utils";
import { PortfolioForm } from "./components/PortfolioForm";
import { PortfolioPreview } from "./components/PortfolioPreview";
import { createPortfolioDocument, createPortfolioFileName } from "./components/document";
import { exportPortfolioCodeZip } from "./components/export";
import {
  enhanceProjectDescription,
  generatePortfolioSummary,
  portfolioCompletion,
} from "./components/intelligence";
import {
  createAchievementItem,
  createEducationItem,
  createExperienceItem,
  createProject,
  type AchievementItem,
  type EducationItem,
  type ExperienceItem,
  type PortfolioData,
  type PortfolioTemplate,
  type SocialLinkKey,
  type UploadStatus,
} from "./components/types";

const CUSTOM_PORTFOLIO_EMAIL = "janmejoymahato529@gmail.com";
const CUSTOM_PORTFOLIO_PHONE = "7477661933";
const CUSTOM_PORTFOLIO_MAILTO = `mailto:${CUSTOM_PORTFOLIO_EMAIL}?subject=Custom Portfolio Request`;
const CUSTOM_PORTFOLIO_TEL = `tel:${CUSTOM_PORTFOLIO_PHONE}`;
const CUSTOM_PORTFOLIO_SESSION_KEY = "vampforge-portfolio-custom-popup-seen";

const idleUploadStatus: UploadStatus = {
  state: "idle",
  progress: 0,
};

const initialPortfolioData: PortfolioData = {
  template: "nova",
  name: "Janmejoy Mahato",
  title: "Web Developer",
  summary:
    "Final-year B.Tech CSE student building full-stack web apps with React, Next.js, Node.js, Express, Supabase, MongoDB, and clean product-focused UI.",
  about:
    "I build practical web products with authentication, databases, dashboards, AI features, and polished frontend flows. I care about clear UX, secure code, and shipping projects that feel complete.",
  experienceSummary:
    "Hands-on project experience across voting systems, rental platforms, AI chatbots, portfolio websites, and Python automation.",
  careerGoals:
    "I want to grow as a product-minded full-stack developer and contribute to agile teams that build secure, scalable applications.",
  techFocus:
    "Currently focused on Next.js, TypeScript, Firebase, Supabase, MongoDB, secure authentication, AI-assisted products, and premium portfolio systems.",
  clientCount: "5+",
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
  projects: [
    {
      ...createProject(),
      name: "Online Voting System",
      description:
        "Full-stack voting app with secure authentication, single-vote validation, real-time result flow, and a clean voter experience.",
      techStack: ["Node.js", "Express", "SQLite", "JWT", "bcrypt", "Tailwind CSS"],
      githubLink: "https://github.com/janmej0y/Online-Voting-System",
      liveLink: "https://online-voting-system-henna.vercel.app",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    },
    {
      ...createProject(),
      name: "RentHub",
      description:
        "Rental platform built with Next.js, TypeScript, Tailwind CSS, and Supabase for authentication, storage, and listing management.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
      githubLink: "https://github.com/janmej0y/RentHub",
      liveLink: "https://rent-hub-two.vercel.app",
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      ...createProject(),
      name: "Kurmi Chatbot",
      description:
        "AI chatbot built with Next.js, NextAuth, MongoDB, Markdown support, and Gemini API integration with secure authentication.",
      techStack: ["Next.js", "MongoDB", "NextAuth", "Gemini API", "Markdown"],
      githubLink: "https://github.com/janmej0y/Baklol-Chatbot",
      liveLink: "https://baklol-chatbot.vercel.app",
      imageUrl:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  experience: [
    {
      ...createExperienceItem(),
      company: "Personal and Academic Projects",
      role: "Full Stack Web Developer",
      duration: "2023 - Present",
      description:
        "Built full-stack applications with authentication, dashboards, databases, and deployment workflows.\nWorked with React, Next.js, Node.js, Express, Supabase, MongoDB, and Firebase-ready architecture.\nPracticed secure coding, data structures, and clean product presentation.",
    },
    {
      ...createExperienceItem(),
      company: "Self-Learning and Training",
      role: "Web Development Trainee",
      duration: "2022 - Present",
      description:
        "Completed training across full-stack development, cybersecurity, cloud foundations, and ethical hacking.\nBuilt projects independently while improving problem-solving, Git workflow, and deployment skills.",
    },
  ],
  education: [
    {
      ...createEducationItem(),
      institution: "Greater Kolkata College of Engineering & Management",
      degree: "B.Tech in Computer Science and Engineering",
      year: "2022 - 2026",
      grade: "CGPA: 7.20/10",
    },
    {
      ...createEducationItem(),
      institution: "R.B.B. High (H.S) School",
      degree: "Higher Secondary - WBCHSE",
      year: "2021 - 2022",
      grade: "85.60%",
    },
  ],
  achievements: [
    {
      ...createAchievementItem(),
      title: "Cybersecurity Virtual Internship",
      category: "Certification",
      description: "Completed cybersecurity-focused virtual internship training.",
    },
    {
      ...createAchievementItem(),
      title: "Java Full Stack",
      category: "Certification",
      description: "Completed Java full-stack training with backend and application fundamentals.",
    },
    {
      ...createAchievementItem(),
      title: "Cloud Foundation",
      category: "Certification",
      description: "Completed foundational cloud training for modern application delivery.",
    },
  ],
  socialLinks: {
    github: "https://github.com/janmej0y",
    linkedin: "https://linkedin.com/in/janmejoy",
    twitter: "",
  },
  contact: {
    email: "janmejoymahato529@gmail.com",
    phone: "+91 7477661933",
    location: "Kolkata, India",
    website: "https://janmejoy.is-a.dev",
    resumeLink: "https://janmejoy.is-a.dev",
  },
  profileImage: null,
  profileImagePosition: 18,
};

type PortfolioAction =
  | {
      type: "updateField";
      field:
        | "name"
        | "title"
        | "summary"
        | "about"
        | "experienceSummary"
        | "careerGoals"
        | "techFocus"
        | "clientCount";
      value: string;
    }
  | { type: "setTemplate"; value: PortfolioTemplate }
  | { type: "updateContact"; field: keyof PortfolioData["contact"]; value: string }
  | { type: "updateSkills"; value: string[] }
  | { type: "addProject" | "addExperience" | "addEducation" | "addAchievement" }
  | { type: "removeProject" | "removeExperience" | "removeEducation" | "removeAchievement"; id: string }
  | {
      type: "updateProjectField";
      id: string;
      field: "name" | "description" | "githubLink" | "liveLink" | "imageUrl";
      value: string;
    }
  | { type: "updateProjectTechStack"; id: string; value: string[] }
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
      type: "updateAchievement";
      id: string;
      field: keyof Omit<AchievementItem, "id">;
      value: string;
    }
  | { type: "updateSocialLink"; platform: SocialLinkKey; value: string }
  | { type: "setProfileImage"; value: string | null }
  | { type: "setProfileImagePosition"; value: number }
  | { type: "generateSummary" | "enhanceProjects" };

function portfolioReducer(
  state: PortfolioData,
  action: PortfolioAction
): PortfolioData {
  switch (action.type) {
    case "setTemplate":
      return { ...state, template: action.value };
    case "updateField":
      return { ...state, [action.field]: action.value };
    case "updateContact":
      return {
        ...state,
        contact: {
          ...state.contact,
          [action.field]: action.value,
        },
      };
    case "updateSkills":
      return { ...state, skills: action.value };
    case "addProject":
      return { ...state, projects: [...state.projects, createProject()] };
    case "addExperience":
      return { ...state, experience: [...state.experience, createExperienceItem()] };
    case "addEducation":
      return { ...state, education: [...state.education, createEducationItem()] };
    case "addAchievement":
      return { ...state, achievements: [...state.achievements, createAchievementItem()] };
    case "removeProject":
      return { ...state, projects: state.projects.filter((item) => item.id !== action.id) };
    case "removeExperience":
      return { ...state, experience: state.experience.filter((item) => item.id !== action.id) };
    case "removeEducation":
      return { ...state, education: state.education.filter((item) => item.id !== action.id) };
    case "removeAchievement":
      return { ...state, achievements: state.achievements.filter((item) => item.id !== action.id) };
    case "updateProjectField":
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
    case "updateExperience":
      return {
        ...state,
        experience: state.experience.map((item) =>
          item.id === action.id ? { ...item, [action.field]: action.value } : item
        ),
      };
    case "updateEducation":
      return {
        ...state,
        education: state.education.map((item) =>
          item.id === action.id ? { ...item, [action.field]: action.value } : item
        ),
      };
    case "updateAchievement":
      return {
        ...state,
        achievements: state.achievements.map((item) =>
          item.id === action.id ? { ...item, [action.field]: action.value } : item
        ),
      };
    case "updateSocialLink":
      return {
        ...state,
        socialLinks: {
          ...state.socialLinks,
          [action.platform]: action.value,
        },
      };
    case "setProfileImage":
      return { ...state, profileImage: action.value };
    case "setProfileImagePosition":
      return { ...state, profileImagePosition: action.value };
    case "generateSummary":
      return { ...state, summary: generatePortfolioSummary(state) };
    case "enhanceProjects":
      return {
        ...state,
        projects: state.projects.map((project) => ({
          ...project,
          description: enhanceProjectDescription(project),
        })),
      };
    default:
      return state;
  }
}

function readFileAsDataUrlWithProgress(
  file: File,
  onProgress: (progress: number) => void
) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (!event.lengthComputable) {
        onProgress(45);
        return;
      }

      onProgress(Math.min(92, Math.round((event.loaded / event.total) * 92)));
    };

    reader.onload = () => {
      if (typeof reader.result === "string") {
        onProgress(100);
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to prepare uploaded file."));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Unable to read uploaded file."));
    };

    reader.readAsDataURL(file);
  });
}

async function normalizePortfolioImageDataUrl(source: string) {
  return new Promise<string>((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => {
      const maxDimension = 1200;
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      if (!context) {
        reject(new Error("Unable to optimize image."));
        return;
      }

      context.fillStyle = "#020617";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.86));
    };

    image.onerror = () => reject(new Error("Unable to load uploaded image."));
    image.src = source;
  });
}

export default function PortfolioPage() {
  const [portfolioData, dispatch] = useReducer(portfolioReducer, initialPortfolioData);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(null);
  const [isExportingCode, setIsExportingCode] = useState(false);
  const [showCustomPortfolioPopup, setShowCustomPortfolioPopup] = useState(false);
  const [profileImageUpload, setProfileImageUpload] = useState<UploadStatus>(idleUploadStatus);
  const [resumeUpload, setResumeUpload] = useState<UploadStatus>(idleUploadStatus);

  const completion = useMemo(() => portfolioCompletion(portfolioData), [portfolioData]);

  const highlightedProjects = useMemo(
    () =>
      portfolioData.projects.filter((project) => project.name || project.description)
        .length,
    [portfolioData.projects]
  );

  const liveLinks = useMemo(
    () =>
      [
        portfolioData.socialLinks.github,
        portfolioData.socialLinks.linkedin,
        portfolioData.contact.website,
        portfolioData.contact.resumeLink,
      ].filter(Boolean).length,
    [portfolioData]
  );

  const generatedDocument = useMemo(
    () => createPortfolioDocument(portfolioData),
    [portfolioData]
  );

  const generationLabel = useMemo(() => {
    if (!lastGeneratedAt) return "Ready to generate";

    return `Generated at ${new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(lastGeneratedAt)}`;
  }, [lastGeneratedAt]);

  useEffect(() => {
    const hasSeenPopup = window.sessionStorage.getItem(CUSTOM_PORTFOLIO_SESSION_KEY);

    if (!hasSeenPopup) {
      window.sessionStorage.setItem(CUSTOM_PORTFOLIO_SESSION_KEY, "true");
      setShowCustomPortfolioPopup(true);
    }
  }, []);

  const handleProfileImageChange = async (file: File | null) => {
    if (!file) {
      dispatch({ type: "setProfileImage", value: null });
      setProfileImageUpload(idleUploadStatus);
      return;
    }

    setProfileImageUpload({
      state: "uploading",
      progress: 2,
      fileName: file.name,
      message: "Reading profile photo...",
    });

    try {
      const source = await readFileAsDataUrlWithProgress(file, (progress) => {
        setProfileImageUpload({
          state: progress >= 100 ? "processing" : "uploading",
          progress,
          fileName: file.name,
          message: progress >= 100 ? "Optimizing profile photo..." : "Uploading profile photo...",
        });
      });

      const dataUrl = await normalizePortfolioImageDataUrl(source);
      dispatch({ type: "setProfileImage", value: dataUrl });
      setProfileImageUpload({
        state: "complete",
        progress: 100,
        fileName: file.name,
        message: "Profile photo uploaded.",
      });
      window.setTimeout(() => setProfileImageUpload(idleUploadStatus), 1800);
    } catch {
      setProfileImageUpload({
        state: "error",
        progress: 0,
        fileName: file.name,
        message: "Photo upload failed. Try a smaller image.",
      });
    }
  };

  const handleResumeUpload = async (file: File | null) => {
    if (!file) {
      dispatch({ type: "updateContact", field: "resumeLink", value: "" });
      setResumeUpload(idleUploadStatus);
      return;
    }

    setResumeUpload({
      state: "uploading",
      progress: 2,
      fileName: file.name,
      message: "Attaching resume file...",
    });

    try {
      const dataUrl = await readFileAsDataUrlWithProgress(file, (progress) => {
        setResumeUpload({
          state: progress >= 100 ? "processing" : "uploading",
          progress,
          fileName: file.name,
          message: progress >= 100 ? "Connecting resume buttons..." : "Uploading resume file...",
        });
      });

      dispatch({ type: "updateContact", field: "resumeLink", value: dataUrl });
      setResumeUpload({
        state: "complete",
        progress: 100,
        fileName: file.name,
        message: "Resume uploaded and connected.",
      });
      window.setTimeout(() => setResumeUpload(idleUploadStatus), 1800);
    } catch {
      setResumeUpload({
        state: "error",
        progress: 0,
        fileName: file.name,
        message: "Resume upload failed. Try a smaller PDF or DOCX.",
      });
    }
  };

  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden">
      {showCustomPortfolioPopup ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/78 px-4 py-6 backdrop-blur-md sm:items-center">
          <div className="section-card mesh-card premium-ring relative my-auto w-full max-w-3xl overflow-hidden border-primary/20 bg-[linear-gradient(135deg,rgba(8,18,34,0.96),rgba(12,24,42,0.92))]">
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)]" />
            <div className="absolute left-0 top-12 h-40 w-40 -translate-x-1/3 rounded-full bg-cyan-400/18 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-44 w-44 translate-x-1/4 rounded-full bg-amber-300/14 blur-3xl" />

            <div className="relative p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit gap-2 border-primary/20 bg-primary/10 text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Custom Portfolio Support
                  </Badge>
                  <div className="space-y-3">
                    <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      Want a custom portfolio?
                    </h2>
                    <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                      Contact Janmejoy for a tailored premium portfolio build.
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  onClick={() => setShowCustomPortfolioPopup(false)}
                  aria-label="Close custom portfolio popup"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                  <p className="section-label text-cyan-200/80">Email</p>
                  <div className="mt-3 flex items-start gap-3">
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
                      <Mail className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Custom portfolio requests</p>
                      <p className="mt-1 text-lg font-semibold text-white break-all">
                        {CUSTOM_PORTFOLIO_EMAIL}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                  <p className="section-label text-amber-200/80">Helpline</p>
                  <div className="mt-3 flex items-start gap-3">
                    <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3">
                      <Phone className="h-5 w-5 text-amber-200" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Talk directly for support</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {CUSTOM_PORTFOLIO_PHONE}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild className="w-full sm:w-auto">
                  <a href={CUSTOM_PORTFOLIO_MAILTO}>
                    <Mail className="h-4 w-4" />
                    Custom Portfolio Generation
                  </a>
                </Button>
                <Button asChild variant="secondary" className="w-full sm:w-auto">
                  <a href={CUSTOM_PORTFOLIO_TEL}>
                    <Headphones className="h-4 w-4" />
                    Helpline: {CUSTOM_PORTFOLIO_PHONE}
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:bg-white/5 hover:text-white"
                  onClick={() => setShowCustomPortfolioPopup(false)}
                >
                  Continue to Builder
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <PageHeader
        badge="Portfolio Builder"
        title="Build a premium developer portfolio"
        description="Edit, preview, and export a polished portfolio."
        action={
          <div className="flex min-w-0 flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success" className="gap-2">
                <Eye className="h-3.5 w-3.5" />
                Live Preview
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                {completion}% complete
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <WandSparkles className="h-3.5 w-3.5" />
                {generationLabel}
              </Badge>
            </div>
            <div className="flex min-w-0 flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  openGeneratedDocument(generatedDocument);
                  setLastGeneratedAt(new Date());
                }}
              >
                <WandSparkles className="h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={() => {
                  downloadTextFile(createPortfolioFileName(portfolioData), generatedDocument);
                  setLastGeneratedAt(new Date());
                }}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="secondary"
                disabled={isExportingCode}
                onClick={async () => {
                  setIsExportingCode(true);
                  try {
                    await exportPortfolioCodeZip(portfolioData);
                    setLastGeneratedAt(new Date());
                  } finally {
                    setIsExportingCode(false);
                  }
                }}
              >
                <Download className="h-4 w-4" />
                {isExportingCode ? "Preparing..." : "Code ZIP"}
              </Button>
            </div>
          </div>
        }
      />

      <section className="grid w-full max-w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="bg-white/[0.045] fade-in-up">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Portfolio Completion</p>
              <p className="mt-2 text-3xl font-semibold text-white">{completion}%</p>
              <p className="mt-1 break-words text-sm text-slate-400">
                Core sections tracked.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-primary/20 bg-primary/15 p-4">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045] fade-in-up delay-1">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Featured Projects</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {highlightedProjects}
              </p>
              <p className="mt-1 break-words text-sm text-slate-400">
                Case studies with links.
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
              <p className="text-sm text-muted-foreground">Portfolio Reach</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {liveLinks}/4
              </p>
              <p className="mt-1 break-words text-sm text-slate-400">
                Resume, GitHub, LinkedIn, site.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <Eye className="h-5 w-5 text-emerald-300" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid w-full max-w-full grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="min-w-0">
          <PortfolioForm
          data={portfolioData}
          onTemplateChange={(value) =>
            dispatch({ type: "setTemplate", value })
          }
          onFieldChange={(field, value) =>
            dispatch({ type: "updateField", field, value })
          }
          onContactChange={(field, value) =>
            dispatch({ type: "updateContact", field, value })
          }
          onSkillsChange={(value) => dispatch({ type: "updateSkills", value })}
          onAddProject={() => dispatch({ type: "addProject" })}
          onRemoveProject={(id) => dispatch({ type: "removeProject", id })}
          onProjectFieldChange={(id, field, value) =>
            dispatch({ type: "updateProjectField", id, field, value })
          }
          onProjectTechStackChange={(id, value) =>
            dispatch({ type: "updateProjectTechStack", id, value })
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
          onAddAchievement={() => dispatch({ type: "addAchievement" })}
          onRemoveAchievement={(id) => dispatch({ type: "removeAchievement", id })}
          onAchievementChange={(id, field, value) =>
            dispatch({ type: "updateAchievement", id, field, value })
          }
          onSocialLinkChange={(platform, value) =>
            dispatch({ type: "updateSocialLink", platform, value })
          }
          onProfileImageChange={handleProfileImageChange}
          onProfileImagePositionChange={(value) =>
            dispatch({ type: "setProfileImagePosition", value })
          }
          onResumeUpload={handleResumeUpload}
          profileImageUpload={profileImageUpload}
          resumeUpload={resumeUpload}
          onGenerateSummary={() => dispatch({ type: "generateSummary" })}
          onEnhanceProjects={() => dispatch({ type: "enhanceProjects" })}
          />
        </div>

        <div className="min-w-0 xl:sticky xl:top-24 xl:h-fit">
          <PortfolioPreview data={portfolioData} />
        </div>
      </section>

      <section className="section-card mesh-card premium-ring overflow-hidden border-primary/15">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15),transparent_68%)]" />
        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <Badge variant="secondary" className="w-fit gap-2 border-white/10 bg-white/5 text-slate-100">
              <Headphones className="h-3.5 w-3.5 text-primary" />
              Direct Portfolio Help
            </Badge>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Need a custom portfolio or quick help with your builder?
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Reach out directly for custom portfolio generation, guided edits, or fast
                support while building your portfolio.
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <a href={CUSTOM_PORTFOLIO_TEL}>
                <Phone className="h-4 w-4" />
                Helpline: {CUSTOM_PORTFOLIO_PHONE}
              </a>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <a href={CUSTOM_PORTFOLIO_MAILTO}>
                <Mail className="h-4 w-4" />
                Custom Portfolio Generation
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
