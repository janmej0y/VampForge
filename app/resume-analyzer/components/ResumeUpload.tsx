"use client";

import { useState } from "react";
import { FileBadge2, FileText, FolderUp, UploadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type UploadedResumeFile } from "./types";

type ResumeUploadProps = {
  file: UploadedResumeFile | null;
  onFileSelect: (file: File | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
};

export function ResumeUpload({
  file,
  onFileSelect,
  onAnalyze,
  isAnalyzing,
}: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    onFileSelect(event.dataTransfer.files?.[0] ?? null);
  };

  return (
    <Card className="bg-white/[0.045]">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white">Resume Upload</CardTitle>
        <CardDescription>
          Drop in a PDF or DOCX to simulate recruiter-grade AI analysis with ATS insights.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        <label
          className={cn(
            "group flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-[1.9rem] border border-dashed px-6 py-10 text-center transition duration-300",
            isDragging
              ? "border-primary/50 bg-primary/10 shadow-[0_24px_70px_rgba(76,92,255,0.16)]"
              : "border-white/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.7),rgba(15,23,42,0.42))] hover:border-primary/35 hover:bg-white/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-primary/20 bg-primary/10 text-primary transition group-hover:scale-105">
            <UploadCloud className="h-7 w-7" />
          </div>
          <div className="mt-5 text-xl font-semibold text-white">
            Drag & Drop Resume Upload
          </div>
          <div className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Supported formats: PDF and DOCX. Upload a resume to generate AI-style strengths, weaknesses, suggestions, and ATS compatibility insights.
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary">PDF</Badge>
            <Badge variant="secondary">DOCX</Badge>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            <FolderUp className="h-4 w-4 text-primary" />
            {file ? "Replace file" : "Choose file"}
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(event) => onFileSelect(event.target.files?.[0] ?? null)}
          />
        </label>

        {file ? (
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_rgba(2,6,23,0.18)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                  <FileText className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{file.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{file.size}</span>
                    <span className="text-white/20">•</span>
                    <span>{file.format}</span>
                  </div>
                </div>
              </div>

              <Badge variant="success" className="gap-2">
                <FileBadge2 className="h-3.5 w-3.5" />
                Ready to analyze
              </Badge>
            </div>
          </div>
        ) : null}

        <div
          className={`rounded-2xl border p-4 ${
            file
              ? "border-emerald-300/20 bg-emerald-300/10"
              : "border-amber-300/20 bg-amber-300/10"
          }`}
        >
          <div className="flex items-start gap-3">
            <FileBadge2
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                file ? "text-emerald-300" : "text-amber-200"
              }`}
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white">
                {file ? "Resume is ready to analyze." : "Upload a resume first."}
              </div>
              {!file ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-slate-950/35 px-3 py-1 text-xs text-amber-100">
                    PDF or DOCX file
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={!file || isAnalyzing}
          onClick={onAnalyze}
        >
          {isAnalyzing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              Analyze Resume
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
