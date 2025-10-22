import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import LearningModules from './components/LearningModules';
import PracticeModule from './components/PracticeModule';
import Modal from './components/Modal';
import WelcomeAnimation from './components/WelcomeAnimation';
import { generatePracticeQuestions, generateModuleContent } from './services/geminiService';
import type { Level, PracticeLanguage, Question, LearningModule } from './types';
import { LEARNING_MODULES } from './constants';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for score
  const [score, setScore] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

  // State for learning module modal
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [moduleContent, setModuleContent] = useState<string>('');
  const [isModuleLoading, setIsModuleLoading] = useState<boolean>(false);
  const [moduleError, setModuleError] = useState<string | null>(null);
  
  // State for welcome animation
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000); // Animation lasts 4 seconds total
    return () => clearTimeout(timer);
  }, []);


  const handleGenerateQuestions = useCallback(async (level: Level, language: PracticeLanguage) => {
    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setScore(0);
    setAnsweredQuestions(new Set());
    try {
      const newQuestions = await generatePracticeQuestions(level, language);
      setQuestions(newQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleModuleSelect = useCallback(async (module: LearningModule) => {
    setSelectedModule(module);
    setIsModuleLoading(true);
    setModuleContent('');
    setModuleError(null);
    try {
      const content = await generateModuleContent(module.name);
      setModuleContent(content);
    } catch (err) {
      setModuleError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsModuleLoading(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedModule(null);
  }, []);

  const handleCorrectAnswer = useCallback((questionId: string) => {
    if (!answeredQuestions.has(questionId)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredQuestions(prevAnswered => {
        const newSet = new Set(prevAnswered);
        newSet.add(questionId);
        return newSet;
      });
    }
  }, [answeredQuestions]);

  if (showWelcome) {
    return <WelcomeAnimation />;
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200">
      <Header score={score} totalQuestions={questions.length} />
      <main className="container mx-auto px-4 py-8">
        <LearningModules modules={LEARNING_MODULES} onModuleSelect={handleModuleSelect} />
        <div className="my-12 border-t border-slate-700"></div>
        <PracticeModule
          onGenerate={handleGenerateQuestions}
          questions={questions}
          isLoading={isLoading}
          error={error}
          onCorrectAnswer={handleCorrectAnswer}
        />
      </main>
      <footer className="text-center py-6 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Learn With PB. All rights reserved.</p>
      </footer>

      <Modal
        isOpen={!!selectedModule}
        onClose={handleCloseModal}
        title={`Learning: ${selectedModule?.name || ''}`}
      >
        {isModuleLoading && (
          <div className="flex justify-center items-center h-64">
             <svg className="animate-spin h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          </div>
        )}
        {moduleError && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md text-center">
                {moduleError}
            </div>
        )}
        {!isModuleLoading && !moduleError && (
          <div
            className="modal-content"
            dangerouslySetInnerHTML={{ __html: moduleContent }}
          />
        )}
      </Modal>
    </div>
  );
};

export default App;