"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  CameraOff,
  CircleStop,
  Clock3,
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIAgent } from "./AIAgent";
import { UserCamera } from "./UserCamera";
import { VoiceWaveform } from "./VoiceWaveform";
import { applyInterviewVoice } from "./VoiceEngine";
import {
  type InterviewEvaluation,
  type InterviewQuestionInstance,
  type InterviewSessionState,
  type SpeechMetrics,
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

type VideoInterviewScreenProps = {
  session: InterviewSessionState;
  currentQuestion: InterviewQuestionInstance;
  mediaStream: MediaStream;
  currentEvaluation: InterviewEvaluation | null;
  isEvaluating: boolean;
  isGeneratingQuestion: boolean;
  evaluationError?: string | null;
  onSubmitAnswer: (
    answer: string,
    timedOut: boolean,
    speechMetrics: SpeechMetrics,
    audioRecordingUrl?: string
  ) => void;
  onContinue: () => void;
  onEndInterview: () => void;
  onCameraLost: () => void;
};

const FILLER_WORDS = ["um", "umm", "uh", "uhh", "like", "actually", "basically"];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(Math.max(0, totalSeconds) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.max(0, totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function countFillers(transcript: string) {
  const tokens = transcript.toLowerCase().match(/\b[\w']+\b/g) ?? [];
  return tokens.filter((token) => FILLER_WORDS.includes(token)).length;
}

function buildSpeechMetrics(
  transcript: string,
  durationSeconds: number,
  pauseCount: number,
  eyeContactScore?: number
): SpeechMetrics {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const fillerWordCount = countFillers(transcript);
  const fillerRate = words.length ? fillerWordCount / words.length : 0;
  const averageWordsPerMinute = durationSeconds
    ? Math.round((words.length / durationSeconds) * 60)
    : 0;
  const pacePenalty =
    averageWordsPerMinute < 75 || averageWordsPerMinute > 185 ? 1.1 : 0;
  const confidenceScore = Math.max(
    1,
    Math.min(
      10,
      Number(
        (
          9.2 -
          fillerRate * 18 -
          pauseCount * 0.35 -
          pacePenalty +
          ((eyeContactScore ?? 8) - 8) * 0.35
        ).toFixed(1)
      )
    )
  );

  return {
    durationSeconds,
    wordCount: words.length,
    fillerWordCount,
    fillerRate: Number(fillerRate.toFixed(2)),
    averageWordsPerMinute,
    confidenceScore,
    pauseCount,
    eyeContactScore: eyeContactScore ? Number(eyeContactScore.toFixed(1)) : undefined,
  };
}

export function VideoInterviewScreen({
  session,
  currentQuestion,
  mediaStream,
  currentEvaluation,
  isEvaluating,
  isGeneratingQuestion,
  evaluationError,
  onSubmitAnswer,
  onContinue,
  onEndInterview,
  onCameraLost,
}: VideoInterviewScreenProps) {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const listenStartedAtRef = useRef<number | null>(null);
  const submittedQuestionRef = useRef<string | null>(null);
  const pauseCountRef = useRef(0);
  const eyeContactSamplesRef = useRef<number[]>([]);
  const submitRef = useRef(onSubmitAnswer);
  const continueRef = useRef(onContinue);
  const endRef = useRef(onEndInterview);

  const pressureMode = session.setup.difficulty === "hard";
  const totalGlobalTime = session.setup.duration * 60;
  const questionLimit = useMemo(() => {
    const base = currentQuestion.estimatedSeconds ?? session.questionTimeLimit;
    return pressureMode ? Math.max(45, Math.round(base * 0.72)) : base;
  }, [currentQuestion.estimatedSeconds, pressureMode, session.questionTimeLimit]);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [subtitle, setSubtitle] = useState(currentQuestion.question);
  const [questionRemaining, setQuestionRemaining] = useState(questionLimit);
  const [globalRemaining, setGlobalRemaining] = useState(totalGlobalTime);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [networkDelay, setNetworkDelay] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);

  useEffect(() => {
    submitRef.current = onSubmitAnswer;
    continueRef.current = onContinue;
    endRef.current = onEndInterview;
  }, [onContinue, onEndInterview, onSubmitAnswer]);

  useEffect(() => {
    const startedAt = new Date(session.startedAt).getTime();
    const interval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setGlobalRemaining(Math.max(0, totalGlobalTime - elapsed));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [session.startedAt, totalGlobalTime]);

  useEffect(() => {
    if (globalRemaining <= 0) {
      endRef.current();
    }
  }, [globalRemaining]);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const stopRecorderWithUrl = () =>
    new Promise<string | undefined>((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        resolve(undefined);
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];
        resolve(blob.size ? URL.createObjectURL(blob) : undefined);
      };
      recorder.stop();
    });

  const pauseListening = () => {
    clearSilenceTimer();
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  };

  const finishAnswer = async (timedOut = false) => {
    if (submittedQuestionRef.current === currentQuestion.id) {
      return;
    }

    submittedQuestionRef.current = currentQuestion.id;
    clearSilenceTimer();
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);

    const finalTranscript = `${transcript} ${interimTranscript}`.trim();
    const durationSeconds = Math.max(
      1,
      Math.round((Date.now() - (listenStartedAtRef.current ?? Date.now())) / 1000)
    );
    const eyeContactScore = eyeContactSamplesRef.current.length
      ? eyeContactSamplesRef.current.reduce((sum, score) => sum + score, 0) /
        eyeContactSamplesRef.current.length
      : undefined;
    const metrics = buildSpeechMetrics(
      finalTranscript,
      durationSeconds,
      pauseCountRef.current,
      eyeContactScore
    );
    const audioRecordingUrl = await stopRecorderWithUrl();

    submitRef.current(finalTranscript, timedOut, metrics, audioRecordingUrl);
  };

  const resetSilenceTimer = () => {
    clearSilenceTimer();
    pauseCountRef.current += transcript.trim() || interimTranscript.trim() ? 1 : 0;
    silenceTimerRef.current = window.setTimeout(() => {
      void finishAnswer(false);
    }, pressureMode ? 5000 : 6500);
  };

  const startRecorder = () => {
    if (typeof MediaRecorder === "undefined") return;

    try {
      const audioTracks = mediaStream.getAudioTracks();
      if (!audioTracks.length) return;

      audioChunksRef.current = [];
      const recorder = new MediaRecorder(new MediaStream(audioTracks));
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      recorder.start();
      recorderRef.current = recorder;
    } catch {
      recorderRef.current = null;
    }
  };

  const startListening = () => {
    if (!isMicEnabled || currentEvaluation || isEvaluating) {
      return;
    }

    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const item = event.results[index];
        if (item.isFinal) {
          finalText += ` ${item[0]?.transcript ?? ""}`;
        } else {
          interimText += ` ${item[0]?.transcript ?? ""}`;
        }
      }

      if (finalText.trim()) {
        setTranscript((previous) => `${previous} ${finalText}`.trim());
      }
      setInterimTranscript(interimText.trim());
      resetSilenceTimer();
    };
    recognition.onerror = () => {
      setSpeechSupported(false);
      void finishAnswer(false);
    };
    recognition.onend = () => {
      if (
        isMicEnabled &&
        isListening &&
        submittedQuestionRef.current !== currentQuestion.id
      ) {
        try {
          recognition.start();
        } catch {
          setSpeechSupported(false);
        }
      }
    };

    listenStartedAtRef.current = Date.now();
    setIsListening(true);
    startRecorder();
    recognition.start();
    recognitionRef.current = recognition;
    resetSilenceTimer();
  };

  useEffect(() => {
    setTranscript("");
    setInterimTranscript("");
    setSubtitle(currentQuestion.question);
    setQuestionRemaining(questionLimit);
    setIsListening(false);
    setNetworkDelay(false);
    setIsMicEnabled(true);
    setIsCameraEnabled(true);
    submittedQuestionRef.current = null;
    pauseCountRef.current = 0;
    eyeContactSamplesRef.current = [];
    clearSilenceTimer();
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    void stopRecorderWithUrl();

    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    utterance.rate = pressureMode ? 1.08 : 0.96;
    utterance.pitch = 0.92;
    utterance.volume = 1;
    applyInterviewVoice(utterance);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      const delay = Math.random() > 0.72 ? 850 : 180;
      setNetworkDelay(delay > 500);
      window.setTimeout(() => {
        setNetworkDelay(false);
        startListening();
      }, delay);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      startListening();
    };

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
      startListening();
    }

    return () => {
      window.speechSynthesis?.cancel();
      clearSilenceTimer();
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      void stopRecorderWithUrl();
    };
    // The question id is the lifecycle boundary for the room.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion.id, questionLimit, pressureMode]);

  useEffect(() => {
    if (!isListening || currentEvaluation || isEvaluating) return;

    const interval = window.setInterval(() => {
      setQuestionRemaining((previous) => {
        if (previous <= 1) {
          void finishAnswer(true);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvaluation, currentQuestion.id, isEvaluating, isListening]);

  useEffect(() => {
    mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = isMicEnabled;
    });

    if (!isMicEnabled) {
      pauseListening();
      return;
    }

    if (
      !isSpeaking &&
      !currentEvaluation &&
      !isEvaluating &&
      !isGeneratingQuestion &&
      !submittedQuestionRef.current
    ) {
      startListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMicEnabled, mediaStream]);

  useEffect(() => {
    mediaStream.getVideoTracks().forEach((track) => {
      track.enabled = isCameraEnabled;
    });
  }, [isCameraEnabled, mediaStream]);

  const toggleMic = () => {
    setIsMicEnabled((previous) => !previous);
  };

  const toggleCamera = () => {
    setIsCameraEnabled((previous) => !previous);
  };

  const liveTranscript = `${transcript} ${interimTranscript}`.trim();
  const progressText = `${session.currentQuestionIndex + 1}/${session.questions.length}`;
  const lowQuestionTime = questionRemaining <= (pressureMode ? 12 : 18);
  const hasSubmittedCurrentQuestion = submittedQuestionRef.current === currentQuestion.id;
  const isLastQuestion = session.currentQuestionIndex >= session.questions.length - 1;
  const canSubmit =
    !isSpeaking &&
    !isEvaluating &&
    !isGeneratingQuestion &&
    !currentEvaluation &&
    !hasSubmittedCurrentQuestion;
  const nextButtonLabel = isLastQuestion ? "Submit Interview" : "Next Question";

  return (
    <div className="w-full max-w-full space-y-5 overflow-x-hidden">
      <section className="relative w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-3 shadow-[0_24px_80px_rgba(2,6,23,0.26)] sm:p-4">
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
          <AIAgent
            question={currentQuestion.question}
            topic={currentQuestion.topic}
            isSpeaking={isSpeaking}
            isListening={isListening}
            isEvaluating={isEvaluating}
            subtitle={subtitle}
          />

          <UserCamera
            stream={mediaStream}
            isListening={isListening}
            isCameraEnabled={isCameraEnabled}
            transcript={liveTranscript}
            onCameraLost={onCameraLost}
            onEyeContactSample={(score) => {
              eyeContactSamplesRef.current.push(score);
            }}
          />
        </div>

        <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="section-label">Interview Timer</div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {formatTime(globalRemaining)}
                </div>
              </div>
              <Clock3 className="h-5 w-5 text-primary" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
            <div className="section-label">Progress</div>
            <div className="mt-2 flex min-w-0 flex-wrap items-end justify-between gap-3">
              <div className="text-2xl font-semibold text-white">{progressText}</div>
              <Badge
                variant="secondary"
                className={
                  pressureMode
                    ? "border-amber-300/25 bg-amber-300/10 text-amber-200"
                    : undefined
                }
              >
                {pressureMode ? "Pressure" : "Standard"}
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
            <div className="section-label">Question Timer</div>
            <div
              className={
                lowQuestionTime
                  ? "mt-2 text-2xl font-semibold text-amber-200"
                  : "mt-2 text-2xl font-semibold text-white"
              }
            >
              {formatTime(questionRemaining)}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="section-label">Room Status</div>
                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-white">
                  {isEvaluating ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : isListening ? (
                    <CircleStop className="h-4 w-4 text-emerald-300" />
                  ) : (
                    <Video className="h-4 w-4 text-primary" />
                  )}
                  {isSpeaking
                    ? "Interviewer speaking"
                    : isEvaluating
                      ? "Scoring response"
                      : isGeneratingQuestion
                        ? "Preparing next question"
                      : isListening
                        ? isMicEnabled
                          ? "Listening..."
                          : "Mic off"
                        : networkDelay
                          ? "Network delay"
                          : "Preparing"}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant={isMicEnabled ? "secondary" : "outline"}
                  size="icon"
                  onClick={toggleMic}
                  disabled={isEvaluating || isSpeaking || Boolean(currentEvaluation)}
                  title={isMicEnabled ? "Turn microphone off" : "Turn microphone on"}
                >
                  {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant={isCameraEnabled ? "secondary" : "outline"}
                  size="icon"
                  onClick={toggleCamera}
                  title={isCameraEnabled ? "Turn camera off" : "Turn camera on"}
                >
                  {isCameraEnabled ? (
                    <Camera className="h-4 w-4" />
                  ) : (
                    <CameraOff className="h-4 w-4" />
                  )}
                </Button>
                <Button type="button" variant="accent" size="icon" onClick={onEndInterview} title="End interview">
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <VoiceWaveform
              active={isListening || isSpeaking}
              tone={isListening ? "emerald" : "cyan"}
              bars={14}
              className="mt-3 justify-start"
            />
            <div className="mt-4 flex min-w-0 flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={() => void finishAnswer(false)}
                disabled={!canSubmit}
                className="flex-1"
              >
                {isEvaluating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CircleStop className="h-4 w-4" />
                )}
                Submit Answer
              </Button>
              <Button
                type="button"
                onClick={onContinue}
                disabled={!currentEvaluation || isEvaluating || isGeneratingQuestion}
                className="flex-1"
              >
                {isGeneratingQuestion ? "Preparing..." : nextButtonLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-3">
          <Badge variant="secondary" className="border-white/10 bg-slate-950/55 text-slate-200">
            Auto-submit after silence
          </Badge>
          {!speechSupported ? (
            <div className="flex items-start gap-2 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">
              <MicOff className="mt-0.5 h-4 w-4" />
              Speech recognition is unavailable in this browser.
            </div>
          ) : null}
          {evaluationError ? (
            <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">
              {evaluationError}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
