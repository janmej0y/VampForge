export type InterviewRole = "frontend" | "backend" | "fullstack";
export type InterviewDifficulty = "easy" | "medium" | "hard";
export type InterviewType = "technical" | "hr" | "mixed";
export type InterviewMode = "practice" | "company";
export type CompanyInterviewCompany = "google" | "amazon" | "microsoft" | "startup";
export type CompanyInterviewType = "dsa" | "system-design" | "behavioral" | "mixed";
export type QuestionKind =
  | "conceptual"
  | "coding"
  | "scenario"
  | "behavioral";
export type PerformanceLevel = "Beginner" | "Intermediate" | "Advanced";

export type InterviewSetupState = {
  mode?: InterviewMode;
  company?: CompanyInterviewCompany;
  companyInterviewType?: CompanyInterviewType;
  role: InterviewRole;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  duration: 10 | 20 | 30;
  strictMode: boolean;
  voiceMode: boolean;
};

export type InterviewQuestion = {
  id: string;
  role: InterviewRole | "general";
  difficulty: InterviewDifficulty;
  interviewTrack: "technical" | "hr";
  type: QuestionKind;
  topic: string;
  question: string;
  expectedKeywords: string[];
  sampleAnswer: string;
  followUpPrompt?: string;
  estimatedSeconds?: number;
};

export type InterviewQuestionInstance = InterviewQuestion & {
  isFollowUp?: boolean;
  parentId?: string;
};

export type InterviewEvaluation = {
  score: number;
  clarity: number;
  technicalAccuracy: number;
  depth: number;
  keywordCoverage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  feedback: string;
  suggestedImprovement: string;
  strengths: string[];
  weaknesses: string[];
  missedConcepts: string[];
  performanceLevel: PerformanceLevel;
  needsFollowUp: boolean;
  followUpQuestion?: string;
  companyFeedback?: string;
};

export type SpeechMetrics = {
  durationSeconds: number;
  wordCount: number;
  fillerWordCount: number;
  fillerRate: number;
  averageWordsPerMinute: number;
  confidenceScore: number;
  pauseCount: number;
  eyeContactScore?: number;
};

export type AnswerRecord = {
  questionId: string;
  question: string;
  topic: string;
  type: QuestionKind;
  submittedAnswer: string;
  timedOut: boolean;
  isFollowUp: boolean;
  parentId?: string;
  timestamp: string;
  evaluation: InterviewEvaluation;
  speechMetrics?: SpeechMetrics;
  audioRecordingUrl?: string;
};

export type InterviewSessionState = {
  id: string;
  setup: InterviewSetupState;
  questions: InterviewQuestionInstance[];
  currentQuestionIndex: number;
  answers: AnswerRecord[];
  startedAt: string;
  lastUpdatedAt: string;
  questionTimeLimit: number;
  completed: boolean;
};

export type InterviewHistoryEntry = {
  id: string;
  role: InterviewRole;
  difficulty: InterviewDifficulty;
  interviewType: InterviewType;
  duration: number;
  totalQuestions: number;
  answeredQuestions: number;
  overallScore: number;
  performanceLevel: PerformanceLevel;
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements: string[];
  missedConcepts: string[];
  completedAt: string;
  communicationScore?: number;
  technicalScore?: number;
  confidenceScore?: number;
  fillerWordCount?: number;
};

export type InterviewSummary = {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  fillerWordCount: number;
  totalQuestions: number;
  answeredQuestions: number;
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements: string[];
  missedConcepts: string[];
  performanceLevel: PerformanceLevel;
};
