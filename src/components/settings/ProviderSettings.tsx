import React, { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Switch from '@radix-ui/react-switch';
import { Check, ChevronDown, ChevronUp, Save } from 'lucide-react';

const PROVIDERS = {
  gemini: {
    name: 'Google Gemini',
    models: [
      'gemini-2.5-flash-preview-05-20',
      'gemini-2.5-pro-preview-05-06',
      'gemini-2.5-flash-preview-04-17',
      'gemini-pro',
      'gemini-pro-vision'
    ],
    requiresApiKey: true,
  },
  openrouter: {
    name: 'OpenRouter',
    models: [
      'deepseek/deepseek-r1-0528-qwen3-8b',
      'google/gemini-2.5-flash-preview-05-20',
      'deepseek/deepseek-r1-0528',
      'openai/gpt-4-turbo',
      'openai/gpt-4',
      'openai/gpt-3.5-turbo',
      'anthropic/claude-3-opus',
      'anthropic/claude-3-sonnet',
      'anthropic/claude-2',
      'meta/llama-2-70b-chat',
      'google/gemini-pro',
      'mistral/mistral-large',
      'mistral/mistral-medium'
    ],
    requiresApiKey: true,
  },
  anthropic: {
    name: 'Anthropic',
    models: [
      'claude-3-opus',
      'claude-3-sonnet',
      'claude-2.1',
      'claude-2.0',
      'claude-instant'
    ],
    requiresApiKey: true,
  },
  openai: {
    name: 'OpenAI',
    models: [
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
      'dall-e-3',
      'dall-e-2'
    ],
    requiresApiKey: true,
  }
};

const ProviderSettings = () => {
  // Load saved settings from localStorage
  const loadSavedSettings = () => {
    const savedSettings = localStorage.getItem('providerSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setActiveProviders(parsed.activeProviders);
      setApiKeys(parsed.apiKeys);
      setSelectedModels(parsed.selectedModels);
    }
  };

  const [activeProviders, setActiveProviders] = useState({
    gemini: false,
    openrouter: false,
    anthropic: false,
    openai: false
  });

  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    openrouter: '',
    anthropic: '',
    openai: ''
  });

  const [selectedModels, setSelectedModels] = useState({
    gemini: PROVIDERS.gemini.models[0],
    openrouter: PROVIDERS.openrouter.models[0],
    anthropic: PROVIDERS.anthropic.models[0],
    openai: PROVIDERS.openai.models[0]
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load settings on component mount
  useEffect(() => {
    loadSavedSettings();
  }, []);

  const handleProviderToggle = (provider: keyof typeof PROVIDERS) => {
    setActiveProviders(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const handleModelSelect = (provider: string, model: string) => {
    setSelectedModels(prev => ({
      ...prev,
      [provider]: model
    }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    
    // Save to localStorage
    const settings = {
      activeProviders,
      apiKeys,
      selectedModels
    };
    localStorage.setItem('providerSettings', JSON.stringify(settings));
    
    // Show saved status briefly
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-200">AI Providers</h3>
        <button
          onClick={handleSave}
          className={`btn-modern px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
            saveStatus === 'saved' ? 'bg-green-500/20 text-green-400' : ''
          }`}
        >
          <Save className="h-4 w-4" />
          {saveStatus === 'saving' ? 'Saving...' : 
           saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
      
      {Object.entries(PROVIDERS).map(([providerId, provider]) => (
        <div key={providerId} className="glass rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor={`${providerId}-toggle`} className="font-medium">
              {provider.name}
            </label>
            <Switch.Root
              id={`${providerId}-toggle`}
              checked={activeProviders[providerId as keyof typeof activeProviders]}
              onCheckedChange={() => handleProviderToggle(providerId as keyof typeof PROVIDERS)}
              className="w-11 h-6 bg-gray-700 rounded-full relative data-[state=checked]:bg-red-500 transition-colors"
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </div>

          {activeProviders[providerId as keyof typeof activeProviders] && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKeys[providerId as keyof typeof apiKeys]}
                  onChange={(e) => handleApiKeyChange(providerId, e.target.value)}
                  className="input-modern h-10"
                  placeholder={`Enter your ${provider.name} API key`}
                />
                <p className="mt-1 text-xs text-gray-400">
                  This key is stored locally and only used to make API requests from this session.
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Default Model
                </label>
                <Select.Root
                  value={selectedModels[providerId as keyof typeof selectedModels]}
                  onValueChange={(value) => handleModelSelect(providerId, value)}
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
                        {provider.models.map((model) => (
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

                      <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white/5 cursor-default">
                        <ChevronDown className="h-4 w-4" />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProviderSettings;