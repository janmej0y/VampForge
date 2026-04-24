import { splitLines } from "./content";
import { type ResumeData } from "./types";

export const A4_RESUME_WIDTH = 794;
export const A4_RESUME_PAGE_HEIGHT = 1120;
export const MIN_RESUME_SCALE = 0.32;

const PAGE_WEIGHT_CAPACITY = 78;

function countWrappedLines(value: string, charactersPerLine: number) {
  return splitLines(value).reduce((total, line) => {
    return total + Math.max(1, Math.ceil(line.length / charactersPerLine));
  }, 0);
}

function templateDensityFactor(template: ResumeData["template"]) {
  if (template === "minimal") return 1.06;
  if (template === "modern") return 0.98;
  if (template === "professional") return 0.96;
  return 0.94;
}

export function estimateResumeContentWeight(data: ResumeData) {
  const visibleExperience = data.experience.filter(
    (item) => item.companyName || item.role || item.description
  );
  const visibleEducation = data.education.filter(
    (item) => item.institutionName || item.degree || item.description
  );
  const visibleProjects = data.projects.filter(
    (item) => item.projectName || item.description || item.techStack.length > 0
  );
  const contactCount = [
    data.personalInfo.phone,
    data.personalInfo.email,
    data.personalInfo.github,
    data.personalInfo.linkedin,
    data.personalInfo.website,
  ].filter(Boolean).length;

  let weight = 12;
  weight += Math.max(
    2,
    Math.ceil((data.personalInfo.fullName.length + data.personalInfo.title.length) / 26)
  );
  weight += Math.ceil(contactCount / 2);
  weight += countWrappedLines(data.summary, 110) * 1.35;
  weight += Math.ceil(data.skills.length * 0.42);
  weight += data.certifications.length * 0.8;

  visibleExperience.forEach((item) => {
    weight += 4;
    weight += countWrappedLines(item.description, 105) * 1.08;
  });

  visibleProjects.forEach((item) => {
    weight += 3.4;
    weight += countWrappedLines(item.description, 108);
    if (item.githubLink || item.liveLink) {
      weight += 0.8;
    }
  });

  visibleEducation.forEach((item) => {
    weight += 2.4;
    weight += countWrappedLines(item.description, 112) * 0.88;
  });

  return weight / templateDensityFactor(data.template);
}

export function getResumeLayoutEstimate(data: ResumeData) {
  const weight = estimateResumeContentWeight(data);
  const selectedPages = data.pageCount;
  const requiredScale = Math.min(
    1,
    Math.max(MIN_RESUME_SCALE, (PAGE_WEIGHT_CAPACITY * selectedPages) / Math.max(weight, 1))
  );
  const estimatedPages = Math.max(
    1,
    Math.ceil(weight / (PAGE_WEIGHT_CAPACITY / requiredScale))
  );

  return {
    selectedPages,
    scale: requiredScale,
    estimatedPages: Math.min(selectedPages, estimatedPages),
  };
}
