import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onReset,
  onSubmit,
  isLoading
}) => {
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setCharCount(newValue.length);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="prompt-input" className="text-sm font-medium text-gray-300">
          Your prompt
        </label>
        <div className="text-xs text-gray-400">{charCount} characters</div>
      </div>
      <textarea
        id="prompt-input"
        className="input-modern resize-none flex-grow mb-4"
        placeholder="Enter your prompt here..."
        value={value}
        onChange={handleChange}
      />
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="btn-modern px-4 py-2 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </button>
        <button
          onClick={onSubmit}
          disabled={isLoading || value.trim().length === 0}
          className={`flex-1 btn-primary px-4 py-2 rounded-xl ${
            isLoading || value.trim().length === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isLoading ? 'Optimizing...' : 'Optimize Prompt'}
        </button>
      </div>
    </div>
  );
};

export default PromptInput