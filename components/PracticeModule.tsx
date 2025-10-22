
import React, { useState } from 'react';
import { LEVELS, PRACTICE_LANGUAGES } from '../constants';
import type { Level, PracticeLanguage, Question } from '../types';
import QuestionCard from './QuestionCard';

interface PracticeModuleProps {
  onGenerate: (level: Level, language: PracticeLanguage) => void;
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  onCorrectAnswer: (questionId: string) => void;
}

const PracticeModule: React.FC<PracticeModuleProps> = ({ onGenerate, questions, isLoading, error, onCorrectAnswer }) => {
  const [selectedLevel, setSelectedLevel] = useState<Level>('Beginner');
  const [selectedLanguage, setSelectedLanguage] = useState<PracticeLanguage>('Python');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(selectedLevel, selectedLanguage);
  };

  return (
    <section>
      <h2 className="text-4xl font-bold text-center mb-8 text-slate-100">Practice Zone</h2>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-slate-800/50 p-6 rounded-lg border-2 border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="level-select" className="block text-sm font-medium text-slate-300 mb-2">Select Level</label>
            <select
              id="level-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as Level)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            >
              {LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="language-select" className="block text-sm font-medium text-slate-300 mb-2">Select Language</label>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as PracticeLanguage)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            >
              {PRACTICE_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : 'Generate Questions'}
        </button>
      </form>

      <div className="mt-12 max-w-4xl mx-auto">
        {error && <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md text-center">{error}</div>}
        
        {questions.length > 0 && (
          <div className="space-y-6">
            {questions.map((q, index) => <QuestionCard key={q.id} question={q} index={index + 1} onCorrectAnswer={onCorrectAnswer} language={selectedLanguage} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default PracticeModule;