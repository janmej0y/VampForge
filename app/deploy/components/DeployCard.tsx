"use client";

import { ArrowUpRight, Code2, GitBranch, Globe, Rocket, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  type DeploymentEnvironment,
  type DeploymentFormData,
} from "./types";

type DeployCardProps = {
  formData: DeploymentFormData;
  onFieldChange: (
    field: "portfolioName" | "subdomain" | "customDomain" | "githubRepoName",
    value: string
  ) => void;
  onEnvironmentChange: (environment: DeploymentEnvironment) => void;
  onConnectGithub: () => void;
  onDisconnectGithub: () => void;
  onDeploy: () => void;
  isDeploying: boolean;
};

const environments: Array<{
  id: DeploymentEnvironment;
  label: string;
  description: string;
}> = [
  {
    id: "production",
    label: "Production",
    description: "Deploy to your primary public portfolio URL.",
  },
  {
    id: "preview",
    label: "Preview",
    description: "Create a safe preview deployment before going live.",
  },
];

export function DeployCard({
  formData,
  onFieldChange,
  onEnvironmentChange,
  onConnectGithub,
  onDisconnectGithub,
  onDeploy,
  isDeploying,
}: DeployCardProps) {
  const subdomainSuffix = ".vampforge.app";

  return (
    <Card className="bg-white/[0.045]">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white">Deployment Settings Card</CardTitle>
        <CardDescription>
          Configure your deployment target, portfolio name, and simulated hosting options.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        <section className="space-y-4">
          <div>
            <div className="text-sm font-medium text-slate-200">GitHub Connection</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Connect GitHub before deploying so VampForge can create or update your portfolio repository.
            </p>
          </div>

          <div
            className={cn(
              "rounded-[1.6rem] border p-4",
              formData.githubConnected
                ? "border-emerald-300/35 bg-emerald-50/80"
                : "border-sky-200 bg-white/80"
            )}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                    formData.githubConnected
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-sky-100 text-sky-700"
                  )}
                >
                  {formData.githubConnected ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <GitBranch className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-950">
                    {formData.githubConnected ? "GitHub connected" : "Connect your GitHub profile"}
                  </div>
                  <div className="mt-1 break-words text-xs leading-5 text-slate-600">
                    {formData.githubConnected
                      ? `Connected as ${formData.githubUsername}. You can deploy when the repo name is ready.`
                      : "A real app should complete GitHub OAuth, store the token securely, and request repository permissions."}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant={formData.githubConnected ? "secondary" : "default"}
                onClick={formData.githubConnected ? onDisconnectGithub : onConnectGithub}
              >
                <GitBranch className="h-4 w-4" />
                {formData.githubConnected ? "Disconnect" : "Connect GitHub"}
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <div className="text-sm font-medium text-slate-200">Deployment Environment</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose whether you want a public release or a temporary preview.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {environments.map((environment) => {
              const active = formData.environment === environment.id;

              return (
                <button
                  key={environment.id}
                  type="button"
                  onClick={() => onEnvironmentChange(environment.id)}
                  className={cn(
                    "rounded-[1.6rem] border p-4 text-left transition duration-300",
                    active
                      ? "border-primary/35 bg-primary/10 shadow-[0_20px_50px_rgba(76,92,255,0.16)]"
                      : "border-white/10 bg-white/5 hover:border-white/15 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {environment.label}
                      </div>
                      <div className="mt-2 text-sm leading-6 text-muted-foreground">
                        {environment.description}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-2xl border",
                        active
                          ? "border-primary/20 bg-primary text-primary-foreground"
                          : "border-white/10 bg-white/5 text-muted-foreground"
                      )}
                    >
                      <Rocket className="h-4.5 w-4.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <div className="text-sm font-medium text-slate-200">Deployment Settings</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Set the portfolio identity and destination URL for this frontend-only deploy flow.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Portfolio Name
              </label>
              <Input
                value={formData.portfolioName}
                placeholder="Janmejoy Portfolio"
                onChange={(event) =>
                  onFieldChange("portfolioName", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Subdomain
              </label>
              <div className="flex items-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <input
                  value={formData.subdomain}
                  onChange={(event) =>
                    onFieldChange("subdomain", event.target.value)
                  }
                  className="h-11 w-full bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="janmejoy"
                />
                <div className="border-l border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-muted-foreground">
                  {subdomainSuffix}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Custom Domain
                </label>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    value={formData.customDomain}
                    placeholder="portfolio.janmejoy.dev"
                    onChange={(event) =>
                      onFieldChange("customDomain", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  GitHub Repo Name
                </label>
                <div className="relative">
                  <Code2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    value={formData.githubRepoName}
                    placeholder="vampforge-portfolio"
                    onChange={(event) =>
                      onFieldChange("githubRepoName", event.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={onDeploy}
          disabled={isDeploying || !formData.subdomain.trim() || !formData.githubConnected}
        >
          {isDeploying ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              Deploying...
            </>
          ) : (
            <>
              <ArrowUpRight className="h-4 w-4" />
              {formData.githubConnected ? "Deploy Portfolio" : "Connect GitHub to Deploy"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
