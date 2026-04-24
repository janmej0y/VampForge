"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  KeyRound,
  Loader2,
  Mic,
  MicOff,
  SkipForward,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionCard } from "./QuestionCard";
import { ScorePanel } from "./ScorePanel";
import { Timer } from "./Timer";
import {
  type AnswerRecord,
  type InterviewEvaluation,
  type InterviewQuestionInstance,
  type InterviewSessionState,
} from "./types";

type SpeechRecognitionAlternative = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type InterviewScreenProps = {
  session: InterviewSessionState;
  currentQuestion: InterviewQuestionInstance;
  answers: AnswerRecord[];
  currentEvaluation: InterviewEvaluation | null;
  geminiApiKey: string;
  onGeminiApiKeyChange: (value: string) => void;
  evaluationError?: string | null;
  isEvaluating: boolean;
  onSubmitAnswer: (answer: string, timedOut?: boolean) => void;
  onContinue: () => void;
  onSkip: () => void;
};

export function InterviewScreen({
  session,
  currentQuestion,
  answers,
  currentEvaluation,
  geminiApiKey,
  onGeminiApiKeyChange,
  evaluationError,
  isEvaluating,
  onSubmitAnswer,
  onContinue,
  onSkip,
}: InterviewScreenProps) {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const autoSubmittedQuestionRef = useRef<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const totalTime = useMemo(
    () =>
      Math.min(
        currentQuestion.estimatedSeconds ?? session.questionTimeLimit,
        session.questionTimeLimit
      ),
    [currentQuestion.estimatedSeconds, session.questionTimeLimit]
  );
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const hasGeminiApiKey = geminiApiKey.trim().length > 0;
  const answerLocked = Boolean(currentEvaluation) || isEvaluating;

  useEffect(() => {
    setAnswer("");
    setTimeRemaining(totalTime);
    autoSubmittedQuestionRef.current = null;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setIsRecording(false);
  }, [currentQuestion.id, totalTime]);

  useEffect(() => {
    const Recognition =
      typeof window === "undefined"
        ? undefined
        : window.SpeechRecognition ?? window.webkitSpeechRecognition;

    setVoiceSupported(Boolean(Recognition));
  }, []);

  useEffect(() => {
    if (currentEvaluation || isEvaluating) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeRemaining((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [currentEvaluation, isEvaluating, currentQuestion.id]);

  useEffect(() => {
    if (timeRemaining > 0 || currentEvaluation || isEvaluating) {
      return;
    }

    if (autoSubmittedQuestionRef.current === currentQuestion.id) {
      return;
    }

    autoSubmittedQuestionRef.current = currentQuestion.id;
    onSubmitAnswer(answer, true);
  }, [
    answer,
    currentEvaluation,
    currentQuestion.id,
    isEvaluating,
    onSubmitAnswer,
    timeRemaining,
  ]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceSupported(false);
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let transcript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0]?.transcript ?? "";
      }

      setAnswer((previous) =>
        `${previous.trim()} ${transcript.trim()}`.trimStart()
      );
    };
    recognition.onerror = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };
    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  return (
    <div className="space-y-6">
      <section className="grid w-full max-w-full grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <QuestionCard
          question={currentQuestion}
          currentIndex={session.currentQuestionIndex}
          totalQuestions={session.questions.length}
        />

        <div className="section-card mesh-card premium-ring border-white/10 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-label">Answer Input</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Respond like it is a real interview
              </h2>
            </div>
            <Badge variant="secondary" className="gap-2 border-white/10 bg-white/5 text-slate-200">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Text + Voice
            </Badge>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-slate-950/40 p-4">
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Walk through your thinking clearly. Explain the approach, tradeoffs, and a practical example where possible."
              className="min-h-[260px] w-full resize-none bg-transparent text-base leading-7 text-white outline-none placeholder:text-slate-500"
              disabled={answerLocked}
            />
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/45 p-3">
              <label className="flex items-center gap-3">
                <KeyRound className="h-4 w-4 text-primary" />
                <Input
                  type="password"
                  value={geminiApiKey}
                  onChange={(event) => onGeminiApiKeyChange(event.target.value)}
                  placeholder="Gemini API key"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={isEvaluating}
                  className="h-10 font-mono"
                />
              </label>
              {evaluationError ? (
                <p className="mt-2 text-sm text-amber-200">{evaluationError}</p>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="text-sm text-slate-400">
                {answer.trim().split(/\s+/).filter(Boolean).length} words captured
              </div>
              <div className="flex flex-wrap gap-3">
                {session.setup.voiceMode ? (
                  <Button
                    variant="secondary"
                    onClick={toggleRecording}
                    disabled={!voiceSupported || answerLocked}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-4 w-4" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" />
                        {voiceSupported ? "Start Voice Input" : "Voice Unsupported"}
                      </>
                    )}
                  </Button>
                ) : null}

                {!session.setup.strictMode ? (
                  <Button
                    variant="ghost"
                    onClick={onSkip}
                    disabled={answerLocked || !hasGeminiApiKey}
                  >
                    <SkipForward className="h-4 w-4" />
                    Skip
                  </Button>
                ) : null}

                {currentEvaluation ? (
                  <Button onClick={onContinue}>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => onSubmitAnswer(answer)}
                    disabled={isEvaluating || !hasGeminiApiKey}
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Evaluating
                      </>
                    ) : (
                      <>
                        <WandSparkles className="h-4 w-4" />
                        Submit Answer
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentEvaluation ? (
              <motion.div
                key={`${currentQuestion.id}-evaluation`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-6 rounded-[1.6rem] border border-primary/20 bg-primary/10 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="section-label text-cyan-100/80">Instant Evaluation</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      {currentEvaluation.score}/10 • {currentEvaluation.performanceLevel}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/35 px-3 py-1 text-sm text-slate-200">
                    <AlertTriangle className="h-4 w-4 text-amber-200" />
                    {currentEvaluation.needsFollowUp
                      ? "Follow-up likely"
                      : "Strong enough to move on"}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-200">
                  {currentEvaluation.feedback}
                </p>
                <p className="mt-3 text-sm leading-7 text-cyan-50/90">
                  {currentEvaluation.suggestedImprovement}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <Timer timeRemaining={timeRemaining} totalTime={totalTime} />
          <ScorePanel
            currentQuestion={currentQuestion}
            currentIndex={session.currentQuestionIndex}
            totalQuestions={session.questions.length}
            answers={answers}
            strictMode={session.setup.strictMode}
          />
        </div>
      </section>
    </div>
  );
}
