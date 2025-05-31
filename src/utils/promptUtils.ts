import { OptimizationModeType } from '../components/OptimizationMode';
import { OutputFormat } from '../components/PromptOptimizer';

// Simulated prompt optimization function
// In a real app, this would call an API endpoint
export const optimizePrompt = async (
  prompt: string,
  mode: OptimizationModeType,
  format: OutputFormat
): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let result = '';
  switch (mode) {
    case 'REWRITE_PERFECTLY':
      result = rewritePerfectly(prompt);
      break;
    case 'CLARIFY':
      result = clarifyPrompt(prompt);
      break;
    case 'SIMPLIFY':
      result = simplifyPrompt(prompt);
      break;
    case 'EXPAND':
      result = expandPrompt(prompt);
      break;
    case 'SHORTEN':
      result = shortenPrompt(prompt);
      break;
    default:
      result = prompt;
  }

  return result;
};

// Example optimization functions
const rewritePerfectly = (prompt: string): string => {
  // This is a placeholder for actual optimization logic
  const improved = prompt
    .trim()
    .replace(/^(create|make|generate)/i, 'Design and implement')
    .replace(/good|nice|great/gi, 'professional and polished')
    .replace(/website/gi, 'web application')
    .replace(/app/gi, 'application');
    
  return `${improved}\n\nPlease ensure the result is visually appealing, fully functional, and follows modern design principles. Include responsive layouts and accessibility features.`;
};

const clarifyPrompt = (prompt: string): string => {
  return `I need you to create exactly what I describe below, with no additions or omissions:\n\n${prompt}\n\nPlease confirm your understanding before proceeding.`;
};

const simplifyPrompt = (prompt: string): string => {
  // Remove filler words and simplify language
  return prompt
    .replace(/please|kindly|if you could/gi, '')
    .replace(/I would like|I want|I need/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const expandPrompt = (prompt: string): string => {
  return `${prompt}\n\nFor this task, please:\n- Follow modern best practices\n- Provide detailed documentation\n- Ensure code quality and maintainability\n- Implement proper error handling\n- Consider edge cases and accessibility`;
};

const shortenPrompt = (prompt: string): string => {
  // Create a shorter version by focusing on key points
  const words = prompt.split(' ');
  if (words.length <= 15) return prompt;
  
  // Extract what seems to be the main instruction
  return words.slice(0, 15).join(' ') + '...';
};