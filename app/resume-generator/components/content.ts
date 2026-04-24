import { type ResumeData } from "./types";

export function stripBulletPrefix(value: string) {
  return value.replace(/^[\s\u2022\-\u2013\u2014]+/, "").trim();
}

export function splitLines(value: string) {
  return value
    .split(/\n+/)
    .map(stripBulletPrefix)
    .filter(Boolean);
}

export function normalizeUrl(value: string) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function getHeaderContacts(data: ResumeData) {
  return [
    data.personalInfo.phone,
    data.personalInfo.email,
    data.personalInfo.github,
    data.personalInfo.linkedin,
    data.personalInfo.website,
  ].filter(Boolean);
}

export function getVisibleExperience(data: ResumeData) {
  return data.experience.filter(
    (item) => item.companyName || item.role || item.description
  );
}

export function getVisibleProjects(data: ResumeData) {
  return data.projects.filter(
    (item) => item.projectName || item.description || item.techStack.length > 0
  );
}

export function getVisibleEducation(data: ResumeData) {
  return data.education.filter(
    (item) => item.institutionName || item.degree || item.description
  );
}
