"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
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
    <div key={pathname} ref={pageRef} className={cn("motion-page min-w-0", className)}>
      {children}
    </div>
  );
}
