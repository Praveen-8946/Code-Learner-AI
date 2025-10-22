import React from 'react';

interface HeaderProps {
  score: number;
  totalQuestions: number;
}

const Header: React.FC<HeaderProps> = ({ score, totalQuestions }) => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1"></div> {/* Left spacer */}

        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
            Learn With PB
          </h1>
          <p className="text-slate-400 mt-1">Your AI-Powered Learning Companion</p>
        </div>

        <div className="flex-1 text-right">
          {totalQuestions > 0 && (
            <div>
              <span className="text-lg font-semibold text-slate-300">Score</span>
              <p className="text-2xl font-bold text-cyan-400">{score} / {totalQuestions}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;