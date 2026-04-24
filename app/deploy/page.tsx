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
    label: "Preparing Build...",
    description: "Collecting portfolio metadata, environment variables, and deployment configuration.",
  },
  {
    id: "build",
    label: "Building Portfolio...",
    description: "Compiling pages, generating static assets, and validating the production bundle.",
  },
  {
    id: "upload",
    label: "Uploading to Server...",
    description: "Publishing build artifacts to the VampForge hosting edge.",
  },
  {
    id: "success",
    label: "Deployment Successful",
    description: "The site is live and ready to be shared with recruiters, collaborators, and hiring teams.",
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
    status: "Success",
    url: "janmejoy.vampforge.app",
    environment: "production",
  },
  {
    id: "history-2",
    date: "Yesterday",
    status: "Preview",
    url: "preview-janmejoy.vampforge.app",
    environment: "preview",
  },
  {
    id: "history-3",
    date: "Apr 07, 2026",
    status: "Success",
    url: "janmejoy-portfolio.vampforge.app",
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
    return `https://${formData.subdomain || "preview"}.${
      formData.environment === "production" ? "vampforge.app" : "preview.vampforge.app"
    }`;
  }, [formData.environment, formData.subdomain]);

  const statusLabel = useMemo(() => {
    if (deploymentStatus === "success") return "Live";
    if (deploymentStatus === "deploying") return "Deploying";
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

    const nextUrl =
      formData.environment === "production"
        ? `https://${formData.subdomain}.vampforge.app`
        : `https://preview-${formData.subdomain}.vampforge.app`;

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
            status: formData.environment === "production" ? "Success" : "Preview",
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
        badge="Deploy Portfolio"
        title="Deploy Portfolio"
        description="Deploy Your Portfolio Instantly with a frontend-only Vercel-style release flow, live status updates, and a polished deployment dashboard."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="gap-2">
              <Eye className="h-3.5 w-3.5" />
              {statusLabel}
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Mock Hosting Flow
            </Badge>
          </div>
        }
      />

      <section className="grid w-full max-w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="bg-white/[0.045]">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Environment</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {formData.environment === "production" ? "Prod" : "Preview"}
              </p>
              <p className="mt-1 break-words text-sm text-slate-400">
                Switch between public release and preview deploys.
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
              <p className="text-sm text-muted-foreground">Generated URL</p>
              <p className="mt-2 text-3xl font-semibold text-white">Live</p>
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
                Step-based build simulation across prepare, build, upload, and release.
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
            onFieldChange={handleFieldChange}
            onEnvironmentChange={(environment) =>
              setFormData((current) => ({ ...current, environment }))
            }
            onConnectGithub={() =>
              {
                const githubClientId = getGithubClientId();

                if (githubClientId) {
                  const redirectUri = encodeURIComponent(`${window.location.origin}/deploy`);
                  const scope = encodeURIComponent("read:user user:email repo");
                  window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}&state=vampforge-github-connect`;
                  return;
                }

                setFormData((current) => ({
                  ...current,
                  githubConnected: true,
                  githubUsername: current.githubUsername || "connected-developer",
                }));
              }
            }
            onDisconnectGithub={() =>
              setFormData((current) => ({
                ...current,
                githubConnected: false,
                githubUsername: "",
              }))
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
