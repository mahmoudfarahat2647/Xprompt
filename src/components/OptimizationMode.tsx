import React from 'react';

export type OptimizationModeType = 'REWRITE_PERFECTLY' | 'CLARIFY' | 'SIMPLIFY' | 'EXPAND' | 'SHORTEN';

interface OptimizationModeProps {
  mode: OptimizationModeType | null;
  onModeChange: (mode: OptimizationModeType) => void;
  onEnhance: () => void;
  isLoading: boolean;
}

const OptimizationMode: React.FC<OptimizationModeProps> = ({ mode, onModeChange, onEnhance, isLoading }) => {
  const modes: OptimizationModeType[] = [
    'REWRITE_PERFECTLY',
    'CLARIFY',
    'SIMPLIFY',
    'EXPAND',
    'SHORTEN'
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {modes.map((currentMode) => (
        <button
          key={currentMode}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
            mode === currentMode
              ? 'bg-red-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => onModeChange(currentMode)}
        >
          {currentMode}
        </button>
      ))}
      <button
        onClick={onEnhance}
        disabled={isLoading}
        className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 
          ${isLoading 
            ? 'bg-yellow-500/50 text-gray-300 cursor-not-allowed' 
            : 'bg-yellow-500 text-white hover:bg-yellow-400 active:scale-95'
          }`}
        title="Enhance prompt using selected mode"
      >
        ⚡
      </button>
    </div>
  );
};

export default OptimizationMode;