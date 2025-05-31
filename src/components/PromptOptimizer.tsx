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
  const [optimizationMode, setOptimizationMode] = useState<OptimizationModeType | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('Plain Text');
  const [history, setHistory] = useState<{ input: string; output: string; mode: OptimizationModeType }[]>([]);

  const handleOptimize = async () => {
    if (!inputPrompt.trim()) return;
    if (!optimizationMode) {
      // If no optimization mode is selected, show a message or handle it appropriately
      alert("Please select an optimization mode first");
      return;
    }
    
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
    <div className="max-w-3xl mx-auto card-modern p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Prompt Optimizer
        </h2>
        <div className="space-y-4">
          {/* Category 1: Input Prompt Enhancement Tools */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <OptimizationMode 
                mode={optimizationMode} 
                onModeChange={setOptimizationMode}
                isLoading={isLoading}
                onEnhance={async () => {
                  if (!inputPrompt.trim()) {
                    alert("Please enter a prompt first");
                    return;
                  }
                  if (!optimizationMode) {
                    alert("Please select an optimization mode first");
                    return;
                  }
                  setIsLoading(true);
                  try {
                    const result = await optimizePrompt(inputPrompt, optimizationMode, 'Plain Text');
                    setInputPrompt(result); // Update the input with the enhanced version
                  } catch (error) {
                    console.error('Error enhancing prompt:', error);
                  } finally {
                    setIsLoading(false);
                  }
                }} />
            </div>
          </div>

          {/* Category 2: Output Format Specification */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Recent Optimizations
            </h3>
            <button
              onClick={() => setHistory([])}
              className="text-xs px-3 py-1 rounded-full glass glass-hover text-gray-300 hover:text-white transition-all duration-200 font-medium active:scale-95"
            >
              Clear Recent
            </button>
          </div>
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