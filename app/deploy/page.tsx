"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, Globe, Rocket, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getGithubClientId } from "@/lib/firebase-client";
import { DeployCard } from "./components/DeployCard";
import { DeploymentHistory } from "./components/DeploymentHistory";
import { DeploymentStatus } from "./components/DeploymentStatus";
import { PortfolioPreview } from "./components/PortfolioPreview";
import {
  type DeploymentFormData,
  type DeploymentHistoryItem,
  type DeploymentStatusType,
  type DeploymentStep,
} from "./components/types";

const deploymentSteps: DeploymentStep[] = [
  {
    id: "prepare",
    label: "Preparing Portfolio Files...",
    description: "Collecting portfolio metadata, repository details, and publish settings.",
  },
  {
    id: "build",
    label: "Packaging Source...",
    description: "Generating a clean project package that is ready to live in a GitHub repository.",
  },
  {
    id: "upload",
    label: "Pushing to GitHub...",
    description: "Simulating the repository push into the connected GitHub account.",
  },
  {
    id: "success",
    label: "GitHub Push Complete",
    description: "The portfolio code is ready in GitHub and can now be deployed on any hosting platform.",
  },
];

const initialFormData: DeploymentFormData = {
  templateName: "Modern Template",
  portfolioName: "Janmejoy Portfolio",
  lastUpdated: "Today, 9:42 PM",
  subdomain: "janmejoy",
  customDomain: "portfolio.janmejoy.dev",
  githubRepoName: "vampforge-portfolio",
  githubConnected: false,
  githubUsername: "",
  environment: "production",
};

const initialHistory: DeploymentHistoryItem[] = [
  {
    id: "history-1",
    date: "Today",
    status: "Pushed",
    url: "github.com/janmejoy/vampforge-portfolio",
    environment: "production",
  },
  {
    id: "history-2",
    date: "Yesterday",
    status: "Preview",
    url: "github.com/janmejoy/vampforge-portfolio-preview",
    environment: "preview",
  },
  {
    id: "history-3",
    date: "Apr 07, 2026",
    status: "Pushed",
    url: "github.com/janmejoy/janmejoy-portfolio",
    environment: "production",
  },
];

