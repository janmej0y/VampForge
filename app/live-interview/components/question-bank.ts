import {
  type InterviewDifficulty,
  type InterviewQuestion,
  type InterviewQuestionInstance,
  type InterviewSetupState,
} from "./types";

export const QUESTION_COUNT_BY_DURATION: Record<10 | 20 | 30, number> = {
  10: 4,
  20: 7,
  30: 10,
};

const difficultyFallbackOrder: Record<InterviewDifficulty, InterviewDifficulty[]> = {
  easy: ["easy", "medium", "hard"],
  medium: ["medium", "easy", "hard"],
  hard: ["hard", "medium", "easy"],
};

export const interviewQuestionBank: InterviewQuestion[] = [
  {
    id: "fe-easy-react-state",
    role: "frontend",
    difficulty: "easy",
    interviewTrack: "technical",
    type: "conceptual",
    topic: "React",
    question:
      "Explain the difference between state and props in React, and describe when you would lift state up.",
    expectedKeywords: ["state", "props", "component", "parent", "shared", "re-render"],
    sampleAnswer:
      "State is owned and managed inside a component, while props are inputs passed from a parent. I lift state up when multiple child components need the same source of truth.",
    followUpPrompt:
      "Describe a practical example where lifting state improved consistency across multiple components.",
  },
  {
    id: "fe-easy-css-layout",
    role: "frontend",
    difficulty: "easy",
    interviewTrack: "technical",
    type: "scenario",
    topic: "CSS",
    question:
      "A responsive card grid breaks on tablet widths. How would you debug and fix the layout without rewriting the whole component?",
    expectedKeywords: ["media query", "grid", "flex", "inspect", "breakpoint", "overflow"],
    sampleAnswer:
      "I would inspect the layout in dev tools, identify the breakpoint where the grid breaks, check width and overflow constraints, then adjust grid columns or flex wrapping with targeted media queries.",
    followUpPrompt:
      "What specific CSS properties would you inspect first if the cards overflow horizontally?",
  },
  {
    id: "fe-medium-performance",
    role: "frontend",
    difficulty: "medium",
    interviewTrack: "technical",
    type: "scenario",
    topic: "Performance",
    question:
      "Your React page feels slow after adding several dashboards and charts. Walk through how you would identify and reduce unnecessary renders.",
    expectedKeywords: ["profiling", "re-render", "memoization", "state", "props", "React DevTools"],
    sampleAnswer:
      "I would use React DevTools Profiler to inspect component renders, look for unstable props or broad state updates, split state where needed, and apply memoization only to expensive or frequently re-rendering areas.",
    followUpPrompt:
      "How would you decide whether memoization is actually helping instead of adding complexity?",
  },
  {
    id: "fe-medium-js-event-loop",
    role: "frontend",
    difficulty: "medium",
    interviewTrack: "technical",
    type: "conceptual",
    topic: "JavaScript",
    question:
      "Explain how the JavaScript event loop affects UI responsiveness, especially around promises, timers, and long-running tasks.",
    expectedKeywords: ["event loop", "call stack", "microtask", "macrotask", "promise", "blocking"],
    sampleAnswer:
      "The event loop coordinates the call stack and task queues. Promises run in the microtask queue before timers, and long synchronous work blocks the main thread, delaying UI updates and user input.",
    followUpPrompt:
      "What would you do if a heavy computation keeps freezing the UI thread?",
  },
  {
    id: "fe-hard-design-system",
    role: "frontend",
    difficulty: "hard",
    interviewTrack: "technical",
    type: "scenario",
    topic: "Design Systems",
    question:
      "How would you design a scalable frontend component system for multiple product teams while keeping accessibility and consistency high?",
    expectedKeywords: ["tokens", "accessibility", "documentation", "composition", "governance", "reuse"],
    sampleAnswer:
      "I would define design tokens, build composable primitives, document usage patterns, enforce accessibility checks, and create governance so teams can extend components without fragmenting the system.",
    followUpPrompt:
      "How would you prevent product teams from forking shared components in ways that break consistency?",
  },
  {
    id: "fe-hard-system-design",
    role: "frontend",
    difficulty: "hard",
    interviewTrack: "technical",
    type: "coding",
    topic: "Frontend Architecture",
    question:
      "Design the frontend architecture for a live collaboration editor that supports optimistic UI, presence updates, and offline recovery.",
    expectedKeywords: ["optimistic", "cache", "websocket", "conflict", "offline", "state machine"],
    sampleAnswer:
      "I would separate local editor state from synced collaboration state, use optimistic updates with reconciliation, stream presence over websockets, queue offline actions, and resolve conflicts with server acknowledgements or CRDT-style logic.",
    followUpPrompt:
      "What is the hardest edge case to handle when optimistic edits fail after reconnecting?",
  },
  {
    id: "be-easy-rest-design",
    role: "backend",
    difficulty: "easy",
    interviewTrack: "technical",
    type: "conceptual",
    topic: "API Design",
    question:
      "What makes a REST API endpoint easy for frontend teams to consume and maintain over time?",
    expectedKeywords: ["consistent", "status codes", "validation", "pagination", "naming", "errors"],
    sampleAnswer:
      "A good REST endpoint has consistent naming, clear validation rules, predictable response shapes, useful status codes, and good error handling so frontend teams can integrate without guessing.",
    followUpPrompt:
      "How would you structure validation errors so the frontend can render them cleanly?",
  },
  {
    id: "be-easy-db-index",
    role: "backend",
    difficulty: "easy",
    interviewTrack: "technical",
    type: "conceptual",
    topic: "Databases",
    question:
      "What is a database index, and what tradeoff do you accept when adding more indexes?",
    expectedKeywords: ["index", "query", "read", "write", "storage", "performance"],
    sampleAnswer:
      "Indexes speed up reads by helping the database locate data faster, but they add storage overhead and can slow down writes because the index also has to be updated.",
    followUpPrompt:
      "How would you find out whether a slow query actually needs a new index?",
  },
  {
    id: "be-medium-auth-flow",
    role: "backend",
    difficulty: "medium",
    interviewTrack: "technical",
    type: "scenario",
    topic: "Authentication",
    question:
      "Design an authentication flow for a SaaS product that supports sessions, role-based access, and secure password resets.",
    expectedKeywords: ["session", "token", "hash", "authorization", "expiry", "rate limit"],
    sampleAnswer:
      "I would hash passwords securely, manage session or access tokens with expiry, enforce role-based authorization checks, protect password reset flows with time-limited tokens, and add rate limiting around sensitive endpoints.",
    followUpPrompt:
      "Where do authentication and authorization usually get mixed up in real systems?",
  },
  {
    id: "be-medium-queueing",
    role: "backend",
    difficulty: "medium",
    interviewTrack: "technical",
    type: "scenario",
    topic: "Background Jobs",
    question:
      "A report generation endpoint times out under load. How would you redesign it so users still get a reliable experience?",
    expectedKeywords: ["queue", "worker", "retry", "status", "async", "notification"],
    sampleAnswer:
      "I would move report generation into a background job queue, return an accepted status immediately, track job state, retry failures safely, and notify the user when the report is ready.",
    followUpPrompt:
      "What information should the client receive immediately after the request is accepted?",
  },
  {
    id: "be-hard-distributed-cache",
    role: "backend",
    difficulty: "hard",
    interviewTrack: "technical",
    type: "scenario",
    topic: "Scalability",
    question:
      "How would you introduce caching into a high-traffic API without serving dangerously stale data?",
    expectedKeywords: ["cache invalidation", "ttl", "consistency", "fallback", "redis", "hot keys"],
    sampleAnswer:
      "I would cache carefully around read-heavy paths, define TTL and invalidation rules, monitor hot keys, and keep fallbacks so the system stays correct even when cache entries expire or fail.",
    followUpPrompt:
      "How would you invalidate cached records after a write without creating race conditions?",
  },
  {
    id: "be-hard-system-design",
    role: "backend",
    difficulty: "hard",
    interviewTrack: "technical",
    type: "coding",
    topic: "System Design",
    question:
      "Design the backend for a notification platform that handles email, SMS, retries, templates, and delivery status at scale.",
    expectedKeywords: ["queue", "worker", "idempotency", "provider", "retry", "observability"],
    sampleAnswer:
      "I would separate request intake from delivery workers, keep templates versioned, enforce idempotency for retries, integrate multiple providers, track delivery state, and instrument the system for observability and alerting.",
    followUpPrompt:
      "What would you log and monitor first to catch delivery failures quickly?",
  },
  {
    id: "fs-easy-api-integration",
    role: "fullstack",
    difficulty: "easy",
    interviewTrack: "technical",
    type: "scenario",
    topic: "Full-Stack Collaboration",
    question:
      "How do you keep the frontend and backend aligned when building a feature that requires new API contracts and UI states?",
    expectedKeywords: ["contract", "payload", "loading", "error", "schema", "communication"],
    sampleAnswer:
      "I align on request and response contracts early, define loading and error states, document the payload shape, and use shared schemas or typed contracts to keep frontend and backend in sync.",
    followUpPrompt:
      "What is the quickest way to detect contract drift before it reaches production?",
  },
  {
    id: "fs-easy-debugging",
    role: "fullstack",
    difficulty: "easy",
    interviewTrack: "technical",
    type: "scenario",
    topic: "Debugging",
    question:
      "A form submits successfully in the UI, but the data never appears in the database. How would you debug the issue end to end?",
    expectedKeywords: ["network", "logs", "request", "validation", "database", "trace"],
    sampleAnswer:
      "I would inspect the browser request, confirm the payload, trace logs through the API layer, verify validation and persistence logic, and inspect database writes or transaction failures.",
    followUpPrompt:
      "At which layer would you add instrumentation first to shorten the debugging loop?",
  },
  {
    id: "fs-medium-data-flow",
    role: "fullstack",
    difficulty: "medium",
    interviewTrack: "technical",
    type: "conceptual",
    topic: "Architecture",
    question:
      "Compare server-side rendering, static generation, and client-side rendering for a product dashboard. When would you use each?",
    expectedKeywords: ["SSR", "SSG", "CSR", "performance", "personalized", "cache"],
    sampleAnswer:
      "I would use static generation for mostly stable marketing content, server-side rendering for dynamic or personalized data that needs fresh HTML, and client-side rendering for highly interactive areas once the app is loaded.",
    followUpPrompt:
      "Which rendering strategy would you choose for a personalized analytics overview and why?",
  },
  {
    id: "fs-medium-release-process",
    role: "fullstack",
    difficulty: "medium",
    interviewTrack: "technical",
    type: "scenario",
    topic: "Delivery",
    question:
      "How would you reduce deployment risk for a feature that touches the UI, API, and database schema in one release?",
    expectedKeywords: ["feature flag", "migration", "rollback", "backward compatible", "monitoring", "staging"],
    sampleAnswer:
      "I would stage the rollout with backward-compatible migrations, feature flags, strong monitoring, and a rollback path so the system stays stable even if one layer behaves unexpectedly.",
    followUpPrompt:
      "What makes a migration safe to deploy before the UI changes are enabled?",
  },
  {
    id: "fs-hard-observability",
    role: "fullstack",
    difficulty: "hard",
    interviewTrack: "technical",
    type: "scenario",
    topic: "Observability",
    question:
      "A checkout funnel drops conversion after a new release, but errors are low. How would you investigate the issue across frontend and backend systems?",
    expectedKeywords: ["metrics", "logs", "tracing", "funnel", "release", "correlation"],
    sampleAnswer:
      "I would compare release timing against funnel metrics, inspect traces and logs across services, review frontend performance and validation changes, and correlate each step of the checkout flow to isolate the regression.",
    followUpPrompt:
      "Which signal would help you distinguish a UX regression from a backend slowdown?",
  },
  {
    id: "fs-hard-platform-design",
    role: "fullstack",
    difficulty: "hard",
    interviewTrack: "technical",
    type: "coding",
    topic: "Product Systems",
    question:
      "Design a portfolio platform that lets users edit content live, preview instantly, export HTML, and manage deployments.",
    expectedKeywords: ["state", "preview", "export", "storage", "deployment", "versioning"],
    sampleAnswer:
      "I would separate editor state from generated output, persist drafts safely, support live preview through shared structured data, generate exports from the same source model, and track deployment versions independently.",
    followUpPrompt:
      "How would you keep preview fidelity high across live preview, export, and deployment output?",
  },
  {
    id: "hr-easy-teamwork",
    role: "general",
    difficulty: "easy",
    interviewTrack: "hr",
    type: "behavioral",
    topic: "Collaboration",
    question:
      "Tell me about a time you collaborated with a designer or product manager to improve a feature outcome.",
    expectedKeywords: ["collaboration", "feedback", "communication", "outcome", "iteration", "alignment"],
    sampleAnswer:
      "I shared tradeoffs early, gathered design and product feedback, iterated on the implementation, and aligned on the user outcome instead of just shipping the first version.",
    followUpPrompt:
      "What did you personally change after receiving feedback in that collaboration?",
  },
  {
    id: "hr-easy-prioritization",
    role: "general",
    difficulty: "easy",
    interviewTrack: "hr",
    type: "behavioral",
    topic: "Prioritization",
    question:
      "How do you prioritize tasks when multiple urgent requests arrive at the same time?",
    expectedKeywords: ["impact", "priority", "communication", "stakeholder", "tradeoff", "timeline"],
    sampleAnswer:
      "I look at impact, urgency, and dependencies, then communicate tradeoffs clearly so stakeholders understand what will move first and what may need to wait.",
    followUpPrompt:
      "Can you share a case where you had to say no or delay work to protect a higher-impact priority?",
  },
  {
    id: "hr-medium-conflict",
    role: "general",
    difficulty: "medium",
    interviewTrack: "hr",
    type: "behavioral",
    topic: "Conflict",
    question:
      "Describe a disagreement with a teammate about implementation direction. How did you handle it?",
    expectedKeywords: ["listen", "data", "tradeoff", "respect", "decision", "alignment"],
    sampleAnswer:
      "I listened to the other perspective, clarified tradeoffs with evidence, aligned on the real goal, and worked toward a decision that served the product rather than personal preference.",
    followUpPrompt:
      "What would you do differently if the disagreement stayed unresolved after the first discussion?",
  },
  {
    id: "hr-medium-growth",
    role: "general",
    difficulty: "medium",
    interviewTrack: "hr",
    type: "behavioral",
    topic: "Growth",
    question:
      "What is one piece of feedback that significantly changed how you work as an engineer?",
    expectedKeywords: ["feedback", "growth", "reflection", "improvement", "ownership", "change"],
    sampleAnswer:
      "Strong feedback changed how I communicate tradeoffs and document decisions, which improved collaboration and helped me take clearer ownership of outcomes.",
    followUpPrompt:
      "How did you make sure that feedback led to a lasting behavior change rather than a short-term adjustment?",
  },
  {
    id: "hr-hard-leadership",
    role: "general",
    difficulty: "hard",
    interviewTrack: "hr",
    type: "behavioral",
    topic: "Leadership",
    question:
      "Describe a time you led through ambiguity without formal authority. How did you create momentum?",
    expectedKeywords: ["ownership", "alignment", "clarity", "initiative", "influence", "execution"],
    sampleAnswer:
      "I created clarity around the goal, aligned stakeholders, proposed a practical plan, and kept momentum through steady communication and visible execution even without formal authority.",
    followUpPrompt:
      "How did you keep people aligned when priorities shifted midstream?",
  },
  {
    id: "hr-hard-failure",
    role: "general",
    difficulty: "hard",
    interviewTrack: "hr",
    type: "behavioral",
    topic: "Failure",
    question:
      "Tell me about a project that did not go as planned. What did you learn and what changed afterward?",
    expectedKeywords: ["ownership", "learning", "retrospective", "adjustment", "communication", "process"],
    sampleAnswer:
      "I took ownership, analyzed what failed, communicated the lessons openly, and changed the planning or delivery process so the same issue was less likely to repeat.",
    followUpPrompt:
      "What evidence showed that your process change actually improved the next project?",
  },
  {
    id: "hr-hard-customer-focus",
    role: "general",
    difficulty: "hard",
    interviewTrack: "hr",
    type: "behavioral",
    topic: "Customer Focus",
    question:
      "How do you balance technical quality with speed when a customer issue needs an immediate response?",
    expectedKeywords: ["customer", "tradeoff", "stability", "speed", "communication", "follow-up"],
    sampleAnswer:
      "I stabilize the customer experience first, communicate clearly about tradeoffs, then follow up with a more durable fix so speed does not permanently undermine quality.",
    followUpPrompt:
      "How do you decide whether a temporary workaround is acceptable or too risky?",
  },
];

