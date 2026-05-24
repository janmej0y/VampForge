"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import {
  Columns3,
  Download,
  Eye,
  Headphones,
  Mail,
  Phone,
  RotateCcw,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { showToast } from "@/components/toaster";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadTextFile, openGeneratedDocument } from "@/lib/export-utils";
import { storeUserProfile } from "@/lib/user-profile";
import { PortfolioForm } from "./components/PortfolioForm";
import { PortfolioPreview } from "./components/PortfolioPreview";
import { createPortfolioDocument, createPortfolioFileName } from "./components/document";
import { exportPortfolioCodeZip } from "./components/export";
import { storePortfolioData } from "./components/storage";
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

const CUSTOM_PORTFOLIO_EMAIL = "support@example.com";
const CUSTOM_PORTFOLIO_PHONE = "+1 555 000 0000";
const CUSTOM_PORTFOLIO_MAILTO = `mailto:${CUSTOM_PORTFOLIO_EMAIL}?subject=Custom Portfolio Request`;
const CUSTOM_PORTFOLIO_TEL = `tel:${CUSTOM_PORTFOLIO_PHONE}`;
const CUSTOM_PORTFOLIO_SESSION_KEY = "vampforge-portfolio-custom-popup-seen";

const idleUploadStatus: UploadStatus = {
  state: "idle",
  progress: 0,
};

const PORTFOLIO_AUTOSAVE_KEY = "vampforge-portfolio-builder-draft-v2";

