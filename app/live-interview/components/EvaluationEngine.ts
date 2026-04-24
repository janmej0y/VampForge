import {
  type InterviewEvaluation,
  type InterviewSetupState,
  type SpeechMetrics,
} from "./types";

export function enrichEvaluationWithSpeech(
  evaluation: InterviewEvaluation,
  setup: InterviewSetupState,
  speechMetrics?: SpeechMetrics
): InterviewEvaluation {
  const company = setup.company;
  const companyFeedback =
    company === "amazon"
      ? "Amazon expects stronger ownership signals, customer impact, and a clear STAR-style structure."
      : company === "google"
        ? "Google expects deeper reasoning, edge cases, and clear explanation of why your approach works."
        : company === "microsoft"
          ? "Microsoft expects practical problem solving with collaborative tradeoffs."
          : company === "startup"
            ? "Startups expect crisp execution, product judgment, and pragmatic tradeoff thinking."
            : evaluation.companyFeedback;

  if (!speechMetrics) {
    return { ...evaluation, companyFeedback };
  }

  const confidenceAdjustment =
    speechMetrics.confidenceScore >= 8
      ? 0.3
      : speechMetrics.confidenceScore < 5
        ? -0.5
        : 0;
  const score = Math.max(
    0,
    Math.min(10, Number((evaluation.score + confidenceAdjustment).toFixed(1)))
  );

  return {
    ...evaluation,
    score,
    companyFeedback,
  };
}
