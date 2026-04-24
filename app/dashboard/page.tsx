"use client";

import {
  Activity,
  BrainCircuit,
  FileSignature,
  FolderKanban,
  RadioTower,
} from "lucide-react";
import { recentActivity } from "@/lib/mock-data";
import { ActivityCard } from "./components/ActivityCard";
import { DashboardLayout } from "./components/DashboardLayout";
import { ScoreCard } from "./components/ScoreCard";
import { StatusCard } from "./components/StatusCard";

const portfolioActivity = recentActivity.filter((activity) =>
  /portfolio|deployment|github/i.test(activity.title + activity.description)
);

const dashboardCards = {
  left: [
    {
      title: "Portfolio Status",
      description:
        "Public profile is ready with featured projects, social links, and deployable portfolio sections.",
      metric: "Live",
      label: "Portfolio",
      href: "/portfolio",
      cta: "Open builder",
      icon: FolderKanban,
      progress: 88,
      accent: "from-cyan-300/70 via-blue-500/30 to-white/10",
    },
    {
      title: "Resume Status",
      description:
        "ATS structure, one-page fit, and export formats are ready for the next application round.",
      metric: "91/100",
      label: "Resume",
      href: "/resume-generator",
      cta: "Edit resume",
      icon: FileSignature,
      progress: 91,
      accent: "from-violet-300/70 via-fuchsia-500/30 to-white/10",
    },
  ],
  right: [
    {
      title: "Recruiter Signal",
      description:
        "Keyword match, portfolio proof, and interview confidence are trending upward this week.",
      metric: "High",
      label: "Signal",
      href: "/resume-analyzer",
      cta: "View insights",
      icon: RadioTower,
      progress: 86,
      accent: "from-emerald-300/70 via-cyan-500/30 to-white/10",
    },
    {
      title: "Interview Readiness",
      description:
        "Recent practice rounds show stronger structure, better timing, and clearer technical tradeoffs.",
      metric: "8.4/10",
      label: "Interview",
      href: "/live-interview",
      cta: "Practice",
      icon: BrainCircuit,
      progress: 84,
      accent: "from-blue-300/70 via-violet-500/30 to-white/10",
    },
  ],
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <ScoreCard />

      <section className="grid w-full max-w-full grid-cols-1 gap-6 md:grid-cols-2">
        <div className="grid min-w-0 grid-cols-1 gap-6">
          {dashboardCards.left.map((card) => (
            <StatusCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-6">
          {dashboardCards.right.map((card) => (
            <StatusCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="grid w-full max-w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityCard
          title="Activity"
          description="Everything recently improved across portfolio, resume, interview prep, and deployment."
          icon={Activity}
          items={recentActivity}
        />
        <ActivityCard
          title="Portfolio Momentum"
          description="A focused view of the updates that affect your public developer identity."
          icon={FolderKanban}
          items={portfolioActivity.length ? portfolioActivity : recentActivity.slice(0, 3)}
        />
      </section>
    </DashboardLayout>
  );
}
