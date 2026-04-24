"use client";

import { motion } from "framer-motion";
import { Radio, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VoiceWaveform } from "./VoiceWaveform";

type AIAgentProps = {
  question: string;
  topic: string;
  isSpeaking: boolean;
  isListening: boolean;
  isEvaluating: boolean;
  subtitle: string;
};

export function AIAgent({
  question,
  topic,
  isSpeaking,
  isListening,
  isEvaluating,
  subtitle,
}: AIAgentProps) {
  return (
    <div className="relative flex min-h-[360px] w-full max-w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(6,12,24,0.96),rgba(11,20,36,0.84))] p-5 shadow-[0_24px_80px_rgba(2,6,23,0.35)] md:min-h-[460px] md:p-6 xl:min-h-[520px]">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.55),transparent)]" />
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <Badge variant="secondary" className="gap-2 border-white/10 bg-white/5 text-slate-200">
          <Radio className="h-3.5 w-3.5 text-primary" />
          Maya Chen
        </Badge>
        <span className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          {topic}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
        <motion.div
          className="relative flex h-44 w-44 items-center justify-center rounded-full border border-primary/25 bg-[radial-gradient(circle_at_35%_20%,rgba(248,251,255,0.95),rgba(185,243,255,0.88)_38%,rgba(34,211,238,0.24)_70%,rgba(8,15,30,0.84))]"
          animate={
            isSpeaking
              ? {
                  boxShadow: [
                    "0 0 0 0 rgba(34,211,238,0.25)",
                    "0 0 0 24px rgba(34,211,238,0)",
                  ],
                }
              : {}
          }
          transition={{ duration: 1.1, repeat: isSpeaking ? Infinity : 0 }}
        >
          <motion.div
            className="absolute inset-4 rounded-full border border-amber-200/20"
            animate={isSpeaking ? { scale: [1, 1.1, 1], opacity: [0.55, 1, 0.55] } : {}}
            transition={{ duration: 1, repeat: isSpeaking ? Infinity : 0 }}
          />
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border border-white/20 bg-slate-950/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <UserRound className="h-10 w-10 text-cyan-100" />
            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/80">
              Senior
            </div>
          </div>
        </motion.div>

        <VoiceWaveform active={isSpeaking} className="mt-6" />

        <div className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100/80">
          {isSpeaking
            ? "Speaking"
            : isEvaluating
              ? "Evaluating answer"
              : isListening
                ? "Waiting for response"
              : "Preparing next question"}
        </div>
        <div className="mt-2 text-sm text-slate-400">AI Senior Interviewer</div>
      </div>

      <motion.div
        key={question}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-slate-950/58 p-4 shadow-[0_16px_50px_rgba(2,6,23,0.22)] backdrop-blur-xl"
      >
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Live question
        </div>
        <p className="mt-2 break-words text-lg leading-8 text-white">{subtitle || question}</p>
      </motion.div>
    </div>
  );
}
