"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BrainCircuit, Building2, Gauge, History, Mic, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getQuestionTimeLimit } from "./components/question-bank";
import { CompanyInterviewSetup } from "./components/CompanyInterviewSetup";
import { enrichEvaluationWithSpeech } from "./components/EvaluationEngine";
import { FeedbackScreen } from "./components/FeedbackScreen";
import {
  evaluateCompanyAnswer,
  generateCompanyQuestion,
  getStoredGeminiApiKey,
  storeGeminiApiKey,
} from "./components/GeminiService";
import { VideoInterviewScreen } from "./components/VideoInterviewScreen";
import {
  type AnswerRecord,
  type InterviewEvaluation,
  type InterviewHistoryEntry,
  type InterviewQuestionInstance,
  type InterviewSessionState,
  type InterviewSetupState,
  type SpeechMetrics,
} from "./components/types";
import {
  COMPANY_LABELS,
  createInterviewSummary,
  LIVE_INTERVIEW_HISTORY_KEY,
  LIVE_INTERVIEW_SESSION_KEY,
} from "@/lib/live-interview";

const defaultSetup: InterviewSetupState = {
  mode: "company",
  company: "google",
  companyInterviewType: "mixed",
  role: "fullstack",
  difficulty: "medium",
  interviewType: "mixed",
  duration: 20,
  strictMode: true,
  voiceMode: true,
};

