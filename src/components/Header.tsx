import React from 'react';
import { Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="mb-10 text-center">
      <div className="flex items-center justify-center mb-2">
        <h1 className="text-4xl font-bold">Prompt Eng</h1>
        <Zap className="ml-2 text-red-500 h-8 w-8" />
      </div>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto">
        An AI agent specialized in crafting clear, concise, and effective prompts 
        to achieve desired outcomes from language models. It helps refine and 
        optimize user queries for maximum precision and impact.
      </p>
    </header>
  );
};

export default Header;