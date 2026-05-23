"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LOADER_DURATION = 5000;

export function SpiderLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), LOADER_DURATION);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="spider-loader" aria-label="Loading VampForge" role="status">
      <div className="spider-loader__moon" aria-hidden="true" />

      <div className="spider-loader__speed-lines" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            style={{ "--line": index } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="spider-loader__skyline spider-loader__skyline--back" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} style={{ "--tower": index } as React.CSSProperties} />
        ))}
      </div>

      <div className="spider-loader__skyline spider-loader__skyline--front" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} style={{ "--tower": index } as React.CSSProperties} />
        ))}
      </div>

      <div className="spider-loader__anchor spider-loader__anchor--one" aria-hidden="true" />
      <div className="spider-loader__anchor spider-loader__anchor--two" aria-hidden="true" />
      <div className="spider-loader__anchor spider-loader__anchor--three" aria-hidden="true" />

      <svg className="spider-loader__vf-web" viewBox="0 0 220 120" aria-hidden="true">
        <path className="spider-loader__vf-line spider-loader__vf-line--v" d="M18 18 L52 102 L88 18" />
        <path className="spider-loader__vf-line spider-loader__vf-line--f" d="M118 18 L118 102 M118 20 H194 M118 58 H178" />
        <path className="spider-loader__vf-thread" d="M18 18 C76 8 139 8 194 20 M52 102 C94 78 132 70 178 58" />
      </svg>

      <div className="spider-loader__web spider-loader__web--one" aria-hidden="true" />
      <div className="spider-loader__web spider-loader__web--two" aria-hidden="true" />
      <div className="spider-loader__web spider-loader__web--three" aria-hidden="true" />
      <div className="spider-loader__web spider-loader__web--four" aria-hidden="true" />

      <div className="spider-loader__impact spider-loader__impact--one" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} style={{ "--spark": index } as React.CSSProperties} />
        ))}
      </div>
      <div className="spider-loader__impact spider-loader__impact--two" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} style={{ "--spark": index } as React.CSSProperties} />
        ))}
      </div>

      <div className="spider-loader__trail" aria-hidden="true" />

      <div className="spider-loader__hero" aria-hidden="true">
        <svg viewBox="0 0 140 140" className="spider-loader__figure">
          <defs>
            <linearGradient id="spiderSuitRed" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff3b3b" />
              <stop offset="58%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#5b0f16" />
            </linearGradient>
            <linearGradient id="spiderSuitBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="62%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
            <filter id="spiderGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="12" stdDeviation="7" floodColor="#0f172a" floodOpacity="0.45" />
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#38bdf8" floodOpacity="0.55" />
            </filter>
          </defs>

          <g filter="url(#spiderGlow)" strokeLinecap="round" strokeLinejoin="round">
            <g className="spider-loader__limb spider-loader__limb--leg-left">
              <path d="M67 68 C42 70 28 86 23 109" fill="none" stroke="#111827" strokeWidth="9" />
              <path d="M62 78 C48 92 39 104 30 124" fill="none" stroke="#1d4ed8" strokeWidth="8" />
            </g>
            <g className="spider-loader__limb spider-loader__limb--leg-right">
              <path d="M76 68 C103 73 120 88 125 113" fill="none" stroke="#111827" strokeWidth="9" />
              <path d="M84 78 C98 92 109 105 119 124" fill="none" stroke="#1d4ed8" strokeWidth="8" />
            </g>
            <g className="spider-loader__limb spider-loader__limb--arm-left">
              <path d="M54 55 C35 47 22 35 13 18" fill="none" stroke="#111827" strokeWidth="10" />
              <path d="M54 55 C35 47 22 35 13 18" fill="none" stroke="#b91c1c" strokeWidth="8" />
            </g>
            <g className="spider-loader__limb spider-loader__limb--arm-right">
              <path d="M86 55 C105 45 119 31 128 12" fill="none" stroke="#111827" strokeWidth="10" />
              <path d="M86 55 C105 45 119 31 128 12" fill="none" stroke="#b91c1c" strokeWidth="8" />
            </g>
            <g className="spider-loader__torso">
              <path
                d="M45 50 C48 31 58 18 73 17 C90 18 99 34 98 52 C97 70 86 88 72 88 C57 88 43 70 45 50Z"
                fill="url(#spiderSuitRed)"
                stroke="#111827"
                strokeWidth="4"
              />
              <path
                d="M52 77 C61 87 83 87 92 77 C95 96 92 119 73 123 C54 119 49 97 52 77Z"
                fill="url(#spiderSuitBlue)"
                stroke="#111827"
                strokeWidth="4"
              />
              <path
                d="M51 45 C59 35 66 30 73 29 C81 30 89 35 96 45"
                fill="none"
                stroke="#111827"
                strokeWidth="2"
                opacity="0.55"
              />
              <path d="M72 20 L72 86" stroke="#111827" strokeWidth="2" opacity="0.55" />
              <path d="M49 57 L96 57" stroke="#111827" strokeWidth="2" opacity="0.45" />
              <path
                className="spider-loader__eye spider-loader__eye--left"
                d="M58 48 C62 40 69 39 71 47 C66 55 60 55 58 48Z"
                fill="#f8fafc"
                stroke="#111827"
                strokeWidth="2"
              />
              <path
                className="spider-loader__eye spider-loader__eye--right"
                d="M86 48 C82 40 75 39 73 47 C78 55 84 55 86 48Z"
                fill="#f8fafc"
                stroke="#111827"
                strokeWidth="2"
              />
              <path
                d="M61 101 C66 106 78 106 84 101"
                fill="none"
                stroke="#dbeafe"
                strokeWidth="2"
                opacity="0.75"
              />
            </g>
          </g>
        </svg>
      </div>

      <div className="spider-loader__panel">
        <div className="spider-loader__mark">VF</div>
        <div>
          <div className="spider-loader__title">VampForge is swinging in</div>
          <div className="spider-loader__bar">
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}
