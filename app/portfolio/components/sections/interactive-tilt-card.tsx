"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

type InteractiveTiltCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function InteractiveTiltCard({
  children,
  className,
}: InteractiveTiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 140, damping: 18 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.16), transparent 38%)`;

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    const relativeX = event.clientX - bounds.left;
    const relativeY = event.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    rotateX.set(((relativeY - centerY) / centerY) * -5);
    rotateY.set(((relativeX - centerX) / centerX) * 5);
    glowX.set((relativeX / bounds.width) * 100);
    glowY.set((relativeY / bounds.height) * 100);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 rounded-[inherit] opacity-70"
        style={{ background: glow }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}
