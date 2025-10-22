import React from 'react';

const WelcomeAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50 animate-fade-out">
      <div className="text-center animate-fade-in-scale">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
          Learn With PB
        </h1>
        <p className="text-slate-400 mt-4 text-lg md:text-2xl">
          Your AI-Powered Learning Companion
        </p>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
