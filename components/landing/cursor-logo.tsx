"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { BrandMark } from "@/components/brand";

export function CursorLogo() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 18 });

  return (
    <motion.div
      ref={ref}
      className="inline-flex"
      style={reduceMotion ? undefined : { rotateX: springX, rotateY: springY, transformPerspective: 700 }}
      onMouseMove={(event) => {
        if (reduceMotion || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        rotateX.set(y * -18);
        rotateY.set(x * 18);
      }}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      <BrandMark className="h-16 w-16 rounded-2xl bg-[linear-gradient(135deg,#60a5fa,#3b82f6_48%,#991b1b)] text-base shadow-[0_0_56px_rgba(96,165,250,0.32)]" />
    </motion.div>
  );
}
