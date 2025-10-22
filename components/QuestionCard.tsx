import React, { useState } from 'react';
import type { Question, CodeValidationResult, PracticeLanguage } from '../types';
import { validateCodeAnswer } from '../services/geminiService';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

interface QuestionCardProps {
  question: Question;
  index: number;
  onCorrectAnswer: (questionId: string) => void;
  language: PracticeLanguage;
}

const getPrismLanguage = (language: PracticeLanguage): string => {
  switch (language) {
    case 'C':
    case 'C#':
      return 'clike';
    case 'JavaScript':
      return 'javascript';
    case 'Python':
      return 'python';
    case 'Java':
      return 'java';
    default:
      return 'clike';
  }
};


const QuestionCard: React.FC<QuestionCardProps> = ({ question, index, onCorrectAnswer, language }) => {
  // Common state
  const [showAnswer, setShowAnswer] = useState(false);

  // MCQ state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Code question state
  const [userCode, setUserCode] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeValidationResult, setCodeValidationResult] = useState<CodeValidationResult | null>(null);
  const [codeSubmissionError, setCodeSubmissionError] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    if (selectedOption) return; // Already answered
    setSelectedOption(option);
    if (option === question.correctAnswer) {
      onCorrectAnswer(question.id);
    }
  };

  const getOptionClass = (option: string) => {
    if (selectedOption === null) {
      return 'bg-slate-700 hover:bg-slate-600';
    }

    if (option === question.correctAnswer) {
      return 'bg-green-800/50 ring-2 ring-green-500 cursor-default';
    }
    
    if (option === selectedOption && option !== question.correctAnswer) {
      return 'bg-red-800/50 ring-2 ring-red-500 cursor-default';
    }

    return 'bg-slate-700 cursor-default';
  };
  
  const handleCheckCode = async () => {
    setIsCheckingCode(true);
    setCodeSubmissionError(null);
    setCodeValidationResult(null);

    try {
      const result = await validateCodeAnswer(question.questionText, question.correctAnswer, userCode);
      setCodeValidationResult(result);
      if (result.isCorrect) {
        onCorrectAnswer(question.id);
      }
    } catch (err) {
      setCodeSubmissionError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsCheckingCode(false);
    }
  };

  const getEditorWrapperClass = () => {
    // The base border is in index.html. These classes override the border color.
    if (!codeValidationResult) {
      // On focus, the border turns cyan.
      return 'focus-within:border-cyan-500';
    }
    // After validation, the border is green for correct, red for incorrect.
    return codeValidationResult.isCorrect
      ? 'border-green-500'
      : 'border-red-500';
  };
  
  const prismLanguage = getPrismLanguage(language);

  return (
    <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 shadow-lg">
      <h3 className="font-bold text-lg mb-4 text-cyan-400">
        Question {index}: <span className="text-slate-200">{question.questionText}</span>
      </h3>

      {question.type === 'mcq' && question.options && (
        <div className="space-y-3">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(option)}
              disabled={selectedOption !== null}
              className={`w-full text-left p-3 rounded-md transition-all duration-200 ${getOptionClass(option)}`}
            >
              <span className="font-mono mr-3 text-cyan-400">{String.fromCharCode(65 + i)}.</span>
              {option}
            </button>
          ))}
        </div>
      )}

      {question.type === 'code' && (
        <div>
           <div className={`code-editor-wrapper ${getEditorWrapperClass()}`}>
            <Editor
              value={userCode}
              onValueChange={code => setUserCode(code)}
              highlight={code => Prism.highlight(code, Prism.languages[prismLanguage] || Prism.languages.clike, prismLanguage)}
              padding={12} // Corresponds to p-3
              disabled={isCheckingCode || codeValidationResult?.isCorrect === true}
              textareaClassName="focus:outline-none"
              preClassName="focus:outline-none"
              className="text-slate-100"
              placeholder="Write your code here..."
            />
          </div>
          {codeValidationResult && (
            <div className={`mt-2 text-sm ${codeValidationResult.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {codeValidationResult.feedback}
            </div>
          )}
          {codeSubmissionError && (
            <div className="mt-2 text-sm text-red-400">
              Error: {codeSubmissionError}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end items-center gap-4">
        {question.type === 'code' && (
          <button
            onClick={handleCheckCode}
            disabled={isCheckingCode || codeValidationResult?.isCorrect === true || !userCode.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isCheckingCode && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isCheckingCode ? 'Checking...' : 'Check Answer'}
          </button>
        )}
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm"
        >
          {showAnswer ? 'Hide' : 'Show'} Answer
        </button>
      </div>

      {showAnswer && (
        <div className="mt-4 p-4 bg-slate-900/50 rounded-md border border-slate-600">
          <h4 className="font-semibold text-green-400 mb-2">Correct Answer:</h4>
          <pre className="whitespace-pre-wrap text-sm font-mono bg-transparent text-slate-200">
            <code>{question.correctAnswer}</code>
          </pre>
          {question.explanation && (
            <>
              <h4 className="font-semibold text-sky-400 mt-4 mb-2">Explanation:</h4>
              <p className="text-slate-300 text-sm">{question.explanation}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;