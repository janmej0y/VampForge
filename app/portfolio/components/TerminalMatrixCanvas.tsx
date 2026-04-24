"use client";

import { useEffect, useRef } from "react";

export function TerminalMatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const glyphs = "01{}[]<>/run build deploy";
    let drops: number[] = [];
    let frameId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = Array.from(
        { length: Math.ceil(window.innerWidth / 18) },
        () => Math.random() * (window.innerHeight / 18)
      );
    };

    const draw = () => {
      context.fillStyle = "rgba(2,7,10,0.13)";
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      context.fillStyle = "rgba(110,231,183,0.68)";
      context.font = "13px Consolas, monospace";

      drops.forEach((drop, index) => {
        const text = glyphs[Math.floor(Math.random() * glyphs.length)];
        context.fillText(text, index * 18, drop * 18);

        if (drop * 18 > window.innerHeight && Math.random() > 0.975) {
          drops[index] = 0;
        }

        drops[index] += 1;
      });

      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />;
}
