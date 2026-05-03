"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        className="mx-auto max-w-6xl overflow-hidden rounded-[2.2rem] p-px"
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="relative overflow-hidden rounded-[calc(2.2rem-1px)] border border-white/10 bg-[#080f1d]/90 px-6 py-14 text-center shadow-[0_34px_110px_rgba(2,6,23,0.34)] backdrop-blur-2xl sm:px-10 sm:py-20">
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(20,184,166,0.16),rgba(79,70,229,0.13),rgba(14,165,233,0.1),rgba(15,23,42,0.08))]"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "220% 220%" }}
          />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.72),transparent)]" />

          <div className="relative mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-cyan-100">
              <Sparkles className="h-4 w-4" />
              Your next career surface starts here
            </div>
            <h2 className="mt-7 text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
              Start Building Your Developer Identity Today
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Build a portfolio, resume, and interview practice flow in one premium workspace, then publish your portfolio code to GitHub and deploy it wherever you want.
            </p>
            <div className="action-cluster mt-9 justify-center">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/live-interview">
                  <BrainCircuit className="h-4 w-4" />
                  Try Live Interview
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
