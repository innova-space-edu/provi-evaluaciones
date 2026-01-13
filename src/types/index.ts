export type UserRole = "teacher" | "student" | "utp" | "admin";

export type Question =
  | {
      id: string;
      type: "mcq";
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation?: string;
      points: number;
    }
  | {
      id: string;
      type: "truefalse";
      prompt: string;
      correct: boolean;
      explanation?: string;
      points: number;
    }
  | {
      id: string;
      type: "short";
      prompt: string;
      correctAnswers: string[]; // normalizadas
      explanation?: string;
      points: number;
    };

export type Assessment = {
  id: string;
  title: string;
  createdByUid: string;
  createdAt: number;
  durationMinutes: number;
  maxAttempts: number;
  publishAt?: number;
  isPublished: boolean;

  // lista subida por docente (CSV) -> normalized emails
  rosterEmails: string[];

  questions: Question[];
};

export type Attempt = {
  id: string;
  assessmentId: string;
  studentUid: string;
  studentEmail: string;
  startedAt: number;
  submittedAt?: number;
  answers: Record<string, any>; // por questionId
  score?: number;
  maxScore?: number;
  grade?: number;
  wrong: Array<{
    questionId: string;
    prompt: string;
    studentAnswer: any;
    correctAnswer: any;
    explanation?: string;
  }>;
};
