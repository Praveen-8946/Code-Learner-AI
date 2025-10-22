import React from 'react';
import type { LearningModule } from '../types';

interface LearningModulesProps {
  modules: LearningModule[];
  onModuleSelect: (module: LearningModule) => void;
}

const ModuleCard: React.FC<{ module: LearningModule; onSelect: (module: LearningModule) => void }> = ({ module, onSelect }) => (
  <div 
    onClick={() => onSelect(module)}
    className="group bg-slate-800/50 rounded-lg p-6 flex flex-col items-center justify-center text-center border-2 border-slate-700 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(module)}
  >
    <div className="w-16 h-16 mb-4 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
      {module.icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors duration-300">
      {module.name}
    </h3>
  </div>
);

const LearningModules: React.FC<LearningModulesProps> = ({ modules, onModuleSelect }) => {
  return (
    <section>
      <h2 className="text-4xl font-bold text-center mb-8 text-slate-100">Learning Modules</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {modules.map((module) => (
          <ModuleCard key={module.name} module={module} onSelect={onModuleSelect} />
        ))}
      </div>
    </section>
  );
};

export default LearningModules;