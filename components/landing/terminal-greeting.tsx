"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Terminal } from "lucide-react";

const lines = [
  "boot vampforge.kernel --cinematic",
  "auth session: developer",
  "scan portfolio_signal --depth recruiter",
  "resume.a4.render() => ready",
  "welcome, future builder",
];

export function TerminalGreeting() {
  const reduceMotion = useReducedMotion();
  const [typed, setTyped] = useState(reduceMotion ? lines.join("\n") : "");
  const script = useMemo(() => lines.join("\n"), []);

  useEffect(() => {
    if (reduceMotion) {
      setTyped(script);
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(script.slice(0, index));

      if (index >= script.length) {
        window.clearInterval(timer);
      }
    }, 22);

    return () => window.clearInterval(timer);
  }, [reduceMotion, script]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 p-4 font-mono text-xs shadow-[0_24px_90px_rgba(2,8,23,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
      initial={reduceMotion ? false : { opacity: 0, y: 18, rotateX: 7 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.55, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(96,165,250,0.75),transparent)]" />
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="h-4 w-4 text-blue-200" />
          forge-terminal
        </div>
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
      </div>
      <pre className="min-h-[7.5rem] whitespace-pre-wrap leading-6 text-slate-300">
        <span className="text-blue-300">vf@lab</span>
        <span className="text-slate-500">:~$ </span>
        {typed}
        {!reduceMotion ? <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-blue-200" /> : null}
      </pre>
    </motion.div>
  );
}
