import { NextResponse } from "next/server";
import { getPerformanceLevel } from "@/lib/live-interview";
import {
  COMPANY_INTERVIEW_TYPE_LABELS,
  COMPANY_LABELS,
  COMPANY_STYLE_GUIDE,
} from "@/lib/live-interview";
import {
  type InterviewEvaluation,
  type InterviewQuestionInstance,
  type InterviewSetupState,
  type SpeechMetrics,
} from "@/app/live-interview/components/types";

type EvaluateRequestBody = {
  question: InterviewQuestionInstance;
  answer: string;
  geminiApiKey: string;
  setup?: InterviewSetupState;
  speechMetrics?: SpeechMetrics;
};

function sanitizeEvaluation(data: Partial<InterviewEvaluation>): InterviewEvaluation | null {
  if (typeof data.score !== "number") {
    return null;
  }

  const score = Math.max(0, Math.min(10, Number(data.score.toFixed(1))));
  const performanceLevel = getPerformanceLevel(score);

  return {
    score,
    clarity: typeof data.clarity === "number" ? data.clarity : score,
    technicalAccuracy:
      typeof data.technicalAccuracy === "number" ? data.technicalAccuracy : score,
    depth: typeof data.depth === "number" ? data.depth : score,
    keywordCoverage:
      typeof data.keywordCoverage === "number" ? data.keywordCoverage : score,
    matchedKeywords: Array.isArray(data.matchedKeywords) ? data.matchedKeywords : [],
    missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords : [],
    feedback:
      typeof data.feedback === "string"
        ? data.feedback
        : "Clearer interview feedback was not returned, so the fallback summary is being used.",
    suggestedImprovement:
      typeof data.suggestedImprovement === "string"
        ? data.suggestedImprovement
        : "Add more technical specificity and one practical example.",
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
    missedConcepts: Array.isArray(data.missedConcepts) ? data.missedConcepts : [],
    performanceLevel,
    needsFollowUp:
      typeof data.needsFollowUp === "boolean"
        ? data.needsFollowUp
        : score < 6.5,
    followUpQuestion:
      typeof data.followUpQuestion === "string" ? data.followUpQuestion : undefined,
    companyFeedback:
      typeof data.companyFeedback === "string" ? data.companyFeedback : undefined,
  };
}

function parseGeminiJson(content: string) {
  const trimmed = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as Partial<InterviewEvaluation>;
  } catch {
    return null;
  }
}

async function evaluateWithGemini(
  question: InterviewQuestionInstance,
  answer: string,
  geminiApiKey: string,
  setup?: InterviewSetupState,
  speechMetrics?: SpeechMetrics
) {
  const company = setup?.company;
  const companyContext = company
    ? [
        `Company: ${COMPANY_LABELS[company]}`,
        `Company style: ${COMPANY_STYLE_GUIDE[company]}`,
        `Interview type: ${COMPANY_INTERVIEW_TYPE_LABELS[setup.companyInterviewType ?? "mixed"]}`,
        "Evaluate like a real company interviewer. Be strict, concise, and specific.",
        "If the answer is incomplete, ask one realistic follow-up question.",
        "Include companyFeedback with one company-specific coaching note.",
      ]
    : ["You are evaluating a mock technical interview response."];

  const prompt = [
    ...companyContext,
    "Return valid JSON only with these keys:",
    "score, clarity, technicalAccuracy, depth, keywordCoverage, matchedKeywords, missingKeywords, feedback, suggestedImprovement, strengths, weaknesses, missedConcepts, needsFollowUp, followUpQuestion, companyFeedback.",
    "Score fields must be 0-10 numbers.",
    `Question topic: ${question.topic}`,
    `Question type: ${question.type}`,
    `Question: ${question.question}`,
    `Expected keywords: ${question.expectedKeywords.join(", ")}`,
    `Sample answer guidance: ${question.sampleAnswer}`,
    speechMetrics
      ? `Speech metrics: ${JSON.stringify({
          durationSeconds: speechMetrics.durationSeconds,
          wordCount: speechMetrics.wordCount,
          fillerWordCount: speechMetrics.fillerWordCount,
          averageWordsPerMinute: speechMetrics.averageWordsPerMinute,
          confidenceScore: speechMetrics.confidenceScore,
          pauseCount: speechMetrics.pauseCount,
          eyeContactScore: speechMetrics.eyeContactScore,
        })}`
      : "Speech metrics: unavailable",
    `Candidate answer: ${answer}`,
  ].join("\n");

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Gemini evaluation request failed.");
  }

  const payload = await response.json();
  const content = payload?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: unknown }) => part.text)
    .filter((part: unknown): part is string => typeof part === "string")
    .join("\n");

  if (typeof content !== "string") {
    return null;
  }

  const parsed = parseGeminiJson(content);
  return parsed ? sanitizeEvaluation(parsed) : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EvaluateRequestBody;

    if (!body?.question || typeof body?.answer !== "string") {
      return NextResponse.json(
        { error: "Invalid evaluation payload." },
        { status: 400 }
      );
    }

    if (
      typeof body.geminiApiKey !== "string" ||
      body.geminiApiKey.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "A Gemini API key is required to evaluate this interview." },
        { status: 400 }
      );
    }

    const evaluation = await evaluateWithGemini(
      body.question,
      body.answer,
      body.geminiApiKey.trim(),
      body.setup,
      body.speechMetrics
    );

    if (!evaluation) {
      return NextResponse.json(
        { error: "Gemini did not return a valid interview evaluation." },
        { status: 502 }
      );
    }

    return NextResponse.json({ evaluation });
  } catch {
    return NextResponse.json(
      { error: "Failed to evaluate interview answer with Gemini." },
      { status: 502 }
    );
  }
}
