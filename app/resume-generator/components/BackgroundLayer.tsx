"use client";

import { getResumeBackgroundStyles, rgbToCss } from "./resume-backgrounds";
import { type ResumeData } from "./types";

type BackgroundLayerProps = {
  data: ResumeData;
};

export function BackgroundLayer({ data }: BackgroundLayerProps) {
  if (!data.backgroundEnabled) {
    return null;
  }

  const { palette, wash, accent, line, frame, band } = getResumeBackgroundStyles(data);
  const paperColor = rgbToCss(palette.paper);
  const washColor = rgbToCss(wash, 0.9);
  const accentColor = rgbToCss(accent, 0.9);
  const lineColor = rgbToCss(line, 0.95);
  const frameColor = rgbToCss(frame, 0.85);
  const bandColor = rgbToCss(band, 0.9);

  if (data.template === "modern") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${washColor} 0%, ${paperColor} 54%, ${rgbToCss(
              palette.paper,
              1
            )} 100%)`,
          }}
        />
        <div className="absolute inset-y-0 left-0 w-[6px]" style={{ backgroundColor: frameColor }} />
        <div
          className="absolute left-10 top-0 h-52 w-72"
          style={{
            background: `radial-gradient(circle at top left, ${accentColor} 0%, transparent 72%)`,
          }}
        />
        <div className="absolute inset-x-10 top-[168px] h-px" style={{ backgroundColor: lineColor }} />
        <div className="absolute inset-x-10 bottom-[92px] h-px" style={{ backgroundColor: rgbToCss(line, 0.72) }} />
      </div>
    );
  }

  if (data.template === "minimal") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-x-10 top-8 h-px" style={{ backgroundColor: lineColor }} />
        <div className="absolute inset-x-10 top-[166px] h-px" style={{ backgroundColor: rgbToCss(line, 0.75) }} />
        <div className="absolute inset-x-10 bottom-8 h-px" style={{ backgroundColor: lineColor }} />
      </div>
    );
  }

  if (data.template === "professional") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: paperColor }} />
        <div
          className="absolute inset-x-8 top-8 h-28 rounded-[1.75rem] border"
          style={{
            borderColor: frameColor,
            backgroundColor: rgbToCss(wash, 0.46),
          }}
        />
        <div
          className="absolute inset-x-8 top-[172px] bottom-8 rounded-[2rem] border"
          style={{
            borderColor: rgbToCss(line, 0.8),
            backgroundColor: rgbToCss(palette.paper, 0.82),
          }}
        />
        <div className="absolute inset-x-12 top-[228px] h-px" style={{ backgroundColor: lineColor }} />
        <div className="absolute inset-x-12 top-[494px] h-px" style={{ backgroundColor: rgbToCss(line, 0.72) }} />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      <div
        className="absolute inset-x-0 top-0 h-36"
        style={{
          background: `linear-gradient(135deg, ${bandColor} 0%, ${washColor} 38%, ${paperColor} 100%)`,
        }}
      />
      <div
        className="absolute -right-14 top-10 h-48 w-48 rounded-full"
        style={{ backgroundColor: rgbToCss(accent, 0.22) }}
      />
      <div
        className="absolute -right-6 top-20 h-28 w-28 rounded-full border"
        style={{ borderColor: rgbToCss(frame, 0.38) }}
      />
      <div className="absolute inset-x-12 top-[170px] h-px" style={{ backgroundColor: lineColor }} />
    </div>
  );
}
