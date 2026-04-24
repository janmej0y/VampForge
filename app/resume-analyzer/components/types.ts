export type UploadedResumeFile = {
  name: string;
  size: string;
  format: "PDF" | "DOCX" | "DOC" | "UNKNOWN";
};

export type AnalysisData = {
  score: number;
  scoreLabel: "Poor" | "Average" | "Good" | "Excellent";
  scoreSummary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  skills: string[];
  atsScore: number;
  keywordMatch: number;
};
