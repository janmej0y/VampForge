"use client";

import { cn } from "@/lib/utils";
import { BackgroundLayer } from "./BackgroundLayer";
import { getResumeBackgroundStyles, rgbToCss } from "./resume-backgrounds";
import { type ResumeData } from "./types";

type ResumeContainerProps = {
  data: ResumeData;
  className?: string;
  children: React.ReactNode;
};

export function ResumeContainer({ data, className, children }: ResumeContainerProps) {
  const { palette } = getResumeBackgroundStyles(data);

  return (
    <div
      className={cn("relative isolate min-h-[980px] overflow-hidden text-slate-900", className)}
      style={{
        backgroundColor: rgbToCss(palette.paper),
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <BackgroundLayer data={data} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
