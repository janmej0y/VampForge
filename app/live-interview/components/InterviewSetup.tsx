"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Clock3,
  KeyRound,
  Mic,
  PlayCircle,
  Radar,
  Radio,
  RotateCcw,
  Shield,
  Sparkles,
  UserRound,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  type InterviewDifficulty,
  type InterviewHistoryEntry,
  type InterviewRole,
  type InterviewSetupState,
  type InterviewType,
} from "./types";

type InterviewSetupProps = {
  setup: InterviewSetupState;
  onChange: (next: Partial<InterviewSetupState>) => void;
  geminiApiKey: string;
  onGeminiApiKeyChange: (value: string) => void;
  onStart: () => void;
  onResume: () => void;
  onRequestPermissions: () => void;
  hasResumeSession: boolean;
  history: InterviewHistoryEntry[];
  startError?: string | null;
  permissionStatus: "idle" | "granted" | "denied";
  permissionError?: string | null;
  isRequestingPermissions: boolean;
};

const roleOptions: Array<{ value: InterviewRole; label: string; icon: typeof Sparkles }> = [
  { value: "frontend", label: "Frontend Developer", icon: Sparkles },
  { value: "backend", label: "Backend Developer", icon: Radar },
  { value: "fullstack", label: "Full Stack Developer", icon: BrainCircuit },
];

const difficultyOptions: Array<{ value: InterviewDifficulty; label: string }> = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const interviewTypeOptions: Array<{ value: InterviewType; label: string; icon: typeof UserRound }> = [
  { value: "technical", label: "Technical", icon: BrainCircuit },
  { value: "hr", label: "HR", icon: UserRound },
  { value: "mixed", label: "Mixed", icon: Shield },
];

const durationOptions: Array<InterviewSetupState["duration"]> = [10, 20, 30];

function formatRelativeDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function InterviewSetup({
  setup,
  onChange,
  geminiApiKey,
  onGeminiApiKeyChange,
  onStart,
  onResume,
  onRequestPermissions,
  hasResumeSession,
  history,
  startError,
  permissionStatus,
  permissionError,
  isRequestingPermissions,
}: InterviewSetupProps) {
  const latestHistory = history[0];
  const hasGeminiApiKey = geminiApiKey.trim().length > 0;
  const hasMediaPermissions = permissionStatus === "granted";

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
              <Radar className="h-3.5 w-3.5" />
              Real-time interview simulation
            </Badge>
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                Premium mock interviews that feel like the real round
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                Configure role, difficulty, interview format, and duration, then step
                into a timed interview with structured questions, live scoring, AI-style
                evaluation, and a final performance dashboard.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {hasResumeSession ? (
              <Button variant="secondary" onClick={onResume} disabled={!hasMediaPermissions}>
                <RotateCcw className="h-4 w-4" />
                Resume Interview
              </Button>
            ) : null}
            <Button onClick={onStart} disabled={!hasGeminiApiKey || !hasMediaPermissions}>
              <PlayCircle className="h-4 w-4" />
              {hasGeminiApiKey && hasMediaPermissions ? "Start Interview" : "Complete Setup"}
            </Button>
          </div>
        </div>
      </motion.section>

      <section className="grid w-full max-w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bg-white/[0.045]">
          <CardHeader>
            <CardTitle className="text-white">Pre-Interview Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="section-label">Gemini API Key</div>
              <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/35 p-4">
                <label className="flex items-center gap-3">
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
                {startError ? (
                  <p className="mt-3 text-sm text-amber-200">{startError}</p>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">
                    Interview evaluation uses this key for Gemini scoring requests.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="section-label">Camera and Microphone</div>
              <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/35 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <Video className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm font-semibold text-white">Camera locked on</div>
                      <div className="mt-1 text-sm leading-6 text-slate-400">
                        Required for the live video interview room.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <Mic className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <div className="text-sm font-semibold text-white">Microphone always on</div>
                      <div className="mt-1 text-sm leading-6 text-slate-400">
                        Answers are accepted by voice only.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Radio className="h-4 w-4 text-primary" />
                    {permissionStatus === "granted"
                      ? "Camera and microphone are ready."
                      : permissionStatus === "denied"
                        ? "Permission was denied. Enable access to continue."
                        : "Grant camera and microphone access to unlock the interview."}
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
                  <p className="mt-3 text-sm text-amber-200">{permissionError}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-3">
              <div className="section-label">Select Role</div>
              <div className="grid gap-3 md:grid-cols-3">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const active = setup.role === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onChange({ role: option.value })}
                      className={`rounded-[1.5rem] border p-4 text-left transition ${
                        active
                          ? "border-primary/30 bg-primary/10 shadow-[0_18px_40px_rgba(34,211,238,0.12)]"
                          : "border-white/10 bg-slate-950/35 hover:border-white/15 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-slate-300"}`} />
                      </div>
                      <div className="mt-4 text-sm font-semibold text-white">{option.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="section-label">Select Difficulty</div>
                <div className="grid gap-3">
                  {difficultyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onChange({ difficulty: option.value })}
                      className={`rounded-[1.4rem] border px-4 py-4 text-left text-sm font-medium transition ${
                        setup.difficulty === option.value
                          ? "border-primary/30 bg-primary/10 text-white"
                          : "border-white/10 bg-slate-950/35 text-slate-300 hover:border-white/15 hover:bg-white/[0.05]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="section-label">Interview Type</div>
                <div className="grid gap-3">
                  {interviewTypeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange({ interviewType: option.value })}
                        className={`flex items-center gap-3 rounded-[1.4rem] border px-4 py-4 text-left text-sm font-medium transition ${
                          setup.interviewType === option.value
                            ? "border-primary/30 bg-primary/10 text-white"
                            : "border-white/10 bg-slate-950/35 text-slate-300 hover:border-white/15 hover:bg-white/[0.05]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="section-label">Duration</div>
              <div className="grid gap-3 sm:grid-cols-3">
                {durationOptions.map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => onChange({ duration })}
                    className={`rounded-[1.4rem] border px-4 py-4 text-left transition ${
                      setup.duration === duration
                        ? "border-primary/30 bg-primary/10 text-white"
                        : "border-white/10 bg-slate-950/35 text-slate-300 hover:border-white/15 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Clock3 className="h-4 w-4" />
                      {duration} min
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-[1.4rem] border border-white/10 bg-slate-950/35 p-4">
                <input
                  type="checkbox"
                  checked={setup.strictMode}
                  onChange={(event) => onChange({ strictMode: event.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-950 text-primary focus:ring-primary/40"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Strict mode</div>
                  <div className="mt-1 text-sm leading-6 text-slate-400">
                    Disable skipping and keep the interview flow realistic.
                  </div>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-[1.4rem] border border-white/10 bg-slate-950/35 p-4">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-950 text-primary focus:ring-primary/40"
                />
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Mic className="h-4 w-4 text-primary" />
                    Voice-only mode
                  </div>
                  <div className="mt-1 text-sm leading-6 text-slate-400">
                    Text answers are disabled for this simulator.
                  </div>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white/[0.045]">
            <CardHeader>
              <CardTitle className="text-white">Session Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-300">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                Timed responses, live score tracking, follow-up depth checks, and post-interview improvements are built into every run.
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                Structured questions come from a curated bank aligned to role, difficulty, and interview type, so the flow feels intentional rather than random.
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                Your interview progress is saved locally, which means you can leave and resume unfinished sessions later.
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.045]">
            <CardHeader>
              <CardTitle className="text-white">Recent Attempts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {latestHistory ? (
                history.slice(0, 4).map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-[1.4rem] border border-white/10 bg-slate-950/35 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {entry.role} • {entry.interviewType}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {formatRelativeDate(entry.completedAt)}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        {entry.overallScore}/10
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/35 p-4 text-sm text-slate-400">
                  No saved interview attempts yet. Start your first live mock interview to build a history.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