function matchesTrack(
  question: InterviewQuestion,
  setup: InterviewSetupState
) {
  if (setup.interviewType === "mixed") return true;
  return question.interviewTrack === setup.interviewType;
}

function matchesRole(
  question: InterviewQuestion,
  setup: InterviewSetupState
) {
  if (question.interviewTrack === "hr") {
    return question.role === "general" || question.role === setup.role;
  }

  return question.role === setup.role;
}

function pickQuestionsForTrack(
  setup: InterviewSetupState,
  track: "technical" | "hr",
  desiredCount: number,
  usedIds: Set<string>
) {
  const picked: InterviewQuestion[] = [];

  for (const difficulty of difficultyFallbackOrder[setup.difficulty]) {
    const pool = interviewQuestionBank.filter(
      (question) =>
        !usedIds.has(question.id) &&
        question.interviewTrack === track &&
        question.difficulty === difficulty &&
        matchesRole(question, setup) &&
        matchesTrack(question, setup)
    );

    for (const question of pool) {
      if (picked.length >= desiredCount) {
        break;
      }

      picked.push(question);
      usedIds.add(question.id);
    }

    if (picked.length >= desiredCount) {
      break;
    }
  }

  if (picked.length < desiredCount) {
    const fallbackPool = interviewQuestionBank.filter(
      (question) =>
        !usedIds.has(question.id) &&
        question.interviewTrack === track &&
        matchesRole(question, setup)
    );

    for (const question of fallbackPool) {
      if (picked.length >= desiredCount) {
        break;
      }

      picked.push(question);
      usedIds.add(question.id);
    }
  }

  return picked;
}

