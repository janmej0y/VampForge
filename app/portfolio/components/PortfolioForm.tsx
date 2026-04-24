"use client";

import {
  AlertCircle,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  FolderKanban,
  GraduationCap,
  ImagePlus,
  LayoutTemplate,
  Loader2,
  Plus,
  Shapes,
  Sparkles,
  UploadCloud,
  UserRound,
  WandSparkles,
} from "lucide-react";
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
import { AchievementForm } from "./AchievementForm";
import { EducationForm } from "./EducationForm";
import { ExperienceForm } from "./ExperienceForm";
import { ProjectForm } from "./ProjectForm";
import { SkillTagInput } from "./SkillTagInput";
import {
  type PortfolioData,
  type PortfolioTemplate,
  type SocialLinkKey,
  type UploadStatus,
} from "./types";

type PortfolioFormProps = {
  data: PortfolioData;
  onTemplateChange: (value: PortfolioTemplate) => void;
  onFieldChange: (
    field:
      | "name"
      | "title"
      | "summary"
      | "about"
      | "experienceSummary"
      | "careerGoals"
      | "techFocus"
      | "clientCount",
    value: string
  ) => void;
  onContactChange: (
    field: keyof PortfolioData["contact"],
    value: string
  ) => void;
  onSkillsChange: (value: string[]) => void;
  onAddProject: () => void;
  onRemoveProject: (projectId: string) => void;
  onProjectFieldChange: (
    projectId: string,
    field: "name" | "description" | "githubLink" | "liveLink" | "imageUrl",
    value: string
  ) => void;
  onProjectTechStackChange: (projectId: string, value: string[]) => void;
  onAddExperience: () => void;
  onRemoveExperience: (id: string) => void;
  onExperienceChange: (
    id: string,
    field: keyof Omit<PortfolioData["experience"][number], "id">,
    value: string
  ) => void;
  onAddEducation: () => void;
  onRemoveEducation: (id: string) => void;
  onEducationChange: (
    id: string,
    field: keyof Omit<PortfolioData["education"][number], "id">,
    value: string
  ) => void;
  onAddAchievement: () => void;
  onRemoveAchievement: (id: string) => void;
  onAchievementChange: (
    id: string,
    field: keyof Omit<PortfolioData["achievements"][number], "id">,
    value: string
  ) => void;
  onSocialLinkChange: (platform: SocialLinkKey, value: string) => void;
  onProfileImageChange: (file: File | null) => void;
  onProfileImagePositionChange: (value: number) => void;
  onResumeUpload: (file: File | null) => void;
  profileImageUpload: UploadStatus;
  resumeUpload: UploadStatus;
  onGenerateSummary: () => void;
  onEnhanceProjects: () => void;
};

const portfolioTemplates: Array<{
  id: PortfolioTemplate;
  name: string;
  description: string;
  accent: string;
}> = [
  {
    id: "nova",
    name: "Nova SaaS",
    description: "Premium startup-grade portfolio with glass cards, recruiter sections, and smooth product motion.",
    accent: "from-cyan-300 via-sky-400 to-violet-400",
  },
  {
    id: "orbit",
    name: "Orbit Motion",
    description: "Cinematic full-stack portfolio with animated orbits, cursor glow, floating cards, and bold hero depth.",
    accent: "from-fuchsia-300 via-violet-400 to-cyan-300",
  },
  {
    id: "terminal",
    name: "Terminal Neon",
    description: "Developer-console aesthetic with scanlines, animated command text, neon buttons, and matrix-style ambience.",
    accent: "from-emerald-300 via-cyan-300 to-lime-200",
  },
];

const socialInputs: Array<{
  key: SocialLinkKey;
  label: string;
  placeholder: string;
}> = [
  {
    key: "github",
    label: "GitHub Profile Link",
    placeholder: "https://github.com/username",
  },
  {
    key: "linkedin",
    label: "LinkedIn Link",
    placeholder: "https://linkedin.com/in/username",
  },
  {
    key: "twitter",
    label: "Twitter Link",
    placeholder: "https://twitter.com/username",
  },
];

