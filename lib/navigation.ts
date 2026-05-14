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
    description: "Progress and quick actions.",
  },
  {
    title: "Resume Analyzer",
    href: "/resume-analyzer",
    icon: FileBarChart2,
    description: "ATS fit and fixes.",
  },
  {
    title: "Resume Generator",
    href: "/resume-generator",
    icon: Blocks,
    description: "Clean resumes and exports.",
  },
  {
    title: "Portfolio Builder",
    href: "/portfolio",
    icon: FolderKanban,
    description: "Live portfolio editing.",
  },
  {
    title: "Publish Portfolio",
    href: "/deploy",
    icon: Rocket,
    description: "Package portfolio code.",
  },
  {
    title: "Live Interview",
    href: "/live-interview",
    icon: BrainCircuit,
    description: "Timed AI interview practice.",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Keys and preferences.",
  },
] as const;
