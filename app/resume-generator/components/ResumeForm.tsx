"use client";

import {
  AlertCircle,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  FileUser,
  GraduationCap,
  ImageUp,
  Loader2,
  Plus,
  Sparkles,
  WandSparkles,
  Wrench,
} from "lucide-react";
import { TagInput } from "@/components/tag-input";
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
import { cn } from "@/lib/utils";
import { EducationForm } from "./EducationForm";
import { ExperienceForm } from "./ExperienceForm";
import { type SkillCategory } from "./intelligence";
import { ProjectForm } from "./ProjectForm";
import {
  type ResumeBackgroundIntensity,
  type ResumeBackgroundTheme,
  type ResumeData,
  type ResumePageCount,
  type UploadStatus,
} from "./types";

type ResumeFormProps = {
  data: ResumeData;
  categorizedSkills: SkillCategory[];
  onPersonalInfoChange: (
    field: keyof ResumeData["personalInfo"],
    value: string
  ) => void;
  onSummaryChange: (value: string) => void;
  onSkillsChange: (value: string[]) => void;
  onCertificationsChange: (value: string[]) => void;
  onAchievementsChange: (value: string[]) => void;
  onPageCountChange: (value: ResumePageCount) => void;
  onAddExperience: () => void;
  onRemoveExperience: (id: string) => void;
  onExperienceChange: (
    id: string,
    field: "companyName" | "role" | "duration" | "description",
    value: string
  ) => void;
  onAddEducation: () => void;
  onRemoveEducation: (id: string) => void;
  onEducationChange: (
    id: string,
    field: "institutionName" | "degree" | "year" | "description",
    value: string
  ) => void;
  onAddProject: () => void;
  onRemoveProject: (id: string) => void;
  onProjectChange: (
    id: string,
    field: "projectName" | "description" | "githubLink" | "liveLink",
    value: string
  ) => void;
  onProjectTechStackChange: (id: string, value: string[]) => void;
  onPhotoChange: (file: File | null) => void;
  photoUpload: UploadStatus;
  onPhotoPositionChange: (value: number) => void;
  onToggleIncludePhoto: (value: boolean) => void;
  onToggleBackground: (value: boolean) => void;
  onBackgroundThemeChange: (value: ResumeBackgroundTheme) => void;
  onBackgroundIntensityChange: (value: ResumeBackgroundIntensity) => void;
  onToggleAtsMode: (value: boolean) => void;
  onGenerateSummary: () => void;
  onEnhanceExperience: () => void;
  onEnhanceProjects: () => void;
  actions?: React.ReactNode;
  actionStatus?: {
    isReady: boolean;
    readyText: string;
    missingItems: string[];
  };
};

const personalFields: Array<{
  key: keyof ResumeData["personalInfo"];
  label: string;
  placeholder: string;
}> = [
  { key: "fullName", label: "Full Name", placeholder: "Janmejoy Mahato" },
  { key: "title", label: "Professional Title", placeholder: "Senior Full-Stack Engineer" },
  { key: "email", label: "Email", placeholder: "janmejoy@email.com" },
  { key: "phone", label: "Phone", placeholder: "+91 7477661933" },
  { key: "website", label: "Portfolio / Website", placeholder: "https://janmejoy.is-a.dev" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/janmejoy" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/janmej0y" },
];

const backgroundThemes: Array<{ value: ResumeBackgroundTheme; label: string }> = [
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

const resumeFlow = [
  "Header",
  "Summary",
  "Skills",
  "Experience",
  "Projects",
  "Proof",
];

function BuilderRoadmap() {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(255,255,255,0.045),rgba(251,191,36,0.08))] p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="section-label">Resume Flow</div>
          <div className="mt-2 text-lg font-semibold text-white">ATS resume in recruiter order</div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Fill identity first, then add proof sections that support your target role.
          </p>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:min-w-[28rem]">
          {resumeFlow.map((item, index) => (
            <div
              key={item}
              className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/45 px-3 py-2 text-sm text-slate-200"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                {index + 1}
              </span>
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormSection({
  icon: Icon,
  step,
  title,
  description,
  action,
  children,
}: {
  icon: typeof FileUser;
  step: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.9),rgba(10,18,35,0.72))] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.16)] sm:p-6">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(94,234,212,0.5),transparent)]" />
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="section-label">{step}</div>
            <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">{title}</div>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
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
        className={cn(
          "mt-0.5 flex h-7 w-12 shrink-0 items-center rounded-full border p-1 transition",
          checked
            ? "border-cyan-300/40 bg-cyan-300/20"
            : "border-white/10 bg-slate-950/65"
        )}
      >
        <span
          className={cn(
            "h-5 w-5 rounded-full transition",
            checked
              ? "translate-x-5 bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.55)]"
              : "translate-x-0 bg-slate-500"
          )}
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

