import { escapeHtml } from "@/lib/export-utils";
import { categorizeSkills } from "./intelligence";
import {
  A4_RESUME_PAGE_HEIGHT,
  A4_RESUME_WIDTH,
  MIN_RESUME_SCALE,
  getResumeLayoutEstimate,
} from "./layout";
import {
  getHeaderContacts,
  getVisibleEducation,
  getVisibleExperience,
  getVisibleProjects,
  normalizeUrl,
  splitLines,
} from "./content";
import { getResumeBackgroundStyles, rgbToCss } from "./resume-backgrounds";
import { type ResumeData, type ResumeTemplate } from "./types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const templateVariants: Record<
  ResumeTemplate,
  {
    rootClass: string;
    nameClass: string;
    sectionTitleClass: string;
    dividerClass: string;
    entryTitleClass: string;
    entrySubtitleClass: string;
    entryMetaClass: string;
    projectLinksClass: string;
    headerClass: string;
    roleClass: string;
    contactClass: string;
    entryClass: string;
    bulletClass: string;
    sheetClass: string;
  }
> = {
  modern: {
    rootClass: "template-modern",
    nameClass: "name-modern",
    sectionTitleClass: "section-modern",
    dividerClass: "divider-modern",
    entryTitleClass: "entry-modern",
    entrySubtitleClass: "entry-subtitle-modern",
    entryMetaClass: "entry-meta-modern",
    projectLinksClass: "project-links-modern",
    headerClass: "header-modern",
    roleClass: "role-modern",
    contactClass: "contacts-modern",
    entryClass: "entry-modern-shell",
    bulletClass: "bullets-modern",
    sheetClass: "sheet-modern",
  },
  minimal: {
    rootClass: "template-minimal",
    nameClass: "name-minimal",
    sectionTitleClass: "section-minimal",
    dividerClass: "divider-minimal",
    entryTitleClass: "entry-minimal",
    entrySubtitleClass: "",
    entryMetaClass: "",
    projectLinksClass: "",
    headerClass: "header-minimal",
    roleClass: "role-minimal",
    contactClass: "contacts-minimal",
    entryClass: "entry-minimal-shell",
    bulletClass: "bullets-minimal",
    sheetClass: "sheet-minimal",
  },
  professional: {
    rootClass: "template-professional",
    nameClass: "name-professional",
    sectionTitleClass: "section-professional",
    dividerClass: "divider-professional",
    entryTitleClass: "entry-professional",
    entrySubtitleClass: "entry-subtitle-professional",
    entryMetaClass: "entry-meta-professional",
    projectLinksClass: "project-links-professional",
    headerClass: "header-professional",
    roleClass: "role-professional",
    contactClass: "contacts-professional",
    entryClass: "entry-professional-shell",
    bulletClass: "bullets-professional",
    sheetClass: "sheet-professional",
  },
  executive: {
    rootClass: "template-executive",
    nameClass: "name-executive",
    sectionTitleClass: "section-executive",
    dividerClass: "divider-executive",
    entryTitleClass: "entry-executive",
    entrySubtitleClass: "entry-subtitle-executive",
    entryMetaClass: "entry-meta-executive",
    projectLinksClass: "project-links-executive",
    headerClass: "header-executive",
    roleClass: "role-executive",
    contactClass: "contacts-executive",
    entryClass: "entry-executive-shell",
    bulletClass: "bullets-executive",
    sheetClass: "sheet-executive",
  },
};

