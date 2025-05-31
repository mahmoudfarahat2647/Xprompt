import React, { useRef } from 'react';
import { Copy, Check, Maximize2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { OutputFormat } from './PromptOptimizer';

interface PromptOutputProps {
  optimizedPrompt: string;
  isLoading: boolean;
  copySuccess: boolean;
  onCopy: () => void;
  outputFormat: OutputFormat;
}

const PromptOutput: React.FC<PromptOutputProps> = ({
  optimizedPrompt,
  isLoading,
  copySuccess,
  onCopy,
  outputFormat
}) => {
  const outputRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const formatOutput = (text: string, format: OutputFormat): string => {
    switch (format) {
      case 'JSON':
        try {
          return JSON.stringify(JSON.parse(text), null, 2);
        } catch {
          return JSON.stringify({ content: text }, null, 2);
        }
      case 'XML':
        return `<?xml version="1.0" encoding="UTF-8"?>\n<output>\n  <content>${text}</content>\n</output>`;
      case 'Markdown':
        return `# Optimized Output\n\n${text}`;
      case 'Bulleted List':
        return text.split('\n').map(line => `• ${line}`).join('\n');
      case 'Table':
        return `| Content |\n|----------|\n| ${text} |`;
      default:
        return text;
    }
  };

  const formattedPrompt = optimizedPrompt ? formatOutput(optimizedPrompt, outputFormat) : '';

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          $ OUTPUT.PROMPT <span className="text-gray-400">({outputFormat})</span>
        </span>
        <div className="flex items-center gap-2">
          {optimizedPrompt && (
            <>
              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center text-sm text-gray-400 hover:text-white transition-colors gap-1"
                title="Expand prompt"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={onCopy}
                className="flex items-center text-sm text-gray-400 hover:text-white transition-colors gap-1"
                title="Copy to clipboard"
              >
                {copySuccess ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </>
          )}
        </div>
      </div>
      <div
        ref={outputRef}
        className={`glass rounded-xl p-4 flex-grow font-mono ${
          optimizedPrompt ? 'terminal-output' : 'flex items-center justify-center border-2 border-dashed border-white/10'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.1)',
          maxHeight: '200px',
          overflowY: 'auto'
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="space-y-2">
              <div className="h-2 w-24 bg-white/10 rounded animate-pulse"></div>
              <div className="h-2 w-32 bg-white/10 rounded animate-pulse"></div>
              <div className="h-2 w-28 bg-white/10 rounded animate-pulse"></div>
            </div>
          </div>
        ) : optimizedPrompt ? (
          <div className="whitespace-pre-wrap terminal-text">
            <span className="text-green-400">→</span> {formattedPrompt}
          </div>
        ) : (
          <p className="text-gray-400 text-center">
            <span className="text-yellow-400">$</span> Awaiting prompt optimization...
          </p>
        )}
      </div>

      <Dialog.Root open={isExpanded} onOpenChange={setIsExpanded}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-4xl max-h-[85vh] overflow-y-auto glass rounded-2xl p-6 shadow-xl animate-fade-in">
            <Dialog.Title className="text-2xl font-semibold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Optimized Prompt <span className="text-sm text-gray-400">({outputFormat})</span>
            </Dialog.Title>
            <div className="terminal-output glass rounded-xl p-6 font-mono whitespace-pre-wrap terminal-text">
              <span className="text-green-400">→</span> {formattedPrompt}
            </div>
            <Dialog.Close className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Maximize2 className="h-5 w-5 rotate-45" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default PromptOutput;