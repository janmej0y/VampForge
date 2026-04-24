import {
  type AnswerRecord,
  type InterviewEvaluation,
  type InterviewQuestionInstance,
  type InterviewSummary,
  type PerformanceLevel,
} from "@/app/live-interview/components/types";

export const LIVE_INTERVIEW_SESSION_KEY = "vampforge-live-interview-session";
export const LIVE_INTERVIEW_HISTORY_KEY = "vampforge-live-interview-history";
export const LIVE_INTERVIEW_GEMINI_KEY = "vampforge-live-interview-gemini-key";

export const COMPANY_LABELS = {
  google: "Google",
  amazon: "Amazon",
  microsoft: "Microsoft",
  startup: "Startup",
} as const;

export const COMPANY_INTERVIEW_TYPE_LABELS = {
  dsa: "DSA",
  "system-design": "System Design",
  behavioral: "Behavioral",
  mixed: "Mixed",
} as const;

export const COMPANY_STYLE_GUIDE = {
  google:
    "Deep conceptual reasoning, precise why-based follow-ups, and rigorous edge-case probing.",
  amazon:
    "Leadership Principles, ownership, customer obsession, tradeoffs, and scenario-heavy probing.",
  microsoft:
    "Practical problem solving, collaboration, maintainability, and clear communication.",
  startup:
    "Fast-paced real-world execution, product judgment, scrappiness, and pragmatic tradeoffs.",
} as const;

function clampScore(value: number) {
  return Math.max(0, Math.min(10, Number(value.toFixed(1))));
}

export function getPerformanceLevel(score: number): PerformanceLevel {
  if (score >= 8) return "Advanced";
  if (score >= 5.5) return "Intermediate";
  return "Beginner";
}

function collectUnique(items: string[], limit = 6) {
  return Array.from(new Set(items.filter(Boolean))).slice(0, limit);
}

