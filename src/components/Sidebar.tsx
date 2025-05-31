import React, { useState } from 'react';
import { Edit, Plus, Settings, Trash2 } from 'lucide-react';
import SettingsDialog from './settings/SettingsDialog';
import AgentDialog, { Agent } from './AgentDialog';

interface SidebarProps {
  agents: Agent[];
  onAgentSelect: (id: string) => void;
  onCreateAgent: (agent: Omit<Agent, 'id' | 'isActive'>) => void;
  onEditAgent: (id: string, agent: Omit<Agent, 'id' | 'isActive'>) => void;
  onDeleteAgent: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  agents, 
  onAgentSelect,
  onCreateAgent,
  onEditAgent,
  onDeleteAgent
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>();

  return (
    <>
      <aside className="w-0 lg:w-72 bg-gray-800 p-6 flex-shrink-0 hidden lg:flex flex-col justify-between transition-all duration-300 ease-in-out">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Agents</h1>
            <button 
              className="btn-modern p-2 rounded-lg"
              onClick={() => {
                setEditingAgent(undefined);
                setIsAgentDialogOpen(true);
              }}
              aria-label="Create agent"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-3">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => onAgentSelect(agent.id)}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  agent.isActive ? 'bg-red-500 text-white' : 'hover:bg-gray-700'
                }`}
              >
                <div className="min-w-0 flex-1 text-left">
                  <h2 className="font-medium truncate">{agent.name}</h2>
                  <p className={`text-sm ${agent.isActive ? 'text-white/90' : 'text-gray-400'} truncate`}>
                    {agent.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <button 
                    className={`p-1 rounded hover:bg-black/20 transition-colors ${
                      agent.isActive ? 'text-white' : 'text-gray-400'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAgent(agent);
                      setIsAgentDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className={`p-1 rounded hover:bg-black/20 transition-colors ${
                      agent.isActive ? 'text-white' : 'text-gray-400'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAgent(agent.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </button>
            ))}
          </nav>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors text-left mt-4"
        >
          <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="truncate">Global Settings</span>
        </button>
      </aside>

      <SettingsDialog 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />

      <AgentDialog
        open={isAgentDialogOpen}
        onOpenChange={setIsAgentDialogOpen}
        agent={editingAgent}
        onSave={(agentData) => {
          if (editingAgent) {
            onEditAgent(editingAgent.id, agentData);
          } else {
            onCreateAgent(agentData);
          }
          setIsAgentDialogOpen(false);
        }}
        title={editingAgent ? 'Edit Agent' : 'Create Agent'}
      />
    </>
  );
};

export default Sidebar;