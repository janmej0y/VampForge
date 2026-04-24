"use client";

import { motion } from "framer-motion";
import { type PortfolioData } from "../types";

type FooterSectionProps = {
  data: PortfolioData;
  theme: "dark" | "light";
  onNavigate: (id: string) => void;
};

export function FooterSection({ data, theme, onNavigate }: FooterSectionProps) {
  return (
    <footer className="px-4 pb-10 pt-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45 }}
        className={`rounded-[1.8rem] border px-6 py-6 ${
          theme === "dark"
            ? "border-white/10 bg-white/[0.05]"
            : "border-slate-200 bg-white/90"
        }`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              {data.name || "Your Name"}
            </div>
            <div className={`mt-1 text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
              Designed and developed with care in 2026.
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["home", "projects", "experience", "contact"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onNavigate(item)}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  theme === "dark"
                    ? "bg-white/10 text-slate-200 hover:bg-white/15"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