const initialPortfolioData: PortfolioData = {
  template: "nova",
  name: "",
  title: "",
  summary: "",
  about: "",
  experienceSummary: "",
  careerGoals: "",
  techFocus: "",
  clientCount: "",
  skills: [],
  projects: [],
  experience: [],
  education: [],
  achievements: [],
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
  },
  contact: {
    email: "",
    phone: "",
    location: "",
    website: "",
    resumeLink: "",
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
  | { type: "generateSummary" | "enhanceProjects" }
  | { type: "loadPortfolio"; value: PortfolioData };

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
    case "loadPortfolio":
      return action.value;
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
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false);
  const [viewMode, setViewMode] = useState<"both" | "form" | "preview">("both");

  const completion = useMemo(() => portfolioCompletion(portfolioData), [portfolioData]);

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

  const formMissingItems = useMemo(() => {
    const missing: string[] = [];
    const hasProject = portfolioData.projects.some(
      (project) => project.name.trim() && project.description.trim()
    );

    if (!portfolioData.name.trim()) missing.push("Full name");
    if (!portfolioData.title.trim()) missing.push("Role");
    if (!portfolioData.summary.trim()) missing.push("Hero summary");
    if (!portfolioData.about.trim()) missing.push("About section");
    if (!portfolioData.contact.email.trim()) missing.push("Email");
    if (!portfolioData.skills.length) missing.push("Skills");
    if (!hasProject) missing.push("At least one project");

    return missing;
  }, [portfolioData]);
  const isFormReady = formMissingItems.length === 0;

  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(PORTFOLIO_AUTOSAVE_KEY);
      if (savedDraft) {
        dispatch({
          type: "loadPortfolio",
          value: JSON.parse(savedDraft) as PortfolioData,
        });
        showToast({
          title: "Portfolio draft restored",
          description: "Your last saved portfolio builder draft was loaded.",
          variant: "info",
        });
      }
    } catch {
      showToast({
        title: "Could not restore portfolio draft",
        description: "The saved draft was invalid, so a blank portfolio form stayed loaded.",
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
        window.localStorage.setItem(
          PORTFOLIO_AUTOSAVE_KEY,
          JSON.stringify(portfolioData)
        );
      } catch {
        // Ignore storage failures; the editor state remains available in memory.
      }
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [hasHydratedDraft, portfolioData]);

  useEffect(() => {
    if (!hasHydratedDraft) return;

    storeUserProfile({
      fullName: portfolioData.name,
      title: portfolioData.title,
      email: portfolioData.contact.email,
      phone: portfolioData.contact.phone,
      location: portfolioData.contact.location,
      website: portfolioData.contact.website,
      linkedin: portfolioData.socialLinks.linkedin,
      github: portfolioData.socialLinks.github,
    });
  }, [hasHydratedDraft, portfolioData]);

  useEffect(() => {
    const hasSeenPopup = window.sessionStorage.getItem(CUSTOM_PORTFOLIO_SESSION_KEY);

    if (!hasSeenPopup) {
      window.sessionStorage.setItem(CUSTOM_PORTFOLIO_SESSION_KEY, "true");
      setShowCustomPortfolioPopup(true);
    }
  }, []);

  useEffect(() => {
    storePortfolioData(portfolioData);
  }, [portfolioData]);

  const handleResetForm = () => {
    window.localStorage.removeItem(PORTFOLIO_AUTOSAVE_KEY);
    dispatch({ type: "loadPortfolio", value: initialPortfolioData });
    showToast({
      title: "Portfolio form reset",
      description: "A blank guided portfolio form is ready.",
      variant: "success",
    });
  };

  const handleLoadSample = () => {
    dispatch({ type: "loadPortfolio", value: initialPortfolioData });
    showToast({
      title: "Blank portfolio loaded",
      description: "Use the section guides and placeholders to add your own details.",
      variant: "success",
    });
  };

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
      showToast({
        title: "Profile photo uploaded",
        description: "Your portfolio image is optimized and active.",
        variant: "success",
      });
      window.setTimeout(() => setProfileImageUpload(idleUploadStatus), 1800);
    } catch {
      setProfileImageUpload({
        state: "error",
        progress: 0,
        fileName: file.name,
        message: "Photo upload failed. Try a smaller image.",
      });
      showToast({
        title: "Photo upload failed",
        description: "Try a smaller image file.",
        variant: "error",
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
      showToast({
        title: "Resume connected",
        description: "Portfolio resume buttons now use the uploaded file.",
        variant: "success",
      });
      window.setTimeout(() => setResumeUpload(idleUploadStatus), 1800);
    } catch {
      setResumeUpload({
        state: "error",
        progress: 0,
        fileName: file.name,
        message: "Resume upload failed. Try a smaller PDF or DOCX.",
      });
      showToast({
        title: "Resume upload failed",
        description: "Try a smaller PDF or DOCX file.",
        variant: "error",
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
                      Contact the portfolio support team for a tailored premium build.
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
          </div>
        }
      />

      <section className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap gap-2">
          {[
            { id: "both" as const, label: "Both", icon: Columns3 },
            { id: "form" as const, label: "Form", icon: WandSparkles },
            { id: "preview" as const, label: "Preview", icon: Eye },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.id}
                type="button"
                variant={viewMode === item.id ? "default" : "secondary"}
                onClick={() => setViewMode(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
          <Button type="button" variant="secondary" onClick={handleLoadSample}>
            <Sparkles className="h-4 w-4" />
            Load Sample
          </Button>
          <Button type="button" variant="outline" onClick={handleResetForm}>
            <RotateCcw className="h-4 w-4" />
            Reset Form
          </Button>
        </div>
      </section>

      <section data-motion-skip className="grid w-full max-w-full grid-cols-1 gap-6">
        {viewMode !== "preview" ? (
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
          actions={
            <>
              <Button
                variant="secondary"
                disabled={!isFormReady}
                onClick={() => {
                  openGeneratedDocument(generatedDocument);
                  setLastGeneratedAt(new Date());
                  showToast({
                    title: "Portfolio preview opened",
                    description: "Your generated portfolio opened in a new tab.",
                    variant: "success",
                  });
                }}
              >
                <WandSparkles className="h-4 w-4" />
                Preview Portfolio
              </Button>
              <Button
                disabled={!isFormReady}
                onClick={() => {
                  downloadTextFile(createPortfolioFileName(portfolioData), generatedDocument);
                  setLastGeneratedAt(new Date());
                  showToast({
                    title: "HTML downloaded",
                    description: "Your portfolio HTML export is ready.",
                    variant: "success",
                  });
                }}
              >
                <Download className="h-4 w-4" />
                Download HTML
              </Button>
              <Button
                variant="secondary"
                disabled={!isFormReady || isExportingCode}
                onClick={async () => {
                  setIsExportingCode(true);
                  try {
                    await exportPortfolioCodeZip(portfolioData);
                    setLastGeneratedAt(new Date());
                    showToast({
                      title: "Code ZIP downloaded",
                      description: "Your portfolio source package is ready.",
                      variant: "success",
                    });
                  } finally {
                    setIsExportingCode(false);
                  }
                }}
              >
                <Download className="h-4 w-4" />
                {isExportingCode ? "Preparing..." : "Download Code ZIP"}
              </Button>
            </>
          }
          actionStatus={{
            isReady: isFormReady,
            readyText: "Portfolio is ready to preview and download.",
            missingItems: formMissingItems,
          }}
          />
        </div>
        ) : null}

        {viewMode !== "form" ? (
        <div className="min-w-0 space-y-6">
          <PortfolioPreview data={portfolioData} />

          <section className="relative overflow-hidden rounded-[1.8rem] border border-primary/15 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(8,15,30,0.88),rgba(251,191,36,0.08))] p-5 shadow-[0_24px_70px_rgba(2,6,23,0.2)]">
            <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative space-y-5">
              <div className="space-y-3">
                <Badge variant="secondary" className="w-fit gap-2 border-white/10 bg-white/5 text-slate-100">
                  <Headphones className="h-3.5 w-3.5 text-primary" />
                  Direct Portfolio Help
                </Badge>
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">
                    Need a custom portfolio?
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Use this panel when the builder needs a custom section, guided edits,
                    or a fast portfolio generation request.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Phone
                  </div>
                  <div className="mt-2 break-words text-sm font-semibold text-white">
                    {CUSTOM_PORTFOLIO_PHONE}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Email
                  </div>
                  <div className="mt-2 break-words text-sm font-semibold text-white">
                    {CUSTOM_PORTFOLIO_EMAIL}
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild variant="secondary" className="w-full sm:flex-1">
                  <a href={CUSTOM_PORTFOLIO_TEL}>
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                </Button>
                <Button asChild className="w-full sm:flex-1">
                  <a href={CUSTOM_PORTFOLIO_MAILTO}>
                    <Mail className="h-4 w-4" />
                    Request Help
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </div>
        ) : null}
      </section>
    </div>
  );
}
