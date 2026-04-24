"use client";

import { motion } from "framer-motion";
import {
  Building2,
  KeyRound,
  Mic,
  PlayCircle,
  Radio,
  Shield,
  Sparkles,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  COMPANY_INTERVIEW_TYPE_LABELS,
  COMPANY_LABELS,
  COMPANY_STYLE_GUIDE,
} from "@/lib/live-interview";
import {
  type CompanyInterviewCompany,
  type CompanyInterviewType,
  type InterviewDifficulty,
  type InterviewRole,
  type InterviewSetupState,
} from "./types";

type CompanyInterviewSetupProps = {
  setup: InterviewSetupState;
  onChange: (next: Partial<InterviewSetupState>) => void;
  geminiApiKey: string;
  onGeminiApiKeyChange: (value: string) => void;
  onStart: () => void;
  onRequestPermissions: () => void;
  startError?: string | null;
  permissionStatus: "idle" | "granted" | "denied";
  permissionError?: string | null;
  isRequestingPermissions: boolean;
  isGeneratingQuestion: boolean;
};

const companies: CompanyInterviewCompany[] = [
  "google",
  "amazon",
  "microsoft",
  "startup",
];
const roles: InterviewRole[] = ["frontend", "backend", "fullstack"];
const difficulties: InterviewDifficulty[] = ["easy", "medium", "hard"];
const interviewTypes: CompanyInterviewType[] = [
  "dsa",
  "system-design",
  "behavioral",
  "mixed",
];
const durations: Array<InterviewSetupState["duration"]> = [10, 20, 30];

function formatRole(role: InterviewRole) {
  return role === "fullstack" ? "Full Stack" : role[0].toUpperCase() + role.slice(1);
}

export function CompanyInterviewSetup({
  setup,
  onChange,
  geminiApiKey,
  onGeminiApiKeyChange,
  onStart,
  onRequestPermissions,
  startError,
  permissionStatus,
  permissionError,
  isRequestingPermissions,
  isGeneratingQuestion,
}: CompanyInterviewSetupProps) {
  const hasGeminiApiKey = geminiApiKey.trim().length > 0;
  const hasMediaPermissions = permissionStatus === "granted";
  const selectedCompany = setup.company ?? "google";

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="section-card mesh-card premium-ring overflow-hidden border-primary/15 p-6 sm:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <Badge variant="secondary" className="w-fit gap-2 border-primary/20 bg-primary/10 text-primary">
              <Building2 className="h-3.5 w-3.5" />
              Real Company Interview Mode
            </Badge>
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                Practice like the company is really on the call
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                Gemini generates one company-style question at a time, listens to your
                spoken answer, digs deeper with follow-ups, and scores like a real interviewer.
              </p>
            </div>
          </div>

          <Button
            onClick={onStart}
            disabled={!hasGeminiApiKey || !hasMediaPermissions || isGeneratingQuestion}
          >
            <PlayCircle className="h-4 w-4" />
            {isGeneratingQuestion
              ? "Preparing Interview"
              : hasGeminiApiKey && hasMediaPermissions
                ? "Start Company Interview"
                : "Complete Setup"}
          </Button>
        </div>
      </motion.section>

      <section className="grid w-full max-w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bg-white/[0.045]">
          <CardHeader>
            <CardTitle className="text-white">Company Interview Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="section-label">Company</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {companies.map((company) => {
                  const active = selectedCompany === company;

                  return (
                    <button
                      key={company}
                      type="button"
                      onClick={() => onChange({ company })}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-primary/30 bg-primary/10 text-white"
                          : "border-white/10 bg-slate-950/35 text-slate-300 hover:border-white/15 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {COMPANY_LABELS[company]}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {COMPANY_STYLE_GUIDE[company]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <div className="section-label">Role</div>
                <div className="grid gap-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => onChange({ role })}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium ${
                        setup.role === role
                          ? "border-primary/30 bg-primary/10 text-white"
                          : "border-white/10 bg-slate-950/35 text-slate-300"
                      }`}
                    >
                      {formatRole(role)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="section-label">Difficulty</div>
                <div className="grid gap-2">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      type="button"
                      onClick={() => onChange({ difficulty })}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium ${
                        setup.difficulty === difficulty
                          ? "border-primary/30 bg-primary/10 text-white"
                          : "border-white/10 bg-slate-950/35 text-slate-300"
                      }`}
                    >
                      {difficulty[0].toUpperCase() + difficulty.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="section-label">Duration</div>
                <div className="grid gap-2">
                  {durations.map((duration) => (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => onChange({ duration })}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium ${
                        setup.duration === duration
                          ? "border-primary/30 bg-primary/10 text-white"
                          : "border-white/10 bg-slate-950/35 text-slate-300"
                      }`}
                    >
                      {duration} min
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="section-label">Interview Type</div>
              <div className="grid gap-3 sm:grid-cols-4">
                {interviewTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onChange({ companyInterviewType: type })}
                    className={`rounded-xl border px-4 py-4 text-left text-sm font-semibold ${
                      (setup.companyInterviewType ?? "mixed") === type
                        ? "border-primary/30 bg-primary/10 text-white"
                        : "border-white/10 bg-slate-950/35 text-slate-300"
                    }`}
                  >
                    {COMPANY_INTERVIEW_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white/[0.045]">
            <CardHeader>
              <CardTitle className="text-white">Gemini Key</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                <KeyRound className="h-4 w-4 text-primary" />
                <Input
                  type="password"
                  value={geminiApiKey}
                  onChange={(event) => onGeminiApiKeyChange(event.target.value)}
                  placeholder="Paste your Gemini API key"
                  autoComplete="off"
                  spellCheck={false}
                  className="font-mono"
                />
              </label>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Stored locally in your browser and only sent to Gemini interview routes.
              </p>
              {startError ? <p className="mt-3 text-sm text-amber-200">{startError}</p> : null}
            </CardContent>
          </Card>

          <Card className="bg-white/[0.045]">
            <CardHeader>
              <CardTitle className="text-white">Device Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <Video className="h-4 w-4 text-primary" />
                  <div className="mt-2 text-sm font-semibold text-white">Camera required</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <Mic className="h-4 w-4 text-primary" />
                  <div className="mt-2 text-sm font-semibold text-white">Microphone required</div>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Radio className="h-4 w-4 text-primary" />
                  {permissionStatus === "granted"
                    ? "Camera and microphone are ready."
                    : permissionStatus === "denied"
                      ? "Permission was denied. Enable access to continue."
                      : "Grant device access to unlock the room."}
                </div>
                <Button
                  type="button"
                  variant={hasMediaPermissions ? "secondary" : "default"}
                  onClick={onRequestPermissions}
                  disabled={isRequestingPermissions}
                >
                  <Shield className="h-4 w-4" />
                  {hasMediaPermissions
                    ? "Recheck Devices"
                    : isRequestingPermissions
                      ? "Requesting"
                      : "Allow Devices"}
                </Button>
              </div>
              {permissionError ? (
                <p className="text-sm text-amber-200">{permissionError}</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