function interleaveQuestionGroups(groups: InterviewQuestion[][]) {
  const result: InterviewQuestion[] = [];
  const maxLength = Math.max(...groups.map((group) => group.length), 0);

  for (let index = 0; index < maxLength; index += 1) {
    for (const group of groups) {
      const item = group[index];
      if (item) {
        result.push(item);
      }
    }
  }

  return result;
}

export function buildInterviewQuestions(
  setup: InterviewSetupState
): InterviewQuestionInstance[] {
  const questionTarget = QUESTION_COUNT_BY_DURATION[setup.duration];
  const usedIds = new Set<string>();

  if (setup.interviewType === "technical") {
    return pickQuestionsForTrack(setup, "technical", questionTarget, usedIds);
  }

  if (setup.interviewType === "hr") {
    return pickQuestionsForTrack(setup, "hr", questionTarget, usedIds);
  }

  const technicalCount = Math.max(2, Math.ceil(questionTarget * 0.7));
  const hrCount = Math.max(1, questionTarget - technicalCount);

  const technicalQuestions = pickQuestionsForTrack(
    setup,
    "technical",
    technicalCount,
    usedIds
  );
  const hrQuestions = pickQuestionsForTrack(setup, "hr", hrCount, usedIds);

  return interleaveQuestionGroups([technicalQuestions, hrQuestions]).slice(
    0,
    questionTarget
  );
}

export function getQuestionTimeLimit(
  setup: InterviewSetupState,
  questionCount: number
) {
  const totalSeconds = setup.duration * 60;
  const raw = Math.round(totalSeconds / Math.max(questionCount, 1));
  return Math.min(210, Math.max(75, raw));
}