function renderListItems(items: string[]) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderBackgroundLayer(data: ResumeData) {
  if (!data.backgroundEnabled) {
    return "";
  }

  const { palette, wash, accent, line, frame, band } = getResumeBackgroundStyles(data);
  const paperColor = rgbToCss(palette.paper);
  const washColor = rgbToCss(wash, 0.9);
  const accentColor = rgbToCss(accent, 0.9);
  const lineColor = rgbToCss(line, 0.95);
  const frameColor = rgbToCss(frame, 0.85);
  const bandColor = rgbToCss(band, 0.9);

  if (data.template === "modern") {
    return `
      <div class="resume-background-layer">
        <div class="resume-background-fill" style="background:linear-gradient(135deg,${washColor} 0%,${paperColor} 54%,${paperColor} 100%);"></div>
        <div class="resume-strip-left" style="background:${frameColor};"></div>
        <div class="resume-orb-top-left" style="background:radial-gradient(circle at top left,${accentColor} 0%,transparent 72%);"></div>
        <div class="resume-line" style="top:168px;left:40px;right:40px;background:${lineColor};"></div>
        <div class="resume-line" style="bottom:92px;left:40px;right:40px;background:${rgbToCss(line, 0.72)};"></div>
      </div>
    `;
  }

  if (data.template === "minimal") {
    return `
      <div class="resume-background-layer">
        <div class="resume-background-fill" style="background:${paperColor};"></div>
        <div class="resume-line" style="top:32px;left:40px;right:40px;background:${lineColor};"></div>
        <div class="resume-line" style="top:166px;left:40px;right:40px;background:${rgbToCss(line, 0.75)};"></div>
        <div class="resume-line" style="bottom:32px;left:40px;right:40px;background:${lineColor};"></div>
      </div>
    `;
  }

  if (data.template === "professional") {
    return `
      <div class="resume-background-layer">
        <div class="resume-background-fill" style="background:${paperColor};"></div>
        <div class="resume-box" style="top:32px;left:32px;right:32px;height:112px;border-color:${frameColor};background:${rgbToCss(wash, 0.46)};"></div>
        <div class="resume-box" style="top:172px;left:32px;right:32px;bottom:32px;border-color:${rgbToCss(line, 0.8)};background:${rgbToCss(palette.paper, 0.82)};"></div>
        <div class="resume-line" style="top:228px;left:48px;right:48px;background:${lineColor};"></div>
        <div class="resume-line" style="top:494px;left:48px;right:48px;background:${rgbToCss(line, 0.72)};"></div>
      </div>
    `;
  }

  return `
    <div class="resume-background-layer">
      <div class="resume-background-fill" style="background:${paperColor};"></div>
      <div class="resume-header-band" style="background:linear-gradient(135deg,${bandColor} 0%,${washColor} 38%,${paperColor} 100%);"></div>
      <div class="resume-watermark" style="background:${rgbToCss(accent, 0.22)};"></div>
      <div class="resume-watermark-outline" style="border-color:${rgbToCss(frame, 0.38)};"></div>
      <div class="resume-line" style="top:170px;left:48px;right:48px;background:${lineColor};"></div>
    </div>
  `;
}

