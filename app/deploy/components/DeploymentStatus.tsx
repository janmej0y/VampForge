import {
  CheckCircle2,
  Copy,
  ExternalLink,
  LoaderCircle,
  Rocket,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type DeploymentStatusType,
  type DeploymentStep,
} from "./types";

type DeploymentStatusProps = {
  status: DeploymentStatusType;
  progress: number;
  steps: DeploymentStep[];
  activeStepIndex: number;
  liveUrl: string;
  copied: boolean;
  onCopyUrl: () => void;
  onRedeploy: () => void;
};

export function DeploymentStatus({
  status,
  progress,
  steps,
  activeStepIndex,
  liveUrl,
  copied,
  onCopyUrl,
  onRedeploy,
}: DeploymentStatusProps) {
  return (
    <Card className="bg-white/[0.045]">
      <CardHeader className="border-b border-white/10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-white">GitHub Publish Status</CardTitle>
            <CardDescription>
              Follow the GitHub push pipeline with a stepper, progress bar, and final handoff.
            </CardDescription>
          </div>
          <Badge variant={status === "success" ? "success" : "secondary"}>
            {status === "idle"
              ? "Ready"
              : status === "deploying"
                ? "Publishing"
                : "Pushed"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Current Status</div>
              <div className="mt-2 text-xl font-semibold text-white">
                {status === "idle"
                  ? "Waiting for GitHub push"
                  : status === "deploying"
                    ? steps[Math.min(activeStepIndex, steps.length - 1)]?.label
                    : "Code pushed to GitHub"}
              </div>
              <div className="mt-1 text-sm text-slate-400">
                {status === "deploying"
                  ? "Preparing the portfolio files, packaging the repo, and simulating a GitHub push."
                  : status === "success"
                    ? "Your portfolio code is ready in GitHub. The user can deploy it on any platform they want."
                    : "Connect GitHub and push when your settings look right."}
              </div>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
              {status === "deploying" ? (
                <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
              ) : status === "success" ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-300" />
              ) : (
                <Rocket className="h-6 w-6 text-primary" />
              )}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span>Publish progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const completed = status === "success" || index < activeStepIndex;
            const active = status === "deploying" && index === activeStepIndex;

            return (
              <div
                key={step.id}
                className="flex items-start gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/35 px-4 py-4 transition hover:bg-white/5"
              >
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                    completed
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : active
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-white/10 bg-white/5 text-muted-foreground"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  ) : active ? (
                    <LoaderCircle className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">
                    {step.label}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {status === "success" ? (
          <div className="rounded-[1.7rem] border border-emerald-400/20 bg-emerald-400/10 p-5 shadow-[0_22px_70px_rgba(16,185,129,0.10)]">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-slate-950/20">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-semibold text-white">
                  Portfolio Code Pushed
                </div>
                <div className="mt-1 text-sm text-emerald-100/90">
                  GitHub Repository
                </div>
                <div className="mt-2 break-all text-sm font-medium text-white">
                  {liveUrl}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" asChild>
                    <a href={liveUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Open Repo
                    </a>
                  </Button>
                  <Button variant="outline" onClick={onCopyUrl}>
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied Repo URL" : "Copy Repo URL"}
                  </Button>
                  <Button variant="outline" onClick={onRedeploy}>
                    <RotateCcw className="h-4 w-4" />
                    Push Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
