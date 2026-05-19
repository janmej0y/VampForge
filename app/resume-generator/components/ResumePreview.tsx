"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Eye, FileText, Maximize2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  A4_RESUME_PAGE_HEIGHT,
  A4_RESUME_WIDTH,
  MIN_RESUME_SCALE,
  getResumeLayoutEstimate,
} from "./layout";
import { categorizeSkills } from "./intelligence";
import { TemplateExecutive } from "./TemplateExecutive";
import { TemplateMinimal } from "./TemplateMinimal";
import { TemplateModern } from "./TemplateModern";
import { TemplateProfessional } from "./TemplateProfessional";
import {
  getHeaderContacts,
  getVisibleEducation,
  getVisibleExperience,
  getVisibleProjects,
  normalizeUrl,
  splitLines,
} from "./content";
import { type ResumeData, type ResumeTemplate } from "./types";

type ResumePreviewProps = {
  data: ResumeData;
  actions?: React.ReactNode;
};

const templateStyles: Record<
  ResumeTemplate,
  {
    label: string;
    nameClassName: string;
    sectionTitleClassName: string;
    dividerClassName: string;
    entryTitleClassName: string;
    entrySubtitleClassName: string;
    entryMetaClassName: string;
    projectLinksClassName: string;
    headerClassName: string;
    roleClassName: string;
    contactClassName: string;
    articleClassName: string;
    bulletClassName: string;
    summaryClassName: string;
    skillsClassName: string;
    sheetClassName: string;
    stackClassName: string;
    photoFrameClassName: string;
    photoDividerClassName: string;
  }
