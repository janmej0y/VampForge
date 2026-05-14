"use client";

import { useEffect, useRef, useState } from "react";
import { BrainCircuit, Eye, ScanSearch, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ATSScore } from "./components/ATSScore";
import { ResumeScore } from "./components/ResumeScore";
import { ResumeUpload } from "./components/ResumeUpload";
import { SkillsDetected } from "./components/SkillsDetected";
import { StrengthCard } from "./components/StrengthCard";
import { SuggestionCard } from "./components/SuggestionCard";
import { WeaknessCard } from "./components/WeaknessCard";
import { type AnalysisData, type UploadedResumeFile } from "./components/types";

const mockAnalysisData: AnalysisData = {
  score: 82,
  scoreLabel: "Good",
  scoreSummary: "Strong structure. Add clearer metrics and role targeting.",
  strengths: [
    "Strong technical skills section with modern developer keywords.",
    "Good project descriptions that clearly communicate ownership.",
    "Clear formatting with readable hierarchy and clean structure.",
  ],
  weaknesses: [
    "Missing achievements in experience bullets.",
    "No measurable metrics for impact or scale.",
    "Weak summary that could be more targeted to role fit.",
  ],
  suggestions: [
    "Add quantified achievements for delivery, performance, or user growth.",
    "Improve the summary section to better match target roles.",
    "Add GitHub portfolio or live product links to strengthen credibility.",
  ],
  skills: ["React", "Next.js", "Node.js", "TypeScript", "Tailwind CSS"],
  atsScore: 88,
  keywordMatch: 76,
};

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function getFileFormat(fileName: string): UploadedResumeFile["format"] {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension === "pdf") return "PDF";
  if (extension === "docx") return "DOCX";
  if (extension === "doc") return "DOC";
  return "UNKNOWN";
}

export default function ResumeAnalyzerPage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedResumeFile | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setUploadedFile(null);
      setAnalysisData(null);
      return;
    }

    setUploadedFile({
      name: file.name,
      size: formatFileSize(file.size),
      format: getFileFormat(file.name),
    });
    setAnalysisData(null);
  };

  const handleAnalyze = () => {
    if (!uploadedFile) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsAnalyzing(true);
    setAnalysisData(null);

    timeoutRef.current = setTimeout(() => {
      setAnalysisData(mockAnalysisData);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden">
      <PageHeader
        badge="Resume Analyzer"
        title="Analyze your resume"
        description="Review score, ATS fit, strengths, and gaps."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="gap-2">
              <Eye className="h-3.5 w-3.5" />
              Recruiter View
            </Badge>
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Local Analysis
            </Badge>
          </div>
        }
      />

      <section className="grid w-full max-w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="bg-white/[0.045]">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Supported Uploads</p>
              <p className="mt-2 text-3xl font-semibold text-white">PDF / DOCX</p>
              <p className="mt-1 break-words text-sm text-slate-400">
                Upload a resume.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-primary/20 bg-primary/10 p-4">
              <ScanSearch className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045]">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Analysis Mode</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {isAnalyzing ? "Live" : analysisData ? "Done" : "Idle"}
              </p>
              <p className="mt-1 break-words text-sm text-slate-400">
                Fast review state.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <BrainCircuit className="h-5 w-5 text-cyan-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.045]">
          <CardContent className="flex min-w-0 items-center justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Latest Score</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {analysisData ? `${analysisData.score}/100` : "--/100"}
              </p>
              <p className="mt-1 break-words text-sm text-slate-400">
                Score and ATS data.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <Eye className="h-5 w-5 text-emerald-300" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid w-full max-w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <ResumeUpload
          file={uploadedFile}
          onFileSelect={handleFileSelect}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />

        <div className="min-w-0 space-y-6">
          {isAnalyzing ? (
            <Card className="bg-white/[0.045]">
              <CardContent className="flex min-h-[320px] flex-col items-center justify-center px-6 py-14 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                  <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary/25 border-t-primary" />
                </div>
                <div className="mt-6 text-2xl font-semibold text-white">
                  Analyzing Resume...
                </div>
                <div className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Reading structure and keywords.
                </div>
              </CardContent>
            </Card>
          ) : analysisData ? (
            <>
              <ResumeScore data={analysisData} />

              <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
                <StrengthCard strengths={analysisData.strengths} />
                <WeaknessCard weaknesses={analysisData.weaknesses} />
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
                <SuggestionCard suggestions={analysisData.suggestions} />
                <div className="space-y-6">
                  <SkillsDetected skills={analysisData.skills} />
                  <ATSScore
                    atsScore={analysisData.atsScore}
                    keywordMatch={analysisData.keywordMatch}
                  />
                </div>
              </div>
            </>
          ) : (
            <Card className="bg-white/[0.045]">
              <CardContent className="flex min-h-[320px] flex-col items-center justify-center px-6 py-14 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <ScanSearch className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-6 text-2xl font-semibold text-white">
                  Results Dashboard
                </div>
                <div className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Upload a file to see results.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