export function evaluateAnswerHeuristically(
  question: InterviewQuestionInstance,
  answer: string
): InterviewEvaluation {
  const normalizedAnswer = answer.trim().toLowerCase();
  const words = normalizedAnswer ? normalizedAnswer.split(/\s+/) : [];
  const sentences = answer
    .split(/[.!?]\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const matchedKeywords = question.expectedKeywords.filter((keyword) =>
    normalizedAnswer.includes(keyword.toLowerCase())
  );
  const missingKeywords = question.expectedKeywords.filter(
    (keyword) => !matchedKeywords.includes(keyword)
  );

  const keywordCoverage = clampScore(
    (matchedKeywords.length / Math.max(question.expectedKeywords.length, 1)) * 10
  );
  const clarity = clampScore(
    Math.min(10, 3 + sentences.length * 1.4 + (normalizedAnswer.includes("because") ? 1 : 0))
  );
  const depth = clampScore(
    Math.min(
      10,
      2 +
        Math.min(words.length / 18, 5.2) +
        (normalizedAnswer.includes("tradeoff") ? 1 : 0) +
        (normalizedAnswer.includes("example") ? 0.6 : 0)
    )
  );
  const technicalAccuracy = clampScore(
    Math.min(
      10,
      keywordCoverage * 0.65 +
        (normalizedAnswer.length > 80 ? 1.4 : 0.5) +
        (question.sampleAnswer
          .toLowerCase()
          .split(/\W+/)
          .filter((token) => token.length > 5)
          .some((token) => normalizedAnswer.includes(token))
          ? 1.2
          : 0)
    )
  );

  const score = clampScore(
    clarity * 0.22 +
      technicalAccuracy * 0.38 +
      depth * 0.22 +
      keywordCoverage * 0.18
  );

  const strengths = collectUnique([
    matchedKeywords.length >= 3 ? "Covered several relevant technical keywords." : "",
    sentences.length >= 2 ? "Answer had a clearer structure instead of a one-line response." : "",
    words.length >= 45 ? "Provided helpful depth and context." : "",
    normalizedAnswer.includes("tradeoff")
      ? "Included tradeoff thinking, which is strong in interviews."
      : "",
  ]);

  const weaknesses = collectUnique([
    words.length < 18 ? "Answer was too short to show enough reasoning." : "",
    missingKeywords.length >= 3 ? "Missed several expected concepts from the question." : "",
    sentences.length <= 1 ? "Structure could be clearer with a more organized explanation." : "",
    !normalizedAnswer.includes("example")
      ? "Could be stronger with a concrete example or application."
      : "",
  ]);

  const missedConcepts = collectUnique(missingKeywords.map((keyword) => `Missed concept: ${keyword}`));
  const performanceLevel = getPerformanceLevel(score);
  const needsFollowUp = score < 6.5 || keywordCoverage < 5 || depth < 5;

  const feedbackParts = [
    score >= 8
      ? "Strong answer with good technical framing and useful detail."
      : score >= 5.5
        ? "Solid baseline answer, but it needs more precision or depth to feel interview-ready."
        : "The answer needs stronger structure and more technical substance.",
    matchedKeywords.length
      ? `You covered ${matchedKeywords.length} relevant keyword${matchedKeywords.length > 1 ? "s" : ""}.`
      : "You did not hit the expected technical signals yet.",
  ];

  const suggestedImprovement =
    missingKeywords.length > 0
      ? `Improve by explicitly addressing ${missingKeywords.slice(0, 3).join(", ")} and adding one practical example.`
      : "Improve by tightening the structure: state your approach, explain tradeoffs, then end with a concrete example.";

  return {
    score,
    clarity,
    technicalAccuracy,
    depth,
    keywordCoverage,
    matchedKeywords,
    missingKeywords,
    feedback: feedbackParts.join(" "),
    suggestedImprovement,
    strengths,
    weaknesses,
    missedConcepts,
    performanceLevel,
    needsFollowUp,
    followUpQuestion: needsFollowUp
      ? question.followUpPrompt ??
        `Go deeper on ${missingKeywords[0] ?? question.topic}. What would you say to make your answer more complete?`
      : undefined,
    companyFeedback: undefined,
  };
}

export function createInterviewSummary(answers: AnswerRecord[]): InterviewSummary {
  const totalScore = answers.reduce((sum, answer) => sum + answer.evaluation.score, 0);
  const overallScore = answers.length
    ? Number((totalScore / answers.length).toFixed(1))
    : 0;
  const communicationScore = answers.length
    ? Number(
        (
          answers.reduce(
            (sum, answer) => sum + (answer.evaluation.clarity ?? answer.evaluation.score),
            0
          ) / answers.length
        ).toFixed(1)
      )
    : 0;
  const technicalScore = answers.length
    ? Number(
        (
          answers.reduce(
            (sum, answer) =>
              sum +
              ((answer.evaluation.technicalAccuracy ?? answer.evaluation.score) +
                (answer.evaluation.depth ?? answer.evaluation.score)) /
                2,
            0
          ) / answers.length
        ).toFixed(1)
      )
    : 0;
  const speechMetricAnswers = answers.filter((answer) => answer.speechMetrics);
  const confidenceScore = speechMetricAnswers.length
    ? Number(
        (
          speechMetricAnswers.reduce(
            (sum, answer) => sum + (answer.speechMetrics?.confidenceScore ?? 0),
            0
          ) / speechMetricAnswers.length
        ).toFixed(1)
      )
    : communicationScore;
  const fillerWordCount = answers.reduce(
    (sum, answer) => sum + (answer.speechMetrics?.fillerWordCount ?? 0),
    0
  );

  return {
    overallScore,
    communicationScore,
    technicalScore,
    confidenceScore,
    fillerWordCount,
    totalQuestions: answers.length,
    answeredQuestions: answers.filter((answer) => answer.submittedAnswer.trim()).length,
    strengths: collectUnique(answers.flatMap((answer) => answer.evaluation.strengths), 5),
    weaknesses: collectUnique(answers.flatMap((answer) => answer.evaluation.weaknesses), 5),
    suggestedImprovements: collectUnique(
      answers.map((answer) => answer.evaluation.suggestedImprovement),
      5
    ),
    missedConcepts: collectUnique(
      answers.flatMap((answer) => answer.evaluation.missedConcepts),
      6
    ),
    performanceLevel: getPerformanceLevel(overallScore),
  };
}
