// Core data models
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'STUDENT' | 'ADMIN';
  vwoLevel?: string;
  subject: string;
  emailVerified?: string | null; // ISO string or null
  emailVerifyToken?: string;
  createdAt: string; // ISO string
  lastLoginAt: string; // ISO string  
  updatedAt: string; // ISO string
}

export interface Question {
  id: string;
  content: string;
  answer: string;
  points: number;
  tags: string[];
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  year: number;
  examType: 'REGULAR' | 'RESIT';
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentAnswer {
  id: string;
  userId: string;
  questionId: string;
  answerText?: string;
  answerImage?: string;
  answerLatex?: string;
  isCorrect: boolean;
  pointsEarned: number;
  tagScores: Record<string, number>;
  submittedAt: Date;
  evaluatedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  tagScores: Record<string, number>;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  lastUpdated: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  vwoLevel: string;
  subject?: string;
}

// Registration-specific types
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  vwoLevel: string;
}

export interface RegistrationResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  message?: string;
  error?: string;
}

export interface AnswerSubmissionForm {
  questionId: string;
  answerText?: string;
  answerImage?: File;
  answerLatex?: string;
}
