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

const settingsCards = [
  {
    title: "Profile Preferences",
    description:
      "Control public profile visibility, featured sections, and social links.",
    icon: UserRound,
  },
  {
    title: "Notifications",
    description:
      "Manage resume alerts, deployment notices, and activity digests.",
    icon: BellRing,
  },
  {
    title: "Security",
    description:
      "Review account access, connection tokens, and linked providers.",
    icon: LockKeyhole,
  },
  {
    title: "Appearance",
    description:
      "Dark modern UI is enabled by default with customizable accents.",
    icon: Palette,
  },
];

export default function SettingsPage() {
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setGeminiApiKey(window.localStorage.getItem(LIVE_INTERVIEW_GEMINI_KEY) ?? "");
  }, []);

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
        title="Customize your VampForge workspace"
        description="Store local preferences for interview mode, workspace security, and appearance."
      />

      <Card className="bg-white/[0.045]">
        <CardHeader>
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <Badge variant={geminiApiKey.trim() ? "success" : "secondary"}>
              {geminiApiKey.trim() ? "Configured" : "Required"}
            </Badge>
          </div>
          <CardTitle className="text-white">Gemini API Key</CardTitle>
          <CardDescription>
            Used for Real Company Interview Mode question generation and evaluation.
          </CardDescription>
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
            <p className="break-words text-sm leading-6 text-slate-400">
              Stored in this browser only. VampForge never hardcodes or logs this key.
            </p>
            <Button type="button" onClick={saveGeminiKey}>
              {saved ? "Saved" : "Save Key"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid w-full max-w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {settingsCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="bg-white/[0.045]">
              <CardHeader>
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary">Coming soon</Badge>
                </div>
                <CardTitle className="text-white">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                  This section is styled and ready for backend integration whenever
                  you want to wire real preferences.
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
