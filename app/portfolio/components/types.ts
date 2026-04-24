export type SocialLinkKey = "github" | "linkedin" | "twitter";
export type PortfolioTemplate = "nova" | "orbit" | "terminal";
export type UploadState = "idle" | "uploading" | "processing" | "complete" | "error";

export type UploadStatus = {
  state: UploadState;
  progress: number;
  fileName?: string;
  message?: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  imageUrl: string;
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
};

export type EducationItem = {
  id: string;
  institution: string;
  degree: string;
  year: string;
  grade: string;
};

export type AchievementItem = {
  id: string;
  title: string;
  category: string;
  description: string;
};

export type ContactInfo = {
  email: string;
  phone: string;
  location: string;
  website: string;
  resumeLink: string;
};

export type PortfolioData = {
  template: PortfolioTemplate;
  name: string;
  title: string;
  summary: string;
  about: string;
  experienceSummary: string;
  careerGoals: string;
  techFocus: string;
  clientCount: string;
  skills: string[];
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  achievements: AchievementItem[];
  socialLinks: Record<SocialLinkKey, string>;
  contact: ContactInfo;
  profileImage: string | null;
  profileImagePosition: number;
};

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export function createProject(): Project {
  return {
    id: createId(),
    name: "",
    description: "",
    techStack: [],
    githubLink: "",
    liveLink: "",
    imageUrl: "",
  };
}

export function createExperienceItem(): ExperienceItem {
  return {
    id: createId(),
    company: "",
    role: "",
    duration: "",
    description: "",
  };
}

export function createEducationItem(): EducationItem {
  return {
    id: createId(),
    institution: "",
    degree: "",
    year: "",
    grade: "",
  };
}

export function createAchievementItem(): AchievementItem {
  return {
    id: createId(),
    title: "",
    category: "",
    description: "",
  };
}
