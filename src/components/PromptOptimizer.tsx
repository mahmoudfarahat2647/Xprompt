import { useState } from 'react';
import PromptInput from './PromptInput';
import PromptOutput from './PromptOutput';
import OptimizationMode, { OptimizationModeType } from './OptimizationMode';
import { optimizePrompt } from '../utils/promptUtils';

export type OutputFormat = 'Plain Text' | 'Markdown' | 'JSON' | 'XML' | 'Bulleted List' | 'Table';

export default function PromptOptimizer() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [optimizationMode, setOptimizationMode] = useState<OptimizationModeType>('REWRITE_PERFECTLY');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('Plain Text');
  const [history, setHistory] = useState<{ input: string; output: string; mode: OptimizationModeType }[]>([]);

  const handleOptimize = async () => {
    if (!inputPrompt.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await optimizePrompt(inputPrompt, optimizationMode, outputFormat);
      setOptimizedPrompt(result);
      
      setHistory(prev => [
        { input: inputPrompt, output: result, mode: optimizationMode },
        ...prev.slice(0, 9)
      ]);
    } catch (error) {
      console.error('Error optimizing prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputPrompt('');
    setOptimizedPrompt('');
  };

  const handleCopy = () => {
    if (optimizedPrompt) {
      navigator.clipboard.writeText(optimizedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="card-modern p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Prompt Optimizer
        </h2>
        <div className="flex flex-col gap-4">
          <OptimizationMode mode={optimizationMode} onModeChange={setOptimizationMode} />
          <div className="flex flex-wrap gap-2">
            {(['Plain Text', 'Markdown', 'JSON', 'XML', 'Bulleted List', 'Table'] as OutputFormat[]).map((format) => (
              <button
                key={format}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                  format === outputFormat
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setOutputFormat(format)}
              >
                {format}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PromptInput
          value={inputPrompt}
          onChange={setInputPrompt}
          onReset={handleReset}
          onSubmit={handleOptimize}
          isLoading={isLoading}
        />
        
        <PromptOutput
          optimizedPrompt={optimizedPrompt}
          isLoading={isLoading}
          copySuccess={copySuccess}
          onCopy={handleCopy}
          outputFormat={outputFormat}
        />
      </div>
      
      {history.length > 0 && (
        <div className="mt-8 animate-fade-in">
          <h3 className="text-lg font-medium mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Recent Optimizations
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {history.map((item, index) => (
              <div 
                key={index} 
                className="glass glass-hover p-3 rounded-xl cursor-pointer animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  setInputPrompt(item.input);
                  setOptimizedPrompt(item.output);
                  setOptimizationMode(item.mode);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate flex-1">{item.input.substring(0, 50)}{item.input.length > 50 ? '...' : ''}</span>
                  <span className="text-xs glass px-2 py-1 rounded-full ml-2">{item.mode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}