> = {
  modern: {
    label: "Modern ATS",
    nameClassName: "text-[32px] font-bold tracking-[-0.04em]",
    sectionTitleClassName:
      "flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.34em] text-sky-700 before:h-[2px] before:w-9 before:bg-sky-500",
    dividerClassName: "border-sky-700",
    entryTitleClassName: "text-[15px] font-bold text-slate-900",
    entrySubtitleClassName: "mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700",
    entryMetaClassName: "shrink-0 pt-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sky-800",
    projectLinksClassName: "mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700",
    headerClassName: "border-t-[4px] border-b-[2px] pt-5 pb-4",
    roleClassName: "mt-1.5 text-[14px] font-semibold uppercase tracking-[0.16em] text-sky-800",
    contactClassName: "grid gap-y-1 text-right text-[11.5px] leading-5 text-slate-600 md:justify-items-end",
    articleClassName: "space-y-2.5 border-l-2 border-sky-600/80 pl-4",
    bulletClassName: "space-y-1.5 pl-5 text-[13px] leading-[1.55] text-slate-700 marker:text-sky-700",
    summaryClassName: "space-y-1.5 pl-5 text-[13px] leading-[1.6] text-slate-700 marker:text-sky-700",
    skillsClassName: "space-y-2 pl-5 text-[13px] leading-[1.6] text-slate-700",
    sheetClassName: "px-11 py-10",
    stackClassName: "space-y-7",
    photoFrameClassName: "border-sky-600 text-sky-700",
    photoDividerClassName: "md:border-sky-200",
  },
  minimal: {
    label: "Minimal ATS",
    nameClassName: "text-[28px] font-bold uppercase tracking-[0.08em]",
    sectionTitleClassName:
      "flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-indigo-700 before:h-[1.5px] before:flex-1 before:bg-indigo-500 after:h-[1.5px] after:flex-1 after:bg-indigo-500",
    dividerClassName: "border-indigo-200",
    entryTitleClassName: "text-[14px] font-semibold uppercase tracking-[0.08em] text-slate-900",
    entrySubtitleClassName: "text-[13.5px] text-slate-700",
    entryMetaClassName: "text-[12px] font-medium text-indigo-700",
    projectLinksClassName: "mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[0.08em] text-indigo-700",
    headerClassName: "border-y py-4 text-center",
    roleClassName: "mt-2 text-[13px] font-medium uppercase tracking-[0.2em] text-indigo-700",
    contactClassName: "mt-3 justify-center text-[11px] leading-5 text-slate-500",
    articleClassName: "space-y-2 border-t border-slate-200 pt-3 first:border-t-0 first:pt-0",
    bulletClassName: "space-y-1 pl-5 text-[12.5px] leading-5 text-slate-700 marker:text-indigo-700",
    summaryClassName: "space-y-1 pl-5 text-[12.5px] leading-5 text-slate-700 marker:text-indigo-700",
    skillsClassName: "space-y-2 pl-5 text-[12.5px] leading-5 text-slate-700",
    sheetClassName: "px-12 py-8",
    stackClassName: "space-y-5",
    photoFrameClassName: "border-indigo-400 text-indigo-700",
    photoDividerClassName: "md:border-indigo-200",
  },
  professional: {
    label: "Professional ATS",
    nameClassName: "text-[29px] font-bold tracking-[-0.01em]",
    sectionTitleClassName:
      "border-b border-teal-600 pb-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-teal-700",
    dividerClassName: "border-teal-600",
    entryTitleClassName: "text-[15px] font-bold text-slate-900",
    entrySubtitleClassName: "mt-1 text-[13px] text-slate-700",
    entryMetaClassName: "shrink-0 pt-0.5 text-[11.5px] font-medium uppercase tracking-[0.08em] text-teal-700",
    projectLinksClassName: "mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-teal-700",
    headerClassName: "pb-4 text-center",
    roleClassName: "mt-1.5 text-[13px] font-medium text-teal-700",
    contactClassName: "mt-3 flex flex-wrap justify-center gap-x-2 gap-y-1 text-[11.5px] leading-5 text-slate-600",
    articleClassName: "space-y-2.5 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0",
    bulletClassName: "space-y-1.5 pl-5 text-[12.75px] leading-[1.55] text-slate-700 marker:text-teal-700",
    summaryClassName: "space-y-1.5 pl-5 text-[12.75px] leading-[1.6] text-slate-700 marker:text-teal-700",
    skillsClassName: "space-y-1.5 pl-5 text-[12.75px] leading-[1.6] text-slate-700",
    sheetClassName: "px-12 py-10",
    stackClassName: "space-y-6",
    photoFrameClassName: "border-teal-600 text-teal-700",
    photoDividerClassName: "md:border-teal-200",
  },
  executive: {
    label: "Executive ATS",
    nameClassName: "text-[34px] font-bold tracking-[-0.03em]",
    sectionTitleClassName:
      "flex items-center gap-4 border-t-[1.5px] border-amber-700 pt-2 text-[10.5px] font-bold uppercase tracking-[0.28em] text-amber-700 after:h-px after:flex-1 after:bg-amber-200",
    dividerClassName: "border-amber-700",
    entryTitleClassName: "text-[15.5px] font-bold text-slate-900",
    entrySubtitleClassName: "text-[10.5px] font-semibold uppercase tracking-[0.2em] text-amber-700",
    entryMetaClassName: "shrink-0 pt-0.5 text-[11.25px] font-semibold uppercase tracking-[0.12em] text-amber-800",
    projectLinksClassName: "flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-amber-700 sm:justify-end",
    headerClassName: "pb-6",
    roleClassName: "mt-2 text-[12.5px] font-semibold uppercase tracking-[0.24em] text-amber-800",
    contactClassName: "text-[11px] leading-5 text-slate-600",
    articleClassName: "space-y-2.5 border-b border-slate-300 pb-4 last:border-b-0 last:pb-0",
    bulletClassName: "space-y-1.5 pl-5 text-[12.85px] leading-[1.65] text-slate-700 marker:text-amber-700",
    summaryClassName: "space-y-1.5 pl-5 text-[12.85px] leading-[1.65] text-slate-700 marker:text-amber-700",
    skillsClassName: "space-y-2.5 border-l-2 border-amber-200 pl-4 text-[12.85px] leading-[1.65] text-slate-700",
    sheetClassName: "px-12 py-10",
    stackClassName: "space-y-6",
    photoFrameClassName: "border-amber-700 text-amber-700",
    photoDividerClassName: "md:border-amber-200",
  },
};

