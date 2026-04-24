import { NextResponse } from "next/server";
import {
  COMPANY_INTERVIEW_TYPE_LABELS,
  COMPANY_LABELS,
  COMPANY_STYLE_GUIDE,
} from "@/lib/live-interview";
import {
  type CompanyInterviewCompany,
  type InterviewQuestionInstance,
  type InterviewSetupState,
  type QuestionKind,
} from "@/app/live-interview/components/types";

type GenerateRequestBody = {
  setup: InterviewSetupState;
  geminiApiKey: string;
  questionNumber: number;
  totalQuestions: number;
  conversationHistory?: Array<{
    question: string;
    answer?: string;
    score?: number;
  }>;
};

function parseGeminiJson(content: string) {
  const trimmed = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as Partial<InterviewQuestionInstance>;
  } catch {
    return null;
  }
}

function normalizeQuestion(
  data: Partial<InterviewQuestionInstance>,
  setup: InterviewSetupState,
  questionNumber: number
): InterviewQuestionInstance | null {
  if (typeof data.question !== "string" || !data.question.trim()) {
    return null;
  }

  const company = setup.company ?? "google";
  const type: QuestionKind =
    data.type === "behavioral" ||
    data.type === "coding" ||
    data.type === "scenario" ||
    data.type === "conceptual"
      ? data.type
      : setup.companyInterviewType === "behavioral"
        ? "behavioral"
        : setup.companyInterviewType === "dsa"
          ? "coding"
          : "scenario";

  return {
    id:
      typeof data.id === "string" && data.id.trim()
        ? data.id
        : `${company}-generated-${questionNumber}-${Date.now()}`,
    role: setup.role,
    difficulty: setup.difficulty,
    interviewTrack: type === "behavioral" ? "hr" : "technical",
    type,
    topic:
      typeof data.topic === "string" && data.topic.trim()
        ? data.topic
        : COMPANY_INTERVIEW_TYPE_LABELS[setup.companyInterviewType ?? "mixed"],
    question: data.question.trim(),
    expectedKeywords: Array.isArray(data.expectedKeywords)
      ? data.expectedKeywords.filter((item): item is string => typeof item === "string")
      : [],
    sampleAnswer:
      typeof data.sampleAnswer === "string" && data.sampleAnswer.trim()
        ? data.sampleAnswer
        : "A strong answer should be structured, specific, and include tradeoffs.",
    followUpPrompt:
      typeof data.followUpPrompt === "string" && data.followUpPrompt.trim()
        ? data.followUpPrompt
        : "Can you go one level deeper and explain your reasoning?",
    estimatedSeconds:
      typeof data.estimatedSeconds === "number" ? data.estimatedSeconds : undefined,
  };
}

function fallbackQuestion(
  setup: InterviewSetupState,
  questionNumber: number
): InterviewQuestionInstance {
  const company = setup.company ?? "google";
  const companyLabel = COMPANY_LABELS[company];
  const typeLabel = COMPANY_INTERVIEW_TYPE_LABELS[setup.companyInterviewType ?? "mixed"];

  return {
    id: `${company}-fallback-${questionNumber}`,
    role: setup.role,
    difficulty: setup.difficulty,
    interviewTrack: setup.companyInterviewType === "behavioral" ? "hr" : "technical",
    type: setup.companyInterviewType === "behavioral" ? "behavioral" : "scenario",
    topic: `${companyLabel} ${typeLabel}`,
    question: `You are interviewing at ${companyLabel}. Walk me through a ${setup.difficulty} ${typeLabel.toLowerCase()} situation for a ${setup.role} role, including your reasoning, tradeoffs, and final decision.`,
    expectedKeywords: ["tradeoff", "reasoning", "impact", "constraints", "decision"],
    sampleAnswer:
      "A strong answer should explain the problem, constraints, options considered, tradeoffs, decision, and measurable outcome.",
    followUpPrompt: "Why did you choose that approach over the next-best alternative?",
  };
}

async function generateWithGemini(body: GenerateRequestBody) {
  const setup = body.setup;
  const company = (setup.company ?? "google") as CompanyInterviewCompany;
  const companyLabel = COMPANY_LABELS[company];
  const interviewType = COMPANY_INTERVIEW_TYPE_LABELS[setup.companyInterviewType ?? "mixed"];
  const styleGuide = COMPANY_STYLE_GUIDE[company];
  const history = body.conversationHistory?.slice(-6) ?? [];

  const prompt = [
    `You are a senior interviewer at ${companyLabel}.`,
    `Interview style: ${styleGuide}`,
    `Ask a ${setup.difficulty} level ${setup.role} interview question.`,
    `Interview type: ${interviewType}.`,
    `Question ${body.questionNumber} of ${body.totalQuestions}.`,
    "Ask only ONE concise question at a time. Do not greet. Do not explain.",
    "If the previous score was high, increase difficulty slightly. If low, probe fundamentals.",
    "Return JSON only with keys: id, topic, type, question, expectedKeywords, sampleAnswer, followUpPrompt, estimatedSeconds.",
    "type must be one of conceptual, coding, scenario, behavioral.",
    `Recent context: ${JSON.stringify(history)}`,
  ].join("\n");

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": body.geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.55,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Gemini question generation failed.");
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
  return parsed ? normalizeQuestion(parsed, setup, body.questionNumber) : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequestBody;

    if (!body?.setup || typeof body.geminiApiKey !== "string" || !body.geminiApiKey.trim()) {
      return NextResponse.json(
        { error: "A Gemini API key and setup are required." },
        { status: 400 }
      );
    }

    const question =
      (await generateWithGemini({
        ...body,
        geminiApiKey: body.geminiApiKey.trim(),
      })) ?? fallbackQuestion(body.setup, body.questionNumber);

    return NextResponse.json({ question });
  } catch {
    return NextResponse.json(
      { error: "Gemini could not generate the next company interview question." },
      { status: 502 }
    );
  }
}
