"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, Globe, Rocket, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getGithubClientId } from "@/lib/firebase-client";
import { createPortfolioCodeBundle } from "@/app/portfolio/components/document";
import { readStoredPortfolioData } from "@/app/portfolio/components/storage";
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

type GithubPushResponse = {
  url?: string;
  owner?: string;
  repo?: string;
  error?: string;
};

type GithubMeResponse = {
  connected: boolean;
  username?: string;
};

function sleep(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

const deploymentSteps: DeploymentStep[] = [
  {
    id: "prepare",
    label: "Preparing Portfolio Files...",
    description: "Checking portfolio files.",
  },
  {
    id: "build",
    label: "Packaging Source...",
    description: "Creating source package.",
  },
  {
    id: "upload",
    label: "Pushing to GitHub...",
    description: "Preparing GitHub handoff.",
  },
  {
    id: "success",
    label: "GitHub Push Complete",
    description: "Code package is ready.",
  },
];

const initialFormData: DeploymentFormData = {
  templateName: "Modern Template",
  portfolioName: "Janmejoy Portfolio",
  lastUpdated: "Today, 9:42 PM",
  subdomain: "janmejoy",
  customDomain: "janmejoy.is-a.dev",
  githubRepoName: "janmejoy-portfolio",
  githubConnected: false,
  githubUsername: "",
  environment: "production",
};

const initialHistory: DeploymentHistoryItem[] = [
  {
    id: "history-1",
    date: "Today",
    status: "Pushed",
    url: "github.com/janmej0y/My-Portfolio",
    environment: "production",
  },
  {
    id: "history-2",
    date: "Yesterday",
    status: "Preview",
    url: "github.com/janmej0y/RentHub",
    environment: "preview",
  },
  {
    id: "history-3",
    date: "Apr 07, 2026",
    status: "Pushed",
    url: "github.com/janmej0y/Online-Voting-System",
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

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const syncGithubConnection = async () => {
      try {
        const response = await fetch("/api/github/me", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as GithubMeResponse;

        if (data.connected && data.username) {
          const username = data.username;
          setFormData((current) => ({
            ...current,
            githubConnected: true,
            githubUsername: username,
          }));
          setGithubConnectionError(null);
        }
      } catch {
        setGithubConnectionError("Could not verify GitHub connection.");
      }
    };

    const params = new URLSearchParams(window.location.search);
    const githubStatus = params.get("github");

    if (githubStatus === "connected") {
      setGithubConnectionError(null);
      window.history.replaceState(null, "", "/deploy");
    } else if (githubStatus && githubStatus !== "connected") {
      setGithubConnectionError(
        githubStatus === "missing-env"
          ? "Add GitHub environment variables in Vercel before connecting."
          : `GitHub connection failed: ${githubStatus}.`
      );
      window.history.replaceState(null, "", "/deploy");
    }

    void syncGithubConnection();

    return () => {
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

  const handleDeploy = async () => {
    if (!formData.githubConnected) {
      return;
    }

    setDeploymentStatus("deploying");
    setProgress(0);
    setActiveStepIndex(0);
    setCopied(false);
    setLiveUrl("");
    setGithubConnectionError(null);

    try {
      setProgress(18);
      setActiveStepIndex(0);
      await sleep(450);
      setProgress(42);
      setActiveStepIndex(1);

      const storedPortfolioData = readStoredPortfolioData();
      const files = storedPortfolioData
        ? createPortfolioCodeBundle(storedPortfolioData)
        : [];

      if (!files.length) {
        throw new Error("Build your portfolio once before pushing the full code to GitHub.");
      }

      const response = await fetch("/api/github/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioName: formData.portfolioName,
          repoName: formData.githubRepoName || formData.subdomain,
          customDomain: formData.customDomain,
          environment: formData.environment,
          files,
        }),
      });

      const result = (await response.json()) as GithubPushResponse;

      if (!response.ok || !result.url) {
        throw new Error(result.error || "GitHub push failed.");
      }

      const pushedUrl = result.url;
      setProgress(73);
      setActiveStepIndex(2);
      await sleep(450);

      setDeploymentStatus("success");
      setProgress(100);
      setActiveStepIndex(deploymentSteps.length - 1);
      setLiveUrl(pushedUrl);
      setFormData((current) => ({
        ...current,
        githubUsername: result.owner || current.githubUsername,
        lastUpdated: "Just now",
      }));
      setHistory((current) => [
        {
          id: `history-${Date.now()}`,
          date: "Today",
          status: formData.environment === "production" ? "Pushed" : "Preview",
          url: pushedUrl.replace("https://", ""),
          environment: formData.environment,
        },
        ...current,
      ]);
    } catch (error) {
      setDeploymentStatus("idle");
      setProgress(0);
      setActiveStepIndex(0);
      setGithubConnectionError(
        error instanceof Error ? error.message : "GitHub push failed."
      );
    }
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
        title="Publish portfolio code"
        description="Package your portfolio for GitHub and hosting."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="gap-2">
              <Eye className="h-3.5 w-3.5" />
              {statusLabel}
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
                GitHub Flow
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
                Main or preview.
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
                Prepare, package, handoff.
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
                  "Add NEXT_PUBLIC_GITHUB_CLIENT_ID in Vercel to enable GitHub OAuth."
                );
                return;
              }

              setGithubConnectionError(null);
              const redirectUri = encodeURIComponent(`${window.location.origin}/api/github/callback`);
              const scope = encodeURIComponent("read:user user:email repo");
              window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}&state=vampforge-github-connect`;
            }}
            onDisconnectGithub={async () => {
              await fetch("/api/github/disconnect", { method: "POST" });
              setGithubConnectionError(null);
              setFormData((current) => ({
                ...current,
                githubConnected: false,
                githubUsername: "",
              }));
            }}
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
