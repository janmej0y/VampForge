"use client";

import { useEffect, useState } from "react";
import { BellRing, KeyRound, LockKeyhole, Palette, UserRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LIVE_INTERVIEW_GEMINI_KEY } from "@/lib/live-interview";

const SETTINGS_KEY = "vampforge-workspace-settings";

type WorkspaceSettings = {
  publicProfile: boolean;
  featuredSections: boolean;
  socialLinks: boolean;
  resumeAlerts: boolean;
  deployAlerts: boolean;
  weeklyDigest: boolean;
  sessionLock: boolean;
  connectionReview: boolean;
  twoStepPrompt: boolean;
  defaultTheme: "dark" | "light";
  accent: "teal" | "gold" | "slate";
  compactMode: boolean;
};

const defaultWorkspaceSettings: WorkspaceSettings = {
  publicProfile: true,
  featuredSections: true,
  socialLinks: true,
  resumeAlerts: true,
  deployAlerts: true,
  weeklyDigest: false,
  sessionLock: false,
  connectionReview: true,
  twoStepPrompt: false,
  defaultTheme: "dark",
  accent: "teal",
  compactMode: false,
};

function parseSettings(value: string | null): WorkspaceSettings {
  if (!value) return defaultWorkspaceSettings;

  try {
    return { ...defaultWorkspaceSettings, ...JSON.parse(value) };
  } catch {
    return defaultWorkspaceSettings;
  }
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition hover:bg-white/[0.07]">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white">{label}</div>
        <div className="mt-1 text-xs leading-5 text-muted-foreground">{description}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-teal-300"
      />
    </label>
  );
}

export default function SettingsPage() {
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [settings, setSettings] = useState<WorkspaceSettings>(defaultWorkspaceSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setGeminiApiKey(window.localStorage.getItem(LIVE_INTERVIEW_GEMINI_KEY) ?? "");
    setSettings(parseSettings(window.localStorage.getItem(SETTINGS_KEY)));
  }, []);

  const updateSettings = (next: Partial<WorkspaceSettings>) => {
    setSettings((current) => {
      const merged = { ...current, ...next };
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));

      if (next.defaultTheme) {
        window.localStorage.setItem("vampforge-theme", next.defaultTheme);
      }

      setSaved(true);
      window.setTimeout(() => setSaved(false), 1400);
      return merged;
    });
  };

  const saveGeminiKey = () => {
    if (geminiApiKey.trim()) {
      window.localStorage.setItem(LIVE_INTERVIEW_GEMINI_KEY, geminiApiKey.trim());
    } else {
      window.localStorage.removeItem(LIVE_INTERVIEW_GEMINI_KEY);
    }

    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden">
      <PageHeader
        badge="Settings"
        title="Workspace settings"
        description="Manage keys, visibility, alerts, security, and theme."
        action={
          <Badge variant={saved ? "success" : "secondary"}>
            {saved ? "Saved" : "Local settings"}
          </Badge>
        }
      />

      <Card className="bg-white/[0.045]">
        <CardHeader>
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <Badge variant={geminiApiKey.trim() ? "success" : "secondary"}>
              {geminiApiKey.trim() ? "Configured" : "Optional"}
            </Badge>
          </div>
          <CardTitle className="text-white">Gemini API Key</CardTitle>
          <CardDescription>Used for AI interview questions and feedback.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
            <KeyRound className="h-4 w-4 text-primary" />
            <Input
              type="password"
              value={geminiApiKey}
              onChange={(event) => setGeminiApiKey(event.target.value)}
              placeholder="Paste your Gemini API key"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 font-mono"
            />
          </label>
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="break-words text-sm leading-5 text-slate-400">
              Stored in this browser only. Firebase sync can be added after Auth is live.
            </p>
            <Button type="button" onClick={saveGeminiKey}>
              {saved ? "Saved" : "Save Key"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid w-full max-w-full grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="bg-white/[0.045]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12">
              <UserRound className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-white">Profile Preferences</CardTitle>
            <CardDescription>Control what appears publicly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingToggle
              label="Public profile"
              description="Show portfolio contact and profile content."
              checked={settings.publicProfile}
              onChange={(value) => updateSettings({ publicProfile: value })}
            />
            <SettingToggle
              label="Featured sections"
              description="Highlight projects, achievements, and skills."
              checked={settings.featuredSections}
              onChange={(value) => updateSettings({ featuredSections: value })}
            />
            <SettingToggle
              label="Social links"
              description="Show GitHub, LinkedIn, and website links."
              checked={settings.socialLinks}
              onChange={(value) => updateSettings({ socialLinks: value })}
            />
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12">
              <BellRing className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-white">Notifications</CardTitle>
            <CardDescription>Choose the alerts you want.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingToggle
              label="Resume alerts"
              description="Notify when resume score or ATS fit changes."
              checked={settings.resumeAlerts}
              onChange={(value) => updateSettings({ resumeAlerts: value })}
            />
            <SettingToggle
              label="Deploy alerts"
              description="Notify when portfolio packages are ready."
              checked={settings.deployAlerts}
              onChange={(value) => updateSettings({ deployAlerts: value })}
            />
            <SettingToggle
              label="Weekly digest"
              description="Summarize activity and next actions."
              checked={settings.weeklyDigest}
              onChange={(value) => updateSettings({ weeklyDigest: value })}
            />
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12">
              <LockKeyhole className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-white">Security</CardTitle>
            <CardDescription>Local security preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingToggle
              label="Session lock reminder"
              description="Ask for confirmation before sensitive actions."
              checked={settings.sessionLock}
              onChange={(value) => updateSettings({ sessionLock: value })}
            />
            <SettingToggle
              label="Connection review"
              description="Review GitHub and Firebase connection status."
              checked={settings.connectionReview}
              onChange={(value) => updateSettings({ connectionReview: value })}
            />
            <SettingToggle
              label="Two-step prompt"
              description="Reserve UI state for future Firebase MFA."
              checked={settings.twoStepPrompt}
              onChange={(value) => updateSettings({ twoStepPrompt: value })}
            />
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-white">Appearance</CardTitle>
            <CardDescription>Theme defaults and density.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {(["dark", "light"] as const).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => updateSettings({ defaultTheme: theme })}
                  className={`rounded-2xl border p-4 text-left text-sm font-semibold capitalize transition ${
                    settings.defaultTheme === theme
                      ? "border-primary/35 bg-primary/10 text-white"
                      : "border-white/10 bg-white/[0.045] text-slate-300"
                  }`}
                >
                  {theme} theme
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["teal", "gold", "slate"] as const).map((accent) => (
                <button
                  key={accent}
                  type="button"
                  onClick={() => updateSettings({ accent })}
                  className={`rounded-2xl border p-4 text-left text-sm font-semibold capitalize transition ${
                    settings.accent === accent
                      ? "border-primary/35 bg-primary/10 text-white"
                      : "border-white/10 bg-white/[0.045] text-slate-300"
                  }`}
                >
                  {accent}
                </button>
              ))}
            </div>
            <SettingToggle
              label="Compact mode"
              description="Save the preference for tighter layouts."
              checked={settings.compactMode}
              onChange={(value) => updateSettings({ compactMode: value })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
