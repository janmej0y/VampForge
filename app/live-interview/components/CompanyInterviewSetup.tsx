"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
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
  const missingItems = hasMediaPermissions ? [] : ["Camera and microphone access"];

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
                Choose your interview style
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
                Add Gemini for AI follow-ups, or start with local questions based on your setup.
              </p>
            </div>
          </div>
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
                      <p className="mt-2 text-sm leading-5 text-slate-400">
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
                  placeholder="Optional Gemini API key"
                  autoComplete="off"
                  spellCheck={false}
                  className="font-mono"
                />
              </label>
              <p className="mt-3 text-sm leading-5 text-slate-400">
                Optional. Without it, VampForge uses local questions and rule-based scoring.
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

      <section className="section-card mesh-card premium-ring border-primary/15 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="section-label">Final Step</div>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
              Generate Interview Room
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Start after selecting the company, role, difficulty, duration, and device access.
            </p>
          </div>

          <div className="action-bar lg:w-auto">
            <div
              className={`w-full rounded-2xl border p-4 ${
                hasMediaPermissions
                  ? "border-emerald-300/20 bg-emerald-300/10"
                  : "border-amber-300/20 bg-amber-300/10"
              }`}
            >
              <div className="flex items-start gap-3">
                {hasMediaPermissions ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
                )}
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">
                    {hasMediaPermissions
                      ? "Interview setup is ready to generate."
                      : "Complete these fields first"}
                  </div>
                  {!hasMediaPermissions ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {missingItems.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1 text-xs text-amber-100"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <Button
              onClick={onStart}
              disabled={!hasMediaPermissions || isGeneratingQuestion}
            >
              <PlayCircle className="h-4 w-4" />
              {isGeneratingQuestion
                ? "Generating Interview..."
                : hasGeminiApiKey && hasMediaPermissions
                  ? "Generate Company Interview"
                  : hasMediaPermissions
                    ? "Generate Basic Interview"
                    : "Allow Devices First"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
