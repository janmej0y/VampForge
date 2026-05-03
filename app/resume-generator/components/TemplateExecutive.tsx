"use client";

import { ResumeContainer } from "./ResumeContainer";
import { type ResumeData } from "./types";

type TemplateExecutiveProps = {
  data: ResumeData;
  className?: string;
  children: React.ReactNode;
};

export function TemplateExecutive({ data, className, children }: TemplateExecutiveProps) {
  return <ResumeContainer data={data} className={className}>{children}</ResumeContainer>;
}
