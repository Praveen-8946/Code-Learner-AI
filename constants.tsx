
import React from 'react';
import type { LearningModule, Level, PracticeLanguage } from './types';
import { CIcon, CSharpIcon, JavaIcon, JavaScriptIcon, KotlinIcon, MySqlIcon, NodeJsIcon, PythonIcon, ReactIcon } from './components/Icons';

export const LEARNING_MODULES: LearningModule[] = [
  { name: 'C', icon: <CIcon /> },
  { name: 'Python', icon: <PythonIcon /> },
  { name: 'Java', icon: <JavaIcon /> },
  { name: 'C#', icon: <CSharpIcon /> },
  { name: 'Kotlin', icon: <KotlinIcon /> },
  { name: 'JavaScript', icon: <JavaScriptIcon /> },
  { name: 'Node.js', icon: <NodeJsIcon /> },
  { name: 'React.js', icon: <ReactIcon /> },
  { name: 'MySQL', icon: <MySqlIcon /> },
];

export const PRACTICE_LANGUAGES: PracticeLanguage[] = ['C', 'Python', 'Java', 'C#', 'JavaScript'];

export const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced'];
