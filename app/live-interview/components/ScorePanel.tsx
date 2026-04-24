"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, CheckCircle2, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type AnswerRecord, type InterviewQuestionInstance } from "./types";

type ScorePanelProps = {
  currentQuestion: InterviewQuestionInstance;
  currentIndex: number;
  totalQuestions: number;
  answers: AnswerRecord[];
  strictMode: boolean;
};

export function ScorePanel({
  currentQuestion,
  currentIndex,
  totalQuestions,
  answers,
  strictMode,
}: ScorePanelProps) {
  const liveScore = answers.length
    ? Number(
        (
          answers.reduce((sum, answer) => sum + answer.evaluation.score, 0) / answers.length
        ).toFixed(1)
      )
    : 0;

  const progress = Math.round((currentIndex / Math.max(totalQuestions, 1)) * 100);
  const lastAnswer = answers.at(-1);

  return (
    <div className="space-y-4">
      <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.88),rgba(10,18,35,0.72))] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-label">Progress</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
              {currentIndex + 1}/{totalQuestions}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <Target className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 0.35 }}
            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.95),rgba(251,191,36,0.82))]"
          />
        </div>
        <p className="mt-3 text-sm text-slate-400">
          Current topic: <span className="text-slate-200">{currentQuestion.topic}</span>
        </p>
      </div>

      <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.88),rgba(10,18,35,0.72))] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-label">Live Score</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
              {answers.length ? `${liveScore}/10` : "--"}
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
            <BarChart3 className="h-5 w-5 text-cyan-300" />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="border-white/10 bg-white/5 text-slate-200">
            {answers.length} evaluated
          </Badge>
          <Badge variant="secondary" className="border-white/10 bg-white/5 text-slate-200">
            {strictMode ? "Skipping disabled" : "Skipping allowed"}
          </Badge>
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.88),rgba(10,18,35,0.72))] p-5">
        <div className="flex items-center justify-between">
          <p className="section-label">Recent Evaluation</p>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
            <Activity className="h-5 w-5 text-emerald-300" />
          </div>
        </div>

        {lastAnswer ? (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">{lastAnswer.topic}</p>
                <p className="text-xs text-slate-400">{lastAnswer.type}</p>
              </div>
              <div className="text-lg font-semibold text-white">
                {lastAnswer.evaluation.score}/10
              </div>
            </div>

            <div className="space-y-2">
              {lastAnswer.evaluation.strengths.slice(0, 2).map((strength) => (
                <div
                  key={strength}
                  className="flex items-start gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-3 text-sm text-slate-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Submit the first answer to unlock live evaluation, scoring, and follow-up depth checks.
          </p>
        )}
      </div>
    </div>
  );
}
