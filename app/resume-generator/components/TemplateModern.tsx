"use client";

import { ResumeContainer } from "./ResumeContainer";
import { type ResumeData } from "./types";

type TemplateModernProps = {
  data: ResumeData;
  className?: string;
  children: React.ReactNode;
};

export function TemplateModern({ data, className, children }: TemplateModernProps) {
  return <ResumeContainer data={data} className={className}>{children}</ResumeContainer>;
}