function renderHeader(data: ResumeData, variant: (typeof templateVariants)[ResumeTemplate]) {
  const contacts = getHeaderContacts(data);
  const isModern = data.template === "modern";
  const isExecutive = data.template === "executive";
  const hasHeaderPhoto = Boolean(data.includePhoto && (data.photo || isExecutive));
  const primaryContacts = contacts.slice(0, 3);
  const secondaryContacts = contacts.slice(3);
  const headerPhoto = data.photo
    ? `<div class="executive-photo-shell"><img class="executive-photo-image" src="${escapeHtml(
        data.photo
      )}" style="object-position:50% ${data.photoPosition}%" alt="Profile photo" /></div>`
    : data.includePhoto
      ? `<div class="executive-photo-placeholder">PHOTO</div>`
      : "";

  return `
    <header class="resume-header ${variant.dividerClass} ${variant.headerClass}">
      ${
        hasHeaderPhoto
          ? `
            <div class="header-executive-grid">
              <div>
                <h1 class="${variant.nameClass}">${escapeHtml(data.personalInfo.fullName || "Your Name")}</h1>
                <div class="resume-role ${variant.roleClass}">${escapeHtml(
                  data.personalInfo.title || "Frontend Developer"
                )}</div>
                ${
                  contacts.length > 0
                    ? `
                      <div class="resume-contact-stack header-photo-contact-stack">
                        ${
                          primaryContacts.length > 0
                            ? `<div class="resume-contact-row executive-contact-row">${primaryContacts
                                .map((item) => `<span class="resume-contact-item">${escapeHtml(item)}</span>`)
                                .join("")}</div>`
                            : ""
                        }
                        ${
                          secondaryContacts.length > 0
                            ? `<div class="resume-contact-row executive-contact-row">${secondaryContacts
                                .map((item) => `<span class="resume-contact-item">${escapeHtml(item)}</span>`)
                                .join("")}</div>`
                            : ""
                        }
                      </div>
                    `
                    : ""
                }
              </div>
              <div class="executive-photo-column">
                ${headerPhoto}
              </div>
            </div>
          `
          : isModern
          ? `
            <div class="header-modern-grid">
              <div>
                <h1 class="${variant.nameClass}">${escapeHtml(data.personalInfo.fullName || "Your Name")}</h1>
                <div class="resume-role ${variant.roleClass}">${escapeHtml(data.personalInfo.title || "Frontend Developer")}</div>
              </div>
              ${
                contacts.length > 0
                  ? `<div class="resume-contact-row ${variant.contactClass}">${contacts
                      .map((item) => `<span class="resume-contact-item">${escapeHtml(item)}</span>`)
                      .join("")}</div>`
                  : ""
              }
            </div>
          `
          : isExecutive
            ? `
              <div class="header-executive-grid">
                <div>
                  <h1 class="${variant.nameClass}">${escapeHtml(data.personalInfo.fullName || "Your Name")}</h1>
                  <div class="resume-role ${variant.roleClass}">${escapeHtml(
                    data.personalInfo.title || "Frontend Developer"
                  )}</div>
                  ${
                    contacts.length > 0
                      ? `
                        <div class="resume-contact-stack ${variant.contactClass}">
                          ${
                            primaryContacts.length > 0
                              ? `<div class="resume-contact-row executive-contact-row">${primaryContacts
                                  .map((item) => `<span class="resume-contact-item">${escapeHtml(item)}</span>`)
                                  .join("")}</div>`
                              : ""
                          }
                          ${
                            secondaryContacts.length > 0
                              ? `<div class="resume-contact-row executive-contact-row">${secondaryContacts
                                  .map((item) => `<span class="resume-contact-item">${escapeHtml(item)}</span>`)
                                  .join("")}</div>`
                              : ""
                          }
                        </div>
                      `
                      : ""
                  }
                </div>
                <div class="executive-photo-column">
                  ${headerPhoto}
                </div>
              </div>
            `
          : `
            <h1 class="${variant.nameClass}">${escapeHtml(data.personalInfo.fullName || "Your Name")}</h1>
            <div class="resume-role ${variant.roleClass}">${escapeHtml(data.personalInfo.title || "Frontend Developer")}</div>
            ${
              contacts.length > 0
                ? `<div class="resume-contact-row ${variant.contactClass}">${contacts
                    .map((item) => `<span class="resume-contact-item">${escapeHtml(item)}</span>`)
                    .join('<span class="resume-separator">|</span>')}</div>`
                : ""
            }
          `
      }
    </header>
  `;
}

function renderSummary(
  data: ResumeData,
  variant: (typeof templateVariants)[ResumeTemplate]
) {
  const lines = splitLines(data.summary);
  if (!lines.length) return "";

  return `
    <section class="resume-section">
      <div class="section-title ${variant.sectionTitleClass}">Professional Summary</div>
      <ul class="bullet-list ${variant.bulletClass}">
        ${renderListItems(lines)}
      </ul>
    </section>
  `;
}

