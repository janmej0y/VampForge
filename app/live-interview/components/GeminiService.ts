"use client";

import {
  LIVE_INTERVIEW_GEMINI_KEY,
} from "@/lib/live-interview";
import {
  type InterviewEvaluation,
  type InterviewQuestionInstance,
  type InterviewSetupState,
  type SpeechMetrics,
} from "./types";

export function getStoredGeminiApiKey() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(LIVE_INTERVIEW_GEMINI_KEY) ?? "";
}

export function storeGeminiApiKey(apiKey: string) {
  if (typeof window === "undefined") return;

  if (apiKey.trim()) {
    window.localStorage.setItem(LIVE_INTERVIEW_GEMINI_KEY, apiKey.trim());
    return;
  }

  window.localStorage.removeItem(LIVE_INTERVIEW_GEMINI_KEY);
}

export type GenerateCompanyQuestionInput = {
  setup: InterviewSetupState;
  geminiApiKey: string;
  questionNumber: number;
  totalQuestions: number;
  conversationHistory: Array<{
    question: string;
    answer?: string;
    score?: number;
  }>;
};

export async function generateCompanyQuestion(input: GenerateCompanyQuestionInput) {
  const response = await fetch("/api/interview/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => null)) as {
    question?: InterviewQuestionInstance;
    error?: string;
  } | null;

  if (!response.ok || !payload?.question) {
    throw new Error(payload?.error ?? "Gemini could not generate the next question.");
  }

  return payload.question;
}

export async function evaluateCompanyAnswer(input: {
  question: InterviewQuestionInstance;
  answer: string;
  geminiApiKey: string;
  setup: InterviewSetupState;
  speechMetrics?: SpeechMetrics;
}) {
  const response = await fetch("/api/interview/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => null)) as {
    evaluation?: InterviewEvaluation;
    error?: string;
  } | null;

  if (!response.ok || !payload?.evaluation) {
    throw new Error(payload?.error ?? "Gemini could not evaluate this answer.");
  }

  return payload.evaluation;
}