export function ResumeForm({
  data,
  categorizedSkills,
  onPersonalInfoChange,
  onSummaryChange,
  onSkillsChange,
  onCertificationsChange,
  onPageCountChange,
  onAddExperience,
  onRemoveExperience,
  onExperienceChange,
  onAddEducation,
  onRemoveEducation,
  onEducationChange,
  onAddProject,
  onRemoveProject,
  onProjectChange,
  onProjectTechStackChange,
  onPhotoChange,
  photoUpload,
  onPhotoPositionChange,
  onToggleBackground,
  onBackgroundThemeChange,
  onBackgroundIntensityChange,
  onToggleAtsMode,
  onGenerateSummary,
  onEnhanceExperience,
  onEnhanceProjects,
  actions,
  actionStatus,
}: ResumeFormProps) {
  const isExecutiveTemplate = data.template === "executive";

  return (
    <Card className="bg-white/[0.045] fade-in-up">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white">Resume Builder</CardTitle>
        <CardDescription>
          Build an ATS-safe resume with live preview.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <BuilderRoadmap />

        <FormSection
          icon={FileUser}
          step="Step 01"
          title="Identity, Links, and Page Control"
          description="Set contact details and page count."
        >
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <FileUser className="h-4 w-4 text-primary" />
                Resume header
              </div>
            <div className="grid gap-4 md:grid-cols-2">
              {personalFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    {field.label}
                  </label>
                  <Input
                    value={data.personalInfo[field.key]}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      onPersonalInfoChange(field.key, event.target.value)
                    }
                  />
                  <FieldIssue
                    show={
                      (field.key === "fullName" ||
                        field.key === "title" ||
                        field.key === "email") &&
                      !data.personalInfo[field.key].trim()
                    }
                  >
                    {field.label} is required before export.
                  </FieldIssue>
                </div>
              ))}
            </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ToggleCard
                checked={data.atsMode}
                label="ATS Friendly Mode"
                description="Use standard recruiter-safe formatting."
                onChange={onToggleAtsMode}
              />
              <ToggleCard
                checked={data.backgroundEnabled}
                label="Premium Background Design"
                description="Add subtle export-safe polish."
                onChange={onToggleBackground}
              />
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <FileText className="h-4 w-4 text-primary" />
                Layout controls
              </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Maximum Resume Pages
                </label>
                <select
                  value={String(data.pageCount)}
                  onChange={(event) =>
                    onPageCountChange(Number(event.target.value) as ResumePageCount)
                  }
                  className="resume-select h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-foreground outline-none transition focus:border-primary/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-primary/20"
                >
                  <option value="1">1 page</option>
                  <option value="2">2 pages</option>
                  <option value="3">3 pages</option>
                </select>
                <p className="text-xs leading-6 text-muted-foreground">
                  The resume auto-fits into this limit. If your content already fits
                  on one page, extra pages will not be added.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Background Theme
                </label>
                <select
                  value={data.backgroundTheme}
                  disabled={!data.backgroundEnabled}
                  onChange={(event) =>
                    onBackgroundThemeChange(event.target.value as ResumeBackgroundTheme)
                  }
                  className="resume-select h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-foreground outline-none transition disabled:opacity-50 focus:border-primary/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-primary/20"
                >
                  {backgroundThemes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-6 text-muted-foreground">
                  Switch the subtle paper styling without affecting text contrast.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Background Intensity
                </label>
                <select
                  value={data.backgroundIntensity}
                  disabled={!data.backgroundEnabled}
                  onChange={(event) =>
                    onBackgroundIntensityChange(event.target.value as ResumeBackgroundIntensity)
                  }
                  className="resume-select h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-foreground outline-none transition disabled:opacity-50 focus:border-primary/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-primary/20"
                >
                  {backgroundIntensityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-6 text-muted-foreground">
                  Keeps the background subtle at 5-10% visual intensity for ATS safety.
                </p>
              </div>
            </div>
            </div>

            {isExecutiveTemplate ? (
              <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                    <ImageUp className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">
                      Executive ATS Photo
                    </div>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Upload a professional headshot for the Executive ATS
                      template. If you leave it empty, the resume will keep a
                      bordered white photo box labeled PHOTO.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
                  <div className="space-y-3">
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) =>
                        onPhotoChange(event.target.files?.[0] ?? null)
                      }
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onPhotoChange(null)}
                      >
                        Remove Photo
                      </Button>
                    </div>
                    <UploadMeter status={photoUpload} />
                    {data.photo ? (
                      <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/35 p-3">
                        <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
                          <span>Photo vertical focus</span>
                          <span>{data.photoPosition}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={data.photoPosition}
                          onChange={(event) =>
                            onPhotoPositionChange(Number(event.target.value))
                          }
                          className="h-2 w-full accent-cyan-300"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex justify-start md:justify-end">
                    {data.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={data.photo}
                        alt="Executive preview"
                        className="h-36 w-28 rounded-lg border border-slate-900 bg-white object-cover"
                        style={{ objectPosition: `50% ${data.photoPosition}%` }}
                      />
                    ) : (
                      <div className="flex h-36 w-28 items-center justify-center rounded-lg border-2 border-slate-900 bg-white text-xs font-bold uppercase tracking-[0.28em] text-slate-900">
                        PHOTO
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </FormSection>

        <FormSection
          icon={Sparkles}
          step="Step 02"
          title="Professional Summary and Skills"
          description="Write summary and skills."
          action={
            <Button type="button" variant="secondary" onClick={onGenerateSummary}>
              <WandSparkles className="h-4 w-4" />
              Generate Summary
            </Button>
          }
        >
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Professional Summary
              </label>
              <Textarea
                value={data.summary}
                placeholder="Write 3-4 short lines that describe your role, core technologies, focus, and impact."
                className="min-h-[150px] resize-none"
                onChange={(event) => onSummaryChange(event.target.value)}
              />
              <FieldIssue show={!data.summary.trim()}>
                Add a professional summary before generating the resume.
              </FieldIssue>
            </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4">
              <TagInput
                label="Skills"
                placeholder="Add a skill and press Enter"
                value={data.skills}
                onChange={onSkillsChange}
              />
              <FieldIssue show={!data.skills.length}>
                Add at least one skill.
              </FieldIssue>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <Wrench className="h-4.5 w-4.5 text-primary" />
                ATS Skills Preview
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {categorizedSkills.length > 0 ? (
                  categorizedSkills.map((category) => (
                    <div
                      key={category.title}
                      className="rounded-[1.2rem] border border-white/10 bg-slate-950/30 p-4"
                    >
                      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        {category.title}
                      </div>
                      <div className="mt-3 text-sm leading-6 text-slate-300">
                        {category.skills.join(", ")}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm leading-6 text-muted-foreground">
                    Add skills to generate recruiter-friendly categories.
                  </div>
                )}
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={BriefcaseBusiness}
          step="Step 03"
          title="Work Experience"
          description="Add roles and impact bullets."
          action={
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={onEnhanceExperience}>
                <WandSparkles className="h-4 w-4" />
                Enhance Bullets
              </Button>
              <Button type="button" variant="secondary" onClick={onAddExperience}>
                <Plus className="h-4 w-4" />
                Add Experience
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {data.experience.map((item, index) => (
              <ExperienceForm
                key={item.id}
                item={item}
                index={index}
                onRemove={() => onRemoveExperience(item.id)}
                onChange={(field, value) => onExperienceChange(item.id, field, value)}
              />
            ))}
            {!data.experience.some((item) => item.companyName.trim() && item.role.trim() && item.description.trim()) ? (
              <FieldIssue show>
                Add at least one complete experience entry with company, role, and impact bullets.
              </FieldIssue>
            ) : null}
          </div>
        </FormSection>

        <FormSection
          icon={FileText}
          step="Step 04"
          title="Projects"
          description="Add projects and links."
          action={
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={onEnhanceProjects}>
                <WandSparkles className="h-4 w-4" />
                Enhance Projects
              </Button>
              <Button type="button" variant="secondary" onClick={onAddProject}>
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {data.projects.map((item, index) => (
              <ProjectForm
                key={item.id}
                item={item}
                index={index}
                onRemove={() => onRemoveProject(item.id)}
                onChange={(field, value) => onProjectChange(item.id, field, value)}
                onTechStackChange={(value) =>
                  onProjectTechStackChange(item.id, value)
                }
              />
            ))}
          </div>
        </FormSection>

        <FormSection
          icon={GraduationCap}
          step="Step 05"
          title="Education"
          description="Add degree and school."
          action={
            <Button type="button" variant="secondary" onClick={onAddEducation}>
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          }
        >
          <div className="space-y-4">
            {data.education.map((item, index) => (
              <EducationForm
                key={item.id}
                item={item}
                index={index}
                onRemove={() => onRemoveEducation(item.id)}
                onChange={(field, value) => onEducationChange(item.id, field, value)}
              />
            ))}
          </div>
        </FormSection>

        <FormSection
          icon={Award}
          step="Step 06"
          title="Certifications"
          description="Add certificates and wins."
        >
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10">
                <Award className="h-4.5 w-4.5 text-amber-300" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Certifications</div>
                <div className="text-xs text-muted-foreground">
                  Industry credentials, courses, and role-specific validation.
                </div>
              </div>
            </div>
            <TagInput
              label="Certification Tags"
              placeholder="Cybersecurity Virtual Internship"
              value={data.certifications}
              onChange={onCertificationsChange}
            />
          </div>
        </FormSection>

        {actions ? (
          <FormSection
            icon={WandSparkles}
            step="Final Step"
            title="Generate, Preview, and Download"
            description="Use these actions after completing the resume form."
          >
            {actionStatus ? (
              <div
                className={`mb-4 rounded-2xl border p-4 ${
                  actionStatus.isReady
                    ? "border-emerald-300/20 bg-emerald-300/10"
                    : "border-amber-300/20 bg-amber-300/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  {actionStatus.isReady ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">
                      {actionStatus.isReady ? actionStatus.readyText : "Complete these fields first"}
                    </div>
                    {!actionStatus.isReady ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {actionStatus.missingItems.map((item) => (
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
            ) : null}
            <div className="action-bar justify-start sm:justify-start">
              {actions}
            </div>
          </FormSection>
        ) : null}
      </CardContent>
    </Card>
  );
}
