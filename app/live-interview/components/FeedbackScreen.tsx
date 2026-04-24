"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CircleAlert,
  Mic,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type AnswerRecord,
  type InterviewHistoryEntry,
  type InterviewSessionState,
  type InterviewSummary,
} from "./types";

type FeedbackScreenProps = {
  session: InterviewSessionState;
  answers: AnswerRecord[];
  summary: InterviewSummary;
  history: InterviewHistoryEntry[];
  onRestart: () => void;
  onStartAnother: () => void;
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function FeedbackScreen({
  session,
  answers,
  summary,
  history,
  onRestart,
  onStartAnother,
}: FeedbackScreenProps) {
  const previousAttempt = history[1];
  const scoreDelta = previousAttempt
    ? Number((summary.overallScore - previousAttempt.overallScore).toFixed(1))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <section className="section-card mesh-card premium-ring overflow-hidden border-primary/15 p-6 sm:p-8">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
              Live Interview Report
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                {summary.performanceLevel} interview performance
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                {session.setup.role} • {session.setup.difficulty} • {session.setup.interviewType} •{" "}
                {session.setup.duration} min session
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm text-slate-400">Overall Score</div>
              <div className="mt-2 text-3xl font-semibold text-white">{summary.overallScore}/10</div>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm text-slate-400">Communication</div>
              <div className="mt-2 text-3xl font-semibold text-white">
                {summary.communicationScore}/10
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm text-slate-400">Technical</div>
              <div className="mt-2 text-3xl font-semibold text-white">
                {summary.technicalScore}/10
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="text-sm text-slate-400">Confidence</div>
              <div className="mt-2 text-3xl font-semibold text-white">
                {summary.confidenceScore}/10
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-white/[0.045]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.strengths.map((strength) => (
              <div
                key={strength}
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300"
              >
                {strength}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CircleAlert className="h-5 w-5 text-amber-300" />
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.weaknesses.map((weakness) => (
              <div
                key={weakness}
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300"
              >
                {weakness}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-emerald-300" />
              Suggested Improvements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.suggestedImprovements.map((improvement) => (
              <div
                key={improvement}
                className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300"
              >
                {improvement}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid w-full max-w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bg-white/[0.045]">
          <CardHeader>
            <CardTitle className="text-white">Per-question breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {answers.map((answer, index) => (
              <div
                key={`${answer.questionId}-${index}`}
                className="rounded-[1.5rem] border border-white/10 bg-slate-950/38 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Q{index + 1}. {answer.topic}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                      {answer.type} {answer.isFollowUp ? "• follow-up" : ""}
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {answer.evaluation.score}/10
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {answer.evaluation.feedback}
                </p>
                {answer.evaluation.companyFeedback ? (
                  <p className="mt-2 rounded-xl border border-primary/15 bg-primary/10 px-3 py-2 text-sm leading-6 text-cyan-50">
                    {answer.evaluation.companyFeedback}
                  </p>
                ) : null}
                {answer.speechMetrics ? (
                  <div className="mt-4 grid gap-2 sm:grid-cols-4">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Confidence
                      </div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        {answer.speechMetrics.confidenceScore}/10
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Pace
                      </div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        {answer.speechMetrics.averageWordsPerMinute} wpm
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Fillers
                      </div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        {answer.speechMetrics.fillerWordCount}
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Eye contact
                      </div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        {answer.speechMetrics.eyeContactScore?.toFixed(1) ?? "--"}/10
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white/[0.045]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Missed Concepts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.missedConcepts.length ? (
                summary.missedConcepts.map((concept) => (
                  <div
                    key={concept}
                    className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300"
                  >
                    {concept}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300">
                  No major concept gaps were detected in this run.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/[0.045]">
            <CardHeader>
              <CardTitle className="text-white">Interview History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {history.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {item.role} • {item.interviewType}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {formatTimestamp(item.completedAt)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {item.overallScore}/10
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/[0.045]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Mic className="h-5 w-5 text-emerald-300" />
                Voice Coaching
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300">
                Total filler words detected: {summary.fillerWordCount}
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300">
                {summary.confidenceScore >= 7
                  ? "Speech flow was steady under interview pressure."
                  : "Reduce long pauses and filler words to sound more confident."}
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-300">
                {scoreDelta === null
                  ? "This is your first saved video interview benchmark."
                  : scoreDelta > 0
                    ? `Score improved by ${scoreDelta} points from the previous attempt.`
                    : `Score changed by ${scoreDelta} points from the previous attempt.`}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" onClick={onRestart} className="w-full sm:w-auto">
              <RotateCcw className="h-4 w-4" />
              Retry Same Setup
            </Button>
            <Button onClick={onStartAnother} className="w-full sm:w-auto">
              Start Another Interview
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
