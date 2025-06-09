import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { X, Check, ChevronDown, ChevronUp } from 'lucide-react';

export interface Agent {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  apiProvider: string;
  model: string;
  outputFormat: string;
  placeholder: string;
  systemPrompt: string;
}

interface AgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent?: Agent;
  onSave: (agent: Omit<Agent, 'id' | 'isActive'>) => void;
  title?: string;
}

const OUTPUT_FORMATS = [
  'Plain Text',
  'Markdown',
  'JSON', 
  'XML',
  'Bulleted List',
  'Table'
];

const PROVIDERS = {
  'Google AI (Gemini)': [
    'Gemini 2.5 Flash Preview (05-20)',
    'Gemini 2.5 Pro Preview (05-06)',
    'Gemini 2.5 Flash Preview (04-17)',
  ],
  'OpenRouter': [
    'deepseek/deepseek-r1-0528-qwen3-8b',
    'google/gemini-2.5-flash-preview-05-20',
    'deepseek/deepseek-r1-0528',
  ]
};

const AgentDialog: React.FC<AgentDialogProps> = ({
  open,
  onOpenChange,
  agent,
  onSave,
  title = 'Create Agent'
}) => {
  const [formData, setFormData] = useState({
    name: agent?.name || '',
    description: agent?.description || '',
    apiProvider: agent?.apiProvider || Object.keys(PROVIDERS)[0],
    model: agent?.model || PROVIDERS[Object.keys(PROVIDERS)[0]][0],
    outputFormat: agent?.outputFormat || OUTPUT_FORMATS[0],
    placeholder: agent?.placeholder || '',
    systemPrompt: agent?.systemPrompt || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl max-h-[85vh] overflow-y-auto glass rounded-2xl p-6 shadow-xl animate-fade-in">
          <Dialog.Title className="text-2xl font-semibold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Agent Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-modern h-10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Output Format
                </label>
                <Select.Root
                  value={formData.outputFormat}
                  onValueChange={(value) => setFormData({ ...formData, outputFormat: value })}
                >
                  <Select.Trigger className="input-modern h-10 flex items-center justify-between">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4" />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content className="glass rounded-xl overflow-hidden shadow-xl animate-fade-in z-50">
                      <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white/5 cursor-default">
                        <ChevronUp className="h-4 w-4" />
                      </Select.ScrollUpButton>
                      
                      <Select.Viewport>
                        {OUTPUT_FORMATS.map((format) => (
                          <Select.Item
                            key={format}
                            value={format}
                            className="relative flex items-center px-8 py-2 text-sm text-gray-200 outline-none hover:bg-white/10 cursor-pointer data-[highlighted]:bg-white/10"
                          >
                            <Select.ItemText>{format}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-2 flex items-center justify-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>

                      <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white/5 cursor-default">
                        <ChevronDown className="h-4 w-4" />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Provider <span className="text-red-500">*</span>
                </label>
                <Select.Root
                  value={formData.apiProvider}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      apiProvider: value,
                      model: PROVIDERS[value as keyof typeof PROVIDERS][0]
                    });
                  }}
                >
                  <Select.Trigger className="input-modern h-10 flex items-center justify-between">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4" />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content className="glass rounded-xl overflow-hidden shadow-xl animate-fade-in z-50">
                      <Select.Viewport>
                        {Object.keys(PROVIDERS).map((provider) => (
                          <Select.Item
                            key={provider}
                            value={provider}
                            className="relative flex items-center px-8 py-2 text-sm text-gray-200 outline-none hover:bg-white/10 cursor-pointer data-[highlighted]:bg-white/10"
                          >
                            <Select.ItemText>{provider}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-2 flex items-center justify-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <Select.Root
                  value={formData.model}
                  onValueChange={(value) => setFormData({ ...formData, model: value })}
                >
                  <Select.Trigger className="input-modern h-10 flex items-center justify-between">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDown className="h-4 w-4" />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content className="glass rounded-xl overflow-hidden shadow-xl animate-fade-in z-50">
                      <Select.Viewport>
                        {PROVIDERS[formData.apiProvider as keyof typeof PROVIDERS].map((model) => (
                          <Select.Item
                            key={model}
                            value={model}
                            className="relative flex items-center px-8 py-2 text-sm text-gray-200 outline-none hover:bg-white/10 cursor-pointer data-[highlighted]:bg-white/10"
                          >
                            <Select.ItemText>{model}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-2 flex items-center justify-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Agent Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-modern min-h-[100px]"
                placeholder="Describe what this agent does..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Input Box Placeholder Text
              </label>
              <textarea
                value={formData.placeholder}
                onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                className="input-modern min-h-[80px]"
                placeholder="e.g., How can I improve the UX of my e-commerce checkout page?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Instructions / System Prompt <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                className="input-modern min-h-[150px]"
                placeholder="Define the agent's behavior and expertise..."
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="btn-modern px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-2 rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </form>

          <Dialog.Close className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AgentDialog;