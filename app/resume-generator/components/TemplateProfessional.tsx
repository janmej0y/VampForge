"use client";

import { ResumeContainer } from "./ResumeContainer";
import { type ResumeData } from "./types";

type TemplateProfessionalProps = {
  data: ResumeData;
  className?: string;
  children: React.ReactNode;
};

export function TemplateProfessional({
  data,
  className,
  children,
}: TemplateProfessionalProps) {
  return <ResumeContainer data={data} className={className}>{children}</ResumeContainer>;
}
