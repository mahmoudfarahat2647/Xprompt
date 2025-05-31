import React from 'react';

export type OptimizationModeType = 'REWRITE_PERFECTLY' | 'CLARIFY' | 'SIMPLIFY' | 'EXPAND' | 'SHORTEN';

interface OptimizationModeProps {
  mode: OptimizationModeType;
  onModeChange: (mode: OptimizationModeType) => void;
}

const OptimizationMode: React.FC<OptimizationModeProps> = ({ mode, onModeChange }) => {
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
    </div>
  );
};

export default OptimizationMode;