function FormSection({
  icon: Icon,
  step,
  title,
  description,
  action,
  children,
}: {
  icon: typeof UserRound;
  step: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="section-card p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
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
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function UploadMeter({
  status,
  idleText,
}: {
  status: UploadStatus;
  idleText: string;
}) {
  if (status.state === "idle") {
    return <div className="text-xs text-muted-foreground">{idleText}</div>;
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
    <div className="space-y-2">
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

export function PortfolioForm({
  data,
  onTemplateChange,
  onFieldChange,
  onContactChange,
  onSkillsChange,
  onAddProject,
  onRemoveProject,
  onProjectFieldChange,
  onProjectTechStackChange,
  onAddExperience,
  onRemoveExperience,
  onExperienceChange,
  onAddEducation,
  onRemoveEducation,
  onEducationChange,
  onAddAchievement,
  onRemoveAchievement,
  onAchievementChange,
  onSocialLinkChange,
  onProfileImageChange,
  onProfileImagePositionChange,
  onResumeUpload,
  profileImageUpload,
  resumeUpload,
  onGenerateSummary,
  onEnhanceProjects,
}: PortfolioFormProps) {
  const hasUploadedResume = data.contact.resumeLink.startsWith("data:");

  return (
    <Card className="bg-white/[0.045] fade-in-up">
      <CardHeader className="space-y-2 border-b border-white/10">
        <CardTitle className="text-white">Premium Portfolio Builder</CardTitle>
        <CardDescription>
          Build a recruiter-ready developer portfolio with modern landing-page
          sections, stronger hierarchy, and smarter content controls.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <FormSection
          icon={LayoutTemplate}
          step="Template"
          title="Portfolio Template"
          description="Choose a visual system for the live preview. Each template has different motion, background, text, button, and cursor effects."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {portfolioTemplates.map((template) => {
              const isSelected = data.template === template.id;

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onTemplateChange(template.id)}
                  className={`group min-w-0 rounded-[1.5rem] border p-4 text-left transition hover:-translate-y-1 ${
                    isSelected
                      ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_18px_50px_rgba(34,211,238,0.14)]"
                      : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.065]"
                  }`}
                >
                  <div className={`h-2 rounded-full bg-gradient-to-r ${template.accent}`} />
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">{template.name}</div>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{template.description}</p>
                    </div>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-cyan-300/40 bg-cyan-300 text-slate-950"
                        : "border-white/10 bg-white/5 text-slate-400"
                    }`}>
                      {isSelected ? "✓" : ""}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </FormSection>

        <FormSection
          icon={UserRound}
          step="Step 01"
          title="Hero and Identity"
          description="Define the core messaging that powers your hero section and recruiter-first introduction."
          action={
            <Button type="button" variant="secondary" onClick={onGenerateSummary}>
              <WandSparkles className="h-4 w-4" />
              Generate Summary
            </Button>
          }
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Full Name</label>
              <Input
                value={data.name}
                placeholder="Janmejoy Mahato"
                onChange={(event) => onFieldChange("name", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Role</label>
              <Input
                value={data.title}
                placeholder="Full Stack Developer"
                onChange={(event) => onFieldChange("title", event.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-200">
                AI Summary
              </label>
              <Textarea
                value={data.summary}
                placeholder="Write or generate a concise recruiter-focused summary."
                className="min-h-[150px] resize-none"
                onChange={(event) => onFieldChange("summary", event.target.value)}
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={Sparkles}
          step="Step 02"
          title="About and Positioning"
          description="Fill the About section with a clear story, goals, and technical focus."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-200">Short Bio</label>
              <Textarea
                value={data.about}
                placeholder="Write a sharp short bio that explains who you are and how you work."
                className="min-h-[130px] resize-none"
                onChange={(event) => onFieldChange("about", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Experience Summary
              </label>
              <Textarea
                value={data.experienceSummary}
                placeholder="Summarize years of experience, product scope, and delivery style."
                className="min-h-[120px] resize-none"
                onChange={(event) =>
                  onFieldChange("experienceSummary", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Career Goals
              </label>
              <Textarea
                value={data.careerGoals}
                placeholder="Share what roles, impact, or opportunities you're targeting next."
                className="min-h-[120px] resize-none"
                onChange={(event) =>
                  onFieldChange("careerGoals", event.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Tech Focus
              </label>
              <Textarea
                value={data.techFocus}
                placeholder="Describe your current technical focus and preferred problem spaces."
                className="min-h-[110px] resize-none"
                onChange={(event) => onFieldChange("techFocus", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Clients Count
              </label>
              <Input
                value={data.clientCount}
                placeholder="12+"
                onChange={(event) => onFieldChange("clientCount", event.target.value)}
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={Shapes}
          step="Step 03"
          title="Skills and Contact"
          description="Add categorized skills, recruiter-facing links, and the essentials for your contact section."
        >
          <div className="space-y-6">
            <SkillTagInput
              label="Skills"
              helperText="Mix frontend, backend, database, and tooling skills to power the category cards."
              tags={data.skills}
              onChange={onSkillsChange}
              placeholder="Next.js"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Email</label>
                <Input
                  value={data.contact.email}
                  placeholder="janmejoy@email.com"
                  onChange={(event) => onContactChange("email", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Phone</label>
                <Input
                  value={data.contact.phone}
                  placeholder="+91 98765 43210"
                  onChange={(event) => onContactChange("phone", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Location</label>
                <Input
                  value={data.contact.location}
                  placeholder="Bengaluru, India"
                  onChange={(event) => onContactChange("location", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Website</label>
                <Input
                  value={data.contact.website}
                  placeholder="https://janmejoy.dev"
                  onChange={(event) => onContactChange("website", event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-200">
                  Resume Download Link
                </label>
                <Input
                  value={data.contact.resumeLink}
                  placeholder="https://janmejoy.dev/resume.pdf"
                  onChange={(event) => onContactChange("resumeLink", event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {socialInputs.map((input) => (
                <div
                  key={input.key}
                  className={input.key === "twitter" ? "space-y-2 md:col-span-2" : "space-y-2"}
                >
                  <label className="text-sm font-medium text-slate-200">
                    {input.label}
                  </label>
                  <Input
                    value={data.socialLinks[input.key]}
                    placeholder={input.placeholder}
                    onChange={(event) =>
                      onSocialLinkChange(input.key, event.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.75rem] border border-dashed border-white/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.65),rgba(15,23,42,0.42))] px-5 py-5">
                <label className="group flex cursor-pointer items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition group-hover:scale-105">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                      <ImagePlus className="h-4 w-4 text-primary" />
                      Upload profile photo
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Used in the hero section and recruiter-ready profile card.
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {data.profileImage ? "Replace" : "Browse"}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      onProfileImageChange(event.target.files?.[0] ?? null)
                    }
                  />
                </label>
                <div className="mt-4">
                  <UploadMeter
                    status={profileImageUpload}
                    idleText={
                      data.profileImage
                        ? "Profile photo is active."
                        : "No profile photo uploaded yet."
                    }
                  />
                </div>
                {data.profileImage ? (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
                      <span>Photo vertical focus</span>
                      <span>{data.profileImagePosition}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={data.profileImagePosition}
                      onChange={(event) =>
                        onProfileImagePositionChange(Number(event.target.value))
                      }
                      className="h-2 w-full accent-cyan-300"
                    />
                  </div>
                ) : null}
              </div>

              <div className="rounded-[1.75rem] border border-dashed border-white/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.65),rgba(15,23,42,0.42))] px-5 py-5">
                <label className="group flex cursor-pointer items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition group-hover:scale-105">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Upload resume file
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Add a PDF or Word file so portfolio visitors can open or download your resume directly.
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {hasUploadedResume ? "Replace" : "Browse"}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(event) => onResumeUpload(event.target.files?.[0] ?? null)}
                  />
                </label>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <UploadMeter
                    status={resumeUpload}
                    idleText={
                      hasUploadedResume
                        ? "Resume uploaded and connected to your portfolio buttons."
                        : data.contact.resumeLink
                          ? "External resume link is active."
                          : "No resume attached yet."
                    }
                  />
                  {data.contact.resumeLink ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-8 px-3 text-xs"
                      onClick={() => onContactChange("resumeLink", "")}
                    >
                      Remove Resume
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={FolderKanban}
          step="Step 04"
          title="Projects"
          description="Create premium case-study cards with visuals, links, and polished descriptions."
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
            {data.projects.map((project, index) => (
              <ProjectForm
                key={project.id}
                index={index}
                project={project}
                onRemove={() => onRemoveProject(project.id)}
                onFieldChange={(field, value) =>
                  onProjectFieldChange(project.id, field, value)
                }
                onTechStackChange={(value) =>
                  onProjectTechStackChange(project.id, value)
                }
              />
            ))}
          </div>
        </FormSection>

        <FormSection
          icon={BriefcaseBusiness}
          step="Step 05"
          title="Experience"
          description="Build the recruiter timeline section with strong roles and concise delivery stories."
          action={
            <Button type="button" variant="secondary" onClick={onAddExperience}>
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          }
        >
          <div className="space-y-4">
            {data.experience.map((item, index) => (
              <ExperienceForm
                key={item.id}
                item={item}
                index={index}
                onRemove={() => onRemoveExperience(item.id)}
                onChange={(field, value) =>
                  onExperienceChange(item.id, field, value)
                }
              />
            ))}
          </div>
        </FormSection>

        <FormSection
          icon={GraduationCap}
          step="Step 06"
          title="Education"
          description="Add degree details for the education cards or timeline."
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
                onChange={(field, value) =>
                  onEducationChange(item.id, field, value)
                }
              />
            ))}
          </div>
        </FormSection>

        <FormSection
          icon={Award}
          step="Step 07"
          title="Achievements"
          description="Feature certifications, awards, hackathons, and standout proof points."
          action={
            <Button type="button" variant="secondary" onClick={onAddAchievement}>
              <Plus className="h-4 w-4" />
              Add Achievement
            </Button>
          }
        >
          <div className="space-y-4">
            {data.achievements.map((item, index) => (
              <AchievementForm
                key={item.id}
                item={item}
                index={index}
                onRemove={() => onRemoveAchievement(item.id)}
                onChange={(field, value) =>
                  onAchievementChange(item.id, field, value)
                }
              />
            ))}
          </div>
        </FormSection>
      </CardContent>
    </Card>
  );
}
