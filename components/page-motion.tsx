"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type PageMotionProps = {
  children: React.ReactNode;
  className?: string;
};

const revealSelector = [
  "section",
  "article",
  "form",
  ".mesh-card",
  ".surface-card",
  ".section-card",
  ".premium-card-shell",
  ".glass-panel",
  ".action-bar",
  ".action-cluster",
  "[data-animate-item]",
].join(",");

export function PageMotion({ children, className }: PageMotionProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;

    if (!page || reduceMotion) {
      return;
    }

    const items = Array.from(page.querySelectorAll<HTMLElement>(revealSelector))
      .filter((item) => item !== page)
      .filter((item) => !item.closest("[data-motion-skip]"));

    items.forEach((item, index) => {
      item.dataset.motionItem = "true";
      item.dataset.motionState = "hidden";
      item.style.setProperty("--motion-delay", `${Math.min(index % 8, 7) * 55}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target as HTMLElement;
          target.dataset.motionState = "visible";
          observer.unobserve(target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [pathname, reduceMotion]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        ref={pageRef}
        className={cn("motion-page min-w-0", className)}
        initial={reduceMotion ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
