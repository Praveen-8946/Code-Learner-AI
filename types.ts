// Fix: Import React to provide the JSX namespace.
import React from 'react';

export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export type QuestionType = 'mcq' | 'code';

export interface LearningModule {
  name: string;
  icon: JSX.Element;
}

export type PracticeLanguage = 'C' | 'Python' | 'Java' | 'C#' | 'JavaScript';

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface CodeValidationResult {
  isCorrect: boolean;
  feedback: string;
}