function renderSkills(
  data: ResumeData,
  variant: (typeof templateVariants)[ResumeTemplate]
) {
  const categories = categorizeSkills(data.skills);
  if (!categories.length) return "";

  return `
    <section class="resume-section">
      <div class="section-title ${variant.sectionTitleClass}">Skills</div>
      <div class="skills-block">
        ${categories
          .map(
            (category) =>
              `<p class="skill-line"><span class="skill-label">${escapeHtml(category.title)}:</span> ${escapeHtml(
                category.skills.join(", ")
              )}</p>`
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderExperience(data: ResumeData, variant: (typeof templateVariants)[ResumeTemplate]) {
  const items = getVisibleExperience(data);
  const isModern = data.template === "modern";
  const isExecutive = data.template === "executive";
  if (!items.length) return "";

  return `
    <section class="resume-section">
      <div class="section-title ${variant.sectionTitleClass}">Work Experience</div>
      <div class="entry-stack">
        ${items
          .map((item) => {
            const bullets = splitLines(item.description);
            return `
              <article class="resume-entry ${variant.entryClass}">
                <div class="entry-head">
                  <div>
                    ${
                      item.companyName || isModern
                        ? `<div class="entry-subtitle ${variant.entrySubtitleClass}">${escapeHtml(
                            item.companyName || "Company"
                          )}</div>`
                        : ""
                    }
                    <div class="${isExecutive ? "executive-role-block" : ""}">
                      <div class="${variant.entryTitleClass}">${escapeHtml(item.role || "Role")}</div>
                    </div>
                  </div>
                  ${item.duration ? `<div class="entry-meta ${variant.entryMetaClass}">${escapeHtml(item.duration)}</div>` : ""}
                </div>
                ${
                  bullets.length > 0
                    ? `<ul class="bullet-list ${variant.bulletClass}">${renderListItems(bullets)}</ul>`
                    : ""
                }
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderProjects(data: ResumeData, variant: (typeof templateVariants)[ResumeTemplate]) {
  const items = getVisibleProjects(data);
  const isModern = data.template === "modern";
  const isExecutive = data.template === "executive";
  if (!items.length) return "";

  return `
    <section class="resume-section">
      <div class="section-title ${variant.sectionTitleClass}">Projects</div>
      <div class="entry-stack">
        ${items
          .map((item) => {
            const bullets = splitLines(item.description);
            const links = [
              item.githubLink
                ? `<a href="${escapeHtml(normalizeUrl(item.githubLink))}" target="_blank" rel="noreferrer">GitHub</a>`
                : "",
              item.liveLink
                ? `<a href="${escapeHtml(normalizeUrl(item.liveLink))}" target="_blank" rel="noreferrer">Live Link</a>`
                : "",
            ].filter(Boolean);

            return `
              <article class="resume-entry ${variant.entryClass}">
                <div class="${isExecutive ? "executive-project-head" : ""}">
                  <div class="${variant.entryTitleClass}">
                    ${escapeHtml(item.projectName || "Project Name")}
                  </div>
                  ${
                    links.length > 0 && isExecutive
                      ? `<div class="project-links ${variant.projectLinksClass}">${links.join(
                          ' <span class="resume-separator">|</span> '
                        )}</div>`
                      : ""
                  }
                </div>
                ${
                  links.length > 0 && !isExecutive
                    ? `<div class="project-links ${variant.projectLinksClass}">${
                        isModern
                          ? links.join("")
                          : links.join(' <span class="resume-separator">|</span> ')
                      }</div>`
                    : ""
                }
                ${
                  bullets.length > 0
                    ? `<ul class="bullet-list ${variant.bulletClass}">${renderListItems(bullets)}</ul>`
                    : ""
                }
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderEducation(data: ResumeData, variant: (typeof templateVariants)[ResumeTemplate]) {
  const items = getVisibleEducation(data);
  const isModern = data.template === "modern";
  const isExecutive = data.template === "executive";
  if (!items.length) return "";

  return `
    <section class="resume-section">
      <div class="section-title ${variant.sectionTitleClass}">Education</div>
      <div class="entry-stack">
        ${items
          .map((item) => {
            const bullets = splitLines(item.description);

            return `
              <article class="resume-entry ${variant.entryClass}">
                <div class="entry-head">
                  <div>
                    ${
                      item.institutionName || isModern
                        ? `<div class="entry-subtitle ${variant.entrySubtitleClass}">${escapeHtml(
                            item.institutionName || "Institution"
                          )}</div>`
                        : ""
                    }
                    <div class="${isExecutive ? "executive-role-block" : ""}">
                      <div class="${variant.entryTitleClass}">${escapeHtml(item.degree || "Degree")}</div>
                    </div>
                  </div>
                  ${item.year ? `<div class="entry-meta ${variant.entryMetaClass}">${escapeHtml(item.year)}</div>` : ""}
                </div>
                ${
                  bullets.length > 0
                    ? `<ul class="bullet-list ${variant.bulletClass}">${renderListItems(bullets)}</ul>`
                    : ""
                }
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderCertifications(
  data: ResumeData,
  variant: (typeof templateVariants)[ResumeTemplate]
) {
  if (!data.certifications.length) return "";

  return `
    <section class="resume-section">
      <div class="section-title ${variant.sectionTitleClass}">Certifications</div>
      <ul class="bullet-list ${variant.bulletClass}">
        ${renderListItems(data.certifications)}
      </ul>
    </section>
  `;
}

function createResumeAutoFitScript(pageCount: number, initialScale: number) {
  return `
    (function () {
      const viewport = document.querySelector(".resume-sheet-viewport");
      const sheet = document.querySelector(".resume-sheet");
      if (!viewport || !sheet) return;

      const pageHeight = ${A4_RESUME_PAGE_HEIGHT};
      const pageLimit = ${pageCount};
      const minScale = ${MIN_RESUME_SCALE};

      function applyScale() {
        const naturalHeight = Math.max(pageHeight, sheet.scrollHeight);
        const nextScale = Math.min(1, Math.max(minScale, (pageHeight * pageLimit) / naturalHeight));
        const nextPages = Math.max(1, Math.min(pageLimit, Math.ceil((naturalHeight * nextScale) / pageHeight)));

        document.documentElement.style.setProperty("--resume-scale", String(nextScale));
        document.documentElement.style.setProperty("--resume-pages", String(nextPages));
        viewport.style.height = Math.max(pageHeight * nextPages, naturalHeight * nextScale) + "px";
      }

      document.documentElement.style.setProperty("--resume-scale", String(${initialScale}));
      applyScale();
      window.addEventListener("load", applyScale);
      window.addEventListener("resize", applyScale);
      if (document.fonts?.ready) {
        document.fonts.ready.then(applyScale).catch(() => {});
      }
    })();
  `;
}

export function createResumeFileName(data: ResumeData) {
  return `${slugify(data.personalInfo.fullName || "resume") || "resume"}-resume.html`;
}

export function createResumeDocument(data: ResumeData) {
  const layoutEstimate = getResumeLayoutEstimate(data);
  const variant = templateVariants[data.template];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(data.personalInfo.fullName || "Resume")} Resume</title>
  <style>
    :root {
      --ink: #111827;
      --muted: #4b5563;
      --line: #d1d5db;
      --soft-line: #e5e7eb;
      --paper: #ffffff;
      --page-height: ${A4_RESUME_PAGE_HEIGHT}px;
      --sheet-width: ${A4_RESUME_WIDTH}px;
      --resume-scale: ${layoutEstimate.scale};
      --resume-pages: 1;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 20px;
      font-family: Arial, Helvetica, sans-serif;
      color: var(--ink);
      background: #edf2f7;
    }

    .resume-sheet-viewport {
      position: relative;
      width: calc(var(--sheet-width) * var(--resume-scale));
      min-height: calc(var(--page-height) * var(--resume-pages));
      margin: 0 auto;
    }

    .resume-sheet {
      width: var(--sheet-width);
      min-height: 1120px;
      background: var(--paper);
      box-shadow: 0 24px 80px rgba(15, 23, 39, 0.14);
      position: absolute;
      left: 0;
      top: 0;
      overflow: hidden;
      transform: scale(var(--resume-scale));
      transform-origin: top left;
      padding: 36px 40px;
    }

    .resume-shell {
      display: block;
      position: relative;
      z-index: 1;
    }

    .resume-background-layer {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .resume-background-fill,
    .resume-strip-left,
    .resume-orb-top-left,
    .resume-line,
    .resume-box,
    .resume-header-band,
    .resume-watermark,
    .resume-watermark-outline {
      position: absolute;
    }

    .resume-background-fill {
      inset: 0;
    }

    .resume-strip-left {
      inset: 0 auto 0 0;
      width: 6px;
    }

    .resume-orb-top-left {
      left: 40px;
      top: 0;
      width: 288px;
      height: 208px;
    }

    .resume-line {
      height: 1px;
    }

    .resume-box {
      border: 1px solid transparent;
      border-radius: 28px;
    }

    .resume-header-band {
      inset: 0 0 auto 0;
      height: 144px;
    }

    .resume-watermark {
      right: -56px;
      top: 40px;
      width: 192px;
      height: 192px;
      border-radius: 999px;
    }

    .resume-watermark-outline {
      right: -24px;
      top: 80px;
      width: 112px;
      height: 112px;
      border-radius: 999px;
      border: 1px solid transparent;
    }

    .sheet-modern {
      padding: 40px 44px;
    }

    .sheet-professional {
      padding: 40px 48px;
    }

    .sheet-minimal {
      padding: 32px 48px;
    }

    .sheet-executive {
      padding: 40px 48px;
    }

    .resume-header {
      padding-bottom: 18px;
      border-bottom: 1px solid var(--line);
    }

    .header-minimal {
      border-top: 1px solid var(--line);
      padding-top: 16px;
      padding-bottom: 16px;
      text-align: center;
    }

    .header-modern {
      border-top: 3px solid #0369a1;
      border-bottom-width: 2px;
      padding-top: 18px;
      padding-bottom: 16px;
    }

    .header-professional {
      padding-bottom: 16px;
      text-align: center;
    }

    .header-executive {
      padding-bottom: 24px;
    }

    .header-modern-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 240px;
      gap: 18px;
      align-items: end;
    }

    .header-executive-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 146px;
      gap: 28px;
      align-items: start;
    }

    .divider-modern,
    .divider-executive {
      border-bottom: 1.5px solid #b45309;
    }

    .divider-professional {
      border-bottom: 1px solid #0f766e;
    }

    .divider-minimal {
      border-bottom: 1px solid #c7d2fe;
    }

    .resume-role {
      margin-top: 6px;
      font-size: 15px;
      font-weight: 600;
      color: var(--muted);
    }

    .role-minimal {
      margin-top: 8px;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #4338ca;
    }

    .role-modern {
      margin-top: 7px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #0369a1;
    }

    .role-professional {
      margin-top: 6px;
      font-size: 13px;
      font-weight: 500;
      color: #0f766e;
    }

    .role-executive {
      margin-top: 8px;
      font-size: 12.5px;
      font-weight: 600;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: #92400e;
    }

    .resume-contact-row {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 12.5px;
      line-height: 1.7;
      color: var(--muted);
    }

    .contacts-minimal {
      justify-content: center;
      font-size: 11px;
      line-height: 1.6;
    }

    .contacts-modern {
      margin-top: 0;
      display: grid;
      gap: 4px;
      justify-items: end;
      text-align: right;
      font-size: 11.5px;
      line-height: 1.5;
    }

    .contacts-professional {
      margin-top: 12px;
      justify-content: center;
      gap: 4px 8px;
      font-size: 11.5px;
      line-height: 1.55;
    }

    .contacts-executive {
      margin-top: 16px;
      display: grid;
      gap: 8px 24px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      font-size: 11px;
      line-height: 1.55;
    }

    .executive-contact-row {
      margin-top: 0;
      display: grid;
      gap: 4px;
    }

    .executive-photo-column {
      display: flex;
      justify-content: flex-end;
      border-left: 1px solid #fcd34d;
      padding-left: 28px;
    }

    .executive-photo-shell,
    .executive-photo-placeholder {
      width: 118px;
      height: 156px;
      border: 2px solid #b45309;
      background: #ffffff;
    }

    .executive-photo-shell {
      padding: 6px;
    }

    .executive-photo-image {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .executive-photo-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.34em;
      text-transform: uppercase;
      color: #92400e;
    }

    .resume-contact-item {
      word-break: break-all;
    }

    .resume-separator {
      color: #9ca3af;
    }

    .resume-section + .resume-section {
      margin-top: 22px;
    }

    .section-title {
      margin-bottom: 10px;
      font-size: 11px;
      text-transform: uppercase;
      color: #111827;
    }

    .section-modern,
    .section-executive {
      font-weight: 700;
      letter-spacing: 0.3em;
    }

    .section-modern {
      display: flex;
      align-items: center;
      gap: 12px;
      letter-spacing: 0.34em;
      color: #0369a1;
    }

    .section-modern::before {
      content: "";
      width: 36px;
      height: 2px;
      background: #0ea5e9;
      flex-shrink: 0;
    }

    .section-modern::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #bae6fd;
    }

    .section-professional {
      font-weight: 700;
      letter-spacing: 0.22em;
      border-bottom: 1px solid #0f766e;
      padding-bottom: 4px;
      font-size: 10.5px;
      color: #0f766e;
    }

    .section-executive {
      display: flex;
      align-items: center;
      gap: 16px;
      border-top: 1.5px solid #b45309;
      padding-top: 8px;
      font-size: 10.5px;
      letter-spacing: 0.28em;
      color: #b45309;
    }

    .section-executive::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #fde68a;
    }

    .section-minimal {
      font-weight: 600;
      letter-spacing: 0.34em;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #4338ca;
    }

    .section-minimal::before,
    .section-minimal::after {
      content: "";
      flex: 1;
      height: 1.5px;
      background: #6366f1;
    }

    .name-modern,
    .name-professional,
    .name-executive,
    .name-minimal {
      margin: 0;
      color: #111827;
    }

    .name-modern,
    .name-professional {
      font-size: 31px;
      font-weight: 700;
    }

    .name-modern {
      font-size: 32px;
      letter-spacing: -0.04em;
    }

    .name-executive {
      font-size: 34px;
      font-weight: 700;
      letter-spacing: -0.03em;
    }

    .name-minimal {
      font-size: 28px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .skills-block {
      display: grid;
      gap: 8px;
    }

    .template-modern .skills-block {
      padding-left: 20px;
    }

    .template-minimal .skills-block {
      padding-left: 18px;
    }

    .template-professional .skills-block {
      padding-left: 18px;
    }

    .skill-line {
      margin: 0;
      font-size: 13.5px;
      line-height: 1.6;
      color: var(--muted);
      word-break: break-word;
    }

    .skill-label {
      font-weight: 700;
      color: var(--ink);
    }

    .entry-stack {
      display: grid;
      gap: 18px;
    }

    .resume-entry {
      display: grid;
      gap: 8px;
    }

    .entry-modern-shell {
      border-left: 2px solid #0ea5e9;
      padding-left: 18px;
    }

    .entry-professional-shell {
      border-bottom: 1px solid var(--soft-line);
      padding-bottom: 12px;
    }

    .entry-executive-shell {
      border-bottom: 1px solid var(--soft-line);
      padding-bottom: 16px;
    }

    .executive-role-block {
      margin-top: 6px;
    }

    .executive-project-head {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .entry-stack .entry-professional-shell:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    .entry-stack .entry-executive-shell:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }

    .entry-minimal-shell {
      border-top: 1px solid var(--soft-line);
      padding-top: 12px;
    }

    .entry-stack .entry-minimal-shell:first-child {
      border-top: 0;
      padding-top: 0;
    }

    .entry-head {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: flex-start;
    }

    .entry-modern,
    .entry-professional,
    .entry-executive {
      font-size: 15px;
      font-weight: 700;
      color: var(--ink);
    }

    .entry-minimal {
      font-size: 14px;
      font-weight: 600;
      color: var(--ink);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .entry-subtitle-professional {
      margin-top: 4px;
      font-size: 13px;
      color: #0f766e;
    }

    .entry-subtitle-executive {
      margin-top: 0;
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #b45309;
    }

    .entry-meta-professional {
      padding-top: 2px;
      font-size: 11.5px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #0f766e;
    }

    .entry-meta-executive {
      padding-top: 2px;
      font-size: 11.25px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #92400e;
    }

    .entry-subtitle-modern {
      margin-top: 4px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #0369a1;
    }

    .entry-meta-modern {
      padding-top: 2px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #075985;
    }

    .entry-meta {
      white-space: nowrap;
      font-size: 12px;
      font-weight: 500;
      color: var(--muted);
    }

    .education-school {
      font-size: 13.5px;
      color: var(--muted);
    }

    .project-links {
      margin-left: 8px;
      font-weight: 500;
    }

    .project-links a {
      color: var(--muted);
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    .project-links-modern {
      margin-left: 0;
      margin-top: 6px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px 12px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #0369a1;
    }

    .project-links-professional {
      margin-left: 0;
      margin-top: 6px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px 12px;
      font-size: 11px;
      font-weight: 500;
      color: #0f766e;
    }

    .project-links-executive {
      margin-left: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 6px 12px;
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #b45309;
    }

    .bullet-list {
      margin: 0;
      padding-left: 18px;
      display: grid;
      gap: 6px;
      color: var(--muted);
      font-size: 13.5px;
      line-height: 1.65;
    }

    .bullets-modern {
      gap: 6px;
      padding-left: 20px;
      font-size: 13px;
      line-height: 1.55;
    }

    .bullets-professional {
      gap: 5px;
      font-size: 12.75px;
      line-height: 1.55;
    }

    .bullets-executive {
      gap: 6px;
      font-size: 12.85px;
      line-height: 1.65;
    }

    .bullets-minimal {
      gap: 4px;
      font-size: 12.5px;
      line-height: 1.5;
    }

    @media print {
      @page {
        size: A4;
        margin: 0.45in;
      }

      body {
        padding: 0;
        background: white;
      }

      .resume-sheet {
        box-shadow: none;
      }
    }

    @media (max-width: 860px) {
      body { padding: 10px; }
      .entry-head { flex-direction: column; }
      .header-executive-grid { grid-template-columns: 1fr; }
      .contacts-executive { grid-template-columns: 1fr; }
      .executive-photo-column {
        justify-content: flex-start;
        border-left: 0;
        padding-left: 0;
      }
      .executive-project-head { gap: 8px; }
    }
  </style>
</head>
<body>
  <div class="resume-sheet-viewport">
    <div class="resume-sheet">
      ${renderBackgroundLayer(data)}
      <div class="resume-shell ${variant.rootClass} ${variant.sheetClass}">
        ${renderHeader(data, variant)}
        ${renderSummary(data, variant)}
        ${renderSkills(data, variant)}
        ${renderExperience(data, variant)}
        ${renderProjects(data, variant)}
        ${renderEducation(data, variant)}
        ${renderCertifications(data, variant)}
      </div>
    </div>
  </div>
  <script>${createResumeAutoFitScript(data.pageCount, layoutEstimate.scale)}</script>
</body>
</html>`;
}
