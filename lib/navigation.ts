import {
  Blocks,
  BrainCircuit,
  FileBarChart2,
  FolderKanban,
  LayoutDashboard,
  Rocket,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Track progress, quick actions, and brand health at a glance.",
  },
  {
    title: "Portfolio Builder",
    href: "/portfolio",
    icon: FolderKanban,
    description: "Shape a polished public portfolio with live editing and export.",
  },
  {
    title: "Resume Generator",
    href: "/resume-generator",
    icon: Blocks,
    description: "Create sharper resumes with cleaner templates and instant preview.",
  },
  {
    title: "Live Interview",
    href: "/live-interview",
    icon: BrainCircuit,
    description: "Practice real-time mock interviews with timers, scoring, and feedback.",
  },
  {
    title: "Resume Analyzer",
    href: "/resume-analyzer",
    icon: FileBarChart2,
    description: "Review strengths, ATS fit, and targeted resume improvements.",
  },
  {
    title: "Publish Portfolio",
    href: "/deploy",
    icon: Rocket,
    description: "Push portfolio code to GitHub and prepare it for deployment on any platform.",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Tune workspace preferences, details, and publishing defaults.",
  },
] as const;