const templateContainers: Record<
  ResumeTemplate,
  ({
    data,
    className,
    children,
  }: {
    data: ResumeData;
    className?: string;
    children: React.ReactNode;
  }) => React.ReactElement
> = {
  modern: TemplateModern,
  minimal: TemplateMinimal,
  professional: TemplateProfessional,
  executive: TemplateExecutive,
};

function Section({
  title,
  className,
  children,
}: {
  title: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className={className}>{title}</div>
      {children}
    </section>
  );
}

function SummaryList({
  value,
  className,
}: {
  value: string;
  className: string;
}) {
  const lines = splitLines(value);

  if (!lines.length) return null;

  return (
    <ul className={className}>
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

function SkillsBlock({
  data,
  className,
}: {
  data: ResumeData;
  className: string;
}) {
  const categories = categorizeSkills(data.skills);

  if (!categories.length) return null;

  return (
    <div className={className}>
      {categories.map((category) => (
        <p key={category.title} className="break-words">
          <span className="font-semibold text-slate-900">{category.title}:</span>{" "}
          {category.skills.join(", ")}
        </p>
      ))}
    </div>
  );
}

function HeaderPhoto({
  photo,
  position,
  showPlaceholder = false,
  frameClassName,
}: {
  photo: string | null;
  position: number;
  showPlaceholder?: boolean;
  frameClassName: string;
}) {
  if (photo) {
    return (
      <div className={`flex h-[156px] w-[118px] items-center justify-center border-2 bg-white p-1.5 ${frameClassName}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt="Executive profile"
          className="h-full w-full object-cover"
          style={{ objectPosition: `50% ${position}%` }}
        />
      </div>
    );
  }

  if (!showPlaceholder) {
    return null;
  }

  return (
    <div className={`flex h-[156px] w-[118px] items-center justify-center border-2 bg-white text-[11px] font-bold uppercase tracking-[0.34em] ${frameClassName}`}>
      PHOTO
    </div>
  );
}

function ResumeHeader({
  data,
  style,
}: {
  data: ResumeData;
  style: (typeof templateStyles)[ResumeTemplate];
}) {
  const contacts = getHeaderContacts(data);
  const isModern = data.template === "modern";
  const isExecutive = data.template === "executive";
  const hasHeaderPhoto = Boolean(data.includePhoto && (data.photo || isExecutive));
  const primaryContacts = contacts.slice(0, 3);
  const secondaryContacts = contacts.slice(3);

  return (
    <header className={`border-b pb-5 ${style.dividerClassName} ${style.headerClassName}`}>
      {hasHeaderPhoto ? (
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_146px] md:items-start">
          <div className="min-w-0">
            <h1 className={style.nameClassName}>{data.personalInfo.fullName || "Your Name"}</h1>
            <div className={style.roleClassName}>
              {data.personalInfo.title || "Frontend Developer"}
            </div>
            {contacts.length > 0 ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-x-6">
                {primaryContacts.length > 0 ? (
                  <div className="grid gap-y-1 text-[11px] leading-5 text-slate-600">
                    {primaryContacts.map((item) => (
                      <span key={item} className="break-all">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
                {secondaryContacts.length > 0 ? (
                  <div className="grid gap-y-1 text-[11px] leading-5 text-slate-600">
                    {secondaryContacts.map((item) => (
                      <span key={item} className="break-all">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className={`flex justify-start md:justify-end md:border-l md:pl-7 ${style.photoDividerClassName}`}>
            <HeaderPhoto
              photo={data.photo}
              position={data.photoPosition}
              showPlaceholder={Boolean(data.includePhoto)}
              frameClassName={style.photoFrameClassName}
            />
          </div>
        </div>
      ) : isModern ? (
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px] md:items-end">
          <div>
            <h1 className={style.nameClassName}>{data.personalInfo.fullName || "Your Name"}</h1>
            <div className={style.roleClassName}>
              {data.personalInfo.title || "Frontend Developer"}
            </div>
          </div>
          {contacts.length > 0 ? (
            <div className={style.contactClassName}>
              {contacts.map((item) => (
                <span key={item} className="break-all">
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : isExecutive ? (
        <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_146px] md:items-start">
          <div className="min-w-0">
            <h1 className={style.nameClassName}>{data.personalInfo.fullName || "Your Name"}</h1>
            <div className={style.roleClassName}>
              {data.personalInfo.title || "Frontend Developer"}
            </div>
            {contacts.length > 0 ? (
              <div className="mt-5 grid gap-2 sm:grid-cols-2 sm:gap-x-6">
                {primaryContacts.length > 0 ? (
                  <div className={style.contactClassName}>
                    <div className="grid gap-y-1">
                      {primaryContacts.map((item) => (
                        <span key={item} className="break-all">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {secondaryContacts.length > 0 ? (
                  <div className={style.contactClassName}>
                    <div className="grid gap-y-1">
                      {secondaryContacts.map((item) => (
                        <span key={item} className="break-all">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className={`flex justify-start md:justify-end md:border-l md:pl-7 ${style.photoDividerClassName}`}>
            <HeaderPhoto
              photo={data.photo}
              position={data.photoPosition}
              showPlaceholder={Boolean(data.includePhoto)}
              frameClassName={style.photoFrameClassName}
            />
          </div>
        </div>
      ) : (
        <>
          <h1 className={style.nameClassName}>{data.personalInfo.fullName || "Your Name"}</h1>
          <div className={style.roleClassName}>
            {data.personalInfo.title || "Frontend Developer"}
          </div>
          {contacts.length > 0 ? (
            <div className={style.contactClassName}>
              {contacts.map((item, index) => (
                <span key={item} className="break-all">
                  {index > 0 ? <span className="mr-2 text-slate-400">|</span> : null}
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </>
      )}
    </header>
  );
}

function ExperienceSection({
  data,
  style,
}: {
  data: ResumeData;
  style: (typeof templateStyles)[ResumeTemplate];
}) {
  const items = getVisibleExperience(data);
  const isModern = data.template === "modern";
  const isExecutive = data.template === "executive";

  if (!items.length) return null;

  return (
    <Section title="Work Experience" className={style.sectionTitleClassName}>
      <div className="space-y-5">
        {items.map((item) => {
          const bullets = splitLines(item.description);

          return (
            <article key={item.id} className={style.articleClassName}>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  {item.companyName ? (
                    <div className={style.entrySubtitleClassName}>
                      {item.companyName}
                    </div>
                  ) : !isModern ? null : (
                    <div className={style.entrySubtitleClassName}>Company</div>
                  )}
                  <div className={isExecutive ? "mt-1.5" : undefined}>
                    <div className={style.entryTitleClassName}>{item.role || "Role"}</div>
                  </div>
                </div>
                {item.duration ? (
                  <div className={style.entryMetaClassName}>
                    {item.duration}
                  </div>
                ) : null}
              </div>
              {bullets.length > 0 ? (
                <ul className={style.bulletClassName}>
                  {bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function ProjectsSection({
  data,
  style,
}: {
  data: ResumeData;
  style: (typeof templateStyles)[ResumeTemplate];
}) {
  const items = getVisibleProjects(data);
  const isModern = data.template === "modern";
  const isExecutive = data.template === "executive";

  if (!items.length) return null;

  return (
    <Section title="Projects" className={style.sectionTitleClassName}>
      <div className="space-y-5">
        {items.map((project) => {
          const bullets = splitLines(project.description);
          const links = [
            project.githubLink
              ? { label: "GitHub", href: normalizeUrl(project.githubLink) }
              : null,
            project.liveLink
              ? { label: "Live Link", href: normalizeUrl(project.liveLink) }
              : null,
          ].filter(Boolean) as Array<{ label: string; href: string }>;

          return (
            <article key={project.id} className={style.articleClassName}>
              <div className={`flex flex-col gap-1.5 ${isExecutive ? "sm:flex-row sm:items-start sm:justify-between sm:gap-4" : ""}`}>
                <div className={style.entryTitleClassName}>
                  <span>{project.projectName || "Project Name"}</span>
                </div>
                {links.length > 0 && isExecutive ? (
                  <div className={style.projectLinksClassName}>
                    {links.map((link, index) => (
                      <span key={link.href}>
                        {index > 0 ? <span className="mr-2 text-slate-400">|</span> : null}
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all underline decoration-slate-300 underline-offset-2"
                        >
                          {link.label}
                        </a>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              {links.length > 0 && !isExecutive ? (
                <div className={style.projectLinksClassName}>
                  {links.map((link, index) => (
                    <span key={link.href}>
                      {!isModern && index > 0 ? <span className="mr-2 text-slate-400">|</span> : null}
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all underline decoration-slate-300 underline-offset-2"
                      >
                        {link.label}
                      </a>
                    </span>
                  ))}
                </div>
              ) : null}
              {bullets.length > 0 ? (
                <ul className={style.bulletClassName}>
                  {bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function EducationSection({
  data,
  style,
}: {
  data: ResumeData;
  style: (typeof templateStyles)[ResumeTemplate];
}) {
  const items = getVisibleEducation(data);
  const isExecutive = data.template === "executive";

  if (!items.length) return null;

  return (
    <Section title="Education" className={style.sectionTitleClassName}>
      <div className="space-y-4">
        {items.map((item) => {
          const bullets = splitLines(item.description);

          return (
            <article key={item.id} className={style.articleClassName}>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  {item.institutionName ? (
                    <div className={style.entrySubtitleClassName}>{item.institutionName}</div>
                  ) : null}
                  <div className={isExecutive ? "mt-1.5" : undefined}>
                    <div className={style.entryTitleClassName}>
                      {item.degree || "Degree"}
                    </div>
                  </div>
                </div>
                {item.year ? (
                  <div className={style.entryMetaClassName}>{item.year}</div>
                ) : null}
              </div>
              {bullets.length > 0 ? (
                <ul className={style.bulletClassName}>
                  {bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </Section>
  );
}

function CertificationsSection({
  items,
  style,
}: {
  items: string[];
  style: (typeof templateStyles)[ResumeTemplate];
}) {
  if (!items.length) return null;

  return (
    <Section title="Certifications" className={style.sectionTitleClassName}>
      <ul className={style.bulletClassName}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Section>
  );
}

function ResumeSheet({ data }: { data: ResumeData }) {
  const style = templateStyles[data.template];
  const TemplateContainer = templateContainers[data.template];

  return (
    <TemplateContainer data={data} className={style.sheetClassName}>
      <div className={style.stackClassName}>
        <ResumeHeader data={data} style={style} />

        <Section title="Professional Summary" className={style.sectionTitleClassName}>
          <SummaryList value={data.summary} className={style.summaryClassName} />
        </Section>

        <Section title="Skills" className={style.sectionTitleClassName}>
          <SkillsBlock data={data} className={style.skillsClassName} />
        </Section>

        <ExperienceSection data={data} style={style} />
        <ProjectsSection data={data} style={style} />
        <EducationSection data={data} style={style} />
        <CertificationsSection items={data.certifications} style={style} />
      </div>
    </TemplateContainer>
  );
}

function ResumeCanvas({ data }: { data: ResumeData }) {
  const estimate = useMemo(() => getResumeLayoutEstimate(data), [data]);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(estimate.scale);
  const [naturalHeight, setNaturalHeight] = useState(A4_RESUME_PAGE_HEIGHT);
  const [renderedPages, setRenderedPages] = useState(estimate.estimatedPages);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const sheet = sheetRef.current;
      if (!sheet) return;

      const measuredHeight = Math.max(A4_RESUME_PAGE_HEIGHT, sheet.scrollHeight);
      const nextScale = Math.min(
        1,
        Math.max(MIN_RESUME_SCALE, (A4_RESUME_PAGE_HEIGHT * data.pageCount) / measuredHeight)
      );
      const pages = Math.max(
        1,
        Math.min(data.pageCount, Math.ceil((measuredHeight * nextScale) / A4_RESUME_PAGE_HEIGHT))
      );

      setNaturalHeight(measuredHeight);
      setScale(nextScale);
      setRenderedPages(pages);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [data]);

  const scaledHeight = naturalHeight * scale;
  const viewportHeight = Math.max(A4_RESUME_PAGE_HEIGHT * renderedPages, scaledHeight);
  const viewportWidth = A4_RESUME_WIDTH * scale;

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="w-fit">
          Showing {renderedPages} page{renderedPages > 1 ? "s" : ""}
        </Badge>
        <Badge variant="secondary" className="w-fit">
          Max {data.pageCount} page{data.pageCount > 1 ? "s" : ""}
        </Badge>
        <Badge variant="secondary" className="w-fit">
          {Math.round(scale * 100)}% fit
        </Badge>
      </div>

      <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(9,9,11,0.66))] shadow-[0_28px_90px_rgba(2,8,23,0.36),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            <span className="ml-2 text-xs font-medium text-slate-300">A4 preview</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Maximize2 className="h-3.5 w-3.5" />
            Auto-fit
          </div>
        </div>
      <div className="w-full max-w-full overflow-auto bg-[radial-gradient(circle_at_50%_0%,rgba(96,165,250,0.18),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.26),rgba(2,6,23,0.42))] p-5 [perspective:1600px] sm:p-8">
        <div
          className="relative mx-auto drop-shadow-2xl"
          style={{
            width: viewportWidth,
            height: viewportHeight,
            backgroundImage:
              renderedPages > 1
                ? "repeating-linear-gradient(to bottom, transparent 0, transparent calc(100% - 1px), rgba(148,163,184,0.35) calc(100% - 1px), rgba(148,163,184,0.35) 100%)"
                : undefined,
            backgroundSize:
              renderedPages > 1 ? `100% ${A4_RESUME_PAGE_HEIGHT}px` : undefined,
          }}
        >
          <div
            ref={sheetRef}
            className="absolute left-0 top-0 origin-top-left rounded-sm shadow-[0_38px_120px_rgba(2,8,23,0.34),0_14px_34px_rgba(59,130,246,0.16)] ring-1 ring-white/40 [transform-style:preserve-3d]"
            style={{
              width: A4_RESUME_WIDTH,
              transform: `rotateX(3deg) rotateY(-2deg) scale(${scale})`,
            }}
          >
            <ResumeSheet data={data} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export function ResumePreview({ data, actions }: ResumePreviewProps) {
  const estimate = useMemo(() => getResumeLayoutEstimate(data), [data]);

  return (
    <Card className="min-w-0 overflow-hidden bg-white/[0.045] fade-in-up delay-1">
      <CardHeader className="border-b border-white/10">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-white">Resume Preview</CardTitle>
            <CardDescription>
              ATS-safe A4 preview with automatic page fit.
            </CardDescription>
          </div>
          <div className="flex min-w-0 flex-wrap gap-2">
            <Badge variant="secondary" className="w-fit">
              {templateStyles[data.template].label}
            </Badge>
            <Badge variant="secondary" className="w-fit">
              {data.backgroundEnabled
                ? `${data.backgroundTheme} ${data.backgroundIntensity} background`
                : "Background off"}
            </Badge>
            <Badge variant="secondary" className="w-fit">
              ATS Optimized
            </Badge>
            <Badge variant="secondary" className="w-fit">
              Est. {estimate.estimatedPages} page{estimate.estimatedPages > 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        {actions ? (
          <div className="action-bar">
            {actions}
          </div>
        ) : null}
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: "Template", value: templateStyles[data.template].label, icon: Sparkles },
            { label: "Layout", value: "Single column", icon: FileText },
            { label: "Preview", value: "Live fit", icon: Eye },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {item.label}
                </div>
                <div className="mt-2 text-sm font-semibold text-white">{item.value}</div>
              </div>
            );
          })}
        </div>
        <ResumeCanvas data={data} />
      </CardContent>
    </Card>
  );
}
