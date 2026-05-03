export type ResumeTemplate =
  | "modern"
  | "minimal"
  | "professional"
  | "executive";

export type ResumePageCount = 1 | 2 | 3;
export type ResumeBackgroundTheme = "blue" | "purple" | "neutral";
export type ResumeBackgroundIntensity = "low" | "medium";
export type UploadState = "idle" | "uploading" | "processing" | "complete" | "error";

export type UploadStatus = {
  state: UploadState;
  progress: number;
  fileName?: string;
  message?: string;
};

export type PersonalInfo = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
};

export type ExperienceItem = {
  id: string;
  companyName: string;
  role: string;
  duration: string;
  description: string;
};

export type EducationItem = {
  id: string;
  institutionName: string;
  degree: string;
  year: string;
  description: string;
};

export type ProjectItem = {
  id: string;
  projectName: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink?: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: string[];
  achievements: string[];
  template: ResumeTemplate;
  pageCount: ResumePageCount;
  photo: string | null;
  photoPosition: number;
  includePhoto: boolean;
  backgroundEnabled: boolean;
  backgroundTheme: ResumeBackgroundTheme;
  backgroundIntensity: ResumeBackgroundIntensity;
  atsMode: boolean;
};

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export function createExperienceItem(): ExperienceItem {
  return {
    id: createId(),
    companyName: "",
    role: "",
    duration: "",
    description: "",
  };
}

export function createEducationItem(): EducationItem {
  return {
    id: createId(),
    institutionName: "",
    degree: "",
    year: "",
    description: "",
  };
}

export function createProjectItem(): ProjectItem {
  return {
    id: createId(),
    projectName: "",
    description: "",
    techStack: [],
    githubLink: "",
    liveLink: "",
  };
}
