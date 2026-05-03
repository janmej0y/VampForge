"use client";

import { ResumeContainer } from "./ResumeContainer";
import { type ResumeData } from "./types";

type TemplateMinimalProps = {
  data: ResumeData;
  className?: string;
  children: React.ReactNode;
};

export function TemplateMinimal({ data, className, children }: TemplateMinimalProps) {
  return <ResumeContainer data={data} className={className}>{children}</ResumeContainer>;
}
