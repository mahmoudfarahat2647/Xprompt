import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PromptOptimizer from './components/PromptOptimizer';
import { Menu, X } from 'lucide-react';
import { Agent } from './components/AgentDialog';

// Load agents from localStorage or use initial data
const getInitialAgents = (): Agent[] => {
  const savedAgents = localStorage.getItem('agents');
  if (savedAgents) {
    return JSON.parse(savedAgents);
  }
  return [
    {
      id: '1',
      name: 'Frontend Design & HTML',
      description: 'Helps craft beautiful, functional websites with clean code',
      isActive: false,
      apiProvider: 'Google AI (Gemini)',
      model: 'Gemini 2.5 Flash Preview (05-20)',
      outputFormat: 'Rewrite Perfectly',
      placeholder: 'How can I improve my website design?',
      systemPrompt: 'You are an expert frontend developer...'
    },
    {
      id: '2',
      name: 'Prompt Eng',
      description: 'An AI agent specialized in crafting effective prompts',
      isActive: true,
      apiProvider: 'OpenRouter',
      model: 'deepseek/deepseek-r1-0528-qwen3-8b',
      outputFormat: 'Clarify',
      placeholder: 'Enter your prompt here...',
      systemPrompt: 'You are a prompt engineering expert...'
    }
  ];
};

function App() {
  const [agents, setAgents] = useState(getInitialAgents());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Save agents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('agents', JSON.stringify(agents));
  }, [agents]);

  const handleAgentSelect = (id: string) => {
    setAgents(
      agents.map(agent => ({
        ...agent,
        isActive: agent.id === id
      }))
    );
  };

  const handleCreateAgent = (agentData: Omit<Agent, 'id' | 'isActive'>) => {
    const newAgent: Agent = {
      ...agentData,
      id: Date.now().toString(),
      isActive: false
    };
    setAgents([...agents, newAgent]);
  };

  const handleEditAgent = (id: string, agentData: Omit<Agent, 'id' | 'isActive'>) => {
    setAgents(
      agents.map(agent => 
        agent.id === id ? { ...agent, ...agentData } : agent
      )
    );
  };

  const handleDeleteAgent = (id: string) => {
    setAgents(agents.filter(agent => agent.id !== id));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div 
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />
      
      <div 
        className={`fixed inset-y-0 left-0 w-72 bg-gray-800 z-30 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-4">
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-700"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="pt-12">
          <Sidebar 
            agents={agents} 
            onAgentSelect={handleAgentSelect}
            onCreateAgent={handleCreateAgent}
            onEditAgent={handleEditAgent}
            onDeleteAgent={handleDeleteAgent}
          />
        </div>
      </div>

      <Sidebar 
        agents={agents} 
        onAgentSelect={handleAgentSelect}
        onCreateAgent={handleCreateAgent}
        onEditAgent={handleEditAgent}
        onDeleteAgent={handleDeleteAgent}
      />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <button
          onClick={toggleSidebar}
          className="mb-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <Header />
        <PromptOptimizer />
      </main>
    </div>
  );
}

export default App;