function parseStorage<T>(value: string | null) {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}`;
}

function getQuestionTarget(duration: InterviewSetupState["duration"]) {
  if (duration === 10) return 4;
  if (duration === 20) return 7;
  return 10;
}

function toConversationHistory(session: InterviewSessionState) {
  return session.answers.map((answer) => ({
    question: answer.question,
    answer: answer.submittedAnswer,
    score: answer.evaluation.score,
  }));
}

export default function LiveInterviewPage() {
  const [setup, setSetup] = useState<InterviewSetupState>(defaultSetup);
  const [session, setSession] = useState<InterviewSessionState | null>(null);
  const [history, setHistory] = useState<InterviewHistoryEntry[]>([]);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [startError, setStartError] = useState<string | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<"idle" | "granted" | "denied">(
    "idle"
  );
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<InterviewEvaluation | null>(
    null
  );

  useEffect(() => {
    const storedSession = parseStorage<InterviewSessionState>(
      window.localStorage.getItem(LIVE_INTERVIEW_SESSION_KEY)
    );
    const storedHistory = parseStorage<InterviewHistoryEntry[]>(
      window.localStorage.getItem(LIVE_INTERVIEW_HISTORY_KEY)
    );
    const storedGeminiApiKey = getStoredGeminiApiKey();

    if (storedSession) {
      setSession(storedSession);
      setSetup({ ...defaultSetup, ...storedSession.setup });
    }

    if (storedHistory) {
      setHistory(storedHistory);
    }

    if (storedGeminiApiKey) {
      setGeminiApiKey(storedGeminiApiKey);
    }
  }, []);

  useEffect(() => {
    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  useEffect(() => {
    if (!session || session.completed) {
      window.localStorage.removeItem(LIVE_INTERVIEW_SESSION_KEY);
      return;
    }

    window.localStorage.setItem(LIVE_INTERVIEW_SESSION_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    window.localStorage.setItem(
      LIVE_INTERVIEW_HISTORY_KEY,
      JSON.stringify(history.slice(0, 10))
    );
  }, [history]);

  useEffect(() => {
    storeGeminiApiKey(geminiApiKey);
  }, [geminiApiKey]);

  const currentQuestion = useMemo(() => {
    if (!session || session.completed) return null;
    return session.questions[session.currentQuestionIndex] ?? null;
  }, [session]);

  const summary = useMemo(
    () => (session ? createInterviewSummary(session.answers) : null),
    [session]
  );

  const completedInterviews = history.length;
  const averageScore = history.length
    ? Number(
        (
          history.reduce((sum, entry) => sum + entry.overallScore, 0) / history.length
        ).toFixed(1)
      )
    : 0;

  const stopMediaStream = useCallback(() => {
    setMediaStream((previous) => {
      previous?.getTracks().forEach((track) => track.stop());
      return null;
    });
    setPermissionStatus("idle");
  }, []);

  const requestMediaPermissions = useCallback(async () => {
    setIsRequestingPermissions(true);
    setPermissionError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setMediaStream((previous) => {
        previous?.getTracks().forEach((track) => track.stop());
        return stream;
      });
      setPermissionStatus("granted");
      setPermissionError(null);
      setStartError(null);
    } catch {
      setPermissionStatus("denied");
      setPermissionError(
        "Camera and microphone access are mandatory before the room opens."
      );
      setMediaStream(null);
    } finally {
      setIsRequestingPermissions(false);
    }
  }, []);

  const beginInterview = async (nextSetup = setup) => {
    if (!geminiApiKey.trim()) {
      setStartError("Add your own Gemini API key in settings or paste it here first.");
      return;
    }

    if (!mediaStream) {
      setStartError("Allow camera and microphone access before starting.");
      return;
    }

    const companySetup: InterviewSetupState = {
      ...nextSetup,
      mode: "company",
      company: nextSetup.company ?? "google",
      companyInterviewType: nextSetup.companyInterviewType ?? "mixed",
      strictMode: true,
      voiceMode: true,
    };
    const totalQuestions = getQuestionTarget(companySetup.duration);

    setIsGeneratingQuestion(true);
    setStartError(null);
    setEvaluationError(null);
    setCurrentEvaluation(null);

    try {
      const firstQuestion = await generateCompanyQuestion({
        setup: companySetup,
        geminiApiKey: geminiApiKey.trim(),
        questionNumber: 1,
        totalQuestions,
        conversationHistory: [],
      });
      const now = new Date().toISOString();

      setSession({
        id: createSessionId(),
        setup: companySetup,
        questions: [firstQuestion],
        currentQuestionIndex: 0,
        answers: [],
        startedAt: now,
        lastUpdatedAt: now,
        questionTimeLimit: getQuestionTimeLimit(companySetup, totalQuestions),
        completed: false,
      });
    } catch {
      setStartError("Gemini could not prepare the company interview. Check your key and try again.");
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const finishSession = useCallback(
    (sourceSession: InterviewSessionState) => {
      const now = new Date().toISOString();
      const completedSession = {
        ...sourceSession,
        completed: true,
        lastUpdatedAt: now,
      };
      const nextSummary = createInterviewSummary(completedSession.answers);

      const completedEntry: InterviewHistoryEntry = {
        id: completedSession.id,
        role: completedSession.setup.role,
        difficulty: completedSession.setup.difficulty,
        interviewType: completedSession.setup.interviewType,
        duration: completedSession.setup.duration,
        totalQuestions: getQuestionTarget(completedSession.setup.duration),
        answeredQuestions: nextSummary.answeredQuestions,
        overallScore: nextSummary.overallScore,
        performanceLevel: nextSummary.performanceLevel,
        strengths: nextSummary.strengths,
        weaknesses: nextSummary.weaknesses,
        suggestedImprovements: nextSummary.suggestedImprovements,
        missedConcepts: nextSummary.missedConcepts,
        completedAt: now,
        communicationScore: nextSummary.communicationScore,
        technicalScore: nextSummary.technicalScore,
        confidenceScore: nextSummary.confidenceScore,
        fillerWordCount: nextSummary.fillerWordCount,
      };

      setHistory((previous) => [completedEntry, ...previous].slice(0, 10));
      stopMediaStream();
      return completedSession;
    },
    [stopMediaStream]
  );

  const handleContinue = async () => {
    if (!session || isGeneratingQuestion) return;

    setEvaluationError(null);
    setCurrentEvaluation(null);

    const totalQuestions = getQuestionTarget(session.setup.duration);
    const isLastQuestion = session.currentQuestionIndex >= totalQuestions - 1;

    if (isLastQuestion) {
      setSession((previous) => (previous ? finishSession(previous) : previous));
      return;
    }

    const needsGeneratedQuestion =
      session.currentQuestionIndex >= session.questions.length - 1;

    if (!needsGeneratedQuestion) {
      setSession((previous) => {
        if (!previous) return previous;
        return {
          ...previous,
          currentQuestionIndex: previous.currentQuestionIndex + 1,
          lastUpdatedAt: new Date().toISOString(),
        };
      });
      return;
    }

    setIsGeneratingQuestion(true);
    try {
      const nextQuestion = await generateCompanyQuestion({
        setup: session.setup,
        geminiApiKey: geminiApiKey.trim(),
        questionNumber: session.currentQuestionIndex + 2,
        totalQuestions,
        conversationHistory: toConversationHistory(session),
      });

        setSession((previous) => {
          if (!previous || previous.completed) return previous;
          return {
            ...previous,
            questions: [...previous.questions, nextQuestion],
            currentQuestionIndex: previous.currentQuestionIndex + 1,
            lastUpdatedAt: new Date().toISOString(),
          };
        });
    } catch {
      setEvaluationError(
        "Gemini could not generate the next question. Try again or submit the interview."
      );
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleSubmitAnswer = async (
    answer: string,
    timedOut = false,
    speechMetrics?: SpeechMetrics,
    audioRecordingUrl?: string
  ) => {
    if (!session || !currentQuestion || isEvaluating) {
      return;
    }

    if (!geminiApiKey.trim()) {
      setEvaluationError("Add your own Gemini API key before submitting an answer.");
      return;
    }

    setIsEvaluating(true);
    setEvaluationError(null);

    let evaluation: InterviewEvaluation | null = null;

    try {
      evaluation = await evaluateCompanyAnswer({
        question: currentQuestion,
        answer,
        geminiApiKey: geminiApiKey.trim(),
        setup: session.setup,
        speechMetrics,
      });
    } catch {
      setEvaluationError(
        "Gemini could not evaluate this answer. Check your API key and try again."
      );
    }

    if (!evaluation) {
      setIsEvaluating(false);
      return;
    }

    const finalEvaluation = enrichEvaluationWithSpeech(
      evaluation,
      session.setup,
      speechMetrics
    );

    const answerRecord: AnswerRecord = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      topic: currentQuestion.topic,
      type: currentQuestion.type,
      submittedAnswer: answer,
      timedOut,
      isFollowUp: Boolean(currentQuestion.isFollowUp),
      parentId: currentQuestion.parentId,
      timestamp: new Date().toISOString(),
      evaluation: finalEvaluation,
      speechMetrics,
      audioRecordingUrl,
    };

    setSession((previous) => {
      if (!previous) return previous;

      const nextQuestions = [...previous.questions];
      const nextIndex = previous.currentQuestionIndex;
      const hasQueuedFollowUp = nextQuestions.some(
        (question) =>
          question.parentId === currentQuestion.id &&
          question.isFollowUp &&
          question.question === finalEvaluation.followUpQuestion
      );

      if (
        finalEvaluation.needsFollowUp &&
        finalEvaluation.followUpQuestion &&
        !currentQuestion.isFollowUp &&
        !hasQueuedFollowUp
      ) {
        const followUpQuestion: InterviewQuestionInstance = {
          ...currentQuestion,
          id: `${currentQuestion.id}-follow-up-${previous.answers.length + 1}`,
          question: finalEvaluation.followUpQuestion,
          isFollowUp: true,
          parentId: currentQuestion.id,
          estimatedSeconds: Math.max(60, Math.round(previous.questionTimeLimit * 0.7)),
        };

        nextQuestions.splice(nextIndex + 1, 0, followUpQuestion);
      }

      return {
        ...previous,
        questions: nextQuestions,
        answers: [...previous.answers, answerRecord],
        lastUpdatedAt: new Date().toISOString(),
      };
    });

    setCurrentEvaluation(finalEvaluation);
    setIsEvaluating(false);
  };

  const handleEndInterview = () => {
    setCurrentEvaluation(null);
    setEvaluationError(null);

    setSession((previous) => {
      if (!previous) return previous;
      return finishSession(previous);
    });
  };

  const companyLabel = COMPANY_LABELS[setup.company ?? "google"];

  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden">
      <PageHeader
        badge="Live Interview"
        title="Real Company Interview Mode"
        description={`Practice a voice and camera interview in the style of ${companyLabel}. The user adds their own Gemini API key only when they want AI-generated interview questions and feedback.`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="gap-2">
              <Building2 className="h-3.5 w-3.5" />
              Company Patterns
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <Mic className="h-3.5 w-3.5" />
              Voice Only
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Gemini Follow-ups
            </Badge>
          </div>
        }
      />

      <section className="grid w-full max-w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="bg-white/[0.045] fade-in-up">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Company Mode</p>
              <p className="mt-2 text-3xl font-semibold text-white">4 styles</p>
              <p className="mt-1 break-words text-sm text-slate-400">
                Google, Amazon, Microsoft, and Startup interview behavior.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-primary/20 bg-primary/15 p-4">
              <BrainCircuit className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045] fade-in-up delay-1">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Completed Sessions</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {completedInterviews.toString().padStart(2, "0")}
              </p>
              <p className="mt-1 break-words text-sm text-slate-400">
                Local interview history for repeated practice.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <History className="h-5 w-5 text-cyan-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045] fade-in-up delay-2">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {history.length ? `${averageScore}/10` : "--"}
              </p>
              <p className="mt-1 break-words text-sm text-slate-400">
                Scores include speech confidence and company-specific feedback.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <Gauge className="h-5 w-5 text-emerald-300" />
            </div>
          </CardContent>
        </Card>
      </section>

      {!session || !summary || (!session.completed && !mediaStream) ? (
        <CompanyInterviewSetup
          setup={setup}
          onChange={(next) => setSetup((previous) => ({ ...previous, ...next }))}
          geminiApiKey={geminiApiKey}
          onGeminiApiKeyChange={(value) => {
            setGeminiApiKey(value);
            if (value.trim()) {
              setStartError(null);
            }
          }}
          onStart={() => void beginInterview()}
          onRequestPermissions={requestMediaPermissions}
          startError={startError}
          permissionStatus={permissionStatus}
          permissionError={permissionError}
          isRequestingPermissions={isRequestingPermissions}
          isGeneratingQuestion={isGeneratingQuestion}
        />
      ) : session.completed ? (
        <FeedbackScreen
          session={session}
          answers={session.answers}
          summary={summary}
          history={history}
          onRestart={() => void beginInterview(session.setup)}
          onStartAnother={() => {
            setCurrentEvaluation(null);
            setSession(null);
          }}
        />
      ) : currentQuestion && mediaStream ? (
        <VideoInterviewScreen
          session={session}
          currentQuestion={currentQuestion}
          mediaStream={mediaStream}
          currentEvaluation={currentEvaluation}
          evaluationError={evaluationError}
          isEvaluating={isEvaluating}
          isGeneratingQuestion={isGeneratingQuestion}
          onSubmitAnswer={handleSubmitAnswer}
          onContinue={() => void handleContinue()}
          onEndInterview={handleEndInterview}
          onCameraLost={() => {
            setEvaluationError("Camera feed stopped. The interview has ended.");
            handleEndInterview();
          }}
        />
      ) : null}
    </div>
  );
}
