import {
  BarChart3,
  BrainCircuit,
  FileSignature,
  Globe2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type FeatureCard = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  accent: string;
};

export const featureCards: FeatureCard[] = [
  {
    title: "Portfolio Builder",
    description: "Craft a polished developer portfolio with live sections, projects, and links.",
    href: "/portfolio",
    cta: "Build portfolio",
    icon: Sparkles,
    accent: "from-cyan-500/20 to-sky-500/10",
  },
  {
    title: "Resume Generator",
    description: "Generate tailored resumes using modern developer-first templates.",
    href: "/resume-generator",
    cta: "Generate resume",
    icon: FileSignature,
    accent: "from-amber-400/20 to-orange-500/10",
  },
  {
    title: "Resume Analyzer",
    description: "Understand strengths, gaps, and ATS readiness with visual feedback.",
    href: "/resume-analyzer",
    cta: "Analyze resume",
    icon: BarChart3,
    accent: "from-emerald-500/20 to-cyan-500/10",
  },
  {
    title: "Live Interview",
    description: "Run timed mock interviews with structured questions, live score, and feedback.",
    href: "/live-interview",
    cta: "Start interview",
    icon: BrainCircuit,
    accent: "from-violet-500/20 to-cyan-500/10",
  },
  {
    title: "Deploy Portfolio",
    description: "Push your portfolio to a production-style Vercel flow in one click.",
    href: "/deploy",
    cta: "Deploy now",
    icon: Globe2,
    accent: "from-sky-500/20 to-cyan-500/10",
  },
];

export const recentActivity = [
  {
    title: "Portfolio draft updated",
    description: "Hero section and recent projects were synced from GitHub metadata.",
    time: "12 minutes ago",
  },
  {
    title: "Resume version v3 generated",
    description: "Frontend Engineer template exported with updated experience bullets.",
    time: "46 minutes ago",
  },
  {
    title: "ATS analysis completed",
    description: "Resume score improved by 11 points after keyword optimization.",
    time: "2 hours ago",
  },
  {
    title: "Live interview round finished",
    description: "Mock full-stack interview completed with follow-up evaluation and saved report.",
    time: "3 hours ago",
  },
  {
    title: "Deployment staged",
    description: "Preview build prepared for `vampforge-dev.vercel.app`.",
    time: "Today",
  },
];

export const quickActions = [
  {
    label: "Import GitHub profile",
    href: "/portfolio",
  },
  {
    label: "Regenerate summary section",
    href: "/portfolio",
  },
  {
    label: "Review missing ATS keywords",
    href: "/resume-analyzer",
  },
  {
    label: "Start live interview round",
    href: "/live-interview",
  },
  {
    label: "Deploy latest portfolio",
    href: "/deploy",
  },
];
