"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, GitBranch, MessagesSquare, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type InterviewQuestionInstance } from "./types";

type QuestionCardProps = {
  question: InterviewQuestionInstance;
  currentIndex: number;
  totalQuestions: number;
};

const iconMap = {
  conceptual: BrainCircuit,
  coding: Workflow,
  scenario: GitBranch,
  behavioral: MessagesSquare,
};

export function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
}: QuestionCardProps) {
  const [visibleText, setVisibleText] = useState("");
  const Icon = iconMap[question.type];

  useEffect(() => {
    setVisibleText("");

    let cursor = 0;
    const interval = window.setInterval(() => {
      cursor += 1;
      setVisibleText(question.question.slice(0, cursor));

      if (cursor >= question.question.length) {
        window.clearInterval(interval);
      }
    }, 12);

    return () => window.clearInterval(interval);
  }, [question.id, question.question]);

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="section-card mesh-card premium-ring h-full border-primary/15 p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Badge variant="secondary" className="gap-2 border-white/10 bg-white/5 text-slate-200">
            <Icon className="h-3.5 w-3.5 text-primary" />
            {question.topic}
          </Badge>
          <div>
            <p className="section-label">Question Panel</p>
            <p className="mt-2 text-sm text-slate-400">
              Question {currentIndex + 1} of {totalQuestions}
              {question.isFollowUp ? " • Follow-up round" : ""}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-3 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
          {question.type}
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <h2 className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-[2rem]">
          {visibleText}
          {visibleText.length < question.question.length ? (
            <span className="ml-1 inline-block h-7 w-[2px] animate-pulse bg-primary align-middle" />
          ) : null}
        </h2>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm font-medium text-white">What strong answers usually include</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {question.expectedKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-xs text-slate-300"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