export default function DeployPage() {
  const [formData, setFormData] = useState<DeploymentFormData>(initialFormData);
  const [deploymentStatus, setDeploymentStatus] =
    useState<DeploymentStatusType>("idle");
  const [progress, setProgress] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [liveUrl, setLiveUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<DeploymentHistoryItem[]>(initialHistory);
  const [githubConnectionError, setGithubConnectionError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const githubCode = params.get("code");
    const githubState = params.get("state");

    if (githubCode && githubState === "vampforge-github-connect") {
      setFormData((current) => ({
        ...current,
        githubConnected: true,
        githubUsername: "github-oauth-pending",
      }));
      setGithubConnectionError(null);
      window.history.replaceState(null, "", "/deploy");
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const previewUrl = useMemo(() => {
    const owner = formData.githubConnected
      ? formData.githubUsername || "connected-developer"
      : "your-github-username";
    const repoName = (formData.githubRepoName || formData.subdomain || "portfolio-source")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    return `https://github.com/${owner}/${repoName}`;
  }, [formData.githubConnected, formData.githubRepoName, formData.githubUsername, formData.subdomain]);

  const statusLabel = useMemo(() => {
    if (deploymentStatus === "success") return "Pushed";
    if (deploymentStatus === "deploying") return "Publishing";
    return "Ready";
  }, [deploymentStatus]);

  const handleFieldChange = (
    field: "portfolioName" | "subdomain" | "customDomain" | "githubRepoName",
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleDeploy = () => {
    if (!formData.githubConnected) {
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setDeploymentStatus("deploying");
    setProgress(0);
    setActiveStepIndex(0);
    setCopied(false);
    setLiveUrl("");
    setGithubConnectionError(null);

    const nextRepoName = (formData.githubRepoName || formData.subdomain || "portfolio-source")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
    const nextUrl = `https://github.com/${formData.githubUsername || "connected-developer"}/${nextRepoName}`;

    const progressPoints = [18, 42, 73, 100];
    let stepCursor = 0;

    intervalRef.current = setInterval(() => {
      setProgress(progressPoints[stepCursor] ?? 100);
      setActiveStepIndex(stepCursor);
      stepCursor += 1;

      if (stepCursor >= progressPoints.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        setDeploymentStatus("success");
        setActiveStepIndex(deploymentSteps.length - 1);
        setLiveUrl(nextUrl);
        setFormData((current) => ({
          ...current,
          lastUpdated: "Just now",
        }));
        setHistory((current) => [
          {
            id: `history-${Date.now()}`,
            date: "Today",
            status: formData.environment === "production" ? "Pushed" : "Preview",
            url: nextUrl.replace("https://", ""),
            environment: formData.environment,
          },
          ...current,
        ]);
      }
    }, 950);
  };

  const handleCopyUrl = async () => {
    if (!liveUrl) return;

    await navigator.clipboard.writeText(liveUrl);
    setCopied(true);

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden">
      <PageHeader
        badge="Publish Portfolio"
        title="Publish Portfolio Code"
        description="Prepare portfolio code, push it to the user's connected GitHub account, and then deploy it on any platform the user prefers."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="gap-2">
              <Eye className="h-3.5 w-3.5" />
              {statusLabel}
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              GitHub Push Flow
            </Badge>
          </div>
        }
      />

      <section className="grid w-full max-w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="bg-white/[0.045]">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Publish Mode</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {formData.environment === "production" ? "Main" : "Preview"}
              </p>
              <p className="mt-1 break-words text-sm text-slate-400">
                Switch between a final push target and a preview package flow.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-primary/20 bg-primary/10 p-4">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045]">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">GitHub Repo</p>
              <p className="mt-2 text-3xl font-semibold text-white">Ready</p>
              <p className="mt-1 break-all text-sm text-slate-400">
                {liveUrl || previewUrl.replace("https://", "")}
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <Globe className="h-5 w-5 text-cyan-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045]">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Pipeline Progress</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {progress}%
              </p>
              <p className="mt-1 break-words text-sm text-slate-400">
                Step-based code preparation across prepare, package, push, and handoff.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <Sparkles className="h-5 w-5 text-emerald-300" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid w-full max-w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <PortfolioPreview
          templateName={formData.templateName}
          portfolioName={formData.portfolioName}
          lastUpdated={formData.lastUpdated}
          previewUrl={previewUrl}
          />
        </div>

        <div className="min-w-0 space-y-6">
          <DeployCard
            formData={formData}
            githubConnectionError={githubConnectionError}
            onFieldChange={handleFieldChange}
            onEnvironmentChange={(environment) =>
              setFormData((current) => ({ ...current, environment }))
            }
            onConnectGithub={() => {
              const githubClientId = getGithubClientId();

              if (!githubClientId) {
                setGithubConnectionError(
                  "Add NEXT_PUBLIC_GITHUB_CLIENT_ID to enable real GitHub account connection. Pushing code stays locked until GitHub OAuth is configured."
                );
                return;
              }

              setGithubConnectionError(null);
              const redirectUri = encodeURIComponent(`${window.location.origin}/deploy`);
              const scope = encodeURIComponent("read:user user:email repo");
              window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}&state=vampforge-github-connect`;
            }}
            onDisconnectGithub={() =>
              {
                setGithubConnectionError(null);
                setFormData((current) => ({
                  ...current,
                  githubConnected: false,
                  githubUsername: "",
                }));
              }
            }
            onDeploy={handleDeploy}
            isDeploying={deploymentStatus === "deploying"}
          />
          <DeploymentStatus
            status={deploymentStatus}
            progress={progress}
            steps={deploymentSteps}
            activeStepIndex={activeStepIndex}
            liveUrl={liveUrl}
            copied={copied}
            onCopyUrl={handleCopyUrl}
            onRedeploy={handleDeploy}
          />
        </div>
      </section>

      <DeploymentHistory history={history} />
    </div>
  );
}
